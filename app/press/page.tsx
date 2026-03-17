import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import StructuredData from '@/src/components/StructuredData';
import { PressClient } from './PressClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Press & Media | Releases, Media Assets, and Company Facts',
  description: 'Access Hylono press releases, media assets, and company facts for editorial coverage.',
  path: '/press',
});

// [DECISION: ISR because press assets and mentions can update on a periodic cadence.]
export default function PressPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-press-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Press & Media',
              description:
                'Access Hylono press releases, media assets, and company facts for editorial coverage.',
              path: '/press',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            '@type': 'CollectionPage',
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': ORGANIZATION_ID() },
            keywords: 'Hylono press, media kit, press releases, company facts, wellness technology media',
            mentions: [
              { '@type': 'Organization', '@id': ORGANIZATION_ID() },
              { '@type': 'Brand', '@id': `${SITE_URL}/#brand` },
            ],
            relatedLink: [`${SITE_URL}/about`, `${SITE_URL}/research`, `${SITE_URL}/contact`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#press-hero-headline', '#press-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-press-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Press', path: '/press' },
          ])}
        />
      </Suspense>
      <PressClient />
    </>
  );
}
