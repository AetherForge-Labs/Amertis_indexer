import { createPublicClient, http, Chain } from "viem";

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
