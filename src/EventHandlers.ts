import {
  AmertisRouter,
  Swap,
  Account,
} from "generated";


AmertisRouter.AmertisSwap.handlerWithLoader({
  loader: async ({ event, context }) => {
    const account = await context.Account.get(event.transaction.from as string);
    return { account };
  },
  handler: async ({ event, context, loaderReturn }) => {

    if (!loaderReturn.account) {
      const entity: Account = {
        id: event.transaction.from as string,
      };
      context.Account.set(entity);
    }

    const entity: Swap = {
      id: event.transaction.hash,
      _tokenIn: event.params._tokenIn,
      _tokenOut: event.params._tokenOut,
      _amountIn: event.params._amountIn,
      _amountOut: event.params._amountOut,
      from: event.transaction.from as string,
      timeStamp: event.block.timestamp as unknown as bigint,
    };
    context.Swap.set(entity);
  },
});


