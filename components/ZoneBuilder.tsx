import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '../content/products';
import { protocols } from '../content/protocols';
import { toProtocolCardView } from '../content/protocolView';
import { goalModalityRelevance, modalityLabels, synergies } from '../config/builderRules';
import { ProtocolCard } from './protocols/ProtocolCard';

type BuilderStep = 'entry' | 'goal' | 'budget' | 'modality' | 'space' | 'result';
type EntryPath = 'goal' | 'budget' | 'modality' | 'space';
type GoalKey = 'recovery' | 'sleep' | 'stress' | 'comfort' | 'vitality';
type BudgetMode = 'purchase' | 'rental';

const GOAL_OPTIONS: Array<{ id: GoalKey; label: string }> = [
  { id: 'recovery', label: 'Recovery after physical activity' },
  { id: 'sleep', label: 'Better sleep and rest' },
  { id: 'stress', label: 'Stress and tension reduction' },
  { id: 'comfort', label: 'Comfort and renewal' },
  { id: 'vitality', label: 'General strengthening and vitality' },
];

const MODALITY_OPTIONS: Array<{ id: keyof typeof modalityLabels; label: string }> = [
  { id: 'HBOT', label: 'HBOT' },
  { id: 'H2', label: 'H2' },
  { id: 'RLT_NIR', label: 'RLT' },
  { id: 'PEMF', label: 'PEMF' },
];

const SPACE_OPTIONS = ['Home room', 'Clinic room', 'Studio corner', 'Dedicated wellness zone'] as const;

const modalityToProductModalities: Record<string, string[]> = {
  HBOT: ['HBOT', 'O2'],
  H2: ['H2_inhalation', 'H2_water'],
  RLT_NIR: ['RLT_NIR'],
  PEMF: ['PEMF', 'VNS'],
};

const modalityToLabel: Record<string, string> = {
  HBOT: 'HBOT',
  H2: 'H2',
  RLT_NIR: 'RLT',
  PEMF: 'PEMF',
};

interface ZoneBuilderProps {
  onComplete: () => void;
}

export const ZoneBuilder: React.FC<ZoneBuilderProps> = ({ onComplete }) => {
  const router = useRouter();
  const [step, setStep] = useState<BuilderStep>('entry');
  const [entryPath, setEntryPath] = useState<EntryPath | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<GoalKey[]>([]);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>('purchase');
  const [budget, setBudget] = useState<number>(20000);
  const [selectedModality, setSelectedModality] = useState<keyof typeof modalityToProductModalities | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const recommendation = useMemo(() => {
    const modalityScores: Record<string, number> = { HBOT: 0, H2: 0, RLT_NIR: 0, PEMF: 0 };

    if (selectedGoals.length > 0) {
      selectedGoals.forEach((goal) => {
        const map = goalModalityRelevance[goal] ?? {};
        Object.entries(map).forEach(([modality, value]) => {
          modalityScores[modality] = (modalityScores[modality] ?? 0) + value;
        });
      });
    }

    if (selectedModality) {
      modalityScores[selectedModality] = (modalityScores[selectedModality] ?? 0) + 2;
    }

    const rankedModalities = Object.entries(modalityScores)
      .sort((a, b) => b[1] - a[1])
      .map(([modality]) => modality)
      .filter((modality) => (modalityScores[modality] ?? 0) > 0)
      .slice(0, 3);

    const recommendations = rankedModalities
      .map((modality) => {
        const allowed = modalityToProductModalities[modality] ?? [];
        if (allowed.length === 0) return null;

        const candidates = products.filter((product) => allowed.includes(product.modality));

        const filteredByBudget = candidates.filter((product) => {
          if (budgetMode === 'purchase') return product.purchasePrice <= budget;
          const minRental = Math.min(...(product.rentalPlans ?? []).map((plan) => plan.monthlyPrice));
          return Number.isFinite(minRental) ? minRental <= budget : false;
        });

        const selectedCandidate = (filteredByBudget[0] ?? candidates[0]) ?? null;
        if (!selectedCandidate) return null;

        const minRental = Math.min(...(selectedCandidate.rentalPlans ?? []).map((plan) => plan.monthlyPrice));

        return {
          productId: selectedCandidate.id,
          name: selectedCandidate.title,
          reason:
            selectedGoals.length > 0
              ? `Aligned with ${selectedGoals.join(', ')} goal${selectedGoals.length > 1 ? 's' : ''}.`
              : `Aligned with ${modalityToLabel[modality] ?? modality} preference.`,
          modality,
          purchasePrice: selectedCandidate.purchasePrice,
          rentalPrice: Number.isFinite(minRental) ? minRental : 0,
          selected: selectedProductIds.includes(selectedCandidate.id),
        };
      })
      .filter(Boolean) as Array<{
      productId: string;
      name: string;
      reason: string;
      modality: string;
      purchasePrice: number;
      rentalPrice: number;
      selected: boolean;
    }>;

    const selectedModalities = recommendations.map((item) => item.modality);
    const activeSynergies = synergies.filter((synergy) =>
      synergy.pair.every((pairMember) => selectedModalities.includes(pairMember))
    );

    const suggestedProtocol = protocols
      .map((protocol) => toProtocolCardView(protocol.slug))
      .filter((card): card is NonNullable<typeof card> => Boolean(card))
      .find((card) =>
        selectedGoals.length > 0
          ? selectedGoals.some((goal) => card.goalTag.toLowerCase() === goal)
          : true
      );

    const selectedOrAll = recommendations.filter((item) => selectedProductIds.includes(item.productId));
    const base = selectedOrAll.length > 0 ? selectedOrAll : recommendations;

    const totalPurchase = base.reduce((sum, item) => sum + item.purchasePrice, 0);
    const totalRental = base.reduce((sum, item) => sum + item.rentalPrice, 0);
    const financingMonthly = totalPurchase > 0 ? Math.round(totalPurchase / 36) : 0;

    return {
      recommendations,
      activeSynergies,
      suggestedProtocol,
      totalPurchase,
      totalRental,
      financingMonthly,
    };
  }, [budget, budgetMode, selectedGoals, selectedModality, selectedProductIds]);

  const toggleGoal = (goal: GoalKey) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]));
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const primarySynergy = recommendation.activeSynergies[0];

  const generateRecommendation = () => {
    setStep('result');
  };

  const saveConfiguration = () => {
    try {
      window.localStorage.setItem(
        'hylono_builder_configuration',
        JSON.stringify({ entryPath, selectedGoals, budgetMode, budget, selectedModality, selectedSpace, selectedProductIds })
      );
    } catch {
      // Ignore storage errors (private browsing, quota exceeded)
    }
  };

  const shareConfiguration = async () => {
    const params = new URLSearchParams();
    if (selectedGoals.length > 0) params.set('goals', selectedGoals.join(','));
    if (entryPath) params.set('path', entryPath);
    params.set('budgetMode', budgetMode);
    params.set('budget', String(budget));
    if (selectedModality) params.set('modality', selectedModality);
    if (selectedSpace) params.set('space', selectedSpace);

    const shareUrl = `${window.location.origin}/builder?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard API unavailable or permission denied — silently ignore
    }
  };

  const startRentalFlow = () => {
    router.push('/rental/checkout');
    window.scrollTo(0, 0);
  };

  const setPath = (path: EntryPath) => {
    setEntryPath(path);
    setStep(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-16 md:pt-8">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h1 className="text-3xl font-bold text-slate-900">Wellness Planner</h1>
          <p className="mt-2 text-sm text-slate-600">
            Answer a few questions and we'll match you with the right technologies and protocol.
          </p>
        </header>

        {step === 'entry' && (
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { id: 'goal', icon: '🎯', title: "I'll start with a goal", description: 'What do you want to achieve?' },
              { id: 'budget', icon: '💰', title: 'I have a budget', description: 'Tell us how much you want to spend' },
              { id: 'modality', icon: '🔬', title: "I know what I'm looking for", description: 'Start from a specific technology' },
              { id: 'space', icon: '📐', title: 'I have a space', description: 'Room, clinic, or studio?' },
            ].map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setPath(card.id as EntryPath)}
                className="min-h-11 rounded-2xl border border-slate-200 bg-white p-6 text-left hover:border-cyan-300 hover:shadow-md transition-all"
              >
                <p className="text-2xl" aria-hidden>
                  {card.icon}
                </p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{card.description}</p>
              </button>
            ))}
          </section>
        )}

        {step === 'goal' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">What matters most to you?</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {GOAL_OPTIONS.map((goal) => (
                <label key={goal.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal.id)}
                    onChange={() => toggleGoal(goal.id)}
                    className="h-4 w-4"
                  />
                  <span>{goal.label}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={generateRecommendation}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show recommendation →
            </button>
          </section>
        )}

        {step === 'budget' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">How do you want to use it?</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                <input
                  type="radio"
                  name="budgetMode"
                  checked={budgetMode === 'purchase'}
                  onChange={() => {
                    setBudgetMode('purchase');
                    setBudget(20000);
                  }}
                />
                <span>I&apos;m buying — one-time investment</span>
              </label>
              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                <input
                  type="radio"
                  name="budgetMode"
                  checked={budgetMode === 'rental'}
                  onChange={() => {
                    setBudgetMode('rental');
                    setBudget(1200);
                  }}
                />
                <span>I&apos;m renting — monthly payment</span>
              </label>
            </div>

            <div className="mt-5">
              <label htmlFor="zb-budget" className="text-sm font-semibold text-slate-700">
                {budgetMode === 'purchase' ? `Budget: €${budget.toLocaleString('de-DE')}` : `Budget: €${budget}/mo`}
              </label>
              <input
                id="zb-budget"
                type="range"
                min={budgetMode === 'purchase' ? 5000 : 500}
                max={budgetMode === 'purchase' ? 80000 : 5000}
                step={budgetMode === 'purchase' ? 1000 : 100}
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </div>

            <button
              type="button"
              onClick={generateRecommendation}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show recommendation →
            </button>
          </section>
        )}

        {step === 'modality' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">Choose a starting modality</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {MODALITY_OPTIONS.map((option) => (
                <label key={option.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="selectedModality"
                    checked={selectedModality === option.id}
                    onChange={() => setSelectedModality(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={generateRecommendation}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show recommendation →
            </button>
          </section>
        )}

        {step === 'space' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">What kind of space do you have?</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {SPACE_OPTIONS.map((space) => (
                <label key={space} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="selectedSpace"
                    checked={selectedSpace === space}
                    onChange={() => setSelectedSpace(space)}
                  />
                  <span>{space}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={generateRecommendation}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show recommendation →
            </button>
          </section>
        )}

        {step === 'result' && (
          <section className="mt-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Your regeneration stack</h2>
              {selectedGoals.length > 0 && (
                <p className="mt-2 text-sm text-slate-600">Goal: {selectedGoals.join(', ')}</p>
              )}

              <div className="mt-6 space-y-4">
                {recommendation.recommendations.map((item, index) => (
                  <article key={item.productId} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      {index === 0 ? '★ Primary' : '✦ Complementary'}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                    <p className="mt-2 text-sm text-slate-700">
                      Buy: €{item.purchasePrice.toLocaleString('de-DE')} | Rent: from €{item.rentalPrice}/mo
                    </p>
                    <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(item.productId)}
                        onChange={() => toggleProduct(item.productId)}
                      />
                      Add to stack
                    </label>
                  </article>
                ))}
              </div>

              {primarySynergy && (
                <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
                  <strong>Synergy:</strong> {primarySynergy.description}
                </div>
              )}

              {recommendation.suggestedProtocol && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900">Suggested protocol</h3>
                  <div className="mt-3 max-w-xl">
                    <ProtocolCard
                      protocol={recommendation.suggestedProtocol}
                      onOpen={(protocolSlug) => {
                        router.push(`/protocols/${protocolSlug}`);
                        window.scrollTo(0, 0);
                      }}
                      compact
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Purchase:</span> €
                  {recommendation.totalPurchase.toLocaleString('de-DE')}
                </p>
                <p>
                  <span className="font-semibold">Installments:</span> from €{recommendation.financingMonthly}/mo
                </p>
                <p>
                  <span className="font-semibold">Rental:</span> €{recommendation.totalRental}/mo
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onComplete}
                  className="min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Buy stack
                </button>
                <button
                  type="button"
                  onClick={startRentalFlow}
                  className="min-h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Rent stack
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveConfiguration}
                  className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Save configuration
                </button>
                <button
                  type="button"
                  onClick={shareConfiguration}
                  className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Share link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/contact');
                    window.scrollTo(0, 0);
                  }}
                  className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Book a consultation
                </button>
              </div>
            </div>
          </section>
        )}

        {step !== 'entry' && (
          <button
            type="button"
            onClick={() => setStep('entry')}
            className="mt-6 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            ← Change entry path
          </button>
        )}
      </div>
    </div>
  );
};
