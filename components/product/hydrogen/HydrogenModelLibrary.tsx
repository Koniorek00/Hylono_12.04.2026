import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import {
  formatPln,
  getHydrogenPremiumPath,
  hydrogenPremiumLineMeta,
  hydrogenPremiumPages,
  type HydrogenPremiumLineId,
  type HydrogenPremiumPageRecord,
} from '@/content/hydrogen-premium-2026';

const lineOrder: HydrogenPremiumLineId[] = [
  'personal',
  'intensive',
  'advanced',
  'water',
];

const pagesByLine = lineOrder.reduce(
  (acc, lineId) => {
    acc[lineId] = hydrogenPremiumPages.filter((page) => page.lineId === lineId);
    return acc;
  },
  {} as Record<HydrogenPremiumLineId, HydrogenPremiumPageRecord[]>,
);

const getPriceRangeLabel = (page: HydrogenPremiumPageRecord) => {
  const prices = page.variants.map((variant) => variant.grossPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return min === max ? formatPln(min) : `${formatPln(min)} to ${formatPln(max)}`;
};

const getPageModeLabel = (page: HydrogenPremiumPageRecord) =>
  page.variants.length === 1 ? 'Dedicated model page' : 'Matched variant page';

const getOutputSummary = (page: HydrogenPremiumPageRecord) =>
  page.variants
    .map((variant) =>
      variant.oxygen
        ? `${variant.hydrogen} H2 + ${variant.oxygen} O2`
        : variant.hydrogen,
    )
    .join(' / ');

export function HydrogenModelLibrary() {
  return (
    <section
      id="hydrogen-line-selector"
      className="border-b border-slate-100 bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_22%,#ffffff_100%)] py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-4xl">
          <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-sky-600">
            Hydrogen Line Selector
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Move from HOP-450 into the exact molecular hydrogen format you actually need
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            Open the line that matches your space, session rhythm, and delivery route. Each
            destination below leads to a dedicated product page or a matched-variant page used
            only where the physical platform stays the same and the difference is
            specification-driven.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {lineOrder.map((lineId) => {
            const line = hydrogenPremiumLineMeta[lineId];
            const linePages = pagesByLine[lineId];
            const featuredPage = linePages[0];

            return (
              <details
                key={line.id}
                open={lineId === 'personal'}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
              >
                <summary className="list-none cursor-pointer px-6 py-6 [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.3em]"
                        style={{ color: line.accent }}
                      >
                        {line.order} {line.title}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                        {line.subtitle}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{line.rangeLabel}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                        {linePages.length} destination{linePages.length > 1 ? 's' : ''}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-transform group-open:rotate-180">
                        <ChevronDown size={16} />
                      </span>
                    </div>
                  </div>
                </summary>

                <div className="border-t border-slate-200 p-6 pt-0">
                  {featuredPage ? (
                    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                      <article
                        className="relative overflow-hidden rounded-[2rem] border border-slate-200 p-6 text-white"
                        style={{
                          background: `radial-gradient(circle at top right, ${line.glow}, transparent 30%), linear-gradient(135deg, ${line.dark} 0%, #07111c 55%, #02060d 100%)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]" />
                        <div className="relative">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em]"
                              style={{
                                borderColor: `${line.accent}55`,
                                backgroundColor: `${line.accent}16`,
                                color: line.accent,
                              }}
                            >
                              Featured route
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/72">
                              {getPageModeLabel(featuredPage)}
                            </span>
                          </div>

                          <div className="mt-6 relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,#09131f_0%,#07111b_100%)]">
                            <div className="relative aspect-[4/3]">
                              <Image
                                src={featuredPage.image}
                                alt={featuredPage.imageAlt}
                                fill
                                sizes="(min-width: 1280px) 24vw, (min-width: 768px) 46vw, 100vw"
                                className="object-contain p-6"
                              />
                            </div>
                          </div>

                          <h4
                            className="mt-6 text-3xl font-semibold tracking-tight"
                            style={{ fontFamily: 'var(--font-syncopate), sans-serif' }}
                          >
                            {featuredPage.title}
                          </h4>
                          <p className="mt-4 text-sm leading-7 text-white/74">
                            {featuredPage.heroSummary}
                          </p>

                          <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
                              <p className="text-[10px] uppercase tracking-[0.22em] text-white/46">
                                Pricing range
                              </p>
                              <p className="mt-2 text-xl font-semibold text-white">
                                {getPriceRangeLabel(featuredPage)}
                              </p>
                            </div>
                            <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
                              <p className="text-[10px] uppercase tracking-[0.22em] text-white/46">
                                Output profile
                              </p>
                              <p className="mt-2 text-sm font-semibold leading-6 text-white">
                                {getOutputSummary(featuredPage)}
                              </p>
                            </div>
                          </div>

                          <p className="mt-6 text-sm leading-7 text-white/68">
                            {featuredPage.useCaseLabel}
                          </p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            {featuredPage.routeBadges.map((badge) => (
                              <span
                                key={`${featuredPage.slug}-${badge}`}
                                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>

                          <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                              href={getHydrogenPremiumPath(featuredPage.slug)}
                              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 transition-transform hover:-translate-y-0.5"
                              style={{ backgroundColor: line.accent }}
                            >
                              Open product page
                              <ArrowRight size={15} />
                            </Link>
                            <Link
                              href={
                                featuredPage.protocolSlugs[0]
                                  ? `/protocols/${featuredPage.protocolSlugs[0]}`
                                  : '/protocols'
                              }
                              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-6 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/[0.06]"
                            >
                              Review protocol fit
                            </Link>
                          </div>
                        </div>
                      </article>

                      <div className="grid gap-4 md:grid-cols-2">
                        {linePages.map((page) => (
                          <article
                            key={page.slug}
                            className="flex h-full flex-col rounded-[1.7rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p
                                  className="text-[10px] font-bold uppercase tracking-[0.22em]"
                                  style={{ color: line.accent }}
                                >
                                  {getPageModeLabel(page)}
                                </p>
                                <h4 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                                  {page.title}
                                </h4>
                              </div>
                              <p className="text-sm font-semibold text-slate-900">
                                {getPriceRangeLabel(page)}
                              </p>
                            </div>

                            <p className="mt-4 text-sm leading-7 text-slate-600">
                              {page.catalogSummary}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {page.variants.map((variant) => (
                                <span
                                  key={`${page.slug}-${variant.model}`}
                                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600"
                                >
                                  {variant.model}
                                </span>
                              ))}
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                  Output profile
                                </p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
                                  {getOutputSummary(page)}
                                </p>
                              </div>
                              <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                  Best fit
                                </p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
                                  {page.useCaseLabel}
                                </p>
                              </div>
                            </div>

                            <div className="mt-auto pt-5">
                              <Link
                                href={getHydrogenPremiumPath(page.slug)}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-slate-800"
                              >
                                Open route
                                <ArrowRight size={14} />
                              </Link>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
