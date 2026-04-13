import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFaqSchema,
  createRentalProductSchema,
  createRentalServiceSchema,
  SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { rentalLandingContent, rentalProducts } from '@/content/rental';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import { RentalClient } from './RentalClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Rentals | Monthly Wellness Technology Plans, Pricing, and Support',
  description:
    'Explore flexible monthly Hylono rental plans for wellness technologies with guided onboarding, delivery support, and purchase-path context.',
  path: '/rental',
});

// [DECISION: ISR because rental catalog and pricing context is semi-dynamic.]
export default function RentalPageRoute() {
  const faqItems = rentalLandingContent.faq.map((item) => ({
    question: item.q,
    answer: item.a,
  }));
  const rentalProductMentions = [
    ...new Set(rentalProducts.map((product) => product.productPath)),
  ].map((path) => ({
    '@type': 'Product',
    '@id': `${SITE_URL}${path}#product`,
    url: `${SITE_URL}${path}`,
  }));
  const lowestRentalPrice = rentalProducts.length
    ? Math.min(...rentalProducts.map((product) => product.rentalMonthly))
    : 0;
  const rentalHowToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${SITE_URL}/rental#howto`,
    name: 'How to start a Hylono device rental',
    description: 'Start a monthly wellness device rental plan with delivery, guided onboarding, and flexible return or purchase options.',
    url: `${SITE_URL}/rental`,
    inLanguage: 'en',
    totalTime: 'PT10M',
    isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/rental` },
    publisher: { '@id': ORGANIZATION_ID() },
    about: { '@id': `${SITE_URL}/rental#service` },
    yield: { '@type': 'DefinedTerm', name: 'Active wellness device rental plan' },
    step: rentalLandingContent.howItWorks.map((step) => ({
      '@type': 'HowToStep',
      position: step.number,
      name: step.title,
      text: step.text,
    })),
  };

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-rental-page"
          data={{
            ...createCollectionPageSchema({
              name: 'Hylono Rentals',
              description:
                'Explore flexible monthly Hylono rental plans for wellness technologies with guided onboarding, delivery support, and purchase-path context.',
              path: '/rental',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: rentalProducts.map((product) => ({
              '@type': 'Product',
              '@id': `${SITE_URL}${product.productPath}#product`,
              name: product.title,
              url: `${SITE_URL}${product.productPath}`,
            })),
            ...(rentalProductMentions.length > 0 ? { mentions: rentalProductMentions } : {}),
            mainEntity: lowestRentalPrice > 0
              ? { '@id': `${SITE_URL}/rental#service` }
              : { '@id': `${SITE_URL}/rental#faq` },
            relatedLink: [
              `${SITE_URL}/conditions`,
              `${SITE_URL}/research`,
              `${SITE_URL}/store`,
              `${SITE_URL}/protocols`,
              `${SITE_URL}/contact`,
              `${SITE_URL}/shipping`,
              `${SITE_URL}/returns`,
            ],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#rental-hero-headline', '#rental-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-rental-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Rental', path: '/rental' },
          ])}
        />
        <StructuredData id="jsonld-rental-faq" data={createFaqSchema(faqItems, '/rental', 'Hylono Rental FAQ')} />
        <StructuredData id="jsonld-rental-howto" data={rentalHowToSchema} />
        {lowestRentalPrice > 0 ? (
          <>
            <StructuredData
              id="jsonld-rental-offer"
              data={createRentalProductSchema({
                name: 'Hylono wellness technology rentals',
                description:
                  'Monthly rental plans for Hylono wellness technologies with onboarding, support, and flexible return or purchase pathways.',
                path: '/rental',
                monthlyPrice: lowestRentalPrice,
              })}
            />
            <StructuredData
              id="jsonld-rental-service"
              data={createRentalServiceSchema({
                name: 'Hylono Wellness Technology Rental Service',
                description:
                  'Monthly rental plans for wellness technology devices with guided onboarding, delivery support, and flexible return or purchase pathways.',
                path: '/rental',
                monthlyPrice: lowestRentalPrice,
              })}
            />
          </>
        ) : null}
      </Suspense>
      <RentalClient />
    </>
  );
}
