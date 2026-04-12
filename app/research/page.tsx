import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { researchContent } from '@/content/research';
import { siteOwnership } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  SCHEMA_DATE_MODIFIED,
  createBreadcrumbSchema,
  createMedicalWebPageSchema,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';

const RESEARCH_MODALITIES = ['HBOT', 'H2'] as const;
type ResearchModality = (typeof RESEARCH_MODALITIES)[number];

const RESEARCH_MODALITY_PRODUCT_ROUTE: Record<ResearchModality, string> = {
  HBOT: 'hbot',
  H2: 'hydrogen',
};

const RESEARCH_MODALITY_PRODUCT_NAME: Record<ResearchModality, string> = {
  HBOT: 'Hylono HBOT',
  H2: 'Hylono Hydrogen',
};

const RESEARCH_MODALITY_PROTOCOL_ROUTE: Record<ResearchModality, string> = {
  HBOT: '/protocols/recovery-oxygen-foundation',
  H2: '/protocols/stress-balance-h2-foundation',
};

const RESEARCH_MODALITY_INTROS: Record<
  ResearchModality,
  {
    eyebrow: string;
    heading: string;
    description: string;
    limitation: string;
  }
> = {
  HBOT: {
    eyebrow: 'HBOT snapshot',
    heading: 'Performance and soreness are the clearest HBOT themes here.',
    description:
      'The current HBOT entries in this library focus on exercise performance, mitochondrial markers, and post-exercise soreness.',
    limitation:
      'These findings come from narrow study populations and protocol-specific designs, so they should not be treated as universal wellness outcomes.',
  },
  H2: {
    eyebrow: 'Hydrogen snapshot',
    heading: 'Fatigue and aerobic capacity lead the hydrogen coverage.',
    description:
      'The current hydrogen entries focus on fatigue-related outcomes and aerobic capacity in healthy-adult or early-stage review settings.',
    limitation:
      'The evidence base is still small, protocols vary, and broader claims need more rigorous clinical work before they are reliable.',
  },
};

const displayReviewDate = new Date(`${SCHEMA_DATE_MODIFIED}T00:00:00Z`).toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const latestStudyYear = Math.max(...researchContent.studies.map((study) => study.year));
const modalityCount = new Set(researchContent.studies.map((study) => study.modality)).size;

// [DECISION: research route is an indexable, content-heavy evidence hub and should render the answer block, review context, and study links on the server; keep runtime caching behavior and avoid client-side filters so the page stays crawlable and faster to parse.]
// Rendering strategy: server-rendered research hub with schema emitted from the route and static study cards sourced from canonical content modules.

export const metadata: Metadata = createPageMetadata({
  title: 'HBOT & Hydrogen Research | Hylono',
  description:
    'Read curated HBOT and hydrogen studies, see the limits of the evidence, and move to the relevant product hub or protocol page.',
  path: '/research',
});

export default function ResearchPageRoute() {
  const researchStudyList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}/research#study-list`,
    name: 'Hylono HBOT and hydrogen research studies',
    description: researchContent.subtitle,
    url: `${env.NEXT_PUBLIC_SITE_URL}/research`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    keywords: [
      'hyperbaric oxygen therapy research',
      'molecular hydrogen research',
      'HBOT evidence',
      'hydrogen wellness evidence',
      'wellness technology studies',
    ],
    isPartOf: { '@id': WEBSITE_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: researchContent.studies.length,
    itemListElement: researchContent.studies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: study.url,
      item: {
        '@type': 'ScholarlyArticle',
        '@id': study.doi ? `https://doi.org/${study.doi}` : study.url,
        headline: study.title,
        description: study.summary,
        abstract: study.summary,
        url: study.url,
        inLanguage: 'en',
        datePublished: study.year.toString(),
        genre: study.studyType,
        about: {
          '@type': 'Product',
          '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/${RESEARCH_MODALITY_PRODUCT_ROUTE[study.modality] ?? study.modality}#product`,
          url: `${env.NEXT_PUBLIC_SITE_URL}/product/${RESEARCH_MODALITY_PRODUCT_ROUTE[study.modality] ?? study.modality}`,
          name: RESEARCH_MODALITY_PRODUCT_NAME[study.modality] ?? study.modality,
        },
        ...(study.doi
          ? {
              identifier: {
                '@type': 'PropertyValue',
                propertyID: 'doi',
                value: study.doi,
              },
              sameAs: [`https://doi.org/${study.doi}`, study.url],
            }
          : {}),
        potentialAction: { '@type': 'ReadAction', target: [study.url] },
      },
    })),
  };

  const researchPageSchemaBase = createMedicalWebPageSchema({
    name: 'Hylono Research Hub',
    description:
      'Read curated HBOT and hydrogen research summaries, visible limitations, and next-step links to product hubs and protocols.',
    abstract:
      'Server-rendered evidence hub for HBOT and hydrogen studies with plain-language summaries, limitations, and links into the Hylono topical graph.',
    path: '/research',
    about: ['Mild Hyperbaric Oxygen Therapy', 'Hydrogen wellness technology', 'Protocol planning'],
    citations: researchContent.studies.map((study) => ({
      title: study.title,
      url: study.url,
      doi: study.doi,
      year: study.year,
    })),
    mainEntity: { '@id': `${env.NEXT_PUBLIC_SITE_URL}/research#study-list` },
    reviewedByName: siteOwnership.research.team,
    speakableSelectors: ['#research-answer-summary', '#research-library-disclaimer'],
    dateModified: SCHEMA_DATE_MODIFIED,
    lastReviewed: SCHEMA_DATE_MODIFIED,
  });

  const researchProductMentions = [...new Set(researchContent.studies.map((study) => study.modality))]
    .map((modality) => RESEARCH_MODALITY_PRODUCT_ROUTE[modality])
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      '@type': 'Product',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/${slug}#product`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/product/${slug}`,
    }));

  const researchPageSchema = {
    ...researchPageSchemaBase,
    about: [
      {
        '@type': 'Product',
        '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/hbot#product`,
        name: 'Hylono HBOT',
        url: `${env.NEXT_PUBLIC_SITE_URL}/product/hbot`,
      },
      {
        '@type': 'Product',
        '@id': `${env.NEXT_PUBLIC_SITE_URL}/product/hydrogen#product`,
        name: 'Hylono Hydrogen',
        url: `${env.NEXT_PUBLIC_SITE_URL}/product/hydrogen`,
      },
    ],
    keywords:
      'HBOT research, hydrogen research, hyperbaric oxygen therapy studies, molecular hydrogen evidence, wellness technology evidence',
    ...(researchProductMentions.length > 0 ? { mentions: researchProductMentions } : {}),
    relatedLink: [
      `${env.NEXT_PUBLIC_SITE_URL}/store`,
      `${env.NEXT_PUBLIC_SITE_URL}/protocols`,
      `${env.NEXT_PUBLIC_SITE_URL}/conditions`,
      `${env.NEXT_PUBLIC_SITE_URL}/contact`,
    ],
  };

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-research-page" data={researchPageSchema} />
        <StructuredData id="jsonld-research-study-list" data={researchStudyList} />
        <StructuredData
          id="jsonld-research-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Research', path: '/research' },
          ])}
        />
      </Suspense>

      <main className="bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-start lg:justify-between lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Evidence hub
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                HBOT and hydrogen research
              </h1>
              <p
                id="research-answer-summary"
                className="mt-5 max-w-2xl text-lg leading-8 text-slate-700"
              >
                Read curated HBOT and hydrogen studies, see what outcomes were actually measured,
                and move to the relevant technology or protocol page without guessing what the
                evidence does and does not support.
              </p>

              <ul className="mt-8 grid gap-3 text-sm leading-6 text-slate-700 md:grid-cols-3">
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  HBOT entries here focus on exercise performance and post-exercise soreness.
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  Hydrogen entries here focus on fatigue and aerobic-capacity outcomes.
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  Every study note includes a limitation so relevance is easier to judge fast.
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/store"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Compare the technology hubs
                </Link>
                <Link
                  href="/protocols"
                  className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
                >
                  Browse protocols
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
                >
                  Ask a research question
                </Link>
              </div>
            </div>

            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Review context
              </p>
              <dl className="mt-4 grid gap-4 text-sm">
                <div className="rounded-2xl border border-white bg-white p-4">
                  <dt className="font-medium text-slate-500">Reviewed by</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{siteOwnership.research.team}</dd>
                </div>
                <div className="rounded-2xl border border-white bg-white p-4">
                  <dt className="font-medium text-slate-500">Last reviewed</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{displayReviewDate}</dd>
                </div>
                <div className="rounded-2xl border border-white bg-white p-4">
                  <dt className="font-medium text-slate-500">How to use this page</dt>
                  <dd className="mt-1 text-slate-700">
                    Use it to review evidence scope, limits, and related next steps. Do not treat
                    it as personalized medical guidance.
                  </dd>
                </div>
              </dl>

              <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                <div className="rounded-2xl border border-white bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Studies</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {researchContent.studies.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-white bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Modalities</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{modalityCount}</p>
                </div>
                <div className="rounded-2xl border border-white bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Latest year</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{latestStudyYear}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Start with the question
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Choose the evidence path that matches your intent.
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                The current library is small enough to scan without filters. Use the modality
                summaries first, then open the source study or continue to the related hub.
              </p>
            </div>
            <Link
              href="/conditions"
              className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
            >
              Browse related conditions
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {RESEARCH_MODALITIES.map((modality) => {
              const studies = researchContent.studies.filter((study) => study.modality === modality);
              const productHref = `/product/${RESEARCH_MODALITY_PRODUCT_ROUTE[modality]}`;
              const protocolHref = RESEARCH_MODALITY_PROTOCOL_ROUTE[modality];
              const content = RESEARCH_MODALITY_INTROS[modality];

              return (
                <article
                  key={modality}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {content.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                    {content.heading}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{content.description}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{content.limitation}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {studies.map((study) => (
                      <span
                        key={study.id}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {study.studyType} | {study.year}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                    <Link
                      href={productHref}
                      className="text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
                    >
                      View the {RESEARCH_MODALITY_PRODUCT_NAME[modality]} hub
                    </Link>
                    <Link
                      href={protocolHref}
                      className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
                    >
                      See the related protocol
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Study library
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Read the studies without extra filtering steps.
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Each card shows the study type, the population studied, a plain-language takeaway,
                and the relevant next internal path.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {researchContent.studies.map((study) => {
                const productHref = `/product/${RESEARCH_MODALITY_PRODUCT_ROUTE[study.modality]}`;
                const protocolHref = RESEARCH_MODALITY_PROTOCOL_ROUTE[study.modality];

                return (
                  <article
                    key={study.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                        {study.modality}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {study.studyType}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{study.year}</span>
                    </div>

                    <h3 className="mt-4 text-xl font-black leading-8 text-slate-950">{study.title}</h3>
                    <p className="mt-3 text-sm font-medium text-slate-500">{study.population}</p>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{study.summary}</p>

                    {study.doi ? (
                      <p className="mt-4 text-xs text-slate-500">DOI: {study.doi}</p>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
                      >
                        Open the source study
                      </a>
                      <Link
                        href={productHref}
                        className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
                      >
                        View the related product hub
                      </Link>
                      <Link
                        href={protocolHref}
                        className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
                      >
                        Continue to a protocol
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div
              id="research-library-disclaimer"
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Scope and limitations
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Use this page to judge fit, not to stretch claims.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{researchContent.disclaimer}</p>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Some studies in this library report promising signals, but none of them replace
                product-specific guidance, clinician input, or protocol suitability review.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                Next step
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                Move from evidence to an actionable path.
              </h2>
              <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                <li>1. Compare the relevant HBOT or hydrogen hub.</li>
                <li>2. Check the matching protocol route.</li>
                <li>3. Use contact if you need help narrowing the fit.</li>
              </ol>
              <div className="mt-6 flex flex-col gap-3 text-sm font-semibold">
                <Link href="/store" className="underline decoration-slate-500 underline-offset-4">
                  Compare product hubs
                </Link>
                <Link href="/protocols" className="underline decoration-slate-500 underline-offset-4">
                  Browse protocols
                </Link>
                <Link href="/contact" className="underline decoration-slate-500 underline-offset-4">
                  Contact Hylono
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
