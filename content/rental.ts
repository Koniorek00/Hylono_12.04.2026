import { products } from './products';

export type RentalBudgetFilter = 'all' | 'upto-500' | '500-1000' | '1000-2000' | '2000-plus';
export type RentalTechnologyFilter = 'all' | 'HBOT' | 'H2' | 'RLT' | 'PEMF';

export const rentalLandingContent = {
  hero: {
    title: 'Rent the right system before you commit',
    subtitle:
      'Compare monthly plans, onboarding support, and what happens next before taking on the full purchase price.',
    cta: 'See available devices',
    secondaryCta: 'Talk to an advisor',
    supportingPoints: [
      'Monthly plans and guided onboarding included',
      'Return, extend, or buy later where offered',
      'Review shipping, returns, and warranty before checkout',
    ],
  },
  programFacts: [
    {
      title: 'Manual review before billing',
      text: 'Rental requests are reviewed by the Hylono team before deposit timing, payment method, and delivery details are confirmed.',
      href: '/contact?intent=rental',
      cta: 'Ask about next steps',
    },
    {
      title: 'EU delivery and support coverage',
      text: 'Published rental support and delivery coverage is currently limited to European Union member states.',
      href: '/shipping',
      cta: 'Review shipping policy',
    },
    {
      title: 'Terms depend on the selected plan',
      text: 'Monthly pricing, minimum term, and deposit are shown per eligible device and confirmed again before the agreement is finalized.',
      href: '/rental/checkout',
      cta: 'Preview request flow',
    },
    {
      title: 'Return, extend, or buy later where offered',
      text: 'Use the linked returns, terms, and product pages to review how return handling, extensions, and purchase-credit paths work.',
      href: '/returns',
      cta: 'Review return process',
    },
  ],
  howItWorks: [
    {
      number: 1,
      title: 'Choose',
      text: 'Select a device and rental period based on your goals and budget.',
    },
    {
      number: 2,
      title: 'Receive',
      text: 'We deliver, set up, and walk you through first sessions with a starter protocol.',
    },
    {
      number: 3,
      title: 'Decide',
      text: 'After your period, return, extend, or buy. Eligible rental payments can be credited toward purchase where offered.',
    },
  ],
  comparisonRows: [
    { label: 'Upfront cost', purchase: 'Full price', rental: 'Deposit + 1 month' },
    { label: 'Commitment', purchase: 'None', rental: 'Minimum 1 month' },
    { label: 'Service', purchase: 'Warranty', rental: 'Included' },
    { label: 'Can I buy later?', purchase: '-', rental: 'Yes, where purchase credit is offered' },
    { label: 'Best for', purchase: "I'm sure about my choice", rental: 'I want to try first' },
  ],
  faq: [
    {
      q: "What's the minimum rental period?",
      a: '1 month. You can extend monthly or choose a longer period for a discount.',
    },
    {
      q: 'What happens if the device breaks?',
      a: "Service is included in the rental price. We'll repair or replace the device in line with the published support process.",
    },
    {
      q: 'Can I buy the device afterwards?',
      a: 'Yes, when a purchase-credit path is available for that product and plan.',
    },
    {
      q: 'How does the return work?',
      a: 'We arrange courier pickup. Pack the device using the supplied or agreed return materials.',
    },
    {
      q: 'What does the deposit cover?',
      a: 'The deposit is refundable and covers potential damage beyond normal use. Return timing depends on inspection and policy terms.',
    },
  ],
  testimonials: [
    {
      id: 'rent-1',
      quote:
        'Rental plans are designed to help you evaluate fit, space, and routine adherence before making a longer-term purchase decision.',
      author: 'Rental planning note',
    },
    {
      id: 'rent-2',
      quote:
        'Delivery, support, and next-step guidance should always be reviewed together with the linked policy and contact pages.',
      author: 'Support and policy note',
    },
  ],
  finalCta: {
    title: 'Not sure where to start?',
    primary: 'Configure a stack',
    secondary: 'Talk to an advisor',
  },
} as const;

const modalityDisplayMap: Record<string, RentalTechnologyFilter> = {
  HBOT: 'HBOT',
  H2_inhalation: 'H2',
  H2_water: 'H2',
  RLT_NIR: 'RLT',
  PEMF: 'PEMF',
  VNS: 'PEMF',
  O2: 'HBOT',
};

const modalityRouteMap: Record<Exclude<RentalTechnologyFilter, 'all'>, string> = {
  HBOT: 'hbot',
  H2: 'hydrogen',
  RLT: 'rlt',
  PEMF: 'pemf',
};

const normalizeRentalModality = (
  modality: string
): Exclude<RentalTechnologyFilter, 'all'> => {
  const resolvedModality = modalityDisplayMap[modality];
  return resolvedModality && resolvedModality !== 'all' ? resolvedModality : 'H2';
};

const parsePlanMonths = (value: string): number => {
  const match = value.match(/(\d+)/);
  if (!match) {
    return 1;
  }

  const months = Number.parseInt(match[1] ?? '', 10);
  return Number.isFinite(months) && months > 0 ? months : 1;
};

export const rentalProducts = products.flatMap((product) => {
  const rentalPlans = product.rentalPlans ?? [];

  if (!product.rentalEligible || rentalPlans.length === 0) {
    return [];
  }

  const modality = normalizeRentalModality(product.modality);

  return [
    {
      id: product.id,
      slug: product.slug,
      title: product.title,
      shortDescription: product.shortDescription,
      modality,
      productPath: `/product/${modalityRouteMap[modality]}`,
      rentalMonthly: Math.min(...rentalPlans.map((plan) => plan.monthlyPrice)),
      minimumTermMonths: Math.min(...rentalPlans.map((plan) => parsePlanMonths(plan.minPeriod))),
      availableTerms: rentalPlans
        .map((plan) => parsePlanMonths(plan.period))
        .sort((left, right) => left - right),
      deposit: Math.min(...rentalPlans.map((plan) => plan.deposit)),
      purchasePrice: product.purchasePrice,
      selectionRationale: product.selectionRationale,
      available: true,
      image: product.images[0],
    },
  ];
});
