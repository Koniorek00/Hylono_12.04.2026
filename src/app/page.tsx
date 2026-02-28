import type { Metadata } from 'next';
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylono.eu';

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
      <StructuredData id="jsonld-organization" data={organizationSchema} />
      <HomeClient />
    </>
  );
}