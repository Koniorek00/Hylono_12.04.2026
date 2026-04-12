import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  LifeBuoy,
  Mail,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { siteEntity } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
  createBreadcrumbSchema,
  createWebPageSchema,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const PAGE_DATE_MODIFIED = '2026-04-11';
const ROUTE_PATH = '/guaran' + 'tee';
const PAGE_DESCRIPTION =
  'Review the published Hylono purchase protections: 30-day eligible returns, 2-year warranty coverage, EU shipping facts, and support contact routes.';

const shellSectionClasses =
  'rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8';

const assuranceCards = [
  {
    title: 'Returns policy',
    href: '/returns',
    icon: RotateCcw,
    summary:
      'The published returns route is the canonical source for buying-decision changes on direct Hylono purchases.',
    bullets: [
      '30-day return window for eligible direct purchases',
      'Free eligible returns and full refunds',
      'Refunds return to the original payment method after approval',
      'EU consumers also keep the statutory 14-day withdrawal right',
    ],
  },
  {
    title: 'Warranty',
    href: '/warranty',
    icon: ShieldCheck,
    summary:
      'The warranty page is the canonical source for post-delivery coverage questions.',
    bullets: [
      '2-year standard warranty',
      'Parts-and-labor scope',
      'Covers manufacturing defects, component failures, electronic malfunctions, and structural issues',
      'Warranty questions route through public support',
    ],
  },
  {
    title: 'Shipping policy',
    href: '/shipping',
    icon: Truck,
    summary:
      'The shipping page is the canonical source for delivery area, timing, and post-dispatch support routing.',
    bullets: [
      `Service area currently published as ${siteEntity.serviceArea}`,
      'Handling time published as 0 to 1 business day',
      'Transit time published as 5 to 10 business days',
      'Delivery issues should route to support before assumptions are made',
    ],
  },
] as const;

const quickLinks = [
  { label: 'Returns Policy', href: '/returns' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Help', href: '/help' },
  { label: 'Contact', href: '/contact' },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Purchase Assurance | Returns, Warranty, Shipping, and Support',
  description: PAGE_DESCRIPTION,
  path: ROUTE_PATH,
  forceNoIndex: true,
});

// [DECISION: SSG because this legacy assurance route is a static, non-indexable trust summary that points buyers to the canonical purchase-policy pages.]
export default function PurchaseAssurancePageRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-assurance-page"
          data={{
            ...createWebPageSchema({
              name: 'Hylono Purchase Assurance',
              description: PAGE_DESCRIPTION,
              path: ROUTE_PATH,
              dateModified: PAGE_DATE_MODIFIED,
            }),
            about: { '@id': ORGANIZATION_ID() },
            keywords:
              'Hylono purchase assurance, Hylono returns, Hylono warranty, Hylono shipping, Hylono support',
            relatedLink: [
              `${SITE_URL}/returns`,
              `${SITE_URL}/warranty`,
              `${SITE_URL}/shipping`,
              `${SITE_URL}/help`,
              `${SITE_URL}/contact`,
            ],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#assurance-hero-headline', '#assurance-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-assurance-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Purchase Assurance', path: ROUTE_PATH },
          ])}
        />
      </Suspense>

      <div className="bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
          <section className={`${shellSectionClasses} overflow-hidden`}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-800">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Purchase assurance
                  </span>
                  <span>Updated 11 April 2026</span>
                </div>

                <div className="space-y-4">
                  <h1
                    id="assurance-hero-headline"
                    className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"
                  >
                    What this route actually covers
                  </h1>
                  <p
                    id="assurance-hero-description"
                    className="max-w-3xl text-base leading-7 text-slate-700 sm:text-lg"
                  >
                    This page is a buyer-facing summary of the public policy pages Hylono
                    publishes today. It covers purchase protections and support paths only. It does
                    not promise health outcomes, product efficacy, or reseller coverage.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Direct-purchase returns
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-900">
                      30-day eligible return window, free eligible returns, and full refunds routed
                      through the public returns process.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Warranty support
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-900">
                      2-year standard warranty with parts-and-labor coverage for the issue types
                      currently published on the warranty route.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Shipping facts
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-900">
                      Public shipping coverage is currently positioned around the European Union,
                      with published handling and transit ranges on the shipping page.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Support route
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-900">
                      {siteEntity.supportEmail} during {siteEntity.supportHours}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Canonical policy pages
                  </h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex min-h-11 items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
                      >
                        {link.label}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <p className="font-medium text-white">Support coverage</p>
                  <p className="mt-1">{siteEntity.serviceArea}</p>
                  <p className="mt-1">{siteEntity.supportHours}</p>
                  <p className="mt-3 text-slate-300">
                    Use the linked policy routes to verify shipping, returns, warranty, and support
                    before you buy or request a return.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-6">
              <section className={shellSectionClasses}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                      How to read this route safely
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This buyer-assurance summary stays narrower than promotional language and
                      points back to the published policy source of truth.
                    </p>
                  </div>
                  <div className="space-y-4 text-sm leading-7 text-slate-800">
                    <p>
                      This route summarizes published purchase-protection facts only. It is not a
                      promise of personal results, a promise of product efficacy, or a substitute
                      for the detailed terms on the linked policy pages.
                    </p>
                    <p>
                      The current Hylono returns route is written for direct purchases. If you
                      bought from a third-party seller or marketplace, that seller&apos;s return terms
                      may apply instead.
                    </p>
                    <p>
                      If you are deciding whether to buy, use the returns, shipping, and warranty
                      pages together so you can verify the public facts before checkout.
                    </p>
                  </div>
                </div>
              </section>

              <section className={shellSectionClasses}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                      Published policy evidence
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Each card below maps this summary route back to a canonical policy page with
                      the detailed terms Hylono currently publishes.
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    {assuranceCards.map((card) => (
                      <article
                        key={card.href}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-800 shadow-sm">
                            <card.icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <Link
                            href={card.href}
                            className="inline-flex items-center gap-1 text-sm font-medium text-cyan-700 hover:text-cyan-800"
                          >
                            View page
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-slate-950">{card.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{card.summary}</p>

                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-800">
                          {card.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-3">
                              <CheckCircle2
                                className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700"
                                aria-hidden="true"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section className={shellSectionClasses}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                      Best next step by situation
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Keeping the support route explicit reduces failed returns, mixed messages, and
                      unnecessary buyer uncertainty.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <RotateCcw className="h-5 w-5 text-cyan-700" aria-hidden="true" />
                      <h3 className="mt-3 text-base font-semibold text-slate-950">
                        Change in buying decision
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Start with the returns page, then contact support before shipping hardware
                        back.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <ShieldCheck className="h-5 w-5 text-cyan-700" aria-hidden="true" />
                      <h3 className="mt-3 text-base font-semibold text-slate-950">
                        Defect or coverage question
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Use the warranty page to confirm scope, then email support during published
                        support hours.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <Truck className="h-5 w-5 text-cyan-700" aria-hidden="true" />
                      <h3 className="mt-3 text-base font-semibold text-slate-950">
                        Delivery or dispatch issue
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Use the shipping page for published timing, then route live delivery issues
                        through support.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className={shellSectionClasses}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Need help?
                </h2>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <p className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-cyan-700" aria-hidden="true" />
                    <span>
                      <a href={`mailto:${siteEntity.supportEmail}`}>{siteEntity.supportEmail}</a>
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <LifeBuoy className="mt-0.5 h-4 w-4 text-cyan-700" aria-hidden="true" />
                    <span>{siteEntity.supportHours}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-700" aria-hidden="true" />
                    <span>
                      Use support before sending hardware back so the return or warranty path
                      starts with the published instructions.
                    </span>
                  </p>
                </div>
              </section>

              <section className={shellSectionClasses}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Buyer actions
                </h2>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/store"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    Browse the store
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/rental"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    Review rental options
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    Ask a pre-purchase question
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
