import { describe, expect, it } from 'vitest';
import {
  getRentalPlanOptions,
  resolveRentalPlan,
  resolveRentalProductId,
} from '../../lib/commerce/rental-catalog';

describe('rental catalog helpers', () => {
  it('resolves common rental aliases to product ids', () => {
    expect(resolveRentalProductId('hbot')).toBe('hbot-st1700');
    expect(resolveRentalProductId('HBOT')).toBe('hbot-st1700');
    expect(resolveRentalProductId('tech-hbot')).toBe('hbot-st1700');
    expect(resolveRentalProductId('hydrogen')).toBe('h2-hop450');
    expect(resolveRentalProductId('tech-h2')).toBe('h2-hop450');
  });

  it('returns available plan options for canonical and aliased ids', () => {
    expect(getRentalPlanOptions('hbot-st1700')).toHaveLength(3);
    expect(getRentalPlanOptions('hbot')).toHaveLength(3);
    expect(getRentalPlanOptions('hydrogen')).toHaveLength(3);
  });

  it('resolves a requested term for aliased ids', () => {
    expect(resolveRentalPlan('hbot', 6)).toMatchObject({
      productId: 'hbot-st1700',
      termMonths: 6,
      monthlyPrice: 1099,
    });

    expect(resolveRentalPlan('hydrogen', 3)).toMatchObject({
      productId: 'h2-hop450',
      termMonths: 3,
      monthlyPrice: 179,
    });
  });
});
