export interface Goal {
  slug: string;
  title: string;
  subtitle: string;
  description: string;

  modalities: Array<{
    slug: string;
    name: string;
    shortName: string;
    relevance: number;
    explanation: string;
    sessionTime: string;
    rentalFrom: string;
    purchaseFrom: string;
  }>;

  protocolSlugs: string[];
  evidenceIds: string[];
  relatedProductIds: string[];

  stacks: Array<{
    tier: 'starter' | 'optimal' | 'pro';
    title: string;
    devices: string[];
    rentalPrice: string;
    purchasePrice: string;
  }>;

  faq: Array<{ q: string; a: string }>;
}

export const goals: Goal[] = [
  {
    slug: 'recovery',
    title: 'Recovery',
    subtitle: 'Support post-training and high-load reset',
    description:
      'This goal path is designed to support muscle comfort, training continuity, and recovery consistency. It focuses on practical routines you can maintain over weeks, not one-off sessions.',
    modalities: [
      {
        slug: 'mhbot-st1700',
        name: 'mHBOT ST1700',
        shortName: 'mHBOT',
        relevance: 5,
        explanation: 'Pressure-supported oxygen routines may assist recovery rhythm after heavy training days.',
        sessionTime: '45–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
      {
        slug: 'h2-hop450',
        name: 'Hydrogen HOP-450',
        shortName: 'H2',
        relevance: 4,
        explanation: 'Hydrogen sessions may contribute to post-exercise comfort and perceived fatigue support.',
        sessionTime: '20–30 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
    ],
    protocolSlugs: ['recovery-oxygen-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-hbot-001', 'ev-h2-002', 'ev-combo-001'],
    relatedProductIds: ['mhbot-st1700', 'h2-hop450'],
    stacks: [
      {
        tier: 'starter',
        title: 'Recovery Starter',
        devices: ['h2-hop450'],
        rentalPrice: 'from €159/mo',
        purchasePrice: 'from €2,400',
      },
      {
        tier: 'optimal',
        title: 'Recovery Optimal',
        devices: ['mhbot-st1700'],
        rentalPrice: 'from €1,099/mo',
        purchasePrice: 'from €24,900',
      },
      {
        tier: 'pro',
        title: 'Recovery Pro Stack',
        devices: ['mhbot-st1700', 'h2-hop450'],
        rentalPrice: 'from €1,258/mo',
        purchasePrice: 'from €27,300',
      },
    ],
    faq: [
      {
        q: 'How fast can I start this goal routine?',
        a: 'Most users start with 2–3 sessions per week and scale gradually over the first two weeks.',
      },
      {
        q: 'Can I combine this with normal training?',
        a: 'Yes, the protocols are built to complement regular training and support recovery days.',
      },
    ],
  },
  {
    slug: 'sleep',
    title: 'Sleep',
    subtitle: 'Support deeper rest and evening wind-down',
    description:
      'This goal path focuses on evening-friendly routines that may support sleep onset and next-day readiness. Consistency and calm pre-sleep habits remain essential.',
    modalities: [
      {
        slug: 'mhbot-st1700',
        name: 'mHBOT ST1700',
        shortName: 'mHBOT',
        relevance: 4,
        explanation: 'Evening oxygen routines may assist decompression after mentally dense days.',
        sessionTime: '50–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
      {
        slug: 'h2-hop450',
        name: 'Hydrogen HOP-450',
        shortName: 'H2',
        relevance: 3,
        explanation: 'Hydrogen hydration and inhalation are often used in low-stimulus evening routines.',
        sessionTime: '15–25 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
    ],
    protocolSlugs: ['recovery-oxygen-foundation'],
    evidenceIds: ['ev-hbot-002'],
    relatedProductIds: ['mhbot-st1700', 'h2-hop450'],
    stacks: [
      {
        tier: 'starter',
        title: 'Sleep Starter',
        devices: ['h2-hop450'],
        rentalPrice: 'from €159/mo',
        purchasePrice: 'from €2,400',
      },
      {
        tier: 'optimal',
        title: 'Sleep Optimal',
        devices: ['mhbot-st1700'],
        rentalPrice: 'from €1,099/mo',
        purchasePrice: 'from €24,900',
      },
      {
        tier: 'pro',
        title: 'Sleep Pro Stack',
        devices: ['mhbot-st1700', 'h2-hop450'],
        rentalPrice: 'from €1,258/mo',
        purchasePrice: 'from €27,300',
      },
    ],
    faq: [
      {
        q: 'When should I schedule sessions for sleep support?',
        a: 'Late afternoon or early evening is typically best, while avoiding stimulating activity close to bedtime.',
      },
      {
        q: 'Do I need daily sessions?',
        a: 'Not always. Many users start with 3–4 sessions weekly and increase only if it feels sustainable.',
      },
    ],
  },
  {
    slug: 'stress',
    title: 'Stress',
    subtitle: 'Support calm focus and lower daily overload',
    description:
      'This path supports users managing high cognitive load. It combines short routines that fit into real workdays and support more stable energy rhythm.',
    modalities: [
      {
        slug: 'h2-hop450',
        name: 'Hydrogen HOP-450',
        shortName: 'H2',
        relevance: 5,
        explanation: 'Short inhalation blocks may support clearer transitions between high-demand tasks.',
        sessionTime: '20–30 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
      {
        slug: 'mhbot-st1700',
        name: 'mHBOT ST1700',
        shortName: 'mHBOT',
        relevance: 3,
        explanation: 'Scheduled oxygen sessions can support structured decompression after intensive days.',
        sessionTime: '45–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
    ],
    protocolSlugs: ['stress-balance-h2-foundation'],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    relatedProductIds: ['h2-hop450', 'mhbot-st1700'],
    stacks: [
      {
        tier: 'starter',
        title: 'Stress Starter',
        devices: ['h2-hop450'],
        rentalPrice: 'from €159/mo',
        purchasePrice: 'from €2,400',
      },
      {
        tier: 'optimal',
        title: 'Stress Optimal',
        devices: ['h2-hop450', 'mhbot-st1700'],
        rentalPrice: 'from €1,258/mo',
        purchasePrice: 'from €27,300',
      },
      {
        tier: 'pro',
        title: 'Stress Pro',
        devices: ['h2-hop450', 'mhbot-st1700'],
        rentalPrice: 'from €1,258/mo + guided support',
        purchasePrice: 'from €27,300 + guided support',
      },
    ],
    faq: [
      {
        q: 'Can I run sessions during workdays?',
        a: 'Yes, this goal is designed around short windows and practical scheduling constraints.',
      },
      {
        q: 'Is this intended as a medical treatment?',
        a: 'No, these routines are for wellness support and do not replace medical care.',
      },
    ],
  },
  {
    slug: 'comfort',
    title: 'Comfort',
    subtitle: 'Support everyday comfort and renewal routines',
    description:
      'Comfort routines focus on how you feel day to day. The emphasis is gentle, repeatable sessions that fit home life and support consistency.',
    modalities: [
      {
        slug: 'h2-hop450',
        name: 'Hydrogen HOP-450',
        shortName: 'H2',
        relevance: 4,
        explanation: 'Hydrogen hydration and inhalation can fit lightweight daily comfort routines.',
        sessionTime: '15–25 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
      {
        slug: 'mhbot-st1700',
        name: 'mHBOT ST1700',
        shortName: 'mHBOT',
        relevance: 3,
        explanation: 'Routine oxygen sessions are commonly used for full-body renewal workflows.',
        sessionTime: '45–55 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
    ],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    evidenceIds: ['ev-h2-002', 'ev-h2-003'],
    relatedProductIds: ['h2-hop450', 'mhbot-st1700'],
    stacks: [
      {
        tier: 'starter',
        title: 'Comfort Starter',
        devices: ['h2-hop450'],
        rentalPrice: 'from €159/mo',
        purchasePrice: 'from €2,400',
      },
      {
        tier: 'optimal',
        title: 'Comfort Optimal',
        devices: ['h2-hop450', 'mhbot-st1700'],
        rentalPrice: 'from €1,258/mo',
        purchasePrice: 'from €27,300',
      },
      {
        tier: 'pro',
        title: 'Comfort Pro',
        devices: ['h2-hop450', 'mhbot-st1700'],
        rentalPrice: 'from €1,258/mo + advisor support',
        purchasePrice: 'from €27,300 + advisor support',
      },
    ],
    faq: [
      {
        q: 'How quickly can I feel a routine benefit?',
        a: 'Many users notice routine comfort changes in 2–4 weeks when adherence is consistent.',
      },
      {
        q: 'Can I run this plan at low intensity?',
        a: 'Yes, this goal path is designed to be progressive and adjustable to your tolerance.',
      },
    ],
  },
  {
    slug: 'vitality',
    title: 'Vitality',
    subtitle: 'Support sustained energy and long-horizon wellness',
    description:
      'Vitality pathways combine modalities for users who want a structured protocol-first lifestyle rhythm. The focus is sustainability over intensity spikes.',
    modalities: [
      {
        slug: 'mhbot-st1700',
        name: 'mHBOT ST1700',
        shortName: 'mHBOT',
        relevance: 5,
        explanation: 'Pressure-supported oxygen routines can support whole-system recovery rhythm.',
        sessionTime: '50–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
      {
        slug: 'h2-hop450',
        name: 'Hydrogen HOP-450',
        shortName: 'H2',
        relevance: 5,
        explanation: 'Daily hydrogen workflows add practical, low-friction support for routine vitality.',
        sessionTime: '20–30 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
    ],
    protocolSlugs: ['vitality-dual-stack'],
    evidenceIds: ['ev-hbot-001', 'ev-h2-001', 'ev-combo-001'],
    relatedProductIds: ['mhbot-st1700', 'h2-hop450'],
    stacks: [
      {
        tier: 'starter',
        title: 'Vitality Starter',
        devices: ['h2-hop450'],
        rentalPrice: 'from €159/mo',
        purchasePrice: 'from €2,400',
      },
      {
        tier: 'optimal',
        title: 'Vitality Optimal',
        devices: ['mhbot-st1700'],
        rentalPrice: 'from €1,099/mo',
        purchasePrice: 'from €24,900',
      },
      {
        tier: 'pro',
        title: 'Vitality Dual Stack',
        devices: ['mhbot-st1700', 'h2-hop450'],
        rentalPrice: 'from €1,258/mo',
        purchasePrice: 'from €27,300',
      },
    ],
    faq: [
      {
        q: 'Is this only for athletes?',
        a: 'No, vitality protocols are built for active professionals and everyday wellness users alike.',
      },
      {
        q: 'What matters most for vitality outcomes?',
        a: 'Adherence, sleep hygiene, hydration, and conservative progression are the core drivers.',
      },
    ],
  },
];

export const goalBySlug = goals.reduce<Record<string, Goal>>((acc, item) => {
  acc[item.slug] = item;
  return acc;
}, {});
