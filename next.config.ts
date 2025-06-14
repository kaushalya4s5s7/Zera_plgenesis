import type { NextConfig } from "next";
import { createCivicAuthPlugin } from "@civic/auth/nextjs";


const nextConfig: NextConfig = {
  env: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  },
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com", "assets.aceternity.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "7ed6d5cd-300f-415c-bcc0-69c399ec465d",
loginSuccessUrl:"/pages/dashboard"});

  

export default withCivicAuth(nextConfig)
