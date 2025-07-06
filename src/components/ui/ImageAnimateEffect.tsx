"use client";
import { useEffect } from "react";
import { motion, useAnimate } from "motion/react";
import { cn } from "@/lib/utils"; // Assuming you still use this for utility classes

interface SplashImageProps {
  src: string; // Path to your PNG image
  alt: string; // Alt text for accessibility
  onAnimationComplete: () => void; // Callback when the fade-out is finished
  duration?: number; // Duration of each fade (in and out)
  delay?: number; // Delay before the fade-out starts
  className?: string; // Additional class names for styling the splash screen container
}

export const SplashImage  = ({
  src,
  alt,
  onAnimationComplete,
  duration = 0.8,
  delay = 1.5, // Time the image stays fully visible before fading out
  className,
}: SplashImageProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = async () => {
      // 1. Fade in the image
      await animate(
        scope.current,
        { opacity: [0, 1] }, // Fade from 0 to 1 opacity
        { duration: duration, ease: "easeOut" }
      );

      // 2. Wait for a delay
      await new Promise((resolve) => setTimeout(resolve, delay * 1000)); // Convert seconds to milliseconds

      // 3. Fade out the image
      await animate(
        scope.current,
        { opacity: [1, 0] }, // Fade from 1 to 0 opacity
        { duration: duration, ease: "easeIn" }
      );

      // 4. Notify parent component that animation is complete
      onAnimationComplete();
    };

    sequence();
  }, [animate, scope, duration, delay, onAnimationComplete]);

  return (
    <motion.div
      ref={scope}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black dark:bg-black", // Full screen overlay
        className
      )}
      style={{ opacity: 0 }} // Start invisible
    >
      <img src={src} alt={alt} className="max-w-xs md:max-w-md lg:max-w-lg" /> {/* Adjust image size as needed */}
    </motion.div>
  );
};