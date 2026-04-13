import { describe, expect, it } from 'vitest';
import {
  buildContactPrefill,
  buildLocatorContactHref,
  buildLocatorContactPrefill,
  normalizeContactIntent,
} from '@/lib/contact-prefill';

describe('contact locator prefill helpers', () => {
  it('normalizes only supported contact intents', () => {
    expect(normalizeContactIntent('curious')).toBe('curious');
    expect(normalizeContactIntent('clinic')).toBe('clinic');
    expect(normalizeContactIntent('unknown')).toBeUndefined();
  });

  it('builds locator contact hrefs with preserved context', () => {
    expect(
      buildLocatorContactHref({
        intent: 'rental',
        country: 'Poland',
        city: 'Warsaw',
        modality: 'HBOT',
      })
    ).toEqual({
      pathname: '/contact',
      query: {
        source: 'locator',
        intent: 'rental',
        country: 'Poland',
        city: 'Warsaw',
        modality: 'HBOT',
      },
    });
  });

  it('creates a contact prefill from locator search params', () => {
    const prefill = buildLocatorContactPrefill(
      new URLSearchParams({
        source: 'locator',
        intent: 'curious',
        country: 'Germany',
        city: 'Berlin',
        modality: 'Hydrogen',
        partnerType: 'Wellness Clinic',
        partnerName: 'Regeneration Center Berlin',
      })
    );

    expect(prefill).toMatchObject({
      intent: 'curious',
      subject: 'Partner locator introduction request',
      interest: 'Hydrogen',
    });
    expect(prefill?.message).toContain('Hylono partner locator');
    expect(prefill?.message).toContain('Requested partner: Regeneration Center Berlin');
    expect(prefill?.message).toContain('Country: Germany');
  });

  it('ignores unrelated search params', () => {
    expect(
      buildLocatorContactPrefill(new URLSearchParams({ source: 'newsletter', intent: 'curious' }))
    ).toBeUndefined();
  });

  it('creates a planner-aware contact prefill when planner context is present', () => {
    const prefill = buildContactPrefill(
      new URLSearchParams({
        source: 'planner',
        goal: 'recovery',
        budgetMode: 'rental',
        budget: '1200',
        modality: 'HBOT',
        space: 'Home room',
        products: 'hbot-st1700',
      })
    );

    expect(prefill).toMatchObject({
      intent: 'rental',
      subject: 'Wellness planner rental follow-up',
      interest: 'hbot',
    });
    expect(prefill?.message).toContain('Hylono wellness planner');
    expect(prefill?.message).toContain('Goals: Recovery');
    expect(prefill?.message).toContain('Budget mode: Rental, EUR 1200/mo');
  });
});
