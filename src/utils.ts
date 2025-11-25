import { createPublicClient, http, erc20Abi } from "viem";
import { monad } from "viem/chains";
import { S, createEffect } from "envio";

export const client = createPublicClient({
  chain: monad,
  transport: http((monad.rpcUrls.default as any)[0], { batch: true }),
});

// Define an effect for external token data calls
export const getTokenDataEffect = createEffect(
  {
    name: "getTokenData",
    input: S.string,
    output: {
      symbol: S.string,
      name: S.string,
      decimals: S.bigint,
    },
    rateLimit: false,
    cache: true,
  },
  async ({ input }: { input: { address: `0x${string}` } }) => {
    try {
      const data = await client.multicall({
        contracts: [
          {
            abi: erc20Abi,
            address: input.address as `0x${string}`,
            functionName: "symbol",
          },
          {
            abi: erc20Abi,
            address: input.address as `0x${string}`,
            functionName: "name",
          },
          {
            abi: erc20Abi,
            address: input.address as `0x${string}`,
            functionName: "decimals",
          },
        ],
        multicallAddress:
          "0xcA11bde05977b3631167028862bE2a173976CA11" as `0x${string}`,
      });

      const [symbol, name, decimals] = data;
      return {
        symbol: symbol.result as string,
        name: name.result as string,
        decimals: decimals.result as unknown as bigint,
      };
    } catch (error) {
      console.error(error);
      return {
        symbol: "",
        name: "",
        decimals: 0n,
      };
    }
  }
);

// // Keep the original function for backward compatibility if needed
// export const getTokenData = async (address: `0x${string}`) => {
//   try {
//     const data = await client.multicall({
//       contracts: [
//         {
//           abi: erc20Abi,
//           address,
//           functionName: "symbol",
//         },
//         {
//           abi: erc20Abi,
//           address,
//           functionName: "name",
//         },
//         {
//           abi: erc20Abi,
//           address,
//           functionName: "decimals",
//         },
//       ],
//       multicallAddress:
//         "0xcA11bde05977b3631167028862bE2a173976CA11" as `0x${string}`,
//     });

//     const [symbol, name, decimals] = data;
//     const tokenData = {
//       symbol: symbol.result,
//       name: name.result,
//       decimals: decimals.result,
//     };
//     return tokenData;
//   } catch (error) {
//     console.error(error);
//   }
// };
