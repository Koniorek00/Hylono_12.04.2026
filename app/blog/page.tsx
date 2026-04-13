import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BLOG_POSTS } from '@/constants/content';
import { BlogPage } from '@/components/BlogPage';
import { getBlogPublishedIsoDate, toBlogSlug } from '@/lib/blog';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createCollectionPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { StaticStructuredData } from '@/src/components/StaticStructuredData';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

// [DECISION: blog route is cache-friendly semi-dynamic content and should use cache components/runtime cache behavior; reverse if per-user personalization becomes mandatory.]
// Rendering strategy: server-rendered route with a client search-and-filter leaf, crawlable article links, and visible cluster-routing context.

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Hylono Blog | Science Notes, Planning Guides, and Next Steps',
    description:
      'Use the Hylono blog for plain-language science notes, modality primers, and planning guides before moving to research, conditions, products, or support.',
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
          keywords: [post.category, ...post.relatedConditionSlugs].join(', '),
          about: post.relatedProductRoute != null
            ? {
                '@type': 'Product',
                '@id': `${SITE_URL}/product/${post.relatedProductRoute}#product`,
                url: `${SITE_URL}/product/${post.relatedProductRoute}`,
                name: `Hylono ${post.category === 'RLT' ? 'PBM / Red Light' : post.category}`,
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
                'Use the Hylono blog for shorter science notes, modality orientation, and planning guides that route into research, condition pages, product hubs, and support.',
              path: '/blog',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: [
              { '@type': 'Product', '@id': `${SITE_URL}/product/hbot#product`, name: 'Hylono HBOT', url: `${SITE_URL}/product/hbot` },
              { '@type': 'Product', '@id': `${SITE_URL}/product/hydrogen#product`, name: 'Hylono Hydrogen', url: `${SITE_URL}/product/hydrogen` },
              { '@type': 'Product', '@id': `${SITE_URL}/product/rlt#product`, name: 'Hylono PBM / Red Light', url: `${SITE_URL}/product/rlt` },
              { '@type': 'Product', '@id': `${SITE_URL}/product/pemf#product`, name: 'Hylono PEMF + VNS', url: `${SITE_URL}/product/pemf` },
            ],
            keywords: 'hyperbaric oxygen therapy articles, PEMF planning guide, hydrogen wellness research notes, red light therapy article hub, Hylono protocol planning, condition-led wellness guidance',
            mainEntity: { '@id': `${SITE_URL}/blog#article-list` },
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#blog-hero-headline', '#blog-hero-description'],
            },
            relatedLink: [
              `${SITE_URL}/research`,
              `${SITE_URL}/store`,
              `${SITE_URL}/protocols`,
              `${SITE_URL}/conditions`,
              `${SITE_URL}/contact`,
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
      <BlogPage />
    </>
  );
}
