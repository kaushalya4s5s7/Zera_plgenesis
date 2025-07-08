"use client";
import React from "react";

import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export function CanvasRevealEffectDemo() {
  return (
    <>
    <div className="flex flex-col items-center justify-center py-20 relative overflow-hidden">
        {/* Neon effects from corners */}
        <div className="absolute inset-0">
          {/* Top-left corner neon beams */}
          <div className="absolute top-0 left-0 w-64 h-64">
            <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-blue-500/60 to-transparent animate-pulse"></div>
            <div className="absolute top-2 left-0 w-24 h-px bg-gradient-to-r from-cyan-400/40 to-transparent animate-pulse delay-300"></div>
            <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-blue-500/60 to-transparent animate-pulse delay-100"></div>
            <div className="absolute top-0 left-2 w-px h-24 bg-gradient-to-b from-cyan-400/40 to-transparent animate-pulse delay-400"></div>
            {/* Diagonal beam */}
            <div className="absolute top-0 left-0 w-48 h-px bg-gradient-to-r from-blue-400/50 to-transparent rotate-45 origin-left animate-pulse delay-200"></div>
          </div>

          {/* Top-right corner neon beams */}
          <div className="absolute top-0 right-0 w-64 h-64">
            <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-purple-500/60 to-transparent animate-pulse delay-500"></div>
            <div className="absolute top-2 right-0 w-24 h-px bg-gradient-to-l from-pink-400/40 to-transparent animate-pulse delay-800"></div>
            <div className="absolute top-0 right-0 w-1 h-32 bg-gradient-to-b from-purple-500/60 to-transparent animate-pulse delay-600"></div>
            <div className="absolute top-0 right-2 w-px h-24 bg-gradient-to-b from-pink-400/40 to-transparent animate-pulse delay-900"></div>
            {/* Diagonal beam */}
            <div className="absolute top-0 right-0 w-48 h-px bg-gradient-to-l from-purple-400/50 to-transparent -rotate-45 origin-right animate-pulse delay-700"></div>
          </div>

          {/* Bottom-left corner neon beams */}
          <div className="absolute bottom-0 left-0 w-64 h-64">
            <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-cyan-500/60 to-transparent animate-pulse delay-1000"></div>
            <div className="absolute bottom-2 left-0 w-24 h-px bg-gradient-to-r from-blue-400/40 to-transparent animate-pulse delay-1300"></div>
            <div className="absolute bottom-0 left-0 w-1 h-32 bg-gradient-to-t from-cyan-500/60 to-transparent animate-pulse delay-1100"></div>
            <div className="absolute bottom-0 left-2 w-px h-24 bg-gradient-to-t from-blue-400/40 to-transparent animate-pulse delay-1400"></div>
            {/* Diagonal beam */}
            <div className="absolute bottom-0 left-0 w-48 h-px bg-gradient-to-r from-cyan-400/50 to-transparent -rotate-45 origin-left animate-pulse delay-1200"></div>
          </div>

          {/* Bottom-right corner neon beams */}
          <div className="absolute bottom-0 right-0 w-64 h-64">
            <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-indigo-500/60 to-transparent animate-pulse delay-1500"></div>
            <div className="absolute bottom-2 right-0 w-24 h-px bg-gradient-to-l from-purple-400/40 to-transparent animate-pulse delay-1800"></div>
            <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-indigo-500/60 to-transparent animate-pulse delay-1600"></div>
            <div className="absolute bottom-0 right-2 w-px h-24 bg-gradient-to-t from-purple-400/40 to-transparent animate-pulse delay-1900"></div>
            {/* Diagonal beam */}
            <div className="absolute bottom-0 right-0 w-48 h-px bg-gradient-to-l from-indigo-400/50 to-transparent rotate-45 origin-right animate-pulse delay-1700"></div>
          </div>

          {/* Floating neon particles from corners */}
          <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400/70 rounded-full blur-sm animate-float"></div>
          <div className="absolute top-12 right-12 w-1 h-1 bg-purple-400/60 rounded-full blur-sm animate-float-slow delay-500"></div>
          <div className="absolute bottom-8 left-12 w-3 h-3 bg-cyan-400/65 rounded-full blur-sm animate-float delay-1000"></div>
          <div className="absolute bottom-12 right-8 w-1 h-1 bg-indigo-400/55 rounded-full blur-sm animate-float-slow delay-1500"></div>

          {/* Convergent neon streams toward center */}
          <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-blue-400/30 to-purple-400/30 rotate-45 animate-pulse delay-2000"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-px bg-gradient-to-l from-purple-400/30 to-cyan-400/30 -rotate-45 animate-pulse delay-2200"></div>
          <div className="absolute bottom-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-cyan-400/30 to-blue-400/30 -rotate-45 animate-pulse delay-2400"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-px bg-gradient-to-l from-indigo-400/30 to-purple-400/30 rotate-45 animate-pulse delay-2600"></div>
        </div>

        {/* Background glow effects */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-64 h-24 bg-purple-500/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Premium title with enhanced styling */}
        <div className="relative z-10 text-center">
          <div className="mb-4">
            <span className="text-sm font-medium text-blue-400/80 tracking-[0.3em] uppercase font-['Inter']">
              Our Plans
            </span>
          </div>
          
          <h1 className="text-3xl md:text-6xl font-mono md:text-5xl font-black tracking-tight font-['Space_Grotesk'] relative group cursor-default">
           
            
            
            <span className="relative inline-block mt-4">
              <span 
                className="bg-gradient-to-r from-blue-200 via-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
                style={{ 
                  backgroundSize: '300% 100%',
                  animation: 'gradient-shift 6s ease-in-out infinite reverse',
                  textShadow: '0 0 40px rgba(147, 51, 234, 0.6), 0 0 80px rgba(59, 130, 246, 0.4), 0 0 120px rgba(147, 51, 234, 0.3)',
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)',
                  filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.5))',
                  letterSpacing: '0.05em'
                }}
              >
                PRICING
              </span>
              
              {/* Premium decorative elements */}
              <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 hidden lg:block">
                <div className="w-5 h-5 bg-blue-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)' }}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full mt-2 ml-4 animate-pulse delay-500" style={{ boxShadow: '0 0 10px rgba(147, 51, 234, 0.6)' }}></div>
                <div className="w-2 h-2 bg-white rounded-full mt-1 ml-2 animate-pulse delay-1000"></div>
              </div>
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="mt-8 text-xl text-gray-300 font-light max-w-2xl mx-auto font-['Inter'] opacity-90 leading-relaxed">
            Choose the perfect plan for your <span className="text-blue-300 font-medium">Web3 security</span> needs
          </p>
          
          {/* Enhanced decorative elements */}
          
    
    {/* Pricing Cards Section */}
    <div className="py-20 flex flex-col lg:flex-row items-center justify-center dark:bg-black w-full gap-4 mx-auto px-8">
        
        <Card intro="Free" title="Generate, audit , test , document and analyze your contract" icon={<AceternityIcon />}>
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-900"
          />
        </Card>
        
        <Card intro="Pay As You Go" title="Generate, audit, test ,document , analyse and store your contract on filecoin" icon={<AceternityIcon />}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-sky-600"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
      <div className="mt-10 flex items-center justify-center space-x-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-purple-400"></div>
            <div className="w-3 h-3 bg-blue-400/70 rounded-full animate-pulse" style={{ boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-300"></div>
            <div className="w-3 h-3 bg-purple-400/70 rounded-full animate-pulse delay-600" style={{ boxShadow: '0 0 12px rgba(147, 51, 234, 0.6)' }}></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-purple-400 to-blue-400"></div>
          </div>
        </div>
    </div>
    </>
  );
}

;
const Card = ({
    intro,
  title,
  icon,
  children,
}: {
    intro: string;
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (

    <> <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-white/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative h-[30rem] relative"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        {!hovered && (
          <div className="text-center justify-center mb-6">
            <h3 
              className="text-2xl font-black tracking-wide bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent font-['Space_Grotesk'] relative"
              style={{ 
                textShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)',
                WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.1)',
                filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))',
                letterSpacing: '0.1em'
              }}
            >
              {intro}
            </h3>
            {/* Subtle underline for card titles */}
            <div className="mt-2 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
          </div>
        )}
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          {icon}
        </div>
        <h2 className="dark:text-white text-lg opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-semibold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200 text-center leading-relaxed">
          {title}
        </h2>
      </div>
    </div></>
   
  );
};

const AceternityIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white "
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }}
      />
    </svg>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
