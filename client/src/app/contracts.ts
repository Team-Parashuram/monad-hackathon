  export const CONTRACT_CONFIG = {
    PAYMENT_RECEIVER_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    PAYMENT_RECEIVER_ABI: [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "merchant",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "payer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "PaymentReceived",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "merchant",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "pay",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ]
  } as const;

  // Common tokens for testing
  export const COMMON_TOKENS = {
    ETH: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18
    },
    MON: {
      address: "0x0000000000000000000000000000000000000000", // Native MON on Monad
      symbol: "MON", 
      name: "Monad",
      decimals: 18
    },
    USDC: {
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // Monad Testnet USDC
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6
    },
    USDT: {
      address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D", // Monad Testnet USDT
      symbol: "USDT",
      name: "Tether",
      decimals: 6
    },
    WETH: {
      address: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37", // Monad Testnet WETH
      symbol: "WETH",
      name: "Wrapped Ethereum", 
      decimals: 18
    }
  } as const;
