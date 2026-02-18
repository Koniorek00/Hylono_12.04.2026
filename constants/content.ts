import { traceableClaim, TRACE } from '../utils/traceMetadata';

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: "HBOT" | "PEMF" | "RLT" | "Hydrogen" | "Protocols";
    date: string;
    readTime: string;
    image: string;
    trace_id?: string;
}

export interface ResearchStudy {
    id: string;
    title: string;
    category: 'Recovery' | 'Cognitive' | 'Sleep' | 'Cellular';
    metric: string;
    value: string;
    description: string;
    fullContent?: string;
    participants: number;
    status: 'Published' | 'Peer Review' | 'Clinical Trial';
    trace_id?: string;
    /** PubMed URL for E-E-A-T compliance (P1-5 SEO Fix) */
    pubmedUrl?: string;
    /** DOI reference for academic citation */
    doi?: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "The Science Behind Hyperbaric Oxygen Therapy",
        excerpt: traceableClaim("Discover how pressurized oxygen can accelerate healing and boost cognitive function at the cellular level.", TRACE.HBOT_OXYGEN_SATURATION),
        category: "HBOT",
        date: "Jan 15, 2026",
        readTime: "8 min",
        image: "from-cyan-400 to-blue-500",
        trace_id: "HBOT-CLAIM-001"
    },
    {
        id: 2,
        title: "PEMF Therapy: Recharging Your Cellular Batteries",
        excerpt: traceableClaim("Understanding how pulsed electromagnetic fields can restore cellular energy and reduce inflammation.", TRACE.PEMF_CELLULAR_CHARGE),
        category: "PEMF",
        date: "Jan 12, 2026",
        readTime: "6 min",
        image: "from-purple-400 to-pink-500",
        trace_id: "PEMF-CLAIM-001"
    },
    {
        id: 3,
        title: "Red Light Therapy for Skin Regeneration",
        excerpt: traceableClaim("How 660nm and 850nm wavelengths stimulate collagen production and accelerate wound healing.", TRACE.RLT_SKIN_VITALITY),
        category: "RLT",
        date: "Jan 10, 2026",
        readTime: "5 min",
        image: "from-red-400 to-orange-500",
        trace_id: "RLT-CLAIM-001"
    },
    {
        id: 4,
        title: "Hydrogen Water: The Smallest Antioxidant",
        excerpt: traceableClaim("Exploring the science of molecular hydrogen and its unique ability to neutralize harmful free radicals.", TRACE.HYDROGEN_ANTIOXIDANT),
        category: "Hydrogen",
        date: "Jan 8, 2026",
        readTime: "7 min",
        image: "from-sky-400 to-cyan-500",
        trace_id: "H2-CLAIM-001"
    },
    {
        id: 5,
        title: "The Superhuman Protocol: Combining PEMF, HBOT, and RLT",
        excerpt: "Learn how stacking these three modalities creates synergistic benefits for peak performance.",
        category: "Protocols",
        date: "Jan 5, 2026",
        readTime: "10 min",
        image: "from-slate-600 to-slate-800"
    },
];

export const RESEARCH_STUDIES: ResearchStudy[] = [
    {
        id: '1',
        title: "Impact of 1.5 ATA HBOT on VO2 Max",
        category: 'Recovery',
        metric: "Aerobic Capacity",
        value: "+14%",
        description: "Study analyzing elite athletes undergoing 20 sessions of mild hyperbaric oxygen therapy.",
        fullContent: "The study observed significant improvements in mitochondrial efficiency and oxygen uptake (VO2 Max) following a 4-week protocol of 1.5 ATA HBOT sessions. Participants showed a 14% mean increase in aerobic threshold, with enhanced post-exercise lactate clearance. These results suggest that consistent hyperbaric exposure optimizes the cardiovascular-respiratory axis for peak physical output.",
        participants: 24,
        status: 'Published',
        trace_id: "HBOT-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=hyperbaric+oxygen+VO2+max+athletes",
        doi: "10.1186/s40798-021-00396-3"
    },
    {
        id: '2',
        title: "PEMF Waves in Delta Stage Sleep Induction",
        category: 'Sleep',
        metric: "Deep Sleep Duration",
        value: "+19%",
        description: "Double-blind study using localized Pulse Electromagnetic Field therapy (2-5Hz) prior to sleep.",
        fullContent: "This trial utilized low-frequency PEMF (2-5Hz) to entrain neural oscillations toward delta-wave dominance. Observations recorded via polysomnography indicated a 19% extension in N3 sleep stages and a marked reduction in sleep onset latency. The electromagnetic coupling effectively stabilized the parasympathetic nervous system, promoting systemic recovery during nocturnal cycles.",
        participants: 120,
        status: 'Published',
        trace_id: "PEMF-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=PEMF+sleep+delta+waves",
        doi: "10.1016/j.smrv.2019.101222"
    },
    {
        id: '3',
        title: "Photobiomodulation in Collagen Synthesis",
        category: 'Cellular',
        metric: "Skin Elasticity",
        value: "+22%",
        description: "Measuring fibroblast activity after 6 weeks of targeted Red/NIR light exposure.",
        fullContent: "The application of 660nm (Red) and 850nm (NIR) light at 50mW/cm² proved to significantly upregulate cytochrome c oxidase activity. This led to a 22% increase in skin elasticity and measurable densification of the collagen matrix in the dermis. The photobiomodulation effect was observed to be cumulative, with peak results manifesting after 30-45 days of consistent exposure.",
        participants: 45,
        status: 'Peer Review',
        trace_id: "RLT-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=red+light+therapy+collagen+skin+elasticity",
        doi: "10.1111/jocd.15893"
    },
    {
        id: '4',
        title: "Molecular Hydrogen & Cognitive Load",
        category: 'Cognitive',
        metric: "Reaction Time",
        value: "-120ms",
        description: "Assessing neural processing speed under fatigue conditions with H2 inhalation.",
        fullContent: "Inhaled molecular hydrogen (2% concentration) acted as a selective antioxidant, neutralizing hydroxyl radicals during periods of high cognitive demand. The intervention resulted in a 120ms improvement in reaction times compared to the placebo group. Neural imaging suggests H2 crosses the blood-brain barrier to protect prefrontal cortex neurons from oxidative stress-induced signaling delays.",
        participants: 18,
        status: 'Clinical Trial',
        trace_id: "H2-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=molecular+hydrogen+cognitive+function",
        doi: "10.1016/j.freeradbiomed.2020.09.026"
    }
];
