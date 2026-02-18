/**
 * Hylono AntiGravity - Trace Metadata Utility
 * Enables inline trace annotations for modality claims in UI.
 * 
 * COMPLIANCE: Every claim referencing a modality outcome must be traced.
 */

export interface TraceMetadata {
    trace_id: string;
    sources: string[];
    claim_type: 'wellness' | 'education' | 'outcome';
}

/**
 * Creates a traceable claim string with embedded metadata.
 * The metadata is stored in a global registry for coverage calculation.
 */
const traceRegistry: Map<string, TraceMetadata> = new Map();

export const traceableClaim = (
    text: string,
    meta: TraceMetadata
): string => {
    traceRegistry.set(meta.trace_id, meta);
    return text;
};

export const getTraceRegistry = () => traceRegistry;

/**
 * Pre-defined traces for common claims.
 * Add new traces here as Knowledge Packs are created.
 */
export const TRACE = {
    HBOT_OXYGEN_SATURATION: {
        trace_id: 'TR-HBOT-001',
        sources: ['/research/packs/hbot_safety_claims.md', '/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    HBOT_COGNITIVE_CLARITY: {
        trace_id: 'TR-HBOT-002',
        sources: ['/research/packs/hbot_safety_claims.md', '/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    HBOT_RECOVERY: {
        trace_id: 'TR-HBOT-003',
        sources: ['/research/packs/hbot_safety_claims.md', '/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    PEMF_CELLULAR_CHARGE: {
        trace_id: 'TR-PEMF-001',
        sources: ['/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    PEMF_STRESS_RESILIENCE: {
        trace_id: 'TR-PEMF-002',
        sources: ['/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    RLT_SKIN_VITALITY: {
        trace_id: 'TR-RLT-001',
        sources: ['/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    RLT_MUSCLE_RECOVERY: {
        trace_id: 'TR-RLT-002',
        sources: ['/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    HYDROGEN_ANTIOXIDANT: {
        trace_id: 'TR-H2-001',
        sources: ['/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
    HYDROGEN_NEUROPROTECTION: {
        trace_id: 'TR-H2-002',
        sources: ['/policies/claim_policy.yml'],
        claim_type: 'wellness' as const,
    },
};
