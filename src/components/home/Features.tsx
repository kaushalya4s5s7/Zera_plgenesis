import { useState, useEffect } from "react";
import { Shield, Search, Code2, Zap, Lock, Server } from "lucide-react";
import { Wallet } from "lucide-react";


// Feature interface for better type checking
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  animation: string;
  delay: string;
  color: string;
  hoverEffect: string;
}

const Features = () => {
  // Track which feature is being hovered
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  // Track which features should animate
  const [animatedFeatures, setAnimatedFeatures] = useState<boolean[]>(
    Array(6).fill(false)
  );

  // Staggered animation on mount
  useEffect(() => {
    const animateFeatures = () => {
      animatedFeatures.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedFeatures((prev) => {
            const newAnimated = [...prev];
            newAnimated[index] = true;
            return newAnimated;
          });
        }, index * 150);
      });
    };

    animateFeatures();
  }, []);

  const features: Feature[] = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Smart Contract Auditing",
      description:
        "Comprehensive security audits to identify vulnerabilities in your blockchain code.",
      animation: "animate-slide-in-left",
      delay: "delay-[0ms]",
      color: "text-white",
      hoverEffect: "",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Vulnerability Scanning",
      description:
        "Automated tools to detect common security flaws and potential exploits.",
      animation: "animate-slide-in-left",
      delay: "delay-[100ms]",
      color: "text-white",
      hoverEffect: "",
    },{
  icon: <Wallet className="h-8 w-8" />,
  title: "Civic Embedded Wallet",
  description:
    "Seamlessly authenticate users and manage wallets across EVM and Solana using Civic's embedded wallet SDK.",
  animation: "animate-slide-in-left",
  delay: "delay-[100ms]",
  color: "text-white",
  hoverEffect: "",
},
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Code Optimization",
      description:
        "Improve gas efficiency and performance of your smart contracts.",
      animation: "animate-slide-in-right",
      delay: "delay-[200ms]",
      color: "text-white",
      hoverEffect: "",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automated Testing",
      description:
        "Robust test suites with simulation of various attack vectors.",
      animation: "animate-slide-in-right",
      delay: "delay-[300ms]",
      color: "text-white",
      hoverEffect: "",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Generating onChain reports",
      description: "Generate immutable on-chain audit reports to ensure transparency and trust in smart contract deployments.",
      animation: "animate-slide-in-left",
      delay: "delay-[400ms]",
      color: "text-white",
      hoverEffect: "",
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "Continuous Monitoring",
      description:
        "Ongoing security checks and alerts for your deployed contracts.",
      animation: "animate-slide-in-right",
      delay: "delay-[500ms]",
      color: "text-white",
      hoverEffect: "",
    },
  ];

  // 3D Model URLs (these would normally be local files, using placeholder URLs for example)
  const modelUrls = [
    "https://prod.spline.design/jLKkXn5BWAbHkDsF/scene.splinecode", // Shield
    "https://prod.spline.design/6QC6UhXwxF5mxsqk/scene.splinecode", // Magnifying Glass
    "https://prod.spline.design/6tPMYAiIYoSpRTZA/scene.splinecode", // Code
    "https://prod.spline.design/JgZTqXQLoHn5ioxF/scene.splinecode", // Lightning
    "https://prod.spline.design/arO3NejHyVhYjdVV/scene.splinecode", // Lock
    "https://prod.spline.design/w7ZyMBGfgvPki2XQ/scene.splinecode", // Server
  ];

  // Animation frames for icons
  const iconFrames = [
    "rotate-0 scale-100",
    "rotate-6 scale-110",
    "rotate-0 scale-105",
    "rotate-[-6deg] scale-110",
    "rotate-0 scale-100",
  ];

  // Function to animate icons
  const animateIcon = (index: number) => {
    if (hoveredFeature === index) {
      // Return a cycling animation frame based on current time
      const frameIndex = Math.floor((Date.now() / 300) % iconFrames.length);
      return iconFrames[frameIndex];
    }
    return "rotate-0 scale-100";
  };

  return (
    <section id="features" className="py-16 md:py-24 relative">
      {/* Decorative background elements */}
      <div className="absolute -top-40 right-0 w-80 h-80 bg-purple/10 rounded-full filter blur-[100px] opacity-50"></div>
      <div className="absolute -bottom-20 left-10 w-60 h-60 bg-orange/10 rounded-full filter blur-[80px] opacity-60"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 relative inline-block tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-lg">
              Complete{" "}
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
                Web3 Security
              </span>{" "}
              & Development Suite
            </span>
            <div className="absolute -bottom-3 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
            <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg font-medium tracking-wide leading-relaxed">
            From{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent font-semibold">
              smart contract auditing
            </span>{" "}
            to embedded wallets and on-chain reporting - everything you need for secure Web3 development and deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                relative rounded-xl p-6 overflow-hidden
                bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80
                backdrop-blur-lg border border-gray-700/50
                shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                transition-all duration-500 transform
                before:absolute before:inset-0 before:bg-gradient-to-br 
                before:from-white/10 before:via-transparent before:to-transparent
                before:opacity-0 before:transition-opacity before:duration-500
                hover:before:opacity-100
                after:absolute after:inset-0 after:bg-gradient-to-br
                after:from-transparent after:via-white/5 after:to-white/10
                after:opacity-50
                ${
                  animatedFeatures[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-full w-16 h-16 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-lg">
                  <div className="text-white">{feature.icon}</div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-white tracking-wide">
                  {feature.title}
                </h3>

                <p className="text-gray-300 font-normal leading-relaxed tracking-wide">
                  {feature.description}
                </p>
              </div>

              {/* Premium shine effect */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
