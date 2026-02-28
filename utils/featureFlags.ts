/**
 * Hylono AntiGravity - Feature Flag Utility
 * Allows for safe, conditional feature activation.
 */

export type FeatureFlag =
    | 'FEAT_AUTH_V2'
    | 'FEAT_NEW_TECH_DETAILS'
    | 'FEAT_HIDE_UNFINISHED_PAGES'
    | 'EXP_LIGHT_THEME'
    | 'STRICT_CLAIM_ENFORCEMENT'
    | 'DEBUG_MODE'
    | 'feature_builder'
    | 'feature_nav_goals'
    | 'feature_header_trust'
    | 'feature_homepage_enhancements'
    | 'feature_content_commerce'
    | 'feature_pdp_trust_hierarchy'
    | 'feature_pdp_evidence'
    | 'feature_pdp_documents'
    | 'feature_pdp_contraindications'
    | 'feature_pdp_spec_annotations'
    | 'feature_pdp_advisor_cta'
    | 'feature_pdp_tradein';

export const BATCH3_FEATURE_FLAGS: FeatureFlag[] = [
    'feature_nav_goals',
    'feature_header_trust',
    'feature_homepage_enhancements',
    'feature_content_commerce',
    'feature_pdp_trust_hierarchy',
    'feature_pdp_evidence',
    'feature_pdp_documents',
    'feature_pdp_contraindications',
    'feature_pdp_spec_annotations',
    'feature_pdp_advisor_cta',
    'feature_pdp_tradein',
];

const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
    FEAT_AUTH_V2: false,
    FEAT_NEW_TECH_DETAILS: false,
    FEAT_HIDE_UNFINISHED_PAGES: true,
    EXP_LIGHT_THEME: true, // Defaulting to true as per new aesthetic pivot
    STRICT_CLAIM_ENFORCEMENT: true,
    DEBUG_MODE: false,
    feature_builder: true,
    feature_nav_goals: false,
    feature_header_trust: false,
    feature_homepage_enhancements: false,
    feature_content_commerce: false,
    feature_pdp_trust_hierarchy: false,
    feature_pdp_evidence: false,
    feature_pdp_documents: false,
    feature_pdp_contraindications: false,
    feature_pdp_spec_annotations: false,
    feature_pdp_advisor_cta: false,
    feature_pdp_tradein: false,
};

/**
 * Checks if a specific feature is enabled.
 * Priority: localStorage override > env variable > default value
 */
export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
    // 1. Check LocalStorage (for testing/dev overrides)
    if (typeof window !== 'undefined') {
        const override = localStorage.getItem(`HYLO_${flag}`);
        if (override === 'true') return true;
        if (override === 'false') return false;
    }

    // 2. Check Environment Variables (Next.js public env format)
    const envKey = `NEXT_PUBLIC_FLAG_${flag}`;
    const envValue = process.env[envKey];
    if (envValue === 'true') return true;
    if (envValue === 'false') return false;

    // 3. Fallback to Default
    return DEFAULT_FLAGS[flag];
};

/**
 * Convenience alias for compatibility with alternate flag naming.
 */
export const isFeatureOn = (flag: FeatureFlag): boolean => isFeatureEnabled(flag);

/**
 * Returns true when any provided flag is enabled.
 */
export const isAnyFeatureEnabled = (flags: FeatureFlag[]): boolean => {
    return flags.some((flag) => isFeatureEnabled(flag));
};

/**
 * Sets a local override for a feature flag.
 */
export const setFeatureOverride = (flag: FeatureFlag, value: boolean | null) => {
    if (typeof window === 'undefined') return;
    if (value === null) {
        localStorage.removeItem(`HYLO_${flag}`);
    } else {
        localStorage.setItem(`HYLO_${flag}`, String(value));
    }
};
