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
        { label: 'Recovery', path: 'conditions/recovery' },
        { label: 'Sleep', path: 'conditions/sleep' },
        { label: 'Stress', path: 'conditions/stress' },
        { label: 'Comfort', path: 'conditions/comfort' },
        { label: 'Vitality', path: 'conditions/vitality' },
    ],
    cta: { label: 'Plan your stack ->', path: 'wellness-planner' },
    trustMarkers: (lowestRental: number) => [
        'Guided consultation available',
        `Rent from EUR ${lowestRental}/mo`,
        'Service and support included',
    ],
};

export const batch3HomeContent = {
    jumpstart: {
        title: 'Not sure where to start?',
        cards: [
            {
                icon: 'Stack',
                title: 'Plan a stack',
                description: "Answer a few questions and we'll match you with the right technologies.",
                path: 'wellness-planner',
            },
            {
                icon: 'Target',
                title: 'Choose a goal',
                description: 'Sleep, recovery, stress - find your path.',
                path: 'conditions',
            },
            {
                icon: 'Guide',
                title: 'Talk to an advisor',
                description: "Use the contact route for planning support and next-step guidance.",
                path: 'contact',
            },
        ],
    },
    popularGoals: {
        title: 'Popular goals',
        tiles: [
            { icon: 'Recovery', title: 'Recovery', path: 'conditions/recovery' },
            { icon: 'Sleep', title: 'Sleep', path: 'conditions/sleep' },
            { icon: 'Stress', title: 'Stress', path: 'conditions/stress' },
            { icon: 'Comfort', title: 'Renewal', path: 'conditions/comfort' },
            { icon: 'Vitality', title: 'Vitality', path: 'conditions/vitality' },
        ],
    },
    rentalPromo: {
        title: 'Try before you buy',
        description:
            'Rental program: access to regeneration technologies without the upfront investment.',
        bullets: [
            'Flexible monthly access',
            'Service and support included',
            'Apply eligible rental payments toward purchase where offered',
        ],
        cta: 'Explore the rental program ->',
        ctaPath: 'rental',
    },
} as const;

export type ContentCommerceMapping = {
    relatedProducts: TechType[];
    relatedProtocols: string[];
    goal?: string;
};

export const blogCategoryCommerceMap: Record<string, ContentCommerceMapping> = {
    HBOT: {
        relatedProducts: [TechType.HBOT],
        relatedProtocols: ['recovery-oxygen-foundation'],
        goal: 'recovery',
    },
    PEMF: {
        relatedProducts: [TechType.PEMF],
        relatedProtocols: ['stress-balance-h2-foundation'],
        goal: 'sleep',
    },
    RLT: {
        relatedProducts: [TechType.RLT],
        relatedProtocols: ['stress-balance-h2-foundation'],
        goal: 'comfort',
    },
    Hydrogen: {
        relatedProducts: [TechType.HYDROGEN],
        relatedProtocols: ['stress-balance-h2-foundation'],
        goal: 'vitality',
    },
    Protocols: {
        relatedProducts: [TechType.HBOT, TechType.PEMF, TechType.RLT],
        relatedProtocols: ['recovery-oxygen-foundation', 'vitality-dual-stack'],
        goal: 'recovery',
    },
};

export const learningCommerceMap: ContentCommerceMapping = {
    relatedProducts: [TechType.PEMF, TechType.RLT],
    relatedProtocols: ['stress-balance-h2-foundation', 'vitality-dual-stack'],
    goal: 'sleep',
};

export const researchCommerceMap: ContentCommerceMapping = {
    relatedProducts: [TechType.HBOT, TechType.HYDROGEN],
    relatedProtocols: ['recovery-oxygen-foundation', 'stress-balance-h2-foundation'],
    goal: 'recovery',
};

export type Batch3ProductDocument = {
    title: string;
    type: 'Page';
    size: string;
    href: string;
};

export const batch3DocumentsByTech: Partial<Record<TechType, Batch3ProductDocument[]>> = {
    [TechType.HBOT]: [
        { title: 'Shipping and delivery policy', type: 'Page', size: 'Policy page', href: '/shipping' },
        { title: 'Returns and eligibility policy', type: 'Page', size: 'Policy page', href: '/returns' },
        { title: 'Warranty support overview', type: 'Page', size: 'Policy page', href: '/warranty' },
    ],
    [TechType.PEMF]: [
        { title: 'Shipping and delivery policy', type: 'Page', size: 'Policy page', href: '/shipping' },
        { title: 'Returns and eligibility policy', type: 'Page', size: 'Policy page', href: '/returns' },
        { title: 'Warranty support overview', type: 'Page', size: 'Policy page', href: '/warranty' },
    ],
    [TechType.RLT]: [
        { title: 'Shipping and delivery policy', type: 'Page', size: 'Policy page', href: '/shipping' },
        { title: 'Returns and eligibility policy', type: 'Page', size: 'Policy page', href: '/returns' },
        { title: 'Warranty support overview', type: 'Page', size: 'Policy page', href: '/warranty' },
    ],
    [TechType.HYDROGEN]: [
        { title: 'Shipping and delivery policy', type: 'Page', size: 'Policy page', href: '/shipping' },
        { title: 'Returns and eligibility policy', type: 'Page', size: 'Policy page', href: '/returns' },
        { title: 'Warranty support overview', type: 'Page', size: 'Policy page', href: '/warranty' },
    ],
};

const specAnnotations: Partial<Record<TechType, Record<string, string>>> = {
    [TechType.HBOT]: {
        'Pressure Range': 'Pressure figures should always be interpreted alongside the published operating guidance for the route.',
        'Oxygen Purity': 'Oxygen-delivery claims should be reviewed together with setup, maintenance, and safety guidance.',
    },
    [TechType.RLT]: {
        Wavelengths:
            'Visible red and near-infrared pairings are commonly discussed in photobiomodulation research, but outcomes remain protocol-specific.',
        Irradiance: 'Session comfort, distance, and device setup all affect practical exposure.',
    },
    [TechType.HYDROGEN]: {
        Concentration: 'Hydrogen concentration figures should be read together with the published usage guidance and maintenance notes.',
        Purity: 'Purity statements should be evaluated alongside the manufacturer and servicing documentation.',
    },
};

export const getBatch3SpecAnnotation = (tech: TechType, label: string): string | null => {
    return specAnnotations[tech]?.[label] ?? null;
};

export const batch3PdpContent = {
    trustHierarchy: {
        whySelected:
            'We shortlist products with practical protocol fit, clear support paths, and policy-backed commercial guidance.',
        protocolSignal: 'Usage protocol included',
    },
    socialProof: {
        minReviewCount: 10,
        belowThresholdMessage:
            'This route prioritizes policy clarity, setup guidance, and supporting evidence over synthetic review volume.',
    },
    advisorCta: {
        title: 'Need help choosing?',
        linkLabel: 'Book a consultation ->',
        path: 'contact',
    },
    tradeInCta: {
        text: 'Need help comparing ownership paths?',
        linkLabel: 'Review returns and support options ->',
        path: 'returns',
    },
} as const;
