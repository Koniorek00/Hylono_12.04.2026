import { describe, expect, it } from 'vitest';
import { sanitizeText } from '../../app/api/_shared/validation';

describe('sanitizeText context-aware normalization', () => {
  it('normalizes and lowercases email context', () => {
    const result = sanitizeText('  USER+Tag@Example.COM  ', {
      maxLength: 254,
      context: 'email',
    });

    expect(result).toBe('user+tag@example.com');
  });

  it('keeps phone-safe symbols in phone context', () => {
    const result = sanitizeText(' +48 (123) 456-789 ext.1 ', {
      maxLength: 30,
      context: 'phone',
    });

    expect(result).toBe('+48 (123) 456-789 1');
  });

  it('converts to hyphenated lowercase slug in slug context', () => {
    const result = sanitizeText('  USER Name <> `  ', {
      maxLength: 120,
      context: 'slug',
    });

    expect(result).toBe('user-name');
  });

  it('normalizes multiline text and collapses excessive blank lines', () => {
    const result = sanitizeText('Line 1\r\n\r\n\r\n\tLine 2    test', {
      maxLength: 100,
      context: 'multiline',
    });

    expect(result).toBe('Line 1\n\n Line 2 test');
  });

  it('enforces max length regardless of context', () => {
    const result = sanitizeText('ABCDEFGHIJK', {
      maxLength: 5,
      context: 'default',
    });

    expect(result).toBe('ABCDE');
  });
});
