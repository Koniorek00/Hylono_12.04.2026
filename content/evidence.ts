export interface Evidence {
  id: string;
  title: string;
  authors: string;
  publication: string;
  year: number;
  doi?: string;
  sourceUrl: string;
  studyType: 'RCT' | 'Meta-analysis' | 'Review' | 'Cohort' | 'Case study' | 'In vitro';
  sampleSize?: number;
  primaryEndpoint: string;
  resultSummary: string;
  modalities: string[];
  primaryModality: string;
}

export const evidence: Evidence[] = [
  {
    id: 'ev-hbot-001',
    title:
      'Effects of Hyperbaric Oxygen Therapy on Mitochondrial Respiration and Physical Performance in Middle-Aged Athletes: A Blinded, Randomized Controlled Trial',
    authors: 'Harpaz D et al.',
    publication: 'Aging',
    year: 2022,
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8825926/',
    studyType: 'RCT',
    sampleSize: 37,
    primaryEndpoint: 'Physical performance and mitochondrial respiration in middle-aged athletes',
    resultSummary:
      'In this blinded randomized trial, HBOT improved VO2 max, ventilatory threshold, and selected mitochondrial markers versus sham. The population was performance-oriented, so general wellness applicability should be judged cautiously.',
    modalities: ['HBOT', 'O2'],
    primaryModality: 'HBOT',
  },
  {
    id: 'ev-hbot-002',
    title:
      'Effects of Hyperbaric Oxygen Therapy on Exercise-Induced Muscle Injury and Soreness: A Systematic Review and Meta-analysis',
    authors: 'Ma T et al.',
    publication: 'Sports Medicine - Open',
    year: 2025,
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/40784513/',
    studyType: 'Meta-analysis',
    primaryEndpoint: 'Exercise-induced muscle injury and soreness outcomes across randomized trials',
    resultSummary:
      'The meta-analysis suggests hyperbaric oxygen may improve some post-exercise soreness and muscle-injury markers, but trial quality and intervention design vary substantially.',
    modalities: ['HBOT', 'O2'],
    primaryModality: 'HBOT',
  },
  {
    id: 'ev-hbot-003',
    title:
      'Sleep assessment in a randomized trial of hyperbaric oxygen therapy for chronic symptoms after mild traumatic brain injury',
    authors: 'Roden-Foreman K et al.',
    publication: 'Undersea & Hyperbaric Medicine',
    year: 2018,
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/29661043/',
    studyType: 'RCT',
    primaryEndpoint: 'Self-reported sleep quality after HBOT in chronic post-mTBI symptoms',
    resultSummary:
      'This randomized trial reported improvement in some self-reported sleep-quality measures after HBOT, but it studied a chronic post-mTBI population and not general wellness users.',
    modalities: ['HBOT', 'O2'],
    primaryModality: 'HBOT',
  },
  {
    id: 'ev-h2-001',
    title:
      'Effects of molecular hydrogen supplementation on fatigue and aerobic capacity in healthy adults: A systematic review and meta-analysis',
    authors: 'Nogueira J et al.',
    publication: 'Clinical Nutrition ESPEN',
    year: 2023,
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9934906/',
    studyType: 'Meta-analysis',
    primaryEndpoint: 'Fatigue and aerobic-capacity outcomes in healthy adults',
    resultSummary:
      'The review reported supportive effects on fatigue and aerobic-capacity outcomes in healthy adults, while also noting protocol heterogeneity and a limited evidence base.',
    modalities: ['H2_inhalation', 'H2_water'],
    primaryModality: 'H2_inhalation',
  },
  {
    id: 'ev-h2-002',
    title:
      'Modified hydrogen-oxygen breathing and respiratory function, exercise capacity, sleep disorders, and mood disorders in patients with chronic complications of cancer treatment',
    authors: 'Li X et al.',
    publication: 'Medical Gas Research',
    year: 2025,
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12391262/',
    studyType: 'RCT',
    primaryEndpoint: 'Sleep and mood outcomes in patients with chronic post-treatment complications',
    resultSummary:
      'This trial reported improvements in several patient-reported outcomes after modified hydrogen-oxygen breathing, but the population was highly specific and not directly representative of general wellness use.',
    modalities: ['H2_inhalation'],
    primaryModality: 'H2_inhalation',
  },
  {
    id: 'ev-h2-003',
    title: 'Molecular Hydrogen as a Potential Treatment for Acute and Chronic Fatigue',
    authors: 'LeBaron T et al.',
    publication: 'Frontiers in Medicine',
    year: 2021,
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/34202646/',
    studyType: 'Review',
    primaryEndpoint: 'Mechanistic and early clinical evidence related to fatigue',
    resultSummary:
      'The review summarizes early fatigue-related hydrogen literature and argues that more rigorous clinical research is needed before broad claims can be made.',
    modalities: ['H2_inhalation', 'H2_water'],
    primaryModality: 'H2_inhalation',
  },
];

export const evidenceById = evidence.reduce<Record<string, Evidence>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
