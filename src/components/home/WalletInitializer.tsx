import { useEffect } from "react";
import { userHasWallet } from "@civic/auth-web3";
import { useUser } from "@civic/auth-web3/react";
import { useToast } from "@/hooks/use-toast";

const WalletInitializer = () => {
  const userContext = useUser();
  const { toast } = useToast();
  const { user } = userContext;
  useEffect(() => {
    const run = async () => {
      const { user } = userContext;

      if (
        user &&
        !userHasWallet(userContext) 
      ) {
        console.log("✅ Social login detected, creating Civic wallet...");
        await userContext.createWallet();

        toast({
          title: "Wallet Created",
          description: "Your Civic embedded wallet has been set up.",
        });
      }
    };

    run();
  }, [userContext.user]);

  return null;
};

export default WalletInitializer;
