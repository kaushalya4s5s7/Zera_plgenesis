"use client";

import { useUser } from "@civic/auth-web3/react";
import type { Chain } from 'viem';

import { useAutoConnect } from "@civic/auth-web3/wagmi";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useChainId,
  useConfig,
  useSwitchChain,
  useReadContracts,
} from "wagmi";
import { erc20Abi, formatEther } from "viem";
import { useCallback, useState, FC } from "react";
// import { userHasWallet } from "@civic/auth-web3"; // Not used in the provided code, can be removed if not needed elsewhere
import QRCode from "react-qr-code";
import { SupportedChainId, tokensByChain } from "@/utils/tokes"; // Ensure this path is correct

const truncateAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

interface WalletOptionProps {
  address: `0x${string}`;
  balance: string;
  chainName: string;
   nativeCurrencySymbol: string;
  isSelected: boolean;
  onSelect: (address: `0x${string}`) => void;
  disabled?: boolean;
}

const WalletOption: FC<WalletOptionProps> = ({
  address,
  balance,
  chainName,
  nativeCurrencySymbol,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const baseClasses =
    "w-full p-4 border rounded-lg flex items-center gap-4 transition-all duration-200";
  const stateClasses = isSelected
    ? "border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md"
    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800";
  const interactionClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer hover:border-blue-400";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div
      onClick={() => !disabled && onSelect(address)}
      className={`${baseClasses} ${stateClasses} ${interactionClasses}`}
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-400 dark:border-gray-500">
        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
      </div>

      <div className="flex-grow text-gray-900 dark:text-white">
        <div className="font-semibold">{truncateAddress(address)}</div>
        <div className="flex items-center mt-2 space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-32"
          >
            {copiedAddress === address ? "Copied!" : "Copy"}
          </button>
          <div className="p-1 bg-white border rounded">
            <QRCode value={address} size={64} />
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {balance} {nativeCurrencySymbol} on {chainName}
        </div>
      </div>
    </div>
  );
};

const TokenBalances: FC<{ address: `0x${string}`; chain: Chain }> = ({ address, chain }) => {
  // IMPORTANT: Ensure chain.id is cast to SupportedChainId to match your map
  const tokens = tokensByChain[chain.id as SupportedChainId] || [];

  const contracts = tokens.map((token) => ({
    abi: erc20Abi,
    address: token.address as `0x${string}`, // Ensure address is correctly typed as 0x${string}
    functionName: "balanceOf",
    args: [address],
    chainId: chain.id, // Explicitly pass chainId for each contract call
  }));

  const { data, isLoading: tokensLoading, error: tokensError } = useReadContracts({
    contracts: contracts.length > 0 ? contracts : [], // Ensure empty array if no tokens, but contracts already handles this
    allowFailure: true,
    query: { refetchInterval: 6000, enabled: !!address && tokens.length > 0 }, // Only enable if address and tokens exist
  });

  // Debugging logs - Keep these while troubleshooting
  console.log(`[TokenBalances for Chain ${chain.name} (ID: ${chain.id})]`);
  console.log("Tokens for this chain:", tokens);
  console.log("Contracts array sent to useReadContracts:", contracts);
  console.log("Tokens Data (from useReadContracts):", data);
  console.log("Tokens Loading:", tokensLoading);
  console.log("Tokens Error:", tokensError);

  if (!tokens.length) {
    return null; // Don't render if no tokens are defined for this chain
  }

  return (
    <div className="text-sm mt-4 border-t pt-4 border-gray-300 dark:border-gray-600">
      <div className="font-medium text-gray-800 dark:text-white mb-1">
        {chain.name} Token Balances:
      </div>
      {tokensLoading && <div className="text-gray-500">Loading token balances...</div>}
      {tokensError && <div className="text-red-500">Error fetching token balances: {tokensError.message}</div>}
      {!tokensLoading && !tokensError && (!data || data.length === 0) && (
        <div className="text-gray-500">No token data available.</div>
      )}
      {!tokensLoading && !tokensError && data && data.length > 0 && tokens.map((token, i) => {
        const contractResult = data?.[i];
        const balance = contractResult?.result ?? BigInt(0);
        const formatted = Number(balance) / 10 ** token.decimals;

        // More granular logging for each token result
        console.log(`  - ${token.symbol} (${token.address}):`);
        console.log(`    Raw Result: ${contractResult?.result}`);
        console.log(`    Status: ${contractResult?.status}`); // 'success' or 'failure'
        console.log(`    Error: ${contractResult?.error?.message}`); // If status is 'failure'

        return (
          <div key={token.address} className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>{token.symbol}</span>
            <span>{formatted.toFixed(4)}</span>
          </div>
        );
      })}
    </div>
  );
};

function Web3Selector({ walletCreationInProgress }: { walletCreationInProgress?: boolean }) {
  const { isConnected, address, chain: currentChain } = useAccount();
  const chainId = useChainId();
  const user = useUser();
  const isLoading = user.isLoading || walletCreationInProgress;

  const { chains } = useConfig(); // These are the chains configured in your wagmi.config.ts
  const { switchChain } = useSwitchChain();

  const [selectedWallet, setSelectedWallet] = useState<`0x${string}` | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [ethToSend, setEthToSend] = useState<string>("0.001");
  const [busySendingEth, setBusySendingEth] = useState(false);

  // Consider if effectiveChain/effectiveChainId is always reliable or if currentChain is sufficient.
  // effectiveChain is currentChain, effectiveChainId is currentChain.id or wagmi's chainId hook.
  // For most cases, currentChain will be set if connected.
  const effectiveChain = currentChain;
  const effectiveChainId = currentChain?.id || chainId;

  const ethBalance = useBalance({
    address,
    query: { refetchInterval: 3000, enabled: !!address },
  });

  const formatBalanceEth = (balance: bigint | undefined) => {
    if (!balance) return "0.00000";
    return Number.parseFloat(formatEther(balance)).toFixed(5);
  };

  const { sendTransaction } = useSendTransaction();

  const handleSelectWallet = (walletAddress: `0x${string}`) => {
    setSelectedWallet((prev) => (prev === walletAddress ? null : walletAddress));
  };

  const sendEth = useCallback(() => {
    const amount = parseFloat(ethToSend);
    if (!amount || !recipientAddress || !selectedWallet) return;
    setBusySendingEth(true);
    sendTransaction(
      {
        to: recipientAddress as `0x${string}`,
        value: BigInt(amount * 1e18),
      },
      {
        onSettled: () => setBusySendingEth(false),
      }
    );
  }, [recipientAddress, ethToSend, selectedWallet, sendTransaction]);

  if (isLoading) {
    return (
      <div className="text-gray-900 dark:text-white">
        <div>Connecting wallet. Please wait...</div>
        {walletCreationInProgress && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Creating wallet...
          </div>
        )}
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded mb-4">
        Wallet not connected or address not available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
          Select Network
        </label>
        <select
          className="p-2 rounded border w-full bg-white dark:bg-gray-800 text-black dark:text-white"
          value={currentChain?.id}
          onChange={(e) => switchChain?.({ chainId: parseInt(e.target.value) })}
        >
          {chains.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <WalletOption
        address={address}
        balance={formatBalanceEth(ethBalance?.data?.value)}
        chainName={currentChain?.name || `Chain ID ${effectiveChainId}`}
        nativeCurrencySymbol={currentChain?.nativeCurrency?.symbol || 'ETH'} // <-- PASSING NATIVE CURRENCY SYMBOL

        isSelected={selectedWallet === address}
        onSelect={handleSelectWallet}
        disabled={!currentChain}
      />

      {/* Render TokenBalances for each chain configured in Wagmi, regardless of current connected chain */}
      {chains.map((chain) => (
        // Pass the connected address, but the chain object for this specific iteration
        // This will attempt to fetch tokens for ALL configured chains for the connected address.
        // The TokenBalances component will handle if there are no tokens defined for that chain.
        <TokenBalances key={chain.id} address={address} chain={chain}  />
      ))}

      {/* The send ETH section was removed in previous analysis as it wasn't related to the token balance issue.
          If you need it, re-add it here, but ensure selectedWallet is properly managed.
          Given selectedWallet seems to just track the current connected wallet, you might not need a separate state for it
          unless you're managing multiple wallets.
      */}
    </div>
  );
}

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

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <Web3Selector walletCreationInProgress={walletCreationInProgress} />
    </div>
  );
};

export default Web3Zone;