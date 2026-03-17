import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/seo-metadata';
import { env } from '@/lib/env';
import { ORGANIZATION_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { CookiePolicyClient } from './CookiePolicyClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Cookie Policy | Consent, Analytics, and Preference Controls',
  description:
    'Understand how Hylono uses essential and analytics cookies, and how to control your cookie preferences.',
  path: '/cookie-policy',
});

// [DECISION: SSG because policy content is static and versioned by deploy.]
export default function CookiePolicyPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-cookie-policy-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Cookie Policy',
              description:
                'Understand how Hylono uses essential and analytics cookies, and how to control your cookie preferences.',
              path: '/cookie-policy',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': ORGANIZATION_ID() },
            relatedLink: [`${SITE_URL}/privacy`, `${SITE_URL}/terms`, `${SITE_URL}/contact`],
          }}
        />
        <StructuredData
          id="jsonld-cookie-policy-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Cookie Policy', path: '/cookie-policy' },
          ])}
        />
      </Suspense>
      <CookiePolicyClient />
    </>
  );
}
