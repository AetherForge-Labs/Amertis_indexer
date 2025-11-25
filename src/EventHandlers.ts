import { AmertisRouter, Swap, Account, Token } from "generated";
import { getTokenDataEffect } from "./utils";
import { zeroAddress } from "viem";

const mon: Token = {
  id: zeroAddress,
  symbol: "MON",
  name: "Monad",
  decimals: 18n,
};

AmertisRouter.AmertisSwap.handler(async ({ event, context }) => {
  // Initialize monad token to db
  context.Token.set(mon);

  // Check if entities already exist
  const [account, tokenIn, tokenOut] = await Promise.all([
    context.Account.get(event.transaction.from as string),
    context.Token.get(event.params._tokenIn as string),
    context.Token.get(event.params._tokenOut as string),
  ]);

  if (!account) {
    const entity: Account = {
      id: event.transaction.from as string,
    };
    context.Account.set(entity);
  }

  if (!tokenIn) {
    const tokenData = await context.effect(getTokenDataEffect, {
      address: event.params._tokenIn as `0x${string}`,
    });

    const entity: Token = {
      id: event.params._tokenIn as string,
      symbol: tokenData.symbol,
      name: tokenData.name,
      decimals: tokenData.decimals,
    };
    context.Token.set(entity);
  }

  if (!tokenOut) {
    const tokenData = await context.effect(getTokenDataEffect, {
      address: event.params._tokenOut as `0x${string}`,
    });

    const entity: Token = {
      id: event.params._tokenOut as string,
      symbol: tokenData?.symbol,
      name: tokenData?.name,
      decimals: tokenData.decimals,
    };
    context.Token.set(entity);
  }

  const entity: Swap = {
    id: event.transaction.hash,
    from: event.transaction.from as string,
    _tokenIn: event.params._tokenIn,
    _tokenOut: event.params._tokenOut,
    _amountIn: event.params._amountIn,
    _amountOut: event.params._amountOut,
    timeStamp: BigInt(event.block.timestamp),
    tokenInDetails_id: event.params._tokenIn as string,
    tokenOutDetails_id: event.params._tokenOut as string,
  };
  context.Swap.set(entity);
});
