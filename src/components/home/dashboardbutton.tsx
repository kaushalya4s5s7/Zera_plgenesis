"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { ArrowRight, Loader2 } from "lucide-react"; // Import a loader icon
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useUser } from "@civic/auth-web3/react";
import { useToast } from "@/hooks/use-toast";
import { userHasWallet } from "@civic/auth-web3";
import afterLogin from "./afterLogin";
import BgAnimateButton from "../ui/bg-animate-button";

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
   <BgAnimateButton
      onClick={handleDashboardClick} // Pass the onClick handler directly to BgAnimateButton
      gradient="candy"
      rounded="2xl"
      animation="pulse"
      size="lg"
    >
      wallet {/* Text content inside BgAnimateButton */}
    </BgAnimateButton>
  );
};

export default DashboardButton;