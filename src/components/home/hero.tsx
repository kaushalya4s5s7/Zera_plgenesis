"use client";

import { ArrowRight, ShieldCheck, Code, Zap, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PointerHighlight } from "../ui/pointer-highlight";
import { SparklesCore } from "../ui/sparkles";
import { RetroGrid } from "../magicui/retro-grid";
import BackgroundPath from "../ui/BackgroundPath";
import Counter from "../ui/counter";
import { useState } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: "400",
});

 
import { TextGif } from "../ui/text-gif"; 

const Hero = () => {
  const [text, setText] = useState("TextGif")
  const [size, setSize] = useState("xl")
  const [weight, setWeight] = useState("bold")
 
  const gifUrls = [
    "https://media.giphy.com/media/3zvbrvbRe7wxBofOBI/giphy.gif",
    "https://media.giphy.com/media/fnglNFjBGiyAFtm6ke/giphy.gif",
    "https://media.giphy.com/media/9Pmfazv34l7aNIKK05/giphy.gif",
    "https://media.giphy.com/media/4bhs1boql4XVJgmm4H/giphy.gif",
  ]
 
  const [selectedGif, setSelectedGif] = useState(gifUrls[0]);
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Minimalistic Dot Grid Background - Web3 Security Theme */}
      <div 
        className="absolute inset-0 z-0 dot-grid-animated dot-grid-pulse"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.12) 2px, transparent 2px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0',
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 40%, black 30%, rgba(0,0,0,0.7) 50%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 40%, black 30%, rgba(0,0,0,0.7) 50%, transparent 75%)',
        }}
      />
      
      {/* Enhanced responsive dot grid overlay for mobile and large screens */}
      <div 
        className="absolute inset-0 z-0 md:hidden dot-grid-mobile"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(14, 165, 233, 0.08) 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
          maskImage: 'radial-gradient(ellipse 90% 75% at 50% 45%, black 25%, rgba(0,0,0,0.6) 45%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 75% at 50% 45%, black 25%, rgba(0,0,0,0.6) 45%, transparent 65%)',
        }}
      />

      {/* Large screen enhanced dot grid */}
      <div 
        className="absolute inset-0 z-0 hidden xl:block dot-grid-large"
        style={{
          backgroundImage: `radial-gradient(circle at 2.5px 2.5px, rgba(195, 201, 204, 0.15) 2.5px, transparent 2.5px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 38%, black 35%, rgba(0,0,0,0.8) 55%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 38%, black 35%, rgba(0,0,0,0.8) 55%, transparent 80%)',
        }}
      />
      
      <BackgroundPath/>
      {/* RetroGrid Background - Full Screen */}
      {/* <RetroGrid 
        className="absolute inset-0 z-0"
        lightLineColor="rgba(18, 64, 21, 0.4)"
        darkLineColor="rgba(18, 69, 21, 0.4)"
        cellSize={60}
        angle={45}
        opacity={0.6}
      /> */}

      {/* Cohesive accent lighting - Web3 Security Theme */}
      <div className="absolute inset-0 z-5">
        {/* Primary security accent - Sky Blue */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-sky-500/8 blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/6 blur-3xl animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
        
        {/* Central security focus glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-radial from-sky-500/4 via-blue-500/2 to-transparent blur-3xl"></div>
        
        {/* Subtle cyan accents for modern feel */}
        <div className="absolute top-20 right-1/3 w-64 h-64 rounded-full bg-cyan-400/3 blur-3xl animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Blue Light Border Effect */}
      {/* <div className="absolute inset-0 z-10"> */}
        {/* Top border light */}
        {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div> */}
        {/* Bottom border light */}
        {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div> */}
        {/* Left border light */}
        {/* <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/60 to-transparent"></div> */}
        {/* Right border light */}
        {/* <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/60 to-transparent"></div> */}
        
        {/* Corner glow effects */}
        {/* <div className="absolute top-0 left-3 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div> */}
      {/* </div> */}

      {/* Refined animated elements - Security theme */}
      <div className="absolute inset-0 overflow-hidden z-20">
        {/* Subtle security-themed floating elements */}
        <div className="absolute top-20 left-10 w-1 h-1 bg-sky-400/40 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse opacity-65" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-sky-300/50 rounded-full animate-pulse opacity-55" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Additional micro-animations for depth */}
        <div className="absolute top-1/3 left-1/3 w-0.5 h-0.5 bg-blue-300/60 rounded-full animate-pulse opacity-40" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-0.5 h-0.5 bg-sky-200/60 rounded-full animate-pulse opacity-45" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="text-center max-w-6xl mx-auto">
          {/* Premium Web3 Security Badge */}
          <div className="inline-flex items-center gap-3 mt-2 pd-4 bg-slate-900/80 backdrop-blur-md border border-sky-400/30 rounded-full px-6 py-6 mb-8 animate-fade-in shadow-xl shadow-sky-400/10">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-medium text-slate-200">Next-Gen Web3 Security Platform</span>
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <div className="font-ibm secure space-y-2 mb-12 relative">
            <div>
            <h1 className={`text-6xl  ${silkscreen.className}  md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight  drop-shadow-2xl relative z-40`} style={{ textShadow: '0 0 20px rgba(14, 165, 233, 0.4)' }}>
              <span className="block text-shadow-lg/30  text-slate-100 animate-fade-in">
                SECURE
              </span>
              
              <div className="block animate-fade-in mt-8 delay-200">
                <div className="text-6xl md:text-8xl lg:text-9xl font-white">
                  <span className="font-bold text-slate-100">WEB</span>
            <TextGif gifUrl={gifUrls[2]} text="3" size="xxxl" weight="bold" />
                </div>
                 
                
                {/* SparklesCore positioned directly under WEB3 */}
                <div className="w-full h-16 relative mt-1 flex justify-center">
                  <div className="w-[300px] md:w-[400px] lg:w-[500px] h-full relative">
                    {/* Enhanced Security-themed Gradients */}
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent h-px w-1/4" />
             
                    {/* Core component */}
                    <SparklesCore
                      background="transparent"
                      minSize={0.4}
                      maxSize={1}
                      particleDensity={1200}
                      className="w-full h-full"
                      particleColor="#0ea5e9"
                    />
             
                    {/* Radial Gradient to prevent sharp edges */}
                    <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                  </div>
                </div>
              </div>
             
              <div className="flex items-center justify-center gap-12 animate-fade-in delay-400">
                <span className="text-slate-300">
                  WITH
                </span>
                <PointerHighlight
                  rectangleClassName="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/40"
                  pointerClassName="text-emerald-300"
                >
                  <span className="relative z-50 font-black text-6xl md:text-8xl lg:text-9xl animate-fade-in delay-600" 
                    style={{ 
                      background: 'linear-gradient(135deg, #059669, #10b981, #34d399, #6ee7b7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 30px rgba(5, 150, 105, 0.7), 0 0 60px rgba(16, 185, 129, 0.5), 0 0 90px rgba(5, 150, 105, 0.4)',
                      filter: 'drop-shadow(0 0 25px rgba(232, 239, 237, 0.6))',
                      backgroundSize: '300% 100%',
                      animation: 'gradient-shift 4s ease-in-out infinite'
                    }}
                  >
                    ZERA
                  </span>
                </PointerHighlight>
              </div>
            </h1>
             <div className={'absolute bottom-0 left-0 w-full h-full z-0 animate-appear opacity-0'}>
        </div>
</div>
          

            
            {/* RetroGrid comment removed - now positioned as full-screen background */}
          
          </div>

          {/* Professional Web3 Security Subtitle */}
          <p className="text-sm md:text-base lg:text-lg text-slate-400 max-w-4xl mx-auto mb-12 font-light leading-relaxed animate-fade-in delay-800 font-['Inter'] drop-shadow-lg" style={{ textShadow: '0 0 15px rgba(14, 165, 233, 0.2)' }}>
            Revolutionary AI-powered smart contract auditing platform that{" "}
            <span className="text-slate-200 font-semibold">
              detects vulnerabilities 10x faster
            </span>{" "}
            than traditional methods
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in delay-1000">
            <Button 
              size="lg" 
              className=" glow-button min-w-[200px] font-['Inter']"
            >
              Start Free Audit
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
          </div>
          <div> <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] mb-4 my-4 font-bold mt-1 leading-none">
               ZERA
               </span>
            </h1>
          </>
        }
      >
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <img
            src={`/image.png`}
            alt="Zera Security Dashboard"
            className="w-full h-full object-cover"
            draggable={false}
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        </div>
      </ContainerScroll></div>
         

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in delay-1200">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300 font-['Space_Grotesk']" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}>
                 <div className="text-center group">
                          <Counter targetValue={99} format={(v) => +Math.ceil(v) + "%"} className="text-4xl md:text-5xl font-black text-gray-100 mb-2 text-white font-bold" />
                        </div>
              </div>
              <div className="text-gray-400 text-lg font-medium font-['Inter']">
                Accuracy Rate
              </div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-gray-100 mb-2 group-hover:scale-110 transition-transform duration-300 font-['Space_Grotesk']" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}>
                10x
              </div>
              <div className="text-gray-400 text-lg font-medium font-['Inter']">
                Faster Analysis
              </div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-gray-200 mb-2 group-hover:scale-110 transition-transform duration-300 font-['Space_Grotesk']" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}>
               <div className="text-center group">
                          <Counter targetValue={1000} format={(v) => +Math.ceil(v) + "+"} className="text-4xl md:text-5xl font-black text-gray-100 mb-2 text-white font-bold" />
                        </div>
              </div>
              <div className="text-gray-400 text-lg font-medium font-['Inter']">
                Contracts Secured
              </div>
            </div>
          </div>

          {/* Trust indicators
          <div className="flex items-center justify-center gap-6 mt-16 animate-fade-in delay-1400">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-['Inter']">
              <Star className="w-4 h-4 fill-blue-300 text-blue-300" />
              <span>Trusted by 500+ Projects</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-['Inter']">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Enterprise Grade Security</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-['Inter']">
              <Zap className="w-4 h-4 text-blue-300" />
              <span>Lightning Fast</span>
            </div>
          </div> */}
        </div>
      </div>

      
      
    </section>
  );
};

export default Hero;
