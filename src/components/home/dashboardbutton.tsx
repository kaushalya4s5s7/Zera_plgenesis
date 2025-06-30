"use client";

import { Button } from "@/src/components/ui/button";
import { useWallet } from "@/src/hooks/useWallet";
import { ArrowRight, Loader2 } from "lucide-react"; // Import a loader icon
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useUser } from "@civic/auth-web3/react";
import { useToast } from "@/src/hooks/use-toast";
import { userHasWallet } from "@civic/auth-web3";
import afterLogin from "./afterLogin";

const DashboardButton = () => {
  const router = useRouter();
  // const { isConnected } = useAccount();
  const { toast } = useToast();

  // 1. Destructure both `user` and `isLoading` from the hook
  const { user, isLoading } = useUser();

  // 2. Refine the logic: The dashboard button should ONLY show if a Civic user is logged in.
  // The `isLoading` check prevents it from appearing and disappearing while fetching.
  // if (isLoading) {
  //   // Optionally, you can show a skeleton or a disabled placeholder button
  //   return (
  //     <Button disabled className="flex items-center gap-2">
  //       <Loader2 size={18} className="animate-spin" />
  //       Loading...
  //     </Button>
  //   );
  // }

  // If not loading and no user, don't render the button at all.
  // if (isConnected) {
  //   return null;
  // }



  const handleDashboardClick = () => {
    // Now, by the time this function can be called, we are guaranteed to have a `user` object.
    // The previous check `if (!user)` is no longer necessary here.
    toast({
    title: "🚀 Sign up required for getting your wallet",
    description: "Please complete Civic sign-up before accessing the dashboard.",
    variant: "destructive", // or "default", "info", etc.
    duration: 5000,         // Optional: how long toast shows (ms)
  })
    router.push("/wallet");
  };

  return (
    <Button
      onClick={handleDashboardClick}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 transition-all"
    >
      Wallet
      <ArrowRight size={18} />
    </Button>
  );
};

export default DashboardButton;