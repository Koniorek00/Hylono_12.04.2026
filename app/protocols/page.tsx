import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { siteEntity, siteOwnership } from '@/content/site-entity';
import { protocols } from '@/content/protocols';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  createBreadcrumbSchema,
  createCollectionPageSchema,
  SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { LEGACY_PRODUCT_ROUTE_REDIRECTS, getTechTypeFromRouteSlug } from '@/lib/product-routes';
import { TECH_DETAILS } from '@/constants';
import StructuredData from '@/src/components/StructuredData';
import { StaticStructuredData } from '@/src/components/StaticStructuredData';
import { ProtocolsClient } from './ProtocolsClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Protocols | Recovery, Stress, and Vitality Plans',
  description:
    'Compare Hylono wellness protocols for recovery, stress, and vitality by time, difficulty, and required devices.',
  path: '/protocols',
});

const formatGoalTag = (goalTag: string): string => {
  const normalized = goalTag.toLowerCase();

  if (normalized.includes('recovery')) return 'Recovery';
  if (normalized.includes('stress')) return 'Stress';
  if (normalized.includes('sleep')) return 'Sleep';
  if (normalized.includes('comfort')) return 'Comfort';
  return 'Vitality';
};

const formatList = (items: string[]): string => {
  const [first, second] = items;

  if (!first) return '';
  if (!second) return first;
  if (items.length === 2) return `${first} and ${second}`;

  const last = items[items.length - 1]!;
  return `${items.slice(0, -1).join(', ')}, and ${last}`;
};

// [DECISION: ISR because protocol index content is semi-dynamic and periodically updated.]
export default function ProtocolsPageRoute() {
  const currentGoals = Array.from(
    new Set(protocols.map((protocol) => formatGoalTag(protocol.goalTag)))
  );
  const durationWeeks = protocols.map((protocol) => protocol.durationWeeks);
  const timeCommitmentMinutes = protocols.flatMap((protocol) =>
    (protocol.timePerDay.match(/\d+/g) ?? []).map((value) => Number(value))
  );
  const deviceCounts = protocols.map((protocol) => protocol.requiredDevices.length);
  const protocolFacts = [
    {
      label: 'Coverage',
      value: formatList(currentGoals),
      detail: `${protocols.length} published protocols`,
    },
    {
      label: 'Daily time',
      value: `${Math.min(...timeCommitmentMinutes)}-${Math.max(...timeCommitmentMinutes)} min`,
      detail: 'Time commitment is visible before selection',
    },
    {
      label: 'Duration',
      value: `${Math.min(...durationWeeks)}-${Math.max(...durationWeeks)} weeks`,
      detail: 'Structured multi-week routines',
    },
    {
      label: 'Device load',
      value: `${Math.min(...deviceCounts)}-${Math.max(...deviceCounts)} devices`,
      detail: 'Required equipment is listed up front',
    },
  ];

  const protocolListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/protocols#protocol-list`,
    name: 'Hylono guided wellness protocols',
    description:
      'Structured multi-week usage protocols for recovery, stress, and vitality goals with device scheduling and evidence references.',
    url: `${SITE_URL}/protocols`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    isPartOf: { '@id': WEBSITE_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    numberOfItems: protocols.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: protocols.map((protocol, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/protocols/${protocol.slug}`,
      item: {
        '@type': 'HowTo',
        '@id': `${SITE_URL}/protocols/${protocol.slug}#howto`,
        name: protocol.title,
        description: protocol.shortDescription,
        url: `${SITE_URL}/protocols/${protocol.slug}`,
        inLanguage: 'en',
        about: {
          '@type': 'MedicalCondition',
          '@id': `${SITE_URL}/conditions/${protocol.goalTag}#condition`,
          name: protocol.goal,
        },
        totalTime: `P${Math.max(protocol.durationWeeks, 1)}W`,
        yield: {
          '@type': 'DefinedTerm',
          name: protocol.goal,
          url: `${SITE_URL}/conditions/${protocol.goalTag}`,
          inDefinedTermSet: `${SITE_URL}/conditions`,
        },
        publisher: { '@id': ORGANIZATION_ID() },
        isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/protocols` },
        tool: protocol.requiredDevices.map((device) => {
          const routeSlug =
            LEGACY_PRODUCT_ROUTE_REDIRECTS[
              device.productId as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
            ] ?? device.productId;
          const techType = getTechTypeFromRouteSlug(routeSlug);
          const toolName = techType ? `Hylono ${TECH_DETAILS[techType].name}` : routeSlug;
          return {
            '@type': 'HowToTool',
            '@id': `${SITE_URL}/product/${routeSlug}#product`,
            name: toolName,
            url: `${SITE_URL}/product/${routeSlug}`,
          };
        }),
        potentialAction: {
          '@type': 'ReadAction',
          target: [`${SITE_URL}/protocols/${protocol.slug}`],
        },
      },
    })),
  };

  return (
    <>
      <StaticStructuredData id="jsonld-protocols-list" data={protocolListSchema} />
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-protocols-page"
          data={{
            ...createCollectionPageSchema({
              name: 'Hylono Protocols',
              description:
                'Compare Hylono wellness protocols for recovery, stress, and vitality by time, difficulty, and required devices.',
              path: '/protocols',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: protocols.map((protocol) => ({
              '@type': 'HowTo',
              '@id': `${SITE_URL}/protocols/${protocol.slug}#howto`,
              name: protocol.title,
              url: `${SITE_URL}/protocols/${protocol.slug}`,
            })),
            keywords:
              'wellness protocols, recovery protocol, stress protocol, vitality protocol, HBOT protocol, hydrogen protocol, guided wellness plans',
            mainEntity: { '@id': `${SITE_URL}/protocols#protocol-list` },
            relatedLink: [
              `${SITE_URL}/conditions`,
              `${SITE_URL}/research`,
              `${SITE_URL}/rental`,
              `${SITE_URL}/contact`,
            ],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#protocols-answer-summary', '#protocols-answer-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-protocols-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Protocols', path: '/protocols' },
          ])}
        />
      </Suspense>
      <section className="relative overflow-hidden bg-slate-100 pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(241,245,249,0.94)_42%,_rgba(226,232,240,0.9)_100%)]" />
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-6 md:px-6">
          <section className="rounded-[32px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.35)] backdrop-blur md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.95fr)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Protocol hub
                </p>
                <h2
                  id="protocols-answer-summary"
                  className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl"
                >
                  Pick a protocol path faster.
                </h2>
                <p
                  id="protocols-answer-description"
                  className="mt-4 max-w-3xl text-base leading-7 text-slate-700 md:text-lg"
                >
                  Compare Hylono&apos;s current {formatList(currentGoals).toLowerCase()}{' '}
                  protocols by daily time, duration, difficulty, and required devices before you
                  move into rental or contact.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/rental"
                    className="inline-flex min-h-11 items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    See Rental Plans
                  </Link>
                  <p className="text-sm leading-6 text-slate-600">
                    Need evidence first?{' '}
                    <Link
                      href="/research"
                      className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-cyan-700"
                    >
                      Review research
                    </Link>{' '}
                    or{' '}
                    <Link
                      href="/contact"
                      className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-cyan-700"
                    >
                      contact Hylono
                    </Link>
                    .
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {protocolFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {fact.label}
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-950">{fact.value}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{fact.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[28px] border border-slate-200/80 bg-slate-950 p-6 text-slate-200 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.8)] md:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  What this page does
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>
                    Shows goal fit, time commitment, and difficulty before a visitor dives into
                    details.
                  </li>
                  <li>
                    Stays educational and conservative instead of framing protocols as personal
                    medical instructions.
                  </li>
                  <li>
                    Connects the protocol hub to research, rental, and contact so the next step is
                    obvious.
                  </li>
                </ul>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Ownership and support
                  </p>
                  <p className="mt-3 text-sm font-semibold text-white">
                    {siteOwnership.research.label}: {siteOwnership.research.team}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {siteEntity.description}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Support: {siteEntity.supportEmail} - {siteEntity.supportHours}
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </section>
      <div className="bg-slate-100">
        <ProtocolsClient />
      </div>
    </>
  );
}
