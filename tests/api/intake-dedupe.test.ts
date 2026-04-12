import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetRateLimitStoreForTests } from '../../app/api/_shared/rate-limit';
import {
  bookingRequestsTable,
  contactInquiriesTable,
} from '../../lib/db/schema';

const contactStore: Array<Record<string, unknown>> = [];
const bookingStore: Array<Record<string, unknown>> = [];

const mockSelectWhere = vi.fn(
  async (table: unknown) =>
    table === contactInquiriesTable ? contactStore : bookingStore
);
const mockSelectFrom = vi.fn((table: unknown) => ({
  where: () => mockSelectWhere(table),
}));
const mockInsertValues = vi.fn(
  async (table: unknown, payload: Record<string, unknown>) => {
    const record = {
      createdAt: payload.createdAt ?? new Date(),
      ...payload,
    };

    if (table === contactInquiriesTable) {
      contactStore.push(record);
      return;
    }

    bookingStore.push(record);
  }
);

const mockDb = {
  insert: vi.fn((table: unknown) => ({
    values: (payload: Record<string, unknown>) => mockInsertValues(table, payload),
  })),
  select: vi.fn(() => ({
    from: mockSelectFrom,
  })),
};

vi.mock('@/lib/db/client', () => ({
  isDatabaseConfigured: () => true,
  getDb: () => mockDb,
  ensureDatabaseReady: vi.fn(async () => undefined),
}));

vi.mock('@/lib/env', () => ({
  env: {
    RESEND_API_KEY: undefined,
  },
  readRuntimeEnv: (key: string) => process.env[key],
}));

vi.mock('@/lib/integrations/n8n', () => ({
  dispatchIntakeEventToN8n: vi.fn(async () => undefined),
}));

vi.mock('@/lib/integrations/novu', () => ({
  syncAndNotifySubscriberViaNovu: vi.fn(async () => undefined),
}));

vi.mock('@/lib/integrations/twenty', () => ({
  syncPersonAndFollowUpToTwenty: vi.fn(async () => undefined),
}));

const { POST: postBooking } = await import('../../app/api/booking/route');
const { POST: postContact } = await import('../../app/api/contact/route');

const createJsonRequest = (path: string, body: unknown): Request =>
  new Request(`http://localhost:3000${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

describe('lead intake duplicate submission protection', () => {
  beforeEach(() => {
    contactStore.length = 0;
    bookingStore.length = 0;
    resetRateLimitStoreForTests();
    vi.clearAllMocks();
  });

  it('returns the original ticket for duplicate contact submissions', async () => {
    const payload = {
      name: 'Ada Contact',
      email: 'ada@example.com',
      subject: 'Support request',
      message: 'I need help understanding the next best system for recovery.',
      inquiryType: 'general',
    };

    const firstResponse = await postContact(
      createJsonRequest('/api/contact', payload)
    );
    const firstResult = (await firstResponse.json()) as {
      success: boolean;
      ticketId?: string;
    };

    const secondResponse = await postContact(
      createJsonRequest('/api/contact', payload)
    );
    const secondResult = (await secondResponse.json()) as {
      success: boolean;
      ticketId?: string;
    };

    expect(firstResponse.status).toBe(202);
    expect(secondResponse.status).toBe(200);
    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(true);
    expect(secondResult.ticketId).toBe(firstResult.ticketId);
    expect(contactStore).toHaveLength(1);
  });

  it('returns the original reference for duplicate booking submissions', async () => {
    const payload = {
      name: 'Ada Booking',
      email: 'ada@example.com',
      preferredDate: '2026-04-20',
      preferredTime: '10:00',
      bookingType: 'consultation',
      techInterest: 'HBOT',
    };

    const firstResponse = await postBooking(
      createJsonRequest('/api/booking', payload)
    );
    const firstResult = (await firstResponse.json()) as {
      bookingRef?: string;
      success: boolean;
    };

    const secondResponse = await postBooking(
      createJsonRequest('/api/booking', payload)
    );
    const secondResult = (await secondResponse.json()) as {
      bookingRef?: string;
      success: boolean;
    };

    expect(firstResponse.status).toBe(202);
    expect(secondResponse.status).toBe(200);
    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(true);
    expect(secondResult.bookingRef).toBe(firstResult.bookingRef);
    expect(bookingStore).toHaveLength(1);
  });
});
