import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';

export interface PricingResult {
    total: number;
    discount: number;
    finalTotal: number;
    tier: string;
    bundleName: string;
    savingsMessage: string;
}

export const calculateRentalTotal = (selectedTechs: TechType[]): PricingResult => {
    if (selectedTechs.length === 0) {
        return {
            total: 0,
            discount: 0,
            finalTotal: 0,
            tier: 'Standard',
            bundleName: '',
            savingsMessage: 'Add 2+ devices to unlock bundle savings',
        };
    }

    let totalMonthly = 0;
    selectedTechs.forEach(id => {
        const tech = TECH_DETAILS[id];
        if (tech.rentalPrice) {
            totalMonthly += tech.rentalPrice;
        }
    });

    let discountRate = 0;
    let tierName = 'Standard';
    let bundleName = '';

    // Bundle Logic
    if (selectedTechs.length === 2) {
        discountRate = 0.15;
        tierName = 'Synergy Bundle';
        bundleName = 'Synergy Bundle';
    } else if (selectedTechs.length === 3) {
        discountRate = 0.20;
        tierName = 'Performance Stack';
        bundleName = 'Performance Stack';
    } else if (selectedTechs.length >= 4) {
        discountRate = 0.25;
        tierName = 'Clinic Protocol';
        bundleName = 'Clinic Protocol';
    }

    const discountAmount = totalMonthly * discountRate;
    const finalTotal = totalMonthly - discountAmount;

    const savingsMessage = discountAmount > 0
        ? `You save €${discountAmount.toFixed(0)}/mo with this bundle`
        : 'Add 2+ devices to unlock bundle savings';

    return {
        total: totalMonthly,
        discount: discountAmount,
        finalTotal: finalTotal,
        tier: tierName,
        bundleName,
        savingsMessage,
    };
};

/** Pre-configured goal bundles for the wizard Step 1 */
export interface GoalBundle {
    id: string;
    label: string;
    icon: string;
    subtitle: string;
    devices: TechType[];
}

export const GOAL_BUNDLES: GoalBundle[] = [
    {
        id: 'sleep',
        label: 'Sleep Better & Recover',
        icon: '😴',
        subtitle: 'Wake up feeling genuinely rested',
        devices: [TechType.PEMF, TechType.VNS, TechType.SAUNA_BLANKET],
    },
    {
        id: 'performance',
        label: 'Boost Energy & Performance',
        icon: '⚡',
        subtitle: 'More power, faster recovery, sharper edge',
        devices: [TechType.HBOT, TechType.EWOT, TechType.HYPOXIC],
    },
    {
        id: 'cognitive',
        label: 'Mental Clarity & Focus',
        icon: '🧠',
        subtitle: 'Think sharper, stress less, feel present',
        devices: [TechType.HYDROGEN, TechType.VNS, TechType.PEMF],
    },
    {
        id: 'pain',
        label: 'Reduce Pain & Inflammation',
        icon: '🔥',
        subtitle: 'Less discomfort, more mobility, faster healing',
        devices: [TechType.CRYO, TechType.PEMF, TechType.RLT],
    },
    {
        id: 'longevity',
        label: 'Skin, Longevity & Anti-Aging',
        icon: '✨',
        subtitle: 'Look and feel younger from the inside out',
        devices: [TechType.RLT, TechType.SAUNA_BLANKET, TechType.HYDROGEN],
    },
    {
        id: 'strength',
        label: 'Build Strength in Less Time',
        icon: '💪',
        subtitle: 'Full-body results in 20-minute sessions',
        devices: [TechType.EMS, TechType.HBOT, TechType.RLT],
    },
];
