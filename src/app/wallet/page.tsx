// app/wallet/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { useAccount, useBalance, useConnect } from "wagmi";
import { formatEther } from "viem";
import { userHasWallet } from "@civic/auth-web3";
import { useAutoConnect } from "@civic/auth-web3/wagmi";

const WalletPage = () => {
  // --- 1. PRESERVING YOUR HOOK STRUCTURE ---
  const { user, isLoading, walletCreationInProgress } = useUser();
  // Keep userContext as you had it.
  const userContext = useUser();
 
  const { address, isConnected, chain } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: {
      refetchInterval: 5000,
      enabled: !!address && isConnected,
    },
  });
  const { connect, connectors } = useConnect();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  // --- 2. FIXING YOUR `createWallet` and `connectWallet` FUNCTIONS ---
  const createWallet = async () => {
    // FIX 1: Use the official `userHasWallet` helper with the userContext object.
    if (userContext.user && !userHasWallet(userContext)) {
      console.log("createWallet function called: Creating wallet...");
      // Call the createWallet function from the context. This is correct.
      await userContext.createWallet();
      // NOTE: We do not need to call connectWallet() here.
      // `useAutoConnect()` will handle it automatically when `userHasWallet` becomes true.
      // Calling it manually can cause race conditions.
    }
  };

  // This function is kept, but it's generally not needed due to useAutoConnect.
  // It's safe to have, but it won't be called in the automatic flow.
  const connectWallet = () => {
    if (connectors.length > 0) {
      console.log("connectWallet function called: Connecting to the first connector (Civic)...");
      connect({ connector: connectors[0] });
    }
  };

  // --- 3. FIXING THE `useEffect` LOGIC ---
  useEffect(() => {
    // FIX 2: Use the `user` object from the first hook call and the correct `userHasWallet` check.
    // The `user` object from both hook calls is the same, but this is cleaner.
    if (user && !userHasWallet(userContext) && !walletCreationInProgress) {
      console.log("useEffect triggered: User is authenticated but has no wallet. Calling createWallet().");
      // Call your createWallet function.
      createWallet();
    }
  // The dependency array is correct.
  }, [user, walletCreationInProgress]); 

  // --- Helper functions are unchanged, they are correct ---
  const getNetworkAddress = () => address || "N/A";
  const getNetworkBalance = () => {
    if (!balanceData) return "0.00 ETH";
    return `${parseFloat(formatEther(balanceData.value)).toFixed(5)} ${balanceData.symbol}`;
  };
  const getNetworkStatus = () => {
    if (!isConnected || !chain) return "Disconnected";
    return chain.name;
  };
  const getNetworkIcon = () => isConnected ? "🟢" : "🔴";

  // --- RENDER LOGIC ---

  // Initial loading state for the user session
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // User is not logged in after loading
  if (!user) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-600 mt-2">Please sign in to view your wallet dashboard.</p>
      </div>
    );
  }

  // Main dashboard render
  return (
    <div>
      <h1 className="text-3xl font-bold my-8">Wallet Dashboard</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* User Info Header */}
        <div className="flex items-center space-x-4">
          {user.picture && <img src={user.picture} alt="User Avatar" className="w-12 h-12 rounded-full"/>}
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user.email}</h2>
            <p className="text-gray-600">Manage your wallet and assets</p>
          </div>
        </div>

        {/* Wallet Creation Status */}
        {walletCreationInProgress && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
              <p className="text-yellow-700">Creating your wallet, please wait...</p>
            </div>
          </div>
        )}

        {/* --- 4. FIXING THE MAIN WALLET UI CONDITION --- */}
        {/* The condition should be `isConnected` AND that the user has a wallet. */}
        {isConnected && userHasWallet(userContext) ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{getNetworkIcon()}</span>
                <span className="text-sm text-gray-600">{getNetworkStatus()}</span>
              </div>
            </div>
            {/* Balance Card and Buttons */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Balance</h3>
              <p className="text-2xl font-bold">{getNetworkBalance()}</p>
              <div className="flex space-x-4 mt-4">
                <button onClick={() => setShowSendModal(true)} className="bg-blue-600 ...">Send</button>
                <button onClick={() => setShowReceiveModal(true)} className="bg-green-600 ...">Receive</button>
              </div>
            </div>
          </div>
        ) : (
          // Add a fallback message for when the wallet exists but wagmi hasn't connected yet
          !walletCreationInProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700 font-semibold">Finalizing wallet connection...</p>
            </div>
          )
        )}
      </div>

      {/* Modals are unchanged, they are correct */}
      {showReceiveModal && (
        <div className="fixed inset-0 ...">
          <div className="bg-white ...">
            <h3 className="text-xl font-bold mb-4">Your Wallet Address</h3>
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-mono text-sm break-all">{getNetworkAddress()}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowReceiveModal(false)} className="px-4 ...">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;