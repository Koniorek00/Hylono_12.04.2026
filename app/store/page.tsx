import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TECH_DETAILS } from '@/constants';
import { storePlanningLinks } from '@/content/topical-graph';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createCollectionPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { getAllTechRouteSlugs, getTechTypeFromRouteSlug } from '@/lib/product-routes';
import StructuredData from '@/src/components/StructuredData';
import { StaticStructuredData } from '@/src/components/StaticStructuredData';
import { StoreClient } from './StoreClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

// [DECISION: store route is semi-dynamic catalog content and should use cache components/runtime cache behavior; reverse if inventory/pricing moves to strict per-request rendering.]
// Rendering strategy: server-rendered catalog metadata and schema, with crawlable links preserved in HTML while interactive comparison stays in the client layer.

export const metadata: Metadata = createPageMetadata({
  title: 'Wellness Technology Store | Compare Rentals, Prices and Device Specs',
  description:
    'Browse Hylono wellness technology devices with rental pricing, purchase paths, setup guidance, protocol context, and support links.',
  path: '/store',
});

export default function StorePage() {
  const storePlanningAbsoluteLinks = storePlanningLinks.map((link) => `${SITE_URL}${link.href}`);
  const techSlugs = getAllTechRouteSlugs();
  const techTermSetSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}/store#tech-term-set`,
    name: 'Hylono Wellness Technology Taxonomy',
    description: 'Formal set of wellness technology modalities offered by Hylono, including oxygen, hydrogen, light, and signal-based systems.',
    url: `${SITE_URL}/store`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    publisher: { '@id': ORGANIZATION_ID() },
    isPartOf: { '@id': WEBSITE_ID() },
    hasDefinedTerm: techSlugs.map((slug) => {
      const techType = getTechTypeFromRouteSlug(slug);
      const tech = techType ? TECH_DETAILS[techType] : null;
      return {
        '@type': 'DefinedTerm',
        '@id': `${SITE_URL}/product/${slug}#term`,
        name: tech?.name ?? slug.toUpperCase(),
        url: `${SITE_URL}/product/${slug}`,
        description: tech?.plainDescription ?? '',
        inDefinedTermSet: `${SITE_URL}/store#tech-term-set`,
      };
    }),
  };
  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/store#product-list`,
    name: 'Hylono wellness technology devices',
    description:
      'Browse Hylono oxygen, hydrogen, red-light, and signal-based wellness systems with rental pricing and protocol support.',
    url: `${SITE_URL}/store`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    isPartOf: { '@id': WEBSITE_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    numberOfItems: techSlugs.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: techSlugs.map((slug, index) => {
      const techType = getTechTypeFromRouteSlug(slug);
      const tech = techType ? TECH_DETAILS[techType] : null;
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/product/${slug}`,
        item: {
          '@type': 'Product',
          '@id': `${SITE_URL}/product/${slug}#product`,
          name: `Hylono ${tech?.name ?? slug}`,
          description: tech?.plainDescription ?? '',
          url: `${SITE_URL}/product/${slug}`,
          brand: { '@type': 'Brand', '@id': `${SITE_URL}/#brand`, name: 'Hylono', url: SITE_URL },
          hasWarranty: { '@id': `${SITE_URL}/warranty#standard-warranty` },
          potentialAction: { '@type': 'ViewAction', target: `${SITE_URL}/product/${slug}` },
          offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/product/${slug}`,
            name: 'Monthly rental plan',
            priceCurrency: 'EUR',
            price: tech?.rentalPrice,
            validFrom: SCHEMA_DATE_MODIFIED,
            itemCondition: 'https://schema.org/NewCondition',
            availability:
              (tech?.inventory.available ?? 0) > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            eligibleRegion: { '@type': 'Place', name: 'European Union' },
            businessFunction: 'https://purl.org/goodrelations/v1#LeaseOut',
            seller: { '@id': ORGANIZATION_ID() },
            shippingDetails: { '@id': `${SITE_URL}/shipping#shipping-policy` },
            hasMerchantReturnPolicy: { '@id': `${SITE_URL}/returns#return-policy` },
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              priceCurrency: 'EUR',
              price: tech?.rentalPrice,
              billingDuration: 1,
              unitText: 'month',
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: 1,
                unitCode: 'MON',
              },
            },
          },
        },
      };
    }),
  };

  return (
    <>
      <StaticStructuredData id="jsonld-store-tech-term-set" data={techTermSetSchema} />
      <StaticStructuredData id="jsonld-store-product-list" data={productListSchema} />
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-store-page"
          data={{
            ...createCollectionPageSchema({
              name: 'Hylono Store',
              description:
                'Browse Hylono wellness technology devices with rental pricing, purchase paths, setup guidance, protocol context, and support links.',
              path: '/store',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: techSlugs.map((slug) => {
              const techType = getTechTypeFromRouteSlug(slug);
              const tech = techType ? TECH_DETAILS[techType] : null;
              return {
                '@type': 'Product',
                '@id': `${SITE_URL}/product/${slug}#product`,
                name: `Hylono ${tech?.name ?? slug.toUpperCase()}`,
                url: `${SITE_URL}/product/${slug}`,
              };
            }),
            mentions: techSlugs.map((slug) => ({
              '@type': 'Product',
              '@id': `${SITE_URL}/product/${slug}#product`,
              url: `${SITE_URL}/product/${slug}`,
            })),
            keywords: 'wellness technology store, hyperbaric oxygen chamber rental, hydrogen therapy device, red light therapy device, PEMF device rental, HBOT, wellness equipment purchase',
            mainEntity: { '@id': `${SITE_URL}/store#product-list` },
            relatedLink: [...storePlanningAbsoluteLinks, `${SITE_URL}/warranty`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#store-hero-headline', '#store-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-store-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Store', path: '/store' },
          ])}
        />
      </Suspense>
      <StoreClient />
    </>
  );
}
