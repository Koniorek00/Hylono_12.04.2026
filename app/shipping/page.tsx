import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createWebPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { ShippingClient } from './ShippingClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Shipping Information | Delivery Timelines, Regions, and Logistics',
  description:
    'View Hylono shipping timelines, delivery methods, and logistics policies for your region before ordering or arranging a rental.',
  path: '/shipping',
});

// [DECISION: SSG because shipping policy and timelines are static informational content.]

// Entity schema – @id referenced by Product offers shippingDetails
const shippingPolicySchema = {
  '@context': 'https://schema.org',
  '@type': 'OfferShippingDetails',
  '@id': `${SITE_URL}/shipping#shipping-policy`,
  url: `${SITE_URL}/shipping`,
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: 0,
    currency: 'EUR',
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'EU',
    name: 'European Union',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 1,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 5,
      maxValue: 10,
      unitCode: 'DAY',
    },
    cutoffTime: '16:00:00',
    businessDays: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  },
  doesNotShip: false,
  isPartOf: { '@id': WEBSITE_ID() },
  publisher: { '@id': ORGANIZATION_ID() },
};

export default function ShippingPageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-shipping-policy" data={shippingPolicySchema} />
        <StructuredData
          id="jsonld-shipping-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Shipping Information',
              description:
                'View Hylono shipping timelines, delivery methods, and logistics policies for your region.',
              path: '/shipping',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            mainEntity: { '@id': `${SITE_URL}/shipping#shipping-policy` },
            keywords: 'Hylono shipping, delivery timelines, free shipping EU, wellness device delivery, European logistics',
            relatedLink: [`${SITE_URL}/warranty`, `${SITE_URL}/returns`, `${SITE_URL}/help`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#shipping-hero-headline'],
            },
          }}
        />
        <StructuredData
          id="jsonld-shipping-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Shipping', path: '/shipping' },
          ])}
        />
      </Suspense>
      <ShippingClient />
    </>
  );
}
