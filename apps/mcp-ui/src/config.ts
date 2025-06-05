const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const config = {
  NEXT_PUBLIC_API_URL,
  // Use local API routes to avoid CORS issues
  NEXT_PUBLIC_CONFIG_PATH: '/api/mcps.json',
  NEXT_PUBLIC_GRAPHQL_API_URL: '/api/graphql',
}