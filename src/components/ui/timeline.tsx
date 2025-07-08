"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-black dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-white text-center dark:text-white max-w-4xl mx-auto">
          Activate Your Filecoin Storage
        </h2>
        
        {/* Small horizontal timeline for Filecoin storage activation */}
        <div className="mb-12 mt-8">
          <div className="flex items-center justify-center overflow-x-auto pb-4">
            <div className="flex items-center space-x-4 md:space-x-8 min-w-fit">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center min-w-[140px]">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-2">
                  1
                </div>
                <div className="text-xs md:text-sm text-neutral-300 font-medium">
                  Access Dashboard
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Enter platform
                </div>
              </div>
              
              {/* Connector */}
              <div className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center min-w-[140px]">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-2">
                  2
                </div>
                <div className="text-xs md:text-sm text-neutral-300 font-medium">
                  Profile Section
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Navigate sidebar
                </div>
              </div>
              
              {/* Connector */}
              <div className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center min-w-[140px]">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-2">
                  3
                </div>
                <div className="text-xs md:text-sm text-neutral-300 font-medium">
                  Storage Funding
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Find section
                </div>
              </div>
              
              {/* Connector */}
              <div className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-green-500"></div>
              
              {/* Step 4 */}
              <div className="flex flex-col items-center text-center min-w-[140px]">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-2">
                  4
                </div>
                <div className="text-xs md:text-sm text-neutral-300 font-medium">
                  Deposit Funds
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Click deposit
                </div>
              </div>
              
              {/* Connector */}
              <div className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-green-500 to-yellow-500"></div>
              
              {/* Step 5 */}
              <div className="flex flex-col items-center text-center min-w-[140px]">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-2">
                  ✓
                </div>
                <div className="text-xs md:text-sm text-neutral-300 font-medium">
                  Upload Ready
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Filecoin active
                </div>
              </div>
            </div>
          </div>
        </div>
        
      
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 ">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
