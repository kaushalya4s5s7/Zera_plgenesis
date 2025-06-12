"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount, useBalance, useSendTransaction, useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import ConnectWalletButton from "./connectWalletbutton";
import DashboardButton from "./dashboardbutton";
import { UserButton, useUser } from "@civic/auth-web3/react";
import Link from "next/link";
import Router, { useRouter } from "next/navigation";



const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signIn, signOut } = useUser();
      const router = useRouter();


  const { toast } = useToast();
  const { isConnectednormal, error } = useWallet();
    const [isSigningIn, setIsSigningIn] = useState(false);

  // const { isConnected, address, chain } = useAccount();

  
const handleSignIn = async () => {
    setIsSigningIn(true);
    await signIn();
          router.push("/pages/dashboard");

  };



  useEffect(() => {
    if (error) {
      toast({
        title: "Wallet Connection Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // useEffect(() => {
  //   if (isConnectednormal) {
  //     toast({
  //       title: "Wallet Connected",
  //       description: "Your wallet has been successfully connected!",
  //     });
  //   }
  // }, [isConnectednormal, toast]);
  useEffect(() => {
    if (user) {
      router.push("/pages/dashboard");
    }
  }, [user, router]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


   if (isSigningIn || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium animate-pulse">Logging in...</p>
        </div>
      </div>
    );
  }


  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-morphism  py-1" : "py-1"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-0">
        <div className="flex  items-center">
          <a href="/">
            <Image
              src="/Zera_Logo-removebg-preview.png" // Ensure this path is correct relative to the public folder
              alt="Zera Logo"
              width={75} // Adjust these values based on your logo size
              height={25}
              className="object-contain rounded-2xl"
              priority
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-white/80 hover:text-white transition-colors"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-white/80 hover:text-white transition-colors"
          >
            How It Works
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center gap-4">
            {/* Authentication Buttons */}
            <div className="text-white hover:bg-white/10">
            {user && (
        <Link
          href="/wallet"
          className="px-6 py-2 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center hover:bg-purple-600 transition-colors">
          Wallet
        </Link>
      )}</div> <button
          onClick={handleSignIn}
          className="px-6 py-2 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center hover:bg-purple-600 transition-colors"
        >
          Login
        </button>

            {/* {/* </div>
            {/* <div className="text-white hover:bg-white/10">
              <ConnectWalletButton />
            </div> */}
            {/* Dashboard Button */}
            
            <div> 
              <DashboardButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-morphism">
          <nav className="flex flex-col space-y-4 p-4">
            <a
              href="#features"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#solutions"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Solutions
            </a>
            <a
              href="#how-it-works"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Button
              variant="ghost"
              className="justify-start text-white hover:bg-white/10 w-full"
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-purple to-orange text-white hover:opacity-90 w-full">
              Start Free Trial
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
