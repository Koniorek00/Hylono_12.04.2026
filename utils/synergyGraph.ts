/**
 * Synergy Knowledge Graph
 * 
 * This module provides the intelligence layer for protocol synergy calculations.
 * It enables the UI to show real-time synergy recommendations based on selected technologies.
 */

import { TechType, Synergy } from '../types';
import { TECH_DETAILS } from '../constants';

// Node in the synergy graph
export interface SynergyNode {
    techId: TechType;
    name: string;
    connections: SynergyEdge[];
}

// Edge connecting two technologies
export interface SynergyEdge {
    to: TechType;
    label: string;
    boost: number; // Percentage increase in effectiveness
    description: string;
    bidirectional: boolean;
}

// Stack configuration with computed synergy score
export interface StackConfiguration {
    technologies: TechType[];
    totalBoost: number;
    stackName: string;
    coherenceScore: number; // 0-100 based on complementary effects
}

/**
 * Build the synergy graph from TECH_DETAILS constants
 */
export function buildSynergyGraph(): Map<TechType, SynergyNode> {
    const graph = new Map<TechType, SynergyNode>();

    // Initialize nodes
    for (const tech of Object.values(TechType)) {
        const techData = TECH_DETAILS[tech];
        graph.set(tech, {
            techId: tech,
            name: techData.name,
            connections: techData.synergies.map(syn => ({
                to: syn.targetId,
                label: syn.label,
                boost: syn.boost,
                description: syn.description,
                bidirectional: true, // Assume bidirectional for now
            })),
        });
    }

    return graph;
}

/**
 * Calculate total synergy boost for a stack of technologies
 */
export function calculateStackSynergy(stack: TechType[]): StackConfiguration {
    if (stack.length === 0) {
        return { technologies: [], totalBoost: 0, stackName: 'Empty', coherenceScore: 0 };
    }

    if (stack.length === 1) {
        return {
            technologies: stack,
            totalBoost: 0,
            stackName: TECH_DETAILS[stack[0]].name,
            coherenceScore: 50
        };
    }

    const graph = buildSynergyGraph();
    let totalBoost = 0;
    let matchedPairs = 0;
    const maxPairs = (stack.length * (stack.length - 1)) / 2;

    // Find all synergies between technologies in the stack
    for (let i = 0; i < stack.length; i++) {
        const node = graph.get(stack[i]);
        if (!node) continue;

        for (let j = i + 1; j < stack.length; j++) {
            const targetTech = stack[j];
            const edge = node.connections.find(e => e.to === targetTech);
            if (edge) {
                totalBoost += edge.boost;
                matchedPairs++;
            }
        }
    }

    // Coherence is based on how many synergies exist between stack members
    const coherenceScore = maxPairs > 0 ? Math.round((matchedPairs / maxPairs) * 100) : 0;

    // Generate stack name based on primary synergy
    let stackName = 'Custom Stack';
    if (stack.includes(TechType.HBOT) && stack.includes(TechType.HYDROGEN)) {
        stackName = 'Recovery Gold Standard';
    } else if (stack.includes(TechType.PEMF) && stack.includes(TechType.RLT)) {
        stackName = 'Tissue Repair Stack';
    } else if (stack.length === 4) {
        stackName = 'Complete Bio-Optimization';
    }

    return {
        technologies: stack,
        totalBoost,
        stackName,
        coherenceScore,
    };
}

/**
 * Get recommended additions to a stack based on synergy potential
 */
export function getStackRecommendations(currentStack: TechType[]): Array<{
    tech: TechType;
    potentialBoost: number;
    reason: string;
}> {
    const graph = buildSynergyGraph();
    const recommendations: Array<{
        tech: TechType;
        potentialBoost: number;
        reason: string;
    }> = [];

    const allTechs = Object.values(TechType);
    const availableTechs = allTechs.filter(t => !currentStack.includes(t));

    for (const candidate of availableTechs) {
        let potentialBoost = 0;
        let bestSynergy = '';

        // Check synergies with each tech in current stack
        for (const existing of currentStack) {
            const node = graph.get(existing);
            if (!node) continue;

            const edge = node.connections.find(e => e.to === candidate);
            if (edge) {
                potentialBoost += edge.boost;
                if (!bestSynergy || edge.boost > potentialBoost) {
                    bestSynergy = edge.label;
                }
            }
        }

        if (potentialBoost > 0) {
            recommendations.push({
                tech: candidate,
                potentialBoost,
                reason: bestSynergy || `Synergizes with ${TECH_DETAILS[currentStack[0]].name}`,
            });
        }
    }

    // Sort by potential boost (highest first)
    return recommendations.sort((a, b) => b.potentialBoost - a.potentialBoost);
}

/**
 * Pre-computed optimal stacks for quick access
 */
export const OPTIMAL_STACKS: StackConfiguration[] = [
    calculateStackSynergy([TechType.HBOT, TechType.HYDROGEN]),
    calculateStackSynergy([TechType.PEMF, TechType.RLT]),
    calculateStackSynergy([TechType.HBOT, TechType.PEMF, TechType.HYDROGEN]),
    calculateStackSynergy([TechType.HBOT, TechType.PEMF, TechType.RLT, TechType.HYDROGEN]),
];
