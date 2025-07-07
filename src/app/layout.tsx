import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/home/Providers";
import  Provider  from "@/components/home/Provider";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import { Silkscreen, Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

export const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

export const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  style: ["normal", "italic"],
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
    <html lang="en" className={`${silkscreen.variable} ${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head />
      <body className="bg-black text-white">
       <Provider>
<Providers>{children}</Providers></Provider>
      </body>
    </html>
  );
}
