import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    isFeatureEnabled,
    setFeatureOverride,
    type FeatureFlag,
} from '../../utils/featureFlags';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG: FeatureFlag = 'DEBUG_MODE'; // Default: false — good for override tests
const FLAG_TRUE_DEFAULT: FeatureFlag = 'FEAT_HIDE_UNFINISHED_PAGES'; // Default: true

// ─── isFeatureEnabled (default values) ───────────────────────────────────────

describe('isFeatureEnabled — default values', () => {
    beforeEach(() => {
        // Clean any previous localStorage overrides
        localStorage.clear();
    });

    it('returns false for DEBUG_MODE (default false)', () => {
        expect(isFeatureEnabled('DEBUG_MODE')).toBe(false);
    });

    it('returns false for FEAT_AUTH_V2 (default false)', () => {
        expect(isFeatureEnabled('FEAT_AUTH_V2')).toBe(false);
    });

    it('returns false for FEAT_NEW_TECH_DETAILS (default false)', () => {
        expect(isFeatureEnabled('FEAT_NEW_TECH_DETAILS')).toBe(false);
    });

    it('returns true for FEAT_HIDE_UNFINISHED_PAGES (default true)', () => {
        expect(isFeatureEnabled('FEAT_HIDE_UNFINISHED_PAGES')).toBe(true);
    });

    it('returns true for EXP_LIGHT_THEME (default true)', () => {
        expect(isFeatureEnabled('EXP_LIGHT_THEME')).toBe(true);
    });

    it('returns true for STRICT_CLAIM_ENFORCEMENT (default true)', () => {
        expect(isFeatureEnabled('STRICT_CLAIM_ENFORCEMENT')).toBe(true);
    });
});

// ─── isFeatureEnabled (localStorage overrides) ────────────────────────────────

describe('isFeatureEnabled — localStorage overrides', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('overrides default false → true via localStorage', () => {
        localStorage.setItem(`HYLO_${FLAG}`, 'true');
        expect(isFeatureEnabled(FLAG)).toBe(true);
    });

    it('overrides default true → false via localStorage', () => {
        localStorage.setItem(`HYLO_${FLAG_TRUE_DEFAULT}`, 'false');
        expect(isFeatureEnabled(FLAG_TRUE_DEFAULT)).toBe(false);
    });

    it('ignores unrecognised localStorage value and falls back to default', () => {
        localStorage.setItem(`HYLO_${FLAG}`, 'yes_please');
        // 'yes_please' is neither 'true' nor 'false' — should fall back
        expect(isFeatureEnabled(FLAG)).toBe(false);
    });
});

// ─── setFeatureOverride ────────────────────────────────────────────────────────

describe('setFeatureOverride', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('sets override to true in localStorage', () => {
        setFeatureOverride(FLAG, true);
        expect(localStorage.getItem(`HYLO_${FLAG}`)).toBe('true');
    });

    it('sets override to false in localStorage', () => {
        setFeatureOverride(FLAG, false);
        expect(localStorage.getItem(`HYLO_${FLAG}`)).toBe('false');
    });

    it('removes override when null is passed', () => {
        setFeatureOverride(FLAG, true);
        setFeatureOverride(FLAG, null);
        expect(localStorage.getItem(`HYLO_${FLAG}`)).toBeNull();
    });

    it('isFeatureEnabled reflects the override after setFeatureOverride(true)', () => {
        setFeatureOverride(FLAG, true); // FLAG default is false
        expect(isFeatureEnabled(FLAG)).toBe(true);
    });

    it('isFeatureEnabled reflects the override after setFeatureOverride(false)', () => {
        setFeatureOverride(FLAG_TRUE_DEFAULT, false); // FLAG_TRUE_DEFAULT default is true
        expect(isFeatureEnabled(FLAG_TRUE_DEFAULT)).toBe(false);
    });

    it('isFeatureEnabled uses default after override is cleared (null)', () => {
        setFeatureOverride(FLAG, true);
        setFeatureOverride(FLAG, null);
        expect(isFeatureEnabled(FLAG)).toBe(false); // back to default
    });

    it('is a no-op when called server-side (window undefined)', () => {
        // Simulate SSR environment by temporarily hiding window
        const originalWindow = globalThis.window;
        delete globalThis.window;

        // Should not throw
        expect(() => setFeatureOverride(FLAG, true)).not.toThrow();

        // Restore
        globalThis.window = originalWindow;
    });
});

// ─── Environment variable overrides ──────────────────────────────────────────

describe('isFeatureEnabled — env variable overrides', () => {
    afterEach(() => {
        localStorage.clear();
        // Clean up any injected env keys
        delete process.env.NEXT_PUBLIC_FLAG_DEBUG_MODE;
    });

    it('localStorage takes priority over env variable', () => {
        // Inject env var saying false, localStorage says true
        process.env.NEXT_PUBLIC_FLAG_DEBUG_MODE = 'false';
        localStorage.setItem('HYLO_DEBUG_MODE', 'true');
        expect(isFeatureEnabled('DEBUG_MODE')).toBe(true); // localStorage wins
    });

    it('env variable overrides default when no localStorage override', () => {
        process.env.NEXT_PUBLIC_FLAG_DEBUG_MODE = 'true';
        expect(isFeatureEnabled('DEBUG_MODE')).toBe(true);
    });
});
