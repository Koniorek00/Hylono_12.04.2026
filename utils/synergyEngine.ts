import { KNOWLEDGE_REGISTRY, KnowledgePack, SynergyItem } from '../constants/knowledge';
import { TechType } from '../types';

export interface ResonanceResult {
    totalScore: number;
    activeSynergies: SynergyItem[];
    recommendation: string;
}

export const calculateResonance = (activeTechs: TechType[]): ResonanceResult => {
    let baseScore = 0;
    const activeSynergies: SynergyItem[] = [];

    // Calculate synergies between all active technologies
    activeTechs.forEach(tech => {
        const pack = KNOWLEDGE_REGISTRY[tech];
        if (pack && pack.synergies) {
            pack.synergies.forEach(synergy => {
                if (activeTechs.includes(synergy.target as TechType)) {
                    baseScore += synergy.boost;
                    activeSynergies.push(synergy);
                }
            });
        }
    });

    // Normalize or cap score (Elite dashboard expectation 0-100% synergy)
    // Base resonance is 80%, synergies add to it
    const totalScore = Math.min(100, 80 + baseScore);

    let recommendation = "Standard alignment active.";
    if (totalScore > 95) {
        recommendation = "Optimal Quantum Coherence achieved. Strategic window maximized.";
    } else if (totalScore > 90) {
        recommendation = "High Resonance identified. Ideal for deep cellular recovery.";
    }

    return {
        totalScore,
        activeSynergies,
        recommendation
    };
};
