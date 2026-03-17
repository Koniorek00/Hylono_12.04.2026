import type { Metadata } from 'next';
import { Suspense } from 'react';
import { partnerLocations, partnerTypeLabels } from '@/content/partners';
import { createPageMetadata } from '@/lib/seo-metadata';
import { createBreadcrumbSchema, createCollectionPageSchema } from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { LocatorClient } from './LocatorClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Partner Locator | Clinics, Showrooms, and Distributors',
  description:
    'Review Hylono partner, clinic, and distributor coverage across Europe before requesting a guided introduction.',
  path: '/locator',
  forceNoIndex: true,
});

// [DECISION: ISR because locator listings are semi-dynamic and should refresh periodically.]
export default function LocatorPageRoute() {
  const locatorCollectionSchema = createCollectionPageSchema({
    name: 'Hylono Partner Locator',
    description:
      'Review Hylono partner, clinic, and distributor coverage across Europe before requesting a guided introduction.',
    path: '/locator',
  });

  const locatorListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hylono partner locations',
    description:
      'A directory of Hylono showrooms, wellness clinics, and distributors currently listed across Europe.',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: partnerLocations.length,
    itemListElement: partnerLocations.map((partner, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type':
          partner.type === 'clinic'
            ? 'HealthAndBeautyBusiness'
            : partner.type === 'showroom'
              ? 'Store'
              : 'Organization',
        name: partner.name,
        description: `${partnerTypeLabels[partner.type]} in ${partner.city}, ${partner.country} offering ${partner.features.join(', ')} access.`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: partner.address,
          addressLocality: partner.city,
          addressCountry: partner.country,
        },
        telephone: partner.phone,
        email: partner.email,
        ...(partner.website ? { url: partner.website } : {}),
        areaServed: partner.country,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: partner.coordinates.lat,
          longitude: partner.coordinates.lng,
        },
      },
    })),
  };

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-locator-page" data={locatorCollectionSchema} />
        <StructuredData id="jsonld-locator-list" data={locatorListSchema} />
        <StructuredData
          id="jsonld-locator-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Partner Locator', path: '/locator' },
          ])}
        />
      </Suspense>
      <noscript>
        <section
          aria-label="Partner locator no-script summary"
          className="mx-auto max-w-4xl px-6 py-10 text-slate-900"
        >
          <p className="text-3xl font-semibold">Hylono partner locator</p>
          <p className="mt-4 text-base leading-7">
            Review Hylono showrooms, clinics, and distributors across Europe. JavaScript enables
            the interactive filters and map, but the current partner list is available below.
          </p>
          <ul className="mt-6 space-y-4">
            {partnerLocations.map((partner) => (
              <li key={partner.id} className="rounded-2xl border border-slate-200 p-4">
                <h2 className="text-lg font-semibold">{partner.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {partnerTypeLabels[partner.type]} in {partner.city}, {partner.country}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {partner.address} | {partner.phone} | {partner.email}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Technologies: {partner.features.join(', ')}. Hours: {partner.hours}.
                </p>
              </li>
            ))}
          </ul>
        </section>
      </noscript>
      <LocatorClient />
    </>
  );
}
