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

      {/* Neon Gas Effects */}
      <div className="absolute inset-0 z-5">
                  <BackgroundPath/>

        {/* Main neon gas clouds with wave animations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500 blur-3xl animate-float opacity-60" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500 blur-3xl animate-float-slow opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/5 blur-3xl animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        
        {/* Neon gas trails with flowing wave animations */}
        <div className="absolute top-20 left-10 w-32 h-4 bg-blue-400/20 rounded-full blur-xl animate-float opacity-30" style={{ transform: 'rotate(-15deg)', animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-3 bg-purple-400/15 rounded-full blur-lg animate-float-slow opacity-25" style={{ transform: 'rotate(25deg)', animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-32 left-20 w-20 h-2 bg-cyan-300/20 rounded-full blur-md animate-float opacity-20" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-3 bg-blue-300/18 rounded-full blur-lg animate-float-slow opacity-35" style={{ transform: 'rotate(-30deg)', animationDelay: '2.2s' }}></div>
        
        {/* Floating neon particles with wave effects */}
        <div className="absolute top-16 left-1/3 w-3 h-3 bg-blue-400 rounded-full blur-sm animate-float opacity-70" style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.4)', animationDelay: '0.3s' }}></div>
        <div className="absolute top-32 right-1/3 w-2 h-2 bg-purple-400 rounded-full blur-sm animate-float-slow opacity-60" style={{ boxShadow: '0 0 8px rgba(147, 51, 234, 0.6), 0 0 16px rgba(147, 51, 234, 0.3)', animationDelay: '1.8s' }}></div>
        <div className="absolute bottom-24 left-1/5 w-4 h-4 bg-cyan-300 rounded-full blur-sm animate-float opacity-65" style={{ boxShadow: '0 0 12px rgba(34, 211, 238, 0.7), 0 0 24px rgba(34, 211, 238, 0.4)', animationDelay: '1.2s' }}></div>
        <div className="absolute bottom-40 right-1/5 w-2 h-2 bg-blue-300 rounded-full blur-sm animate-float-slow opacity-50" style={{ boxShadow: '0 0 6px rgba(59, 130, 246, 0.5), 0 0 12px rgba(59, 130, 246, 0.3)', animationDelay: '2.5s' }}></div>
        
        {/* Neon gas streams */}
        <div className="absolute top-0 left-1/4 w-1 h-32 bg-gradient-to-b from-blue-400/30 to-transparent blur-sm opacity-40"></div>
        <div className="absolute top-0 right-1/3 w-1 h-24 bg-gradient-to-b from-purple-400/25 to-transparent blur-sm opacity-35"></div>
        <div className="absolute bottom-0 left-1/3 w-1 h-28 bg-gradient-to-t from-cyan-400/20 to-transparent blur-sm opacity-30"></div>
        
        {/* Large atmospheric neon glow with wave effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-blue-500/5 via-purple-500/3 to-transparent blur-3xl animate-float opacity-60" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Additional floating neon wisps with wave movements */}
        <div className="absolute top-1/3 left-2/3 w-6 h-6 bg-blue-300 rounded-full blur-md animate-float-slow opacity-40" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)', animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-1/3 right-2/3 w-5 h-5 bg-purple-300 rounded-full blur-md animate-float opacity-35" style={{ boxShadow: '0 0 12px rgba(147, 51, 234, 0.5)', animationDelay: '2.8s' }}></div>
        
        {/* Extra wave elements for more fluid motion */}
        <div className="absolute top-3/4 left-1/5 w-16 h-3 bg-blue-200 rounded-full blur-lg animate-float-slow opacity-25" style={{ transform: 'rotate(20deg)', animationDelay: '1.7s' }}></div>
        <div className="absolute top-1/5 right-1/5 w-12 h-2 bg-purple-200 rounded-full blur-md animate-float opacity-20" style={{ transform: 'rotate(-35deg)', animationDelay: '3.1s' }}></div>
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

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-20">
        {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-400/5 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-conic from-blue-500/5 via-transparent to-blue-400/5 blur-2xl animate-spin-slow"></div>
        
        {/* Floating particles */}
        {/* <div className="absolute top-20 left-10 w-2 h-2 bg-blue-300/60 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400/40 rounded-full animate-float-slow opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-200/50 rounded-full animate-bounce opacity-50"></div>
          */}
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mt-2 pd-4 bg-black-900/60 backdrop-blur-md border border-blue-400/20 rounded-full px-6 py-6 mb-8 animate-fade-in shadow-lg shadow-blue-400/10">
            <span className="text-sm font-medium text-gray-200">Next-Gen Web3 Security Platform</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <div className="font-ibm secure space-y-2 mb-12 relative">
             
            <h1 className="text-6xl  md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight  drop-shadow-2xl relative z-40" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
              <span className="block text-shadow-lg/30 font-ibm text-white animate-fade-in">
                SECURE
              </span>
              
              <div className="block animate-fade-in mt-8 delay-200">
                <div className="text-6xl md:text-8xl lg:text-9xl font-white">
                  <span className="font-bold text-gray-100">WEB</span>
            <TextGif gifUrl={gifUrls[2]} text="3" size="xxxl" weight="bold" />
                </div>
                 
                
                {/* SparklesCore positioned directly under WEB3 */}
                <div className="w-full h-16 relative mt-1 flex justify-center">
                  <div className="w-[300px] md:w-[400px] lg:w-[500px] h-full relative">
                    {/* Gradients */}
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
             
                    {/* Core component */}
                    <SparklesCore
                      background="transparent"
                      minSize={0.4}
                      maxSize={1}
                      particleDensity={1200}
                      className="w-full h-full"
                      particleColor="#FFFFFF"
                    />
             
                    {/* Radial Gradient to prevent sharp edges */}
                    <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                  </div>
                </div>
              </div>
             
              <div className="flex items-center justify-center gap-12 animate-fade-in delay-400">
                <span className="text-gray-200">
                  WITH
                </span>
                <PointerHighlight
                  rectangleClassName="bg-gradient-to-r from-white-500/30 to-emerald-500/30 border-2 border-green-400/40"
                  pointerClassName="text-green-300"
                >
                  <span className="relative z-50 font-black text-6xl md:text-8xl lg:text-9xl animate-fade-in delay-600" 
                    style={{ 
                      background: 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7, #10b981)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(52, 211, 153, 0.4), 0 0 90px rgba(16, 185, 129, 0.3)',
                      filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))',
                      backgroundSize: '300% 100%',
                      animation: 'gradient-shift 4s ease-in-out infinite'
                    }}
                  >
                    ZERA
                  </span>
                </PointerHighlight>
              </div>
            </h1>
            
            {/* RetroGrid comment removed - now positioned as full-screen background */}
          
          </div>
          


          {/* Subtitle */}
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-4xl mx-auto mb-12 font-light leading-relaxed animate-fade-in delay-800 font-['Inter'] drop-shadow-lg" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }}>
            Revolutionary AI-powered smart contract auditing platform that{" "}
            <span className="text-white font-semibold">
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
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
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
