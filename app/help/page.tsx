import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/seo-metadata';
import { env } from '@/lib/env';
import {
  ORGANIZATION_ID,
  createBreadcrumbSchema,
  createFaqSchema,
  createWebPageSchema,
  SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { HELP_FAQ_DATA } from '@/content/help-faq';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import StructuredData from '@/src/components/StructuredData';
import { HelpClient } from './HelpClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Help Center | FAQs, Contact Support, and Device Assistance',
  description:
    'Access Hylono FAQs, contact support, and device assistance in one help center for product, logistics, and protocol questions.',
  path: '/help',
});

type HelpTab = 'faq' | 'contact' | 'support';

const isHelpTab = (value: string): value is HelpTab => {
  return value === 'faq' || value === 'contact' || value === 'support';
};

// [DECISION: SSG because help center structure is static support content.]
export default async function HelpPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab;
  const initialTab: HelpTab = tab && isHelpTab(tab) ? tab : 'faq';
  const faqItems = HELP_FAQ_DATA.flatMap((category) =>
    category.items.map((item) => ({
      question: item.q,
      answer: item.a,
    }))
  );

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-help-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Help Center',
              description:
                'Access Hylono FAQs, contact support, and device assistance in one help center for product, logistics, and protocol questions.',
              path: '/help',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': `${SITE_URL}/help#faq` },
            relatedLink: [`${SITE_URL}/faq`, `${SITE_URL}/contact`, `${SITE_URL}/warranty`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#tabpanel-faq'],
            },
          }}
        />
        <StructuredData id="jsonld-help-faq" data={createFaqSchema(faqItems, '/help', 'Hylono Help Center FAQ')} />
        <StructuredData
          id="jsonld-help-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Help', path: '/help' },
          ])}
        />
      </Suspense>
      <HelpClient initialTab={initialTab} />
    </>
  );
}
