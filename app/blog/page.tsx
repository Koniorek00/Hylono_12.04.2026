import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BLOG_POSTS } from '@/constants/content';
import { getBlogPublishedIsoDate, toBlogSlug } from '@/lib/blog';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createCollectionPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { StaticStructuredData } from '@/src/components/StaticStructuredData';
import { BlogClient } from './BlogClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

const BLOG_CATEGORY_TO_PRODUCT_ROUTE: Record<string, string | null> = {
  HBOT: 'hbot',
  PEMF: 'pemf',
  RLT: 'rlt',
  Hydrogen: 'hydrogen',
  Protocols: null,
};

const BLOG_CATEGORY_TO_PRODUCT_NAME: Record<string, string> = {
  HBOT: 'Hylono HBOT',
  PEMF: 'Hylono PEMF + VNS',
  RLT: 'Hylono PBM / Red Light',
  Hydrogen: 'Hylono Hydrogen',
};

// [DECISION: blog route is cache-friendly semi-dynamic content and should use cache components/runtime cache behavior; reverse if per-user personalization becomes mandatory.]

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Hylono Blog | Research Notes, Protocol Guides and Product Insights',
    description:
      'Explore Hylono research notes, wellness articles, and practical protocol guides tied to products, evidence, and next-step planning.',
    path: '/blog',
  }),
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
};

export default function BlogPageRoute() {
  const blogArticleListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/blog#article-list`,
    name: 'Hylono blog articles',
    description:
      'Research notes, protocol guides, and product insights from the Hylono editorial team.',
    url: `${SITE_URL}/blog`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    isPartOf: { '@id': WEBSITE_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    numberOfItems: BLOG_POSTS.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: BLOG_POSTS.map((post, index) => {
      const slug = toBlogSlug(post.title);
      const datePublished = getBlogPublishedIsoDate(post.date) ?? undefined;
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/blog/${slug}`,
        item: {
          '@type': 'BlogPosting',
          '@id': `${SITE_URL}/blog/${slug}#article`,
          headline: post.title,
          description: post.excerpt,
          url: `${SITE_URL}/blog/${slug}`,
          inLanguage: 'en',
          articleSection: post.category,
          keywords: post.category,
          about: BLOG_CATEGORY_TO_PRODUCT_ROUTE[post.category] != null
            ? {
                '@type': 'Product',
                '@id': `${SITE_URL}/product/${BLOG_CATEGORY_TO_PRODUCT_ROUTE[post.category]}#product`,
                url: `${SITE_URL}/product/${BLOG_CATEGORY_TO_PRODUCT_ROUTE[post.category]}`,
                name: BLOG_CATEGORY_TO_PRODUCT_NAME[post.category] ?? `Hylono ${post.category}`,
              }
            : { '@type': 'DefinedTerm', name: post.category },
          ...(datePublished ? { datePublished } : {}),
          author: { '@id': ORGANIZATION_ID() },
          publisher: { '@id': ORGANIZATION_ID() },
          isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/blog` },
          potentialAction: { '@type': 'ReadAction', target: [`${SITE_URL}/blog/${slug}`] },
        },
      };
    }),
  };

  return (
    <>
      {/* ItemList renders in static HTML shell — no nonce needed for SSG route */}
      <StaticStructuredData id="jsonld-blog-article-list" data={blogArticleListSchema} />
      {/* CollectionPage and BreadcrumbList use nonce-aware StructuredData */}
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-blog-index"
          data={{
            ...createCollectionPageSchema({
              name: 'Hylono Blog',
              description:
                'Explore Hylono research notes, wellness articles, and practical protocol guides tied to products, evidence, and next-step planning.',
              path: '/blog',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: [
              { '@type': 'Product', '@id': `${SITE_URL}/product/hbot#product`, name: 'Hylono HBOT', url: `${SITE_URL}/product/hbot` },
              { '@type': 'Product', '@id': `${SITE_URL}/product/hydrogen#product`, name: 'Hylono Hydrogen', url: `${SITE_URL}/product/hydrogen` },
              { '@type': 'Product', '@id': `${SITE_URL}/product/rlt#product`, name: 'Hylono PBM / Red Light', url: `${SITE_URL}/product/rlt` },
              { '@type': 'Product', '@id': `${SITE_URL}/product/pemf#product`, name: 'Hylono PEMF + VNS', url: `${SITE_URL}/product/pemf` },
            ],
            keywords: 'hyperbaric oxygen therapy articles, PEMF wellness research, hydrogen therapy blog, red light therapy articles, HBOT research notes, wellness protocol guides',
            mainEntity: { '@id': `${SITE_URL}/blog#article-list` },
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#blog-hero-headline', '#blog-hero-description'],
            },
            relatedLink: [
              `${SITE_URL}/research`,
              `${SITE_URL}/protocols`,
              `${SITE_URL}/conditions`,
            ],
          }}
        />
        <StructuredData
          id="jsonld-blog-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ])}
        />
      </Suspense>
      <BlogClient />
    </>
  );
}
