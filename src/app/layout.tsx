import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/src/components/home/Providers";
import  Provider  from "@/src/components/home/Provider";
import { CivicAuthProvider } from "@civic/auth-web3/react";


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
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className="bg-black text-white">
       <Provider>
<Providers>{children}</Providers></Provider>
      </body>
    </html>
  );
}
