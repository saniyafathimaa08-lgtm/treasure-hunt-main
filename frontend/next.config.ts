import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://iedc-treasure-hunt-backend.onrender.com'
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Production optimizations
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd()
  }
};

export default nextConfig;
