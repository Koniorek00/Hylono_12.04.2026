import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/env';
import { homepagePrimaryLinks } from '@/content/topical-graph';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import StructuredData from '@/src/components/StructuredData';
import HomeClient from './HomeClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Wellness Technology | Compare Rentals, Purchases and Protocols',
  description:
    'Compare Hylono oxygen, hydrogen, red-light, and signal-based wellness systems with rental paths, purchase options, and protocol guidance.',
  path: '/',
});

// [DECISION: SSG because homepage marketing shell is static and optimized for global caching.]
// Rendering strategy: server-rendered homepage with crawlable hub references, schema, and a client presentation layer for premium motion.
export default function HomePage() {
  const homepageAbsoluteLinks = homepagePrimaryLinks.map((link) => `${SITE_URL}${link.href}`);
  const webPageSchema = {
    ...createWebPageSchema({
      name: 'Hylono',
      description:
        'Compare Hylono oxygen, hydrogen, red-light, and signal-based wellness systems with rental paths, purchase options, and protocol guidance.',
      path: '/',
      dateModified: SCHEMA_DATE_MODIFIED,
    }),
    about: [
      { '@type': 'Product', '@id': `${SITE_URL}/product/hbot#product`, name: 'Hylono mHBOT', url: `${SITE_URL}/product/hbot` },
      { '@type': 'Product', '@id': `${SITE_URL}/product/hydrogen#product`, name: 'Hylono Hydrogen', url: `${SITE_URL}/product/hydrogen` },
      { '@type': 'Product', '@id': `${SITE_URL}/product/rlt#product`, name: 'Hylono PBM / Red Light', url: `${SITE_URL}/product/rlt` },
      { '@type': 'Product', '@id': `${SITE_URL}/product/pemf#product`, name: 'Hylono PEMF + VNS', url: `${SITE_URL}/product/pemf` },
      { '@type': 'CollectionPage', '@id': `${SITE_URL}/protocols`, name: 'Hylono Wellness Protocols', url: `${SITE_URL}/protocols` },
    ],
    keywords: 'hyperbaric oxygen therapy, hydrogen therapy, red light therapy, PEMF therapy, wellness technology rental, mHBOT, bio-optimization, evidence-informed wellness',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#home-hero-headline', '#home-hero-description'],
    },
    mainEntity: { '@id': ORGANIZATION_ID() },
    mentions: [
      { '@type': 'Product', '@id': `${SITE_URL}/product/hbot#product`, url: `${SITE_URL}/product/hbot` },
      { '@type': 'Product', '@id': `${SITE_URL}/product/hydrogen#product`, url: `${SITE_URL}/product/hydrogen` },
      { '@type': 'Product', '@id': `${SITE_URL}/product/rlt#product`, url: `${SITE_URL}/product/rlt` },
      { '@type': 'Product', '@id': `${SITE_URL}/product/pemf#product`, url: `${SITE_URL}/product/pemf` },
      { '@type': 'CollectionPage', '@id': `${SITE_URL}/protocols`, url: `${SITE_URL}/protocols` },
      { '@type': 'CollectionPage', '@id': `${SITE_URL}/conditions`, url: `${SITE_URL}/conditions` },
    ],
    significantLink: homepageAbsoluteLinks,
    relatedLink: [...homepageAbsoluteLinks, `${SITE_URL}/contact`],
  };

  return (
    <>
      <noscript>
        <section
          aria-label="Homepage no-script summary"
          className="mx-auto max-w-3xl px-6 py-8 text-slate-900"
        >
          <p className="text-2xl font-semibold">Hylono wellness technology platform</p>
          <p className="mt-3 text-base leading-7">
            Hylono provides access to oxygen, hydrogen, light, and signal-based systems through
            rental-first plans and guided protocols designed to support wellbeing.
          </p>
          <p className="mt-2 text-base leading-7">
            Enable JavaScript for the full interactive experience, or continue browsing key pages
            including protocols, product details, research, and contact.
          </p>
        </section>
      </noscript>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-homepage" data={webPageSchema} />
        <StructuredData
          id="jsonld-homepage-breadcrumb"
          data={createBreadcrumbSchema([{ name: 'Home', path: '/' }])}
        />
      </Suspense>
      <HomeClient />
    </>
  );
}
