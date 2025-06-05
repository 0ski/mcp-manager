import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/mcps.json',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/mcps.json`,
      },
      {
        source: '/api/graphql',
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/graphql'}`,
      },
    ];
  },
};

export default nextConfig;
