import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { env } from '@/lib/env';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import StructuredData from '@/src/components/StructuredData';
import { ReturnsClient } from './ReturnsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Returns & Refunds | Eligibility, Collections, and Refund Timelines',
  description:
    'Read Hylono return eligibility, collection flow, and refund processing timelines for device purchases across supported regions.',
  path: '/returns',
});

// [DECISION: SSG because returns policy content is static legal-operational guidance.]
const returnPolicySchema = {
  '@context': 'https://schema.org',
  '@type': 'MerchantReturnPolicy',
  '@id': `${SITE_URL}/returns#return-policy`,
  name: 'Hylono 30-Day Return Policy',
  url: `${SITE_URL}/returns`,
  applicableCountry: 'EU',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
  refundType: 'https://schema.org/FullRefund',
  inStoreReturnsOffered: false,
  merchantReturnLink: `${SITE_URL}/returns`,
  publisher: { '@id': ORGANIZATION_ID() },
  isPartOf: { '@id': WEBSITE_ID() },
};

export default function ReturnsPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-returns-policy" data={returnPolicySchema} />
        <StructuredData
          id="jsonld-returns-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Returns & Refunds',
              description:
                'Read Hylono return eligibility, collection flow, and refund processing timelines for device purchases.',
              path: '/returns',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': `${SITE_URL}/returns#return-policy` },
            keywords: 'Hylono returns, refund policy, 30-day return window, free return shipping, wellness device refund',
            relatedLink: [`${SITE_URL}/warranty`, `${SITE_URL}/shipping`, `${SITE_URL}/help`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#returns-hero-headline'],
            },
          }}
        />
        <StructuredData
          id="jsonld-returns-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Returns', path: '/returns' },
          ])}
        />
      </Suspense>
      <ReturnsClient />
    </>
  );
}
