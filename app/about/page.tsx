import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import { AboutPage } from '@/components/AboutPage';
import StructuredData from '@/src/components/StructuredData';

export const metadata: Metadata = createPageMetadata({
  title: 'About Hylono | European Wellness Technology Mission and Team',
  description:
    'Learn about Hylono, our mission, and the team behind European wellness technology guidance, support, and device access.',
  path: '/about',
});

// [DECISION: SSG because this is static informational brand content with no per-request personalization.]
export default function AboutPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-about-page"
          data={{
            ...createWebPageSchema({
              name: 'About Hylono',
              description:
                'Learn about Hylono, our mission, and the team behind European wellness technology guidance, support, and device access.',
              path: '/about',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            '@type': 'AboutPage',
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': ORGANIZATION_ID() },
            keywords: 'Hylono, wellness technology company, European wellness platform, hyperbaric oxygen, hydrogen therapy, red light therapy, PEMF, evidence-informed wellness',
            mentions: [
              { '@type': 'Organization', '@id': ORGANIZATION_ID() },
              { '@type': 'Brand', '@id': `${SITE_URL}/#brand` },
              { '@type': 'CollectionPage', '@id': `${SITE_URL}/store`, url: `${SITE_URL}/store` },
              { '@type': 'MedicalWebPage', '@id': `${SITE_URL}/research`, url: `${SITE_URL}/research` },
            ],
            relatedLink: [`${SITE_URL}/press`, `${SITE_URL}/research`, `${SITE_URL}/contact`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#about-hero-headline', '#about-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-about-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ])}
        />
      </Suspense>
      <AboutPage />
    </>
  );
}
