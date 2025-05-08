import { Mint, LetterFromOlympus } from "generated";
import { zeroAddress } from "viem";

LetterFromOlympus.Transfer.handler(
	async ({ event, context }) => {
		const mint: Mint = {
			id: event.params.tokenId.toString(),
			owner: event.params.to,
		};

		context.Mint.set(mint);
	},
	{
		eventFilters: { from: zeroAddress },
	}
);
