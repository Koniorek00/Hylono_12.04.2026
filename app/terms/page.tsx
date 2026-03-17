import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/seo-metadata';
import { env } from '@/lib/env';
import { ORGANIZATION_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { TermsClient } from './TermsClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Terms & Conditions | Orders, Rentals, and Platform Use',
  description: 'Review Hylono terms and conditions for orders, rentals, services, and platform usage.',
  path: '/terms',
});

// [DECISION: SSG because terms are static legal content versioned by deploy.]
export default function TermsPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-terms-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Terms & Conditions',
              description:
                'Review Hylono terms and conditions for orders, rentals, services, and platform usage.',
              path: '/terms',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': ORGANIZATION_ID() },
            relatedLink: [`${SITE_URL}/privacy`, `${SITE_URL}/cookie-policy`, `${SITE_URL}/contact`],
          }}
        />
        <StructuredData
          id="jsonld-terms-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Terms & Conditions', path: '/terms' },
          ])}
        />
      </Suspense>
      <TermsClient />
    </>
  );
}
