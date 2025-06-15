// components/wallet/WalletInfo.tsx

"use client";

import { useUser, useWallet } from "@civic/auth-web3/react";
import { useState, useEffect, FC } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther } from "viem";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import QRCode from "react-qr-code";

interface Wallet {
  address: string;
  type?: string;
}

// Custom hook for Solana connection
const useConnection = () => {
  const [connection, setConnection] = useState<Connection | null>(null);
  
  useEffect(() => {
    const con = new Connection(clusterApiUrl("devnet"));
    setConnection(con);
  }, []);
  
  return { connection };
};

// Custom hook for Solana balance
const useSolanaBalance = (address: string | null) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();

  useEffect(() => {
    if (!connection || !address) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const publicKey = new PublicKey(address);
        const balanceInLamports = await connection.getBalance(publicKey);
        setBalance(balanceInLamports);
      } catch (error) {
        console.error("Error fetching Solana balance:", error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Set up polling for balance updates
    const interval = setInterval(fetchBalance, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [connection, address]);

  return { balance, loading };
};

const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

interface WalletOptionProps {
  address: string;
  balance: string;
  chainName: string;
  isSelected: boolean;
  onSelect: (address: string) => void;
  disabled?: boolean;
  walletType: "ethereum" | "solana";
  loading?: boolean;
}

const WalletOption: FC<WalletOptionProps> = ({
  address,
  balance,
  chainName,
  isSelected,
  onSelect,
  disabled = false,
  walletType,
  loading = false,
}) => {
  const baseClasses = "w-full p-4 border rounded-lg flex items-center gap-4 transition-all duration-200 mb-4";
  const stateClasses = isSelected
    ? "border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md"
    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800";
  const interactionClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-400";
  
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: string): void => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div
      onClick={() => !disabled && onSelect(address)}
      className={`${baseClasses} ${stateClasses} ${interactionClasses}`}
    >
      {/* Custom Radio Button Visual */}
      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-400 dark:border-gray-500">
        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
      </div>

      <div className="flex-grow text-gray-900 dark:text-white">
        <div className="font-semibold">{truncateAddress(address)}</div>
        <div className="flex items-center mt-2 space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent onClick
              copyToClipboard(address);
            }}
            className={`px-4 py-2 text-white rounded-md hover:opacity-90 focus:outline-none transition-colors w-32 text-center ${
              walletType === "ethereum" ? "bg-blue-500 hover:bg-blue-600" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {copiedAddress === address ? "Copied!" : "Copy"}
          </button>
          <div className="p-1 bg-white border rounded">
            <QRCode value={address} size={64} />
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              Loading...
            </span>
          ) : (
            `${balance} ${walletType === "ethereum" ? "ETH" : "SOL"} on ${chainName}`
          )}
        </div>
      </div>
    </div>
  );
};

interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
  wallets?: Wallet[];
  ethereum?: { address?: string };
  solana?: { address?: string };
}

const WalletInfo = (): React.ReactElement | null => {
  const { user }: { user: UserProfile | null } = useUser();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const chainId = useChainId();
  const { isConnected, address, chain } = useAccount();
  
  // Get Solana wallet address using useWallet hook
  const { address: solanaWalletAddress } = useWallet({ type: "solana" });

  const effectiveChain = chain;
  const effectiveChainId = chain?.id || chainId;

  // Get all available wallet addresses
  const ethereumAddresses = [
    address, // Connected wagmi wallet
    user?.wallets?.find(w => w.type === "ethereum")?.address,
    user?.ethereum?.address,
    user?.wallets?.find(w => w.address?.startsWith("0x"))?.address,
  ].filter(Boolean) as string[];

  const solanaAddresses = [
    solanaWalletAddress, // Connected Solana wallet from useWallet hook
    user?.wallets?.find(w => w.type === "solana")?.address,
    user?.solana?.address,
    user?.wallets?.find(w => w.address && !w.address.startsWith("0x"))?.address,
  ].filter(Boolean) as string[];

  // Remove duplicates
  const uniqueEthereumAddresses = [...new Set(ethereumAddresses)];
  const uniqueSolanaAddresses = [...new Set(solanaAddresses)];

  // Get balance for connected Ethereum wallet
  const ethBalance = useBalance({
    address: address as `0x${string}`,
    query: { refetchInterval: 3000, enabled: !!address },
  });

  const formatBalanceEth = (balance: bigint | undefined) => {
    if (!balance) return (0.0).toFixed(5);
    return Number.parseFloat(formatEther(balance)).toFixed(5);
  };

  const formatBalanceSol = (balance: number | null) => {
    if (balance === null || balance === undefined) return "0.00000";
    return (balance / 1e9).toFixed(5); // Convert lamports to SOL
  };

  const handleSelectWallet = (walletAddress: string) => {
    setSelectedWallet(prev => (prev === walletAddress ? null : walletAddress));
  };

  // Create a component for each Solana wallet option to use hooks properly
  const SolanaWalletOption: FC<{ address: string }> = ({ address }) => {
    const { balance, loading } = useSolanaBalance(address);
    
    return (
      <WalletOption
        address={address}
        balance={formatBalanceSol(balance)}
        chainName="Solana Devnet"
        isSelected={selectedWallet === address}
        onSelect={handleSelectWallet}
        disabled={false}
        walletType="solana"
        loading={loading}
      />
    );
  };

  useEffect(() => {
    if (user) {
      console.log("User wallets:", user.wallets);
      console.log("Ethereum address:", user.ethereum?.address);
      console.log("Solana address:", user.solana?.address);
      console.log("Connected Solana wallet:", solanaWalletAddress);
    }
  }, [user, solanaWalletAddress]);

  if (!user) {
    return (
      <div className="text-center text-gray-500">
        User not logged in.
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
        Your Wallet Addresses
      </h2>

      {/* Ethereum Wallets Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Ethereum Wallets</h3>
        {uniqueEthereumAddresses.length > 0 ? (
          uniqueEthereumAddresses.map((ethAddress) => (
            <WalletOption
              key={ethAddress}
              address={ethAddress}
              balance={
                ethAddress === address 
                  ? formatBalanceEth(ethBalance?.data?.value)
                  : "0.00000" // For non-connected wallets, you'd need separate balance queries
              }
              chainName={effectiveChain?.name || `Chain ID ${effectiveChainId}` || "Ethereum"}
              isSelected={selectedWallet === ethAddress}
              onSelect={handleSelectWallet}
              disabled={false}
              walletType="ethereum"
              loading={ethBalance.isLoading && ethAddress === address}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No Ethereum wallets available.</p>
        )}
      </div>

      {/* Solana Wallets Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Solana Wallets</h3>
        {uniqueSolanaAddresses.length > 0 ? (
          uniqueSolanaAddresses.map((solAddress) => (
            <SolanaWalletOption
              key={solAddress}
              address={solAddress}
              
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No Solana wallets available.</p>
        )}
      </div>

      {/* Display selected wallet info */}
      {selectedWallet && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Selected Wallet: {truncateAddress(selectedWallet)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Type: {selectedWallet.startsWith("0x") ? "Ethereum" : "Solana"}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;