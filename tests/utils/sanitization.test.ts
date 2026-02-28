import { describe, it, expect } from 'vitest';
import { isSafeUrl, sanitizeUrl, XSS_TEST_PAYLOADS } from '../../utils/sanitization';

// Note: sanitizeHtml / stripHtml use DOMPurify which requires a full browser DOM.
// jsdom provides this in the test environment. These tests cover the pure-logic
// functions which are fully deterministic.

describe('isSafeUrl', () => {
    it('accepts https URLs', () => {
        expect(isSafeUrl('https://hylono.com')).toBe(true);
    });

    it('accepts http URLs', () => {
        expect(isSafeUrl('http://example.com')).toBe(true);
    });

    it('accepts mailto: links', () => {
        expect(isSafeUrl('mailto:contact@hylono.com')).toBe(true);
    });

    it('accepts tel: links', () => {
        expect(isSafeUrl('tel:+48123456789')).toBe(true);
    });

    it('accepts relative paths starting with /', () => {
        expect(isSafeUrl('/about')).toBe(true);
        expect(isSafeUrl('/legal/privacy')).toBe(true);
    });

    it('accepts anchor links starting with #', () => {
        expect(isSafeUrl('#section-1')).toBe(true);
    });

    it('blocks javascript: protocol', () => {
        expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    });

    it('blocks data: URI', () => {
        expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('blocks vbscript: protocol', () => {
        expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    });

    it('blocks file: protocol', () => {
        expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    });

    it('returns false for null', () => {
        expect(isSafeUrl(null)).toBe(false);
    });

    it('returns false for undefined', () => {
        expect(isSafeUrl(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(isSafeUrl('')).toBe(false);
    });
});

describe('sanitizeUrl', () => {
    it('returns safe URL unchanged (trimmed)', () => {
        expect(sanitizeUrl('https://hylono.com')).toBe('https://hylono.com');
    });

    it('trims whitespace from safe URLs', () => {
        expect(sanitizeUrl('  https://hylono.com  ')).toBe('https://hylono.com');
    });

    it('returns empty string for javascript: URL', () => {
        expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    });

    it('returns empty string for data: URI', () => {
        expect(sanitizeUrl('data:text/html,<h1>oops</h1>')).toBe('');
    });

    it('returns empty string for null', () => {
        expect(sanitizeUrl(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
        expect(sanitizeUrl(undefined)).toBe('');
    });

    it('returns empty string for empty input', () => {
        expect(sanitizeUrl('')).toBe('');
    });
});

describe('XSS_TEST_PAYLOADS', () => {
    it('exports a non-empty array of XSS strings', () => {
        expect(Array.isArray(XSS_TEST_PAYLOADS)).toBe(true);
        expect(XSS_TEST_PAYLOADS.length).toBeGreaterThan(0);
    });

    it('every payload contains a potentially dangerous string', () => {
        const dangerous = ['script', 'onerror', 'javascript', 'onmouseover', 'onload', 'alert', 'svg'];
        XSS_TEST_PAYLOADS.forEach(payload => {
            const lower = payload.toLowerCase();
            const hasDangerous = dangerous.some(d => lower.includes(d));
            expect(hasDangerous).toBe(true);
        });
    });
});
