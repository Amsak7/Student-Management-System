import type { NextConfig } from 'next';

const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '5000';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `http://localhost:${backendPort}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
