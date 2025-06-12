// components/wallet/WalletInfo.tsx

"use client";

import { useUser } from "@civic/auth-web3/react";
import { useState } from "react";
import QRCode from "react-qr-code";

// FIX 1: Define our own types for the expected object structure.
// This removes the need to import a 'User' type that doesn't exist.
interface Wallet {
  address: `0x${string}`;
}

interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
  // Add any other user properties you might access
}

interface CivicUser extends UserProfile {
  ethereum?: Wallet;
  solana?: { address: string };
}

const WalletInfo = (): React.ReactElement | null => {
  // FIX 2: Type the hook's return value with our custom interface.
  const { user }: { user: CivicUser | null } = useUser();
  
  // Use optional chaining for safe access.
  const ethereumAddress = user?.ethereum?.address;
  const solanaAddress = user?.solana?.address;

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: string): void => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

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

      {/* Ethereum Wallet Section */}
      <div className="mb-6">
        <p className="font-medium text-gray-800">Ethereum:</p>
        {ethereumAddress ? (
          <>
            <p className="text-sm break-all text-gray-600 my-2">{ethereumAddress}</p>
            <div className="flex items-center mt-2 space-x-4">
              <button
                onClick={() => copyToClipboard(ethereumAddress)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none transition-colors w-32 text-center"
              >
                {copiedAddress === ethereumAddress ? "Copied!" : "Copy"}
              </button>
              <div className="p-1 bg-white border rounded">
                <QRCode value={ethereumAddress} size={64} />
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">Wallet not available.</p>
        )}
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Solana Wallet Section */}
      <div>
        <p className="font-medium text-gray-800">Solana:</p>
        {solanaAddress ? (
          <>
            <p className="text-sm break-all text-gray-600 my-2">{solanaAddress}</p>
            <div className="flex items-center mt-2 space-x-4">
              <button
                onClick={() => copyToClipboard(solanaAddress)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none transition-colors w-32 text-center"
              >
                {copiedAddress === solanaAddress ? "Copied!" : "Copy"}
              </button>
              <div className="p-1 bg-white border rounded">
                <QRCode value={solanaAddress} size={64} />
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">Wallet not available.</p>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;