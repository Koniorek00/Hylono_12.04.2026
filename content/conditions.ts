export interface ConditionModality {
  slug: 'mHBOT' | 'H2' | 'RLT' | 'PEMF';
  shortName: string;
  name: string;
  relevance: 1 | 2 | 3 | 4 | 5;
  explanation: string;
  sessionTime: string;
  rentalFrom: string;
  purchaseFrom: string;
}

export interface RecommendedStack {
  title: string;
  devices: string[];
  rentalPrice: string;
  purchasePrice: string;
  link: string;
  highlighted?: boolean;
}

export interface ConditionGoalPage {
  slug: 'recovery' | 'sleep' | 'stress' | 'comfort' | 'vitality';
  title: string;
  subtitle: string;
  description: string[];
  modalities: ConditionModality[];
  protocolSlugs: string[];
  stacks: RecommendedStack[];
  evidenceIds: string[];
  faq: Array<{ q: string; a: string }>;
}

export const conditionGoals: ConditionGoalPage[] = [
  {
    slug: 'recovery',
    title: 'Recovery',
    subtitle: 'Support post-training reset, tissue comfort, and sustainable performance rhythm.',
    description: [
      'Recovery routines focus on restoring energy systems, reducing post-load discomfort, and improving readiness for the next training cycle.',
      'A protocol-first approach combines session timing, modality pairing, and practical consistency so users can build long-term adherence.',
    ],
    modalities: [
      {
        slug: 'mHBOT',
        shortName: 'mHBOT',
        name: 'Mild Hyperbaric Oxygen Therapy',
        relevance: 5,
        explanation: 'Structured oxygen sessions may support recovery comfort and post-load resilience.',
        sessionTime: '45–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
      {
        slug: 'RLT',
        shortName: 'RLT',
        name: 'Red / Near-Infrared Light',
        relevance: 4,
        explanation: 'Photobiomodulation is commonly used in recovery stacks for local tissue support.',
        sessionTime: '15–20 min',
        rentalFrom: '€199/mo',
        purchaseFrom: '€2,900',
      },
      {
        slug: 'H2',
        shortName: 'H2',
        name: 'Hydrogen Inhalation',
        relevance: 3,
        explanation: 'Hydrogen routines are used to support oxidative balance in recovery periods.',
        sessionTime: '20–30 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
      {
        slug: 'PEMF',
        shortName: 'PEMF',
        name: 'Pulsed Electromagnetic Field',
        relevance: 3,
        explanation: 'PEMF is often used for relaxation and tissue comfort as a complementary modality.',
        sessionTime: '20–30 min',
        rentalFrom: '€149/mo',
        purchaseFrom: '€2,390',
      },
    ],
    protocolSlugs: ['recovery-oxygen-foundation', 'vitality-dual-stack'],
    stacks: [
      {
        title: 'Starter',
        devices: ['mHBOT'],
        rentalPrice: 'from €1,099/mo',
        purchasePrice: 'from €24,900',
        link: '/builder?goal=recovery&tier=starter',
      },
      {
        title: 'Optimal',
        devices: ['mHBOT', 'H2'],
        rentalPrice: 'from €1,258/mo',
        purchasePrice: 'from €27,300',
        link: '/builder?goal=recovery&tier=optimal',
        highlighted: true,
      },
      {
        title: 'Pro',
        devices: ['mHBOT', 'H2', 'RLT'],
        rentalPrice: 'from €1,457/mo',
        purchasePrice: 'from €30,200',
        link: '/builder?goal=recovery&tier=pro',
      },
    ],
    evidenceIds: ['ev-hbot-001', 'ev-combo-001'],
    faq: [
      {
        q: 'How often should I run a recovery routine?',
        a: 'Most users start with 3 to 5 sessions per week and adjust by recovery load and schedule.',
      },
      {
        q: 'Is one modality enough to start?',
        a: 'Yes. Many users start with a single primary modality and add complementary options later.',
      },
    ],
  },
  {
    slug: 'sleep',
    title: 'Sleep',
    subtitle: 'Build evening routines that support calmer transitions and deeper overnight rest.',
    description: [
      'Sleep-oriented stacks usually combine lower-stimulation modalities and stable scheduling to improve consistency.',
      'The objective is not intensity, but rhythm: repeatable sessions that are easy to follow weekly.',
    ],
    modalities: [
      {
        slug: 'PEMF',
        shortName: 'PEMF',
        name: 'Pulsed Electromagnetic Field',
        relevance: 5,
        explanation: 'Low-frequency PEMF sessions are often used in evening wind-down routines.',
        sessionTime: '20–30 min',
        rentalFrom: '€149/mo',
        purchaseFrom: '€2,390',
      },
      {
        slug: 'RLT',
        shortName: 'RLT',
        name: 'Red / Near-Infrared Light',
        relevance: 3,
        explanation: 'Red-spectrum sessions can support evening routine quality in low-light environments.',
        sessionTime: '10–15 min',
        rentalFrom: '€199/mo',
        purchaseFrom: '€2,900',
      },
      {
        slug: 'H2',
        shortName: 'H2',
        name: 'Hydrogen Inhalation',
        relevance: 3,
        explanation: 'Hydrogen sessions are commonly used to reduce perceived stress load before sleep.',
        sessionTime: '20 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
      {
        slug: 'mHBOT',
        shortName: 'mHBOT',
        name: 'Mild Hyperbaric Oxygen Therapy',
        relevance: 2,
        explanation: 'Can be integrated earlier in the day to support overall sleep quality patterns.',
        sessionTime: '45–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
    ],
    protocolSlugs: ['recovery-oxygen-foundation', 'stress-balance-h2-foundation'],
    stacks: [
      {
        title: 'Starter',
        devices: ['PEMF'],
        rentalPrice: 'from €149/mo',
        purchasePrice: 'from €2,390',
        link: '/builder?goal=sleep&tier=starter',
      },
      {
        title: 'Optimal',
        devices: ['PEMF', 'H2'],
        rentalPrice: 'from €308/mo',
        purchasePrice: 'from €4,790',
        link: '/builder?goal=sleep&tier=optimal',
        highlighted: true,
      },
      {
        title: 'Pro',
        devices: ['PEMF', 'H2', 'RLT'],
        rentalPrice: 'from €507/mo',
        purchasePrice: 'from €7,690',
        link: '/builder?goal=sleep&tier=pro',
      },
    ],
    evidenceIds: ['ev-hbot-002'],
    faq: [
      {
        q: 'When should sleep-oriented sessions happen?',
        a: 'Most users place them in the final 2 to 3 hours before bedtime for better consistency.',
      },
      {
        q: 'Can I combine sleep and recovery goals?',
        a: 'Yes. Many protocols combine both with schedule adjustments across the week.',
      },
    ],
  },
  {
    slug: 'stress',
    title: 'Stress',
    subtitle: 'Support calmer daily baseline and improve resilience to cognitive load.',
    description: [
      'Stress-oriented protocols prioritize manageable session duration, simple setup, and repeatability for busy schedules.',
      'The goal is to reduce perceived load while preserving energy for work and family routines.',
    ],
    modalities: [
      {
        slug: 'PEMF',
        shortName: 'PEMF',
        name: 'Pulsed Electromagnetic Field',
        relevance: 4,
        explanation: 'PEMF is commonly used for relaxation-focused routines and nervous-system downshift.',
        sessionTime: '20 min',
        rentalFrom: '€149/mo',
        purchaseFrom: '€2,390',
      },
      {
        slug: 'H2',
        shortName: 'H2',
        name: 'Hydrogen Inhalation',
        relevance: 4,
        explanation: 'Hydrogen workflows may support cognitive comfort in high-demand periods.',
        sessionTime: '20–30 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
      {
        slug: 'mHBOT',
        shortName: 'mHBOT',
        name: 'Mild Hyperbaric Oxygen Therapy',
        relevance: 3,
        explanation: 'Can be used as a periodic deeper reset session in weekly stress-management plans.',
        sessionTime: '45–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
      {
        slug: 'RLT',
        shortName: 'RLT',
        name: 'Red / Near-Infrared Light',
        relevance: 2,
        explanation: 'Often used as an evening transition modality in stress-reduction routines.',
        sessionTime: '10–15 min',
        rentalFrom: '€199/mo',
        purchaseFrom: '€2,900',
      },
    ],
    protocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    stacks: [
      {
        title: 'Starter',
        devices: ['H2'],
        rentalPrice: 'from €159/mo',
        purchasePrice: 'from €2,400',
        link: '/builder?goal=stress&tier=starter',
      },
      {
        title: 'Optimal',
        devices: ['H2', 'PEMF'],
        rentalPrice: 'from €308/mo',
        purchasePrice: 'from €4,790',
        link: '/builder?goal=stress&tier=optimal',
        highlighted: true,
      },
      {
        title: 'Pro',
        devices: ['H2', 'PEMF', 'mHBOT'],
        rentalPrice: 'from €1,407/mo',
        purchasePrice: 'from €29,690',
        link: '/builder?goal=stress&tier=pro',
      },
    ],
    evidenceIds: ['ev-h2-001', 'ev-h2-003'],
    faq: [
      {
        q: 'What is a realistic session length for stress support?',
        a: 'Most users stay in the 20 to 30 minute range to maintain consistency on workdays.',
      },
      {
        q: 'Do I need a full stack immediately?',
        a: 'No. Start with one modality and expand once routine adherence is established.',
      },
    ],
  },
  {
    slug: 'comfort',
    title: 'Comfort',
    subtitle: 'Support everyday physical comfort, mobility, and postural ease.',
    description: [
      'Comfort plans prioritize local support modalities and practical session cadence that fits household schedules.',
      'The objective is to build sustainable routine quality rather than short-lived intensity bursts.',
    ],
    modalities: [
      {
        slug: 'RLT',
        shortName: 'RLT',
        name: 'Red / Near-Infrared Light',
        relevance: 5,
        explanation: 'Often used for local comfort routines around joints and muscles.',
        sessionTime: '10–20 min',
        rentalFrom: '€199/mo',
        purchaseFrom: '€2,900',
      },
      {
        slug: 'H2',
        shortName: 'H2',
        name: 'Hydrogen Inhalation',
        relevance: 4,
        explanation: 'Hydrogen workflows can complement comfort routines as a low-friction daily practice.',
        sessionTime: '20 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
      {
        slug: 'mHBOT',
        shortName: 'mHBOT',
        name: 'Mild Hyperbaric Oxygen Therapy',
        relevance: 4,
        explanation: 'Periodic oxygen sessions may support whole-body comfort and recovery rhythm.',
        sessionTime: '45–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
      {
        slug: 'PEMF',
        shortName: 'PEMF',
        name: 'Pulsed Electromagnetic Field',
        relevance: 2,
        explanation: 'Used as a complementary relaxation and comfort support session.',
        sessionTime: '20 min',
        rentalFrom: '€149/mo',
        purchaseFrom: '€2,390',
      },
    ],
    protocolSlugs: ['recovery-oxygen-foundation', 'stress-balance-h2-foundation'],
    stacks: [
      {
        title: 'Starter',
        devices: ['RLT'],
        rentalPrice: 'from €199/mo',
        purchasePrice: 'from €2,900',
        link: '/builder?goal=comfort&tier=starter',
      },
      {
        title: 'Optimal',
        devices: ['RLT', 'H2'],
        rentalPrice: 'from €358/mo',
        purchasePrice: 'from €5,300',
        link: '/builder?goal=comfort&tier=optimal',
        highlighted: true,
      },
      {
        title: 'Pro',
        devices: ['RLT', 'H2', 'mHBOT'],
        rentalPrice: 'from €1,457/mo',
        purchasePrice: 'from €30,200',
        link: '/builder?goal=comfort&tier=pro',
      },
    ],
    evidenceIds: ['ev-hbot-001', 'ev-h2-002'],
    faq: [
      {
        q: 'Can comfort routines be done daily?',
        a: 'Yes, most comfort-oriented plans are designed for frequent, lower-friction sessions.',
      },
      {
        q: 'How quickly do users adjust to routine?',
        a: 'Many users report routine comfort within the first one to two weeks.',
      },
    ],
  },
  {
    slug: 'vitality',
    title: 'Vitality',
    subtitle: 'Support consistent energy, focus, and whole-system wellness rhythm.',
    description: [
      'Vitality protocols combine whole-body and complementary modalities to support a stable baseline across busy weeks.',
      'A balanced stack can be used to structure both high-demand workdays and recovery windows.',
    ],
    modalities: [
      {
        slug: 'mHBOT',
        shortName: 'mHBOT',
        name: 'Mild Hyperbaric Oxygen Therapy',
        relevance: 4,
        explanation: 'Often used as a primary anchor modality for full-system vitality programs.',
        sessionTime: '45–60 min',
        rentalFrom: '€1,099/mo',
        purchaseFrom: '€24,900',
      },
      {
        slug: 'H2',
        shortName: 'H2',
        name: 'Hydrogen Inhalation',
        relevance: 4,
        explanation: 'Hydrogen sessions provide practical daily support in multi-modality stacks.',
        sessionTime: '20–30 min',
        rentalFrom: '€159/mo',
        purchaseFrom: '€2,400',
      },
      {
        slug: 'RLT',
        shortName: 'RLT',
        name: 'Red / Near-Infrared Light',
        relevance: 3,
        explanation: 'RLT complements vitality plans with flexible short-duration local sessions.',
        sessionTime: '10–20 min',
        rentalFrom: '€199/mo',
        purchaseFrom: '€2,900',
      },
      {
        slug: 'PEMF',
        shortName: 'PEMF',
        name: 'Pulsed Electromagnetic Field',
        relevance: 3,
        explanation: 'PEMF is commonly used to support calm-energy balance in daily vitality routines.',
        sessionTime: '20–30 min',
        rentalFrom: '€149/mo',
        purchaseFrom: '€2,390',
      },
    ],
    protocolSlugs: ['vitality-dual-stack', 'recovery-oxygen-foundation', 'stress-balance-h2-foundation'],
    stacks: [
      {
        title: 'Starter',
        devices: ['H2'],
        rentalPrice: 'from €159/mo',
        purchasePrice: 'from €2,400',
        link: '/builder?goal=vitality&tier=starter',
      },
      {
        title: 'Optimal',
        devices: ['mHBOT', 'H2'],
        rentalPrice: 'from €1,258/mo',
        purchasePrice: 'from €27,300',
        link: '/builder?goal=vitality&tier=optimal',
        highlighted: true,
      },
      {
        title: 'Pro',
        devices: ['mHBOT', 'H2', 'RLT'],
        rentalPrice: 'from €1,457/mo',
        purchasePrice: 'from €30,200',
        link: '/builder?goal=vitality&tier=pro',
      },
    ],
    evidenceIds: ['ev-combo-001', 'ev-h2-003'],
    faq: [
      {
        q: 'What is the best starting path for vitality?',
        a: 'Start with one anchor modality and add complementary sessions after your weekly rhythm is stable.',
      },
      {
        q: 'Can I run vitality and recovery goals together?',
        a: 'Yes. The builder supports multi-goal plans and adjusts recommendations based on overlap.',
      },
    ],
  },
];

export const conditionGoalBySlug = conditionGoals.reduce<Record<string, ConditionGoalPage>>((acc, goal) => {
  acc[goal.slug] = goal;
  return acc;
}, {});
