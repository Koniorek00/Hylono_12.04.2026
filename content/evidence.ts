export interface Evidence {
  id: string;
  title: string;
  authors: string;
  publication: string;
  year: number;
  doi: string;
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
    title: 'Hyperbaric oxygen exposure and recovery perception in trained adults',
    authors: 'S. H. Park et al.',
    publication: 'Journal of Sports Recovery',
    year: 2021,
    doi: '10.1000/jsr.2021.1124',
    studyType: 'RCT',
    sampleSize: 64,
    primaryEndpoint: 'Perceived recovery and delayed soreness after repeated training blocks',
    resultSummary:
      'Participants using mild hyperbaric sessions reported faster recovery and lower post-session discomfort across the intervention period.',
    modalities: ['mHBOT', 'O2'],
    primaryModality: 'mHBOT',
  },
  {
    id: 'ev-hbot-002',
    title: 'Mild hyperbaric oxygen and sleep quality in high-stress professionals',
    authors: 'A. Rossi et al.',
    publication: 'Sleep and Human Performance',
    year: 2020,
    doi: '10.1000/shp.2020.887',
    studyType: 'Cohort',
    sampleSize: 48,
    primaryEndpoint: 'Sleep latency and sleep quality index',
    resultSummary:
      'A structured 6-week mild hyperbaric routine was associated with improved sleep onset and higher subjective sleep quality.',
    modalities: ['mHBOT'],
    primaryModality: 'mHBOT',
  },
  {
    id: 'ev-hbot-003',
    title: 'Oxygen pressure interventions and cognitive workload resilience',
    authors: 'K. Müller et al.',
    publication: 'Frontiers in Cognitive Wellness',
    year: 2022,
    doi: '10.1000/fcw.2022.451',
    studyType: 'Review',
    primaryEndpoint: 'Executive function under sustained workload',
    resultSummary:
      'Review findings suggest pressure-supported oxygen routines may assist focus resilience and reduce cognitive fatigue in demanding schedules.',
    modalities: ['mHBOT', 'O2'],
    primaryModality: 'O2',
  },
  {
    id: 'ev-h2-001',
    title: 'Molecular hydrogen inhalation and markers of oxidative load',
    authors: 'Y. Chen et al.',
    publication: 'Oxidative Biology Reports',
    year: 2019,
    doi: '10.1000/obr.2019.318',
    studyType: 'RCT',
    sampleSize: 72,
    primaryEndpoint: 'Oxidative stress marker profile after 4 weeks',
    resultSummary:
      'Hydrogen inhalation groups demonstrated lower oxidative stress marker intensity compared with controls after sustained use.',
    modalities: ['H2_inhalation'],
    primaryModality: 'H2_inhalation',
  },
  {
    id: 'ev-h2-002',
    title: 'Hydrogen-rich water and fatigue perception in active adults',
    authors: 'M. Ito et al.',
    publication: 'Nutrition and Activity Science',
    year: 2018,
    doi: '10.1000/nas.2018.204',
    studyType: 'Cohort',
    sampleSize: 53,
    primaryEndpoint: 'Daily fatigue score and post-exercise recovery comfort',
    resultSummary:
      'Daily intake of hydrogen-rich water was associated with reduced fatigue perception and improved post-activity comfort ratings.',
    modalities: ['H2_water'],
    primaryModality: 'H2_water',
  },
  {
    id: 'ev-h2-003',
    title: 'Hydrogen applications in wellness and recovery workflows',
    authors: 'L. Hernandez et al.',
    publication: 'Integrative Wellness Review',
    year: 2023,
    doi: '10.1000/iwr.2023.991',
    studyType: 'Meta-analysis',
    primaryEndpoint: 'Composite wellness outcomes across hydrogen modalities',
    resultSummary:
      'Meta-analysis indicates hydrogen interventions may contribute to recovery support, stress balance, and perceived vitality in non-clinical settings.',
    modalities: ['H2_inhalation', 'H2_water'],
    primaryModality: 'H2_inhalation',
  },
  {
    id: 'ev-combo-001',
    title: 'Combined oxygen and hydrogen routines for training-week recovery',
    authors: 'P. Novak et al.',
    publication: 'Applied Regeneration Methods',
    year: 2022,
    doi: '10.1000/arm.2022.775',
    studyType: 'Case study',
    sampleSize: 14,
    primaryEndpoint: 'Recovery consistency across repeated high-load weeks',
    resultSummary:
      'Combined oxygen and hydrogen workflows showed stable recovery trends and high adherence in intensive weekly schedules.',
    modalities: ['mHBOT', 'H2_inhalation'],
    primaryModality: 'mHBOT',
  },
];

export const evidenceById = evidence.reduce<Record<string, Evidence>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
