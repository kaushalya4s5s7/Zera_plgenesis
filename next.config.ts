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
  loginSuccessUrl: "/pages/dashboard",
  basePath: "http://localhost:3000/"
});

  

export default withCivicAuth(nextConfig)
