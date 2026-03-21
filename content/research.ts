export type ResearchModality = 'HBOT' | 'H2';
export type ResearchStudyType = 'RCT' | 'Meta-analysis' | 'Review' | 'Cohort';

export interface ResearchStudyCard {
  id: string;
  title: string;
  modality: ResearchModality;
  studyType: ResearchStudyType;
  population: string;
  summary: string;
  year: number;
  doi?: string;
  url: string;
}

export const researchContent = {
  title: 'Scientific research library',
  subtitle:
    'Explore selected peer-reviewed sources related to the technologies used in Hylono protocols. References are provided for educational review and limitations should be considered.',
  technologyFilters: ['All', 'HBOT', 'H2'] as const,
  studyTypeFilters: ['All', 'RCT', 'Meta-analysis', 'Review', 'Cohort'] as const,
  emptyState: 'No studies match your selected filters yet.',
  productCtaLabel: 'View related product hub',
  protocolCtaLabel: 'Browse protocols',
  disclaimer:
    'Research references are provided for educational purposes and should not be interpreted as personalized professional advice. They are intended to support evidence review rather than disease-management decisions.',
  studies: [
    {
      id: 'study-hbot-athletes-2022',
      title:
        'Effects of Hyperbaric Oxygen Therapy on Mitochondrial Respiration and Physical Performance in Middle-Aged Athletes: A Blinded, Randomized Controlled Trial',
      modality: 'HBOT',
      studyType: 'RCT',
      population: 'Healthy master athletes in a blinded randomized trial',
      summary:
        'HBOT improved VO2 max, ventilatory threshold, and mitochondrial markers versus sham in this study population. Findings are performance-focused and may not generalize to every wellness use case.',
      year: 2022,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8825926/',
    },
    {
      id: 'study-h2-fatigue-2023',
      title:
        'Effects of molecular hydrogen supplementation on fatigue and aerobic capacity in healthy adults: A systematic review and meta-analysis',
      modality: 'H2',
      studyType: 'Meta-analysis',
      population: 'Systematic review and meta-analysis of healthy-adult studies',
      summary:
        'The review reported supportive effects on fatigue and aerobic-capacity outcomes, while also noting protocol heterogeneity and a limited evidence base.',
      year: 2023,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9934906/',
    },
    {
      id: 'study-hbot-soreness-2025',
      title:
        'Effects of Hyperbaric Oxygen Therapy on Exercise-Induced Muscle Injury and Soreness: A Systematic Review and Meta-analysis',
      modality: 'HBOT',
      studyType: 'Meta-analysis',
      population: 'Randomized controlled trials on exercise-induced muscle injury and soreness',
      summary:
        'This review suggests hyperbaric oxygen may improve some post-exercise soreness and injury markers, but the underlying trials vary in quality and intervention design.',
      year: 2025,
      url: 'https://pubmed.ncbi.nlm.nih.gov/40784513/',
    },
    {
      id: 'study-h2-fatigue-review-2021',
      title: 'Molecular Hydrogen as a Potential Treatment for Acute and Chronic Fatigue',
      modality: 'H2',
      studyType: 'Review',
      population: 'Narrative review covering fatigue-related literature',
      summary:
        'The review summarizes early fatigue-related hydrogen literature and highlights the need for more rigorous clinical research before broad claims can be made.',
      year: 2021,
      url: 'https://pubmed.ncbi.nlm.nih.gov/34202646/',
    },
  ] as ResearchStudyCard[],
} as const;
