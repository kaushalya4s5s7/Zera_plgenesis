"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount, useBalance, useSendTransaction, useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Shield, Wallet as WalletIcon, Settings, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import ConnectWalletButton from "./connectWalletbutton";
import DashboardButton from "./dashboardbutton";
import { UserButton, useUser } from "@civic/auth-web3/react";
import Link from "next/link";
import Router, { useRouter } from "next/navigation";
import { Dock, DockIcon } from "@/components/magicui/dock";
import BgAnimateButton from "../ui/bg-animate-button";
import signIn from "@civic/auth/react"
import { useCallback } from "react";



const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isLoading,signIn, signOut } = useUser();
      const router = useRouter();

  const { toast } = useToast();
  const { isConnectednormal, error } = useWallet();
    const [isSigningIn, setIsSigningIn] = useState(false);

  // const { isConnected, address, chain } = useAccount();

  
const doSignIn = useCallback(() => {
      console.log("Starting sign-in process");
      signIn()
        .then(() => {
          console.log("Sign-in completed successfully");
        })
        .catch((error) => {
          console.error("Sign-in failed:", error);
        });
    }, [signIn]);

  useEffect(() => {
    if (user) {
     console.log("User is logged in:", user);
      router.push("/pages/dashboard");
    }
  }, [user, router]);


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
  // useEffect(() => {
  //   if (user) {
  //     console.log("User is logged in:", user);
  //     router.push("/ pages/dashboard");
  //   }
  // }, [router,user]);


   if ( isLoading && !user) {
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
    <>
      {/* Bottom Dock Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        {/* Desktop Dock Navigation */}
        <div className="hidden md:block">
          <Dock
            className="bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl"
            iconSize={48}
            iconMagnification={60}
            iconDistance={150}
          >
            {/* Home Icon */}
            <DockIcon className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-400/30 hover:to-blue-400/30 border border-white/10 transition-all duration-300">
              <a href="/" className="flex items-center justify-center w-full h-full">
                <Home className="w-6 h-6 text-white" />
              </a>
            </DockIcon>

            {/* Security/Features Icon */}
            <DockIcon className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-400/30 hover:to-blue-400/30 border border-white/10 transition-all duration-300">
              <a href="#features" className="flex items-center justify-center w-full h-full">
                <Shield className="w-6 h-6 text-white" />
              </a>
            </DockIcon>

            {/* Wallet Icon (only show when user is logged in) */}
            {user && (
              <DockIcon className="bg-gradient-to-br from-green-500/20 to-teal-500/20 hover:from-green-400/30 hover:to-teal-400/30 border border-white/10 transition-all duration-300">
                <Link href="/wallet" className="flex items-center justify-center w-full h-full">
                  <WalletIcon className="w-6 h-6 text-white" />
                </Link>
              </DockIcon>
            )}

            {/* Dashboard Button as Dock Icon */}
            {user && (
              <DockIcon className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 hover:from-orange-400/30 hover:to-pink-400/30 border border-white/10 transition-all duration-300">
                <button 
                  onClick={() => router.push("/pages/dashboard")}
                  className="flex items-center justify-center w-full h-full"
                >
                  <Settings className="w-6 h-6 text-white" />
                </button>
              </DockIcon>
            )}

            {/* User Button as Dock Icon */}
            <DockIcon className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-400/30 hover:to-purple-400/30 border border-white/10 p-1 transition-all duration-300">
              <div className="flex items-center justify-center w-full h-full">
                <button onClick={doSignIn}>
          <User className="w-6 h-6 text-white" />
        </button>
              </div>
            </DockIcon>
          </Dock>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
            <div className="flex items-center justify-center space-x-4">
              {/* Mobile Home */}
              <button className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-400/30 transition-all duration-300">
                <a href="/" className="flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </a>
              </button>

              {/* Mobile Features */}
              <button className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-400/30 transition-all duration-300">
                <a href="#features" className="flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </a>
              </button>

              {/* Mobile Wallet */}
              {user && (
                <button className="p-3 rounded-xl bg-green-500/20 hover:bg-green-400/30 transition-all duration-300">
                  <Link href="/wallet" className="flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </Link>
                </button>
              )}

              {/* Mobile Dashboard */}
              {user && (
                <button 
                  onClick={() => router.push("/pages/dashboard")}
                  className="p-3 rounded-xl bg-orange-500/20 hover:bg-orange-400/30 transition-all duration-300"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="p-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-400/30 transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute bottom-24 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <nav className="flex flex-col space-y-4 p-6">
              {/* Mobile Navigation Links */}
              <a
                href="/"
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                Home
              </a>
              
              <a
                href="#features"
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5" />
                Security Features
              </a>
              
              {user && (
                <Link
                  href="/wallet"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <WalletIcon className="w-5 h-5" />
                  Wallet
                </Link>
              )}
              
              {user && (
                <button
                  onClick={() => {
                    router.push("/pages/dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/10 text-left"
                >
                  <Settings className="w-5 h-5" />
                  Dashboard
                </button>
              )}

              {/* Mobile User Button */}
              <div className="pt-4 border-t border-white/10">
                <UserButton />
              </div>

              {/* Mobile CTA */}
              <div className="pt-2">
                <BgAnimateButton
                  gradient="candy"
                  rounded="xl"
                  animation="pulse"
                  size="lg"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Free Trial
                </BgAnimateButton>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;