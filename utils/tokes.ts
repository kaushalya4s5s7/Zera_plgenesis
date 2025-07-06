// @/utils/tokes.ts

// This enum must contain ALL chain IDs for which you want to display token balances
export type SupportedChainId = 1 | 11155111 | 42161 | 137 | 8453 | 314159 | 421614; // Added Arbitrum Sepolia

// Define a type for a single token
interface Token {
  address: `0x${string}` | "native"; // Allow native token
  symbol: string;
  decimals: number;
}

// Map chain IDs to arrays of tokens
export const tokensByChain: Record<SupportedChainId, Token[]> = {
  1: [
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", decimals: 18 },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", decimals: 6 },
    { address: "0x4F9233633C1488c9735d48123284000490b4352f", symbol: "XYZ", decimals: 9 },
  ],
  11155111: [
    { address: "0x2e5221B0f855Be4ea5Cefffb8311EED0563B6e87", symbol: "SEP_DAI", decimals: 18 },
    { address: "0x94a9D9c87858c279F88f28c2f1fD339f42B3f009", symbol: "USDC", decimals: 6 },
  ],
  42161: [
    { address: "0xFd086bc7Ab247c525fB55e2C87ad36d1f99C53D7", symbol: "USDT", decimals: 6 },
    { address: "0xAF88D065Ec65c52370425a7EaedD672c2B527E6A", symbol: "USDC", decimals: 6 },
  ],
  137: [
    { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT", decimals: 6 },
    { address: "0x2791Bca1f2de4661ED88A30C99A7a9214Ef89bc7", symbol: "USDC", decimals: 6 },
  ],
  8453: [
    { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", decimals: 6 },
  ],
  314159: [
    { address: "0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0", symbol: "USDFC", decimals: 6 },
    { address: "0x0000000000000000000000000000000000000000", symbol: "tFIL", decimals: 18 },
  ],
  421614: [ // ✅ Arbitrum Sepolia Testnet
    {
      address: "native", // Native ETH (Arbitrum Sepolia ETH)
      symbol: "ETH",
      decimals: 18,
    },
    {
      address: "0x3FfC1d06aC3e790a36aB6315C7a1328e30fD5280", // USDC on Arbitrum Sepolia (confirmed)
      symbol: "USDC",
      decimals: 6,
    },
    {
      address: "0xAFB26E1e8A1934269C57713899c34b62Fb0Ff07f", // WETH on Arbitrum Sepolia (example)
      symbol: "WETH",
      decimals: 18,
    },
  ],
};
