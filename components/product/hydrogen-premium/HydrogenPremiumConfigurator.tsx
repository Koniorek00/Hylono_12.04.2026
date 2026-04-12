'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  formatPln,
  type HydrogenPremiumVariant,
} from '@/content/hydrogen-premium-2026';

interface HydrogenPremiumConfiguratorProps {
  accent: string;
  lineOrder: string;
  lineTitle: string;
  lineSubtitle: string;
  rangeLabel: string;
  pageTitle: string;
  useCaseLabel: string;
  variants: HydrogenPremiumVariant[];
  siblingLinks: Array<{
    title: string;
    description: string;
    href: string;
  }>;
}

const parseNumbers = (value: string) =>
  (value.match(/\d+(?:[.,]\d+)?/g) ?? []).map((item) =>
    Number(item.replace(',', '.')),
  );

const getVariantPositionLabel = (
  variant: HydrogenPremiumVariant,
  variants: HydrogenPremiumVariant[],
) => {
  if (variants.length === 1) return 'Single configuration';
  const index = variants.findIndex((item) => item.model === variant.model);
  if (index === 0) return 'Entry configuration';
  if (index === variants.length - 1) return 'Top-output configuration';
  return 'Mid-line configuration';
};

const getDeliveryLabel = (
  pageTitle: string,
  variant: HydrogenPremiumVariant,
): string => {
  if (variant.hydrogen.includes('ppb')) return 'Hydrogen water route';
  if (pageTitle.includes('-P')) return 'Pulse-controlled inhalation';
  if (variant.oxygen) return 'Continuous H2 + O2';
  return 'Pure hydrogen inhalation';
};

const getOutputLabel = (variant: HydrogenPremiumVariant): string => {
  if (variant.hydrogen.includes('ppb')) return 'Hydrogen concentration';
  return 'Hydrogen output';
};

const getFootprintLabel = (variant: HydrogenPremiumVariant): string => {
  const numbers = parseNumbers(variant.weight);
  const weight = numbers[0] ?? 0;

  if (weight <= 6) return 'Compact private footprint';
  if (weight <= 15) return 'Studio-ready footprint';
  return 'Station-grade footprint';
};

export function HydrogenPremiumConfigurator({
  accent,
  lineOrder,
  lineTitle,
  lineSubtitle,
  rangeLabel,
  pageTitle,
  useCaseLabel,
  variants,
  siblingLinks,
}: HydrogenPremiumConfiguratorProps) {
  const [selectedModel, setSelectedModel] = useState(variants[0]?.model ?? '');

  const activeVariant = useMemo(
    () => variants.find((variant) => variant.model === selectedModel) ?? variants[0],
    [selectedModel, variants],
  );

  if (!activeVariant) {
    return null;
  }

  return (
    <section
      id="select-configuration"
      className="border-b border-white/8 bg-[linear-gradient(180deg,#09111a_0%,#06080c_100%)] py-18"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-3xl">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.34em]"
            style={{ color: accent }}
          >
            Select Configuration
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl"
            style={{ fontFamily: 'var(--font-syncopate), sans-serif' }}
          >
            Choose the exact configuration before you judge the page
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/72 md:text-base">
            This page stays grouped only because these models share the same physical
            architecture. Select a configuration first, then review the active description,
            exact output, size, and current price for that model.
          </p>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{
                  backgroundColor: `${accent}18`,
                  border: `1px solid ${accent}4d`,
                  color: accent,
                }}
              >
                {lineOrder} {lineTitle}
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-white/44">
                {lineSubtitle}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/64">{rangeLabel}</p>

            <div className="mt-6 space-y-3">
              {variants.map((variant) => {
                const isSelected = variant.model === activeVariant.model;

                return (
                  <button
                    key={variant.model}
                    type="button"
                    onClick={() => setSelectedModel(variant.model)}
                    className={`w-full rounded-[1.5rem] border p-5 text-left transition-all ${
                      isSelected
                        ? 'bg-white text-slate-950 shadow-[0_24px_60px_rgba(0,0,0,0.25)]'
                        : 'border-white/10 bg-black/25 text-white hover:border-white/24 hover:bg-white/[0.05]'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: accent,
                            boxShadow: `0 24px 70px ${accent}26`,
                          }
                        : undefined
                    }
                    aria-pressed={isSelected}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p
                          className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${
                            isSelected ? 'text-slate-500' : ''
                          }`}
                          style={isSelected ? undefined : { color: accent }}
                        >
                          {getVariantPositionLabel(variant, variants)}
                        </p>
                        <h3 className="mt-3 text-xl font-semibold">{variant.model}</h3>
                        <p
                          className={`mt-2 text-sm leading-7 ${
                            isSelected ? 'text-slate-600' : 'text-white/70'
                          }`}
                        >
                          {variant.activeSummary}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[11px] uppercase tracking-[0.22em] ${
                            isSelected ? 'text-slate-500' : 'text-white/45'
                          }`}
                        >
                          Current price
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          {formatPln(variant.grossPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.1rem] border border-current/10 bg-black/10 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-inherit/45">
                          {getOutputLabel(variant)}
                        </p>
                        <p className="mt-2 text-sm font-semibold">
                          {variant.hydrogen}
                        </p>
                      </div>
                      <div className="rounded-[1.1rem] border border-current/10 bg-black/10 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-inherit/45">
                          Delivery
                        </p>
                        <p className="mt-2 text-sm font-semibold">
                          {getDeliveryLabel(pageTitle, variant)}
                        </p>
                      </div>
                      <div className="rounded-[1.1rem] border border-current/10 bg-black/10 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-inherit/45">
                          Footprint
                        </p>
                        <p className="mt-2 text-sm font-semibold">
                          {getFootprintLabel(variant)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {siblingLinks.length > 0 ? (
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: accent }}
                >
                  Explore the rest of this line
                </p>
                <div className="mt-4 grid gap-3">
                  {siblingLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4 transition-colors hover:border-white/24 hover:bg-white/[0.05]"
                    >
                      <p className="text-sm font-semibold text-white">{link.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.34em]"
                  style={{ color: accent }}
                >
                  Active Configuration
                </p>
                <h3
                  className="mt-3 text-3xl font-semibold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-syncopate), sans-serif' }}
                >
                  {activeVariant.model}
                </h3>
              </div>
              <div
                className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{
                  borderColor: `${accent}4d`,
                  backgroundColor: `${accent}14`,
                  color: accent,
                }}
              >
                {getDeliveryLabel(pageTitle, activeVariant)}
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/72 md:text-base">
              {activeVariant.activeSummary}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/56">{useCaseLabel}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/44">
                  Hydrogen profile
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {activeVariant.hydrogen}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  {activeVariant.oxygen
                    ? `Paired with ${activeVariant.oxygen} oxygen output in the same platform.`
                    : activeVariant.hydrogen.includes('ppb')
                      ? 'Configured around dissolved hydrogen concentration rather than inhalation flow.'
                      : 'Pure hydrogen delivery with a simpler setup logic and lower operational complexity.'}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/44">
                  Current price
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {formatPln(activeVariant.grossPrice)}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  {formatPln(activeVariant.netPrice)} net. Advisory fit, rental planning, and
                  protocol pairing happen before final checkout.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/44">
                  Dimensions
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {activeVariant.dimensions}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/44">
                  Weight
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {activeVariant.weight}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/44">
                  Position in family
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {getVariantPositionLabel(activeVariant, variants)}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/44">
                  Delivery profile
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {getDeliveryLabel(pageTitle, activeVariant)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: accent }}
              >
                Request model guidance
              </Link>
              <Link
                href="/rental"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/[0.05]"
              >
                Review rental access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
