type SearchParamSource =
  | URLSearchParams
  | { get(name: string): string | null }
  | Record<string, string | null | undefined>;

export type PlannerEntryPath = 'goal' | 'budget' | 'modality' | 'space';
export type PlannerGoalKey = 'recovery' | 'sleep' | 'stress' | 'comfort' | 'vitality';
export type PlannerBudgetMode = 'purchase' | 'rental';
export type PlannerTier = 'starter' | 'optimal' | 'pro';
export type PlannerModalityKey = 'HBOT' | 'H2' | 'RLT_NIR' | 'PEMF';

export interface PlannerSelectionState {
  source?: 'planner';
  entryPath?: PlannerEntryPath;
  goals: PlannerGoalKey[];
  budgetMode?: PlannerBudgetMode;
  budget?: number;
  modality?: PlannerModalityKey;
  space?: string;
  productIds: string[];
  tier?: PlannerTier;
}

export const PLANNER_STORAGE_KEY = 'hylono_builder_configuration';

export const plannerGoalLabels: Record<PlannerGoalKey, string> = {
  recovery: 'Recovery',
  sleep: 'Sleep',
  stress: 'Stress',
  comfort: 'Comfort',
  vitality: 'Vitality',
};

export const plannerModalityLabels: Record<PlannerModalityKey, string> = {
  HBOT: 'HBOT',
  H2: 'H2',
  RLT_NIR: 'RLT',
  PEMF: 'PEMF',
};

export const plannerModalityToContactInterest: Record<PlannerModalityKey, string> = {
  HBOT: 'hbot',
  H2: 'hydrogen',
  RLT_NIR: 'rlt',
  PEMF: 'pemf',
};

export const plannerModalityToProductRoute: Record<PlannerModalityKey, string> = {
  HBOT: 'hbot',
  H2: 'hydrogen',
  RLT_NIR: 'rlt',
  PEMF: 'pemf',
};

const isSearchParamReader = (
  value: SearchParamSource
): value is URLSearchParams | { get(name: string): string | null } =>
  typeof value === 'object' && value !== null && 'get' in value && typeof value.get === 'function';

const readSearchParam = (source: SearchParamSource, key: string): string | null => {
  if (isSearchParamReader(source)) {
    return source.get(key);
  }

  return source[key] ?? null;
};

const cleanValue = (value: string | null | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const parseCsv = (value: string | null | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const unique = <T,>(values: T[]): T[] => Array.from(new Set(values));

export const normalizePlannerGoal = (
  value: string | null | undefined
): PlannerGoalKey | undefined => {
  switch (value) {
    case 'recovery':
    case 'sleep':
    case 'stress':
    case 'comfort':
    case 'vitality':
      return value;
    default:
      return undefined;
  }
};

export const normalizePlannerEntryPath = (
  value: string | null | undefined
): PlannerEntryPath | undefined => {
  switch (value) {
    case 'goal':
    case 'budget':
    case 'modality':
    case 'space':
      return value;
    default:
      return undefined;
  }
};

export const normalizePlannerBudgetMode = (
  value: string | null | undefined
): PlannerBudgetMode | undefined => {
  switch (value) {
    case 'purchase':
    case 'rental':
      return value;
    default:
      return undefined;
  }
};

export const normalizePlannerTier = (
  value: string | null | undefined
): PlannerTier | undefined => {
  switch (value) {
    case 'starter':
    case 'optimal':
    case 'pro':
      return value;
    default:
      return undefined;
  }
};

export const normalizePlannerModality = (
  value: string | null | undefined
): PlannerModalityKey | undefined => {
  switch (value) {
    case 'HBOT':
      return 'HBOT';
    case 'H2':
      return 'H2';
    case 'RLT':
    case 'RLT_NIR':
      return 'RLT_NIR';
    case 'PEMF':
      return 'PEMF';
    default:
      return undefined;
  }
};

const normalizeBudget = (value: unknown): number | undefined => {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const normalizeProductIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return unique(value.map((entry) => `${entry}`.trim()).filter(Boolean));
  }

  if (typeof value === 'string') {
    return unique(parseCsv(value));
  }

  return [];
};

export const parsePlannerSearchParams = (
  source: SearchParamSource
): PlannerSelectionState | undefined => {
  const singleGoal = normalizePlannerGoal(readSearchParam(source, 'goal'));
  const goals = unique(
    [
      ...parseCsv(readSearchParam(source, 'goals')).map((entry) => normalizePlannerGoal(entry)),
      singleGoal,
    ].filter((entry): entry is PlannerGoalKey => Boolean(entry))
  );

  const entryPath =
    normalizePlannerEntryPath(readSearchParam(source, 'entry')) ??
    normalizePlannerEntryPath(readSearchParam(source, 'path'));
  const explicitBudgetMode = normalizePlannerBudgetMode(readSearchParam(source, 'budgetMode'));
  const budgetMode =
    explicitBudgetMode ??
    (readSearchParam(source, 'mode') === 'rental' ? 'rental' : undefined);
  const budget = normalizeBudget(readSearchParam(source, 'budget'));
  const modality = normalizePlannerModality(readSearchParam(source, 'modality'));
  const space = cleanValue(readSearchParam(source, 'space'));
  const tier = normalizePlannerTier(readSearchParam(source, 'tier'));
  const productIds = normalizeProductIds(readSearchParam(source, 'products'));
  const sourceValue = readSearchParam(source, 'source') === 'planner' ? 'planner' : undefined;

  const hasPlannerState =
    sourceValue === 'planner' ||
    Boolean(
      goals.length ||
        entryPath ||
        budgetMode ||
        budget ||
        modality ||
        space ||
        tier ||
        productIds.length
    );

  if (!hasPlannerState) {
    return undefined;
  }

  return {
    ...(sourceValue ? { source: sourceValue } : {}),
    ...(entryPath ? { entryPath } : {}),
    goals,
    ...(budgetMode ? { budgetMode } : {}),
    ...(budget ? { budget } : {}),
    ...(modality ? { modality } : {}),
    ...(space ? { space } : {}),
    productIds,
    ...(tier ? { tier } : {}),
  };
};

export const sanitizePlannerSelectionState = (value: unknown): PlannerSelectionState | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const raw = value as Record<string, unknown>;
  const goals = normalizeProductIds(raw.goals)
    .map((entry) => normalizePlannerGoal(entry))
    .filter((entry): entry is PlannerGoalKey => Boolean(entry));
  const entryPath = normalizePlannerEntryPath(`${raw.entryPath ?? ''}` || undefined);
  const budgetMode = normalizePlannerBudgetMode(`${raw.budgetMode ?? ''}` || undefined);
  const budget = normalizeBudget(raw.budget);
  const modality = normalizePlannerModality(`${raw.selectedModality ?? raw.modality ?? ''}` || undefined);
  const space = cleanValue(`${raw.selectedSpace ?? raw.space ?? ''}` || undefined);
  const productIds = normalizeProductIds(raw.selectedProductIds ?? raw.productIds);
  const tier = normalizePlannerTier(`${raw.tier ?? ''}` || undefined);

  const hasPlannerState =
    goals.length ||
    entryPath ||
    budgetMode ||
    budget ||
    modality ||
    space ||
    tier ||
    productIds.length;

  if (!hasPlannerState) {
    return undefined;
  }

  return {
    source: 'planner',
    ...(entryPath ? { entryPath } : {}),
    goals,
    ...(budgetMode ? { budgetMode } : {}),
    ...(budget ? { budget } : {}),
    ...(modality ? { modality } : {}),
    ...(space ? { space } : {}),
    productIds,
    ...(tier ? { tier } : {}),
  };
};

export const buildPlannerSearchParams = (
  state: Partial<PlannerSelectionState> & { goals?: PlannerGoalKey[]; productIds?: string[] }
): URLSearchParams => {
  const params = new URLSearchParams();

  params.set('source', 'planner');

  if (state.entryPath) {
    params.set('entry', state.entryPath);
  }

  if (state.goals && state.goals.length > 0) {
    params.set('goals', unique(state.goals).join(','));
    const firstGoal = state.goals[0];
    if (state.goals.length === 1 && firstGoal) {
      params.set('goal', firstGoal);
    }
  }

  if (state.budgetMode) {
    params.set('budgetMode', state.budgetMode);
  }

  if (state.budget) {
    params.set('budget', String(state.budget));
  }

  if (state.modality) {
    params.set('modality', state.modality);
  }

  if (state.space) {
    params.set('space', state.space);
  }

  if (state.productIds && state.productIds.length > 0) {
    params.set('products', unique(state.productIds).join(','));
  }

  if (state.tier) {
    params.set('tier', state.tier);
  }

  return params;
};

export const summarizePlannerSelection = (
  state: Partial<PlannerSelectionState> & { productTitles?: string[] }
): string[] => {
  const lines: string[] = [];

  if (state.entryPath) {
    lines.push(`Entry path: ${state.entryPath}`);
  }

  if (state.goals && state.goals.length > 0) {
    lines.push(`Goals: ${state.goals.map((goal) => plannerGoalLabels[goal]).join(', ')}`);
  }

  if (state.budgetMode) {
    lines.push(
      `Budget mode: ${state.budgetMode === 'rental' ? 'Rental' : 'Purchase'}${
        state.budget ? state.budgetMode === 'rental' ? `, EUR ${state.budget}/mo` : `, EUR ${state.budget}` : ''
      }`
    );
  } else if (state.budget) {
    lines.push(`Budget: EUR ${state.budget}`);
  }

  if (state.modality) {
    lines.push(`Preferred modality: ${plannerModalityLabels[state.modality]}`);
  }

  if (state.space) {
    lines.push(`Space: ${state.space}`);
  }

  if (state.tier) {
    lines.push(`Stack tier: ${state.tier}`);
  }

  if (state.productTitles && state.productTitles.length > 0) {
    lines.push(`Products in view: ${state.productTitles.join(', ')}`);
  }

  return lines;
};
