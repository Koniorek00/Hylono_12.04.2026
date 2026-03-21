import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import { seoRedirects } from './config/seo-redirects';
import { env } from './lib/env';

const distDir = process.env.NEXT_DIST_DIR || '.next';

const nextConfig: NextConfig = {
  distDir,
  cacheComponents: true,
  reactCompiler: true,
  turbopack: {},
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
        hostname: 'cdnjs.cloudflare.com',
      },
    ],
  },
  async redirects() {
    return [...seoRedirects];
  },
};

export default withSentryConfig(nextConfig, {
  authToken: env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
});
