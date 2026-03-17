import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/seo-metadata';
import { env } from '@/lib/env';
import { ORGANIZATION_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { PrivacyClient } from './PrivacyClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Privacy Policy | GDPR Data Use, Storage, and Rights',
  description: 'Review how Hylono processes, protects, and governs your data in line with GDPR principles.',
  path: '/privacy',
});

// [DECISION: SSG because privacy policy is static legal content tied to deploy revisions.]
export default function PrivacyPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-privacy-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Privacy Policy',
              description:
                'Review how Hylono processes, protects, and governs your data in line with GDPR principles.',
              path: '/privacy',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': ORGANIZATION_ID() },
            relatedLink: [`${SITE_URL}/cookie-policy`, `${SITE_URL}/terms`, `${SITE_URL}/contact`],
          }}
        />
        <StructuredData
          id="jsonld-privacy-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ])}
        />
      </Suspense>
      <PrivacyClient />
    </>
  );
}
