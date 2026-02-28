import type { MetadataRoute } from 'next';
import { conditionGoals } from '@/content/conditions';
import { products } from '@/content/products';
import { protocols } from '@/content/protocols';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylono.eu';

const staticRoutes = [
  '/',
  '/about',
  '/account',
  '/affiliate',
  '/blog',
  '/careers',
  '/checkout',
  '/conditions',
  '/contact',
  '/cookie-policy',
  '/faq',
  '/firesafe',
  '/guarantee',
  '/help',
  '/hho-car-kit',
  '/learning',
  '/locator',
  '/meridian',
  '/onboarding',
  '/partners',
  '/press',
  '/privacy',
  '/protocols',
  '/rental',
  '/rental/checkout',
  '/research',
  '/returns',
  '/rewards',
  '/shipping',
  '/support',
  '/terms',
  '/warranty',
  '/wishlist',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const conditionEntries: MetadataRoute.Sitemap = conditionGoals.map((goal) => ({
    url: `${SITE_URL}/conditions/${goal.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const protocolEntries: MetadataRoute.Sitemap = protocols.map((protocol) => ({
    url: `${SITE_URL}/protocols/${protocol.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticEntries, ...productEntries, ...conditionEntries, ...protocolEntries];
}