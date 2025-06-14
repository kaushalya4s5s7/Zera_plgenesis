// components/wallet/WalletInfo.tsx

"use client";

import { useUser } from "@civic/auth-web3/react";
import { useState, useEffect, FC } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther } from "viem";
import QRCode from "react-qr-code";

interface Wallet {
  address: string;
  type?: string;
}

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
}

const WalletOption: FC<WalletOptionProps> = ({
  address,
  balance,
  chainName,
  isSelected,
  onSelect,
  disabled = false,
  walletType,
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
          {balance} {walletType === "ethereum" ? "ETH" : "SOL"} on {chainName}
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

  const handleSelectWallet = (walletAddress: string) => {
    setSelectedWallet(prev => (prev === walletAddress ? null : walletAddress));
  };

  useEffect(() => {
    if (user) {
      console.log("User wallets:", user.wallets);
      console.log("Ethereum address:", user.ethereum?.address);
      console.log("Solana address:", user.solana?.address);
    }
  }, [user]);

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
            <WalletOption
              key={solAddress}
              address={solAddress}
              balance="0.00000" // You'd need to implement Solana balance fetching
              chainName="Solana"
              isSelected={selectedWallet === solAddress}
              onSelect={handleSelectWallet}
              disabled={false}
              walletType="solana"
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
        </div>
      )}
    </div>
  );
};

export default WalletInfo;