// src/hooks/useNetwork.ts

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

const getNetwork = (chainId: number): "mainnet" | "calibration" | null => {
  return chainId === 314159 // Filecoin Calibration Testnet
    ? "calibration"
    : chainId === 314 // Filecoin Mainnet
    ? "mainnet"
    : null;
};

export const useNetwork = () => {
  const { chainId } = useAccount();

  return useQuery<"mainnet" | "calibration">({
    queryKey: ["network", chainId],
    queryFn:  () => {
      if (!chainId) {
        // It's good practice to log or handle this, though `enabled` prevents queryFn if chainId is null/undefined
        console.warn("useNetwork: chainId is not available.");
        throw new Error("Chain ID not found");
      }

      const network = getNetwork(chainId);

      if (!network) {
        console.warn(`useNetwork: Unsupported network for chainId: ${chainId}`);
        throw new Error("Unsupported network");
      }

      return network;
    },
    enabled: !!chainId, // Only run this query if chainId is available
    staleTime: Infinity, // Keep this to ensure data is always considered fresh
    // cacheTime: Infinity, // <-- REMOVED THIS LINE TO RESOLVE THE ERROR
    retry: 0, // No need to retry if unsupported or chainId is not found
    // If you explicitly want to ensure it never gets garbage collected,
    // and removing cacheTime: Infinity still causes an issue,
    // you might need to adjust your TanStack Query setup globally or re-evaluate why `DefinedInitialDataOptions` is inferred.
    // But for now, removing it should fix the TypeScript error.
  });
};