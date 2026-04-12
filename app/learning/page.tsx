import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { protocols } from '@/content/protocols';
import { researchContent } from '@/content/research';
import { siteEntity, siteOwnership } from '@/content/site-entity';
import { env } from '@/lib/env';
import { getAllTechRouteSlugs } from '@/lib/product-routes';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
  SCHEMA_DATE_MODIFIED,
  createBreadcrumbSchema,
  createCollectionPageSchema,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const displayReviewDate = new Date(`${SCHEMA_DATE_MODIFIED}T00:00:00Z`).toLocaleDateString(
  'en-US',
  {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
);

const learningPaths = [
  {
    href: '/protocols',
    kicker: 'Start here',
    title: 'Protocol guides',
    description:
      'Use a structured routine when you want step-by-step guidance instead of a generic overview.',
  },
  {
    href: '/research',
    kicker: 'Review evidence',
    title: 'Research summaries',
    description:
      'Read cited studies, limitations, and modality-specific summaries before choosing a path.',
  },
  {
    href: '/store',
    kicker: 'Match the tool',
    title: 'Product hubs',
    description:
      'Compare the main technology paths when you are deciding which category fits your goal.',
  },
  {
    href: '/rental',
    kicker: 'Need a plan',
    title: 'Rental and support',
    description:
      'Talk through rental fit, logistics, and next steps when you want direct help from Hylono.',
  },
] as const;

const proofItems = [
  `${protocols.length} structured protocol guides`,
  `${researchContent.studies.length} cited research summaries`,
  `${siteEntity.supportCoverageLabel} | ${siteEntity.supportHours}`,
  `${getAllTechRouteSlugs().length} technology paths in the product hub`,
] as const;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Learning | Protocols, Research, and Support',
  description:
    'Start with Hylono protocol guides, research summaries, product hubs, or support. This page routes you to the right public resource fast.',
  path: '/learning',
  forceNoIndex: true,
});

// [DECISION: SSG because /learning is a noindex routing hub that should route users into real protocol, research, store, rental, and support pages without client-only gating.]
// Rendering strategy: server-rendered noindex routing page with schema emitted from the route and direct HTML links into canonical protocol, research, store, rental, and support destinations.
export default function LearningPageRoute() {
  const learningPageSchema = {
    ...createCollectionPageSchema({
      name: 'Hylono Learning',
      description:
        'A noindex learning hub that routes visitors to Hylono protocols, research, product hubs, rental planning, and support.',
      path: '/learning',
      dateModified: SCHEMA_DATE_MODIFIED,
    }),
    about: { '@id': ORGANIZATION_ID() },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: learningPaths.length,
      itemListElement: learningPaths.map((path, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: path.title,
        url: `${SITE_URL}${path.href}`,
      })),
    },
    hasPart: learningPaths.map((path) => ({
      '@type': 'WebPage',
      name: path.title,
      url: `${SITE_URL}${path.href}`,
    })),
    relatedLink: [`${SITE_URL}/help`, `${SITE_URL}/contact`, `${SITE_URL}/research`],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#learning-hero-headline', '#learning-hero-description'],
    },
  };

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-learning-page" data={learningPageSchema} />
        <StructuredData
          id="jsonld-learning-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Learning', path: '/learning' },
          ])}
        />
      </Suspense>

      <div className="bg-slate-950 text-white">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Learning hub
              </p>
              <h1
                id="learning-hero-headline"
                className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              >
                Choose the right Hylono path first
              </h1>
              <p
                id="learning-hero-description"
                className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
              >
                Start with the public resource that matches what you need right now: a protocol
                guide, cited research review, product hub, or direct support. This page is a
                routing hub, not a gated academy shell.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {proofItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/protocols"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Start with protocol guides
              </Link>
              <p className="text-sm leading-6 text-slate-300">
                Need a human recommendation instead?{' '}
                <Link className="font-semibold text-white underline decoration-cyan-300/60" href="/contact">
                  Contact Hylono
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Fast routing
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Use the page that matches your question
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              The fastest way to reduce friction is to send visitors to the right destination
              immediately instead of making them decode a generic academy widget.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {learningPaths.map((path) => (
              <article
                key={path.href}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.7)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  {path.kicker}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{path.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{path.description}</p>
                <Link
                  href={path.href}
                  className="mt-5 inline-flex text-sm font-semibold text-white underline decoration-cyan-300/60 underline-offset-4"
                >
                  Open {path.title.toLowerCase()}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900/60">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                What this page covers
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                A simpler public entry point
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
                <li>
                  Start with protocols if you want structured usage ideas and a clearer first
                  routine.
                </li>
                <li>
                  Open research if you want citations, study limitations, and context before you
                  commit to a modality.
                </li>
                <li>
                  Use store, rental, or contact when you are choosing equipment or need direct
                  planning help.
                </li>
              </ul>
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-6 lg:mt-0">
              <h2 className="text-xl font-semibold text-white">Ownership and support</h2>
              <dl className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                <div>
                  <dt className="font-semibold text-white">{siteOwnership.editorial.label}</dt>
                  <dd>{siteOwnership.editorial.team}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">{siteOwnership.research.label}</dt>
                  <dd>{siteOwnership.research.team}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Last reviewed</dt>
                  <dd>{displayReviewDate}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Support coverage</dt>
                  <dd>
                    {siteEntity.serviceArea} | {siteEntity.supportHours}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-sm leading-6 text-slate-400">
                Educational content on Hylono is intended for review and planning. It does not
                replace personalized professional advice.
              </p>
              <Link
                href="/help"
                className="mt-5 inline-flex text-sm font-semibold text-white underline decoration-cyan-300/60 underline-offset-4"
              >
                Open the support hub
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
