import { describe, expect, it } from 'vitest';
import {
  detectConsentDrift,
  parseConsentCookie,
  parseConsentPayload,
} from '../../src/lib/consentParity';

describe('consentParity', () => {
  it('parses valid consent payload', () => {
    const payload = JSON.stringify({
      essential: true,
      analytics: true,
      marketing: false,
      timestamp: '2026-03-04T00:00:00.000Z',
      version: '1.1',
    });

    const parsed = parseConsentPayload(payload);
    expect(parsed?.essential).toBe(true);
    expect(parsed?.analytics).toBe(true);
    expect(parsed?.marketing).toBe(false);
  });

  it('detects consent drift between localStorage and cookie records', () => {
    const drift = detectConsentDrift(
      {
        essential: true,
        analytics: true,
        marketing: false,
        timestamp: '2026-03-04T00:00:00.000Z',
        version: '1.1',
      },
      {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: '2026-03-04T00:00:00.000Z',
        version: '1.1',
      }
    );

    expect(drift.hasDrift).toBe(true);
    expect(drift.reasons).toContain('analytics-mismatch');
  });

  it('parses consent cookie payload from cookie header', () => {
    const encoded = encodeURIComponent(
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: '2026-03-04T00:00:00.000Z',
        version: '1.1',
      })
    );

    const cookie = `foo=bar; cookieConsent=${encoded}; other=value`;
    const parsed = parseConsentCookie(cookie, 'cookieConsent');

    expect(parsed?.essential).toBe(true);
    expect(parsed?.analytics).toBe(false);
  });
});