import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { siteEntity, siteOwnership } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
  SCHEMA_DATE_MODIFIED,
  createBreadcrumbSchema,
  createWebPageSchema,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

const displayLastUpdated = new Date(`${SCHEMA_DATE_MODIFIED}T00:00:00Z`).toLocaleDateString(
  'en-US',
  {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
);

const inquiryChecklist = [
  'Your website, channel, or publication link',
  'Audience geography and primary language',
  'The formats you publish, such as articles, newsletters, video, or practitioner education',
  'Which Hylono topics or product families you want to cover',
  'How you handle advertising disclosures and compliance review',
];

const fitProfiles = [
  {
    title: 'Specialist publishers',
    description:
      'Writers, editors, or newsletter operators covering wellness technology, recovery, or performance topics in a compliance-aware way.',
  },
  {
    title: 'Educators and practitioners',
    description:
      'Clinics, coaches, and educators who already guide clients through responsible product comparison and next-step support.',
  },
  {
    title: 'Selective brand collaborators',
    description:
      'Teams with a defined audience, clear disclosure standards, and a practical reason to reference Hylono product or protocol pages.',
  },
];

const routeLinks = [
  {
    href: '/research',
    title: 'Research hub',
    description: 'Review the evidence summaries and visible limitations before discussing any commercial collaboration.',
  },
  {
    href: '/store',
    title: 'Product hub',
    description: 'See the current device categories so your inquiry points to the right product family.',
  },
  {
    href: '/protocols',
    title: 'Protocol library',
    description: 'Use the protocol pages to understand how Hylono connects education, products, and support flows.',
  },
  {
    href: '/contact',
    title: 'Contact route',
    description: 'Use the existing support form for affiliate or referral inquiries that need a manual reply.',
  },
];

export const metadata: Metadata = createPageMetadata({
  title: 'Affiliate Inquiries | Hylono',
  description:
    'Request an affiliate conversation with Hylono. We review creators, publishers, and wellness businesses manually and share terms directly when a fit exists.',
  path: '/affiliate',
  forceNoIndex: true,
});

// [DECISION: SSG because this route is static affiliate-intake guidance with manual follow-up and no verified public program terms.]
// Rendering strategy: server-rendered noindex landing page with truthful eligibility guidance, contact CTAs, and no client-side gate or fake application workflow.
export default function AffiliatePageRoute() {
  const affiliatePageSchema = {
    ...createWebPageSchema({
      name: 'Hylono Affiliate Inquiries',
      description:
        'Request an affiliate conversation with Hylono. We review creators, publishers, and wellness businesses manually and share terms directly when a fit exists.',
      path: '/affiliate',
      dateModified: SCHEMA_DATE_MODIFIED,
    }),
    about: { '@id': ORGANIZATION_ID() },
    mainEntity: { '@id': ORGANIZATION_ID() },
    relatedLink: [
      `${SITE_URL}/research`,
      `${SITE_URL}/store`,
      `${SITE_URL}/protocols`,
      `${SITE_URL}/contact`,
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#affiliate-hero-headline', '#affiliate-hero-description'],
    },
  };

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-affiliate-page" data={affiliatePageSchema} />
        <StructuredData
          id="jsonld-affiliate-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Affiliate', path: '/affiliate' },
          ])}
        />
      </Suspense>

      <main className="bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:flex lg:items-start lg:justify-between lg:gap-12 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Affiliate collaborations
              </p>
              <h1
                id="affiliate-hero-headline"
                className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl"
              >
                Talk to Hylono about an affiliate or referral fit
              </h1>
              <p
                id="affiliate-hero-description"
                className="mt-5 max-w-2xl text-lg leading-8 text-slate-700"
              >
                This route is a manual intake point for publishers, educators, and wellness
                businesses that want to discuss a compliant Hylono referral relationship. We do
                not publish fixed public commission tables, cookie windows, or payout promises on
                this page. If there is a fit, commercial terms are shared directly in writing after
                review.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Start an inquiry
                </Link>
                <a
                  href={`mailto:${siteEntity.contactEmail}?subject=Affiliate%20inquiry`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                >
                  Email {siteEntity.contactEmail}
                </a>
              </div>
            </div>

            <aside className="mt-10 max-w-sm rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white lg:mt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Manual review
              </p>
              <dl className="mt-5 space-y-4 text-sm text-slate-200">
                <div>
                  <dt className="font-semibold text-white">Handled by</dt>
                  <dd className="mt-1">{siteOwnership.commerce.team}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Coverage</dt>
                  <dd className="mt-1">{siteEntity.serviceArea}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Support hours</dt>
                  <dd className="mt-1">{siteEntity.supportHours}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Last content review</dt>
                  <dd className="mt-1">{displayLastUpdated}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            {fitProfiles.map((profile) => (
              <article
                key={profile.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-950">{profile.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{profile.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-100/70">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Before you reach out
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                Bring the context we need to review the conversation properly
              </h2>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
                {inquiryChecklist.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Route map
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                Review the public Hylono path first
              </h2>
              <div className="mt-6 space-y-4">
                {routeLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-[1.5rem] border border-slate-200 px-4 py-4 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <p className="font-semibold text-slate-950">{link.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Existing approved partners
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                Already have access?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700">
                If your organization already has approved credentials, use the account route or
                contact support if access is missing. This page is for new inquiries, not an active
                dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open account
                </Link>
                <a
                  href={`mailto:${siteEntity.supportEmail}?subject=Affiliate%20access%20support`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                >
                  Contact support
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-200 bg-cyan-50 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
                Terms and disclosures
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Hylono reviews affiliate relationships case by case. Availability can vary by
                geography, product line, operational readiness, and disclosure standards. Any live
                arrangement must match the visible public pages you reference and must avoid
                unsupported medical or outcome claims.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
