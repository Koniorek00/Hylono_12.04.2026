export const goalModalityRelevance: Record<string, Record<string, number>> = {
  recovery: { HBOT: 5, RLT_NIR: 4, H2: 3, PEMF: 3 },
  sleep: { PEMF: 5, RLT_NIR: 3, H2: 3, HBOT: 2 },
  stress: { PEMF: 4, H2: 4, HBOT: 3, RLT_NIR: 2 },
  comfort: { RLT_NIR: 5, H2: 4, HBOT: 4, PEMF: 2 },
  vitality: { HBOT: 4, H2: 4, RLT_NIR: 3, PEMF: 3 },
};

export const modalityLabels: Record<string, string> = {
  HBOT: 'HBOT',
  H2: 'H2',
  RLT_NIR: 'RLT',
  PEMF: 'PEMF',
};

export const synergies = [
  {
    pair: ['HBOT', 'H2'],
    bonus: 2,
    description:
      'Oxygen and hydrogen work complementarily. Combining these technologies may enhance recovery benefits.',
  },
  {
    pair: ['RLT_NIR', 'PEMF'],
    bonus: 1,
    description:
      'Light and electromagnetic fields are two non-invasive modalities that can complement each other in daily routines.',
  },
  {
    pair: ['HBOT', 'RLT_NIR'],
    bonus: 1,
    description:
      'Improved tissue oxygenation may support photobiomodulation effects for recovery-focused protocols.',
  },
] as const;

export const operationalNotes = [
  {
    pair: ['HBOT', 'RLT_NIR'],
    note: 'Do not use the RLT panel inside the hyperbaric chamber.',
  },
] as const;
