import { Shield, Search, Code2, Zap, Lock, Server, Wallet } from "lucide-react";

import BarChart from "./bar-chart";
import AvatarList from "./avatar-list";
import Report from "./report";
import WideCard from "./wide-card";
import Counter from "./counter";
import Ticker from "./ticker";
import TypingText from "./typing-text";
import { cn } from "@/lib/utils";

// #region placeholder
function BoldCopy({
  text = "animata",
  className,
  textClassName,
  backgroundTextClassName,
}: {
  text: string;
  className?: string;
  textClassName?: string;
  backgroundTextClassName?: string;
}) {
  if (!text?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center bg-background px-2 py-2 md:px-6 md:py-4",
        className,
      )}
    >
      <div
        className={cn(
          "text-4xl font-black uppercase text-foreground/15 transition-all group-hover:opacity-50 md:text-8xl",
          backgroundTextClassName,
        )}
      >
        {text}
      </div>
      <div
        className={cn(
          "text-md absolute font-black uppercase text-foreground transition-all group-hover:text-4xl md:text-3xl group-hover:md:text-8xl",
          textClassName,
        )}
      >
        {text}
      </div>
    </div>
  );
}

function BentoCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-2xl p-4", className)}>
      {children}
    </div>
  );
}

function FeatureOne() {
  return (
    <BentoCard className="flex flex-col bg-yellow-300">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="size-5 text-yellow-900" />
        <div className="font-bold text-yellow-900">Security Rating</div>
      </div>
      <div className="text-xs text-yellow-900 mb-2">
        Industry-leading protection
      </div>
      <div className="flex items-center gap-1 text-xs text-yellow-800 mb-2">
        <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
        <span>1000+ contracts audited</span>
      </div>
      <div className="mt-auto flex justify-end items-end">
        <div className="text-4xl font-black text-yellow-900 md:text-7xl">
          <Ticker value="9.8" />
        </div>{" "}
        <sup className="text-xl text-yellow-800">★</sup>
      </div>
      <div className="text-right text-xs text-yellow-800 mt-1">
        Trusted by enterprises
      </div>
    </BentoCard>
  );
}

function FeatureTwo() {
  return (
    <BentoCard className="relative flex flex-col overflow-visible bg-blue-600 sm:col-span-2">
      <div className="flex items-center gap-3 mb-3">
        <Search className="size-8 text-white md:size-12" />
        <div className="flex-1">
          <strong className="text-2xl font-semibold text-white">
            Vulnerability Scanning
          </strong>
          <p className="text-blue-100 text-sm mt-1">
            Automated detection of security flaws
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-blue-500/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-white">47</div>
          <div className="text-xs text-blue-100">Vulnerabilities</div>
        </div>
        <div className="bg-blue-500/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-white">12</div>
          <div className="text-xs text-blue-100">Critical</div>
        </div>
        <div className="bg-blue-500/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-white">2.3s</div>
          <div className="text-xs text-blue-100">Scan Time</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs text-blue-100">
          Last scan: 2 minutes ago
        </div>
        <div className="text-right">
          <Counter targetValue={99} format={(v) => +Math.ceil(v) + "% accuracy"} className="text-white font-bold" />
        </div>
      </div>
    </BentoCard>
  );
}

function FeatureThree() {
  return (
    <BentoCard className="flex flex-col bg-purple-500">
      <div className="flex items-center gap-2 mb-2">
        <Wallet className="size-8 md:size-12 text-white" />
        <div className="flex-1">
          <strong className="inline-block text-sm text-white">Civic Wallet</strong>
          <div className="text-xs text-purple-200">Identity + Wallet</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-purple-100">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Multi-chain support</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-100">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Identity verification</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-100">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Seamless onboarding</span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-sm font-medium text-purple-100">Embedded Authentication</div>
        <div className="font-semibold text-white">
          <TypingText text="EVM & Solana Support" waitTime={2000} alwaysVisibleCount={0} />
        </div>
      </div>
    </BentoCard>
  );
}

function FeatureFour() {
  return (
    <BentoCard className="flex items-center gap-4 bg-green-600 sm:col-span-2 md:flex-row-reverse">
      <div className="flex-1">
        <div className="text-2xl font-black text-white mb-2">Code Optimization</div>
        <div className="text-sm text-green-100 mb-3">
          Improve gas efficiency and performance
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-green-700/50 rounded p-2">
            <div className="font-bold text-white">85%</div>
            <div className="text-green-100">Gas Saved</div>
          </div>
          <div className="bg-green-700/50 rounded p-2">
            <div className="font-bold text-white">10x</div>
            <div className="text-green-100">Faster</div>
          </div>
        </div>
      </div>
      <div className="relative max-h-32 flex-shrink-0 overflow-hidden">
        <Code2 className="size-20 text-green-200 md:size-32" />
        <div className="absolute bottom-0 right-0 bg-green-800 text-white text-xs px-2 py-1 rounded-tl-lg">
          Optimized
        </div>
      </div>
    </BentoCard>
  );
}

function FeatureFive() {
  return (
    <BentoCard className="flex flex-col items-center justify-center bg-orange-600 sm:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="size-16 text-white md:size-20" />
        <div className="text-left">
          <div className="text-lg font-bold text-white">Automated</div>
          <div className="text-sm text-orange-100">Testing Suite</div>
        </div>
      </div>
      
      <BoldCopy text="TEST" className="bg-transparent mb-2" textClassName="text-white" backgroundTextClassName="text-white/20" />
      
      <div className="grid grid-cols-3 gap-2 w-full mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-white">245</div>
          <div className="text-xs text-orange-100">Test Cases</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">100%</div>
          <div className="text-xs text-orange-100">Coverage</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">0.5s</div>
          <div className="text-xs text-orange-100">Runtime</div>
        </div>
      </div>
      
      <p className="text-orange-100 text-sm text-center">
        Attack vector simulation included
      </p>
    </BentoCard>
  );
}

function FeatureSix() {
  return (
    <BentoCard className="bg-purple-600">
      <div className="flex items-center gap-2 mb-3">
        <Lock className="size-8 text-white" />
        <div>
          <div className="text-lg font-bold text-white">Security Reports</div>
          <div className="text-xs text-purple-100">Immutable & Transparent</div>
        </div>
      </div>
      
      <BarChart
        items={[
          {
            progress: 95,
            label: "Sec",
            className: "rounded-xl bg-purple-800",
          },
          { progress: 88, label: "Aud", className: "rounded-xl bg-purple-800" },
          { progress: 92, label: "Test", className: "rounded-xl bg-purple-800" },
          { progress: 97, label: "Rep", className: "rounded-xl bg-purple-800" },
          { progress: 90, label: "Mon", className: "rounded-xl bg-purple-800" },
        ]}
        height={60}
      />
      
      <div className="mt-2 space-y-1">
        <div className="text-center font-bold text-white text-sm">OnChain Reporting</div>
        <div className="flex justify-between text-xs text-purple-100">
          <span>✓ IPFS Stored</span>
          <span>✓ Blockchain Verified</span>
        </div>
      </div>
    </BentoCard>
  );
}

function FeatureSeven() {
  return (
    <BentoCard className="flex flex-col gap-2 bg-cyan-600">
      <div className="flex items-center gap-2 mb-2">
        <Server className="size-8 text-white" />
        <div>
          <div className="text-lg font-bold text-white">Tech Stack</div>
          <div className="text-xs text-cyan-100">Multi-chain Platform</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="w-full -rotate-1 rounded-full border-cyan-700 bg-cyan-700 py-2 text-center font-semibold text-white md:-rotate-3 relative">
          Solidity
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">⚡</span>
        </div>
        <div className="w-full rotate-1 rounded-full border-cyan-700 bg-cyan-700 py-2 text-center font-semibold text-white md:rotate-3 relative">
          EVM/Solana
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">🔗</span>
        </div>
        <div className="w-full rounded-full border-cyan-700 bg-cyan-700 py-2 text-center font-semibold text-white relative">
          Web3
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">🌐</span>
        </div>
      </div>
      
      <div className="text-xs text-cyan-100 text-center mt-1">
        Compatible with 15+ networks
      </div>
    </BentoCard>
  );
}

function FeatureEight() {
  return (
    <BentoCard className="relative flex flex-col bg-indigo-600 sm:col-span-2">
      <div className="flex items-center gap-3 mb-3">
        <Server className="size-8 text-white" />
        <div className="flex-1">
          <div className="text-lg font-black text-white">Continuous Monitoring</div>
          <div className="text-sm text-indigo-100">24/7 Real-time Protection</div>
        </div>
        <div className="text-right">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="text-xs text-indigo-200">Live</div>
        </div>
      </div>
      
      <div className="mb-3">
        <WideCard />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-indigo-500/50 rounded-lg p-2">
          <div className="text-lg font-bold text-white">24/7</div>
          <div className="text-xs text-indigo-100">Monitoring</div>
        </div>
        <div className="bg-indigo-500/50 rounded-lg p-2">
          <div className="text-lg font-bold text-white">0.3s</div>
          <div className="text-xs text-indigo-100">Alert Time</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-indigo-100 flex-1">
          Real-time security alerts and contract monitoring
        </p>
        <div className="flex items-center gap-1 text-xs text-indigo-200">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>All systems operational</span>
        </div>
      </div>
    </BentoCard>
  );
}

// #endregion

export default function Eight() {
  return (
    <div className="storybook-fix w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Security Platform Overview
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Comprehensive Web3 security tools in an intuitive dashboard
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:grid-rows-3">
        <FeatureOne />
        <FeatureTwo />
        <FeatureThree />
        <FeatureFour />
        <FeatureFive />
        <FeatureSix />
        <FeatureSeven />
        <FeatureEight />
      </div>
    </div>
  );
}
