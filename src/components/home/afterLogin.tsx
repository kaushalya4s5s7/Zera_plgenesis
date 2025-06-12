// components/CivicWalletManager.tsx
"use client";
import { useEffect } from "react";
import { useUser } from "@civic/auth-web3/react";
import { useToast } from "@/hooks/use-toast"; // Assuming you have this

const CivicWalletManager =  () => {
  // Get the complete user context from the hook
  const { user, walletCreationInProgress, isLoading } =  useUser();
  const { toast } = useToast();

  // useEffect is the correct way to "react" to changes in state.
  // This code will run whenever the `user` object changes (e.g., from null to a logged-in user).
  useEffect(() => {
    // Condition:
    // 1. We are not in a loading state.
    // 2. We have a logged-in user.
    // 3. That user does NOT have a wallet (`user.hasWallet` is false).
    // 4. A wallet creation is NOT already in progress.
    if (user && !user.hasWallet && !walletCreationInProgress && !isLoading) {
      console.log("User logged in, but has no wallet. Creating one now...");
      toast({
        title: "Setting up your wallet",
        description: "Please wait a moment while we create your embedded wallet.",
      });
      if (typeof (user as any).createWallet === "function") {
        (user as any).createWallet(); // This triggers the wallet creation process
      }
    }
  }, [user, walletCreationInProgress, isLoading, toast]); // Dependencies array

  // This component doesn't need to render anything visible in the UI.
  // Its only job is to run the logic above.
  return null;
};

export default CivicWalletManager;