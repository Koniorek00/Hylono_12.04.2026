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
    | 'DEBUG_MODE';

const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
    FEAT_AUTH_V2: false,
    FEAT_NEW_TECH_DETAILS: false,
    FEAT_HIDE_UNFINISHED_PAGES: true,
    EXP_LIGHT_THEME: true, // Defaulting to true as per new aesthetic pivot
    STRICT_CLAIM_ENFORCEMENT: true,
    DEBUG_MODE: false,
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

    // 2. Check Environment Variables (Vite format)
    const envKey = `VITE_FLAG_${flag}`;
    // Dynamic key access on import.meta.env — TypeScript may not infer this, hence the cast
    const envValue = (import.meta.env as Record<string, string | undefined>)[envKey];
    if (envValue === 'true') return true;
    if (envValue === 'false') return false;

    // 3. Fallback to Default
    return DEFAULT_FLAGS[flag];
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
