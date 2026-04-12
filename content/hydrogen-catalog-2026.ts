export type HydrogenLineId = 'personal' | 'intensive' | 'advanced' | 'water';

export type HydrogenModelProfile =
  | 'entry-home'
  | 'expanded-home'
  | 'pulse-personal'
  | 'pure-intensive'
  | 'mixed-intensive'
  | 'pulse-intensive'
  | 'advanced-floor'
  | 'advanced-compact'
  | 'advanced-flagship'
  | 'bath-generator'
  | 'shower-module'
  | 'water-dispenser'
  | 'water-bottle';

export type HydrogenConditionSlug =
  | 'recovery'
  | 'sleep'
  | 'stress'
  | 'comfort'
  | 'vitality';

export interface HydrogenLineMeta {
  id: HydrogenLineId;
  order: '01' | '02' | '03' | '04';
  englishTitle: string;
  polishTitle: string;
  eyebrow: string;
  description: string;
}

export interface HydrogenAccessoryCard {
  id: string;
  title: string;
  summary: string;
  benefit: string;
}

export interface HydrogenModel {
  id: string;
  slug: string;
  model: string;
  profile: HydrogenModelProfile;
  lineId: HydrogenLineId;
  family: string;
  image: string;
  imageAlt: string;
  catalogDescription: string;
  catalogNote?: string;
  routeBadges: string[];
  gas: string;
  h2Value: string;
  o2Value?: string;
  dimensions: string;
  weight: string;
  grossPrice: number;
  netPrice: number;
  conditionSlugs: HydrogenConditionSlug[];
  protocolSlugs: string[];
  evidenceIds: string[];
  supportApplications: Array<
    | 'mental-work'
    | 'sleep'
    | 'physical-activity'
    | 'urban-load'
    | 'balance'
    | 'ageing'
  >;
}

const IMAGE_BASE = '/images/catalog/omega3/2026';

const image = (name: string) => `${IMAGE_BASE}/${name}`;

export const hydrogenLineOrder: HydrogenLineId[] = ['personal', 'intensive', 'advanced', 'water'];

export const hydrogenLineMeta: Record<HydrogenLineId, HydrogenLineMeta> = {
  personal: {
    id: 'personal',
    order: '01',
    englishTitle: 'Personal Line',
    polishTitle: 'Linia Osobista',
    eyebrow: 'Daily private-use hydrogen systems',
    description:
      'Compact hydrogen formats for private home use, personal calibration, and lower-friction daily adherence.',
  },
  intensive: {
    id: 'intensive',
    order: '02',
    englishTitle: 'Intensive Line',
    polishTitle: 'Linia Intensywna',
    eyebrow: 'Frequent-use home and clinic systems',
    description:
      'Mid-output systems built for more frequent routines, broader session cadence, and stronger integration into a weekly protocol.',
  },
  advanced: {
    id: 'advanced',
    order: '03',
    englishTitle: 'Advanced Line',
    polishTitle: 'Linia Zaawansowana',
    eyebrow: 'High-output hydrogen platforms',
    description:
      'Professional-grade stations for higher throughput, stronger session headroom, and deeper integration into a Hylono regenerative environment.',
  },
  water: {
    id: 'water',
    order: '04',
    englishTitle: 'Water Regeneration Line',
    polishTitle: 'Linia Regeneracji Wodnej',
    eyebrow: 'Hydrogen water and bathing formats',
    description:
      'Hydrogen-enabled bathing, showering, dispensing, and bottle systems that extend the Hylono ecosystem beyond inhalation into daily water rituals.',
  },
};

export const hydrogenSupportAccessories: HydrogenAccessoryCard[] = [
  {
    id: 'classic-cannula',
    title: 'Classic Cannula',
    summary: 'Soft silicone nasal cannula designed for calm, repeatable inhalation sessions.',
    benefit:
      'Makes deeper hydrogen inhalation practical in daily use, supporting a low-friction cellular regeneration routine.',
  },
  {
    id: 'water-infusion',
    title: 'Hydrogen Water Infusion',
    summary: 'A dedicated path for saturating drinking water with dissolved hydrogen.',
    benefit:
      'Turns regular water into hydrogen-rich water that can fit the wider protocol across the day.',
  },
  {
    id: 'ocular-set',
    title: 'Ocular Set',
    summary: 'Specialized hydrogen goggles for targeted delivery around the eye area.',
    benefit:
      'Extends the same hydrogen platform into a more localized ocular-support ritual when the protocol asks for precision.',
  },
  {
    id: 'auricular-applicators',
    title: 'Auricular Applicators',
    summary: 'Precision applicators for the ear canal and adjacent tissue zone.',
    benefit:
      'Directs hydrogen toward the ear and head area, broadening how a single platform fits a more specific routine.',
  },
];

export const hydrogenWaterDeliveryCards: HydrogenAccessoryCard[] = [
  {
    id: 'bath-route',
    title: 'Bath Route',
    summary: 'WO-B300 and WO-B600 turn the bathing environment into a hydrogen-rich immersion ritual.',
    benefit:
      'Best when the protocol values contact time, whole-body relaxation, and a more ceremonial end-of-day cadence.',
  },
  {
    id: 'shower-route',
    title: 'Shower Route',
    summary: 'WO-S1300 and WO-S2000 integrate hydrogen directly into a daily shower routine.',
    benefit:
      'Best when speed, regularity, and architectural integration matter more than setting aside a bath session.',
  },
  {
    id: 'countertop-route',
    title: 'Countertop Water Route',
    summary: 'WO-PW3000 creates a permanent point of access to hydrogen-rich water.',
    benefit:
      'Best when the protocol depends on repeated water intake throughout the day rather than one isolated cycle.',
  },
  {
    id: 'portable-route',
    title: 'Portable Bottle Route',
    summary: 'WO-B4500 brings hydrogen water into work, travel, training, and daily movement.',
    benefit:
      'Best when protocol adherence depends on portability and immediate access outside the home stack.',
  },
];

export const hydrogenModels: HydrogenModel[] = [
  {
    id: 'hydrogen-os-h150',
    slug: 'os-h150',
    model: 'OS-H150',
    profile: 'entry-home',
    lineId: 'personal',
    family: 'Personal compact inhaler',
    image: image('os-h150.png'),
    imageAlt: 'Hylono Molecular Hydrogen OS-H150',
    catalogDescription:
      'Compact home-use inhaler designed for regular sessions in a daily routine.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen',
    h2Value: '150 ml/min',
    dimensions: '17 × 17 × 28 cm',
    weight: '4 kg',
    grossPrice: 2590,
    netPrice: 2105.69,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['mental-work', 'sleep', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-os-h200',
    slug: 'os-h200',
    model: 'OS-H200',
    profile: 'expanded-home',
    lineId: 'personal',
    family: 'Expanded personal platform',
    image: image('os-h200-300.png'),
    imageAlt: 'Hylono Molecular Hydrogen OS-H200',
    catalogDescription:
      'Daily-use inhaler offered in two output variants for more adaptable home use.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen',
    h2Value: '200 ml/min',
    dimensions: '22 × 36 cm',
    weight: '6 kg',
    grossPrice: 3390,
    netPrice: 2756.1,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['mental-work', 'sleep', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-os-h300',
    slug: 'os-h300',
    model: 'OS-H300',
    profile: 'expanded-home',
    lineId: 'personal',
    family: 'Expanded personal platform',
    image: image('os-h200-300.png'),
    imageAlt: 'Hylono Molecular Hydrogen OS-H300',
    catalogDescription:
      'Daily-use inhaler offered in two output variants for more adaptable home use.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen',
    h2Value: '300 ml/min',
    dimensions: '22 × 36 cm',
    weight: '6 kg',
    grossPrice: 4690,
    netPrice: 3813.01,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['mental-work', 'sleep', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-os-ho450-p',
    slug: 'os-ho450-p',
    model: 'OS-HO450-P',
    profile: 'pulse-personal',
    lineId: 'personal',
    family: 'Pulse-ready home and studio unit',
    image: image('pr-ho450-p.png'),
    imageAlt: 'Hylono Molecular Hydrogen OS-HO450-P',
    catalogDescription:
      'A universal home-and-studio model with pulse mode for a more deliberate breathing rhythm.',
    catalogNote:
      'The system stores gas during exhalation and releases it with multiplied force on the next inhale.',
    routeBadges: ['Pulse', 'Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '300 ml/min',
    o2Value: '150 ml/min',
    dimensions: '15 × 18 × 26 cm',
    weight: '5 kg',
    grossPrice: 7290,
    netPrice: 5926.83,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['mental-work', 'sleep', 'physical-activity', 'balance'],
  },
  {
    id: 'hydrogen-pr-h600',
    slug: 'pr-h600',
    model: 'PR-H600',
    profile: 'pure-intensive',
    lineId: 'intensive',
    family: 'Frequent-use pure hydrogen station',
    image: image('pr-h600.png'),
    imageAlt: 'Hylono Molecular Hydrogen PR-H600',
    catalogDescription:
      'High-output pure hydrogen unit for frequent use at home and in a private studio or clinic room.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen',
    h2Value: '600 ml/min',
    dimensions: '40 × 40 × 20 cm',
    weight: '11 kg',
    grossPrice: 6990,
    netPrice: 5682.93,
    conditionSlugs: ['stress', 'recovery', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['mental-work', 'physical-activity', 'balance', 'urban-load'],
  },
  {
    id: 'hydrogen-pr-ho900',
    slug: 'pr-ho900',
    model: 'PR-HO900',
    profile: 'mixed-intensive',
    lineId: 'intensive',
    family: 'Home-and-clinic H2/O2 platform',
    image: image('pr-ho900-1800.png'),
    imageAlt: 'Hylono Molecular Hydrogen PR-HO900',
    catalogDescription:
      'Hydrogen-oxygen platform for home and clinic use, offered in three output variants.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '600 ml/min',
    o2Value: '300 ml/min',
    dimensions: '40 × 40 × 20 cm',
    weight: '11 kg',
    grossPrice: 7990,
    netPrice: 6495.93,
    conditionSlugs: ['stress', 'recovery', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['mental-work', 'physical-activity', 'balance', 'urban-load'],
  },
  {
    id: 'hydrogen-pr-ho1500',
    slug: 'pr-ho1500',
    model: 'PR-HO1500',
    profile: 'mixed-intensive',
    lineId: 'intensive',
    family: 'Home-and-clinic H2/O2 platform',
    image: image('pr-ho900-1800.png'),
    imageAlt: 'Hylono Molecular Hydrogen PR-HO1500',
    catalogDescription:
      'Hydrogen-oxygen platform for home and clinic use, offered in three output variants.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '1000 ml/min',
    o2Value: '500 ml/min',
    dimensions: '40 × 40 × 20 cm',
    weight: '12 kg',
    grossPrice: 10290,
    netPrice: 8365.85,
    conditionSlugs: ['recovery', 'stress', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'balance', 'urban-load'],
  },
  {
    id: 'hydrogen-pr-ho1800',
    slug: 'pr-ho1800',
    model: 'PR-HO1800',
    profile: 'mixed-intensive',
    lineId: 'intensive',
    family: 'Home-and-clinic H2/O2 platform',
    image: image('pr-ho900-1800.png'),
    imageAlt: 'Hylono Molecular Hydrogen PR-HO1800',
    catalogDescription:
      'Hydrogen-oxygen platform for home and clinic use, offered in three output variants.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '1200 ml/min',
    o2Value: '600 ml/min',
    dimensions: '40 × 40 × 20 cm',
    weight: '12 kg',
    grossPrice: 11290,
    netPrice: 9178.86,
    conditionSlugs: ['recovery', 'stress', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'balance', 'urban-load'],
  },
  {
    id: 'hydrogen-pr-ho900-p',
    slug: 'pr-ho900-p',
    model: 'PR-HO900-P',
    profile: 'pulse-intensive',
    lineId: 'intensive',
    family: 'Pulse-enabled intensive platform',
    image: image('pr-ho-p-family.png'),
    imageAlt: 'Hylono Molecular Hydrogen PR-HO900-P',
    catalogDescription:
      'Pulse-mode H2/O2 system for home and clinic use, storing gas during exhalation and releasing it on the next inhale.',
    routeBadges: ['Pulse', 'Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '600 ml/min',
    o2Value: '300 ml/min',
    dimensions: '14 × 27 × 45 cm',
    weight: '11 kg',
    grossPrice: 9490,
    netPrice: 7715.45,
    conditionSlugs: ['stress', 'recovery', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['mental-work', 'physical-activity', 'balance', 'urban-load'],
  },
  {
    id: 'hydrogen-pr-ho1800-p',
    slug: 'pr-ho1800-p',
    model: 'PR-HO1800-P',
    profile: 'pulse-intensive',
    lineId: 'intensive',
    family: 'Pulse-enabled intensive platform',
    image: image('pr-ho-p-family.png'),
    imageAlt: 'Hylono Molecular Hydrogen PR-HO1800-P',
    catalogDescription:
      'Pulse-mode H2/O2 system for home and clinic use, storing gas during exhalation and releasing it on the next inhale.',
    routeBadges: ['Pulse', 'Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '1200 ml/min',
    o2Value: '600 ml/min',
    dimensions: '14 × 27 × 45 cm',
    weight: '11 kg',
    grossPrice: 13490,
    netPrice: 10967.48,
    conditionSlugs: ['recovery', 'stress', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'balance', 'urban-load'],
  },
  {
    id: 'hydrogen-pr-ho3000-p',
    slug: 'pr-ho3000-p',
    model: 'PR-HO3000-P',
    profile: 'pulse-intensive',
    lineId: 'intensive',
    family: 'Pulse-enabled intensive platform',
    image: image('pr-ho-p-family.png'),
    imageAlt: 'Hylono Molecular Hydrogen PR-HO3000-P',
    catalogDescription:
      'Pulse-mode H2/O2 system for home and clinic use, storing gas during exhalation and releasing it on the next inhale.',
    routeBadges: ['Pulse', 'Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '2000 ml/min',
    o2Value: '1000 ml/min',
    dimensions: '14 × 27 × 45 cm',
    weight: '11 kg',
    grossPrice: 18490,
    netPrice: 15032.52,
    conditionSlugs: ['recovery', 'stress', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'balance', 'urban-load'],
  },
  {
    id: 'hydrogen-za-ho3000',
    slug: 'za-ho3000',
    model: 'ZA-HO3000',
    profile: 'advanced-floor',
    lineId: 'advanced',
    family: 'Advanced high-output station',
    image: image('za-ho3000-3600.png'),
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO3000',
    catalogDescription:
      'Advanced inhalation station offered in two output variants for intensive use.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '2000 ml/min',
    o2Value: '1000 ml/min',
    dimensions: '34 × 26 × 46 cm',
    weight: '15 kg',
    grossPrice: 15290,
    netPrice: 12430.89,
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: ['vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-za-ho3600',
    slug: 'za-ho3600',
    model: 'ZA-HO3600',
    profile: 'advanced-floor',
    lineId: 'advanced',
    family: 'Advanced high-output station',
    image: image('za-ho3000-3600.png'),
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO3600',
    catalogDescription:
      'Advanced inhalation station offered in two output variants for intensive use.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '2400 ml/min',
    o2Value: '1200 ml/min',
    dimensions: '34 × 30 × 64 cm',
    weight: '26 kg',
    grossPrice: 18290,
    netPrice: 14869.92,
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: ['vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-za-ho3000-b',
    slug: 'za-ho3000-b',
    model: 'ZA-HO3000-B',
    profile: 'advanced-compact',
    lineId: 'advanced',
    family: 'Compact high-output station',
    image: image('za-ho3000-b-4500-b.png'),
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO3000-B',
    catalogDescription:
      'Compact high-output station offered in two power variants.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '2000 ml/min',
    o2Value: '1000 ml/min',
    dimensions: '30 × 31 × 59 cm',
    weight: '26 kg',
    grossPrice: 14990,
    netPrice: 12186.99,
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: ['vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-za-ho4500-b',
    slug: 'za-ho4500-b',
    model: 'ZA-HO4500-B',
    profile: 'advanced-compact',
    lineId: 'advanced',
    family: 'Compact high-output station',
    image: image('za-ho3000-b-4500-b.png'),
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO4500-B',
    catalogDescription:
      'Compact high-output station offered in two power variants.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '3000 ml/min',
    o2Value: '1500 ml/min',
    dimensions: '30 × 31 × 59 cm',
    weight: '27 kg',
    grossPrice: 19490,
    netPrice: 15845.53,
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: ['vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-za-ho6000',
    slug: 'za-ho6000',
    model: 'ZA-HO6000',
    profile: 'advanced-flagship',
    lineId: 'advanced',
    family: 'Flagship continuous-duty station',
    image: image('za-ho6000.png'),
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO6000',
    catalogDescription:
      'The highest-output station for continuous work, built for larger facilities and intensive use.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    gas: 'Hydrogen / Oxygen',
    h2Value: '4000 ml/min',
    o2Value: '2000 ml/min',
    dimensions: '33 × 36 × 63 cm',
    weight: '27 kg',
    grossPrice: 31990,
    netPrice: 26008.13,
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: ['vitality-dual-stack', 'recovery-oxygen-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    supportApplications: ['physical-activity', 'mental-work', 'urban-load', 'balance'],
  },
  {
    id: 'hydrogen-wo-b300',
    slug: 'wo-b300',
    model: 'WO-B300',
    profile: 'bath-generator',
    lineId: 'water',
    family: 'Hydrogen bath generator',
    image: image('aq-b300-b600.png'),
    imageAlt: 'Hylono Molecular Hydrogen WO-B300',
    catalogDescription:
      'Hydrogen bath generator offered in two concentration variants.',
    routeBadges: ['Bath', 'Hydrogen Water Ritual'],
    gas: 'Bath',
    h2Value: '2000 ppb',
    dimensions: '35 × 30 × 45 cm',
    weight: '21 kg',
    grossPrice: 8990,
    netPrice: 7308.94,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    supportApplications: ['sleep', 'balance', 'urban-load', 'ageing'],
  },
  {
    id: 'hydrogen-wo-b600',
    slug: 'wo-b600',
    model: 'WO-B600',
    profile: 'bath-generator',
    lineId: 'water',
    family: 'Hydrogen bath generator',
    image: image('aq-b300-b600.png'),
    imageAlt: 'Hylono Molecular Hydrogen WO-B600',
    catalogDescription:
      'Hydrogen bath generator offered in two concentration variants.',
    routeBadges: ['Bath', 'Hydrogen Water Ritual'],
    gas: 'Bath',
    h2Value: '3800 ppb',
    dimensions: '35 × 30 × 45 cm',
    weight: '21 kg',
    grossPrice: 10990,
    netPrice: 8934.96,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    supportApplications: ['sleep', 'balance', 'urban-load', 'ageing'],
  },
  {
    id: 'hydrogen-wo-s1300',
    slug: 'wo-s1300',
    model: 'WO-S1300',
    profile: 'shower-module',
    lineId: 'water',
    family: 'Hydrogen shower module',
    image: image('aq-s1300-s2000.png'),
    imageAlt: 'Hylono Molecular Hydrogen WO-S1300',
    catalogDescription:
      'Hydrogen shower module designed for daily use without filling a bathtub.',
    routeBadges: ['Shower', 'Daily Integration'],
    gas: 'Bath',
    h2Value: '1300 ppb',
    dimensions: '41 × 30 × 15 cm',
    weight: '7 kg',
    grossPrice: 7490,
    netPrice: 6089.43,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    supportApplications: ['sleep', 'balance', 'urban-load', 'mental-work'],
  },
  {
    id: 'hydrogen-wo-s2000',
    slug: 'wo-s2000',
    model: 'WO-S2000',
    profile: 'shower-module',
    lineId: 'water',
    family: 'Hydrogen shower module',
    image: image('aq-s1300-s2000.png'),
    imageAlt: 'Hylono Molecular Hydrogen WO-S2000',
    catalogDescription:
      'Hydrogen shower module designed for daily use without filling a bathtub.',
    routeBadges: ['Shower', 'Daily Integration'],
    gas: 'Bath',
    h2Value: '2000 ppb',
    dimensions: '41 × 30 × 15 cm',
    weight: '7 kg',
    grossPrice: 8990,
    netPrice: 7308.94,
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    supportApplications: ['sleep', 'balance', 'urban-load', 'mental-work'],
  },
  {
    id: 'hydrogen-wo-pw3000',
    slug: 'wo-pw3000',
    model: 'WO-PW3000',
    profile: 'water-dispenser',
    lineId: 'water',
    family: 'Stationary hydrogen water dispenser',
    image: image('aq-pw3000.png'),
    imageAlt: 'Hylono Molecular Hydrogen WO-PW3000',
    catalogDescription:
      'Advanced stationary dispenser of 3000 ppb hydrogen water for direct everyday access.',
    routeBadges: ['Countertop Water', 'Daily Access'],
    gas: 'Water',
    h2Value: '3000 ppb',
    dimensions: '53 × 28 × 47 cm',
    weight: '14 kg',
    grossPrice: 2990,
    netPrice: 2430.89,
    conditionSlugs: ['stress', 'vitality', 'comfort'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    supportApplications: ['mental-work', 'balance', 'urban-load', 'ageing'],
  },
  {
    id: 'hydrogen-wo-b4500',
    slug: 'wo-b4500',
    model: 'WO-B4500',
    profile: 'water-bottle',
    lineId: 'water',
    family: 'Portable hydrogen water bottle',
    image: image('aq-b4500.png'),
    imageAlt: 'Hylono Molecular Hydrogen WO-B4500',
    catalogDescription:
      'Portable hydrogen bottle for daily use at home, at work, and in transit.',
    routeBadges: ['Portable Water', 'Travel Ready'],
    gas: 'Water',
    h2Value: '4000–4500 ppb',
    dimensions: '17 × 22 cm',
    weight: '2 kg',
    grossPrice: 500,
    netPrice: 406.5,
    conditionSlugs: ['stress', 'vitality', 'comfort'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    supportApplications: ['mental-work', 'physical-activity', 'balance', 'urban-load'],
  },
];

export const hydrogenModelBySlug = hydrogenModels.reduce<Record<string, HydrogenModel>>((acc, model) => {
  acc[model.slug] = model;
  return acc;
}, {});

export const hydrogenModelsByLine = hydrogenLineOrder.reduce<Record<HydrogenLineId, HydrogenModel[]>>(
  (acc, lineId) => {
    acc[lineId] = hydrogenModels
      .filter((model) => model.lineId === lineId)
      .sort((a, b) => a.model.localeCompare(b.model, 'en'));
    return acc;
  },
  {
    personal: [],
    intensive: [],
    advanced: [],
    water: [],
  },
);

export const getHydrogenModelPath = (slug: string) => `/product/hydrogen/${slug}`;

export const formatPln = (value: number): string =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
