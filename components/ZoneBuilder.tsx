import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { products } from '@/content/products';
import { conditionGoalBySlug } from '@/content/conditions';
import { evidenceById } from '@/content/evidence';
import { protocols } from '@/content/protocols';
import { toProtocolCardView } from '@/content/protocolView';
import {
  PLANNER_STORAGE_KEY,
  buildPlannerSearchParams,
  normalizePlannerModality,
  parsePlannerSearchParams,
  plannerGoalLabels,
  plannerModalityLabels,
  plannerModalityToProductRoute,
  sanitizePlannerSelectionState,
  summarizePlannerSelection,
  type PlannerBudgetMode,
  type PlannerEntryPath,
  type PlannerGoalKey,
  type PlannerModalityKey,
  type PlannerSelectionState,
  type PlannerTier,
} from '@/lib/planner-state';
import { TECH_DETAILS } from '../constants';
import { goalModalityRelevance, synergies } from '../config/builderRules';
import { TechType } from '../types';
import { ProtocolCard } from './protocols/ProtocolCard';

type BuilderStep = 'entry' | 'goal' | 'budget' | 'modality' | 'space' | 'result';
type EntryPath = PlannerEntryPath;
type GoalKey = PlannerGoalKey;
type BudgetMode = PlannerBudgetMode;
type ModalityKey = PlannerModalityKey;

const GOAL_OPTIONS: Array<{ id: GoalKey; label: string }> = [
  { id: 'recovery', label: 'Recovery after physical activity' },
  { id: 'sleep', label: 'Better sleep and rest' },
  { id: 'stress', label: 'Stress and tension reduction' },
  { id: 'comfort', label: 'Comfort and renewal' },
  { id: 'vitality', label: 'General strengthening and vitality' },
];

const MODALITY_OPTIONS: Array<{ id: ModalityKey; label: string }> = [
  { id: 'HBOT', label: 'HBOT' },
  { id: 'H2', label: 'H2' },
  { id: 'RLT_NIR', label: 'RLT' },
  { id: 'PEMF', label: 'PEMF' },
];

const SPACE_OPTIONS = [
  'Home room',
  'Clinic room',
  'Studio corner',
  'Dedicated wellness zone',
] as const;

const modalityToProductModalities: Record<ModalityKey, string[]> = {
  HBOT: ['HBOT', 'O2'],
  H2: ['H2_inhalation', 'H2_water'],
  RLT_NIR: ['RLT_NIR'],
  PEMF: ['PEMF', 'VNS'],
};

const modalityProductLinks: Record<ModalityKey, string> = {
  HBOT: '/product/hbot',
  H2: '/product/hydrogen',
  RLT_NIR: '/product/rlt',
  PEMF: '/product/pemf',
};

const spaceModalityRelevance: Record<string, Record<ModalityKey, number>> = {
  'Home room': { HBOT: 1, H2: 3, RLT_NIR: 3, PEMF: 3 },
  'Clinic room': { HBOT: 3, H2: 2, RLT_NIR: 2, PEMF: 2 },
  'Studio corner': { HBOT: 1, H2: 2, RLT_NIR: 3, PEMF: 3 },
  'Dedicated wellness zone': { HBOT: 3, H2: 2, RLT_NIR: 2, PEMF: 2 },
};

const spacePlanningNotes: Record<string, string> = {
  'Home room':
    'Home-room mode favors lower-friction setup and easier daily access before larger-room installs.',
  'Clinic room':
    'Clinic-room mode prioritizes systems that fit more structured sessions and advisor-led planning.',
  'Studio corner':
    'Studio-corner mode favors compact routines and faster transitions between sessions.',
  'Dedicated wellness zone':
    'Dedicated-zone mode keeps room-specific systems in play and supports longer-session planning.',
};

const tierTitleMap: Record<PlannerTier, string> = {
  starter: 'Starter',
  optimal: 'Optimal',
  pro: 'Pro',
};

const defaultBudgetByMode: Record<BudgetMode, number> = {
  purchase: 20000,
  rental: 1200,
};

interface RecommendationItem {
  productId: string;
  name: string;
  reason: string;
  modality: ModalityKey;
  purchasePrice: number;
  rentalPrice: number;
  selected: boolean;
  withinBudget: boolean;
  productHref: string;
  scoreBreakdown: string[];
}

interface PlannerCatalogCandidate {
  id: string;
  title: string;
  purchasePrice: number;
  rentalPrice: number;
  productHref: string;
}

const fallbackTechByModality: Record<ModalityKey, TechType> = {
  HBOT: TechType.HBOT,
  H2: TechType.HYDROGEN,
  RLT_NIR: TechType.RLT,
  PEMF: TechType.PEMF,
};

const parseTechPrice = (priceLabel: string): number => {
  const parsed = Number.parseInt(priceLabel.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildFallbackCandidate = (modality: ModalityKey): PlannerCatalogCandidate | null => {
  const techType = fallbackTechByModality[modality];
  const tech = TECH_DETAILS[techType];

  if (!tech) {
    return null;
  }

  return {
    id: `tech-${tech.id.toLowerCase()}`,
    title: tech.name,
    purchasePrice: parseTechPrice(tech.price),
    rentalPrice: tech.rentalPrice ?? 0,
    productHref: `/product/${tech.id.toLowerCase()}`,
  };
};

const pickBestProductForModality = (
  modality: ModalityKey,
  budgetMode: BudgetMode,
  budget: number
) => {
  const allowedModalities = modalityToProductModalities[modality] ?? [];
  const realCandidates: PlannerCatalogCandidate[] = products
    .filter((product) => allowedModalities.includes(product.modality))
    .map((product) => {
      const rentalValues = (product.rentalPlans ?? []).map((plan) => plan.monthlyPrice);
      const rentalPrice = rentalValues.length > 0 ? Math.min(...rentalValues) : 0;

      return {
        id: product.id,
        title: product.title,
        purchasePrice: product.purchasePrice,
        rentalPrice,
        productHref: modalityProductLinks[modality],
      };
    });
  const fallbackCandidate = buildFallbackCandidate(modality);
  const candidates = (realCandidates.length > 0 ? realCandidates : [fallbackCandidate])
    .filter((entry): entry is PlannerCatalogCandidate => Boolean(entry))
    .map((product) => ({
      product,
      value: budgetMode === 'purchase' ? product.purchasePrice : product.rentalPrice,
    }))
    .filter((entry) => Number.isFinite(entry.value) && entry.value > 0)
    .sort((a, b) => a.value - b.value);

  const withinBudgetCandidate = candidates.find((entry) => entry.value <= budget);
  const bestCandidate = withinBudgetCandidate ?? candidates[0] ?? null;

  if (!bestCandidate) {
    return null;
  }

  return {
    product: bestCandidate.product,
    candidateValue: bestCandidate.value,
    withinBudget: bestCandidate.value <= budget,
  };
};

const resolveTierProductIds = (
  goal: GoalKey,
  tier: PlannerTier,
  budgetMode: BudgetMode,
  budget: number
): string[] => {
  const stack = conditionGoalBySlug[goal]?.stacks.find(
    (entry) => entry.title.toLowerCase() === tier
  );

  if (!stack) {
    return [];
  }

  return stack.devices
    .map((device) => normalizePlannerModality(device))
    .filter((modality): modality is ModalityKey => Boolean(modality))
    .map((modality) => pickBestProductForModality(modality, budgetMode, budget)?.product.id)
    .filter((productId): productId is string => Boolean(productId));
};

const formatBudgetLabel = (budgetMode: BudgetMode, budget: number) =>
  budgetMode === 'rental'
    ? `EUR ${budget.toLocaleString('de-DE')}/mo`
    : `EUR ${budget.toLocaleString('de-DE')}`;

const buildPlannerStateUrl = (
  pathname: string,
  state: Partial<PlannerSelectionState>,
  extraParams?: Record<string, string>
) => {
  const params = buildPlannerSearchParams(state);

  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

export const ZoneBuilder: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appliedSearchKeyRef = useRef<string>('');

  const [step, setStep] = useState<BuilderStep>('entry');
  const [entryPath, setEntryPath] = useState<EntryPath | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<GoalKey[]>([]);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>('purchase');
  const [budget, setBudget] = useState<number>(defaultBudgetByMode.purchase);
  const [selectedModality, setSelectedModality] = useState<ModalityKey | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<PlannerTier | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [savedConfigurationAvailable, setSavedConfigurationAvailable] = useState(false);

  const recommendation = useMemo(() => {
    const rankedModalities = (Object.keys(modalityToProductModalities) as ModalityKey[])
      .map((modality) => {
        const goalScore = selectedGoals.reduce(
          (sum, goal) => sum + (goalModalityRelevance[goal]?.[modality] ?? 0),
          0
        );
        const modalityPreferenceScore = selectedModality === modality ? 4 : 0;
        const spaceScore = selectedSpace
          ? (spaceModalityRelevance[selectedSpace]?.[modality] ?? 0)
          : 0;
        const candidate = pickBestProductForModality(modality, budgetMode, budget);

        if (!candidate) {
          return null;
        }

        const budgetScore = candidate.withinBudget
          ? selectedGoals.length || selectedModality || selectedSpace
            ? 2
            : 5
          : selectedGoals.length || selectedModality || selectedSpace
            ? -1
            : -4;
        const affordabilityBonus =
          candidate.withinBudget && budget > 0
            ? Number(((budget - candidate.candidateValue) / budget).toFixed(2))
            : 0;
        const totalScore =
          goalScore +
          modalityPreferenceScore +
          spaceScore +
          budgetScore +
          affordabilityBonus;

        const scoreBreakdown = [
          ...(goalScore > 0 ? [`Goal match score: ${goalScore}`] : []),
          ...(modalityPreferenceScore > 0 ? ['Direct modality preference applied'] : []),
          ...(spaceScore > 0 ? [`Space-planning signal: ${spaceScore}`] : []),
          candidate.withinBudget
            ? `Fits ${budgetMode === 'rental' ? 'monthly' : 'purchase'} budget`
            : `Above current ${budgetMode === 'rental' ? 'monthly' : 'purchase'} budget`,
        ];

        const reasonParts = [
          ...(selectedGoals.length > 0
            ? [`Aligned with ${selectedGoals.map((goal) => plannerGoalLabels[goal]).join(', ')}.`]
            : []),
          ...(selectedModality === modality
            ? ['Matches your selected technology preference.']
            : []),
          ...(selectedSpace ? [spacePlanningNotes[selectedSpace]] : []),
          candidate.withinBudget
            ? [`Visible pricing stays within ${formatBudgetLabel(budgetMode, budget)}.`]
            : [
                `This option may need a higher ${
                  budgetMode === 'rental' ? 'monthly' : 'purchase'
                } budget.`,
              ],
        ];

        return {
          modality,
          totalScore,
          candidate,
          scoreBreakdown,
          reason: reasonParts.join(' '),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) {
          return b.totalScore - a.totalScore;
        }

        return a.candidate.candidateValue - b.candidate.candidateValue;
      })
      .slice(0, 3);

    const recommendations: RecommendationItem[] = rankedModalities.map((entry) => {
      return {
        productId: entry.candidate.product.id,
        name: entry.candidate.product.title,
        reason: entry.reason,
        modality: entry.modality,
        purchasePrice: entry.candidate.product.purchasePrice,
        rentalPrice: entry.candidate.product.rentalPrice,
        selected: selectedProductIds.includes(entry.candidate.product.id),
        withinBudget: entry.candidate.withinBudget,
        productHref: entry.candidate.product.productHref,
        scoreBreakdown: entry.scoreBreakdown,
      };
    });

    const selectedModalities = recommendations.map((item) => item.modality);
    const activeSynergies = synergies.filter((synergy) =>
      synergy.pair.every((pairMember) => selectedModalities.includes(pairMember as ModalityKey))
    );

    const suggestedProtocol =
      selectedGoals.length === 0
        ? null
        : protocols
            .map((protocol) => toProtocolCardView(protocol.slug))
            .filter((card): card is NonNullable<typeof card> => Boolean(card))
            .find((card) =>
              selectedGoals.some((goal) => card.goalTag.toLowerCase() === goal)
            ) ?? null;

    const relatedGoalGuides = selectedGoals
      .map((goal) => conditionGoalBySlug[goal])
      .filter((goal): goal is NonNullable<typeof goal> => Boolean(goal));
    const relatedEvidence = Array.from(
      new Set(relatedGoalGuides.flatMap((goal) => goal.evidenceIds))
    )
      .map((evidenceId) => evidenceById[evidenceId])
      .filter((evidence): evidence is NonNullable<typeof evidence> => Boolean(evidence))
      .slice(0, 3);

    const selectedOrAll = recommendations.filter((item) =>
      selectedProductIds.includes(item.productId)
    );
    const activeItems = selectedOrAll.length > 0 ? selectedOrAll : recommendations;

    return {
      recommendations,
      activeSynergies,
      suggestedProtocol,
      relatedGoalGuides,
      relatedEvidence,
      totalPurchase: activeItems.reduce((sum, item) => sum + item.purchasePrice, 0),
      totalRental: activeItems.reduce((sum, item) => sum + item.rentalPrice, 0),
      financingMonthly:
        activeItems.reduce((sum, item) => sum + item.purchasePrice, 0) > 0
          ? Math.round(activeItems.reduce((sum, item) => sum + item.purchasePrice, 0) / 36)
          : 0,
      primaryRecommendation: recommendations[0] ?? null,
      lowerBudgetAlternative:
        recommendations.length > 1
          ? [...recommendations].sort((a, b) => a.purchasePrice - b.purchasePrice)[0] ?? null
          : null,
      rentalFirstRecommendation:
        recommendations.length > 0
          ? [...recommendations].sort((a, b) => a.rentalPrice - b.rentalPrice)[0] ?? null
          : null,
      emptyStateReason:
        recommendations.length === 0
          ? `No current product shortlist fits ${formatBudgetLabel(budgetMode, budget)}.`
          : null,
      activeProductIds: activeItems.map((item) => item.productId),
    };
  }, [budget, budgetMode, selectedGoals, selectedModality, selectedProductIds, selectedSpace]);

  const currentPlannerState: PlannerSelectionState = useMemo(
    () => ({
      source: 'planner',
      ...(entryPath ? { entryPath } : {}),
      goals: selectedGoals,
      budgetMode,
      budget,
      ...(selectedModality ? { modality: selectedModality } : {}),
      ...(selectedSpace ? { space: selectedSpace } : {}),
      productIds: recommendation.activeProductIds,
      ...(selectedTier ? { tier: selectedTier } : {}),
    }),
    [
      budget,
      budgetMode,
      entryPath,
      recommendation.activeProductIds,
      selectedGoals,
      selectedModality,
      selectedSpace,
      selectedTier,
    ]
  );

  const methodologyPoints = useMemo(
    () =>
      summarizePlannerSelection(currentPlannerState).concat([
        'Matching uses Hylono goal-to-modality rules, visible catalog pricing, and optional space-planning signals.',
        'The planner does not replace a human review of room setup, medical history, or final protocol suitability.',
      ]),
    [currentPlannerState]
  );

  const applyPlannerSelectionState = (
    state: PlannerSelectionState,
    nextStep?: BuilderStep
  ) => {
    const resolvedBudgetMode = state.budgetMode ?? 'purchase';
    const resolvedBudget = state.budget ?? defaultBudgetByMode[resolvedBudgetMode];
    const primaryGoal = state.goals[0];
    const derivedProductIds =
      state.productIds.length > 0
        ? state.productIds
        : state.goals.length === 1 && state.tier && primaryGoal
          ? resolveTierProductIds(
              primaryGoal,
              state.tier,
              resolvedBudgetMode,
              resolvedBudget
            )
          : [];

    setEntryPath(state.entryPath ?? null);
    setSelectedGoals(state.goals);
    setBudgetMode(resolvedBudgetMode);
    setBudget(resolvedBudget);
    setSelectedModality(state.modality ?? null);
    setSelectedSpace(state.space ?? null);
    setSelectedProductIds(derivedProductIds);
    setSelectedTier(state.tier ?? null);
    setStep(nextStep ?? 'result');
  };

  useEffect(() => {
    try {
      setSavedConfigurationAvailable(Boolean(window.localStorage.getItem(PLANNER_STORAGE_KEY)));
    } catch {
      setSavedConfigurationAvailable(false);
    }
  }, []);

  useEffect(() => {
    const parsedState = parsePlannerSearchParams(searchParams);

    if (!parsedState) {
      return;
    }

    const stateKey = JSON.stringify(parsedState);
    if (appliedSearchKeyRef.current === stateKey) {
      return;
    }

    appliedSearchKeyRef.current = stateKey;

    const hasDecisionInputs =
      parsedState.goals.length > 0 ||
      Boolean(
        parsedState.modality ||
          parsedState.space ||
          parsedState.tier ||
          parsedState.productIds.length ||
          parsedState.budget
      );

    const nextStep =
      hasDecisionInputs
        ? 'result'
        : parsedState.entryPath === 'budget' || parsedState.budgetMode === 'rental'
          ? 'budget'
          : parsedState.entryPath ?? 'entry';

    applyPlannerSelectionState(parsedState, nextStep);
    setFeedbackMessage(
      parsedState.tier
        ? `Loaded the ${tierTitleMap[parsedState.tier]} planner path from your previous selection.`
        : 'Loaded planner choices from the current link.'
    );

    if (searchParams.get('mode') === 'rental' && !parsedState.budget) {
      setBudget(defaultBudgetByMode.rental);
    }
  }, [searchParams]);

  const restoreSavedConfiguration = () => {
    try {
      const stored = window.localStorage.getItem(PLANNER_STORAGE_KEY);
      if (!stored) {
        setFeedbackMessage('No saved planner configuration is available on this browser.');
        return;
      }

      const parsed = sanitizePlannerSelectionState(JSON.parse(stored));
      if (!parsed) {
        setFeedbackMessage('Saved planner data could not be restored.');
        return;
      }

      applyPlannerSelectionState(parsed, 'result');
      setFeedbackMessage('Restored your last saved planner configuration.');
    } catch {
      setFeedbackMessage('Saved planner data could not be restored.');
    }
  };

  const toggleGoal = (goal: GoalKey) => {
    setSelectedTier(null);
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
    );
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const goToResult = () => {
    setFeedbackMessage(null);
    setStep('result');
  };

  const saveConfiguration = () => {
    try {
      window.localStorage.setItem(
        PLANNER_STORAGE_KEY,
        JSON.stringify({
          ...currentPlannerState,
          selectedModality: currentPlannerState.modality,
          selectedSpace: currentPlannerState.space,
          selectedProductIds: currentPlannerState.productIds,
        })
      );
      setSavedConfigurationAvailable(true);
      setFeedbackMessage('Saved this planner state on this browser.');
    } catch {
      setFeedbackMessage('This browser blocked local planner storage.');
    }
  };

  const shareConfiguration = async () => {
    const shareUrl = `${window.location.origin}${buildPlannerStateUrl(
      '/wellness-planner',
      currentPlannerState
    )}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setFeedbackMessage('Copied a shareable planner link.');
    } catch {
      setFeedbackMessage('Clipboard access is unavailable in this browser.');
    }
  };

  const openPlannerPath = (path: EntryPath) => {
    setFeedbackMessage(null);
    setEntryPath(path);
    setSelectedTier(null);
    setStep(path);
  };

  const openProduct = (href: string) => {
    router.push(buildPlannerStateUrl(href, currentPlannerState));
    window.scrollTo(0, 0);
  };

  const primarySynergy = recommendation.activeSynergies[0] ?? null;
  const plannerSummaryHref = buildPlannerStateUrl('/contact', currentPlannerState, {
    intent: budgetMode === 'rental' ? 'rental' : 'curious',
  });
  const rentalSummaryHref = buildPlannerStateUrl('/rental', currentPlannerState);
  const storeSummaryHref = buildPlannerStateUrl('/store', currentPlannerState);

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-6 md:pt-8">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-slate-900">Wellness Planner</h1>
              <p className="mt-2 text-sm text-slate-600">
                Start with a goal, budget, modality, or space. The planner uses
                Hylono&apos;s current catalog, visible pricing, and protocol mapping to
                shortlist a realistic next step.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {savedConfigurationAvailable && step === 'entry' && (
                <button
                  type="button"
                  onClick={restoreSavedConfiguration}
                  className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Restore saved plan
                </button>
              )}
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Talk to Hylono
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Inputs used
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Goal fit, visible pricing, modality preference, and optional space planning.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Output
              </p>
              <p className="mt-2 text-sm text-slate-700">
                A shortlist, budget context, and a matching protocol or next guide.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Trust layer
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Review the method, then move into store, rental, or human guidance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Reminder
              </p>
              <p className="mt-2 text-sm text-slate-700">
                The planner helps shortlist fit. Final setup still benefits from a human review.
              </p>
            </div>
          </div>

          {feedbackMessage && (
            <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
              {feedbackMessage}
            </div>
          )}
        </header>

        {step === 'entry' && (
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                id: 'goal',
                title: "I'll start with a goal",
                description: 'Best when you want the shortest path from intent to shortlist.',
              },
              {
                id: 'budget',
                title: 'I have a budget',
                description:
                  'Best when you want the most realistic options at your current spend level.',
              },
              {
                id: 'modality',
                title: 'I know the technology',
                description:
                  'Best when you want to stay inside one modality and narrow the next step.',
              },
              {
                id: 'space',
                title: 'I have a space',
                description:
                  'Best when room type matters before you compare products in detail.',
              },
            ].map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => openPlannerPath(card.id as EntryPath)}
                className="min-h-11 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-cyan-300 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{card.description}</p>
              </button>
            ))}
          </section>
        )}

        {step === 'goal' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">What matters most right now?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Pick one or more goals. The planner will use the current Hylono goal-to-modality
              map to rank the shortlist.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {GOAL_OPTIONS.map((goal) => (
                <label
                  key={goal.id}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"
                >
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
              onClick={goToResult}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show shortlist
            </button>
          </section>
        )}

        {step === 'budget' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">How do you want to start?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Budget mode is a real decision input here. The shortlist reorders by visible
              pricing and whether each option fits the current target range.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                <input
                  type="radio"
                  name="budgetMode"
                  checked={budgetMode === 'purchase'}
                  onChange={() => {
                    setSelectedTier(null);
                    setBudgetMode('purchase');
                    setBudget(defaultBudgetByMode.purchase);
                  }}
                />
                <span>I&apos;m buying for long-term ownership</span>
              </label>
              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                <input
                  type="radio"
                  name="budgetMode"
                  checked={budgetMode === 'rental'}
                  onChange={() => {
                    setSelectedTier(null);
                    setBudgetMode('rental');
                    setBudget(defaultBudgetByMode.rental);
                  }}
                />
                <span>I&apos;m starting with a rental-first path</span>
              </label>
            </div>

            <div className="mt-5">
              <label htmlFor="zb-budget" className="text-sm font-semibold text-slate-700">
                {budgetMode === 'purchase'
                  ? `Budget: EUR ${budget.toLocaleString('de-DE')}`
                  : `Budget: EUR ${budget.toLocaleString('de-DE')}/mo`}
              </label>
              <input
                id="zb-budget"
                type="range"
                min={budgetMode === 'purchase' ? 5000 : 500}
                max={budgetMode === 'purchase' ? 80000 : 5000}
                step={budgetMode === 'purchase' ? 1000 : 100}
                value={budget}
                onChange={(event) => {
                  setSelectedTier(null);
                  setBudget(Number(event.target.value));
                }}
                className="mt-2 w-full"
              />
            </div>

            <button
              type="button"
              onClick={goToResult}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show shortlist
            </button>
          </section>
        )}

        {step === 'modality' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">Choose your starting modality</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use this when you already know the technology family and want the planner to narrow
              the next commercial or protocol step.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {MODALITY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"
                >
                  <input
                    type="radio"
                    name="selectedModality"
                    checked={selectedModality === option.id}
                    onChange={() => {
                      setSelectedTier(null);
                      setSelectedModality(option.id);
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={goToResult}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show shortlist
            </button>
          </section>
        )}

        {step === 'space' && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              What kind of space are you planning around?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Space changes the planning emphasis. The shortlist uses this as a setup signal, not
              a final installation approval.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {SPACE_OPTIONS.map((space) => (
                <label
                  key={space}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"
                >
                  <input
                    type="radio"
                    name="selectedSpace"
                    checked={selectedSpace === space}
                    onChange={() => {
                      setSelectedTier(null);
                      setSelectedSpace(space);
                    }}
                  />
                  <span>{space}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={goToResult}
              className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show shortlist
            </button>
          </section>
        )}

        {step === 'result' && (
          <section className="mt-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-bold text-slate-900">Your Hylono starting point</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    This shortlist reflects the inputs below and stays anchored to visible
                    pricing, current product availability, and Hylono&apos;s existing protocol
                    graph.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {selectedTier
                    ? `${tierTitleMap[selectedTier]} stack loaded`
                    : 'Live shortlist from current inputs'}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                {selectedGoals.map((goal) => (
                  <span key={goal} className="rounded-full bg-slate-100 px-3 py-1">
                    Goal: {plannerGoalLabels[goal]}
                  </span>
                ))}
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {budgetMode === 'rental' ? 'Rental mode' : 'Purchase mode'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {formatBudgetLabel(budgetMode, budget)}
                </span>
                {selectedModality && (
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Modality: {plannerModalityLabels[selectedModality]}
                  </span>
                )}
                {selectedSpace && (
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Space: {selectedSpace}
                  </span>
                )}
              </div>

              {recommendation.emptyStateReason ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                  <p className="font-semibold">No current shortlist fits cleanly.</p>
                  <p className="mt-2">{recommendation.emptyStateReason}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={storeSummaryHref}
                      className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Review the full store
                    </Link>
                    <Link
                      href={plannerSummaryHref}
                      className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-white"
                    >
                      Ask for guidance
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 xl:grid-cols-3">
                  {recommendation.recommendations.map((item, index) => (
                    <article
                      key={item.productId}
                      className={`rounded-xl border p-5 ${
                        index === 0
                          ? 'border-cyan-300 bg-cyan-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                        {index === 0 ? 'Primary match' : 'Supporting option'}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {item.scoreBreakdown.map((point) => (
                          <li key={`${item.productId}-${point}`}>{point}</li>
                        ))}
                      </ul>
                      <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                        <p>Buy: EUR {item.purchasePrice.toLocaleString('de-DE')}</p>
                        <p>Rent: from EUR {item.rentalPrice.toLocaleString('de-DE')}/mo</p>
                      </div>
                      <label className="mt-4 flex min-h-11 items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(item.productId)}
                          onChange={() => toggleProduct(item.productId)}
                        />
                        Keep this in my active stack
                      </label>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openProduct(item.productHref)}
                          className="min-h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          View product details
                        </button>
                        <Link
                          href={buildPlannerStateUrl('/contact', currentPlannerState, {
                            intent: budgetMode === 'rental' ? 'rental' : 'curious',
                            modality: plannerModalityToProductRoute[item.modality],
                          })}
                          className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Ask about this option
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {primarySynergy && (
                <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
                  <strong>Best current synergy:</strong> {primarySynergy.description}
                </div>
              )}

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {recommendation.primaryRecommendation && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Primary fit
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {recommendation.primaryRecommendation.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      The best overall match from the current inputs.
                    </p>
                  </div>
                )}
                {recommendation.lowerBudgetAlternative && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Lower-budget option
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {recommendation.lowerBudgetAlternative.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Useful when you want to step into the category with less upfront spend.
                    </p>
                  </div>
                )}
                {recommendation.rentalFirstRecommendation && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Rental-first option
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {recommendation.rentalFirstRecommendation.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      The lightest monthly entry point from the current shortlist.
                    </p>
                  </div>
                )}
              </div>

              {recommendation.suggestedProtocol && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900">Matching protocol</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    This protocol is shown because its visible goal tag overlaps with the goals
                    chosen in the planner.
                  </p>
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

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <h3 className="text-lg font-semibold text-slate-900">
                  How this recommendation was built
                </h3>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  {methodologyPoints.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/shipping"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Review shipping
                  </Link>
                  <Link
                    href="/returns"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Review returns
                  </Link>
                  <Link
                    href="/warranty"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Review warranty
                  </Link>
                  <Link
                    href="/help"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Help and support
                  </Link>
                </div>

                {(recommendation.relatedGoalGuides.length > 0 ||
                  recommendation.relatedEvidence.length > 0) && (
                  <div className="mt-6 space-y-4">
                    {recommendation.relatedGoalGuides.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Relevant goal guides
                        </h4>
                        <div className="mt-3 flex flex-wrap gap-3">
                          {recommendation.relatedGoalGuides.map((goal) => (
                            <Link
                              key={goal.slug}
                              href={`/conditions/${goal.slug}`}
                              className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              {goal.title} guide
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {recommendation.relatedEvidence.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Supporting research references
                        </h4>
                        <div className="mt-3 grid gap-3">
                          {recommendation.relatedEvidence.map((evidence) => (
                            <div
                              key={evidence.id}
                              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <p className="font-semibold text-slate-900">
                                {evidence.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {evidence.publication} | {evidence.year}
                              </p>
                              <p className="mt-2 text-sm text-slate-600">
                                {evidence.resultSummary}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Link
                          href="/research"
                          className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Open the research hub
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <h3 className="text-lg font-semibold text-slate-900">Next best move</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">Purchase shortlist:</span> EUR{' '}
                    {recommendation.totalPurchase.toLocaleString('de-DE')}
                  </p>
                  <p>
                    <span className="font-semibold">Estimated financing:</span> from EUR{' '}
                    {recommendation.financingMonthly.toLocaleString('de-DE')}/mo
                  </p>
                  <p>
                    <span className="font-semibold">Rental shortlist:</span> EUR{' '}
                    {recommendation.totalRental.toLocaleString('de-DE')}/mo
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={storeSummaryHref}
                    className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Continue into store
                  </Link>
                  <Link
                    href={rentalSummaryHref}
                    className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Review rental options
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={saveConfiguration}
                    className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Save on this browser
                  </button>
                  <button
                    type="button"
                    onClick={shareConfiguration}
                    className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Copy share link
                  </button>
                  <Link
                    href={plannerSummaryHref}
                    className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Book a consultation
                  </Link>
                </div>
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
            Back to entry paths
          </button>
        )}
      </div>
    </div>
  );
};
