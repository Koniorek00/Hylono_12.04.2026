import { TechType, Protocol } from '../types';

export const PROTOCOL_REGISTRY: Record<string, Protocol> = {
    'MITO-RESET': {
        id: 'MITO-RESET',
        name: 'Mitochondrial Reset',
        tagline: 'Deep cellular rejuvenation via cascading activation.',
        description: 'A strategic sequence designed to prime cells via PEMF, activate mitochondria via RLT, and maximize energy production through high-pressure oxygen.',
        goals: ['Cellular Energy', 'ATP Boost', 'Systemic Renewal'],
        steps: [
            {
                tech: TechType.PEMF,
                duration: 15,
                instruction: 'Primary electromagnetic field priming at 7.8Hz (Schumann Resonance).'
            },
            {
                tech: TechType.RLT,
                duration: 10,
                instruction: 'Mitochondrial activation via 660nm/850nm light cascading.'
            },
            {
                tech: TechType.HBOT,
                duration: 60,
                instruction: 'High-pressure oxygen saturation at 1.5 ATA to leverage activated pathways.'
            }
        ],
        estimatedTotalTime: 85,
        stackCoherence: 98
    },
    'DEEP-RECOVERY': {
        id: 'DEEP-RECOVERY',
        name: 'Deep Performance Recovery',
        tagline: 'Rapid metabolic waste clearance and tissue repair.',
        description: 'Targeted for high-performance athletes or recovery from intensive physical stress. Focuses on circulation and oxidative balance.',
        goals: ['Muscle Repair', 'Lactate Clearance', 'Inflammation Control'],
        steps: [
            {
                tech: TechType.PEMF,
                duration: 20,
                instruction: 'Vascular optimization and lymphatic priming.'
            },
            {
                tech: TechType.HYDROGEN,
                duration: 30,
                instruction: 'Molecular hydrogen inhalation for selective antioxidant support.'
            },
            {
                tech: TechType.HBOT,
                duration: 60,
                instruction: 'Accelerated tissue repair via systemic hyperoxia.'
            }
        ],
        estimatedTotalTime: 110,
        stackCoherence: 95
    },
    'QUANTUM-CLARITY': {
        id: 'QUANTUM-CLARITY',
        name: 'Quantum Clarity',
        tagline: 'Neurological optimization and peak focus.',
        description: 'A protocol refined for cognitive performance, focusing on neuro-vascular health and selective redox balance.',
        goals: ['Mental Focus', 'Brain Health', 'Neuro-Recovery'],
        steps: [
            {
                tech: TechType.HYDROGEN,
                duration: 30,
                instruction: 'Inhalation for neurological oxidative protection.'
            },
            {
                tech: TechType.HBOT,
                duration: 45,
                instruction: 'Enhanced cerebral oxygenation at 1.3 - 1.5 ATA.'
            }
        ],
        estimatedTotalTime: 75,
        stackCoherence: 92
    }
};
