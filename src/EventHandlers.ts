import {
  AmertisRouter,
  Swap,
  Account,
  Token,
} from "generated";
import { getTokenData } from "./utils";

AmertisRouter.AmertisSwap.handlerWithLoader({
  loader: async ({ event, context }) => {

    const [account, tokenIn, tokenOut] = await Promise.all([
      context.Account.get(event.transaction.from as string),
      context.Token.get(event.params._tokenIn as string),
      context.Token.get(event.params._tokenOut as string),
    ]);

    return { account, tokenIn, tokenOut };
  },
  handler: async ({ event, context, loaderReturn }) => {

    if (!loaderReturn.account) {
      const entity: Account = {
        id: event.transaction.from as string,
      };
      context.Account.set(entity);
    }

    if (!loaderReturn.tokenIn) {

      const tokenData = await getTokenData(event.params._tokenIn as `0x${string}`);

      const entity: Token = {
        id: event.params._tokenIn as string,
        symbol: tokenData?.symbol as string,
        name: tokenData?.name as string,
        decimals: tokenData?.decimals as unknown as bigint,
      };
      context.Token.set(entity);
    }

    if (!loaderReturn.tokenOut) {
      const tokenData = await getTokenData(event.params._tokenOut as `0x${string}`);
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
    };
    context.Swap.set(entity);
  },
});


