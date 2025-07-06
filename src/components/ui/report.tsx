"use client";

import { FileText } from "lucide-react";
import { FC } from "react";

// Local cn utility function to resolve the import error
// This is a common utility to conditionally join class names.
// If you have a global 'cn' utility in your project, you can replace this
// with your original import: import { cn } from "@/lib/utils";
function cn(...args: (string | undefined | null | boolean)[]): string {
  return args.filter(Boolean).join(" ");
}

interface ReportProps {
  className?: string;
}

const Report: FC<ReportProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative w-full rounded-xl bg-white p-4 text-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl",
        className,
      )}
    >
      {/* Report Header */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-lg font-bold">Monthly Progress</h4>
        <FileText className="size-6 text-blue-500" />
      </div>

      {/* Key Metrics */}
      <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-blue-50 p-2">
          <div className="font-semibold text-blue-700">Completion</div>
          <div className="text-xl font-black text-blue-900">85%</div>
        </div>
        <div className="rounded-md bg-green-50 p-2">
          <div className="font-semibold text-green-700">Accuracy</div>
          <div className="text-xl font-black text-green-900">92%</div>
        </div>
      </div>

      {/* Progress Bar (simple visual) */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-600">Overall Progress</div>
        <div className="mt-1 h-2 rounded-full bg-gray-200">
          <div className="h-full w-[85%] rounded-full bg-blue-500"></div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="text-xs text-gray-600">
        <div className="mb-1 font-semibold">Recent Activity:</div>
        <ul className="list-inside list-disc">
          <li>Task A completed (2 days ago)</li>
          <li>Task B reviewed (yesterday)</li>
        </ul>
      </div>
    </div>
  );
};

export default Report;
