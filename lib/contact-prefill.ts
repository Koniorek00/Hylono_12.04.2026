import { products } from '@/content/products';
import {
  parsePlannerSearchParams,
  plannerModalityLabels,
  plannerModalityToContactInterest,
  summarizePlannerSelection,
} from '@/lib/planner-state';

export type ContactIntentChoice = 'owner' | 'clinic' | 'curious' | 'rental';

export interface ContactPrefill {
  intent?: ContactIntentChoice;
  subject?: string;
  message?: string;
  interest?: string;
  clinicName?: string;
}

interface LocatorContactHrefInput {
  city?: string;
  country?: string;
  intent?: ContactIntentChoice;
  modality?: string;
  partnerName?: string;
  partnerType?: string;
}

type SearchParamSource =
  | URLSearchParams
  | { get(name: string): string | null }
  | Record<string, string | null | undefined>;

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

export const normalizeContactIntent = (
  value: string | null | undefined
): ContactIntentChoice | undefined => {
  switch (value) {
    case 'owner':
    case 'clinic':
    case 'curious':
    case 'rental':
      return value;
    default:
      return undefined;
  }
};

export const buildLocatorContactHref = ({
  city,
  country,
  intent = 'curious',
  modality,
  partnerName,
  partnerType,
}: LocatorContactHrefInput) => ({
  pathname: '/contact',
  query: {
    source: 'locator',
    intent,
    ...(country ? { country } : {}),
    ...(city ? { city } : {}),
    ...(modality ? { modality } : {}),
    ...(partnerType ? { partnerType } : {}),
    ...(partnerName ? { partnerName } : {}),
  },
});

export const buildLocatorContactPrefill = (
  source: SearchParamSource
): ContactPrefill | undefined => {
  const entrySource = cleanValue(readSearchParam(source, 'source'));
  const intent = normalizeContactIntent(readSearchParam(source, 'intent')) ?? 'curious';
  const country = cleanValue(readSearchParam(source, 'country'));
  const city = cleanValue(readSearchParam(source, 'city'));
  const modality = cleanValue(readSearchParam(source, 'modality'));
  const partnerType = cleanValue(readSearchParam(source, 'partnerType'));
  const partnerName = cleanValue(readSearchParam(source, 'partnerName'));

  const isLocatorRequest =
    entrySource === 'locator' || Boolean(country || city || modality || partnerType || partnerName);

  if (!isLocatorRequest) {
    return undefined;
  }

  const contextLines = [
    'I came from the Hylono partner locator and would like a guided introduction.',
    ...(partnerName ? [`Requested partner: ${partnerName}`] : []),
    ...(partnerType ? [`Partner type: ${partnerType}`] : []),
    ...(city ? [`City: ${city}`] : []),
    ...(country ? [`Country: ${country}`] : []),
    ...(modality ? [`Technology of interest: ${modality}`] : []),
  ];

  return {
    intent,
    subject: 'Partner locator introduction request',
    message: contextLines.join('\n'),
    ...(modality ? { interest: modality } : {}),
  };
};

export const buildPlannerContactPrefill = (
  source: SearchParamSource
): ContactPrefill | undefined => {
  const plannerState = parsePlannerSearchParams(source);
  const entrySource = cleanValue(readSearchParam(source, 'source'));

  if (!plannerState || entrySource !== 'planner') {
    return undefined;
  }

  const intent =
    normalizeContactIntent(readSearchParam(source, 'intent')) ??
    (plannerState.budgetMode === 'rental' ? 'rental' : 'curious');
  const selectedProducts = plannerState.productIds
    .map((productId) => {
      const matchingProduct = products.find((product) => product.id === productId);
      if (matchingProduct) {
        return matchingProduct.title;
      }

      if (productId.startsWith('tech-')) {
        const fallbackLabel = productId.replace(/^tech-/, '').toUpperCase();
        return fallbackLabel;
      }

      return undefined;
    })
    .filter((title): title is string => Boolean(title));
  const interest =
    plannerState.modality
      ? plannerModalityToContactInterest[plannerState.modality]
      : selectedProducts.length > 0
        ? (() => {
            const firstProduct = products.find((product) => product.id === plannerState.productIds[0]);
            if (!firstProduct) return undefined;

            switch (firstProduct.modality) {
              case 'HBOT':
              case 'O2':
                return 'hbot';
              case 'H2_inhalation':
              case 'H2_water':
                return 'hydrogen';
              case 'RLT_NIR':
                return 'rlt';
              case 'PEMF':
              case 'VNS':
                return 'pemf';
              default:
                return undefined;
            }
          })()
        : plannerState.productIds[0]?.startsWith('tech-')
          ? (() => {
              const fallbackKey = plannerState.productIds[0].replace(/^tech-/, '');
              switch (fallbackKey) {
                case 'hbot':
                  return 'hbot';
                case 'hydrogen':
                  return 'hydrogen';
                case 'rlt':
                  return 'rlt';
                case 'pemf':
                  return 'pemf';
                default:
                  return undefined;
              }
            })()
        : undefined;

  const contextLines = [
    'I came from the Hylono wellness planner and would like a follow-up on the suggested next step.',
    ...summarizePlannerSelection({
      ...plannerState,
      productTitles: selectedProducts,
    }),
    ...(plannerState.modality
      ? [`Planner modality label: ${plannerModalityLabels[plannerState.modality]}`]
      : []),
  ];

  return {
    intent,
    subject:
      intent === 'rental'
        ? 'Wellness planner rental follow-up'
        : 'Wellness planner guidance follow-up',
    message: contextLines.join('\n'),
    ...(interest ? { interest } : {}),
  };
};

export const buildContactPrefill = (
  source: SearchParamSource
): ContactPrefill | undefined =>
  buildPlannerContactPrefill(source) ?? buildLocatorContactPrefill(source);
