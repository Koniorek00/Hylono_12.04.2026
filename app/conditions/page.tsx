import type { Metadata } from 'next';
import { Suspense } from 'react';
import { conditionGoals } from '@/content/conditions';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createCollectionPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { StaticStructuredData } from '@/src/components/StaticStructuredData';
import { ConditionsClient } from './ConditionsClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

const MODALITY_SLUG_TO_PRODUCT_ROUTE: Record<string, string> = {
  HBOT: 'hbot',
  H2: 'hydrogen',
  RLT: 'rlt',
  PEMF: 'pemf',
};

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Condition Guides | Recovery, Sleep, Stress, Comfort, and Vitality',
  description:
    'Explore Hylono condition-focused wellness guides with protocol pathways, modality relevance, and research references.',
  path: '/conditions',
});

// [DECISION: SSG because this educational overview is static informational content.]
export default function ConditionsPageRoute() {
  const conditionListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/conditions#condition-list`,
    name: 'Hylono condition wellness guides',
    description:
      'Condition-focused wellness guides covering recovery, sleep, stress, comfort, and vitality with protocol pathways and modality comparisons.',
    url: `${SITE_URL}/conditions`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    isPartOf: { '@id': WEBSITE_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    numberOfItems: conditionGoals.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: conditionGoals.map((goal, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/conditions/${goal.slug}`,
      item: {
        '@type': 'MedicalWebPage',
        '@id': `${SITE_URL}/conditions/${goal.slug}`,
        name: `${goal.title} wellness guide`,
        description: goal.subtitle,
        url: `${SITE_URL}/conditions/${goal.slug}`,
        inLanguage: 'en',
        about: {
          '@type': 'MedicalCondition',
          '@id': `${SITE_URL}/conditions/${goal.slug}#condition`,
          name: goal.title,
        },
        isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/conditions` },
        publisher: { '@id': ORGANIZATION_ID() },
        keywords: [goal.title, ...goal.modalities.map((m) => m.shortName)].join(', '),
        mentions: goal.modalities
          .filter((m) => Boolean(MODALITY_SLUG_TO_PRODUCT_ROUTE[m.slug]))
          .map((m) => ({
            '@type': 'Product',
            '@id': `${SITE_URL}/product/${MODALITY_SLUG_TO_PRODUCT_ROUTE[m.slug]}#product`,
            url: `${SITE_URL}/product/${MODALITY_SLUG_TO_PRODUCT_ROUTE[m.slug]}`,
          })),
        potentialAction: { '@type': 'ReadAction', target: [`${SITE_URL}/conditions/${goal.slug}`] },
      },
    })),
  };

  const conditionTermSetSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}/conditions#term-set`,
    name: 'Hylono Wellness Goal Taxonomy',
    description: 'Formal set of wellness goals and conditions addressed by Hylono technology protocols.',
    url: `${SITE_URL}/conditions`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    publisher: { '@id': ORGANIZATION_ID() },
    isPartOf: { '@id': WEBSITE_ID() },
    hasDefinedTerm: conditionGoals.map((goal) => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}/conditions/${goal.slug}#term`,
      name: goal.title,
      url: `${SITE_URL}/conditions/${goal.slug}`,
      description: goal.subtitle,
      inDefinedTermSet: `${SITE_URL}/conditions#term-set`,
    })),
  };

  return (
    <>
      <StaticStructuredData id="jsonld-conditions-term-set" data={conditionTermSetSchema} />
      <StaticStructuredData id="jsonld-conditions-list" data={conditionListSchema} />
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-conditions-page"
          data={{
            ...createCollectionPageSchema({
              name: 'Condition Wellness Guides',
              description:
                'Explore Hylono condition-focused wellness guides with protocol pathways, modality relevance, and research references.',
              path: '/conditions',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: conditionGoals.map((goal) => ({
              '@type': 'MedicalCondition',
              '@id': `${SITE_URL}/conditions/${goal.slug}#condition`,
              name: goal.title,
              url: `${SITE_URL}/conditions/${goal.slug}`,
            })),
            keywords: 'wellness condition guides, recovery wellness, sleep wellness, stress relief, pain comfort, vitality wellness, hyperbaric oxygen, hydrogen therapy, PEMF, red light therapy',
            mainEntity: { '@id': `${SITE_URL}/conditions#condition-list` },
            relatedLink: [`${SITE_URL}/protocols`, `${SITE_URL}/research`, `${SITE_URL}/store`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#conditions-hero-headline', '#conditions-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-conditions-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Conditions', path: '/conditions' },
          ])}
        />
      </Suspense>
      <ConditionsClient />
    </>
  );
}
