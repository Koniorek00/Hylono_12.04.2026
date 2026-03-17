import type { Metadata } from 'next';
import { Suspense } from 'react';
import { researchContent } from '@/content/research';
import { siteOwnership } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createMedicalWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { ResearchClient } from './ResearchClient';

// [DECISION: research route is content-heavy and cache-friendly; runtime caching is preferred unless frequent per-request freshness is required.]

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Research Hub | Wellness Technology Evidence and Insights',
  description:
    'Review Hylono research insights, evidence summaries, and science-led wellness resources linked to products and protocols.',
  path: '/research',
});

export default function ResearchPageRoute() {
  const RESEARCH_MODALITY_PRODUCT_ROUTE: Record<string, string> = {
    mHBOT: 'hbot',
    H2: 'hydrogen',
  };
  const RESEARCH_MODALITY_PRODUCT_NAME: Record<string, string> = {
    mHBOT: 'Hylono mHBOT',
    H2: 'Hylono Hydrogen',
  };
  const researchStudyList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}/research#study-list`,
    name: 'Hylono research references',
    description: researchContent.subtitle,
    url: `${env.NEXT_PUBLIC_SITE_URL}/research`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    keywords: ['hyperbaric oxygen therapy', 'hydrogen wellness', 'mHBOT', 'wellness technology research', 'H2 therapy'],
    isPartOf: { '@id': WEBSITE_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: researchContent.studies.length,
    itemListElement: researchContent.studies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: study.url,
      item: {
        '@type': 'ScholarlyArticle',
        '@id': study.doi ? `https://doi.org/${study.doi}` : study.url,
        headline: study.title,
        description: study.summary,
        abstract: study.summary,
        url: study.url,
        inLanguage: 'en',
        datePublished: study.year.toString(),
        genre: study.studyType,
        about: {
          '@type': 'Product',
          '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/${RESEARCH_MODALITY_PRODUCT_ROUTE[study.modality] ?? study.modality}#product`,
          url: `${env.NEXT_PUBLIC_SITE_URL}/product/${RESEARCH_MODALITY_PRODUCT_ROUTE[study.modality] ?? study.modality}`,
          name: RESEARCH_MODALITY_PRODUCT_NAME[study.modality] ?? study.modality,
        },
        ...(study.doi
          ? {
              identifier: { '@type': 'PropertyValue', propertyID: 'doi', value: study.doi },
              sameAs: [`https://doi.org/${study.doi}`, study.url],
            }
          : {}),
        potentialAction: { '@type': 'ReadAction', target: [study.url] },
      },
    })),
  };

  const researchPageSchemaBase = createMedicalWebPageSchema({
    name: 'Hylono Research Hub',
    description:
      'Review Hylono research insights, evidence summaries, and science-led wellness resources linked to products and protocols.',
    abstract:
      'Curated peer-reviewed evidence summaries on mild hyperbaric oxygen therapy, hydrogen wellness, and protocol-guided wellness, with study citations and modality comparisons.',
    path: '/research',
    about: ['Mild Hyperbaric Oxygen Therapy', 'Hydrogen wellness technology', 'Protocol planning'],
    citations: researchContent.studies.map((study) => ({
      title: study.title,
      url: study.url,
      doi: study.doi,
      year: study.year,
    })),
    mainEntity: { '@id': `${env.NEXT_PUBLIC_SITE_URL}/research#study-list` },
    reviewedByName: siteOwnership.research.team,
    speakableSelectors: ['#research-answer-summary', '#research-library-disclaimer'],
    dateModified: SCHEMA_DATE_MODIFIED,
    lastReviewed: SCHEMA_DATE_MODIFIED,
  });

  const researchProductMentions = [...new Set(researchContent.studies.map((s) => s.modality))]
    .map((m) => RESEARCH_MODALITY_PRODUCT_ROUTE[m])
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      '@type': 'Product',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/${slug}#product`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/product/${slug}`,
    }));
  const researchPageSchema = {
    ...researchPageSchemaBase,
    about: [
      { '@type': 'Product', '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/hbot#product`, name: 'Hylono mHBOT', url: `${env.NEXT_PUBLIC_SITE_URL}/product/hbot` },
      { '@type': 'Product', '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/hydrogen#product`, name: 'Hylono Hydrogen', url: `${env.NEXT_PUBLIC_SITE_URL}/product/hydrogen` },
    ],
    keywords: 'hyperbaric oxygen therapy research, hydrogen wellness evidence, mHBOT clinical studies, H2 therapy research, wellness technology evidence',
    ...(researchProductMentions.length > 0 ? { mentions: researchProductMentions } : {}),
    relatedLink: [
      `${env.NEXT_PUBLIC_SITE_URL}/protocols`,
      `${env.NEXT_PUBLIC_SITE_URL}/conditions`,
      `${env.NEXT_PUBLIC_SITE_URL}/store`,
    ],
  };

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-research-page" data={researchPageSchema} />
        <StructuredData id="jsonld-research-study-list" data={researchStudyList} />
        <StructuredData
          id="jsonld-research-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Research', path: '/research' },
          ])}
        />
      </Suspense>
      <ResearchClient />
    </>
  );
}
