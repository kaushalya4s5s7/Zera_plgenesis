"use client";

import { useQuery } from "@tanstack/react-query";
import { Synapse, TOKENS } from "@filoz/synapse-sdk";
import { useEthersProvider } from "@/src/hooks/useEthers";
import { useEthersSigner } from "@/src/hooks/useEthers";
import { useAccount } from "wagmi"; // Wagmi's useAccount
// import { useNetwork } from "@/src/hooks/useNetwork"; // Removed: No longer needed
import { formatUnits } from "viem";
import { defaultBalances, UseBalancesResponse } from "@/src/types";
import { calculateStorageMetrics } from "@/utils/calculateStorageMetrics";

/**
 * Hook to fetch and format wallet balances and storage metrics
 */
export const useBalances = () => {
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const { address, chain: currentChain } = useAccount(); // Use chain from wagmi's useAccount directly

  // console.log("useBalances: Initializing hook. Address:", address, "Current Chain:", currentChain?.name);

  const query = useQuery({
    // Enable query only if address, provider, signer, and currentChain (with its ID) are available
    enabled: !!address && !!provider && !!signer && !!signer.provider && !!currentChain?.id,
    queryKey: ["balances", address, currentChain?.id], // Use currentChain.id in query key
    refetchInterval: 5000, // Refresh every 5 seconds
    queryFn: async (): Promise<UseBalancesResponse> => {
      console.log("useBalances: Starting queryFn...");
      if (!provider) {
        console.error("useBalances: Provider is null. Cannot fetch balances.");
        throw new Error("Provider not found");
      }
      if (!currentChain) {
        console.error("useBalances: Current chain is null. Cannot fetch balances.");
        throw new Error("Current chain not found");
      }
      if (!signer || !signer.provider) {
        console.error("useBalances: Signer or signer.provider is null. Cannot fetch balances.");
        throw new Error("Signer or signer.provider not found");
      }

      console.log(`useBalances: Connected address: ${address}`);
      console.log(`useBalances: Active network: ${currentChain.name} (ID: ${currentChain.id})`);

      // 1. Initialize Synapse SDK
      console.log("useBalances: Creating Synapse SDK instance with signer.provider...");
      const synapse = await Synapse.create({ provider: signer.provider as any });
      console.log("useBalances: Synapse SDK instance created successfully.");

      // 2. Verify the chain ID of the provider used by Synapse
      let providerChainId: bigint | undefined;
      try {
        const providerNetwork = await signer.provider.getNetwork();
        providerChainId = providerNetwork?.chainId;
        console.log(`useBalances: Chain ID from signer.provider (for Synapse): ${providerChainId}`);
      } catch (e) {
        console.error("useBalances: Error getting chain ID from signer.provider:", e);
      }

      // Important check: Does the provider's chain match the network's chain?
      if (providerChainId && providerChainId !== BigInt(currentChain.id)) {
        console.error(
          `useBalances: CRITICAL WARNING: Synapse provider chain ID (${providerChainId}) ` +
          `does NOT match the active network chain ID (${currentChain.id}). ` +
          `This is likely why balances are showing 0. Ensure useEthersProvider/useEthersSigner ` +
          `provide a provider for the currently selected Wagmi chain.`
        );
      } else if (!providerChainId) {
        console.error("useBalances: Could not determine chain ID from signer.provider.");
      } else {
        console.log("useBalances: Synapse provider chain ID matches active network chain ID. Proceeding.");
      }

      // 3. Fetch raw balances
      console.log("useBalances: Fetching FIL wallet balance...");
      const filRaw = await synapse.payments.walletBalance();
      console.log("useBalances: FIL Raw Balance:", filRaw.toString());

      console.log("useBalances: Fetching USDFC wallet balance (using TOKENS.USDFC)...");
      const usdfcRaw = await synapse.payments.walletBalance(TOKENS.USDFC);
      console.log("useBalances: USDFC Raw Balance (using TOKENS.USDFC):", usdfcRaw.toString());

      console.log("useBalances: Fetching Pandora balance (payments contract for USDFC)...");
      const paymentsRaw = await synapse.payments.balance(TOKENS.USDFC);
      console.log("useBalances: Pandora Raw Balance (payments contract):", paymentsRaw.toString());

      const usdfcDecimals = synapse.payments.decimals(TOKENS.USDFC);
      console.log("useBalances: USDFC Decimals:", usdfcDecimals);

      // 4. Calculate storage metrics
      let storageMetrics;
      try {
        console.log("useBalances: Calculating storage metrics...");
        storageMetrics = await calculateStorageMetrics(synapse);
        console.log("useBalances: Storage Metrics calculated:", storageMetrics);
      } catch (e) {
        console.error("useBalances: Error calculating storage metrics:", e);
        // Provide default safe values if calculation fails to prevent app crash
        storageMetrics = {
          currentStorageGB: 0,
          currentRateAllowanceGB: 0,
          currentLockupAllowance: BigInt(0),
          persistenceDaysLeft: 0,
          persistenceDaysLeftAtCurrentRate: 0,
          isRateSufficient: false,
          isLockupSufficient: false,
          isSufficient: false,
          totalLockupNeeded: BigInt(0),
          rateNeeded: BigInt(0),
          depositNeeded: BigInt(0),
        };
      }

      const formattedBalances: UseBalancesResponse = {
        filBalance: filRaw,
        usdfcBalance: usdfcRaw,
        pandoraBalance: paymentsRaw,
        filBalanceFormatted: formatBalance(filRaw, 18),
        usdfcBalanceFormatted: formatBalance(usdfcRaw, usdfcDecimals),
        pandoraBalanceFormatted: formatBalance(paymentsRaw, usdfcDecimals),
        ...storageMetrics,
      };

      console.log("useBalances: Final formatted balances and metrics:", formattedBalances);
      return formattedBalances;
    },
  });

  return {
    ...query,
    data: query.data || defaultBalances,
  };
};

/**
 * Formats a balance value with specified decimals
 */
export const formatBalance = (balance: bigint, decimals: number): number => {
  if (balance === undefined || balance === null) {
    return 0;
  }
  return Number(Number(formatUnits(balance, decimals)).toFixed(5));
};