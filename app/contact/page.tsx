import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import StructuredData from '@/src/components/StructuredData';
import {
  ORGANIZATION_ID,
  createBreadcrumbSchema,
  createWebPageSchema,
  SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { ContactClient } from './ContactClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Contact Hylono | Support, Rentals, and Product Guidance',
  description:
    'Contact Hylono support for rental planning, product guidance, logistics questions, and general customer assistance.',
  path: '/contact',
});

// [DECISION: SSG because contact details and form shell are static route content.]
export default function ContactPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-contact-page"
          data={{
            ...createWebPageSchema({
              name: 'Contact Hylono',
              description:
                'Contact Hylono support for rental planning, product guidance, logistics questions, and general customer assistance.',
              path: '/contact',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            '@type': 'ContactPage',
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': ORGANIZATION_ID() },
            keywords: 'contact Hylono, customer support, wellness device rental support, product guidance, logistics questions',
            relatedLink: [`${SITE_URL}/help`, `${SITE_URL}/faq`, `${SITE_URL}/about`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#contact-hero-headline', '#contact-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-contact-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ])}
        />
      </Suspense>
      <ContactClient />
    </>
  );
}
