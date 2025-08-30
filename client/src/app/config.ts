import { http, createConfig } from "wagmi"
import { mainnet, base } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"
import { defineChain } from "viem"

export const monadTestnet = defineChain({
  id: 20143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"], 
    },
  },
})

export const localhost = defineChain({
  id: 1337,
  name: "Localhost",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"], 
    },
  },
})

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "9d44f91261b2ccf77d2a554323358b43"

export const config = createConfig({
  chains: [localhost, monadTestnet, mainnet, base],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [monadTestnet.id]: http(monadTestnet.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})
