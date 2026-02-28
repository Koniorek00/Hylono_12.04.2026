export interface HylonoProduct {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  modality: 'mHBOT' | 'H2_inhalation' | 'H2_water' | 'RLT_NIR' | 'PEMF' | 'VNS' | 'O2';
  intendedUse: 'home_wellness' | 'professional_wellness' | 'sport_recovery';

  purchasePrice: number;
  financingEligible: boolean;
  financingMonthlyFrom?: number;
  installmentOptions?: Array<{ months: number; monthlyAmount: number; interestRate: number }>;

  rentalEligible: boolean;
  rentalPlans?: Array<{
    period: string;
    monthlyPrice: number;
    minPeriod: string;
    deposit: number;
  }>;

  tradeInEligible: boolean;

  images: string[];

  specifications: Array<{
    label: string;
    value: string;
    annotation?: string;
  }>;

  contraindications: string[];
  safetyNotes: string[];

  documents: Array<{
    title: string;
    type: 'manual' | 'spec_sheet' | 'ce_certificate' | 'conformity_declaration' | 'warranty';
    url: string;
    size: string;
  }>;

  protocolIds: string[];
  evidenceIds: string[];
  goalTags: string[];

  synergiesWith: string[];

  reviewCount: number;
  rating?: number;

  selectionRationale: string;
  ceMark: boolean;
}

export const products: HylonoProduct[] = [
  {
    id: 'mhbot-st1700',
    slug: 'mhbot-st1700',
    title: 'mHBOT ST1700',
    shortDescription:
      'A premium mild hyperbaric chamber designed to support recovery, cognitive clarity, and structured daily wellness routines at home.',
    modality: 'mHBOT',
    intendedUse: 'home_wellness',
    purchasePrice: 24900,
    financingEligible: true,
    financingMonthlyFrom: 499,
    installmentOptions: [
      { months: 12, monthlyAmount: 2075, interestRate: 0 },
      { months: 24, monthlyAmount: 1037, interestRate: 0 },
      { months: 36, monthlyAmount: 691, interestRate: 3.2 },
      { months: 48, monthlyAmount: 519, interestRate: 3.8 },
    ],
    rentalEligible: true,
    rentalPlans: [
      { period: '1 month', monthlyPrice: 1499, minPeriod: '1 month', deposit: 2500 },
      { period: '3 months', monthlyPrice: 1299, minPeriod: '3 months', deposit: 2500 },
      { period: '6 months', monthlyPrice: 1099, minPeriod: '6 months', deposit: 2500 },
    ],
    tradeInEligible: true,
    images: ['/images/mhbot-st1700-hero.webp', '/images/mhbot-st1700-interior.webp'],
    specifications: [
      {
        label: 'Pressure range',
        value: '1.3–1.5 ATA',
        annotation: 'Supports safe, repeatable oxygen sessions in home environments.',
      },
      {
        label: 'Internal length',
        value: '220 cm',
        annotation: 'Comfortable for most adults in daily wellness sessions.',
      },
      {
        label: 'Oxygen concentrator',
        value: '10 L/min compatible',
        annotation: 'Enables stable oxygen delivery during each protocol block.',
      },
      {
        label: 'Noise level',
        value: '<55 dB',
        annotation: 'Keeps sessions calm and suitable for evening routines.',
      },
    ],
    contraindications: [
      'Untreated pneumothorax',
      'Acute ear infection or recent ear surgery',
      'Severe untreated sinus blockage',
    ],
    safetyNotes: [
      'Always equalize pressure gradually and pause if discomfort appears.',
      'Use only with approved oxygen and pressure accessories.',
      'Consult a qualified specialist if you have a chronic condition.',
    ],
    documents: [
      {
        title: 'User Manual — mHBOT ST1700',
        type: 'manual',
        url: '/docs/mhbot-st1700-user-manual.pdf',
        size: '6.2 MB',
      },
      {
        title: 'Technical Specification Sheet',
        type: 'spec_sheet',
        url: '/docs/mhbot-st1700-spec-sheet.pdf',
        size: '1.1 MB',
      },
      {
        title: 'CE Certificate',
        type: 'ce_certificate',
        url: '/docs/mhbot-st1700-ce.pdf',
        size: '0.9 MB',
      },
      {
        title: 'Declaration of Conformity',
        type: 'conformity_declaration',
        url: '/docs/mhbot-st1700-doc.pdf',
        size: '0.7 MB',
      },
      {
        title: 'Warranty Terms',
        type: 'warranty',
        url: '/docs/mhbot-st1700-warranty.pdf',
        size: '0.4 MB',
      },
    ],
    protocolIds: ['recovery-oxygen-foundation', 'sleep-reset-breath-depth', 'vitality-dual-stack'],
    evidenceIds: ['ev-hbot-001', 'ev-hbot-002', 'ev-hbot-003'],
    goalTags: ['recovery', 'sleep', 'vitality'],
    synergiesWith: ['h2-hop450'],
    reviewCount: 36,
    rating: 4.8,
    selectionRationale:
      'We selected this model for stable pressure performance, practical serviceability in European homes, and clear protocol compatibility. It balances premium build quality with everyday usability. It also integrates cleanly with Hylono onboarding and support workflows.',
    ceMark: true,
  },
  {
    id: 'h2-hop450',
    slug: 'h2-hop450',
    title: 'Hydrogen HOP-450',
    shortDescription:
      'A compact hydrogen inhalation and hydration system designed to support daily vitality, stress balance, and post-training recovery.',
    modality: 'H2_inhalation',
    intendedUse: 'home_wellness',
    purchasePrice: 2400,
    financingEligible: true,
    financingMonthlyFrom: 79,
    installmentOptions: [
      { months: 12, monthlyAmount: 200, interestRate: 0 },
      { months: 24, monthlyAmount: 100, interestRate: 0 },
      { months: 36, monthlyAmount: 74, interestRate: 2.4 },
      { months: 48, monthlyAmount: 58, interestRate: 3.1 },
    ],
    rentalEligible: true,
    rentalPlans: [
      { period: '1 month', monthlyPrice: 199, minPeriod: '1 month', deposit: 350 },
      { period: '3 months', monthlyPrice: 179, minPeriod: '3 months', deposit: 350 },
      { period: '6 months', monthlyPrice: 159, minPeriod: '6 months', deposit: 350 },
    ],
    tradeInEligible: false,
    images: ['/images/h2-hop450-hero.webp', '/images/h2-hop450-lifestyle.webp'],
    specifications: [
      {
        label: 'Hydrogen purity',
        value: '99.99%',
        annotation: 'Supports consistent and clean daily inhalation sessions.',
      },
      {
        label: 'Flow range',
        value: '300–900 ml/min',
        annotation: 'Lets users tailor session intensity to comfort and routine.',
      },
      {
        label: 'Water concentration',
        value: '>1200 ppb',
        annotation: 'Supports practical hydrogen water usage in protocol stacks.',
      },
      {
        label: 'Session control',
        value: 'Continuous and pulse modes',
        annotation: 'Flexible options for morning, workday, or post-training use.',
      },
    ],
    contraindications: ['Use caution in severe respiratory instability without specialist input'],
    safetyNotes: [
      'Use distilled or reverse-osmosis water only.',
      'Operate in a ventilated area and follow startup checklist.',
      'Use only original tubing and accessory connectors.',
    ],
    documents: [
      {
        title: 'User Manual — HOP-450',
        type: 'manual',
        url: '/docs/h2-hop450-user-manual.pdf',
        size: '3.8 MB',
      },
      {
        title: 'Technical Specification Sheet',
        type: 'spec_sheet',
        url: '/docs/h2-hop450-spec-sheet.pdf',
        size: '0.8 MB',
      },
      {
        title: 'CE Certificate',
        type: 'ce_certificate',
        url: '/docs/h2-hop450-ce.pdf',
        size: '0.6 MB',
      },
      {
        title: 'Declaration of Conformity',
        type: 'conformity_declaration',
        url: '/docs/h2-hop450-doc.pdf',
        size: '0.5 MB',
      },
      {
        title: 'Warranty Terms',
        type: 'warranty',
        url: '/docs/h2-hop450-warranty.pdf',
        size: '0.3 MB',
      },
    ],
    protocolIds: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    goalTags: ['stress', 'comfort', 'vitality'],
    synergiesWith: ['mhbot-st1700'],
    reviewCount: 8,
    selectionRationale:
      'We selected this system for purity consistency, practical home footprint, and protocol flexibility across inhalation and hydration use cases. It is straightforward to maintain and easy to integrate into daily routines. It also provides clear value for users starting with low-friction recovery workflows.',
    ceMark: true,
  },
];

export const productById = products.reduce<Record<string, HylonoProduct>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
