export enum ViewMode {
    STANDARD = 'STANDARD',
    EXPERT = 'EXPERT'
}

export type NavigateFunction = (page: string, tech?: TechType, mode?: string) => void;

export enum TechType {
    HBOT = 'HBOT',
    PEMF = 'PEMF',
    RLT = 'RLT',
    HYDROGEN = 'HYDROGEN'
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