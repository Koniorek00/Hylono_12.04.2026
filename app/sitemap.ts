import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { conditionGoals } from '@/content/conditions';
import { BLOG_POSTS } from '@/constants/content';
import { getBlogPublishedIsoDate, toBlogSlug } from '@/lib/blog';
import { protocols } from '@/content/protocols';
import { getAllTechRouteSlugs } from '@/lib/product-routes';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

// Content baseline date: reflects the most recent substantive schema and content update.
const CONTENT_BASELINE_DATE = new Date('2026-03-16T00:00:00.000Z');

// Image sitemap: maps product route slugs to their hero images for Google Image Search indexing.
const PRODUCT_IMAGE_MAP: Partial<Record<string, string[]>> = {
  hbot: [`${SITE_URL}/images/chambers/oxyhelp-chambers-hero.jpg`],
};

// Priority tiers for static routes
const staticRouteConfig: Record<string, { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = {
  '/': { changeFrequency: 'weekly', priority: 1.0 },
  '/store': { changeFrequency: 'weekly', priority: 0.9 },
  '/research': { changeFrequency: 'weekly', priority: 0.9 },
  '/rental': { changeFrequency: 'weekly', priority: 0.85 },
  '/blog': { changeFrequency: 'weekly', priority: 0.8 },
  '/conditions': { changeFrequency: 'monthly', priority: 0.8 },
  '/protocols': { changeFrequency: 'monthly', priority: 0.8 },
  '/faq': { changeFrequency: 'monthly', priority: 0.7 },
  '/about': { changeFrequency: 'monthly', priority: 0.6 },
  '/contact': { changeFrequency: 'monthly', priority: 0.6 },
  '/help': { changeFrequency: 'monthly', priority: 0.6 },
  '/press': { changeFrequency: 'monthly', priority: 0.4 },
  '/returns': { changeFrequency: 'monthly', priority: 0.5 },
  '/shipping': { changeFrequency: 'monthly', priority: 0.5 },
  '/warranty': { changeFrequency: 'monthly', priority: 0.5 },
  '/privacy': { changeFrequency: 'yearly', priority: 0.3 },
  '/terms': { changeFrequency: 'yearly', priority: 0.3 },
  '/cookie-policy': { changeFrequency: 'yearly', priority: 0.3 },
};

const staticRoutes = Object.keys(staticRouteConfig) as (keyof typeof staticRouteConfig)[];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => {
    const config = staticRouteConfig[path]!;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: CONTENT_BASELINE_DATE,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    };
  });

  const productEntries: MetadataRoute.Sitemap = getAllTechRouteSlugs().map((techSlug) => ({
    url: `${SITE_URL}/product/${techSlug}`,
    lastModified: CONTENT_BASELINE_DATE,
    changeFrequency: 'weekly',
    priority: 0.8,
    ...(PRODUCT_IMAGE_MAP[techSlug] ? { images: PRODUCT_IMAGE_MAP[techSlug] } : {}),
  }));

  const conditionEntries: MetadataRoute.Sitemap = conditionGoals.map((goal) => ({
    url: `${SITE_URL}/conditions/${goal.slug}`,
    lastModified: CONTENT_BASELINE_DATE,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const protocolEntries: MetadataRoute.Sitemap = protocols.map((protocol) => ({
    url: `${SITE_URL}/protocols/${protocol.slug}`,
    lastModified: CONTENT_BASELINE_DATE,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => {
    const publishedDate = getBlogPublishedIsoDate(post.date);
    return {
      url: `${SITE_URL}/blog/${toBlogSlug(post.title)}`,
      lastModified: publishedDate ? new Date(publishedDate) : CONTENT_BASELINE_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [
    ...staticEntries,
    ...productEntries,
    ...conditionEntries,
    ...protocolEntries,
    ...blogEntries,
  ];
}
