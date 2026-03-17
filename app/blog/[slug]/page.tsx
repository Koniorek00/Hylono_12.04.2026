import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  createBlogPostingSchema,
  createBreadcrumbSchema,
  SCHEMA_DATE_MODIFIED,
  createWebPageSchema,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import {
  getBlogPostBySlug,
  getBlogPublishedIsoDate,
  toBlogSlug,
} from '@/lib/blog';
import { siteOwnership } from '@/content/site-entity';
import { BLOG_POSTS } from '@/constants/content';
import { TECH_DETAILS } from '@/constants';
import { getTechTypeFromRouteSlug } from '@/lib/product-routes';
import { BlogArticleClient } from './BlogArticleClient';

const resolveBlogSlug = (rawSlug: string): string => {
  const canonicalSlug = rawSlug.toLowerCase();
  if (rawSlug !== canonicalSlug && getBlogPostBySlug(canonicalSlug)) {
    permanentRedirect(`/blog/${canonicalSlug}`);
  }

  return canonicalSlug;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: toBlogSlug(post.title),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = resolveBlogSlug(rawSlug);
  const article = getBlogPostBySlug(slug);

  if (!article) {
    notFound();
  }

  const baseMeta = createPageMetadata({
    title: `${article.title} | Hylono Research Notes`,
    description: article.excerpt,
    path: `/blog/${slug}`,
    ogType: 'article',
  });
  const datePublished = getBlogPublishedIsoDate(article.date) ?? undefined;

  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
      type: 'article',
      ...(datePublished ? { publishedTime: datePublished, modifiedTime: datePublished } : {}),
      section: article.category,
      tags: [article.category],
      authors: [siteOwnership.editorial.team],
    } as Metadata['openGraph'],
  };
}

// [DECISION: ISR because article content is semi-dynamic and should refresh on a timed cadence.]
export default async function BlogArticlePageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = resolveBlogSlug(rawSlug);
  const article = getBlogPostBySlug(slug);

  if (!article) {
    notFound();
  }

  const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
  const BLOG_CATEGORY_TO_PRODUCT_ROUTE: Record<string, string | null> = {
    HBOT: 'hbot',
    PEMF: 'pemf',
    RLT: 'rlt',
    Hydrogen: 'hydrogen',
    Protocols: null,
  };
  const datePublished = getBlogPublishedIsoDate(article.date) ?? `${SCHEMA_DATE_MODIFIED}T00:00:00.000Z`;
  const readTimeMinutes = parseInt(article.readTime, 10);
  // Estimate word count: average reading speed 200 WPM
  const estimatedWordCount = readTimeMinutes > 0 ? readTimeMinutes * 200 : undefined;
  const blogProductRouteSlug = BLOG_CATEGORY_TO_PRODUCT_ROUTE[article.category] ?? null;
  const isTechArticle = blogProductRouteSlug != null;
  const blogProductTechType = blogProductRouteSlug ? getTechTypeFromRouteSlug(blogProductRouteSlug) : null;
  const productName = blogProductTechType
    ? `Hylono ${TECH_DETAILS[blogProductTechType].name}`
    : blogProductRouteSlug
      ? `Hylono ${article.category}`
      : '';
  const articleSchema = {
    ...createBlogPostingSchema({
      headline: article.title,
      description: article.excerpt,
      path: `/blog/${slug}`,
      datePublished,
      articleSection: article.category,
      authorName: siteOwnership.editorial.team,
      wordCount: estimatedWordCount,
    }),
    ...(isTechArticle ? { '@type': ['BlogPosting', 'TechArticle'] } : {}),
    ...(blogProductRouteSlug != null
      ? {
          about: {
            '@type': 'Product',
            '@id': `${SITE_URL}/product/${blogProductRouteSlug}#product`,
            url: `${SITE_URL}/product/${blogProductRouteSlug}`,
            name: productName,
          },
        }
      : {}),
    keywords: [article.category, ...(productName ? [productName] : [])].join(', '),
    ...(blogProductRouteSlug != null
      ? {
          mentions: {
            '@type': 'Product',
            '@id': `${SITE_URL}/product/${blogProductRouteSlug}#product`,
            url: `${SITE_URL}/product/${blogProductRouteSlug}`,
            name: productName,
          },
        }
      : {}),
    ...(readTimeMinutes > 0 ? { timeRequired: `PT${readTimeMinutes}M` } : {}),
    isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/blog`, url: `${SITE_URL}/blog` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#article-reader-title', '#article-reader-excerpt'],
    },
  };
  const articlePath = `/blog/${slug}`;
  const webPageSchema = {
    ...createWebPageSchema({
      name: article.title,
      description: article.excerpt,
      path: articlePath,
      dateModified: datePublished,
    }),
    datePublished,
    mainEntity: { '@id': `${SITE_URL}${articlePath}#article` },
    ...(blogProductRouteSlug != null
      ? {
          about: {
            '@type': 'Product',
            '@id': `${SITE_URL}/product/${blogProductRouteSlug}#product`,
            url: `${SITE_URL}/product/${blogProductRouteSlug}`,
            name: productName,
          },
          mentions: {
            '@type': 'Product',
            '@id': `${SITE_URL}/product/${blogProductRouteSlug}#product`,
            url: `${SITE_URL}/product/${blogProductRouteSlug}`,
            name: productName,
          },
        }
      : {}),
    relatedLink: [`${SITE_URL}/blog`, `${SITE_URL}/research`, `${SITE_URL}/protocols`],
    isPartOf: { '@id': `${SITE_URL}/blog` },
  };
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: article.title, path: `/blog/${slug}` },
  ]);

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-blog-post" data={articleSchema} />
        <StructuredData id="jsonld-blog-page" data={webPageSchema} />
        <StructuredData id="jsonld-blog-breadcrumb" data={breadcrumbSchema} />
      </Suspense>
      <BlogArticleClient slug={slug} />
    </>
  );
}
