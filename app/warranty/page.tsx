import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { WarrantyPolicyPage } from '@/components/legal/PolicyPages';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Warranty | 2-Year Coverage and Support',
  description:
    'Review Hylono’s published 2-year warranty term, parts-and-labor scope, covered issue categories, and the public support route.',
  path: '/warranty',
});

// [DECISION: SSG because warranty policy content is static legal-commercial guidance.]

// Entity schemas – @id referenced by Product hasWarranty
const standardWarrantySchema = {
  '@context': 'https://schema.org',
  '@type': 'WarrantyPromise',
  '@id': `${SITE_URL}/warranty#standard-warranty`,
  url: `${SITE_URL}/warranty`,
  name: 'Hylono 2-Year Standard Warranty',
  description:
    'All Hylono devices include a 2-year standard warranty covering manufacturing defects, component failures, electronic malfunctions, and structural issues at no cost.',
  durationOfWarranty: {
    '@type': 'QuantitativeValue',
    value: 2,
    unitCode: 'ANN',
    unitText: 'years',
  },
  warrantyScope: 'https://schema.org/PartsAndLabor',
  seller: { '@id': ORGANIZATION_ID() },
  isPartOf: { '@id': WEBSITE_ID() },
};

export default function WarrantyPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-warranty-promise" data={standardWarrantySchema} />
        <StructuredData
          id="jsonld-warranty-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Warranty',
              description:
                'Review Hylono’s published 2-year warranty term, parts-and-labor scope, covered issue categories, and the public support route.',
              path: '/warranty',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': `${SITE_URL}/warranty#standard-warranty` },
            keywords: 'Hylono warranty, 2-year warranty, wellness device warranty, device coverage, parts and labor warranty',
            relatedLink: [`${SITE_URL}/returns`, `${SITE_URL}/shipping`, `${SITE_URL}/help`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#warranty-hero-headline', '#warranty-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-warranty-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Warranty', path: '/warranty' },
          ])}
        />
      </Suspense>
      <WarrantyPolicyPage />
    </>
  );
}
