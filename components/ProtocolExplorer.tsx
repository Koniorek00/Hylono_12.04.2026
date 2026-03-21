import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { protocols, protocolBySlug } from '../content/protocols';
import { productById } from '../content/products';
import { evidenceById } from '../content/evidence';
import { disclaimers } from '../content/disclaimers';
import { ProtocolCard, ProtocolCardData } from './protocols/ProtocolCard';

const GOAL_OPTIONS = ['All', 'Recovery', 'Sleep', 'Stress', 'Comfort', 'Vitality'] as const;
const TECHNOLOGY_OPTIONS = ['All', 'HBOT', 'H2', 'RLT', 'PEMF'] as const;
const LEVEL_OPTIONS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;
const TIME_OPTIONS = ['All', '15 min', '30 min', '45 min', '60+ min'] as const;

type GoalFilter = (typeof GOAL_OPTIONS)[number];
type TechFilter = (typeof TECHNOLOGY_OPTIONS)[number];
type LevelFilter = (typeof LEVEL_OPTIONS)[number];
type TimeFilter = (typeof TIME_OPTIONS)[number];

const normalizeGoal = (goalTag: string): Exclude<GoalFilter, 'All'> => {
  const value = goalTag.toLowerCase();
  if (value.includes('recovery')) return 'Recovery';
  if (value.includes('sleep')) return 'Sleep';
  if (value.includes('stress')) return 'Stress';
  if (value.includes('comfort')) return 'Comfort';
  return 'Vitality';
};

const normalizeModalities = (protocolSlug: string): string[] => {
  const protocol = protocolBySlug[protocolSlug];
  if (!protocol) return [];
  const modalities = new Set<string>();

  protocol.weeks.forEach((week) => {
    week.days.forEach((day) => {
      day.sessions.forEach((session) => {
        const label = session.modality.toLowerCase();
        if (label.includes('hb')) modalities.add('HBOT');
        else if (label.includes('hydrogen')) modalities.add('H2');
        else if (label.includes('red') || label.includes('nir')) modalities.add('RLT');
        else if (label.includes('pemf')) modalities.add('PEMF');
      });
    });
  });

  return Array.from(modalities);
};

const matchesTime = (timePerDay: string, selectedTime: TimeFilter): boolean => {
  if (selectedTime === 'All') return true;

  const value = timePerDay.toLowerCase();
  if (selectedTime === '15 min') return value.includes('15');
  if (selectedTime === '30 min') return value.includes('30');
  if (selectedTime === '45 min') return value.includes('45');

  return (
    value.includes('60') ||
    value.includes('70') ||
    value.includes('75') ||
    value.includes('90') ||
    value.includes('95')
  );
};

const getGoalTheme = (goalTag: string) => {
  const value = goalTag.toLowerCase();

  if (value.includes('recovery')) {
    return {
      shell: 'from-cyan-100/80 via-white to-sky-100/70',
      glow: 'bg-cyan-400/20',
      badge: 'border-cyan-200 bg-cyan-500/10 text-cyan-800',
      accent: 'text-cyan-700',
      accentSurface: 'border-cyan-200/80 bg-cyan-50/80',
    };
  }

  if (value.includes('sleep')) {
    return {
      shell: 'from-indigo-100/80 via-white to-violet-100/70',
      glow: 'bg-indigo-400/20',
      badge: 'border-indigo-200 bg-indigo-500/10 text-indigo-800',
      accent: 'text-indigo-700',
      accentSurface: 'border-indigo-200/80 bg-indigo-50/80',
    };
  }

  if (value.includes('stress')) {
    return {
      shell: 'from-emerald-100/80 via-white to-teal-100/70',
      glow: 'bg-emerald-400/20',
      badge: 'border-emerald-200 bg-emerald-500/10 text-emerald-800',
      accent: 'text-emerald-700',
      accentSurface: 'border-emerald-200/80 bg-emerald-50/80',
    };
  }

  return {
    shell: 'from-slate-100/90 via-white to-slate-100/60',
    glow: 'bg-slate-400/20',
    badge: 'border-slate-200 bg-slate-500/10 text-slate-800',
    accent: 'text-slate-700',
    accentSurface: 'border-slate-200/80 bg-slate-50/80',
  };
};

const getModalityBadgeClass = (modality: string): string => {
  const value = modality.toLowerCase();

  if (value.includes('hb')) return 'border-cyan-200 bg-cyan-500/10 text-cyan-800';
  if (value.includes('h2') || value.includes('hydrogen'))
    return 'border-emerald-200 bg-emerald-500/10 text-emerald-800';
  if (value.includes('red') || value.includes('nir'))
    return 'border-rose-200 bg-rose-500/10 text-rose-800';
  if (value.includes('pemf') || value.includes('vns'))
    return 'border-violet-200 bg-violet-500/10 text-violet-800';

  return 'border-slate-200 bg-slate-500/10 text-slate-700';
};

const toCardData = (slug: string): ProtocolCardData => {
  const protocol = protocolBySlug[slug];
  if (!protocol) {
    return {
      slug,
      title: 'Protocol unavailable',
      goalTag: 'Vitality',
      timePerDay: 'N/A',
      difficulty: 'Beginner',
      modalities: [],
      description: 'Protocol data is currently unavailable.',
    };
  }

  return {
    slug: protocol.slug,
    title: protocol.title,
    goalTag: normalizeGoal(protocol.goalTag),
    timePerDay: protocol.timePerDay,
    difficulty: protocol.difficulty,
    modalities: normalizeModalities(protocol.slug),
    description: protocol.shortDescription,
  };
};

const getProductTechRoute = (modality: string): string | null => {
  if (modality === 'HBOT' || modality === 'O2') return 'hbot';
  if (modality === 'H2_inhalation' || modality === 'H2_water') return 'hydrogen';
  if (modality === 'RLT_NIR') return 'rlt';
  if (modality === 'PEMF' || modality === 'VNS') return 'pemf';
  return null;
};

const goalToConditionRoute = (goalTag: string): string => {
  const value = goalTag.toLowerCase();
  if (value.includes('recovery')) return '/conditions/recovery';
  if (value.includes('sleep')) return '/conditions/sleep';
  if (value.includes('stress')) return '/conditions/stress';
  if (value.includes('comfort')) return '/conditions/comfort';
  return '/conditions/vitality';
};

const FilterSelect: React.FC<{
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-700 focus:border-cyan-400 focus:outline-none"
    >
      {options.map((option) => (
        <option key={`${label}-${option}`} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const ProtocolDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const protocol = protocolBySlug[slug];

  if (!protocol) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Protocol not found</h2>
        <p className="mt-2 text-sm text-slate-600">
          This protocol may have been moved or is not available yet.
        </p>
        <Link
          href="/protocols"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Back to protocols
        </Link>
      </section>
    );
  }

  const relatedCards = protocol.relatedProtocolSlugs
    .map((relatedSlug) => protocolBySlug[relatedSlug])
    .filter(
      (relatedProtocol): relatedProtocol is NonNullable<typeof relatedProtocol> =>
        Boolean(relatedProtocol)
    )
    .map((relatedProtocol) => toCardData(relatedProtocol.slug));

  const goalTheme = getGoalTheme(protocol.goalTag);
  const modalities = normalizeModalities(protocol.slug);
  const protocolStats = [
    { label: 'Daily time', value: protocol.timePerDay },
    { label: 'Difficulty', value: protocol.difficulty },
    { label: 'Duration', value: `${protocol.durationWeeks} weeks` },
    { label: 'Version', value: `v${protocol.version}` },
  ];
  const sectionCardClass =
    'rounded-[28px] border border-slate-200/80 bg-white/88 p-6 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.4)] backdrop-blur md:p-8';

  return (
    <article className="space-y-8">
      <header
        id="protocol-intro"
        className={`relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br ${goalTheme.shell} p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] md:p-8 lg:p-10`}
      >
        <div className={`pointer-events-none absolute -left-16 top-0 h-44 w-44 rounded-full blur-3xl ${goalTheme.glow}`} />
        <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-white/70 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.95fr)]">
          <div>
            <Link
              href="/protocols"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
            >
              &larr; Back to all protocols
            </Link>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              <Sparkles size={12} className={goalTheme.accent} aria-hidden="true" />
              Structured protocol
            </div>

            <h1 className="futuristic-font mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {protocol.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span
                className={`rounded-full border px-3 py-1 font-semibold uppercase tracking-[0.18em] ${goalTheme.badge}`}
              >
                {normalizeGoal(protocol.goalTag)}
              </span>
              <span className="rounded-full border border-white/80 bg-white/75 px-3 py-1">
                {protocol.timePerDay}/day
              </span>
              <span className="rounded-full border border-white/80 bg-white/75 px-3 py-1">
                {protocol.difficulty}
              </span>
              <span className="rounded-full border border-white/80 bg-white/75 px-3 py-1">
                {protocol.durationWeeks} weeks
              </span>
              <span className="rounded-full border border-white/80 bg-white/75 px-3 py-1">
                v{protocol.version}
              </span>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
              {protocol.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={goalToConditionRoute(protocol.goalTag)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                View related condition
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link
                href="/research"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
              >
                Review evidence
                <BookOpen size={14} aria-hidden="true" />
              </Link>
            </div>

            {protocol.reviewer && (
              <div className="mt-6 rounded-2xl border border-white/80 bg-white/70 px-4 py-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Reviewed and assembled by
                </p>
                <p className="mt-2 text-sm text-slate-800">
                  {protocol.reviewer.name} - {protocol.reviewer.credentials}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200/80 bg-white/82 p-5 shadow-[0_25px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                <Target size={13} className={goalTheme.accent} aria-hidden="true" />
                Protocol snapshot
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {protocolStats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border px-4 py-3 ${goalTheme.accentSurface}`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-900/80 bg-slate-950 p-5 text-white shadow-[0_30px_90px_-52px_rgba(15,23,42,0.75)]">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                <Layers3 size={13} className="text-cyan-300" aria-hidden="true" />
                Modalities in this protocol
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {modalities.map((modality) => (
                  <span
                    key={modality}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getModalityBadgeClass(modality)}`}
                  >
                    {modality}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Built as a guided routine, not a plain checklist. The structure below maps devices,
                timing, and safety into one readable flow.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className={`${sectionCardClass} grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.8fr)]`}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Audience
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Who is this for</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{protocol.targetAudience}</p>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
            Commitment profile
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Time cadence</p>
              <p className="mt-2 text-sm font-semibold">{protocol.timePerDay} each day</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Protocol length</p>
              <p className="mt-2 text-sm font-semibold">{protocol.durationWeeks} week cycle</p>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionCardClass}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Stack
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Required devices</h2>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            {protocol.requiredDevices.length} devices in system
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {protocol.requiredDevices.map((requiredDevice) => {
            const product = productById[requiredDevice.productId];
            if (!product) return null;

            const minRentalPlan = (product.rentalPlans ?? []).map((plan) => plan.monthlyPrice);
            const minRental = minRentalPlan.length > 0 ? Math.min(...minRentalPlan) : null;
            const techRoute = getProductTechRoute(product.modality);

            return (
              <div
                key={requiredDevice.productId}
                className="rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 p-5 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p
                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getModalityBadgeClass(product.modality)}`}
                    >
                      {product.modality}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950">{product.title}</h3>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Role</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{requiredDevice.role}</p>
                  </div>
                </div>

                <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                  Role: {requiredDevice.role}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Purchase</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      EUR {product.purchasePrice.toLocaleString('de-DE')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Rental</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {minRental ? `from EUR ${minRental}/mo` : 'On request'}
                    </p>
                  </div>
                </div>

                {techRoute && (
                  <Link
                    href={`/product/${techRoute}`}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    View product
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/contact?bundle=${protocol.slug}&intent=purchase`}
            className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Explore purchase options
          </Link>
          <Link
            href={`/rental?bundle=${protocol.slug}`}
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Explore rentals
          </Link>
        </div>
      </section>

      <section className={sectionCardClass}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Flow
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Schedule</h2>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            {protocol.weeks.length} structured phases
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {protocol.weeks.map((week) => (
            <details
              key={week.number}
              className="group rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.35)]"
              open={week.number === 1}
            >
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Week {week.number}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{week.title}</p>
                  </div>

                  <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {week.days.length} active days
                  </div>
                </div>
              </summary>

              <div className="mt-4 space-y-3">
                {week.days.map((day) => (
                  <div
                    key={`${week.number}-${day.number}`}
                    className="rounded-[20px] border border-slate-200/80 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">Day {day.number}</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        {day.sessions.length} session{day.sessions.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {day.sessions.map((session, index) => (
                        <div
                          key={`${week.number}-${day.number}-${session.modality}-${index}`}
                          className="rounded-[18px] border border-slate-200 bg-slate-50/70 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span
                              className={`rounded-full border px-2.5 py-1 font-semibold ${getModalityBadgeClass(session.modality)}`}
                            >
                              {session.modality}
                            </span>
                            <span>{session.duration}</span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-slate-800">{session.parameters}</p>
                          {session.note && (
                            <p className="mt-3 text-xs leading-6 text-slate-500">{session.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className={`${sectionCardClass} grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]`}>
        <div className="rounded-[24px] border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
            <ShieldCheck size={13} aria-hidden="true" />
            What to keep in mind
          </div>
          <p className="mt-4 text-sm leading-7 text-amber-950">{protocol.safetyNotes}</p>
        </div>

        {protocol.contraindications.length > 0 ? (
          <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              <AlertTriangle size={13} className="text-amber-600" aria-hidden="true" />
              Contraindications
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {protocol.contraindications.map((contraindication) => (
                <li
                  key={`${protocol.slug}-${contraindication}`}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  {contraindication}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {protocol.evidenceIds.length > 0 && (
        <section className={sectionCardClass}>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <BookOpen size={13} className={goalTheme.accent} aria-hidden="true" />
            Evidence layer
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Related research</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {protocol.evidenceIds.map((evidenceId) => {
              const evidence = evidenceById[evidenceId];
              if (!evidence) return null;

              return (
                <article
                  key={evidence.id}
                  className="rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-5"
                >
                  <h3 className="text-base font-semibold text-slate-950">{evidence.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">
                    {evidence.publication} - {evidence.year}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{evidence.resultSummary}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {relatedCards.length > 0 && (
        <section className={sectionCardClass}>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Layers3 size={13} className={goalTheme.accent} aria-hidden="true" />
            Next steps
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Related protocols</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedCards.map((relatedProtocol) => (
              <ProtocolCard
                key={relatedProtocol.slug}
                protocol={relatedProtocol}
                href={`/protocols/${relatedProtocol.slug}`}
                compact
              />
            ))}
          </div>
        </section>
      )}

      <div className="rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-4 text-sm leading-7 text-slate-300 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.85)]">
        {disclaimers.protocol}
      </div>
    </article>
  );
};

interface ProtocolExplorerProps {
  slug?: string;
  onNavigate?: (page: string) => void;
}

export const ProtocolExplorer: React.FC<ProtocolExplorerProps> = ({ slug, onNavigate: _onNavigate }) => {
  const [goal, setGoal] = useState<GoalFilter>('All');
  const [technology, setTechnology] = useState<TechFilter>('All');
  const [level, setLevel] = useState<LevelFilter>('All');
  const [timePerDay, setTimePerDay] = useState<TimeFilter>('All');

  const allCards = useMemo(() => protocols.map((protocol) => toCardData(protocol.slug)), []);

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesGoal = goal === 'All' || card.goalTag === goal;
      const matchesTech = technology === 'All' || card.modalities.includes(technology);
      const matchesLevel = level === 'All' || card.difficulty === level;
      const matchesTimePerDay = matchesTime(card.timePerDay, timePerDay);

      return matchesGoal && matchesTech && matchesLevel && matchesTimePerDay;
    });
  }, [allCards, goal, technology, level, timePerDay]);

  const selectedSlug = slug && protocolBySlug[slug] ? slug : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_38%,_rgba(226,232,240,0.88)_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {selectedSlug ? (
          <ProtocolDetailView slug={selectedSlug} />
        ) : (
          <>
            <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <h1 id="protocols-hero-headline" className="text-3xl font-bold text-slate-900">Usage Protocols</h1>
              <p id="protocols-hero-description" className="mt-2 text-sm text-slate-600">
                Structured usage schedules for regeneration technologies. Step by step.
              </p>
            </header>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <FilterSelect
                  label="Goal"
                  value={goal}
                  options={GOAL_OPTIONS}
                  onChange={(value) => setGoal(value as GoalFilter)}
                />
                <FilterSelect
                  label="Technology"
                  value={technology}
                  options={TECHNOLOGY_OPTIONS}
                  onChange={(value) => setTechnology(value as TechFilter)}
                />
                <FilterSelect
                  label="Level"
                  value={level}
                  options={LEVEL_OPTIONS}
                  onChange={(value) => setLevel(value as LevelFilter)}
                />
                <FilterSelect
                  label="Time/day"
                  value={timePerDay}
                  options={TIME_OPTIONS}
                  onChange={(value) => setTimePerDay(value as TimeFilter)}
                />
              </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCards.map((protocolCard) => (
                <ProtocolCard
                  key={protocolCard.slug}
                  protocol={protocolCard}
                  href={`/protocols/${protocolCard.slug}`}
                  compact
                />
              ))}
            </section>

            {filteredCards.length === 0 && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle size={16} /> No protocols found for the selected filters.
                </p>
                <p className="mt-2">Try widening filters to see all available schedules.</p>
              </div>
            )}

            <footer className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
              <p className="flex items-start gap-2 leading-relaxed">
                <Clock size={14} className="mt-0.5 shrink-0 text-slate-500" />
                {disclaimers.protocol}
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
