"use client";

import { useState, useEffect } from "react";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { CHAIN_CONFIG } from "../../utils/Contract";
import { useToast } from "@/hooks/use-toast";

export interface ChainState {
  currentChainId: number | undefined;
  selectedChainId: number;
  isSupported: boolean;
  currentChainConfig: typeof CHAIN_CONFIG[keyof typeof CHAIN_CONFIG] | undefined;
  auditRegistryAddress: string | undefined;
  isSwitching: boolean;
  isConnected: boolean;
}

export interface ChainActions {
  switchToChain: (chainId: number) => Promise<void>;
  getSupportedChains: () => (typeof CHAIN_CONFIG[keyof typeof CHAIN_CONFIG])[];
  getChainName: (chainId: number) => string;
  isChainSupported: (chainId: number) => boolean;
}

export const useChainManagement = (): ChainState & ChainActions => {
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { isConnected } = useAccount();
  const { toast } = useToast();

  const [selectedChainId, setSelectedChainId] = useState<number>(
    chainId || CHAIN_CONFIG.Sepolia.chainId
  );

  // Get current chain configuration
  const currentChainConfig = Object.values(CHAIN_CONFIG).find(
    config => config.chainId === chainId
  );

  const isSupported = !!currentChainConfig;
  const auditRegistryAddress = currentChainConfig?.contractAddress;

  // Update selected chain when actual chain changes
  useEffect(() => {
    if (chainId && chainId !== selectedChainId) {
      setSelectedChainId(chainId);
    }
  }, [chainId, selectedChainId]);

  // Chain management functions
  const switchToChain = async (targetChainId: number): Promise<void> => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to switch chains.",
        variant: "destructive",
      });
      throw new Error("Wallet not connected");
    }

    if (targetChainId === chainId) {
      return; // Already on target chain
    }

    setSelectedChainId(targetChainId);

    try {
      await switchChain?.({ chainId: targetChainId });
      
      const targetChain = Object.values(CHAIN_CONFIG).find(c => c.chainId === targetChainId);
      toast({
        title: "Chain Switched",
        description: `Successfully switched to ${targetChain?.name || `Chain ${targetChainId}`}`,
      });
    } catch (error: any) {
      console.error("Chain switch error:", error);
      
      // Reset to current chain on error
      setSelectedChainId(chainId || CHAIN_CONFIG.Sepolia.chainId);
      
      toast({
        title: "Chain Switch Failed",
        description: error.message || "Failed to switch chain. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const getSupportedChains = () => {
    return Object.values(CHAIN_CONFIG);
  };

  const getChainName = (chainId: number): string => {
    const chain = Object.values(CHAIN_CONFIG).find(c => c.chainId === chainId);
    return chain?.name || `Chain ${chainId}`;
  };

  const isChainSupported = (chainId: number): boolean => {
    return Object.values(CHAIN_CONFIG).some(c => c.chainId === chainId);
  };

  return {
    // State
    currentChainId: chainId,
    selectedChainId,
    isSupported,
    currentChainConfig,
    auditRegistryAddress,
    isSwitching,
    isConnected,
    
    // Actions
    switchToChain,
    getSupportedChains,
    getChainName,
    isChainSupported,
  };
};

export default useChainManagement;
