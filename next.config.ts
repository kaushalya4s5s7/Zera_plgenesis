import type { NextConfig } from "next";
import { createCivicAuthPlugin } from "@civic/auth/nextjs";


const nextConfig: NextConfig = {
  
 transpilePackages: ['motion','@splinetool/react-spline'],
  experimental: {
    esmExternals: 'loose'
  } ,
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com", "assets.aceternity.com","img.freepik.com"],
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
  oauthServer: 'https://auth.civic.com',
  callbackUrl: process.env.NODE_ENV === 'production' 
    ? 'https://zera-plgenesis.vercel.app/api/auth/civicauth/callback'
    : 'http://localhost:3000/api/auth/civicauth/callback',
  loginSuccessUrl: "/pages/dashboard"
});

  

export default withCivicAuth(nextConfig)
