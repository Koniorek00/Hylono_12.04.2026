import React, { useMemo, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { TechType } from '../types';
import { protocols, protocolBySlug } from '../content/protocols';
import { productById } from '../content/products';
import { evidenceById } from '../content/evidence';
import { disclaimers } from '../content/disclaimers';
import { ProtocolCard, ProtocolCardData } from './protocols/ProtocolCard';

const GOAL_OPTIONS = ['All', 'Recovery', 'Sleep', 'Stress', 'Comfort', 'Vitality'] as const;
const TECHNOLOGY_OPTIONS = ['All', 'mHBOT', 'H2', 'RLT', 'PEMF'] as const;
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
        if (label.includes('hb')) modalities.add('mHBOT');
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

const getProductTechRoute = (modality: string): TechType | null => {
  if (modality === 'mHBOT' || modality === 'O2') return TechType.HBOT;
  if (modality === 'H2_inhalation' || modality === 'H2_water') return TechType.HYDROGEN;
  if (modality === 'RLT_NIR') return TechType.RLT;
  if (modality === 'PEMF' || modality === 'VNS') return TechType.PEMF;
  return null;
};

const FilterSelect: React.FC<{
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
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

const ProtocolDetailView: React.FC<{
  slug: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}> = ({ slug, onBack, onNavigate }) => {
  const protocol = protocolBySlug[slug];

  if (!protocol) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Protocol not found</h2>
        <p className="mt-2 text-sm text-slate-600">This protocol may have been moved or is not available yet.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Back to protocols
        </button>
      </section>
    );
  }

  const relatedCards = protocol.relatedProtocolSlugs
    .map((relatedSlug) => protocolBySlug[relatedSlug])
    .filter((relatedProtocol): relatedProtocol is NonNullable<typeof relatedProtocol> => Boolean(relatedProtocol))
    .map((relatedProtocol) => toCardData(relatedProtocol.slug));

  return (
    <article className="space-y-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
        >
          ← Back to all protocols
        </button>

        <h1 className="text-3xl font-bold text-slate-900">{protocol.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-cyan-50 px-2 py-1 font-semibold text-cyan-700 uppercase tracking-wide">
            {normalizeGoal(protocol.goalTag)}
          </span>
          <span>⏱ {protocol.timePerDay}/day</span>
          <span>📊 {protocol.difficulty}</span>
          <span>📅 {protocol.durationWeeks} weeks</span>
          <span>v{protocol.version}</span>
        </div>

        {protocol.reviewer && (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Developed by: {protocol.reviewer.name} — {protocol.reviewer.credentials}
          </p>
        )}
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900">Who is this for</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{protocol.targetAudience}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900">Required devices</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {protocol.requiredDevices.map((requiredDevice) => {
            const product = productById[requiredDevice.productId];
            if (!product) return null;

            const minRental = Math.min(...(product.rentalPlans ?? []).map((plan) => plan.monthlyPrice));

            return (
              <div key={requiredDevice.productId} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{product.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Role: {requiredDevice.role}</p>
                <p className="mt-3 text-sm text-slate-600">
                  Buy: €{product.purchasePrice.toLocaleString('de-DE')} | Rent: from €{minRental}/mo
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const techRoute = getProductTechRoute(product.modality);
                    if (techRoute) {
                      onNavigate?.(`product/${techRoute}`);
                    }
                  }}
                  className="mt-3 min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View product →
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate?.(`checkout?bundle=${protocol.slug}`)}
            className="min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Buy the bundle for this protocol
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.(`rental/checkout?bundle=${protocol.slug}`)}
            className="min-h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Rent the bundle
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900">Schedule</h2>

        <div className="mt-4 space-y-4">
          {protocol.weeks.map((week) => (
            <details key={week.number} className="rounded-xl border border-slate-200 p-4" open={week.number === 1}>
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                Week {week.number}: {week.title}
              </summary>

              <div className="mt-4 space-y-3">
                {week.days.map((day) => (
                  <div key={`${week.number}-${day.number}`} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">Day {day.number}</p>

                    <div className="mt-2 space-y-2">
                      {day.sessions.map((session, index) => (
                        <div
                          key={`${week.number}-${day.number}-${session.modality}-${index}`}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className="rounded-full bg-cyan-50 px-2 py-1 font-semibold text-cyan-700">
                              {session.modality}
                            </span>
                            <span>{session.duration}</span>
                            <span>{session.parameters}</span>
                          </div>
                          {session.note && <p className="mt-2 text-xs text-slate-500">{session.note}</p>}
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900">What to keep in mind</h2>
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {protocol.safetyNotes}
        </p>

        {protocol.contraindications.length > 0 && (
          <details className="mt-4 rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">Contraindications</summary>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {protocol.contraindications.map((contraindication) => (
                <li key={`${protocol.slug}-${contraindication}`}>{contraindication}</li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {protocol.evidenceIds.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Related research</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {protocol.evidenceIds.map((evidenceId) => {
              const evidence = evidenceById[evidenceId];
              if (!evidence) return null;

              return (
                <article key={evidence.id} className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{evidence.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">
                    {evidence.publication} • {evidence.year}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{evidence.resultSummary}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {relatedCards.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Related protocols</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedCards.map((relatedProtocol) => (
              <ProtocolCard
                key={relatedProtocol.slug}
                protocol={relatedProtocol}
                onOpen={(nextSlug) => onNavigate?.(`protocols/${nextSlug}`)}
                compact
              />
            ))}
          </div>
        </section>
      )}

      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        {disclaimers.protocol}
      </p>
    </article>
  );
};

interface ProtocolExplorerProps {
  slug?: string;
  onNavigate?: (page: string) => void;
}

export const ProtocolExplorer: React.FC<ProtocolExplorerProps> = ({ slug, onNavigate }) => {
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {selectedSlug ? (
          <ProtocolDetailView slug={selectedSlug} onBack={() => onNavigate?.('protocols')} onNavigate={onNavigate} />
        ) : (
          <>
            <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <h1 className="text-3xl font-bold text-slate-900">Usage Protocols</h1>
              <p className="mt-2 text-sm text-slate-600">
                Proven usage schedules for regeneration technologies. Step by step.
              </p>
            </header>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <FilterSelect label="Goal" value={goal} options={GOAL_OPTIONS} onChange={(value) => setGoal(value as GoalFilter)} />
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
                  onOpen={(protocolSlug) => onNavigate?.(`protocols/${protocolSlug}`)}
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
