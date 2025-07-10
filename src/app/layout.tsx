import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/home/Providers";
import  Provider  from "@/components/home/Provider";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import { Silkscreen } from "next/font/google";

export const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-silkscreen",
});


export const metadata: Metadata = {
  title: "Zera",
  description: "Test, Analyze, Audit and Deploy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${silkscreen.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="bg-black text-white">
       <Provider>
<Providers>{children}</Providers></Provider>
      </body>
    </html>
  );
}
