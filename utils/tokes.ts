// src/utils/tokes.ts

// This enum must contain ALL chain IDs for which you want to display token balances
// Make sure these IDs match the 'id' property of the chain objects imported from 'wagmi/chains'
// in your wagmi.config.ts or wherever you define your Wagmi client chains.
export type SupportedChainId = 1 | 11155111 | 42161 | 137 | 8453 | 314159; // Added Filecoin Calibration Testnet ID

// Define a type for a single token
interface Token {
  address: `0x${string}`; // Use `0x${string}` for better type safety
  symbol: string;
  decimals: number;
}

// Map chain IDs to arrays of tokens
export const tokensByChain: Record<SupportedChainId, Token[]> = {
  1: [ // Ethereum Mainnet
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      symbol: "DAI",
      decimals: 18,
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
      symbol: "USDC",
      decimals: 6,
    },
    {
      address: "0x4F9233633C1488c9735d48123284000490b4352f", // Example: Some other token on Mainnet
      symbol: "XYZ",
      decimals: 9,
    },
  ],
  11155111: [ // Sepolia Testnet
    {
      address: "0x2e5221B0f855Be4ea5Cefffb8311EED0563B6e87", // Example: Replace with a real Sepolia token address you have access to
      symbol: "SEP_DAI", // Example symbol
      decimals: 18,
    },
    {
      address: "0x94a9D9c87858c279F88f28c2f1fD339f42B3f009", // Example: USDC on Sepolia (actual address may vary, verify!)
      symbol: "USDC",
      decimals: 6,
    },
  ],
  42161: [ // Arbitrum One Mainnet (example)
    {
      address: "0xFd086bc7Ab247c525fB55e2C87ad36d1f99C53D7", // USDT on Arbitrum One
      symbol: "USDT",
      decimals: 6,
    },
    {
      address: "0xAF88D065Ec65c52370425a7EaedD672c2B527E6A", // USDC on Arbitrum One
      symbol: "USDC",
      decimals: 6,
    },
  ],
  137: [ // Polygon Mainnet (example)
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT on Polygon
      symbol: "USDT",
      decimals: 6,
    },
    {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9214Ef89bc7", // USDC on Polygon
      symbol: "USDC",
      decimals: 6,
    },
  ],
  8453: [ // Base Mainnet (example)
    {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
      symbol: "USDC",
      decimals: 6,
    },
    // Add more tokens for Base if needed
  ],
  314159: [ // Filecoin Calibration Testnet (NEW ENTRY)
    {
      address: "0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0", // USDFC on Filecoin Calibration Testnet (Common address)
      symbol: "USDFC",
      decimals: 6, // USDFC typically has 6 decimals
    },
    
    {
      address: "0x0000000000000000000000000000000000000000", // Placeholder for tFIL - Native token doesn't always have a standard ERC-20 address in this context
      symbol: "tFIL",
      decimals: 18,
    }
    // Add other tokens for Filecoin Calibration if needed
  ],
  // Add more chain IDs and their respective tokens here based on your Wagmi config
};