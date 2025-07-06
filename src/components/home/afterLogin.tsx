// components/CivicWalletManager.tsx
"use client";
import { useEffect,useCallback } from "react";
import { useUser } from "@civic/auth-web3/react";
import { useToast } from "@/hooks/use-toast"; 
import { userHasWallet } from "@civic/auth-web3";

const CivicWalletManager =  () => {
  // Get the complete user context from the hook
  const { user, walletCreationInProgress, isLoading } =  useUser();
  const { toast } = useToast();
  const userContext = useUser();

  // useEffect is the correct way to "react" to changes in state.
  // This code will run whenever the `user` object changes (e.g., from null to a logged-in user).
  useEffect(() => {
    const run = async () => {
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
    run();
  }, [userContext, userHasWallet]); // Dependencies array

  // This component doesn't need to render anything visible in the UI.
  // Its only job is to run the logic above.
  return null;
};

export default CivicWalletManager;