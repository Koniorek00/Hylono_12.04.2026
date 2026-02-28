import { describe, it, expect } from 'vitest';

// Pure validation helpers extracted from app/api/newsletter/route.ts logic.
// We test the validation rules in isolation without spinning up the HTTP server.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateNewsletterEmail(email: unknown): { valid: boolean; message: string } {
    if (!email || typeof email !== 'string') {
        return { valid: false, message: 'Email is required' };
    }
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
        return { valid: false, message: 'Invalid email format' };
    }
    if (trimmed.length > 254) {
        return { valid: false, message: 'Email too long' };
    }
    return { valid: true, message: 'OK' };
}

describe('Newsletter email validation', () => {
    it('accepts valid email', () => {
        expect(validateNewsletterEmail('user@example.com').valid).toBe(true);
    });

    it('accepts email with subdomain', () => {
        expect(validateNewsletterEmail('user@mail.example.com').valid).toBe(true);
    });

    it('accepts email with plus addressing', () => {
        expect(validateNewsletterEmail('user+tag@example.com').valid).toBe(true);
    });

    it('rejects missing @', () => {
        const result = validateNewsletterEmail('notanemail');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('Invalid email');
    });

    it('rejects missing TLD', () => {
        expect(validateNewsletterEmail('user@domain').valid).toBe(false);
    });

    it('rejects empty string', () => {
        const result = validateNewsletterEmail('');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Email is required');
    });

    it('rejects null', () => {
        const result = validateNewsletterEmail(null);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Email is required');
    });

    it('rejects email over 254 chars', () => {
        const longEmail = 'a'.repeat(245) + '@b.com'; // 252 chars, fine
        expect(validateNewsletterEmail(longEmail).valid).toBe(true);

        const tooLong = 'a'.repeat(250) + '@b.com'; // 257 chars
        expect(validateNewsletterEmail(tooLong).valid).toBe(false);
    });

    it('rejects email with spaces', () => {
        // Trimming handles leading/trailing, but internal spaces fail regex
        expect(validateNewsletterEmail('us er@example.com').valid).toBe(false);
    });
});

describe('Newsletter source validation', () => {
    const VALID_SOURCES = ['footer', 'home', 'popup', 'blog'];

    function validateSource(source: unknown): boolean {
        if (!source) return true; // source is optional
        return VALID_SOURCES.includes(source as string);
    }

    it('accepts valid source "footer"', () => {
        expect(validateSource('footer')).toBe(true);
    });

    it('accepts valid source "home"', () => {
        expect(validateSource('home')).toBe(true);
    });

    it('accepts undefined source (optional field)', () => {
        expect(validateSource(undefined)).toBe(true);
    });

    it('rejects unknown source string', () => {
        expect(validateSource('unknown-source-xss')).toBe(false);
    });
});
