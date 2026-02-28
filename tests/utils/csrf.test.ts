import { describe, it, expect, beforeEach } from 'vitest';
import {
    generateCSRFToken,
    validateCSRFToken,
    getCSRFToken,
    clearCSRFToken,
} from '../../utils/csrf';

describe('generateCSRFToken', () => {
    it('returns a 64-character hex string', () => {
        const token = generateCSRFToken();
        expect(token).toHaveLength(64);
        expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it('generates unique tokens each call', () => {
        const tokens = new Set(Array.from({ length: 20 }, () => generateCSRFToken()));
        // All 20 should be unique (collision probability is astronomically low)
        expect(tokens.size).toBe(20);
    });
});

describe('validateCSRFToken', () => {
    it('returns true for matching tokens', () => {
        const token = generateCSRFToken();
        expect(validateCSRFToken(token, token)).toBe(true);
    });

    it('returns false for different tokens', () => {
        const a = generateCSRFToken();
        const b = generateCSRFToken();
        expect(validateCSRFToken(a, b)).toBe(false);
    });

    it('returns false for empty token', () => {
        const token = generateCSRFToken();
        expect(validateCSRFToken('', token)).toBe(false);
    });

    it('returns false for empty stored token', () => {
        const token = generateCSRFToken();
        expect(validateCSRFToken(token, '')).toBe(false);
    });

    it('returns false when both are empty', () => {
        expect(validateCSRFToken('', '')).toBe(false);
    });

    it('returns false for tokens of different lengths', () => {
        expect(validateCSRFToken('abc', 'abcd')).toBe(false);
    });

    it('is case-sensitive', () => {
        const lower = 'aabbcc';
        const upper = 'AABBCC';
        expect(validateCSRFToken(lower, upper)).toBe(false);
    });
});

describe('getCSRFToken', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('creates a new token when none exists', () => {
        const token = getCSRFToken();
        expect(token).toHaveLength(64);
        expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it('returns the same token on subsequent calls (session persistence)', () => {
        const first = getCSRFToken();
        const second = getCSRFToken();
        expect(first).toBe(second);
    });

    it('stores token in sessionStorage', () => {
        const token = getCSRFToken();
        expect(sessionStorage.getItem('hylono_csrf_token')).toBe(token);
    });
});

describe('clearCSRFToken', () => {
    it('removes token from sessionStorage', () => {
        getCSRFToken(); // create one first
        expect(sessionStorage.getItem('hylono_csrf_token')).not.toBeNull();
        clearCSRFToken();
        expect(sessionStorage.getItem('hylono_csrf_token')).toBeNull();
    });

    it('calling getCSRFToken after clear creates a new token', () => {
        const first = getCSRFToken();
        clearCSRFToken();
        const second = getCSRFToken();
        // New token will almost certainly differ
        expect(second).toHaveLength(64);
        // Tokens SHOULD be different (astronomically unlikely to match)
        expect(second).not.toBe(first);
    });
});
