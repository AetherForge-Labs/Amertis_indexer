import { AmertisRouter, Swap, Account, Token, GlobalData } from "generated";
import { dayTimestamp, getTokenData } from "./utils";
import { zeroAddress } from "viem";

const globalID: "global" = "global";

const mon: Token = {
  id: zeroAddress,
  symbol: "MON",
  name: "Monad",
  decimals: 18n,
};

const globalData: GlobalData = {
  id: globalID,
  totalTx: 0n,
  totalVolume: 0n,
  totalWallets: 0n,
};

AmertisRouter.AmertisSwap.handlerWithLoader({
  loader: async ({ event, context }) => {
    // midnight timestamp
    const midnight = dayTimestamp();

    const [account, tokenIn, tokenOut, globalData, dailyData] =
      await Promise.all([
        context.Account.get(event.transaction.from as string),
        context.Token.get(event.params._tokenIn as string),
        context.Token.get(event.params._tokenOut as string),
        context.GlobalData.get(globalID),
        context.DailyData.get(midnight.toString()),
      ]);

    return { account, tokenIn, tokenOut, globalData, dailyData };
  },
  handler: async ({ event, context, loaderReturn }) => {
    // midnight timestamp
    const midnight = dayTimestamp();

    // initialize monad token to db
    context.Token.set(mon);

    // inititalize global data to db if not available
    if (!loaderReturn.globalData) {
      context.GlobalData.set(globalData);
    }

    // initialise dailyData if not available
    if (!loaderReturn.dailyData) {
      context.DailyData.set({
        id: midnight.toString(),
        tx: 0n,
        volume: 0n,
      });
    }
    // --- Populate global data ---
    const _globalData = loaderReturn.globalData;

    const totalTx = (_globalData?.totalTx ?? 0n) + 1n;
    const totalVolume =
      (_globalData?.totalVolume ?? 0n) + (event.params.tokenValueUSD ?? 0n);

    // Increment wallet count only if account is new
    const totalWallets = !loaderReturn.account
      ? (_globalData?.totalWallets ?? 0n) + 1n
      : _globalData?.totalWallets ?? 0n;

    context.GlobalData.set({
      id: _globalData?.id ?? "global", // default id for global data
      totalTx,
      totalVolume,
      totalWallets,
    });

    // --- Populate daily data ---
    const _dailyData = loaderReturn.dailyData;
    if (event.block.timestamp > midnight) {
      const dailyTx = (_dailyData?.tx ?? 0n) + 1n;
      const dailyVolume =
        (_dailyData?.volume ?? 0n) + (event.params.tokenValueUSD ?? 0n);

      context.DailyData.set({
        id: midnight.toString(),
        tx: dailyTx,
        volume: dailyVolume,
      });
    }

    // populate user table
    if (!loaderReturn.account) {
      const entity: Account = {
        id: event.transaction.from as string,
        points: 0n,
      };
      context.Account.set(entity);
    }

    // populate token table with token In
    if (!loaderReturn.tokenIn) {
      const tokenData = await getTokenData(
        event.params._tokenIn as `0x${string}`
      );

      const entity: Token = {
        id: event.params._tokenIn as string,
        symbol: tokenData?.symbol as string,
        name: tokenData?.name as string,
        decimals: tokenData?.decimals as unknown as bigint,
      };
      context.Token.set(entity);
    }

    // p
    if (!loaderReturn.tokenOut) {
      const tokenData = await getTokenData(
        event.params._tokenOut as `0x${string}`
      );
      const entity: Token = {
        id: event.params._tokenOut as string,
        symbol: tokenData?.symbol as string,
        name: tokenData?.name as string,
        decimals: tokenData?.decimals as unknown as bigint,
      };
      context.Token.set(entity);
    }

    const entity: Swap = {
      id: event.transaction.hash,
      _tokenIn: event.params._tokenIn,
      _tokenOut: event.params._tokenOut,
      _amountIn: event.params._amountIn,
      _amountOut: event.params._amountOut,
      from: event.transaction.from as string,
      timeStamp: event.block.timestamp as unknown as bigint,
      tokenInDetails_id: event.params._tokenIn as string,
      tokenOutDetails_id: event.params._tokenOut as string,
      points: 0n,
      value: event.params.tokenValueUSD,
    };
    context.Swap.set(entity);
  },
});
