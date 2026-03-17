import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createProductSchema,
  createWebPageSchema,
  SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { TECH_DETAILS } from '@/constants';
import { BLOG_POSTS } from '@/constants/content';
import { toBlogSlug } from '@/lib/blog';
import { env } from '@/lib/env';
import StructuredData from '@/src/components/StructuredData';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import {
  getAllTechRouteSlugs,
  getTechRouteSlug,
  getTechTypeFromRouteSlug,
  LEGACY_PRODUCT_ROUTE_REDIRECTS,
} from '@/lib/product-routes';
import { ProductClient } from './ProductClient';

type Params = Promise<{ tech: string }>;

// [DECISION: product route is catalog-style semi-dynamic content and should rely on cache components/runtime caching; reverse if product data becomes per-user personalized.]

const resolveProductRoute = (rawTech: string) => {
  const normalizedTech = rawTech.toLowerCase();
  const legacyRedirect =
    LEGACY_PRODUCT_ROUTE_REDIRECTS[
      normalizedTech as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
    ];

  if (legacyRedirect) {
    permanentRedirect(`/product/${legacyRedirect}`);
  }

  const techType = getTechTypeFromRouteSlug(normalizedTech);
  if (!techType) {
    notFound();
  }

  const canonicalSlug = getTechRouteSlug(techType);
  if (normalizedTech !== canonicalSlug || rawTech !== canonicalSlug) {
    permanentRedirect(`/product/${canonicalSlug}`);
  }

  return { canonicalSlug, techData: TECH_DETAILS[techType] };
};

export function generateStaticParams() {
  return getAllTechRouteSlugs().map((tech) => ({ tech }));
}

const PRODUCT_OG_IMAGES: Record<string, string> = {
  hbot: '/images/chambers/oxyhelp-chambers-hero.jpg',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tech: rawTech } = await params;
  const { canonicalSlug, techData } = resolveProductRoute(rawTech);
  const productSummary =
    techData.descriptionStandard ||
    `Compare ${techData.name} pricing, rental options, specifications, and setup guidance.`;

  return createPageMetadata({
    title: `${techData.name} | Pricing, Rental Plans, Specs and Evidence`,
    description: productSummary,
    path: `/product/${canonicalSlug}`,
    ...(PRODUCT_OG_IMAGES[canonicalSlug]
      ? {
          ogImagePath: PRODUCT_OG_IMAGES[canonicalSlug],
          ogImageAlt: `Hylono ${techData.name} wellness technology device`,
        }
      : {}),
  });
}

export default async function ProductPageRoute({ params }: { params: Params }) {
  const { tech: rawTech } = await params;
  const { canonicalSlug, techData } = resolveProductRoute(rawTech);
  const productName = `Hylono ${techData.name}`;
  const productDescription =
    techData.descriptionStandard ||
    `Explore Hylono ${techData.name} technology details, practical usage guidance, and evidence-informed routines designed to support wellbeing goals.`;
  const PRODUCT_IMAGES: Record<string, string> = {
    hbot: '/images/chambers/oxyhelp-chambers-hero.jpg',
  };
  const similarProductSlugs = getAllTechRouteSlugs().filter((s) => s !== canonicalSlug);
  const priceStr = techData.price;
  const priceCurrency = priceStr.includes('$') ? 'USD' : priceStr.includes('€') ? 'EUR' : 'EUR';
  const priceValue = Number(priceStr.replace(/[^0-9.]/g, '')) || undefined;
  const productSchema = {
    ...createProductSchema({
      name: productName,
      description: productDescription,
      path: `/product/${canonicalSlug}`,
      price: priceValue,
      priceCurrency,
      availability:
        techData.inventory.available > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      imageUrl: PRODUCT_IMAGES[canonicalSlug],
    }),
    ...(techData.technicalSpecs && techData.technicalSpecs.length > 0
      ? {
          additionalProperty: techData.technicalSpecs.map((spec) => ({
            '@type': 'PropertyValue',
            name: spec.label,
            value: spec.value,
          })),
        }
      : {}),
    ...(techData.friendlyName ? { model: techData.friendlyName } : {}),
    ...(similarProductSlugs.length > 0
      ? {
          isSimilarTo: similarProductSlugs.map((s) => {
            const similarTechType = getTechTypeFromRouteSlug(s);
            const similarName = similarTechType ? `Hylono ${TECH_DETAILS[similarTechType].name}` : `Hylono ${s.toUpperCase()}`;
            return {
              '@type': 'Product',
              '@id': `${SITE_URL}/product/${s}#product`,
              name: similarName,
              url: `${SITE_URL}/product/${s}`,
            };
          }),
        }
      : {}),
    ...((() => {
      const PRODUCT_CATEGORY_MAP: Record<string, string> = {
        hbot: 'HBOT',
        pemf: 'PEMF',
        rlt: 'RLT',
        hydrogen: 'Hydrogen',
      };
      const blogCategory = PRODUCT_CATEGORY_MAP[canonicalSlug];
      if (!blogCategory) return {};
      const relatedPosts = BLOG_POSTS.filter((p) => p.category === blogCategory);
      if (relatedPosts.length === 0) return {};
      return {
        subjectOf: relatedPosts.map((post) => ({
          '@type': 'BlogPosting',
          '@id': `${SITE_URL}/blog/${toBlogSlug(post.title)}#article`,
          url: `${SITE_URL}/blog/${toBlogSlug(post.title)}`,
          headline: post.title,
        })),
      };
    })()),
  };
  const GOAL_TAG_TO_CONDITION_SLUG: Record<string, string | undefined> = {
    recovery: 'recovery',
    sleep: 'sleep',
    pain: 'comfort',
    stress: 'stress',
    vitality: 'vitality',
  };
  const conditionMentions = (techData.goalTags ?? [])
    .map((tag) => GOAL_TAG_TO_CONDITION_SLUG[tag])
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({
      '@type': 'MedicalWebPage',
      '@id': `${SITE_URL}/conditions/${slug}`,
      url: `${SITE_URL}/conditions/${slug}`,
      name: `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Wellness Guide`,
    }));
  const webPageSchema = {
    ...createWebPageSchema({
      name: productName,
      description: productDescription,
      path: `/product/${canonicalSlug}`,
      dateModified: SCHEMA_DATE_MODIFIED,
      imageUrl: PRODUCT_IMAGES[canonicalSlug],
    }),
    '@type': 'ItemPage',
    about: [
      { '@type': 'Product', '@id': `${SITE_URL}/product/${canonicalSlug}#product`, name: productName },
      ...(techData.goalTags ?? [])
        .map((tag) => GOAL_TAG_TO_CONDITION_SLUG[tag])
        .filter((s): s is string => Boolean(s))
        .map((slug) => ({
          '@type': 'MedicalCondition',
          '@id': `${SITE_URL}/conditions/${slug}#condition`,
          name: `${slug.charAt(0).toUpperCase()}${slug.slice(1)}`,
          url: `${SITE_URL}/conditions/${slug}`,
        })),
    ],
    mainEntity: { '@id': `${SITE_URL}/product/${canonicalSlug}#product` },
    keywords: [productName, ...(techData.goalTags ?? [])].join(', '),
    ...(conditionMentions.length > 0 ? { mentions: conditionMentions } : {}),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#product-hero'],
    },
    relatedLink: [
      `${SITE_URL}/rental`,
      `${SITE_URL}/protocols`,
      `${SITE_URL}/research`,
      `${SITE_URL}/conditions`,
    ],
  };
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: productName, path: `/product/${canonicalSlug}` },
  ]);
  const productFaqItems = (techData.faqs ?? []).map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-product-page" data={webPageSchema} />
        <StructuredData id="jsonld-product" data={productSchema} />
        <StructuredData id="jsonld-breadcrumb" data={breadcrumbSchema} />
        {productFaqItems.length > 0 && (
          <StructuredData
            id="jsonld-product-faq"
            data={createFaqSchema(productFaqItems, `/product/${canonicalSlug}`, `${productName} FAQ`)}
          />
        )}
      </Suspense>
      <ProductClient tech={canonicalSlug} />
    </>
  );
}
