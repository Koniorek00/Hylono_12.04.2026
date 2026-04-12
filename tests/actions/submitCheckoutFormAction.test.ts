import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as checkoutPost } from '../../app/api/checkout/route';

process.env.DATABASE_URL ??= 'https://unit-test.invalid';

const checkoutOrdersStore: Array<Record<string, unknown>> = [];

const mockInsertValues = vi.fn(async (payload: Record<string, unknown>) => {
  checkoutOrdersStore.push({
    createdAt: payload.createdAt ?? new Date(),
    updatedAt: payload.updatedAt ?? new Date(),
    ...payload,
  });
});
const mockSelectWhere = vi.fn(async () => checkoutOrdersStore);
const mockSelectFrom = vi.fn(() => ({
  where: mockSelectWhere,
}));
const mockUpdateWhere = vi.fn(async () => undefined);
const mockUpdateSet = vi.fn(() => ({
  where: mockUpdateWhere,
}));
const mockDb = {
  insert: vi.fn(() => ({
    values: mockInsertValues,
  })),
  select: vi.fn(() => ({
    from: mockSelectFrom,
  })),
  update: vi.fn(() => ({
    set: mockUpdateSet,
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
  beforeEach(() => {
    checkoutOrdersStore.length = 0;
    mockInsertValues.mockClear();
    mockSelectWhere.mockClear();
    mockUpdateWhere.mockClear();
  });

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
    expect(checkoutOrdersStore[0]?.status).toBe('pending_card_configuration');
  });

  it('deduplicates repeated offline checkout submissions', async () => {
    const requestBody = {
      items: [{ id: 'tech-hbot', quantity: 1 }],
      shipping: createValidShipping(),
      paymentMethod: 'financing',
    };

    const firstResponse = await checkoutPost(createRequest(requestBody));
    const firstResult = (await firstResponse.json()) as {
      orderId?: string;
      success: boolean;
    };

    const secondResponse = await checkoutPost(createRequest(requestBody));
    const secondResult = (await secondResponse.json()) as {
      orderId?: string;
      success: boolean;
    };

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(true);
    expect(secondResult.orderId).toBe(firstResult.orderId);
    expect(mockInsertValues).toHaveBeenCalledTimes(1);
  });
});
