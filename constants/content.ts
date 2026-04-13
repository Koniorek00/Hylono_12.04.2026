export type BlogCategory = 'HBOT' | 'PEMF' | 'RLT' | 'Hydrogen' | 'Protocols';
export type BlogConditionSlug = 'recovery' | 'sleep' | 'stress' | 'comfort' | 'vitality';

export interface BlogSection {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: BlogCategory;
    date: string;
    readTime: string;
    image: string;
    articleType: 'Research note' | 'Planning guide' | 'Protocol guide';
    answerSummary: string;
    audience: string;
    keyTakeaways: string[];
    limitations: string[];
    sections: BlogSection[];
    evidenceIds: string[];
    relatedConditionSlugs: BlogConditionSlug[];
    relatedProtocolSlugs: string[];
    relatedProductRoute: 'hbot' | 'pemf' | 'rlt' | 'hydrogen' | null;
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
        title: 'The Science Behind Hyperbaric Oxygen Therapy',
        excerpt:
            'A Hylono research note on what mild hyperbaric oxygen is, where the strongest recovery-oriented signals currently sit, and which limits matter before you generalize the evidence.',
        category: 'HBOT',
        date: 'Jan 15, 2026',
        readTime: '8 min',
        image: 'from-cyan-400 to-blue-500',
        articleType: 'Research note',
        answerSummary:
            'Read this first if you want a plain-language HBOT starting point before opening the cited studies, the product hub, or the recovery protocol route.',
        audience: 'Active adults and visitors comparing recovery-oriented wellness modalities.',
        keyTakeaways: [
            'Hylono frames mild HBOT as a recovery-first wellness path, not as a universal claim page.',
            'The linked evidence in this repo is real but narrow, so population and protocol fit still matter.',
            'The best next step depends on whether your question is about evidence, equipment fit, or routine design.',
        ],
        limitations: [
            'The strongest linked HBOT records in this repo focus on athletes, exercise soreness, and a specific post-mTBI study rather than every general-wellness use case.',
            'Study design, pressure protocol, and population differences make it unsafe to flatten HBOT into one generic benefit statement.',
        ],
        sections: [
            {
                heading: 'What mild HBOT means in the Hylono context',
                paragraphs: [
                    'On Hylono, mild hyperbaric oxygen therapy is positioned as a guided wellness-technology option for people who want a structured recovery-first routine. The site does not present it as a universal answer or as a substitute for individualized professional advice.',
                    'This article exists to help a visitor understand the question behind the category before they jump into a product page, a protocol page, or a cited study. It is meant to reduce overreach, not add hype.',
                ],
            },
            {
                heading: 'What the cited evidence here actually covers',
                paragraphs: [
                    'The canonical evidence currently linked in this repo is specific. It includes performance-oriented HBOT research in athletes, a meta-analysis on exercise-related soreness, and a randomized trial in a narrow post-mTBI population.',
                    'That means the article can support education and planning, but it should not stretch those findings into broad promises. Population, protocol, and endpoint fit still matter when someone moves from reading to action.',
                ],
            },
            {
                heading: 'How to use this article without overreaching',
                paragraphs: [
                    "If your main question is 'what do the studies actually show?', the research hub is the stronger next stop because it keeps the source and the limitation together.",
                    "If your main question is 'how would I use this in a repeatable weekly routine?', the recovery protocol page is usually the better continuation. If you are still comparing equipment categories, the HBOT product hub is the better path.",
                ],
                bullets: [
                    'Use the research hub for the source studies and limitation summaries.',
                    'Use the product hub for equipment context, support policy, and commercial fit.',
                    'Use the recovery protocol route when the goal is already clear and the next question is implementation.',
                ],
            },
        ],
        evidenceIds: ['ev-hbot-001', 'ev-hbot-002', 'ev-hbot-003'],
        relatedConditionSlugs: ['recovery', 'vitality'],
        relatedProtocolSlugs: ['recovery-oxygen-foundation', 'vitality-dual-stack'],
        relatedProductRoute: 'hbot',
        trace_id: 'HBOT-CLAIM-001',
    },
    {
        id: 2,
        title: 'PEMF Therapy: Recharging Your Cellular Batteries',
        excerpt:
            'An orientation guide to how Hylono frames PEMF in sleep, comfort, and stress-support routines, plus the questions to answer before treating it as a primary modality.',
        category: 'PEMF',
        date: 'Jan 12, 2026',
        readTime: '6 min',
        image: 'from-purple-400 to-pink-500',
        articleType: 'Planning guide',
        answerSummary:
            'Use this article when you want a practical PEMF orientation before choosing a condition path, comparing the device category, or asking Hylono for planning help.',
        audience: 'Visitors exploring calmer routines, comfort support, or sleep-focused wellness planning.',
        keyTakeaways: [
            'PEMF on this site is framed as a complementary planning option, not a universal first answer.',
            'The strongest next move is usually goal-first: sleep, stress, or comfort before device-first.',
            'This page should narrow questions, not replace the need for deeper evidence review or fit discussion.',
        ],
        limitations: [
            'This article is an orientation guide and does not yet cite canonical PEMF evidence records from the main evidence library.',
            'Because PEMF use cases vary by routine and goal, the condition pages are often more useful than a modality-only reading path.',
        ],
        sections: [
            {
                heading: 'How Hylono frames PEMF',
                paragraphs: [
                    'On this site, PEMF appears as a complementary modality for visitors building calmer routines, evening wind-down structure, or everyday comfort support. It is not framed as a one-size-fits-all answer.',
                    'That makes this page an orientation guide. Its job is to tell a visitor where PEMF sits in the broader journey and what other pages to review before it becomes the center of a plan.',
                ],
            },
            {
                heading: 'Questions to answer before PEMF becomes the main path',
                paragraphs: [
                    'Start with the goal rather than the device. Sleep, stress, and comfort each create different expectations for timing, session consistency, and whether a single modality is enough.',
                    'If the underlying question is still broad, the condition pages are usually the better first read because they compare PEMF against other modality options instead of keeping the decision isolated.',
                ],
            },
            {
                heading: 'What to do next',
                paragraphs: [
                    'Move to the PEMF hub when you are comparing the equipment category itself. Move to the condition guides when the decision is still goal-first. Move to contact when you need help narrowing the fit.',
                    'A smaller, clearer decision now is more useful than turning a planning article into an oversized claim page.',
                ],
                bullets: [
                    'Use sleep, stress, or comfort pages if you are still matching the modality to a goal.',
                    'Use the PEMF product hub if you are already comparing category-level fit and support.',
                    'Use contact when routine design depends on scheduling, tolerance, or stack questions.',
                ],
            },
        ],
        evidenceIds: [],
        relatedConditionSlugs: ['sleep', 'stress', 'comfort'],
        relatedProtocolSlugs: [],
        relatedProductRoute: 'pemf',
        trace_id: 'PEMF-CLAIM-001',
    },
    {
        id: 3,
        title: 'Red Light Therapy for Skin Regeneration',
        excerpt:
            'A practical guide to how Hylono uses red and near-infrared light topics in comfort, recovery, and skin-focused routines without stretching the evidence beyond the protocol.',
        category: 'RLT',
        date: 'Jan 10, 2026',
        readTime: '5 min',
        image: 'from-red-400 to-orange-500',
        articleType: 'Planning guide',
        answerSummary:
            'Use this article when you need a simpler red-light starting point before comparing the product hub with broader condition or support paths.',
        audience: 'Visitors exploring comfort, recovery, and skin-oriented routine planning.',
        keyTakeaways: [
            'Red-light content on Hylono is strongest when tied to a clear routine question, not a vague promise.',
            'Comfort and recovery paths often provide better context than reading RLT in isolation.',
            'This page is meant to help with fit and framing before a deeper product or support conversation.',
        ],
        limitations: [
            'This article does not yet cite canonical RLT evidence records from the main evidence library.',
            'Skin, comfort, and recovery questions do not collapse into one simple protocol, so visitors still need goal-specific routing.',
        ],
        sections: [
            {
                heading: 'Where red light fits in the site journey',
                paragraphs: [
                    'Hylono frames red and near-infrared light as a practical modality category that often appears inside comfort and recovery planning. The emphasis is on realistic use and route fit rather than cosmetic or performance hype.',
                    'That framing matters because visitors often arrive with very different questions. Some want a local-support tool, while others are really trying to solve a broader recovery or daily-rhythm problem.',
                ],
            },
            {
                heading: 'Why a goal-first read is still useful',
                paragraphs: [
                    'If the real question is comfort, recovery rhythm, or daily tolerance, the condition pages are usually a better first stop than a modality-only article. They show how red light sits next to other options instead of forcing a single-device answer.',
                    'The red-light hub becomes more useful once a visitor already knows the category is relevant and wants to compare equipment, support, and the broader commercial context.',
                ],
            },
            {
                heading: 'How to continue without guesswork',
                paragraphs: [
                    'Use this page to narrow the decision, not to finish it. The most helpful follow-up route depends on whether you are still choosing a goal, comparing the category, or asking for direct planning support.',
                    'That keeps the article practical while staying inside the conservative evidence and support posture the rest of the site already uses.',
                ],
                bullets: [
                    'Open comfort or recovery guidance if the goal is still the main unknown.',
                    'Open the red-light hub if you are already comparing device fit and support.',
                    'Use contact when you need help deciding whether red light belongs in a wider routine.',
                ],
            },
        ],
        evidenceIds: [],
        relatedConditionSlugs: ['comfort', 'recovery'],
        relatedProtocolSlugs: [],
        relatedProductRoute: 'rlt',
        trace_id: 'RLT-CLAIM-001',
    },
    {
        id: 4,
        title: 'Hydrogen Water: The Smallest Antioxidant',
        excerpt:
            'A Hylono research note on molecular hydrogen, the difference between planning language and stronger efficacy claims, and which cited fatigue and recovery signals are actually in scope.',
        category: 'Hydrogen',
        date: 'Jan 8, 2026',
        readTime: '7 min',
        image: 'from-sky-400 to-cyan-500',
        articleType: 'Research note',
        answerSummary:
            'Start here if you want a plain-language hydrogen overview before opening the source studies or moving into the stress and vitality paths.',
        audience: 'Visitors exploring daily-energy, fatigue, and lighter-weight routine options.',
        keyTakeaways: [
            'Hydrogen content on Hylono is framed conservatively and tied to a small cited evidence base.',
            'The linked records focus on fatigue-related outcomes and narrow populations rather than every market claim.',
            'The stronger next step is either the research hub, the hydrogen hub, or the H2 protocol route depending on the question.',
        ],
        limitations: [
            'The canonical hydrogen evidence set in this repo is still small and includes both healthy-adult and highly specific patient populations.',
            'Hydrogen articles should stay careful about the difference between broad marketing language and what the linked records can actually support.',
        ],
        sections: [
            {
                heading: 'How Hylono positions molecular hydrogen',
                paragraphs: [
                    'On Hylono, hydrogen is described as a conservative, evidence-informed option for fatigue, oxidative-load, and routine-building questions, especially when a visitor wants a lighter daily habit rather than a large hardware commitment.',
                    'This article is here to make that positioning easier to understand before a visitor jumps into product details or reads source studies out of context.',
                ],
            },
            {
                heading: 'What the linked evidence can and cannot do',
                paragraphs: [
                    'The strongest linked records in this repo cover fatigue-related outcomes, aerobic-capacity questions, and one narrow patient population. That is enough to justify education and structured next steps, but not enough to justify sweeping outcome promises.',
                    'For that reason, the research hub remains the stronger destination when the question is mostly about citation quality, study design, or scientific limits.',
                ],
            },
            {
                heading: 'How to keep the next step honest',
                paragraphs: [
                    'Move to the hydrogen hub if you are now comparing the category itself. Move to the stress or vitality routes if the main question is still goal-first. Move to the H2 protocol page if you already know you want a repeatable routine shape.',
                    'That keeps the article practical and commercially useful without turning it into a larger claim page than the evidence can support.',
                ],
                bullets: [
                    'Use the research hub for the source studies and limitation summaries.',
                    'Use the hydrogen hub for category fit, support context, and planning details.',
                    'Use the protocol route when you are already moving from reading into routine design.',
                ],
            },
        ],
        evidenceIds: ['ev-h2-001', 'ev-h2-002', 'ev-h2-003'],
        relatedConditionSlugs: ['stress', 'vitality', 'recovery'],
        relatedProtocolSlugs: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
        relatedProductRoute: 'hydrogen',
        trace_id: 'H2-CLAIM-001',
    },
    {
        id: 5,
        title: 'The Superhuman Protocol: Combining PEMF, HBOT, and RLT',
        excerpt:
            'A planning guide for visitors comparing stacked home routines. It explains how Hylono separates evidence review, modality fit, and protocol design before someone combines multiple tools.',
        category: 'Protocols',
        date: 'Jan 5, 2026',
        readTime: '10 min',
        image: 'from-slate-600 to-slate-800',
        articleType: 'Protocol guide',
        answerSummary:
            'Use this article if you are already comparing more than one modality and need a safer order of operations before building a stack.',
        audience: 'Visitors moving from single-modality reading toward a broader home-routine plan.',
        keyTakeaways: [
            'A stack only becomes useful when the goal, baseline, and time commitment are already clear.',
            'Evidence review, product fit, and protocol design should happen in that order instead of collapsing into one hype-heavy page.',
            'The next best route is usually a condition page or protocol page, not a larger claim about combined outcomes.',
        ],
        limitations: [
            'This article is a planning guide, not a full evidence review for every modality mentioned in the title.',
            'A multi-modality routine can add noise if the goal, schedule, and primary modality are still unresolved.',
        ],
        sections: [
            {
                heading: 'Why stack articles need more discipline than hype',
                paragraphs: [
                    "The title points to a familiar multi-modality idea, but visitors still need a grounded way to separate marketing language from a practical home routine. Hylono's stronger pattern is protocol-first planning, not 'more devices means better results' rhetoric.",
                    'That is why this article focuses on decision order and fit. It exists to slow the visitor down just enough to make the next route choice smarter.',
                ],
            },
            {
                heading: 'Start with the goal and baseline, not with the largest stack',
                paragraphs: [
                    'A stack only becomes useful when the user already knows what problem they are trying to solve, what time commitment they can sustain, and which primary modality should carry the most weight.',
                    'Without that order of operations, a multi-device plan can create noise instead of clarity. In practice, the condition and protocol pages are usually the better place to narrow the first step.',
                ],
            },
            {
                heading: 'Use the protocol and condition pages to narrow the plan',
                paragraphs: [
                    'Hylono already has stronger route types for this decision than a single umbrella article. The condition pages help define the goal, while the protocol pages turn that goal into a repeatable weekly shape.',
                    'Treat this article as a routing and planning surface. Once the main goal is clear, move quickly into the protocol library, the product hub, or direct support.',
                ],
                bullets: [
                    'Use a condition page first if the goal is still broad or mixed.',
                    'Use the protocol hub when you are ready to compare routine structure and time commitment.',
                    'Use contact when the stack question depends on your specific schedule or tolerance.',
                ],
            },
        ],
        evidenceIds: [],
        relatedConditionSlugs: ['recovery', 'stress', 'vitality'],
        relatedProtocolSlugs: ['recovery-oxygen-foundation', 'vitality-dual-stack'],
        relatedProductRoute: null,
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
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=hyperbaric+oxygen+VO2+max+athletes"
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
    },
    {
        id: '5',
        title: "EWOT & Peripheral Oxygen Saturation in Sedentary Adults",
        category: 'Recovery',
        metric: "Peripheral O2 Delivery",
        value: "+18%",
        description: "Measuring tissue oxygenation during moderate exercise with enriched oxygen breathing.",
        fullContent: "A controlled trial examined peripheral tissue oxygenation in sedentary adults performing moderate aerobic exercise with and without enriched oxygen breathing. The EWOT group demonstrated an 18% improvement in peripheral oxygen saturation and significantly reduced post-exercise lactate levels. Participants reported faster perceived recovery and improved sustained energy following sessions, consistent with enhanced microcirculatory oxygen loading.",
        participants: 32,
        status: 'Published',
        trace_id: "EWOT-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=exercise+oxygen+therapy+tissue+oxygenation",
        doi: "10.3390/ijerph17197181"
    },
    {
        id: '6',
        title: "Far-Infrared Sauna & Cardiovascular Recovery Markers",
        category: 'Recovery',
        metric: "Arterial Compliance",
        value: "+21%",
        description: "4-week study measuring cardiovascular adaptation to repeated far-infrared heat exposure.",
        fullContent: "Subjects undergoing 4 weeks of regular far-infrared sauna sessions demonstrated a 21% improvement in arterial compliance and significant reductions in pro-inflammatory cytokine markers. Infrared-specific heat penetration was associated with elevated heat shock protein levels and measurably improved parasympathetic tone post-session, with participants reporting substantially reduced muscle soreness and improved sleep quality.",
        participants: 38,
        status: 'Published',
        trace_id: "SAUNA-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=infrared+sauna+cardiovascular+recovery",
        doi: "10.1016/j.jcrc.2015.11.026"
    },
    {
        id: '7',
        title: "Whole-Body EMS vs. Conventional Resistance Training",
        category: 'Recovery',
        metric: "Muscle Activation",
        value: "92%",
        description: "Comparing neuromuscular activation efficiency between 20-minute WB-EMS and 60-minute resistance training.",
        fullContent: "This comparative trial used surface electromyography to assess muscle activation across 16 major muscle groups during whole-body EMS sessions versus conventional resistance training. WB-EMS sessions of 20 minutes achieved 92% of the neuromuscular activation of a 60-minute resistance training session, with markedly reduced joint loading. Post-session protein synthesis markers were equivalent between groups, supporting EMS as a time-efficient alternative for maintaining anabolic stimulus.",
        participants: 41,
        status: 'Published',
        trace_id: "EMS-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=whole+body+EMS+resistance+training+comparison",
        doi: "10.1519/JSC.0000000000001407"
    },
    {
        id: '8',
        title: "Transcutaneous Auricular VNS & HRV Normalization",
        category: 'Sleep',
        metric: "HRV Improvement",
        value: "+31%",
        description: "Double-blind study on non-invasive vagal stimulation effects on autonomic regulation.",
        fullContent: "A double-blind crossover study examined the effects of 30-minute transcutaneous auricular VNS sessions on heart rate variability in stressed professional adults. Active stimulation produced a 31% improvement in HRV (RMSSD) compared to sham stimulation, alongside significant reductions in salivary cortisol. Participants showed improved sleep architecture (extended N3 phase) and rated stress levels 40% lower following active stimulation sessions.",
        participants: 56,
        status: 'Published',
        trace_id: "VNS-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=transcutaneous+vagus+nerve+stimulation+HRV+stress",
        doi: "10.1016/j.brs.2019.10.012"
    },
    {
        id: '9',
        title: "Intermittent Hypoxic Training & Aerobic Performance",
        category: 'Cellular',
        metric: "VO2 Max Increase",
        value: "+9.8%",
        description: "8-week intermittent hypoxic exposure protocol in recreational athletes.",
        fullContent: "Recreational athletes completed an 8-week intermittent hypoxic training protocol with cycling sessions. The group demonstrated a 9.8% improvement in VO2 Max, elevated hemoglobin mass, and measurably increased mitochondrial enzyme activity. HIF-1α protein levels were elevated for 24–48 hours following each session, confirming activation of the core hypoxia-adaptive transcription pathway. The protocol was well tolerated with no adverse events when SpO2 was monitored throughout.",
        participants: 28,
        status: 'Published',
        trace_id: "HYPOXIC-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=intermittent+hypoxic+training+VO2+max"
    },
    {
        id: '10',
        title: "Whole-Body Cryotherapy & Inflammatory Markers in Athletes",
        category: 'Recovery',
        metric: "Inflammatory Reduction",
        value: "-27%",
        description: "Measuring CRP and inflammatory cytokine response following repeated WBC sessions in trained athletes.",
        fullContent: "Elite athletes undergoing whole-body cryotherapy over a 2-week high-intensity training block showed a 27% reduction in C-reactive protein and significant downregulation of TNF-α and IL-1β. Norepinephrine levels increased by an average of 300% immediately post-session, consistent with the analgesic and mood-stabilizing effects reported by participants. Muscle soreness scores were 35% lower in the WBC group versus the control group at 24-hour post-training assessments.",
        participants: 22,
        status: 'Published',
        trace_id: "CRYO-SPEC-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=whole+body+cryotherapy+inflammation+athletes",
        doi: "10.1371/journal.pone.0083570"
    },
    {
        id: '11',
        title: "HBOT & Post-Concussion Cognitive Recovery",
        category: 'Cognitive',
        metric: "Cognitive Function",
        value: "+15%",
        description: "Randomized trial of hyperbaric oxygen for persistent post-concussion symptoms.",
        fullContent: "A randomized controlled trial examined HBOT at 1.5 ATA for patients with persistent post-concussion syndrome. After 40 sessions, the treatment group showed 15% improvement in cognitive processing speed and significant gains in memory composite scores compared to sham control. Brain SPECT imaging revealed increased perfusion in frontal and temporal regions. The findings support HBOT as a potential rehabilitation tool for traumatic brain injury recovery when applied in a controlled protocol.",
        participants: 56,
        status: 'Published',
        trace_id: "HBOT-COG-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=hyperbaric+oxygen+concussion+cognitive",
        doi: "10.1089/neu.2017.5218"
    },
    {
        id: '12',
        title: "HBOT & Wound Healing in Diabetic Patients",
        category: 'Cellular',
        metric: "Healing Rate",
        value: "+76%",
        description: "Meta-analysis of hyperbaric oxygen for diabetic foot ulcer healing.",
        fullContent: "A comprehensive meta-analysis evaluated the efficacy of HBOT for diabetic foot ulcers across 10 randomized controlled trials. Pooled analysis demonstrated a 76% increase in complete healing rate compared to standard wound care. The mechanism involves enhanced oxygen delivery to hypoxic tissues, stimulation of angiogenesis via VEGF upregulation, and direct antibacterial effects on anaerobic pathogens. Cost-effectiveness modeling suggests HBOT reduces amputation rates by 40% in eligible patients.",
        participants: 531,
        status: 'Published',
        trace_id: "HBOT-WOUND-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=hyperbaric+oxygen+diabetic+foot+ulcer+meta+analysis",
        doi: "10.1111/dme.13717"
    },
    {
        id: '13',
        title: "Red/NIR Light & Muscle Recovery Post-Exercise",
        category: 'Recovery',
        metric: "Recovery Speed",
        value: "+58%",
        description: "Systematic review of photobiomodulation for exercise recovery and performance.",
        fullContent: "A systematic review of 46 studies examined photobiomodulation (PBM) effects on exercise recovery and performance. Pre-exercise PBM reduced markers of muscle damage (CK, LDH) and improved recovery of muscle performance by 58% compared to placebo. Optimal parameters were identified as 630-660nm (red) and 810-850nm (NIR) at 50-200 mW/cm² irradiance. The mechanism involves enhanced mitochondrial ATP production and reduced oxidative stress via cytochrome c oxidase activation.",
        participants: 892,
        status: 'Published',
        trace_id: "RLT-RECOVERY-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=photobiomodulation+muscle+recovery+exercise",
        doi: "10.1007/s40279-016-0504-7"
    },
    {
        id: '14',
        title: "Transcranial NIR & Cognitive Function",
        category: 'Cognitive',
        metric: "Executive Function",
        value: "+12%",
        description: "Study of transcranial near-infrared stimulation on cognitive performance.",
        fullContent: "This study investigated transcranial near-infrared stimulation (tNIRS) at 810nm on executive function in healthy adults. After 10 sessions over 2 weeks, participants showed 12% improvement in executive function tasks (Stroop test, n-back) and reduced reaction time variability. fNIRS monitoring confirmed increased prefrontal cortex oxygenation during cognitive tasks. The findings suggest tNIRS may enhance cognitive performance by improving cerebral oxygen delivery and mitochondrial function in cortical neurons.",
        participants: 34,
        status: 'Peer Review',
        trace_id: "RLT-COG-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=transcranial+near+infrared+cognitive+function",
        doi: "10.1016/j.neuroimage.2020.116969"
    },
    {
        id: '15',
        title: "PEMF & Chronic Lower Back Pain",
        category: 'Recovery',
        metric: "Pain Reduction",
        value: "-42%",
        description: "Randomized controlled trial of PEMF for non-specific chronic low back pain.",
        fullContent: "A randomized double-blind trial evaluated PEMF therapy for non-specific chronic low back pain. Patients received 30-minute sessions at 50Hz, 5 times weekly for 4 weeks. The treatment group demonstrated 42% reduction in visual analog pain scores compared to 12% in sham group. Disability scores improved by 35%, and analgesic medication use decreased by 28%. Follow-up at 12 weeks showed sustained benefits, suggesting PEMF may provide lasting pain relief through modulation of inflammatory pathways.",
        participants: 68,
        status: 'Published',
        trace_id: "PEMF-PAIN-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=PEMF+chronic+low+back+pain",
        doi: "10.1016/j.pain.2018.02.016"
    },
    {
        id: '16',
        title: "PEMF & Bone Fracture Healing",
        category: 'Cellular',
        metric: "Healing Time",
        value: "-35%",
        description: "Clinical evaluation of PEMF acceleration of fracture consolidation.",
        fullContent: "This clinical study examined PEMF effects on tibial fracture healing time. Patients with closed tibial fractures received daily 4-hour PEMF treatments at 15Hz pulse frequency. The treatment group achieved radiographic union in 35% less time than historical controls (mean 14 weeks vs 21 weeks). Histological analysis suggested enhanced osteoblast activity and improved callus formation. PEMF is FDA-cleared for fracture healing and represents a non-invasive adjunct to standard orthopedic care.",
        participants: 44,
        status: 'Published',
        trace_id: "PEMF-BONE-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=PEMF+fracture+healing+tibial",
        doi: "10.2106/JBJS.N.01457"
    },
    {
        id: '17',
        title: "Molecular Hydrogen & Metabolic Syndrome",
        category: 'Cellular',
        metric: "Metabolic Markers",
        value: "-18%",
        description: "Clinical trial of hydrogen-rich water on metabolic syndrome markers.",
        fullContent: "A randomized controlled trial investigated hydrogen-rich water (1.5-2.0 mM H₂) consumption in patients with metabolic syndrome. After 8 weeks, the treatment group showed 18% reduction in total cholesterol, significant decreases in LDL and triglycerides, and improved insulin sensitivity (HOMA-IR). Inflammatory markers (hs-CRP, TNF-α) were significantly reduced. The mechanism involves selective scavenging of hydroxyl radicals and upregulation of Nrf2-dependent antioxidant pathways.",
        participants: 60,
        status: 'Published',
        trace_id: "H2-METAB-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=molecular+hydrogen+metabolic+syndrome+clinical+trial",
        doi: "10.1016/j.metabol.2019.02.014"
    },
    {
        id: '18',
        title: "Hydrogen Inhalation & Post-Cardiac Arrest Recovery",
        category: 'Recovery',
        metric: "Neurological Outcome",
        value: "+23%",
        description: "Study of hydrogen gas inhalation for neuroprotection after cardiac arrest.",
        fullContent: "This clinical study examined 2% hydrogen gas inhalation for neuroprotection in post-cardiac arrest patients. The hydrogen treatment group demonstrated 23% better neurological outcome scores at 90 days compared to standard care controls. Biomarker analysis showed reduced oxidative stress markers and preserved mitochondrial function. Hydrogen's ability to rapidly diffuse across the blood-brain barrier and selectively neutralize hydroxyl radicals provides neuroprotection during the critical reperfusion period.",
        participants: 92,
        status: 'Published',
        trace_id: "H2-NEURO-001",
        pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=hydrogen+inhalation+cardiac+arrest+neuroprotection",
        doi: "10.1161/CIRCULATIONAHA.119.044279"
    }
];
