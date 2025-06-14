"use client";

import Navbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import WobbleCardDemo from "@/components/home/WobbleCardDemo";
import Footer from "@/components/home/footer";
import FeaturesSectionDemo from "@/components/home/featuresdemo";
import FeatureCarousel from "@/components/home/FeatureCorousel";
import Web3Zone from "@/components/home/web3zone";
import { useAutoConnect } from "@civic/auth-web3/wagmi";
import CivicWalletManager from "@/components/home/afterLogin";
import WalletInitializer from "@/components/home/WalletInitializer";

const HomePage = () => {
    // useAutoConnect();
  
  // const movingStripItems = [
  //   { text: "SMART CONTRACT AUDIT", color: "text-purple-light" },
  //   { text: "VULNERABILITY DETECTION", color: "text-orange-light" },
  //   { text: "SECURE DEPLOYMENT", color: "text-purple" },
  //   { text: "GAS OPTIMIZATION", color: "text-orange" },
  //   { text: "BLOCKCHAIN SECURITY", color: "text-purple-light" },
  //   { text: "DEFI PROTECTION", color: "text-orange-light" },
  // ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <WobbleCardDemo />
        {/* <CivicWalletManager /> */}
        {/* <Web3Zone /> */}
        {/* Uncomment the next line to use the moving strip feature */}
        {/* <MovingStrip items={movingStripItems} /> */}
        <WalletInitializer/>
        <FeaturesSectionDemo />
        <Features />
        <FeatureCarousel
          title="How Zera Works"
          description="All in one Solution"
          image={{
            step1light1: "./auditor.PNG",
            step1light2: "./builder.PNG",
            step2light1: "./Testor.PNG",
            step3light: "./auditor.PNG",
            step4light: "./builder.PNG",
            alt: "Feature showcase",
          }}
        />
        {/* <Testimonials /> */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
