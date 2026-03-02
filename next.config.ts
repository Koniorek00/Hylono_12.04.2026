import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import { env } from './lib/env';

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  turbopack: {},
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  cacheLife: {
    feed: { stale: 30, revalidate: 60, expire: 300 },
    session: { stale: 0, revalidate: 0, expire: 3600 },
    static: { stale: 86400, revalidate: 3600, expire: 604800 },
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
};

export default withSentryConfig(nextConfig, {
  authToken: env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
});