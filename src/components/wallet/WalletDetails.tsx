// components/wallet/WalletDetails.tsx

"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { useBalance } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { Connection, PublicKey } from '@solana/web3.js';
import { formatEther } from 'viem'; // Best practice for formatting ETH balance

// Type definition for the Solana Wallet API on the window object
interface SolanaWallet {
  publicKey: { toString: () => string };
  connect: () => Promise<void>;
  // Add other methods you might use, like signTransaction
}

declare global {
  interface Window {
    solana?: SolanaWallet;
  }
}

interface Wallet {
  address: `0x${string}`;
}

interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
}

interface CivicUser extends UserProfile {
  ethereum?: Wallet;
  solana?: { address: string };
}


const WalletDetails = (): React.ReactElement => {
  // FIX 2: Type the user object from the hook with our custom interface.
  const { user }: { user: CivicUser | null } = useUser();
  
  // Use optional chaining for safe access.
  const ethereumAddress = user?.ethereum?.address;

  const { data: ethBalanceData, isLoading: isEthBalanceLoading } = useBalance({
    address: ethereumAddress,
    chainId: mainnet.id,
    query: {
      enabled: !!ethereumAddress,
      refetchInterval: 5000,
    }
  });
  const [solanaAddress, setSolanaAddress] = useState<string | null>(null);
  const [solanaBalance, setSolanaBalance] = useState<number | null>(null);
  const [isSolanaLoading, setIsSolanaLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSolanaDetails = async () => {
      if (window.solana?.publicKey) {
        try {
          const solanaConnection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
          const publicKey = new PublicKey(window.solana.publicKey.toString());
          const balance = await solanaConnection.getBalance(publicKey);
          setSolanaBalance(balance / 10 ** 9); // SOL has 9 decimal places
          setSolanaAddress(publicKey.toString());
        } catch (error) {
          console.error("Failed to fetch Solana balance:", error);
        }
      }
      setIsSolanaLoading(false);
    };

    getSolanaDetails();
  }, []);

  const handleConnectSolana = async (): Promise<void> => {
    if (window.solana) {
      try {
        await window.solana.connect();
        // The useEffect will refetch details upon connection state change in a full setup
        window.location.reload(); // Simple way to refetch after connect
      } catch (err) {
        console.error('Failed to connect to Solana wallet', err);
      }
    } else {
      alert('Solana wallet (e.g., Phantom) not found. Please install it.');
    }
  };

  const formattedEthBalance = ethBalanceData ? parseFloat(formatEther(ethBalanceData.value)).toFixed(5) : '0.00';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Wallet Details</h2>

      {/* Ethereum Wallet Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Ethereum Wallet</h3>
        {ethereumAddress ? (
          <>
            <p className="font-medium">Address:</p>
            <p className="text-gray-700 break-all">{ethereumAddress}</p>
            <p className="font-medium mt-2">Balance:</p>
            <p className="text-gray-700">
              {isEthBalanceLoading ? 'Loading...' : `${formattedEthBalance} ETH`}
            </p>
          </>
        ) : (
          <p className="text-gray-700">Civic embedded Ethereum wallet not available.</p>
        )}
      </div>

      {/* Solana Wallet Info */}
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Solana Wallet</h3>
        {isSolanaLoading ? (
          <p className="text-gray-700">Checking for Solana wallet...</p>
        ) : solanaAddress ? (
          <>
            <p className="font-medium">Address:</p>
            <p className="text-gray-700 break-all">{solanaAddress}</p>
            <p className="font-medium mt-2">Balance:</p>
            <p className="text-gray-700">{solanaBalance?.toFixed(5) ?? '0.00'} SOL</p>
          </>
        ) : (
          <>
            <p className="text-gray-700">Please connect your Solana wallet (e.g., Phantom) to see details.</p>
            <button
              onClick={handleConnectSolana}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Connect Solana Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletDetails;