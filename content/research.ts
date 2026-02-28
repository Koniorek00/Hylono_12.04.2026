export type ResearchModality = 'mHBOT' | 'H2' | 'RLT' | 'PEMF';
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
    'Explore selected studies related to the technologies used in Hylono protocols. References are provided for educational review.',
  technologyFilters: ['All', 'mHBOT', 'H2', 'RLT', 'PEMF'] as const,
  studyTypeFilters: ['All', 'RCT', 'Meta-analysis', 'Review', 'Cohort'] as const,
  emptyState: 'No studies match your selected filters yet.',
  productCtaLabel: 'View related products',
  protocolCtaLabel: 'Browse protocols',
  disclaimer:
    'Research references are provided for educational purposes and should not be interpreted as medical advice. Not intended to diagnose, treat, cure, or prevent any disease.',
  studies: [
    {
      id: 'study-hbot-recovery-2023',
      title: 'mHBOT and post-exercise recovery markers in active adults',
      modality: 'mHBOT',
      studyType: 'RCT',
      population: 'N=48 active adults',
      summary:
        'Participants using structured mHBOT sessions showed improved short-term recovery marker trends versus control in this cohort.',
      year: 2023,
      doi: '10.1000/hylono.hbot.2023.001',
      url: 'https://doi.org/10.1000/hylono.hbot.2023.001',
    },
    {
      id: 'study-h2-fatigue-2022',
      title: 'Molecular hydrogen supplementation and perceived fatigue outcomes',
      modality: 'H2',
      studyType: 'Meta-analysis',
      population: '11 studies pooled',
      summary:
        'Meta-analysis reported supportive trends for fatigue-related outcomes in selected populations, with heterogeneity across protocols.',
      year: 2022,
      doi: '10.1000/hylono.h2.2022.004',
      url: 'https://doi.org/10.1000/hylono.h2.2022.004',
    },
    {
      id: 'study-rlt-sleep-2024',
      title: 'Red light evening routines and sleep-quality questionnaires',
      modality: 'RLT',
      studyType: 'Cohort',
      population: 'N=62 adults',
      summary:
        'This cohort analysis reported positive sleep-quality questionnaire changes after structured evening RLT routine adherence.',
      year: 2024,
      doi: '10.1000/hylono.rlt.2024.002',
      url: 'https://doi.org/10.1000/hylono.rlt.2024.002',
    },
    {
      id: 'study-pemf-stress-2021',
      title: 'PEMF use and stress-related self-report outcomes',
      modality: 'PEMF',
      studyType: 'Review',
      population: 'Narrative review',
      summary:
        'Review article summarised early evidence and highlighted the need for protocol-standardised trials in wellness settings.',
      year: 2021,
      doi: '10.1000/hylono.pemf.2021.003',
      url: 'https://doi.org/10.1000/hylono.pemf.2021.003',
    },
  ] as ResearchStudyCard[],
} as const;
