import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Premium gradient shiny card */}
          <div className="relative rounded-3xl p-8 md:p-16 overflow-hidden
                         bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90
                         backdrop-blur-2xl border border-gray-600/30
                         shadow-[0_20px_60px_rgba(0,0,0,0.4)]
                         before:absolute before:inset-0 
                         before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/10
                         before:opacity-60
                         after:absolute after:inset-0
                         after:bg-gradient-to-r after:from-transparent after:via-white/15 after:to-transparent
                         after:opacity-100">
            
            {/* Premium border glow */}
            <div className="absolute inset-0 rounded-3xl 
                           bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30
                           blur-sm opacity-70"></div>
            
            {/* Corner highlights */}
            <div className="absolute top-0 left-0 w-32 h-32 
                           bg-gradient-to-br from-white/40 to-transparent 
                           rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 
                           bg-gradient-to-tl from-white/30 to-transparent 
                           rounded-br-3xl"></div>

            {/* Static premium orbs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full 
                           bg-gradient-to-br from-purple-400/50 to-pink-400/50 
                           blur-xl"></div>
            <div className="absolute -bottom-20 -right-10 w-40 h-40 rounded-full 
                           bg-gradient-to-br from-blue-400/40 to-cyan-400/40 
                           blur-xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                  Ready to{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
                    Secure
                  </span>{" "}
                  Your Web3 Projects?
                </span>
              </h2>
              
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
                Join hundreds of successful Web3 projects that trust{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent font-semibold">
                  Zera
                </span>{" "}
                for their smart contract security needs.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="relative overflow-hidden
                                 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 
                                 text-white text-lg font-bold px-10 py-7 rounded-2xl
                                 shadow-[0_15px_40px_rgba(147,51,234,0.4)]
                                 border border-purple-400/30
                                 before:absolute before:inset-0 
                                 before:bg-gradient-to-r before:from-white/20 before:via-white/10 before:to-white/20
                                 before:opacity-100
                                 after:absolute after:top-0 after:left-0 after:w-full after:h-[1px]
                                 after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent
                                 tracking-wide backdrop-blur-sm">
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="relative overflow-hidden
                           border-2 border-gray-500/60 
                           bg-gradient-to-br from-white/10 to-white/5
                           text-white text-lg font-bold px-10 py-7 rounded-2xl
                           backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                           before:absolute before:inset-0 
                           before:bg-gradient-to-r before:from-purple-500/15 before:via-transparent before:to-purple-500/15
                           before:opacity-100
                           after:absolute after:top-0 after:left-0 after:w-full after:h-[1px]
                           after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent
                           tracking-wide"
                >
                  <span className="relative z-10">Schedule Demo</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
