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
        ],
      },
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
