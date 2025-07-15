import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "readablelms.fly.storage.tigris.dev",
        port: "",
        pathname: "/**",
      }
    ]
  }
};

export default nextConfig;
