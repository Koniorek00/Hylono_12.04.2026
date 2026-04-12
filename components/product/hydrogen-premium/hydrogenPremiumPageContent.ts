import { conditionGoalBySlug } from '@/content/conditions';
import { evidenceById } from '@/content/evidence';
import {
  formatPln,
  getHydrogenPremiumPath,
  type HydrogenPremiumLineId,
  type HydrogenPremiumPageRecord,
} from '@/content/hydrogen-premium-2026';
import { protocolBySlug } from '@/content/protocols';

export const conditionTitleBySlug = {
  recovery: 'Recovery',
  sleep: 'Sleep Quality',
  stress: 'Stress & Focus',
  comfort: 'Comfort',
  vitality: 'Vitality',
} as const;

export const pairingCards = [
  {
    title: 'HBOT',
    description:
      'Hydrogen works best here as the oxidative-balance layer around oxygen-rich routines, not as an isolated gadget with no wider protocol context.',
    href: '/product/hbot',
  },
  {
    title: 'RLT / NIR',
    description:
      'Photobiomodulation pairs naturally with quieter home or studio hydrogen stacks when the goal is routine-friendly mitochondrial support.',
    href: '/product/rlt',
  },
  {
    title: 'PEMF',
    description:
      'PEMF adds a regulation layer that sits comfortably beside hydrogen when the broader stack needs a gentler, lower-friction entry point.',
    href: '/product/pemf',
  },
] as const;

const sharedFaqs = [
  {
    question: 'Can this be used safely at home?',
    answer:
      'Yes. These systems are positioned for daily home, home-and-studio, or premium-room use depending on the model family. Final placement still depends on advisory fit and room context.',
  },
  {
    question: 'What kind of water does the system require?',
    answer:
      'Demineralized water is the everyday operating baseline for systems built around this membrane architecture.',
  },
  {
    question: 'How long is a typical daily session?',
    answer:
      'Twenty to forty minutes per day is a calm starting point for inhalation routines. Final session design depends on the chosen model and the wider protocol.',
  },
  {
    question: 'What does daily upkeep actually involve?',
    answer:
      'In practice the day-to-day rhythm is simple: maintain the water level, keep accessories clean, and keep the routine consistent enough that the device becomes part of the schedule rather than an occasional event.',
  },
  {
    question: 'Does the system require frequent service visits?',
    answer:
      'PEM-membrane operation is designed to stay stable in normal day-to-day use without turning service into a constant chore.',
  },
  {
    question: 'What does routine ownership cost over time?',
    answer:
      'Routine ownership remains light. In most cases the ongoing cost is primarily demineralized water plus normal wear items that depend on how frequently the system is used.',
  },
] as const;

export const parseNumbers = (value: string) =>
  (value.match(/\d+(?:[.,]\d+)?/g) ?? []).map((item) =>
    Number(item.replace(',', '.')),
  );

export const slugifyModel = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getPriceRangeLabel = (page: HydrogenPremiumPageRecord) => {
  const prices = page.variants.map((variant) => variant.grossPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPln(min) : `${formatPln(min)} to ${formatPln(max)}`;
};

export const getMetadataDescription = (page: HydrogenPremiumPageRecord) => {
  const h2Values = page.variants
    .map((variant) =>
      `${variant.model}: ${variant.hydrogen}${variant.oxygen ? ` + ${variant.oxygen} O2` : ''}`,
    )
    .join(', ');

  return `${page.catalogSummary} ${page.useCaseLabel} Pricing range: ${getPriceRangeLabel(page)}. Output profile: ${h2Values}.`;
};

export const getScores = (page: HydrogenPremiumPageRecord) => {
  const maxHydrogen = Math.max(
    ...page.variants.map((variant) => Math.max(...parseNumbers(variant.hydrogen), 0)),
  );
  const maxOxygen = Math.max(
    ...page.variants.map((variant) => Math.max(...parseNumbers(variant.oxygen ?? ''), 0)),
  );
  const outputUpperBound = page.lineId === 'water' ? 4500 : 4000;
  const deploymentBase: Record<HydrogenPremiumLineId, number> = {
    personal: 88,
    intensive: 70,
    advanced: 48,
    water: 84,
  };
  const synergyBase: Record<HydrogenPremiumLineId, number> = {
    personal: 84,
    intensive: 90,
    advanced: 95,
    water: 79,
  };

  return [
    {
      label: page.lineId === 'water' ? 'Hydrogen saturation' : 'Hydrogen output',
      value: Math.min(100, Math.max(22, Math.round((maxHydrogen / outputUpperBound) * 100))),
      hint:
        page.lineId === 'water'
          ? 'Scaled against dissolved-hydrogen concentration.'
          : 'Scaled against published H2 flow.',
    },
    {
      label: 'Oxygen layer',
      value: maxOxygen ? Math.min(100, Math.round((maxOxygen / 2000) * 100)) : 18,
      hint: maxOxygen
        ? 'Relevant to H2 + O2 configurations.'
        : 'This page is not built around a separate oxygen layer.',
    },
    {
      label: 'Deployment ease',
      value: Math.min(100, deploymentBase[page.lineId] - page.variants.length * 2),
      hint: 'Footprint, room fit, and day-to-day operating friction.',
    },
    {
      label: 'Hylono synergy',
      value: synergyBase[page.lineId],
      hint: 'How naturally the system enters HBOT, RLT, and PEMF routines.',
    },
  ];
};

export const getPricingCards = (page: HydrogenPremiumPageRecord) => [
  {
    title: 'Pricing range',
    body: `Pricing across this family runs from ${getPriceRangeLabel(page)} gross.`,
  },
  {
    title: 'Rental with buyout logic',
    body: 'Selected systems can enter a test-before-you-buy path where rental payments reduce the value of a later purchase.',
  },
  {
    title: '3-year warranty',
    body: 'This hydrogen range carries a 3-year warranty.',
  },
  {
    title: 'Delivery and onboarding',
    body: 'Advisory fit, installation context, and post-purchase support are treated as part of the product experience rather than a separate afterthought.',
  },
];

export const getRouteCards = (page: HydrogenPremiumPageRecord) => [
  {
    title: 'Hydrogen reference page',
    description:
      'The wider H2 page remains the reference route for the broader delivery logic, accessories, and baseline HOP-450 buying context.',
    href: '/product/hydrogen',
  },
  {
    title: 'Research',
    description:
      'Canonical evidence and limitations for molecular hydrogen live in the Hylono research layer.',
    href: '/research',
  },
  {
    title: 'Protocols',
    description:
      'This model group belongs inside practical routines, not a standalone specification vacuum.',
    href: page.protocolSlugs.length > 0 ? `/protocols/${page.protocolSlugs[0]}` : '/protocols',
  },
  {
    title: 'Rental / Contact',
    description:
      'The commercial next step is either guided rental planning or a direct model-selection conversation.',
    href: '/rental',
  },
];

export const getProtocolFitCards = (
  page: HydrogenPremiumPageRecord,
  lineSubtitle: string,
  lineRangeLabel: string,
) => [
  {
    title: 'Who it is for',
    body: page.useCaseLabel,
  },
  {
    title: 'Deployment context',
    body: `${lineSubtitle}. ${lineRangeLabel}.`,
  },
  {
    title: 'Stack logic',
    body: 'The system is meant to act as a layer inside a modular regenerative environment, not as a disconnected device with no protocol role.',
  },
];

export const getScienceCards = (page: HydrogenPremiumPageRecord) => [
  {
    title: 'Selective antioxidant logic',
    description:
      'Molecular hydrogen is studied because it may help modulate the most reactive oxidative species without flattening useful signalling pathways.',
  },
  {
    title: 'Small-molecule architecture',
    description:
      'Its small molecular size is why hydrogen is discussed across cellular, mitochondrial, and system-level wellness conversations.',
  },
  {
    title: 'Rhythm over intensity',
    description:
      'For most buyers the real question is not maximum output alone. It is whether the configuration lowers enough friction to make the protocol repeatable.',
  },
  page.lineId === 'water'
    ? {
        title: 'Water route',
        description:
          'For the water line the core variable is dissolved-hydrogen concentration, so the daily ritual shifts from inhalation scheduling to bathing, showering, drinking, or portable use.',
      }
    : {
        title: 'Delivery precision',
        description: page.variants.some((variant) => variant.oxygen)
          ? 'H2 + O2 models create a denser session architecture, delivering both gases within a more deliberate intensity profile.'
          : 'Pure-hydrogen models support a cleaner operating rhythm with less session complexity and an easier path to daily adherence.',
      },
];

export const getDeliveryCards = (page: HydrogenPremiumPageRecord) =>
  page.lineId === 'water'
    ? [
        {
          title: 'Hydrogen bath',
          description: 'Immersion-based whole-body bathing route.',
          href: getHydrogenPremiumPath('wo-b300-b600'),
        },
        {
          title: 'Hydrogen shower',
          description: 'Daily shower route without committing to a bath ritual.',
          href: getHydrogenPremiumPath('wo-s1300-s2000'),
        },
        {
          title: 'Countertop water',
          description: 'Permanent access point for hydrogen-rich drinking water.',
          href: getHydrogenPremiumPath('wo-pw3000'),
        },
        {
          title: 'Portable bottle',
          description: 'Mobile hydrogen-water access for work, training, and travel.',
          href: getHydrogenPremiumPath('wo-b4500'),
        },
      ]
    : [
        {
          title: 'Classic cannula',
          description: 'The most direct route for systemic hydrogen inhalation.',
          href: '/product/hydrogen',
        },
        {
          title: 'Hydrogen water',
          description: 'Daily dissolved-hydrogen access for wider routine adherence.',
          href: getHydrogenPremiumPath('wo-pw3000'),
        },
        {
          title: 'Ocular set',
          description: 'A localized add-on route within the same hydrogen platform.',
          href: '/product/hydrogen',
        },
        {
          title: 'Auricular set',
          description: 'A targeted extension for more specific hydrogen routines.',
          href: '/product/hydrogen',
        },
      ];

export const getSafetyCards = (
  page: HydrogenPremiumPageRecord,
  lineSubtitle: string,
) => [
  {
    title: page.lineId === 'water' ? 'Bathing and water environment' : 'Operating environment',
    description:
      page.lineId === 'water'
        ? 'These models are built around bathing, showering, drinking-water access, or portable hydrogen-water use.'
        : `${lineSubtitle}. The advisory conversation confirms whether the room, cadence, and user expectations match the configuration.`,
  },
  {
    title: 'Water requirement',
    description:
      'Demineralized water remains the everyday operating baseline for systems built on this membrane architecture.',
  },
  {
    title: 'Daily handling',
    description:
      'The essentials remain consistent: monitor water level, keep accessories clean, and use the system in a repeatable rhythm rather than sporadic spikes.',
  },
  {
    title: 'Contraindications',
    description:
      'A standalone public contraindication table is not published for these models, so Hylono keeps pre-purchase advisory screening in the buying path.',
  },
];

export const getStepPlan = (page: HydrogenPremiumPageRecord) =>
  page.lineId === 'water'
    ? [
        'Choose the route first: bath, shower, countertop dispenser, or portable bottle.',
        'Anchor the system to an existing ritual so hydrogen becomes part of the day rather than an extra task.',
        'If a deeper stack is needed, connect the water route to inhalation, HBOT, RLT, or PEMF rather than replacing the whole protocol with one gadget.',
        'Reassess after the first two to four weeks and confirm that the chosen format actually lowers adherence friction.',
      ]
    : [
        'Match output to room context and weekly session frequency before buying the strongest model by default.',
        'Start with a calm daily base block before increasing complexity or adding higher-intensity cadence.',
        'Only after the rhythm feels stable should HBOT, RLT, or PEMF be layered into the same stack.',
        'Reassess once the first block is complete and decide whether the current output is enough or whether the next step up in the same family is justified.',
      ];

export const getExpectedResults = (page: HydrogenPremiumPageRecord) =>
  page.lineId === 'water'
    ? [
        'Hydrogen exposure folded into bathing, showering, drinking-water, or portable hydration rituals.',
        'Lower protocol friction for users who do not want a separate inhalation block every day.',
        'Easier integration of hydrogen into a wider HBOT, RLT, and PEMF ecosystem.',
      ]
    : [
        'Higher session regularity and lower day-to-day friction once the right output is matched to the room.',
        'A cleaner way to place hydrogen inside a broader stack with HBOT, RLT, and PEMF.',
        'A more precise fit between session intensity, operating environment, and user expectations.',
      ];

export const buildApplications = (page: HydrogenPremiumPageRecord) =>
  page.conditionSlugs.map((conditionSlug) => {
    const condition = conditionGoalBySlug[conditionSlug];

    return {
      title: conditionTitleBySlug[conditionSlug],
      description:
        condition?.description?.[0] ??
        condition?.subtitle ??
        'Evidence-informed Hylono education path.',
      href: `/conditions/${conditionSlug}`,
    };
  });

export const buildEvidenceItems = (page: HydrogenPremiumPageRecord) =>
  page.protocolSlugs
    .flatMap((protocolSlug) => protocolBySlug[protocolSlug]?.evidenceIds ?? [])
    .concat(['ev-h2-001', 'ev-h2-002', 'ev-h2-003'])
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((id) => evidenceById[id])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3);

export const buildBundles = (page: HydrogenPremiumPageRecord) =>
  page.protocolSlugs
    .map((protocolSlug) => protocolBySlug[protocolSlug])
    .filter((protocol): protocol is NonNullable<typeof protocol> => Boolean(protocol))
    .map((protocol) => ({
      title: protocol.title,
      description: protocol.shortDescription,
      href: `/protocols/${protocol.slug}`,
    }));

export const buildFaqItems = (page: HydrogenPremiumPageRecord) => {
  const firstVariant = page.variants[0];
  const lastVariant = page.variants[page.variants.length - 1];

  return [
    ...sharedFaqs,
    page.variants.length > 1
      ? {
          question: `Which configuration in the ${page.title} family is the right starting point?`,
          answer: `The family opens at ${firstVariant?.hydrogen ?? ''}${firstVariant?.oxygen ? ` plus ${firstVariant.oxygen} oxygen` : ''} and rises to ${lastVariant?.hydrogen ?? ''}${lastVariant?.oxygen ? ` plus ${lastVariant.oxygen} oxygen` : ''}. The real decision depends on cadence, room context, and how technical you want the routine to feel.`,
        }
      : {
          question: `Where does ${page.title} sit inside the wider line?`,
          answer: page.useCaseLabel,
        },
    page.lineId === 'water'
      ? {
          question: 'Does the water regeneration line replace inhalation?',
          answer:
            'Not necessarily. For many buyers it becomes either the primary low-friction entry into hydrogen or a complementary layer alongside inhalation when daily adherence matters most.',
        }
      : {
          question: 'Can this configuration enter a larger Hylono stack?',
          answer:
            'Yes. Hylono positions hydrogen alongside HBOT, RLT, and PEMF as part of a modular ecosystem rather than an isolated device category.',
        },
  ];
};
