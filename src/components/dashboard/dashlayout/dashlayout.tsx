"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./header";
import GradientBackground from "@/components/home/Gradient";
import { SmoothCursor } from "../../ui/smooth-cursor";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Gradient Background - fixed and covering entire viewport */}
      <div className="fixed w-full min-h-screen inset-0 -z-10">
        <GradientBackground />
      </div>

      {/* Content Area */}
      <div className="flex w-full min-h-screen">
        <Sidebar />
        <SmoothCursor/>
        <div className="flex-1 flex flex-col relative z-10">
          <Header />
          <main className="flex-1 p-6 pt-0 z-0">
            {" "}
            {/* Added pt-0 to remove top padding */}
            <div className="glassmorphic rounded-2xl p-6 min-h-[calc(100vh-7rem)] max-w-[1600px] mx-auto animate-glow">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
