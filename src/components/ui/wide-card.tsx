"use client";

import { CheckCircle, Clock } from "lucide-react";
import { FC } from "react";

// Local cn utility function to resolve the import error
// This is a common utility to conditionally join class names.
// If you have a global 'cn' utility in your project, you can replace this
// with your original import: import { cn } from "@/lib/utils";
function cn(...args: (string | undefined | null | boolean)[]): string {
  return args.filter(Boolean).join(" ");
}

interface WideCardProps {
  className?: string;
}

const WideCard: FC<WideCardProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-4 rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl",
        className,
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <Clock className="size-10 text-rose-500 md:size-12" />
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h4 className="text-lg font-bold text-gray-800 md:text-xl">Morning Check-in</h4>
        <p className="text-sm text-gray-600">
          Remember to review your goals for the day and prioritize tasks.
        </p>
      </div>

      {/* Action Button (optional) */}
      <button className="flex-shrink-0 rounded-full bg-rose-500 p-2 text-white shadow-md transition-all duration-200 hover:bg-rose-600 hover:shadow-lg">
        <CheckCircle className="size-6" />
      </button>
    </div>
  );
};

export default WideCard;
