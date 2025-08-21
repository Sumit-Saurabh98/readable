import type { NextConfig } from "next";

// @ts-ignore
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

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
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },

  eslint:{
    ignoreDuringBuilds: true
  }
};

export default nextConfig;