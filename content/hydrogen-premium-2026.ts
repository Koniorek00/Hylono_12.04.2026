export type HydrogenPremiumLineId = 'personal' | 'intensive' | 'advanced' | 'water';

export type HydrogenPremiumSlug =
  | 'os-h150'
  | 'os-h200-h300'
  | 'os-ho450-p'
  | 'pr-h600'
  | 'pr-ho900-ho1500-ho1800'
  | 'pr-ho900-p-ho1800-p-ho3000-p'
  | 'za-ho3000-ho3600'
  | 'za-ho3000-b-ho4500-b'
  | 'za-ho6000'
  | 'wo-b300-b600'
  | 'wo-s1300-s2000'
  | 'wo-pw3000'
  | 'wo-b4500';

type HydrogenPremiumConditionSlug =
  | 'recovery'
  | 'sleep'
  | 'stress'
  | 'comfort'
  | 'vitality';

type HydrogenPremiumProtocolSlug =
  | 'stress-balance-h2-foundation'
  | 'vitality-dual-stack'
  | 'recovery-oxygen-foundation';

export interface HydrogenPremiumVariant {
  model: string;
  hydrogen: string;
  oxygen?: string;
  dimensions: string;
  weight: string;
  grossPrice: number;
  netPrice: number;
  activeSummary: string;
}

export interface HydrogenPremiumLineMeta {
  id: HydrogenPremiumLineId;
  order: string;
  title: string;
  subtitle: string;
  rangeLabel: string;
  accent: string;
  accentSoft: string;
  dark: string;
  glow: string;
}

export interface HydrogenPremiumPageRecord {
  slug: HydrogenPremiumSlug;
  lineId: HydrogenPremiumLineId;
  title: string;
  catalogSummary: string;
  heroSummary: string;
  routeBadges: string[];
  image: string;
  imageAlt: string;
  variants: HydrogenPremiumVariant[];
  conditionSlugs: HydrogenPremiumConditionSlug[];
  protocolSlugs: HydrogenPremiumProtocolSlug[];
  legacySlugs: string[];
  useCaseLabel: string;
}

export const hydrogenPremiumLineMeta: Record<
  HydrogenPremiumLineId,
  HydrogenPremiumLineMeta
> = {
  personal: {
    id: 'personal',
    order: '01',
    title: 'Personal Line',
    subtitle: 'Daily home hydrogen systems',
    rangeLabel: '150-450 ml/min hydrogen output',
    accent: '#d6b26c',
    accentSoft: '#f4ead2',
    dark: '#0a3140',
    glow: 'rgba(101, 194, 255, 0.22)',
  },
  intensive: {
    id: 'intensive',
    order: '02',
    title: 'Intensive Line',
    subtitle: 'Frequent-use home and studio platforms',
    rangeLabel: '600-3000 ml/min hydrogen platforms',
    accent: '#c69d58',
    accentSoft: '#f3e6d0',
    dark: '#33261a',
    glow: 'rgba(214, 178, 108, 0.24)',
  },
  advanced: {
    id: 'advanced',
    order: '03',
    title: 'Advanced Line',
    subtitle: 'Professional high-output hydrogen stations',
    rangeLabel: '3000-6000 ml/min flagship output',
    accent: '#d6b26c',
    accentSoft: '#efe1c0',
    dark: '#082734',
    glow: 'rgba(88, 188, 255, 0.2)',
  },
  water: {
    id: 'water',
    order: '04',
    title: 'Water Regeneration Line',
    subtitle: 'Hydrogen bathing, showering, and water access',
    rangeLabel: '1300-4500 ppb dissolved hydrogen',
    accent: '#c69d58',
    accentSoft: '#f4ece0',
    dark: '#151515',
    glow: 'rgba(214, 178, 108, 0.18)',
  },
};

export const hydrogenPremiumPages: HydrogenPremiumPageRecord[] = [
  {
    slug: 'os-h150',
    lineId: 'personal',
    title: 'OS-H150',
    catalogSummary:
      'Compact home-use inhaler designed for calm, repeatable hydrogen sessions in a daily private routine.',
    heroSummary:
      'OS-H150 is the quietest entry into the Hylono hydrogen system: small footprint, low-friction ownership, and enough structure to make everyday H2 use sustainable.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    image: '/images/catalog/omega3/2026/os-h150.png',
    imageAlt: 'Hylono Molecular Hydrogen OS-H150',
    variants: [
      {
        model: 'OS-H150',
        hydrogen: '150 ml/min',
        dimensions: '17 x 17 x 28 cm',
        weight: '4 kg',
        grossPrice: 2590,
        netPrice: 2105.69,
        activeSummary:
          'Choose OS-H150 when the goal is disciplined daily use at home, not a clinic-style station. It keeps the ritual simple while preserving the wider Hylono upgrade path.',
      },
    ],
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    legacySlugs: ['os-h150'],
    useCaseLabel:
      'Best for first-time private users who want a compact hydrogen ritual they can sustain every day.',
  },
  {
    slug: 'os-h200-h300',
    lineId: 'personal',
    title: 'OS-H200 / OS-H300',
    catalogSummary:
      'Daily-use inhaler family offered in two output variants for users who want more headroom without changing the home format.',
    heroSummary:
      'OS-H200 and OS-H300 keep the same personal footprint but add room to scale session intensity. It is the cleanest step up for buyers who already know they want more than entry-level output.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    image: '/images/catalog/omega3/2026/os-h200-300.png',
    imageAlt: 'Hylono Molecular Hydrogen OS-H200 and OS-H300',
    variants: [
      {
        model: 'OS-H200',
        hydrogen: '200 ml/min',
        dimensions: '22 x 36 cm',
        weight: '6 kg',
        grossPrice: 3390,
        netPrice: 2756.1,
        activeSummary:
          'OS-H200 suits users who want extra output headroom while preserving an uncomplicated home setup and a familiar personal-device footprint.',
      },
      {
        model: 'OS-H300',
        hydrogen: '300 ml/min',
        dimensions: '22 x 36 cm',
        weight: '6 kg',
        grossPrice: 4690,
        netPrice: 3813.01,
        activeSummary:
          'OS-H300 is the stronger private-use choice for buyers who want the top end of the personal line before stepping into a larger intensive platform.',
      },
    ],
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    legacySlugs: ['os-h200', 'os-h300', 'os-h200-300'],
    useCaseLabel:
      'Best for private users who want the same domestic architecture with a clear choice between moderate and higher daily output.',
  },
  {
    slug: 'os-ho450-p',
    lineId: 'personal',
    title: 'OS-HO450-P',
    catalogSummary:
      'Pulse-enabled home and studio model that pairs hydrogen and oxygen in a more deliberate breathing rhythm.',
    heroSummary:
      'OS-HO450-P closes the Personal Line with a more technical session profile. Gas is stored during exhalation and released on the next inhale, creating a more intentional, breath-synchronised experience.',
    routeBadges: [
      'Pulse Mode',
      'Inhalation',
      'Hydrogen Water',
      'Ocular Set',
      'Auricular Set',
    ],
    image: '/images/catalog/omega3/2026/pr-ho450-p.png',
    imageAlt: 'Hylono Molecular Hydrogen OS-HO450-P',
    variants: [
      {
        model: 'OS-HO450-P',
        hydrogen: '300 ml/min',
        oxygen: '150 ml/min',
        dimensions: '15 x 18 x 26 cm',
        weight: '5 kg',
        grossPrice: 7290,
        netPrice: 5926.83,
        activeSummary:
          'Choose OS-HO450-P when you want the personal form factor but a more coached, breath-led H2 + O2 delivery profile.',
      },
    ],
    conditionSlugs: ['stress', 'sleep', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    legacySlugs: ['os-ho450-p', 'pr-ho450-p'],
    useCaseLabel:
      'Best for home or studio users who want a more deliberate H2 + O2 session rhythm without moving to a larger station.',
  },
  {
    slug: 'pr-h600',
    lineId: 'intensive',
    title: 'PR-H600',
    catalogSummary:
      'High-output pure hydrogen unit designed for frequent use at home, in a studio, or in a private clinic room.',
    heroSummary:
      'PR-H600 opens the Intensive Line as a clear step beyond the personal tier: more session headroom, more frequent-use tolerance, and a stronger platform for a weekly regenerative cadence.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    image: '/images/catalog/omega3/2026/pr-h600.png',
    imageAlt: 'Hylono Molecular Hydrogen PR-H600',
    variants: [
      {
        model: 'PR-H600',
        hydrogen: '600 ml/min',
        dimensions: '40 x 40 x 20 cm',
        weight: '11 kg',
        grossPrice: 6990,
        netPrice: 5682.93,
        activeSummary:
          'Choose PR-H600 when you want the entry point to frequent-use hydrogen without moving into an H2 + O2 platform.',
      },
    ],
    conditionSlugs: ['stress', 'recovery', 'vitality'],
    protocolSlugs: [
      'stress-balance-h2-foundation',
      'vitality-dual-stack',
      'recovery-oxygen-foundation',
    ],
    legacySlugs: ['pr-h600'],
    useCaseLabel:
      'Best for users who need a stronger weekly rhythm and more frequent sessions while keeping the protocol focused on pure hydrogen.',
  },
  {
    slug: 'pr-ho900-ho1500-ho1800',
    lineId: 'intensive',
    title: 'PR-HO900 / PR-HO1500 / PR-HO1800',
    catalogSummary:
      'Three-step H2 + O2 family for home and clinic use, built on one platform with progressively stronger output.',
    heroSummary:
      'This family turns one intensive platform into three escalating configurations, making it easier to size the session correctly without leaving the same core architecture.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    image: '/images/catalog/omega3/2026/pr-ho900-1800.png',
    imageAlt: 'Hylono Molecular Hydrogen PR-HO900, PR-HO1500, and PR-HO1800',
    variants: [
      {
        model: 'PR-HO900',
        hydrogen: '600 ml/min',
        oxygen: '300 ml/min',
        dimensions: '40 x 40 x 20 cm',
        weight: '11 kg',
        grossPrice: 7990,
        netPrice: 6495.93,
        activeSummary:
          'PR-HO900 is the calmest entry into the intensive H2 + O2 family, suited to buyers who want mixed-gas delivery with manageable daily complexity.',
      },
      {
        model: 'PR-HO1500',
        hydrogen: '1000 ml/min',
        oxygen: '500 ml/min',
        dimensions: '40 x 40 x 20 cm',
        weight: '12 kg',
        grossPrice: 10290,
        netPrice: 8365.85,
        activeSummary:
          'PR-HO1500 is the midpoint for users who already know they need more throughput, longer session resilience, and stronger protocol headroom.',
      },
      {
        model: 'PR-HO1800',
        hydrogen: '1200 ml/min',
        oxygen: '600 ml/min',
        dimensions: '40 x 40 x 20 cm',
        weight: '12 kg',
        grossPrice: 11290,
        netPrice: 9178.86,
        activeSummary:
          'PR-HO1800 is the upper intensive choice for buyers who want more assertive H2 + O2 output before moving to the advanced floor-standing stations.',
      },
    ],
    conditionSlugs: ['recovery', 'stress', 'vitality'],
    protocolSlugs: [
      'stress-balance-h2-foundation',
      'vitality-dual-stack',
      'recovery-oxygen-foundation',
    ],
    legacySlugs: ['pr-ho900', 'pr-ho1500', 'pr-ho1800', 'pr-ho900-1800'],
    useCaseLabel:
      'Best for buyers who want one H2 + O2 platform with a clear step-up path from moderate to stronger session intensity.',
  },
  {
    slug: 'pr-ho900-p-ho1800-p-ho3000-p',
    lineId: 'intensive',
    title: 'PR-HO900-P / PR-HO1800-P / PR-HO3000-P',
    catalogSummary:
      'Pulse-mode H2 + O2 family that stores gas during exhalation and releases it on the next inhale.',
    heroSummary:
      'The pulse-enabled PR family is for buyers who want more technical, breath-led delivery without stepping into the physically larger advanced stations.',
    routeBadges: [
      'Pulse Mode',
      'Inhalation',
      'Hydrogen Water',
      'Ocular Set',
      'Auricular Set',
    ],
    image: '/images/catalog/omega3/2026/pr-ho-p-family.png',
    imageAlt: 'Hylono Molecular Hydrogen PR-HO900-P, PR-HO1800-P, and PR-HO3000-P',
    variants: [
      {
        model: 'PR-HO900-P',
        hydrogen: '600 ml/min',
        oxygen: '300 ml/min',
        dimensions: '14 x 27 x 45 cm',
        weight: '11 kg',
        grossPrice: 9490,
        netPrice: 7715.45,
        activeSummary:
          'PR-HO900-P is the most accessible pulse configuration in the intensive line, balancing guided breath timing with a manageable technical footprint.',
      },
      {
        model: 'PR-HO1800-P',
        hydrogen: '1200 ml/min',
        oxygen: '600 ml/min',
        dimensions: '14 x 27 x 45 cm',
        weight: '11 kg',
        grossPrice: 13490,
        netPrice: 10967.48,
        activeSummary:
          'PR-HO1800-P is the midpoint for buyers who want pulse delivery to feel unmistakably premium while still fitting a private room or studio workflow.',
      },
      {
        model: 'PR-HO3000-P',
        hydrogen: '2000 ml/min',
        oxygen: '1000 ml/min',
        dimensions: '14 x 27 x 45 cm',
        weight: '11 kg',
        grossPrice: 18490,
        netPrice: 15032.52,
        activeSummary:
          'PR-HO3000-P is the top pulse configuration before the advanced station tier, built for users who want the strongest breath-synchronised experience in the intensive family.',
      },
    ],
    conditionSlugs: ['recovery', 'stress', 'vitality'],
    protocolSlugs: [
      'stress-balance-h2-foundation',
      'vitality-dual-stack',
      'recovery-oxygen-foundation',
    ],
    legacySlugs: [
      'pr-ho900-p',
      'pr-ho1800-p',
      'pr-ho3000-p',
      'pr-ho-p-family',
    ],
    useCaseLabel:
      'Best for users who want pulse-controlled H2 + O2 delivery and a more technical inhalation experience.',
  },
  {
    slug: 'za-ho3000-ho3600',
    lineId: 'advanced',
    title: 'ZA-HO3000 / ZA-HO3600',
    catalogSummary:
      'Advanced inhalation station family with two output levels for intensive premium-use environments.',
    heroSummary:
      'ZA-HO3000 and ZA-HO3600 open the advanced tier with more obvious technical presence, more throughput reserve, and a setup that feels designed for premium rooms rather than ordinary countertops.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    image: '/images/catalog/omega3/2026/za-ho3000-3600.png',
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO3000 and ZA-HO3600',
    variants: [
      {
        model: 'ZA-HO3000',
        hydrogen: '2000 ml/min',
        oxygen: '1000 ml/min',
        dimensions: '34 x 26 x 46 cm',
        weight: '15 kg',
        grossPrice: 15290,
        netPrice: 12430.89,
        activeSummary:
          'ZA-HO3000 is the cleaner entry into the advanced floor-standing tier, offering serious throughput for premium rooms without jumping straight to the heaviest configuration.',
      },
      {
        model: 'ZA-HO3600',
        hydrogen: '2400 ml/min',
        oxygen: '1200 ml/min',
        dimensions: '34 x 30 x 64 cm',
        weight: '26 kg',
        grossPrice: 18290,
        netPrice: 14869.92,
        activeSummary:
          'ZA-HO3600 is the stronger two-model choice for spaces that want more output reserve, more visual technical presence, and deeper weekly use tolerance.',
      },
    ],
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: [
      'vitality-dual-stack',
      'recovery-oxygen-foundation',
      'stress-balance-h2-foundation',
    ],
    legacySlugs: ['za-ho3000', 'za-ho3600', 'za-ho3000-3600'],
    useCaseLabel:
      'Best for premium spaces that need advanced throughput and a more professional operating posture.',
  },
  {
    slug: 'za-ho3000-b-ho4500-b',
    lineId: 'advanced',
    title: 'ZA-HO3000-B / ZA-HO4500-B',
    catalogSummary:
      'Compact high-output station family that concentrates advanced performance into a cleaner, more modern footprint.',
    heroSummary:
      'The ZA-B family keeps advanced output but packages it into a tighter architecture, making it easier to place in refined private or studio environments without losing technical intent.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    image: '/images/catalog/omega3/2026/za-ho3000-b-4500-b.png',
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO3000-B and ZA-HO4500-B',
    variants: [
      {
        model: 'ZA-HO3000-B',
        hydrogen: '2000 ml/min',
        oxygen: '1000 ml/min',
        dimensions: '30 x 31 x 59 cm',
        weight: '26 kg',
        grossPrice: 14990,
        netPrice: 12186.99,
        activeSummary:
          'ZA-HO3000-B is the advanced compact entry point for buyers who want professional performance in a more composed architectural footprint.',
      },
      {
        model: 'ZA-HO4500-B',
        hydrogen: '3000 ml/min',
        oxygen: '1500 ml/min',
        dimensions: '30 x 31 x 59 cm',
        weight: '27 kg',
        grossPrice: 19490,
        netPrice: 15845.53,
        activeSummary:
          'ZA-HO4500-B is the more forceful compact choice for spaces that want advanced throughput but still care about cleaner placement and visual restraint.',
      },
    ],
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: [
      'vitality-dual-stack',
      'recovery-oxygen-foundation',
      'stress-balance-h2-foundation',
    ],
    legacySlugs: ['za-ho3000-b', 'za-ho4500-b', 'za-ho3000-b-4500-b'],
    useCaseLabel:
      'Best for premium spaces that want advanced performance in a more compact architectural form.',
  },
  {
    slug: 'za-ho6000',
    lineId: 'advanced',
    title: 'ZA-HO6000',
    catalogSummary:
      'Flagship continuous-duty station built for the highest output and the strongest operational reserve in the range.',
    heroSummary:
      'ZA-HO6000 is the central hydrogen platform for environments that do not want compromise: maximum headroom, continuous-duty readiness, and the strongest signal that hydrogen is part of a serious regenerative suite.',
    routeBadges: ['Inhalation', 'Hydrogen Water', 'Ocular Set', 'Auricular Set'],
    image: '/images/catalog/omega3/2026/za-ho6000.png',
    imageAlt: 'Hylono Molecular Hydrogen ZA-HO6000',
    variants: [
      {
        model: 'ZA-HO6000',
        hydrogen: '4000 ml/min',
        oxygen: '2000 ml/min',
        dimensions: '33 x 36 x 63 cm',
        weight: '27 kg',
        grossPrice: 31990,
        netPrice: 26008.13,
        activeSummary:
          'Choose ZA-HO6000 when the space needs flagship throughput, continuous-duty confidence, and a central station worthy of a premium recovery environment.',
      },
    ],
    conditionSlugs: ['recovery', 'vitality', 'stress'],
    protocolSlugs: [
      'vitality-dual-stack',
      'recovery-oxygen-foundation',
      'stress-balance-h2-foundation',
    ],
    legacySlugs: ['za-ho6000'],
    useCaseLabel:
      'Best for large premium rooms, clinics, and showrooms that need maximum throughput and the strongest platform in the line.',
  },
  {
    slug: 'wo-b300-b600',
    lineId: 'water',
    title: 'WO-B300 / WO-B600',
    catalogSummary:
      'Hydrogen bath generator family offered in two concentration levels for full-body immersion rituals.',
    heroSummary:
      'WO-B300 and WO-B600 move hydrogen from inhalation into immersion. Instead of scheduling a separate breathing block, the protocol becomes part of the bathing environment itself.',
    routeBadges: ['Hydrogen Bath'],
    image: '/images/catalog/omega3/2026/aq-b300-b600.png',
    imageAlt: 'Hylono Molecular Hydrogen WO-B300 and WO-B600',
    variants: [
      {
        model: 'WO-B300',
        hydrogen: '2000 ppb',
        dimensions: '35 x 30 x 45 cm',
        weight: '21 kg',
        grossPrice: 8990,
        netPrice: 7308.94,
        activeSummary:
          'WO-B300 is the calmer bath entry for users who want a dedicated hydrogen immersion ritual without jumping to the strongest concentration in the family.',
      },
      {
        model: 'WO-B600',
        hydrogen: '3800 ppb',
        dimensions: '35 x 30 x 45 cm',
        weight: '21 kg',
        grossPrice: 10990,
        netPrice: 8934.96,
        activeSummary:
          'WO-B600 is the stronger immersion choice for buyers who want the most assertive bath concentration in this two-model family.',
      },
    ],
    conditionSlugs: ['sleep', 'stress', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    legacySlugs: ['wo-b300', 'wo-b600', 'aq-b300', 'aq-b600', 'aq-b300-b600'],
    useCaseLabel:
      'Best for users who want hydrogen built into an evening immersion ritual rather than a dedicated inhalation session.',
  },
  {
    slug: 'wo-s1300-s2000',
    lineId: 'water',
    title: 'WO-S1300 / WO-S2000',
    catalogSummary:
      'Wall-mounted hydrogen shower family designed for daily use without filling a bath.',
    heroSummary:
      'WO-S1300 and WO-S2000 make hydrogen part of the fastest ritual in the entire range: the shower. That matters when adherence depends on speed and architectural simplicity.',
    routeBadges: ['Hydrogen Shower'],
    image: '/images/catalog/omega3/2026/aq-s1300-s2000.png',
    imageAlt: 'Hylono Molecular Hydrogen WO-S1300 and WO-S2000',
    variants: [
      {
        model: 'WO-S1300',
        hydrogen: '1300 ppb',
        dimensions: '41 x 30 x 15 cm',
        weight: '7 kg',
        grossPrice: 7490,
        netPrice: 6089.43,
        activeSummary:
          'WO-S1300 is the lower-friction shower entry for buyers who want hydrogen integrated into the most automatic part of the day.',
      },
      {
        model: 'WO-S2000',
        hydrogen: '2000 ppb',
        dimensions: '41 x 30 x 15 cm',
        weight: '7 kg',
        grossPrice: 8990,
        netPrice: 7308.94,
        activeSummary:
          'WO-S2000 is the stronger shower choice for users who still prioritise speed and routine but want more concentration headroom.',
      },
    ],
    conditionSlugs: ['sleep', 'stress', 'vitality'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    legacySlugs: ['wo-s1300', 'wo-s2000', 'aq-s1300', 'aq-s2000', 'aq-s1300-s2000'],
    useCaseLabel:
      'Best for users who want the lowest-friction way to make hydrogen water part of daily life.',
  },
  {
    slug: 'wo-pw3000',
    lineId: 'water',
    title: 'WO-PW3000',
    catalogSummary:
      'Stationary 3000 ppb hydrogen water dispenser that creates a permanent access point for hydrogen-rich drinking water.',
    heroSummary:
      'WO-PW3000 turns hydrogen water into infrastructure. Instead of a single session, it creates a standing point of access for the home, studio, or showroom.',
    routeBadges: ['Hydrogen Water'],
    image: '/images/catalog/omega3/2026/aq-pw3000.png',
    imageAlt: 'Hylono Molecular Hydrogen WO-PW3000',
    variants: [
      {
        model: 'WO-PW3000',
        hydrogen: '3000 ppb',
        dimensions: '53 x 28 x 47 cm',
        weight: '14 kg',
        grossPrice: 2990,
        netPrice: 2430.89,
        activeSummary:
          'Choose WO-PW3000 when the protocol depends on repeated hydrogen-water intake across the day rather than one isolated use window.',
      },
    ],
    conditionSlugs: ['stress', 'vitality', 'recovery'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    legacySlugs: ['wo-pw3000', 'aq-pw3000'],
    useCaseLabel:
      'Best for homes or studios that want a dedicated, always-available source of hydrogen-rich drinking water.',
  },
  {
    slug: 'wo-b4500',
    lineId: 'water',
    title: 'WO-B4500',
    catalogSummary:
      'Portable hydrogen bottle for daily use at home, at work, during travel, and between sessions.',
    heroSummary:
      'WO-B4500 closes the Water Regeneration Line with the most mobile format in the entire hydrogen portfolio: hydrogen access that travels with the user instead of waiting at home.',
    routeBadges: ['Portable Water'],
    image: '/images/catalog/omega3/2026/aq-b4500.png',
    imageAlt: 'Hylono Molecular Hydrogen WO-B4500',
    variants: [
      {
        model: 'WO-B4500',
        hydrogen: '4000-4500 ppb',
        dimensions: '17 x 22 cm',
        weight: '2 kg',
        grossPrice: 500,
        netPrice: 406.5,
        activeSummary:
          'Choose WO-B4500 when the protocol only works if hydrogen stays available outside the home stack, between meetings, workouts, and travel segments.',
      },
    ],
    conditionSlugs: ['stress', 'vitality', 'sleep'],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    legacySlugs: ['wo-b4500', 'aq-b4500'],
    useCaseLabel:
      'Best for users whose protocol depends on portability and immediate access outside the main home environment.',
  },
];

export const hydrogenPremiumPageBySlug = hydrogenPremiumPages.reduce<
  Record<HydrogenPremiumSlug, HydrogenPremiumPageRecord>
>((acc, page) => {
  acc[page.slug] = page;
  return acc;
}, {} as Record<HydrogenPremiumSlug, HydrogenPremiumPageRecord>);

export const hydrogenPremiumAliasToSlug = hydrogenPremiumPages.reduce<
  Record<string, HydrogenPremiumSlug>
>((acc, page) => {
  acc[page.slug] = page.slug;
  page.legacySlugs.forEach((legacySlug) => {
    acc[legacySlug.toLowerCase()] = page.slug;
  });
  return acc;
}, {});

export const getHydrogenPremiumPath = (slug: HydrogenPremiumSlug) =>
  `/product/${slug}`;

export const formatPln = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PLN',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
