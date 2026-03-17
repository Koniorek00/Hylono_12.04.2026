export interface Protocol {
  slug: string;
  title: string;
  goal: string;
  goalTag: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  timePerDay: string;
  shortDescription: string;
  targetAudience: string;

  requiredDevices: Array<{
    productId: string;
    role: string;
  }>;

  weeks: Array<{
    number: number;
    title: string;
    days: Array<{
      number: number;
      sessions: Array<{
        modality: string;
        duration: string;
        parameters: string;
        note?: string;
      }>;
    }>;
  }>;

  safetyNotes: string;
  contraindications: string[];
  evidenceIds: string[];
  relatedProtocolSlugs: string[];

  reviewer?: {
    name: string;
    credentials: string;
  };
  version: string;
}

export const protocols: Protocol[] = [
  {
    slug: 'recovery-oxygen-foundation',
    title: 'Recovery Oxygen Foundation',
    goal: 'Sports recovery',
    goalTag: 'recovery',
    difficulty: 'Beginner',
    durationWeeks: 4,
    timePerDay: '45–70 min',
    shortDescription:
      'A practical mHBOT-first routine designed to support recovery rhythm, sleep depth, and post-training reset.',
    targetAudience: 'Active adults, runners, strength athletes, and high-load professionals',
    requiredDevices: [{ productId: 'mhbot-st1700', role: 'primary' }],
    weeks: [
      {
        number: 1,
        title: 'Adaptation',
        days: [
          {
            number: 1,
            sessions: [
              {
                modality: 'mHBOT',
                duration: '45 min',
                parameters: '1.3 ATA, calm breathing cadence',
              },
            ],
          },
          {
            number: 3,
            sessions: [
              {
                modality: 'mHBOT',
                duration: '50 min',
                parameters: '1.3 ATA, hydration before and after',
              },
            ],
          },
          {
            number: 5,
            sessions: [
              {
                modality: 'mHBOT',
                duration: '55 min',
                parameters: '1.35 ATA, evening recovery window',
              },
            ],
          },
        ],
      },
      {
        number: 2,
        title: 'Consistency',
        days: [
          {
            number: 2,
            sessions: [
              {
                modality: 'mHBOT',
                duration: '60 min',
                parameters: '1.35 ATA, low-stimulus environment',
              },
            ],
          },
          {
            number: 4,
            sessions: [
              {
                modality: 'mHBOT',
                duration: '60 min',
                parameters: '1.4 ATA, recovery-focused breathing',
              },
            ],
          },
        ],
      },
    ],
    safetyNotes:
      'Increase pressure exposure gradually. Stop and decompress if ear or sinus discomfort appears. Hydrate well around sessions.',
    contraindications: ['Untreated pneumothorax', 'Acute ear pressure injury'],
    evidenceIds: ['ev-hbot-001', 'ev-hbot-002', 'ev-hbot-003'],
    relatedProtocolSlugs: ['vitality-dual-stack'],
    reviewer: {
      name: 'Hylono Research Review',
      credentials: 'Editorial review team',
    },
    version: '1.0.0',
  },
  {
    slug: 'stress-balance-h2-foundation',
    title: 'Stress Balance H2 Foundation',
    goal: 'Stress and clarity balance',
    goalTag: 'stress',
    difficulty: 'Beginner',
    durationWeeks: 4,
    timePerDay: '25–40 min',
    shortDescription:
      'A daily hydrogen routine designed to support calmer focus, smoother energy, and reduced post-workday fatigue load.',
    targetAudience: 'Knowledge workers, founders, shift workers, and travel-heavy professionals',
    requiredDevices: [{ productId: 'h2-hop450', role: 'primary' }],
    weeks: [
      {
        number: 1,
        title: 'Calibration',
        days: [
          {
            number: 1,
            sessions: [
              {
                modality: 'Hydrogen inhalation',
                duration: '20 min',
                parameters: '300–450 ml/min, seated breathing',
              },
              {
                modality: 'Hydrogen water',
                duration: '5 min prep',
                parameters: '>1200 ppb, one serving post-session',
              },
            ],
          },
          {
            number: 4,
            sessions: [
              {
                modality: 'Hydrogen inhalation',
                duration: '25 min',
                parameters: '450 ml/min, low-distraction setting',
              },
            ],
          },
        ],
      },
      {
        number: 2,
        title: 'Daily rhythm',
        days: [
          {
            number: 2,
            sessions: [
              {
                modality: 'Hydrogen inhalation',
                duration: '30 min',
                parameters: '450–600 ml/min, morning or early afternoon',
              },
            ],
          },
          {
            number: 5,
            sessions: [
              {
                modality: 'Hydrogen water',
                duration: '5 min prep',
                parameters: 'One serving pre-evening wind-down',
                note: 'Pair with reduced screen exposure.',
              },
            ],
          },
        ],
      },
    ],
    safetyNotes:
      'Use distilled or reverse-osmosis water only. Keep tubing and accessories clean and dry between sessions.',
    contraindications: ['Use specialist oversight in severe respiratory instability'],
    evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
    relatedProtocolSlugs: ['vitality-dual-stack'],
    reviewer: {
      name: 'Hylono Research Review',
      credentials: 'Editorial review team',
    },
    version: '1.0.0',
  },
  {
    slug: 'vitality-dual-stack',
    title: 'Vitality Dual Stack (mHBOT + H2)',
    goal: 'Whole-system vitality',
    goalTag: 'vitality',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    timePerDay: '60–95 min',
    shortDescription:
      'A structured dual-modality stack combining oxygen pressure and hydrogen sessions to support recovery consistency and daily vitality.',
    targetAudience: 'Committed users seeking a protocol-first home wellness routine',
    requiredDevices: [
      { productId: 'mhbot-st1700', role: 'primary' },
      { productId: 'h2-hop450', role: 'supplementary' },
    ],
    weeks: [
      {
        number: 1,
        title: 'Stack onboarding',
        days: [
          {
            number: 1,
            sessions: [
              {
                modality: 'mHBOT',
                duration: '50 min',
                parameters: '1.3 ATA, low-stimulus session',
              },
              {
                modality: 'Hydrogen inhalation',
                duration: '20 min',
                parameters: '300–450 ml/min after decompression',
              },
            ],
          },
          {
            number: 3,
            sessions: [
              {
                modality: 'Hydrogen water',
                duration: '5 min prep',
                parameters: '>1200 ppb, morning serving',
              },
            ],
          },
        ],
      },
      {
        number: 3,
        title: 'Stack consolidation',
        days: [
          {
            number: 2,
            sessions: [
              {
                modality: 'mHBOT',
                duration: '60 min',
                parameters: '1.35–1.4 ATA, recovery day',
              },
              {
                modality: 'Hydrogen inhalation',
                duration: '25 min',
                parameters: '450–600 ml/min, post-session calm window',
              },
            ],
          },
          {
            number: 5,
            sessions: [
              {
                modality: 'Hydrogen water',
                duration: '5 min prep',
                parameters: 'One serving after evening meal',
              },
            ],
          },
        ],
      },
    ],
    safetyNotes:
      'Keep intensity progression conservative in first two weeks. Prioritize consistent sleep and hydration to stabilize adaptation.',
    contraindications: ['Untreated pneumothorax', 'Acute pressure-related ENT symptoms'],
    evidenceIds: ['ev-hbot-001', 'ev-h2-001', 'ev-combo-001'],
    relatedProtocolSlugs: ['recovery-oxygen-foundation', 'stress-balance-h2-foundation'],
    reviewer: {
      name: 'Hylono Research Review',
      credentials: 'Editorial review team',
    },
    version: '1.0.0',
  },
];

export const protocolBySlug = protocols.reduce<Record<string, Protocol>>((acc, item) => {
  acc[item.slug] = item;
  return acc;
}, {});
