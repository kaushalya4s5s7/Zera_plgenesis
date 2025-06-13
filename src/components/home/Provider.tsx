"use client";

import { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import { Chain, http } from "viem";
import { WagmiProvider, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { embeddedWallet } from "@civic/auth-web3/wagmi";
import Navbar from "./navbar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
    },
  },
});

export const supportedChains = [mainnet, sepolia] as [Chain, ...Chain[]];

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [embeddedWallet()],
});

type ProvidersProps = PropsWithChildren<{
  onSessionEnd?: () => void;
}>;

const Provider: FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <CivicAuthProvider 
          clientId="7ed6d5cd-300f-415c-bcc0-69c399ec465d"
          initialChain={sepolia}
        >
          {children}
        </CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default Provider;
