import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: 'https://iedc-treasure-hunt-backend.onrender.com'
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone',
  // moved from experimental
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        // Cache static assets aggressively in the browser
        source: '/:all*(css|js|woff2|ttf|eot|png|jpg|jpeg|gif|svg|webp)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        // Cache public files (e.g., /public) similarly
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        // Do not cache API responses that change often
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' }
        ]
      }
    ];
  }
};

export default nextConfig;
