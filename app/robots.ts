import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/account',
          '/checkout',
          '/login',
          '/nexus',
          '/onboarding',
          '/rental/checkout',
          '/wishlist',
          // Intentionally noindex routes — disallow to preserve crawl budget
          '/search',
          '/wellness-planner',
          '/locator',
          '/affiliate',
          '/rewards',
          '/learning',
          '/meridian',
          '/firesafe',
          '/hho-car-kit',
          '/partners',
          '/careers',
        ],
      },
      // Explicitly allow major AI search crawlers with api/admin disallow
      {
        userAgent: [
          'OAI-SearchBot',
          'GPTBot',
          'ChatGPT-User',
          'Claude-Web',
          'Anthropic-AI',
          'PerplexityBot',
          'YouBot',
          'Applebot-Extended',
          'Googlebot-News',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
