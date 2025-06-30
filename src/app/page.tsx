"use client";

import Navbar from "@/src/components/home/navbar";
import Hero from "@/src/components/home/hero";
import Features from "@/src/components/home/Features";
import CTA from "@/src/components/home/CTA";
import WobbleCardDemo from "@/src/components/home/WobbleCardDemo";
import Footer from "@/src/components/home/footer";
import FeaturesSectionDemo from "@/src/components/home/featuresdemo";
import FeatureCarousel from "@/src/components/home/FeatureCorousel";
import Web3Zone from "@/src/components/home/web3zone";
import { useAutoConnect } from "@civic/auth-web3/wagmi";
import CivicWalletManager from "@/src/components/home/afterLogin";
import WalletInitializer from "@/src/components/home/WalletInitializer";

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
            step1light1: "/auditor.PNG",
            step1light2: "/builder.PNG",
            step2light1: "/Testor.PNG",
            step3light: "/auditor.PNG",
            step4light: "/builder.PNG",
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
