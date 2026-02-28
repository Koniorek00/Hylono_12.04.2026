import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import StructuredData from '@/src/components/StructuredData';
import { FaqClient } from './FaqClient';

export const metadata: Metadata = createPageMetadata({
  title: 'FAQ',
  description: 'Find answers to common questions about Hylono devices, safety, rental options, and support.',
  path: '/faq',
});

export default function FaqPageRoute() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylono.eu';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Hylono?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hylono is an EU medtech wellness platform offering technology-supported routines designed to support wellbeing, recovery, and lifestyle optimization.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are Hylono products medical treatments?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Hylono products are designed to support wellbeing and recovery routines, and are not intended to diagnose, treat, cure, or prevent disease.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer rental options?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Hylono offers rental and financing options for selected devices, allowing clients to begin with flexible monthly plans.',
        },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: `${siteUrl}/faq`,
      },
    ],
  };

  return (
    <>
      <StructuredData id="jsonld-faq" data={faqSchema} />
      <StructuredData id="jsonld-faq-breadcrumb" data={breadcrumbSchema} />
      <FaqClient />
    </>
  );
}
