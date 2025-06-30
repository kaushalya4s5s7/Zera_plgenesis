// app/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { useBalances } from "@/src/hooks/useBalances";
import { useAccount } from "wagmi";
import WalletInfo from "@/src/components/wallet/walletInfo"; // Import the WalletInfo component
import Image from "next/image"; // Use Next.js Image component for optimization
import { StorageManager } from "@/src/components/dashboard/audit/StorageManager";

// FIX 1: Define our own types for the expected user object structure.
// This ensures we don't rely on a non-existent export from the library.
interface Wallet {
  address: `0x${string}`;
}

interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
  // This property is important for the wallet creation flow
  hasWallet?: boolean; 
}

interface CivicUser extends UserProfile {
  ethereum?: Wallet;
  solana?: { address: string };
}


const ProfilePage = (): React.ReactElement | null => {
  const { user, isLoading } = useUser();
    const { isConnected, chainId } = useAccount();
      const { data: balances, isLoading: isLoadingBalances } = useBalances();


  const [showWallet, setShowWallet] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log('Profile Page Auth State:', { user, isLoading });
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading user profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-t from-blue-50 to-white min-h-screen flex flex-col items-center py-10 px-4">
      {/* Profile Header */}

      <div className="text-center mb-8">
        <div>
          <h1 className="text-[#e9ac00] hover:underline cursor-pointer">  your balance:
          {isLoadingBalances || !isConnected
            ? "..."
            : balances?.usdfcBalanceFormatted.toFixed(1) + " $"}
      </h1>
      </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-1">My Profile</h3>
        <p className="text-gray-500 text-sm">Manage your account and wallet details</p>
      </div>

      {/* Profile Card */}
      <div className="w-full sm:w-[340px] bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center space-y-4">
        
        {/* Profile Image using Next.js Image */}
        <div className="relative w-24 h-24">
          <Image
            // FIX 3: Accessing user.picture is now type-safe.
            src={user.picture || "/images/profile.png"} // Fallback image
            alt="Profile"
            fill
            className="object-cover rounded-full shadow-sm border"
            sizes="(max-width: 768px) 100vw, 96px"
            priority
          />
        </div>

        {/* User Details */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {user.name || "No Name"}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Email: <span className="font-medium">{user.email || "No Email"}</span>
          </p>
        </div>

        {/* Toggle Wallet Button */}
        <button
          onClick={() => setShowWallet(true)}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition duration-200"
        >
          View Wallet
        </button>
      </div>

      {/* Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowWallet(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              aria-label="Close wallet view"
            >
              ×
            </button>
            
            {/* WalletInfo will receive the correctly typed user object via context */}
            <WalletInfo />
          </div>

        </div>
      
      )}
      <div><StorageManager/></div>
    </section>
  );
};

export default ProfilePage;