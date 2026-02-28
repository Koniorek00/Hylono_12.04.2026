import { TechType } from '../types';

export type GoalNavItem = {
    label: string;
    path: string;
};

export const batch3NavigationContent: {
    goalsLabel: string;
    goals: GoalNavItem[];
    cta: GoalNavItem;
    trustMarkers: (lowestRental: number) => string[];
} = {
    goalsLabel: 'Goals',
    goals: [
        { label: 'Sports recovery', path: 'conditions/sports-recovery' },
        { label: 'Sleep & rest', path: 'conditions/sleep-rest' },
        { label: 'Stress & tension', path: 'conditions/stress-tension' },
        { label: 'Comfort & renewal', path: 'conditions/comfort-renewal' },
        { label: 'Vitality', path: 'conditions/vitality' },
    ],
    cta: { label: 'Plan your stack →', path: 'wellness-planner' },
    trustMarkers: (lowestRental: number) => [
        '✓ Free consultation',
        `✓ Rent from €${lowestRental}/mo`,
        '✓ Service & support included',
    ],
};

export const batch3HomeContent = {
    jumpstart: {
        title: 'Not sure where to start?',
        cards: [
            {
                icon: '🔧',
                title: 'Plan a stack',
                description: "Answer a few questions and we'll match you with the right technologies.",
                path: 'wellness-planner',
            },
            {
                icon: '🎯',
                title: 'Choose a goal',
                description: 'Sleep, recovery, stress — find your path.',
                path: 'conditions',
            },
            {
                icon: '💬',
                title: 'Talk to an advisor',
                description: "Free consultation. We'll help you find the right solution.",
                path: 'advisors',
            },
        ],
    },
    popularGoals: {
        title: 'Popular goals',
        tiles: [
            { icon: '💪', title: 'Recovery', path: 'conditions/sports-recovery' },
            { icon: '🌙', title: 'Sleep', path: 'conditions/sleep-rest' },
            { icon: '🧘', title: 'Stress', path: 'conditions/stress-tension' },
            { icon: '✨', title: 'Renewal', path: 'conditions/comfort-renewal' },
            { icon: '⚡', title: 'Vitality', path: 'conditions/vitality' },
        ],
    },
    rentalPromo: {
        title: 'Try before you buy',
        description:
            'Rental program: access to regeneration technologies without the upfront investment.',
        bullets: [
            'No long-term commitment',
            'Service and support included',
            '70% of payments credited toward purchase',
        ],
        cta: 'Explore the rental program →',
        ctaPath: 'rental',
    },
} as const;

export type ContentCommerceMapping = {
    relatedProducts: TechType[];
    relatedProtocols: string[];
    goal?: string;
};

export const blogCategoryCommerceMap: Record<string, ContentCommerceMapping> = {
    HBOT: { relatedProducts: [TechType.HBOT], relatedProtocols: ['DEEP-RECOVERY'], goal: 'recovery' },
    PEMF: { relatedProducts: [TechType.PEMF], relatedProtocols: ['MITO-RESET'], goal: 'sleep' },
    RLT: { relatedProducts: [TechType.RLT], relatedProtocols: ['MITO-RESET'], goal: 'skin' },
    Hydrogen: { relatedProducts: [TechType.HYDROGEN], relatedProtocols: ['QUANTUM-CLARITY'], goal: 'cognitive' },
    Protocols: {
        relatedProducts: [TechType.HBOT, TechType.PEMF, TechType.RLT],
        relatedProtocols: ['MITO-RESET', 'DEEP-RECOVERY'],
        goal: 'performance',
    },
};

export const learningCommerceMap: ContentCommerceMapping = {
    relatedProducts: [TechType.PEMF, TechType.RLT],
    relatedProtocols: ['MITO-RESET', 'QUANTUM-CLARITY'],
    goal: 'sleep',
};

export const researchCommerceMap: ContentCommerceMapping = {
    relatedProducts: [TechType.HBOT, TechType.HYDROGEN],
    relatedProtocols: ['DEEP-RECOVERY', 'QUANTUM-CLARITY'],
    goal: 'recovery',
};

export type Batch3ProductDocument = {
    title: string;
    type: 'PDF';
    size: string;
    href: string;
};

export const batch3DocumentsByTech: Partial<Record<TechType, Batch3ProductDocument[]>> = {
    [TechType.HBOT]: [
        { title: 'User manual', type: 'PDF', size: '2.4 MB', href: '/docs/manual-hbot.pdf' },
        { title: 'CE Declaration of Conformity', type: 'PDF', size: '0.8 MB', href: '/docs/ce-hbot.pdf' },
        { title: 'Technical specification sheet', type: 'PDF', size: '1.2 MB', href: '/docs/spec-hbot.pdf' },
    ],
    [TechType.PEMF]: [
        { title: 'User manual', type: 'PDF', size: '1.9 MB', href: '/docs/manual-pemf.pdf' },
        { title: 'CE Declaration of Conformity', type: 'PDF', size: '0.6 MB', href: '/docs/ce-pemf.pdf' },
        { title: 'Technical specification sheet', type: 'PDF', size: '1.1 MB', href: '/docs/spec-pemf.pdf' },
    ],
    [TechType.RLT]: [
        { title: 'User manual', type: 'PDF', size: '1.7 MB', href: '/docs/manual-rlt.pdf' },
        { title: 'CE Declaration of Conformity', type: 'PDF', size: '0.5 MB', href: '/docs/ce-rlt.pdf' },
        { title: 'Technical specification sheet', type: 'PDF', size: '0.9 MB', href: '/docs/spec-rlt.pdf' },
    ],
    [TechType.HYDROGEN]: [
        { title: 'User manual', type: 'PDF', size: '1.8 MB', href: '/docs/manual-hydrogen.pdf' },
        { title: 'CE Declaration of Conformity', type: 'PDF', size: '0.7 MB', href: '/docs/ce-hydrogen.pdf' },
        { title: 'Technical specification sheet', type: 'PDF', size: '1.0 MB', href: '/docs/spec-hydrogen.pdf' },
    ],
};

const specAnnotations: Partial<Record<TechType, Record<string, string>>> = {
    [TechType.HBOT]: {
        'Pressure Range': 'Equivalent to a mild underwater depth profile suitable for regular home-guided sessions.',
        'Oxygen Purity': 'High-purity oxygen delivery helps maintain consistent session quality.',
    },
    [TechType.RLT]: {
        Wavelengths:
            'Visible red + near-infrared is the most commonly studied photobiomodulation pairing in wellness research.',
        Irradiance: 'Higher irradiance supports practical session duration while maintaining comfort.',
    },
    [TechType.HYDROGEN]: {
        Concentration: 'Higher dissolved concentration supports meaningful intake per session.',
        Purity: 'High purity minimizes unwanted gas byproducts during use.',
    },
};

export const getBatch3SpecAnnotation = (tech: TechType, label: string): string | null => {
    return specAnnotations[tech]?.[label] ?? null;
};

export const batch3PdpContent = {
    trustHierarchy: {
        whySelected:
            'We shortlist products with robust technical documentation, practical protocol fit, and consistent supportability in real-world usage.',
        protocolSignal: 'Usage protocol included',
    },
    socialProof: {
        minReviewCount: 10,
        belowThresholdMessage:
            'This product currently has limited verified review volume. We prioritise technical documentation and protocol guidance first.',
    },
    advisorCta: {
        title: 'Need help choosing?',
        linkLabel: 'Book a free consultation →',
        path: 'advisors',
    },
    tradeInCta: {
        text: 'Have an older device?',
        linkLabel: 'Check your trade-in value →',
        path: 'trade-in',
    },
} as const;