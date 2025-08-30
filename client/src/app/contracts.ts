export const CONTRACT_CONFIG = {
  // This will be updated with actual deployed address
  PAYMENT_RECEIVER_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
  USDC: {
    address: "0xA0b86a33E6411CFf96b9C98E23bD7b3f54f7dea2", // Example address
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6
  },
  USDT: {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Example address  
    symbol: "USDT",
    name: "Tether",
    decimals: 6
  }
} as const;
