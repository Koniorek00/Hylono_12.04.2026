import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';

export const calculateRentalTotal = (selectedTechs: TechType[]): { total: number, discount: number, finalTotal: number, tier: string } => {
    if (selectedTechs.length === 0) return { total: 0, discount: 0, finalTotal: 0, tier: 'Standard' };

    let totalMonthly = 0;
    selectedTechs.forEach(id => {
        const tech = TECH_DETAILS[id];
        if (tech.rentalPrice) {
            totalMonthly += tech.rentalPrice;
        }
    });

    let discountRate = 0;
    let tierName = 'Standard';

    // Bundle Logic
    if (selectedTechs.length === 2) {
        discountRate = 0.15; // 15% off for 2 items
        tierName = 'Synergy Tier 1';
    } else if (selectedTechs.length >= 3) {
        discountRate = 0.25; // 25% off for 3+ items
        tierName = 'Clinic Tier';
    }

    const discountAmount = totalMonthly * discountRate;
    const finalTotal = totalMonthly - discountAmount;

    return {
        total: totalMonthly,
        discount: discountAmount,
        finalTotal: finalTotal,
        tier: tierName
    };
};
