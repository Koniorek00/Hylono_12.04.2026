import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/seo-metadata';
import { env } from '@/lib/env';
import { ORGANIZATION_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { TermsOfServicePage } from '@/components/legal/PolicyPages';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Terms of Service | Orders, Payments, and Site Use',
  description:
    'Review the public terms governing Hylono site use, checkout methods, wellness-product positioning, and linked purchase policies.',
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
              name: 'Hylono Terms of Service',
              description:
                'Review the public terms governing Hylono site use, checkout methods, wellness-product positioning, and linked purchase policies.',
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
            { name: 'Terms of Service', path: '/terms' },
          ])}
        />
      </Suspense>
      <TermsOfServicePage />
    </>
  );
}
