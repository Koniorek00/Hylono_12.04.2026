import { TechType } from '../../../types';

export const RESULT_TIMELINES: Record<
  TechType,
  Array<{ phase: string; timeframe: string; outcomes: string[] }>
> = {
  [TechType.HBOT]: [
    {
      phase: 'Early Response',
      timeframe: 'Week 1–2',
      outcomes: ['Improved sleep depth', 'Morning energy shift', 'Reduced brain fog'],
    },
    {
      phase: 'Adaptation',
      timeframe: 'Month 1',
      outcomes: [
        'Measurable recovery speed',
        'Post-workout soreness reduced by 40–60%',
        'Cognitive clarity improvements',
      ],
    },
    {
      phase: 'Cumulative',
      timeframe: 'Month 3+',
      outcomes: ['Neurological resilience', 'Immune system optimization', 'Tissue regeneration markers'],
    },
  ],
  [TechType.PEMF]: [
    {
      phase: 'Immediate',
      timeframe: 'Session 1–3',
      outcomes: ['Tension release and relaxation', 'Improved sleep onset', 'Stress reduction'],
    },
    {
      phase: 'Consistent',
      timeframe: 'Week 2–4',
      outcomes: ['Better deep sleep architecture', 'Decreased muscle soreness', 'Energy stabilization'],
    },
    {
      phase: 'Optimized',
      timeframe: 'Month 2+',
      outcomes: ['Chronic stress load reduction', 'Cellular voltage normalized', 'Circulatory improvements'],
    },
  ],
  [TechType.RLT]: [
    {
      phase: 'Visible',
      timeframe: 'Week 2–3',
      outcomes: ['Improved skin texture and tone', 'Subtle radiance increase', 'Muscle recovery acceleration'],
    },
    {
      phase: 'Structural',
      timeframe: 'Month 1',
      outcomes: ['Reduced fine lines', 'Collagen density increase', 'Inflammation markers reduced'],
    },
    {
      phase: 'Long-Term',
      timeframe: 'Month 3+',
      outcomes: ['Cumulative collagen synthesis', 'Circadian rhythm optimization', 'Mitochondrial density increase'],
    },
  ],
  [TechType.HYDROGEN]: [
    {
      phase: 'Within Session',
      timeframe: 'First 30 min',
      outcomes: ['Mental clarity lift', 'Reduced brain fog', 'Antioxidant protection onset'],
    },
    {
      phase: 'Daily Use',
      timeframe: 'Week 1–2',
      outcomes: ['Consistent energy levels', 'Faster cognitive recovery', 'Improved focus duration'],
    },
    {
      phase: 'Systemic',
      timeframe: 'Month 1+',
      outcomes: ['Systemic oxidative load reduction', 'Metabolic vitality markers', 'Nrf2 pathway upregulation'],
    },
  ],
  [TechType.EWOT]: [
    {
      phase: 'Immediate',
      timeframe: 'First Session',
      outcomes: ['Post-exercise energy lift', 'Reduced breathlessness', 'Improved recovery speed'],
    },
    {
      phase: 'Building',
      timeframe: 'Week 2–4',
      outcomes: ['Noticeable aerobic endurance gains', 'Reduced post-workout fatigue', 'Mental clarity improvement'],
    },
    {
      phase: 'Adaptive',
      timeframe: 'Month 2+',
      outcomes: ['Measurable VO2 Max improvement', 'Microcirculatory restoration', 'Sustained energy baseline elevation'],
    },
  ],
  [TechType.SAUNA_BLANKET]: [
    {
      phase: 'Immediate',
      timeframe: 'First Session',
      outcomes: ['Deep muscular relaxation', 'Tension release', 'Warmth and calm throughout body'],
    },
    {
      phase: 'Consistent',
      timeframe: 'Week 1–3',
      outcomes: ['Improved sleep quality', 'Reduced post-exercise soreness', 'Skin radiance improvement'],
    },
    {
      phase: 'Systemic',
      timeframe: 'Month 1+',
      outcomes: ['Cardiovascular conditioning markers', 'Heat adaptation and stress resilience', 'Sustained metabolic clearance support'],
    },
  ],
  [TechType.EMS]: [
    {
      phase: 'Activation',
      timeframe: 'Session 1–2',
      outcomes: ['Novel muscle fatigue sensation (normal)', 'Deep muscle engagement felt', 'Full-body activation confirmed'],
    },
    {
      phase: 'Adaptation',
      timeframe: 'Week 2–4',
      outcomes: ['Strength and tone improvement', 'Reduced soreness duration', 'Posture and stability gains'],
    },
    {
      phase: 'Performance',
      timeframe: 'Month 2+',
      outcomes: ['Measurable muscle density increase', 'Metabolic rate elevation', 'Athletic performance enhancement'],
    },
  ],
  [TechType.VNS]: [
    {
      phase: 'Within Session',
      timeframe: 'First Use',
      outcomes: ['Perceptible calm and relaxation', 'Reduced mental chatter', 'Heart rate deceleration'],
    },
    {
      phase: 'Regular Use',
      timeframe: 'Week 1–3',
      outcomes: ['Improved HRV baseline', 'Faster sleep onset', 'Reduced stress reactivity'],
    },
    {
      phase: 'Resilience',
      timeframe: 'Month 2+',
      outcomes: ['Sustained autonomic flexibility', 'Reduced inflammatory load markers', 'Emotional baseline stabilization'],
    },
  ],
  [TechType.HYPOXIC]: [
    {
      phase: 'Signaling',
      timeframe: '48–72 hrs post-session',
      outcomes: ['EPO response initiated', 'Initial altitude adaptation discomfort normalizes', 'Aerobic threshold awareness sharpens'],
    },
    {
      phase: 'Hematological',
      timeframe: 'Week 3–6',
      outcomes: ['Hemoglobin mass increase', 'VO2 Max measurably improved', 'Cardiovascular efficiency gains'],
    },
    {
      phase: 'Peak Adaptation',
      timeframe: 'Month 2+',
      outcomes: [
        'Supports mitochondrial adaptation pathways',
        'Elite-level endurance baseline support',
        'May assist long-term aerobic capacity development',
      ],
    },
  ],
  [TechType.CRYO]: [
    {
      phase: 'Immediate',
      timeframe: 'Within 30 min',
      outcomes: [
        'Norepinephrine surge and mood lift',
        'May support short-term inflammation balance',
        'May assist comfort support within hours for some users',
      ],
    },
    {
      phase: 'Recovery',
      timeframe: 'Session 2–5',
      outcomes: ['Significantly reduced DOMS', 'Training load tolerance increase', 'Consistent energy post-session'],
    },
    {
      phase: 'Chronic',
      timeframe: 'Month 1+',
      outcomes: ['Sustained inflammation control', 'Cold adaptation and resilience', 'Mood and stress baseline improvement'],
    },
  ],
};