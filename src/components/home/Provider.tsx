"use client";

import { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import { Chain, http } from "viem";
import { WagmiProvider, createConfig } from "wagmi";
import {
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  polygonMumbai,
  filecoinCalibration,
  arbitrumSepolia, // ✅ Import Arbitrum Sepolia
} from "wagmi/chains";
import { embeddedWallet } from "@civic/auth-web3/wagmi";
import Navbar from "./navbar";
import { ConfettiProvider } from "@/providers/ConfettiProvider";

// ✅ Define all supported chains
export const supportedChains = [
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  polygonMumbai,
  filecoinCalibration,
  arbitrumSepolia, // ✅ Added here
] as [Chain, ...Chain[]];

// ✅ Setup RPC transports for each chain
const wagmiConfig = createConfig({
  chains: supportedChains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygonMumbai.id]: http(),
    [filecoinCalibration.id]: http(),
    [arbitrumSepolia.id]: http(), // ✅ Register RPC transport
  },
  connectors: [embeddedWallet()],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
    },
  },
});

type ProvidersProps = PropsWithChildren<{
  onSessionEnd?: () => void;
}>;

const Provider: FC<ProvidersProps> = ({ children }) => {
  return (
    <ConfettiProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <CivicAuthProvider
            clientId="7ed6d5cd-300f-415c-bcc0-69c399ec465d"
            initialChain={sepolia} // ✅ You can set to arbitrumSepolia if needed
            config={{
              oauthServer: 'https://auth.civic.com'
            }}
          >
            {children}
          </CivicAuthProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ConfettiProvider>
  );
};

export default Provider;
