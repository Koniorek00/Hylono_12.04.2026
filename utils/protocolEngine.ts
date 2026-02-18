import { Protocol } from '../types';
import { calculateResonance } from './synergyEngine';

export interface StackResult {
    totalCoherence: number;
    synergyCount: number;
    steps: {
        tech: string;
        duration: number;
        instruction: string;
    }[];
}

/**
 * ProtocolEngine
 * Calculates total stack coherence for multi-modality journeys.
 * Leverages SynergyEngine for pairwise resonance.
 */
export const calculateStackCoherence = (protocol: Protocol): StackResult => {
    const techStack = protocol.steps.map(step => step.tech);
    const { totalScore, activeSynergies } = calculateResonance(techStack);

    // Protocol coherence is the base resonance score, 
    // but weighted by the number of steps and synergy count.
    return {
        totalCoherence: totalScore,
        synergyCount: activeSynergies.length,
        steps: protocol.steps.map(step => ({
            tech: step.tech,
            duration: step.duration,
            instruction: step.instruction
        }))
    };
};
