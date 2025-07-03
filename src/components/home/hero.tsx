"use client";

import { ArrowRight, ShieldCheck, Code, Zap, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PointerHighlight } from "../ui/pointer-highlight";
import { SparklesCore } from "../ui/sparkles";
import { RetroGrid } from "../magicui/retro-grid";
import BackgroundPath from "../ui/BackgroundPath";
import Counter from "../ui/counter";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* RetroGrid Background - Full Screen */}
      {/* <RetroGrid 
        className="absolute inset-0 z-0"
        lightLineColor="rgba(18, 64, 21, 0.4)"
        darkLineColor="rgba(18, 69, 21, 0.4)"
        cellSize={60}
        angle={45}
        opacity={0.6}
      /> */}
      <BackgroundPath/>

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
          <div className="space-y-2 mb-12 relative">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight font-['Space_Grotesk'] drop-shadow-2xl relative z-40" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
              <span className="block text-white animate-fade-in">
                SECURE
              </span>
              
              <div className="block animate-fade-in mt-8 delay-200">
                <div className="text-6xl md:text-8xl lg:text-9xl font-black">
                  <span className="text-gray-100">WEB</span>
                  <span className="text-blue-400">3</span>
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
                  rectangleClassName="bg-gradient-to-r from-green-500/20 to-green-500/20 border-2 border-blue-400/40"
                  pointerClassName="text-blue-300"
                >
                  <span className="relative z-50 font-black text-6xl md:text-8xl lg:text-9xl text-white animate-fade-in delay-600" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}>
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
