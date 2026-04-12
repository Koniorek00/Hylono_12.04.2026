import { productById } from '@/content/products';

const LEGACY_RENTAL_PRODUCT_MAP: Record<string, string> = {
  'tech-hbot': 'hbot-st1700',
  'tech-hydrogen': 'h2-hop450',
  'tech-h2': 'h2-hop450',
};

export interface ResolvedRentalPlan {
  deposit: number;
  minPeriod: string;
  monthlyPrice: number;
  productId: string;
  productTitle: string;
  techId: string;
  termMonths: number;
}

export interface RentalPlanOption extends ResolvedRentalPlan {
  id: string;
  label: string;
}

const normalizeId = (value: string): string => value.trim().toLowerCase();

const parseTermMonths = (value: string): number | null => {
  const match = value.match(/(\d+)/);
  if (!match) {
    return null;
  }

  const months = Number.parseInt(match[1] ?? '', 10);
  return Number.isFinite(months) && months > 0 ? months : null;
};

const resolveProductId = (techId: string): string | undefined => {
  const normalized = normalizeId(techId);
  return productById[normalized]
    ? normalized
    : LEGACY_RENTAL_PRODUCT_MAP[normalized];
};

export function getRentalPlanOptions(techId: string): RentalPlanOption[] {
  const productId = resolveProductId(techId);
  if (!productId) {
    return [];
  }

  const product = productById[productId];
  if (!product?.rentalEligible || !product.rentalPlans?.length) {
    return [];
  }

  return product.rentalPlans
    .map((plan) => {
      const termMonths =
        parseTermMonths(plan.period) ?? parseTermMonths(plan.minPeriod);

      if (!termMonths) {
        return null;
      }

      return {
        id: `${product.id}-${termMonths}`,
        label: `${plan.period} plan`,
        monthlyPrice: plan.monthlyPrice,
        minPeriod: plan.minPeriod,
        termMonths,
        deposit: plan.deposit,
        productId: product.id,
        productTitle: product.title,
        techId: product.id,
      } satisfies RentalPlanOption;
    })
    .filter((plan): plan is RentalPlanOption => Boolean(plan));
}

export function resolveRentalPlan(
  techId: string,
  requestedTermMonths?: number
): ResolvedRentalPlan | null {
  const productId = resolveProductId(techId);
  if (!productId) {
    return null;
  }

  const product = productById[productId];
  if (!product?.rentalEligible || !product.rentalPlans?.length) {
    return null;
  }

  const normalizedRequestedTermMonths =
    typeof requestedTermMonths === 'number' && Number.isFinite(requestedTermMonths)
      ? Math.max(1, Math.floor(requestedTermMonths))
      : undefined;

  const matchingPlan = product.rentalPlans.find((plan) => {
    const months =
      parseTermMonths(plan.period) ?? parseTermMonths(plan.minPeriod);

    return months === normalizedRequestedTermMonths;
  });

  const fallbackPlan = product.rentalPlans
      .map((plan) => ({
        months:
          parseTermMonths(plan.period) ?? parseTermMonths(plan.minPeriod),
        plan,
      }))
      .filter(
        (
          entry
        ): entry is { months: number; plan: (typeof product.rentalPlans)[number] } =>
          typeof entry.months === 'number'
      )
      .sort((left, right) => left.months - right.months)[0]?.plan;

  const selectedPlan = normalizedRequestedTermMonths
    ? matchingPlan
    : fallbackPlan;

  if (!selectedPlan) {
    return null;
  }

  const termMonths =
    parseTermMonths(selectedPlan.period) ?? parseTermMonths(selectedPlan.minPeriod);

  if (!termMonths) {
    return null;
  }

  return {
    productId: product.id,
    productTitle: product.title,
    techId: product.id,
    monthlyPrice: selectedPlan.monthlyPrice,
    deposit: selectedPlan.deposit,
    minPeriod: selectedPlan.minPeriod,
    termMonths,
  };
}
