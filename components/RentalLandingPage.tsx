import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import analytics from '@/src/lib/analytics';
import { resolveRentalProductId } from '@/lib/commerce/rental-catalog';
import {
  buildPlannerSearchParams,
  parsePlannerSearchParams,
  summarizePlannerSelection,
} from '@/lib/planner-state';
import { SCHEMA_DATE_MODIFIED } from '@/lib/seo-schema';
import { siteEntity, siteOwnership } from '@/content/site-entity';
import { storePlanningLinks } from '@/content/topical-graph';
import { disclaimers } from '@/content/disclaimers';
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { NavigateFunction } from '../types';
import {
  rentalLandingContent,
  rentalProducts,
  RentalBudgetFilter,
  RentalTechnologyFilter,
} from '../content/rental';

interface RentalLandingPageProps {
  onNavigate: NavigateFunction;
}

const technologyOrder: Array<Exclude<RentalTechnologyFilter, 'all'>> = ['HBOT', 'H2', 'RLT', 'PEMF'];

const planningLinkCopy: Record<string, string> = {
  '/conditions': 'Start with the goal you want to improve before choosing a system.',
  '/protocols': 'See how rental-eligible devices fit into structured routines and next steps.',
  '/research': 'Review the evidence layer and limitations before committing to a device.',
  '/contact': 'Use advisor support for delivery, fit, logistics, or commercial questions.',
  '/store': 'Compare the wider catalog if you are still choosing between rent and ownership.',
};

const matchesBudget = (price: number, budget: RentalBudgetFilter): boolean => {
  if (budget === 'all') return true;
  if (budget === 'upto-500') return price <= 500;
  if (budget === '500-1000') return price > 500 && price <= 1000;
  if (budget === '1000-2000') return price > 1000 && price <= 2000;
  return price > 2000;
};

const formatEur = (amount: number): string =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatUpdatedLabel = (): string =>
  new Date(`${SCHEMA_DATE_MODIFIED}T00:00:00.000Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const RentalLandingPage: React.FC<RentalLandingPageProps> = ({ onNavigate: _onNavigate }) => {
  const searchParams = useSearchParams();
  const [technology, setTechnology] = useState<RentalTechnologyFilter>('all');
  const [budget, setBudget] = useState<RentalBudgetFilter>('all');
  const plannerState = useMemo(() => parsePlannerSearchParams(searchParams), [searchParams]);

  const requestedProductId = useMemo(() => {
    const requestedItems = (searchParams.get('items') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const requestedToken = searchParams.get('device') ?? requestedItems[0] ?? '';
    return requestedToken ? resolveRentalProductId(requestedToken) ?? null : null;
  }, [searchParams]);

  const requestedProduct = useMemo(
    () => rentalProducts.find((product) => product.id === requestedProductId) ?? null,
    [requestedProductId]
  );

  useEffect(() => {
    if (!requestedProduct) {
      return;
    }

    setTechnology(requestedProduct.modality);
    setBudget('all');
  }, [requestedProduct]);

  const availableTechnologies = useMemo(
    () =>
      technologyOrder.filter((candidate) =>
        rentalProducts.some((product) => product.modality === candidate)
      ),
    []
  );

  const lowestRentalPrice = useMemo(() => {
    if (rentalProducts.length === 0) return 0;
    return Math.min(...rentalProducts.map((product) => product.rentalMonthly));
  }, []);

  const filteredProducts = useMemo(
    () =>
      rentalProducts.filter((product) => {
        const technologyMatch = technology === 'all' || product.modality === technology;
        const budgetMatch = matchesBudget(product.rentalMonthly, budget);
        return technologyMatch && budgetMatch;
      }),
    [budget, technology]
  );

  const plannerSummaryLines = useMemo(
    () => (plannerState ? summarizePlannerSelection(plannerState).slice(0, 3) : []),
    [plannerState]
  );

  const withPlannerState = (pathname: string, extraParams?: Record<string, string>) => {
    if (!plannerState) {
      if (!extraParams || Object.keys(extraParams).length === 0) {
        return pathname;
      }

      const fallbackQuery = new URLSearchParams(extraParams).toString();
      return fallbackQuery ? `${pathname}?${fallbackQuery}` : pathname;
    }

    const params = buildPlannerSearchParams(plannerState);
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => params.set(key, value));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const featuredProduct = requestedProduct ?? filteredProducts[0] ?? rentalProducts[0] ?? null;
  const heroPrimaryHref = requestedProduct
    ? withPlannerState('/rental/checkout', { device: requestedProduct.slug })
    : '#available-rental-devices';
  const heroPrimaryLabel = requestedProduct
    ? `Start request for ${requestedProduct.title}`
    : rentalLandingContent.hero.cta;
  const updatedLabel = formatUpdatedLabel();
  const planningLinks = storePlanningLinks.filter((link) => link.href !== '/rental');

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Rental hub
              </p>
              <h1 id="rental-hero-headline" className="mt-3 max-w-3xl text-3xl font-bold text-slate-900 md:text-4xl">
                {rentalLandingContent.hero.title}
              </h1>
              <p
                id="rental-hero-description"
                className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base"
              >
                {rentalLandingContent.hero.subtitle} From {formatEur(lowestRentalPrice)}/mo.
              </p>

              {plannerSummaryLines.length > 0 && (
                <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                  <p className="font-semibold">Planner context carried into rental:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {plannerSummaryLines.map((line) => (
                      <span
                        key={line}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-cyan-900"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {requestedProduct && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
                  <Sparkles size={16} className="text-cyan-700" />
                  Preselected from product page: {requestedProduct.title}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={heroPrimaryHref}
                  className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                  onClick={() =>
                    analytics.capture('rental_hub_primary_cta_clicked', {
                      destination: heroPrimaryHref,
                      selected_product: requestedProduct?.id ?? null,
                    })
                  }
                >
                  {heroPrimaryLabel}
                </Link>
                <Link
                  href={withPlannerState('/contact', { intent: 'rental' })}
                  className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() =>
                    analytics.capture('rental_hub_contact_clicked', {
                      source: 'hero',
                      selected_product: requestedProduct?.id ?? null,
                    })
                  }
                >
                  {rentalLandingContent.hero.secondaryCta}
                </Link>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {rentalLandingContent.hero.supportingPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                <Link href="/shipping" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
                  Shipping
                </Link>
                <Link href="/returns" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
                  Returns
                </Link>
                <Link href="/warranty" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
                  Warranty
                </Link>
                <Link href="/terms" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
                  Terms
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                Ownership and support
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={16} className="mt-0.5 text-cyan-300" />
                  <span>
                    {siteOwnership.commerce.label}: {siteOwnership.commerce.team}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FileCheck2 size={16} className="mt-0.5 text-cyan-300" />
                  <span>
                    {siteOwnership.editorial.label}: {siteOwnership.editorial.team}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 size={16} className="mt-0.5 text-cyan-300" />
                  <span>Updated {updatedLabel}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={16} className="mt-0.5 text-cyan-300" />
                  <span>{siteEntity.serviceArea} delivery and support coverage</span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                <p className="font-semibold text-white">{siteEntity.supportHours}</p>
                <p className="mt-1">{siteEntity.supportEmail}</p>
                <p className="mt-3 text-slate-300">
                  Use the rental hub when you want to compare terms first, then move into a manual
                  review and delivery-confirmation flow.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Program facts
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">What the published rental flow already confirms</h2>
            </div>
            <p className="max-w-2xl text-sm text-slate-600">
              These facts stay intentionally conservative and route back to the supporting policy or
              contact pages when the final agreement depends on device, term, or operator review.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rentalLandingContent.programFacts.map((fact) => (
              <article key={fact.title} className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900">{fact.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{fact.text}</p>
                <Link
                  href={fact.href}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                  onClick={() =>
                    analytics.capture('rental_hub_program_fact_clicked', {
                      title: fact.title,
                      destination: fact.href,
                    })
                  }
                >
                  {fact.cta}
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">How it works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {rentalLandingContent.howItWorks.map((step) => (
              <article key={step.number} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  Step {step.number}
                </p>
                <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="available-rental-devices"
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Available devices</h2>
              <p className="mt-2 text-sm text-slate-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'device matches' : 'devices match'} your current filters.
              </p>
            </div>
            {featuredProduct && (
              <p className="text-sm text-slate-500">
                Fastest next step: start a request for <span className="font-semibold text-slate-900">{featuredProduct.title}</span>.
              </p>
            )}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Technology
              </span>
              <select
                value={technology}
                onChange={(event) => {
                  const nextValue = event.target.value as RentalTechnologyFilter;
                  setTechnology(nextValue);
                  analytics.capture('rental_hub_filter_changed', {
                    filter: 'technology',
                    value: nextValue,
                  });
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3"
              >
                <option value="all">All</option>
                {availableTechnologies.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    {candidate}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Budget/mo
              </span>
              <select
                value={budget}
                onChange={(event) => {
                  const nextValue = event.target.value as RentalBudgetFilter;
                  setBudget(nextValue);
                  analytics.capture('rental_hub_filter_changed', {
                    filter: 'budget',
                    value: nextValue,
                  });
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3"
              >
                <option value="all">All</option>
                <option value="upto-500">Up to EUR 500</option>
                <option value="500-1000">EUR 500-1,000</option>
                <option value="1000-2000">EUR 1,000-2,000</option>
                <option value="2000-plus">EUR 2,000+</option>
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const isRequestedProduct = requestedProduct?.id === product.id;
              const checkoutHref = withPlannerState('/rental/checkout', {
                device: product.slug,
              });

              return (
                <article
                  key={product.id}
                  className={`overflow-hidden rounded-2xl border ${
                    isRequestedProduct ? 'border-cyan-400 shadow-[0_18px_40px_rgba(6,182,212,0.14)]' : 'border-slate-200'
                  }`}
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    {product.image ? (
                      <OptimizedImage
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                        {product.modality}
                      </span>
                      {isRequestedProduct && (
                        <span className="rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {product.shortDescription}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Rental from
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {formatEur(product.rentalMonthly)}/mo
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Purchase price
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {formatEur(product.purchasePrice)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        Minimum term {product.minimumTermMonths} month{product.minimumTermMonths === 1 ? '' : 's'}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        Deposit from {formatEur(product.deposit)}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        Terms {product.availableTerms.join(', ')} months
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-600">{product.selectionRationale}</p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={checkoutHref}
                        className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                        onClick={() =>
                          analytics.capture('rental_hub_request_started', {
                            product_id: product.id,
                            source: 'card',
                          })
                        }
                      >
                        Start rental request
                      </Link>
                      <Link
                        href={withPlannerState(product.productPath, { mode: 'rental' })}
                        className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        onClick={() =>
                          analytics.capture('rental_hub_product_link_clicked', {
                            product_id: product.id,
                            destination: product.productPath,
                          })
                        }
                      >
                        View product details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-600">
                No devices match the current combination. Broaden the filters or talk to an advisor
                if you want help finding the closest fit.
              </p>
              <Link
                href={withPlannerState('/contact', { intent: 'rental' })}
                className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                onClick={() =>
                  analytics.capture('rental_hub_contact_clicked', {
                    source: 'empty_state',
                    technology,
                    budget,
                  })
                }
              >
                Talk to an advisor
              </Link>
            </div>
          )}
        </section>

        <section className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Buy vs rent - which is right for you?
          </h2>
          <table className="mt-4 min-w-[680px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-700">
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Purchase</th>
                <th className="py-2 pr-3">Rental</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {rentalLandingContent.comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-3 font-medium text-slate-700">{row.label}</td>
                  <td className="py-2 pr-3">{row.purchase}</td>
                  <td className="py-2 pr-3">{row.rental}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Related paths
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Plan with research, protocols, and goal guides</h2>
            </div>
            <p className="max-w-2xl text-sm text-slate-600">
              The rental hub is one step in the wider Hylono journey. Use the surrounding guides
              when you need evidence review, protocol structure, or a different starting point.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {planningLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-slate-200 p-5 transition-all hover:border-cyan-300 hover:shadow-md"
                onClick={() =>
                  analytics.capture('rental_hub_resource_clicked', {
                    destination: link.href,
                  })
                }
              >
                <h3 className="text-base font-semibold text-slate-900">{link.label}</h3>
                <p className="mt-2 text-sm text-slate-600">{planningLinkCopy[link.href] ?? 'Open the supporting route.'}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  Open path
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Rental FAQ</h2>
          <div className="mt-4 space-y-3">
            {rentalLandingContent.faq.map((item) => (
              <details key={item.q} className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {rentalLandingContent.testimonials.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">Rental planning notes</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {rentalLandingContent.testimonials.map((testimonial) => (
                <article key={testimonial.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-1 text-cyan-700" />
                    <div>
                      <p className="text-sm text-slate-700">{testimonial.quote}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {testimonial.author}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">{rentalLandingContent.finalCta.title}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {featuredProduct ? (
              <Link
                href={withPlannerState('/rental/checkout', {
                  device: featuredProduct.slug,
                })}
                className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={() =>
                  analytics.capture('rental_hub_request_started', {
                    product_id: featuredProduct.id,
                    source: 'final_cta',
                  })
                }
              >
                Start request for {featuredProduct.title}
              </Link>
            ) : null}
            <Link
              href={withPlannerState('/wellness-planner', { mode: 'rental' })}
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() =>
                analytics.capture('rental_hub_planner_clicked', {
                  destination: withPlannerState('/wellness-planner', { mode: 'rental' }),
                })
              }
            >
              {rentalLandingContent.finalCta.primary}
            </Link>
            <Link
              href={withPlannerState('/contact', { intent: 'rental' })}
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() =>
                analytics.capture('rental_hub_contact_clicked', {
                  source: 'final_cta',
                })
              }
            >
              {rentalLandingContent.finalCta.secondary}
            </Link>
          </div>
        </section>

        <MedicalDisclaimer
          className="mt-6"
          customText={`${disclaimers.financing} ${disclaimers.general}`}
          variant="info"
        />
      </div>
    </div>
  );
};
