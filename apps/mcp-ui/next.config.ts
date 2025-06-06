import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/mcps.json',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://mcp-manager-server-production.up.railway.app'}/mcps.json`,
      },
      {
        source: '/api/graphql',
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'https://mcp-manager-server-production.up.railway.app') + '/graphql'}`,
      },
    ];
  },
};

export default nextConfig;
