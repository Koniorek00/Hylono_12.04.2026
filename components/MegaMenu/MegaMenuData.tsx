import React from 'react';
import {
    Layout, Brain, Box, BookOpen, Users, Globe, Info, Microscope, Briefcase, MessageCircle,
    Activity, Zap, Wind, Sun, Droplets
} from 'lucide-react';
import { TechType } from '../../types';

export type MenuContext =
    | 'HBOT' | 'PEMF' | 'RLT' | 'HYDROGEN' | 'NEUTRAL'
    | 'BUILDER' | 'PROTOCOLS' | 'PARTNERS' | 'LOCATOR'
    | 'MISSION' | 'SCIENCE' | 'CAREERS' | 'CONTACT';

export interface SearchDatabaseItem {
    id: number;
    title: string;
    category: string;
    desc: string;
    type: string;
    /** Keywords and synonyms for smart search matching */
    keywords?: string[];
    /** Related terms that should match this item */
    relatedTerms?: string[];
}

export const SEARCH_DATABASE: SearchDatabaseItem[] = [
    { 
        id: 1, 
        title: 'HBOT Pro X Chamber', 
        category: 'Products', 
        desc: '1.3 ATA Precision Oxygen', 
        type: 'hbot',
        keywords: ['hbot', 'hyperbaric', 'oxygen', 'chamber', 'pressure', 'ata', 'soft chamber', 'mild hbot', 'oxygen therapy', 'wellness chamber'],
        relatedTerms: ['oxyhelp', 'oxylife', 'regeneration', 'recovery', 'athletic', 'anti-aging', 'longevity', 'wound recovery support', 'inflammation']
    },
    { 
        id: 2, 
        title: 'Tesla Max PEMF', 
        category: 'Products', 
        desc: 'High-intensity pulsing', 
        type: 'pemf',
        keywords: ['pemf', 'pulsed electromagnetic', 'magnetic', 'tesla', 'field', 'frequency', 'pemf mat', 'pemf device', 'electromagnetic therapy'],
        relatedTerms: ['pain relief', 'sleep', 'recovery', 'circulation', 'energy', 'brainwave', 'delta', 'alpha', 'grounding', 'earthing']
    },
    { 
        id: 3, 
        title: 'Horizon RLT Panel', 
        category: 'Products', 
        desc: 'Dual-sync photobiomodulation', 
        type: 'rlt',
        keywords: ['rlt', 'red light', 'near infrared', 'nir', 'photobiomodulation', 'pbm', 'light therapy', 'led panel', 'red light therapy', '660nm', '850nm'],
        relatedTerms: ['skin', 'collagen', 'anti-aging', 'wrinkles', 'acne', 'wound recovery support', 'muscle recovery', 'inflammation', 'mitochondria', 'atp']
    },
    { 
        id: 4, 
        title: 'Hydra Molecular H2', 
        category: 'Products', 
        desc: '99.9% Pure Hydrogen', 
        type: 'hydrogen',
        keywords: ['hydrogen', 'h2', 'molecular hydrogen', 'hydrogen water', 'hydrogen inhalation', 'hydrogen generator', 'brown gas', 'hhO'],
        relatedTerms: ['antioxidant', 'oxidative stress', 'ros', 'free radicals', 'recovery', 'inflammation', 'athletic performance', 'anti-aging']
    },
    { 
        id: 5, 
        title: 'Skin & Collagen Matrix', 
        category: 'Protocols', 
        desc: 'RLT Collagen Synthesis', 
        type: 'protocol',
        keywords: ['skin', 'collagen', 'face', 'anti-aging', 'wrinkles', 'dermal', 'fibroblast', 'rlt', 'red light', 'beauty', 'aesthetic'],
        relatedTerms: ['youthful', 'elasticity', 'complexion', 'rejuvenation', 'photobiomodulation']
    },
    { 
        id: 6, 
        title: 'The Longevity Stack', 
        category: 'Protocols', 
        desc: 'HBOT + RLT Synergy', 
        type: 'protocol',
        keywords: ['longevity', 'stack', 'hbot', 'rlt', 'synergy', 'combined', 'anti-aging', 'lifespan', 'healthspan', 'biohacking'],
        relatedTerms: ['cellular', 'regeneration', 'mitochondria', 'telomere', 'oxidative', 'stress resistance']
    },
    { 
        id: 7, 
        title: 'Deep Sleep Reset', 
        category: 'Protocols', 
        desc: 'PEMF Entrainment', 
        type: 'protocol',
        keywords: ['sleep', 'deep sleep', 'delta', 'brainwave', 'pemf', 'entrainment', 'insomnia', 'rest', 'circadian', 'night'],
        relatedTerms: ['relaxation', 'melatonin', 'recovery', 'rem', 'sleep quality']
    },
    { 
        id: 8, 
        title: 'Mitochondrial Bio-Physics', 
        category: 'Science', 
        desc: 'ATP Synthesis Study', 
        type: 'article',
        keywords: ['mitochondria', 'atp', 'energy', 'cellular', 'biology', 'physics', 'science', 'research', 'metabolism', 'bioenergetics'],
        relatedTerms: ['oxidative phosphorylation', 'krebs cycle', 'cellular energy', 'mitochondrial function']
    },
    { 
        id: 9, 
        title: 'Partner ROI Guide', 
        category: 'Resources', 
        desc: 'Clinic Growth Metrics', 
        type: 'guide',
        keywords: ['roi', 'partner', 'clinic', 'business', 'growth', 'revenue', 'investment', 'profit', 'metrics', 'b2b'],
        relatedTerms: ['wholesale', 'enterprise', 'clinic setup', 'practice growth']
    },
    { 
        id: 11, 
        title: 'Protocol Codex', 
        category: 'Tools', 
        desc: '100+ Research Papers', 
        type: 'protocols',
        keywords: ['protocol', 'codex', 'research', 'papers', 'library', 'guide', 'bio-stacks', 'combinations', 'therapy protocols'],
        relatedTerms: ['evidence-based', 'structured', 'protocol', 'regimens', 'safety']
    },
    { 
        id: 12, 
        title: 'Wellness Planner', 
        category: 'Tools', 
        desc: 'Build Your Stack', 
        type: 'builder',
        keywords: ['wellness', 'planner', 'stack', 'builder', 'configuration', 'setup', 'goal', 'budget', 'protocol', 'recommendation'],
        relatedTerms: ['stack builder', 'goal planning', 'protocol matching', 'technology recommendation']
    },
];

/**
 * Smart search keywords map - maps user queries to product types
 * Used for intelligent matching of related terms
 */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
    // Oxygen/HBOT synonyms
    'oxygen': ['hbot', 'hyperbaric', 'chamber', 'oxyhelp', 'oxylife'],
    'hyperbaric': ['hbot', 'oxygen', 'chamber', 'pressure'],
    'hyper': ['hyperbaric', 'hbot', 'oxygen'],
    'hbot': ['hyperbaric', 'oxygen', 'chamber'],
    'chamber': ['hbot', 'hyperbaric', 'oxygen'],
    'pressure': ['hbot', 'hyperbaric', 'chamber'],
    
    // Light/RLT synonyms
    'light': ['rlt', 'red light', 'photobiomodulation', 'led', 'nir', 'near infrared'],
    'red': ['rlt', 'red light', 'photobiomodulation'],
    'infrared': ['rlt', 'nir', 'near infrared', 'photobiomodulation'],
    'photobiomodulation': ['rlt', 'red light', 'light therapy', 'pbm'],
    'collagen': ['rlt', 'red light', 'skin', 'anti-aging'],
    
    // PEMF synonyms
    'magnetic': ['pemf', 'electromagnetic', 'tesla', 'field'],
    'pemf': ['magnetic', 'electromagnetic', 'frequency', 'pulsed'],
    'frequency': ['pemf', 'brainwave', 'entrainment'],
    'brainwave': ['pemf', 'sleep', 'delta', 'alpha'],
    
    // Hydrogen synonyms
    'hydrogen': ['h2', 'molecular hydrogen', 'hydrogen water', 'antioxidant'],
    'h2': ['hydrogen', 'molecular hydrogen', 'antioxidant'],
    'antioxidant': ['hydrogen', 'h2', 'oxidative stress'],
    
    // General wellness synonyms
    'recovery': ['hbot', 'rlt', 'pemf', 'hydrogen'],
    'sleep': ['pemf', 'brainwave', 'delta'],
    'aging': ['rlt', 'hbot', 'collagen', 'longevity'],
    'longevity': ['hbot', 'rlt', 'anti-aging', 'stack'],
    'wellness': ['hbot', 'rlt', 'pemf', 'hydrogen'],
    'therapy': ['hbot', 'rlt', 'pemf', 'hydrogen'],
    'protocol': ['hbot', 'rlt', 'pemf', 'routine'],
    'energy': ['pemf', 'mitochondria', 'atp', 'rlt'],
    'mitochondria': ['rlt', 'atp', 'energy', 'cellular'],
    'atp': ['mitochondria', 'energy', 'rlt', 'cellular'],
    'inflammation': ['hbot', 'rlt', 'hydrogen', 'recovery'],
    'skin': ['rlt', 'collagen', 'red light', 'beauty'],
    'athletic': ['hbot', 'hydrogen', 'recovery', 'pemf'],
    'pain': ['pemf', 'magnetic', 'recovery'],
    'stress': ['hydrogen', 'pemf', 'sleep'],
};

export const TECH_COLOR_MAP: Record<string, any> = {
    'text-cyan-400': {
        activeBg: 'rgba(6,182,212,0.1)', activeBorder: 'rgba(6,182,212,0.4)', activeShadow: '0 0 30px rgba(0,0,0,0.3)',
        iconActiveBg: '#06b6d4', iconActiveShadow: '0 0 20px rgba(255,255,255,0.4)',
        iconDefaultBg: 'rgba(34,211,238,0.2)', iconDefaultText: '#22d3ee',
        iconHoverShadow: '0 0 15px rgba(34,211,238,0.5)',
        subtitleActive: '#22d3ee', subtitleDefault: 'rgba(34,211,238,0.7)',
        barActive: '#22d3ee',
        arrowActive: '#22d3ee',
        shimmer: 'rgba(6,182,212,0.05)',
    },
    'text-purple-400': {
        activeBg: 'rgba(168,85,247,0.1)', activeBorder: 'rgba(168,85,247,0.4)', activeShadow: '0 0 30px rgba(0,0,0,0.3)',
        iconActiveBg: '#a855f7', iconActiveShadow: '0 0 20px rgba(255,255,255,0.4)',
        iconDefaultBg: 'rgba(192,132,252,0.2)', iconDefaultText: '#c084fc',
        iconHoverShadow: '0 0 15px rgba(192,132,252,0.5)',
        subtitleActive: '#c084fc', subtitleDefault: 'rgba(192,132,252,0.7)',
        barActive: '#c084fc',
        arrowActive: '#c084fc',
        shimmer: 'rgba(168,85,247,0.05)',
    },
    'text-red-400': {
        activeBg: 'rgba(248,113,113,0.1)', activeBorder: 'rgba(248,113,113,0.4)', activeShadow: '0 0 30px rgba(0,0,0,0.3)',
        iconActiveBg: '#f87171', iconActiveShadow: '0 0 20px rgba(255,255,255,0.4)',
        iconDefaultBg: 'rgba(248,113,113,0.2)', iconDefaultText: '#f87171',
        iconHoverShadow: '0 0 15px rgba(248,113,113,0.5)',
        subtitleActive: '#f87171', subtitleDefault: 'rgba(248,113,113,0.7)',
        barActive: '#f87171',
        arrowActive: '#f87171',
        shimmer: 'rgba(248,113,113,0.05)',
    },
    'text-sky-400': {
        activeBg: 'rgba(56,189,248,0.1)', activeBorder: 'rgba(56,189,248,0.4)', activeShadow: '0 0 30px rgba(0,0,0,0.3)',
        iconActiveBg: '#38bdf8', iconActiveShadow: '0 0 20px rgba(255,255,255,0.4)',
        iconDefaultBg: 'rgba(56,189,248,0.2)', iconDefaultText: '#38bdf8',
        iconHoverShadow: '0 0 15px rgba(56,189,248,0.5)',
        subtitleActive: '#38bdf8', subtitleDefault: 'rgba(56,189,248,0.7)',
        barActive: '#38bdf8',
        arrowActive: '#38bdf8',
        shimmer: 'rgba(56,189,248,0.05)',
    },
};

const CONTEXT_ICONS = {
    layout: <Layout className="w-4 h-4" />,
    brain: <Brain className="w-4 h-4" />,
    box: <Box className="w-4 h-4" />,
    bookOpen: <BookOpen className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
    globe: <Globe className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
    microscope: <Microscope className="w-4 h-4" />,
    briefcase: <Briefcase className="w-4 h-4" />,
    messageCircle: <MessageCircle className="w-4 h-4" />,
} as const;

export const CONTEXT_CONFIG_STORE: Record<MenuContext, any> = {
    NEUTRAL: {
        accent: 'text-slate-400',
        glow: 'bg-cyan-500/0',
        relatedTools: ['BUILDER', 'PROTOCOLS', 'PARTNERS', 'LOCATOR'],
        featured: {
            type: 'base',
            title: "Hylono\nIntelligence",
            desc: "Navigate through our multi-modality ecosystem. Hover over any technology or tool to reveal structured insights, protocols, and technical specifications.",
            badge: "System Overview",
            badgeColor: "text-white/60",
            action: "Get Started",
            icon: CONTEXT_ICONS.layout,
        },
        trendingTags: ["Wellness Tech", "Bio-Optimization", "Recovery"],
    },
    HBOT: {
        accent: 'text-cyan-400',
        glow: 'bg-cyan-500/20',
        relatedTools: ['LOCATOR', 'PROTOCOLS'],
        featured: {
            type: 'protocol',
            title: "The Longevity\nStack",
            desc: "Combine Hyperbaric Oxygen with Red Light Therapy to amplify cellular regeneration by up to 300%.",
            badge: "Recommended Protocol",
            badgeColor: "text-cyan-300",
            action: "View Protocol",
            icon: CONTEXT_ICONS.brain,
            scienceScore: 98,
        },
        trendingTags: ["1.3 ATA", "Soft Chambers", "Oxygen Safety"],
    },
    PEMF: {
        accent: 'text-purple-400',
        glow: 'bg-purple-500/20',
        relatedTools: ['BUILDER'],
        featured: {
            type: 'protocol',
            title: "Deep Sleep\nReset",
            desc: "Entrain your brainwaves to Delta frequencies using low-intensity PEMF before bed.",
            badge: "Circadian Protocol",
            badgeColor: "text-purple-300",
            action: "View Protocol",
            icon: CONTEXT_ICONS.brain,
            scienceScore: 92,
        },
        trendingTags: ["Tesla Max", "Alpha Waves", "Bio-feedback"],
    },
    RLT: {
        accent: 'text-red-400',
        glow: 'bg-red-500/20',
        relatedTools: ['BUILDER'],
        featured: {
            type: 'protocol',
            title: "Skin & Collagen\nMatrix",
            desc: "Dual-wavelength irradiation protocol for maximum fibroblast stimulation.",
            badge: "Aesthetic Protocol",
            badgeColor: "text-red-300",
            action: "View Protocol",
            icon: CONTEXT_ICONS.brain,
            scienceScore: 95,
        },
        trendingTags: ["660nm Red", "Collagen Sync", "Irradiance"],
    },
    HYDROGEN: {
        accent: 'text-sky-400',
        glow: 'bg-sky-500/20',
        relatedTools: ['PROTOCOLS'],
        featured: {
            type: 'protocol',
            title: "Oxidative\nDefense",
            desc: "Neutralize free radicals immediately after intense physical exertion.",
            badge: "Recovery Protocol",
            badgeColor: "text-sky-300",
            action: "View Protocol",
            icon: CONTEXT_ICONS.brain,
            scienceScore: 89,
        },
        trendingTags: ["Inhalation", "H2 Water", "ROS Defense"],
    },
    BUILDER: {
        accent: 'text-slate-100',
        glow: 'bg-white/10',
        relatedTools: ['BUILDER'],
        featured: {
            type: 'preview',
            title: "Wellness\nPlanner",
            desc: "Answer a few questions and we'll match you with the right technologies and protocols for your goals.",
            badge: "Stack Builder",
            badgeColor: "text-slate-100",
            action: "Start Planning",
            icon: CONTEXT_ICONS.box,
            points: ["Goal-Based Recommendations", "Budget Optimization", "Protocol Synergies"],
        },
        trendingTags: ["Stack Builder", "Goal Planning", "Protocol Matching"],
    },
    PROTOCOLS: {
        accent: 'text-emerald-400',
        glow: 'bg-emerald-500/10',
        relatedTools: ['PROTOCOLS'],
        featured: {
            type: 'preview',
            title: "The Protocol\nCodex",
            desc: "100+ peer-reviewed bio-stacks combining Hylono modalitites with nutrition and movement.",
            badge: "Library",
            badgeColor: "text-emerald-400",
            action: "Explore Library",
            icon: CONTEXT_ICONS.bookOpen,
            points: ["Multi-Modality Synergies", "Contraindication Safety Check", "Outcome Tracking"],
        },
        trendingTags: ["Bio-Stacks", "Research", "Safety"],
    },
    PARTNERS: {
        accent: 'text-amber-400',
        glow: 'bg-amber-500/10',
        relatedTools: ['PARTNERS', 'LOCATOR'],
        featured: {
            type: 'narrative',
            title: "Elevate Your\nPractice",
            desc: "Join 500+ global clinics integrating Hylono's unified bio-optimization OS into their workflow.",
            badge: "Innovation Partner",
            badgeColor: "text-amber-400",
            action: "Join Network",
            icon: CONTEXT_ICONS.users,
            points: ["Structured Training Academy", "Marketing ROI Kit", "Leads Generation System"],
        },
        trendingTags: ["ROI Calculator", "Marketing", "Clinic Setup"],
    },
    LOCATOR: {
        accent: 'text-teal-400',
        glow: 'bg-teal-500/10',
        relatedTools: ['LOCATOR', 'PARTNERS'],
        featured: {
            type: 'preview',
            title: "Experience\nthe Future",
            desc: "Find verified Hylono Centers near you to try Hyperbaric, PEMF, and RLT protocols first-hand.",
            badge: "Find",
            badgeColor: "text-teal-400",
            action: "Open Map",
            icon: CONTEXT_ICONS.globe,
            points: ["Verified Facility Quality", "Session Booking", "Expert Consultation"],
        },
        trendingTags: ["Verified Hubs", "Nearest Location", "Book Demo"],
    },
    MISSION: {
        accent: 'text-white',
        glow: 'bg-white/5',
        relatedTools: [],
        featured: {
            type: 'narrative',
            title: "Transcending\nBiology",
            desc: "Our mission is to democratize high-performance human potential through physics-based cellular optimization.",
            badge: "Our Philosophy",
            badgeColor: "text-white/80",
            action: "Read Story",
            icon: CONTEXT_ICONS.info,
        },
        trendingTags: ["Future Human", "Democratization", "R&D"],
    },
    SCIENCE: {
        accent: 'text-blue-400',
        glow: 'bg-blue-500/10',
        relatedTools: [],
        featured: {
            type: 'preview',
            title: "The Physics\nof Life",
            desc: "Deep research into Mitochondrial efficiency, Reactive Oxygen Species, and Photobiomodulation.",
            badge: "Research",
            badgeColor: "text-blue-400",
            action: "Explore Studies",
            icon: CONTEXT_ICONS.microscope,
            points: ["Peer-Reviewed Whitepapers", "Case Studies", "Future R&D"],
        },
        trendingTags: ["Mitochondria", "Photons", "ROS"],
    },
    CAREERS: {
        accent: 'text-cyan-400',
        glow: 'bg-cyan-500/10',
        relatedTools: [],
        featured: {
            type: 'narrative',
            title: "Build the\nNext Human",
            desc: "We are looking for radical thinkers in physics, biology, and engineering to solve human aging.",
            badge: "Hiring",
            badgeColor: "text-cyan-400",
            action: "View Openings",
            icon: CONTEXT_ICONS.briefcase,
        },
        trendingTags: ["Bio-Tech engineering", "Open Roles", "Culture"],
    },
    CONTACT: {
        accent: 'text-slate-400',
        glow: 'bg-white/5',
        relatedTools: [],
        featured: {
            type: 'narrative',
            title: "Human\nSupport",
            desc: "Speak with our bio-optimization consultants to tailor a system for your specific goals.",
            badge: "Connect",
            badgeColor: "text-slate-200",
            action: "Start Chat",
            icon: CONTEXT_ICONS.messageCircle,
        },
        trendingTags: ["Live Chat", "Booking", "Inquiry"],
    },
};

export const TECH_CARDS = [
    { context: 'HBOT', title: 'Hyperbaric', subtitle: 'Oxygen', icon: <Wind />, color: 'text-cyan-400' },
    { context: 'PEMF', title: 'PEMF', subtitle: 'Energy', icon: <Zap />, color: 'text-purple-400' },
    { context: 'RLT', title: 'Red Light', subtitle: 'Photons', icon: <Sun />, color: 'text-red-400' },
    { context: 'HYDROGEN', title: 'Hydrogen', subtitle: 'Molecular', icon: <Droplets />, color: 'text-sky-400' },
] as const;
