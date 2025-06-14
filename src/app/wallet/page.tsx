"use client";
import { useUser } from "@civic/auth-web3/react";
import { useAutoConnect } from "@civic/auth-web3/wagmi";
import { useAccount, useBalance, useSendTransaction, useChainId } from "wagmi";
import { formatEther } from "viem";
import { useCallback, useState, useEffect, FC } from "react";
import { userHasWallet } from "@civic/auth-web3";
import QRCode from "react-qr-code";


// Helper function to truncate addresses
const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};


// ------------------------------------------
// 1. The "Radio Box" Presentational Component
// ------------------------------------------
interface WalletOptionProps {
  address: `0x${string}`;
  balance: string;
  chainName: string;
  isSelected: boolean;
  onSelect: (address: `0x${string}`) => void;
  disabled?: boolean;
}

const WalletOption: FC<WalletOptionProps> = ({
  address,
  balance,
  chainName,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const baseClasses = "w-full p-4 border rounded-lg flex items-center gap-4 transition-all duration-200";
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
                onClick={() => copyToClipboard(address)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none transition-colors w-32 text-center"
              >
                {copiedAddress === address ? "Copied!" : "Copy"}
              </button>
              <div className="p-1 bg-white border rounded">
                <QRCode value={address} size={64} />
              </div>
            </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {balance} ETH on {chainName}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------
// 2. The Main Logic Container (replaces Web3U)
// ------------------------------------------
function Web3Selector({
  walletCreationInProgress,
}: {
  walletCreationInProgress?: boolean;
}) {
  const { isConnected, address, chain } = useAccount();
  const chainId = useChainId();
  const user =  useUser();
  const isLoading = user.isLoading || walletCreationInProgress;

  const [selectedWallet, setSelectedWallet] = useState<`0x${string}` | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [ethToSend, setEthToSend] = useState<string>("0.001");
  const [busySendingEth, setBusySendingEth] = useState(false);

  // Get chain info from multiple sources
  const effectiveChain = chain;
  const effectiveChainId = chain?.id || chainId;

  // Debug logging
  useEffect(() => {
    console.log("Web3Selector Debug Info:", {
      isConnected, address, chain, chainId, user: user.user, userHasWallet: userHasWallet(user), isLoading,
    });
  }, [isConnected, address, chain, chainId, user, isLoading]);

  const ethBalance = useBalance({
    address,
    query: { refetchInterval: 3000, enabled: !!address },
  });

  const formatBalanceEth = (balance: bigint | undefined) => {
    if (!balance) return (0.0).toFixed(5);
    return Number.parseFloat(formatEther(balance)).toFixed(5);
  };

  const { sendTransaction, error: sendTxError } = useSendTransaction();

  const handleSelectWallet = (walletAddress: `0x${string}`) => {
    // Toggle selection
    setSelectedWallet(prev => (prev === walletAddress ? null : walletAddress));
  };
  
  const sendEth = useCallback(() => {
    const amount = parseFloat(ethToSend);
    if (!amount || !recipientAddress || !selectedWallet) return;
    setBusySendingEth(true);
    sendTransaction({
      to: recipientAddress as `0x${string}`,
      value: BigInt(amount * 1e18),
    }, {
      onSettled: () => setBusySendingEth(false),
    });
  }, [recipientAddress, ethToSend, selectedWallet, sendTransaction]);

  // Handle loading and connection states
  if (isLoading) {
    return (
      <div className="text-gray-900 dark:text-white">
        <div>Connecting wallet. Please wait...</div>
        {walletCreationInProgress && <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Creating wallet...</div>}
      </div>
    );
  }

  // Handle not connected state
  if (!isConnected || !address) {
     return (
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded mb-4">
          Wallet not connected or address not available.
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* The Radio Box component */}
      <WalletOption
        address={address}
        balance={formatBalanceEth(ethBalance?.data?.value)}
        chainName={effectiveChain?.name || `Chain ID ${effectiveChainId}` || "Unknown"}
        isSelected={selectedWallet === address}
        onSelect={handleSelectWallet}
        disabled={!effectiveChain && !effectiveChainId}
      />
      
      </div>
    
  );
}


// ------------------------------------------
// 3. The Top-Level Entry Point (Same as before, just renders the new component)
// ------------------------------------------
const Web3Zone = () => {
  const { user, isLoading, walletCreationInProgress } = useUser();
  useAutoConnect();

  if (!isLoading && !user) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4 text-gray-900 dark:text-white text-center">
          <h3 className="text-lg font-semibold mb-2">Web3 Wallet Access</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please sign in using the button above to access your embedded wallet and Web3 features.
          </p>
        </div>
      </div>
    );
  }

  // Render the new selector component
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <Web3Selector walletCreationInProgress={walletCreationInProgress} />
    </div>
  );
}

export default Web3Zone