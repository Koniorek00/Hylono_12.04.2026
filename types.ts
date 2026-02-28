export enum ViewMode {
    STANDARD = 'STANDARD',
    EXPERT = 'EXPERT'
}

export type NavigateFunction = (page: string, tech?: TechType, mode?: string) => void;

export enum TechType {
    HBOT = 'HBOT',
    PEMF = 'PEMF',
    RLT = 'RLT',
    HYDROGEN = 'HYDROGEN',
    EWOT = 'EWOT',
    SAUNA_BLANKET = 'SAUNA_BLANKET',
    EMS = 'EMS',
    VNS = 'VNS',
    HYPOXIC = 'HYPOXIC',
    CRYO = 'CRYO'
}

export interface Synergy {
    targetId: TechType;
    label: string;
    description: string;
    boost: number;
}

export interface TechData {
    id: TechType;
    name: string;
    /** Plain-language display name for the configurator (non-expert audience) */
    friendlyName: string;
    /** One-sentence plain-language description for the configurator */
    plainDescription: string;
    /** Goal tags used by the configurator to pre-select devices per goal */
    goalTags: Array<'recovery' | 'performance' | 'cognitive' | 'sleep' | 'pain' | 'longevity' | 'skin' | 'strength'>;
    /** Emoji icon for configurator goal cards */
    icon: string;
    tagline: string;
    descriptionStandard: string;
    descriptionExpert: string;
    benefits: string[];
    technicalSpecs: { label: string; value: string }[];
    protocolSteps: { title: string; desc: string; duration?: number }[];
    themeColor: string;
    accentColor: string;
    route: string;
    synergies: Synergy[];
    goals: string[];
    price: string;
    rentalPrice?: number; // Monthly rental price in numeric format for calculation
    rentalTerms?: string; // e.g. "3 month min"
    financing: string;
    inventory: {
        available: number;
        reserved: number;
        allowBackorder: boolean;
    };
    roiModel?: {
        avgSessionPrice: number;
        avgSessionsPerMonth: number;
    };
    faqs?: { question: string; answer: string }[];
    addons?: TechAddon[];
    comparisonScores?: {
        recovery: number;
        cognitive: number;
        cellular: number;
        pain: number;
        longevity: number;
    };
    optimalTiming?: 'morning' | 'afternoon' | 'evening' | 'any';
    timingReason?: string;
    contraindications?: Contraindication[];
    drugInteractions?: DrugInteraction[];
    molecularPathways?: string[];
    mechanismBrief?: string;
    lastReviewed?: string; // ISO date string, e.g., "2026-01-15"
    reviewedBy?: string; // e.g., "Dr. Elena Vasquez, MD, PhD"
}

export type SafetyStatus = 'safe' | 'caution' | 'unsafe';

export interface Contraindication {
    condition: string;
    status: SafetyStatus;
    reason: string;
}

export interface DrugInteraction {
    drugName: string;
    status: SafetyStatus;
    reason: string;
}

export interface TechAddon {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string; // or icon component name
    category: 'Essential' | 'Performance' | 'Luxury' | 'Comfort' | 'Safety';
}

export interface BundleConfig {
    items: TechType[];
    discount: number; // Percentage (0.15 for 15%)
    tierName: string; // "Synergy Tier 1", "Clinic Tier"
    savingsMonthly: number;
}

export interface NavItem {
    label: string;
    path: string;
}

export enum ZoneType {
    SANCTUARY = 'SANCTUARY', // Bedroom
    LAB = 'LAB',             // Gym/Active
    STATION = 'STATION'      // Office
}

export interface BiometricData {
    time: string;
    value: number;
}

export enum Tier {
    FOUNDATION = 'FOUNDATION', // Start Light
    CORE = 'CORE',             // Upgrade
    OPTIMIZATION = 'OPTIMIZATION' // Integration
}

export interface Course {
    id: string;
    title: string;
    description: string;
    progress: number;
    modules: { title: string; completed: boolean }[];
    locked: boolean;
}

export interface Device {
    id: string;
    name: string;
    serial: string;
    status: 'ONLINE' | 'OFFLINE' | 'ACTIVE' | 'MAINTENANCE';
    lastSync: string;
    rentalExpiry?: string;
}

export interface ProtocolStep {
    tech: TechType;
    duration: number; // in minutes
    instruction: string;
}

export interface Protocol {
    id: string;
    name: string;
    tagline: string;
    description: string;
    goals: string[];
    steps: ProtocolStep[];
    estimatedTotalTime: number; // in minutes
    stackCoherence: number; // 0-100 (Quantum alignment score)
}

export type BookingStatus = 'idle' | 'booking' | 'confirmed';

export enum BookingMode {
    SESSION = 'SESSION',
    RENTAL = 'RENTAL'
}

// ─── CHAMBER PRODUCT TYPES ────────────────────────────────────────────────────

export type ChamberType = 'monoplace' | 'multiplace' | 'soft';
export type ChamberBrand = 'oxyhelp' | 'asian-series';
export type ChamberTransactionMode = 'buy' | 'rent';

export interface ChamberSpec {
    label: string;
    value: string;
}

export interface ChamberImage {
    role: 'hero' | 'interior' | 'detail' | 'lifestyle' | 'diagram';
    url: string;
    alt: string;
}

export interface ChamberPricing {
    buy: number | null;
    rent: {
        monthly: number | null;
        minimumMonths: number;
        depositMonths: number;
    } | null;
}

export interface ChamberProduct {
    id: string;
    slug: string;
    type: ChamberType;
    brand: ChamberBrand;
    brandLabel: string;
    name: string;
    variantLabel: string;
    fullName: string;
    tagline: string;
    shortDescription: string;
    description: string;
    specifications: ChamberSpec[];
    highlights: string[];
    features: string[];
    certifications: string[];
    transactionModes: ChamberTransactionMode[];
    pricing: ChamberPricing;
    images: ChamberImage[];
    accessories: string[];
    useCases: string[];
    idealFor: string;
    disclaimer: string;
}

export type ChamberFilterState = {
    type: ChamberType | 'all';
    brand: ChamberBrand | 'all';
    transactionMode: ChamberTransactionMode | 'all';
};
