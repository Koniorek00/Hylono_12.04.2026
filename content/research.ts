import { evidence } from './evidence';

export type ResearchModality = 'HBOT' | 'H2';
export type ResearchStudyType = 'RCT' | 'Meta-analysis' | 'Review' | 'Cohort';

export interface ResearchStudyCard {
  id: string;
  evidenceId: string;
  title: string;
  modality: ResearchModality;
  studyType: ResearchStudyType;
  population: string;
  summary: string;
  year: number;
  authors: string;
  publication: string;
  primaryEndpoint: string;
  sampleSize?: number;
  doi?: string;
  url: string;
}

interface ResearchStudySelection {
  evidenceId: string;
  modality: ResearchModality;
  population: string;
}

const curatedStudySelections: ResearchStudySelection[] = [
  {
    evidenceId: 'ev-hbot-003',
    modality: 'HBOT',
    population: 'Adults with chronic post-mTBI symptoms in a randomized sleep-assessment trial',
  },
  {
    evidenceId: 'ev-hbot-002',
    modality: 'HBOT',
    population: 'Randomized controlled trials on exercise-induced muscle injury and soreness',
  },
  {
    evidenceId: 'ev-h2-002',
    modality: 'H2',
    population:
      'Patients with chronic complications of cancer treatment in a modified hydrogen-oxygen breathing trial',
  },
  {
    evidenceId: 'ev-h2-001',
    modality: 'H2',
    population: 'Systematic review and meta-analysis of healthy-adult studies',
  },
  {
    evidenceId: 'ev-hbot-001',
    modality: 'HBOT',
    population: 'Healthy master athletes in a blinded randomized trial',
  },
  {
    evidenceId: 'ev-h2-003',
    modality: 'H2',
    population: 'Narrative review covering fatigue-related literature',
  },
];

const studies: ResearchStudyCard[] = curatedStudySelections
  .map((selection) => {
    const source = evidence.find((item) => item.id === selection.evidenceId);

    if (!source) {
      throw new Error(`Missing research evidence record: ${selection.evidenceId}`);
    }

    return {
      id: source.id,
      evidenceId: source.id,
      title: source.title,
      modality: selection.modality,
      studyType: source.studyType as ResearchStudyType,
      population: selection.population,
      summary: source.resultSummary,
      year: source.year,
      authors: source.authors,
      publication: source.publication,
      primaryEndpoint: source.primaryEndpoint,
      sampleSize: source.sampleSize,
      doi: source.doi,
      url: source.sourceUrl,
    };
  })
  .sort((left, right) => right.year - left.year || left.title.localeCompare(right.title));

export const researchContent = {
  title: 'Scientific research library',
  subtitle:
    'Explore the current public canonical evidence records related to the technologies used in Hylono protocols. References are provided for educational review and limitations should be considered.',
  technologyFilters: ['All', 'HBOT', 'H2'] as const,
  studyTypeFilters: ['All', 'RCT', 'Meta-analysis', 'Review', 'Cohort'] as const,
  emptyState: 'No studies match the current public evidence scope yet.',
  productCtaLabel: 'View related product hub',
  protocolCtaLabel: 'Browse protocols',
  curationTitle: 'How coverage is governed',
  selectionPolicy:
    'This page publishes the full current public set of canonical Hylono evidence records for HBOT and hydrogen. Entries are shown when they connect directly to live product, condition, and protocol routes.',
  scopeNote:
    'Modality coverage follows canonical evidence availability, not merchandising preference. HBOT and hydrogen appear here because they have approved canonical evidence records today. Additional modalities should only be added after verified records exist in the shared evidence source.',
  sortLabel: 'Selected entries are ordered by publication year, newest first.',
  disclaimer:
    'Research references are provided for educational purposes and should not be interpreted as personalized professional advice. They are intended to support evidence review rather than disease-management decisions.',
  canonicalStudyCount: evidence.length,
  studies,
} as const;
