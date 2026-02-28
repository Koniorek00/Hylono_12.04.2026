import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylono.eu';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/partner/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}