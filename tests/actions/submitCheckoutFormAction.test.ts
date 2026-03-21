import { describe, expect, it, vi } from 'vitest';
import { POST as checkoutPost } from '../../app/api/checkout/route';

process.env.DATABASE_URL ??= 'https://unit-test.invalid';

const mockInsertValues = vi.fn(async () => undefined);
const mockDb = {
  insert: vi.fn(() => ({
    values: mockInsertValues,
  })),
};

vi.mock('@/lib/db/client', () => ({
  isDatabaseConfigured: () => true,
  getDb: () => mockDb,
  ensureDatabaseReady: vi.fn(async () => undefined),
}));

vi.mock('@/lib/env', () => ({
  env: {
    STRIPE_SECRET_KEY: undefined,
    DATABASE_URL: 'https://unit-test.invalid',
  },
  readRuntimeEnv: (key: string) => process.env[key],
}));

const createValidShipping = () => ({
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan@example.com',
  phone: '+48123123123',
  address: 'Main Street 1',
  city: 'Warsaw',
  postalCode: '00-001',
  country: 'Poland',
});

const createRequest = (
  body: unknown
): Request => {
  return new Request('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

describe('checkout API trusted pricing behavior', () => {
  it('rejects malformed JSON payloads', async () => {
    const request = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    });

    const response = await checkoutPost(request);
    const result = (await response.json()) as { success: boolean; message: string };

    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid');
  });

  it('rejects unknown cart item identifiers', async () => {
    const request = createRequest({
      items: [{ id: 'tech-nonexistent', quantity: 1 }],
      shipping: createValidShipping(),
      paymentMethod: 'financing',
    });

    const response = await checkoutPost(request);
    const result = (await response.json()) as { success: boolean; message: string };

    expect(result.success).toBe(false);
    expect(result.message).toContain('One or more cart items are invalid');
  });

  it('accepts valid trusted catalog item identifiers for non-card flow', async () => {
    const request = createRequest({
      items: [{ id: 'tech-hbot', quantity: 1 }],
      shipping: createValidShipping(),
      paymentMethod: 'financing',
    });

    const response = await checkoutPost(request);
    const result = (await response.json()) as { success: boolean; message: string };

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.message).toContain('Order');
  });

  it('returns 503 when card payments are unavailable (missing Stripe secret)', async () => {
    const request = createRequest({
      items: [{ id: 'tech-hbot', quantity: 1 }],
      shipping: createValidShipping(),
      paymentMethod: 'card',
    });

    const response = await checkoutPost(request);
    const result = (await response.json()) as { success: boolean; message: string };

    expect(response.status).toBe(503);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Card payments are temporarily unavailable');
  });
});
