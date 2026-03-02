import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import StructuredData from '@/src/components/StructuredData';
import HomeClient from './HomeClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono — Therapy Device Rental & Purchase',
  description:
    'EU medtech wellness platform for premium bio-optimization systems, rental plans, and guided protocols designed to support wellbeing.',
  path: '/',
});

export default function HomePage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hylono',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description:
      'EU medtech wellness platform for premium bio-optimization systems, rental plans, and guided protocols designed to support wellbeing.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@hylono.eu',
      availableLanguage: ['en', 'de', 'pl', 'nl'],
    },
    areaServed: 'Europe',
  };

  return (
    <>
      <noscript>
        <section aria-label="Homepage no-script summary" className="mx-auto max-w-3xl px-6 py-8 text-slate-900">
          <h1 className="text-2xl font-semibold">Hylono wellness technology platform</h1>
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
      <StructuredData id="jsonld-organization" data={organizationSchema} />
      <HomeClient />
    </>
  );
}