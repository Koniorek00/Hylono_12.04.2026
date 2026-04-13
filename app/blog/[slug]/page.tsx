import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { BlogArticle } from '@/components/BlogArticle';
import { conditionGoals } from '@/content/conditions';
import { evidenceById } from '@/content/evidence';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
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

const CONDITION_LABELS = conditionGoals.reduce<Record<string, string>>((acc, goal) => {
  acc[goal.slug] = goal.title;
  return acc;
}, {});

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
    title: `${article.title} | Hylono Blog`,
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
      tags: [article.category, ...article.relatedConditionSlugs],
      authors: [siteOwnership.editorial.team],
    } as Metadata['openGraph'],
  };
}

// [DECISION: ISR because article content is semi-dynamic and should refresh on a timed cadence.]
// Rendering strategy: server-rendered article page with crawlable section content, visible review context, and internal next-step links.
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
  const datePublished = getBlogPublishedIsoDate(article.date) ?? `${SCHEMA_DATE_MODIFIED}T00:00:00.000Z`;
  const readTimeMinutes = parseInt(article.readTime, 10);
  const estimatedWordCount = readTimeMinutes > 0 ? readTimeMinutes * 200 : undefined;
  const blogProductRouteSlug = article.relatedProductRoute;
  const isTechArticle = blogProductRouteSlug != null;
  const blogProductTechType = blogProductRouteSlug ? getTechTypeFromRouteSlug(blogProductRouteSlug) : null;
  const productName = blogProductTechType
    ? `Hylono ${TECH_DETAILS[blogProductTechType].name}`
    : blogProductRouteSlug
      ? `Hylono ${article.category}`
      : '';
  const citationItems = article.evidenceIds
    .map((id) => evidenceById[id])
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const citationSchemas = citationItems.map((citation) => ({
    '@type': 'ScholarlyArticle',
    '@id': citation.doi ? `https://doi.org/${citation.doi}` : citation.sourceUrl,
    headline: citation.title,
    url: citation.sourceUrl,
    ...(citation.year ? { datePublished: citation.year.toString() } : {}),
    ...(citation.authors ? { author: { '@type': 'Person', name: citation.authors } } : {}),
    ...(citation.doi
      ? { identifier: { '@type': 'PropertyValue', propertyID: 'doi', value: citation.doi } }
      : {}),
  }));
  const aboutTerms = [
    article.category,
    ...article.relatedConditionSlugs.map((slug) => CONDITION_LABELS[slug] ?? slug),
  ];
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
    keywords: [article.category, ...article.relatedConditionSlugs, ...(productName ? [productName] : [])].join(', '),
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
    ...(citationSchemas.length > 0 ? { citation: citationSchemas } : {}),
    isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/blog`, url: `${SITE_URL}/blog` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#article-reader-title', '#article-reader-excerpt'],
    },
  };
  const articlePath = `/blog/${slug}`;
  const relatedLinks = [
    `${SITE_URL}/blog`,
    `${SITE_URL}/research`,
    `${SITE_URL}/protocols`,
    `${SITE_URL}/contact`,
    ...article.relatedConditionSlugs.map((conditionSlug) => `${SITE_URL}/conditions/${conditionSlug}`),
    ...(blogProductRouteSlug != null ? [`${SITE_URL}/product/${blogProductRouteSlug}`] : []),
  ].filter((value, index, array) => array.indexOf(value) === index);
  const aboutEntities = [
    ...(blogProductRouteSlug != null
      ? [{
          '@type': 'Product',
          '@id': `${SITE_URL}/product/${blogProductRouteSlug}#product`,
          url: `${SITE_URL}/product/${blogProductRouteSlug}`,
          name: productName,
        }]
      : []),
    ...aboutTerms.map((term) => ({
      '@type': 'DefinedTerm',
      name: term,
    })),
  ];
  const webPageSchema = {
    ...createWebPageSchema({
      name: article.title,
      description: article.excerpt,
      path: articlePath,
      dateModified: SCHEMA_DATE_MODIFIED,
    }),
    datePublished,
    mainEntity: { '@id': `${SITE_URL}${articlePath}#article` },
    about: aboutEntities,
    ...(citationSchemas.length > 0 ? { citation: citationSchemas } : {}),
    reviewedBy: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID(),
      name: siteOwnership.research.team,
      url: `${SITE_URL}/about`,
    },
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
    relatedLink: relatedLinks,
    lastReviewed: SCHEMA_DATE_MODIFIED,
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
      <BlogArticle article={article} />
    </>
  );
}
