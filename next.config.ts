import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
      {
        protocol: 'https',
        hostname: 'oxyhelp.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
      },
    ],
  },
}

export default nextConfig