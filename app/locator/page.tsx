import type { Metadata } from 'next';
import Link from 'next/link';
import {
  partnerDirectoryMeta,
  partnerLocations,
  partnerTypeDescriptions,
  partnerTypeLabels,
} from '@/content/partners';
import { buildLocatorContactHref } from '@/lib/contact-prefill';
import { createPageMetadata } from '@/lib/seo-metadata';
import { createBreadcrumbSchema, createCollectionPageSchema } from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';

export const metadata: Metadata = createPageMetadata({
  title: 'Find a Hylono Partner | Clinics, Showrooms, and Distributors',
  description:
    'Browse the currently listed Hylono clinics, showrooms, and distributors across Europe, then request a guided introduction.',
  path: '/locator',
  forceNoIndex: true,
});

const toLocatorCountryId = (country: string) =>
  `locator-country-${country
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;

const formatCountLabel = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

const listedCountries = [...new Set(partnerLocations.map((partner) => partner.country))].sort();
const listedTechnologies = [...new Set(partnerLocations.flatMap((partner) => partner.features))].sort();

const partnerTypeCounts = partnerLocations.reduce(
  (counts, partner) => {
    counts[partner.type] += 1;
    return counts;
  },
  { clinic: 0, distributor: 0, showroom: 0 }
);

const partnersByCountry = listedCountries.map((country) => ({
  country,
  countryId: toLocatorCountryId(country),
  partners: partnerLocations
    .filter((partner) => partner.country === country)
    .sort(
      (left, right) =>
        left.city.localeCompare(right.city) || left.name.localeCompare(right.name)
    ),
}));

const formattedPartnerVerificationDate = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
}).format(new Date(`${partnerDirectoryMeta.lastVerified}T00:00:00.000Z`));

// [DECISION: SSG because the locator is a noindex utility page backed by repo-controlled partner records.]
// Rendering strategy: server-rendered static HTML so the page stays usable without client-side filters or map hydration.
export default function LocatorPageRoute() {
  const locatorCollectionSchema = createCollectionPageSchema({
    name: 'Hylono Partner Locator',
    description:
      'Browse the currently listed Hylono clinics, showrooms, and distributors across Europe, then request a guided introduction.',
    path: '/locator',
    dateModified: partnerDirectoryMeta.lastVerified,
  });

  const locatorListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hylono partner listings',
    description:
      'A visible directory of the clinics, showrooms, and distributors currently listed on the Hylono locator page.',
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
      },
    })),
  };

  return (
    <>
      <StructuredData id="jsonld-locator-page" data={locatorCollectionSchema} />
      <StructuredData id="jsonld-locator-list" data={locatorListSchema} />
      <StructuredData
        id="jsonld-locator-breadcrumb"
        data={createBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Partner Locator', path: '/locator' },
        ])}
      />

      <div className="bg-slate-50 text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Partner directory
            </p>
            <h1
              id="locator-hero-headline"
              className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl"
            >
              Find a Hylono partner
            </h1>
            <p
              id="locator-hero-description"
              className="mt-5 max-w-3xl text-lg leading-8 text-slate-700"
            >
              Review the currently listed clinics, showrooms, and distributors across Europe, then
              request a guided introduction if you need the closest match for your city,
              technology, or partner type.
            </p>

            <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={buildLocatorContactHref({ intent: 'curious' })}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800 sm:w-auto sm:shrink-0 sm:whitespace-nowrap"
                >
                  Request partner introduction
                </Link>
                <Link
                  href="/rental"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:shrink-0 sm:whitespace-nowrap"
                >
                  Explore rental options
                </Link>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Use the listed contact details below to confirm hours, technology access, and the
                next available appointment route.
              </p>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <dt className="text-sm font-medium text-slate-600">Listed partners</dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-950">
                  {partnerLocations.length}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <dt className="text-sm font-medium text-slate-600">Countries covered</dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-950">
                  {listedCountries.length}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <dt className="text-sm font-medium text-slate-600">Partner mix</dt>
                <dd className="mt-2 text-lg font-semibold text-slate-950">
                  {formatCountLabel(partnerTypeCounts.showroom, 'showroom', 'showrooms')},{' '}
                  {formatCountLabel(partnerTypeCounts.clinic, 'clinic', 'clinics')},{' '}
                  {formatCountLabel(partnerTypeCounts.distributor, 'distributor', 'distributors')}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <dt className="text-sm font-medium text-slate-600">Technologies listed</dt>
                <dd className="mt-2 text-lg font-semibold text-slate-950">
                  {listedTechnologies.join(', ')}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-2">
              {listedCountries.map((country) => (
                <span
                  key={country}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                >
                  {country}
                </span>
              ))}
            </div>

            <section
              aria-labelledby="locator-directory-status"
              className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
            >
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    Directory status
                  </p>
                  <h2
                    id="locator-directory-status"
                    className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
                  >
                    How these listings work
                  </h2>
                </div>
                <p className="text-sm text-slate-600">
                  Last verified: <span className="font-medium text-slate-950">{formattedPartnerVerificationDate}</span>
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-semibold text-slate-950">
                    {partnerDirectoryMeta.verificationLabel}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {partnerDirectoryMeta.coverageLabel}. Keep using the route as a reviewed
                    directory rather than a live availability feed.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-semibold text-slate-950">Partner types</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                    <li>
                      <span className="font-medium text-slate-950">{partnerTypeLabels.showroom}:</span>{' '}
                      {partnerTypeDescriptions.showroom}
                    </li>
                    <li>
                      <span className="font-medium text-slate-950">{partnerTypeLabels.clinic}:</span>{' '}
                      {partnerTypeDescriptions.clinic}
                    </li>
                    <li>
                      <span className="font-medium text-slate-950">{partnerTypeLabels.distributor}:</span>{' '}
                      {partnerTypeDescriptions.distributor}
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-semibold text-slate-950">Best next step</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {partnerDirectoryMeta.nextStepLabel}.
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    <Link
                      href={buildLocatorContactHref({ intent: 'curious' })}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:whitespace-nowrap"
                    >
                      Start an introduction request
                    </Link>
                    <Link
                      href="/partners"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      Explore partner programme
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              Current listed partners
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              The locator stays focused on one task: help you review the currently listed coverage
              quickly and move to a guided introduction when you are ready.
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {partnersByCountry.map(({ country, countryId, partners }) => (
              <section key={country} aria-labelledby={countryId}>
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
                  <h3 id={countryId} className="text-xl font-semibold text-slate-950">
                    {country}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {partners.length} {partners.length === 1 ? 'listing' : 'listings'}
                  </p>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  {partners.map((partner) => (
                    <article
                      key={partner.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                        {partnerTypeLabels[partner.type]}
                      </p>
                      <h4 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                        {partner.name}
                      </h4>
                      <p className="mt-2 text-base font-medium text-slate-700">
                        {partner.city}, {partner.country}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{partner.address}</p>

                      <dl className="mt-6 space-y-3 text-sm text-slate-700">
                        <div>
                          <dt className="font-medium text-slate-950">Hours</dt>
                          <dd className="mt-1">{partner.hours}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-950">Phone</dt>
                          <dd className="mt-1">
                            <a className="underline-offset-4 hover:underline" href={`tel:${partner.phone}`}>
                              {partner.phone}
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-950">Email</dt>
                          <dd className="mt-1">
                            <a
                              className="underline-offset-4 hover:underline"
                              href={`mailto:${partner.email}`}
                            >
                              {partner.email}
                            </a>
                          </dd>
                        </div>
                        {partner.website ? (
                          <div>
                            <dt className="font-medium text-slate-950">Website</dt>
                            <dd className="mt-1">
                              <a
                                className="underline-offset-4 hover:underline"
                                href={partner.website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {partner.website}
                              </a>
                            </dd>
                          </div>
                        ) : null}
                      </dl>

                      <div className="mt-6">
                        <p className="text-sm font-medium text-slate-950">Technologies listed</p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {partner.features.map((feature) => (
                            <li
                              key={feature}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                            >
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={buildLocatorContactHref({
                            intent: 'curious',
                            country: partner.country,
                            city: partner.city,
                            modality: partner.features[0],
                            partnerType: partnerTypeLabels[partner.type],
                            partnerName: partner.name,
                          })}
                          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:whitespace-nowrap"
                        >
                          Request introduction for this partner
                        </Link>
                        <Link
                          href={buildLocatorContactHref({
                            intent: 'rental',
                            country: partner.country,
                            city: partner.city,
                            modality: partner.features[0],
                          })}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 sm:whitespace-nowrap"
                        >
                          Ask about rental alternatives
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                Need a closer match?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
                If you do not see the city, technology, or partner type you need, use the contact
                route and request a guided introduction. That keeps the next step clear without
                forcing you through filters before you have a human route.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={buildLocatorContactHref({ intent: 'curious' })}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800 sm:whitespace-nowrap"
                >
                  Request partner introduction
                </Link>
                <Link
                  href="/rental"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 sm:whitespace-nowrap"
                >
                  Explore rental options
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
