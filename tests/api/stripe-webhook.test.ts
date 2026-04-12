import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkoutOrdersTable,
  stripeWebhookEventsTable,
} from '../../lib/db/schema';

const checkoutOrdersStore: Array<Record<string, unknown>> = [];
const stripeEventsStore: Array<Record<string, unknown>> = [];

const mockSelectWhere = vi.fn(
  async (table: unknown) =>
    table === stripeWebhookEventsTable ? stripeEventsStore : checkoutOrdersStore
);
const mockSelectFrom = vi.fn((table: unknown) => ({
  where: () => mockSelectWhere(table),
}));
const mockUpdateWhere = vi.fn(async () => undefined);
const mockUpdateSet = vi.fn(
  (updates: Record<string, unknown>) => ({
    where: async () => {
      const existing = checkoutOrdersStore[0];
      if (existing) {
        Object.assign(existing, updates);
      }

      await mockUpdateWhere();
    },
  })
);
const mockInsertValues = vi.fn((payload: Record<string, unknown>) => ({
  onConflictDoNothing: async () => {
    stripeEventsStore.push(payload);
  },
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
    STRIPE_WEBHOOK_SECRET: 'whsec_test',
  },
  readRuntimeEnv: (key: string) => process.env[key],
}));

const { POST: postStripeWebhook } = await import(
  '../../app/api/webhooks/stripe/route'
);

const signStripePayload = (payload: string): string => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', 'whsec_test')
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
};

describe('stripe webhook route', () => {
  beforeEach(() => {
    checkoutOrdersStore.length = 0;
    stripeEventsStore.length = 0;
    mockInsertValues.mockClear();
    mockSelectWhere.mockClear();
    mockUpdateWhere.mockClear();
  });

  it('marks a checkout order as paid for payment_intent.succeeded', async () => {
    checkoutOrdersStore.push({
      orderId: 'HYL-PAID-001',
      stripePaymentIntentId: 'pi_paid_001',
      status: 'payment_intent_created',
      updatedAt: new Date(),
    });

    const payload = JSON.stringify({
      id: 'evt_paid_001',
      type: 'payment_intent.succeeded',
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      data: {
        object: {
          id: 'pi_paid_001',
          object: 'payment_intent',
          metadata: {
            orderId: 'HYL-PAID-001',
          },
        },
      },
    });

    const response = await postStripeWebhook(
      new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': signStripePayload(payload),
        },
        body: payload,
      })
    );

    const result = (await response.json()) as {
      received: boolean;
      status?: string;
    };

    expect(response.status).toBe(200);
    expect(result.received).toBe(true);
    expect(result.status).toBe('payment_succeeded');
    expect(checkoutOrdersStore[0]?.status).toBe('payment_succeeded');
    expect(stripeEventsStore[0]?.id).toBe('evt_paid_001');
  });

  it('treats an already-processed event as idempotent', async () => {
    stripeEventsStore.push({
      id: 'evt_duplicate_001',
      eventType: 'payment_intent.succeeded',
      stripePaymentIntentId: 'pi_duplicate_001',
      orderId: 'HYL-DUP-001',
    });

    const payload = JSON.stringify({
      id: 'evt_duplicate_001',
      type: 'payment_intent.succeeded',
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      data: {
        object: {
          id: 'pi_duplicate_001',
          object: 'payment_intent',
          metadata: {
            orderId: 'HYL-DUP-001',
          },
        },
      },
    });

    const response = await postStripeWebhook(
      new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': signStripePayload(payload),
        },
        body: payload,
      })
    );

    const result = (await response.json()) as {
      duplicate?: boolean;
      received: boolean;
    };

    expect(response.status).toBe(200);
    expect(result.received).toBe(true);
    expect(result.duplicate).toBe(true);
    expect(mockInsertValues).not.toHaveBeenCalled();
  });
});
