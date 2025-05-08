import { createPublicClient, http, Chain, erc20Abi } from "viem";

const monad: Chain = {
	id: 10143,
	name: "Monad",
	nativeCurrency: {
		name: "Monad",
		symbol: "MONAD",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ["https://testnet-rpc.monad.xyz"],
		},
	},
};

export const client = createPublicClient({
	chain: monad,
	transport: http(),
});

export const getTokenData = async (address: `0x${string}`) => {
	try {
		const data = await client.multicall({
			contracts: [
				{
					abi: erc20Abi,
					address,
					functionName: "symbol",
				},
				{
					abi: erc20Abi,
					address,
					functionName: "name",
				},
				{
					abi: erc20Abi,
					address,
					functionName: "decimals",
				},
			],
			multicallAddress:
				"0xcA11bde05977b3631167028862bE2a173976CA11" as `0x${string}`,
		});

		const [symbol, name, decimals] = data;
		const tokenData = {
			symbol: symbol.result,
			name: name.result,
			decimals: decimals.result,
		};
		return tokenData;
	} catch (error) {
		console.error(error);
	}
};
