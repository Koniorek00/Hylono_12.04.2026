import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockInsertValues = vi.fn(async () => undefined);
const mockDb = {
  insert: vi.fn(() => ({
    values: mockInsertValues,
  })),
};

const mockDispatchIntakeEventToN8n = vi.fn(async () => undefined);
const mockSyncAndNotifySubscriberViaNovu = vi.fn(async () => undefined);
const mockSyncPersonAndFollowUpToTwenty = vi.fn(async () => undefined);

vi.mock('@/lib/db/client', () => ({
  isDatabaseConfigured: () => true,
  getDb: () => mockDb,
  ensureDatabaseReady: vi.fn(async () => undefined),
}));

vi.mock('@/lib/env', () => ({
  env: {
    RESEND_API_KEY: undefined,
    STRIPE_SECRET_KEY: undefined,
  },
  readRuntimeEnv: (key: string) => process.env[key],
}));

vi.mock('@/lib/integrations/n8n', () => ({
  dispatchIntakeEventToN8n: mockDispatchIntakeEventToN8n,
}));

vi.mock('@/lib/integrations/novu', () => ({
  syncAndNotifySubscriberViaNovu: mockSyncAndNotifySubscriberViaNovu,
}));

vi.mock('@/lib/integrations/twenty', () => ({
  syncPersonAndFollowUpToTwenty: mockSyncPersonAndFollowUpToTwenty,
}));

const { POST: postBooking } = await import('../../app/api/booking/route');
const { POST: postCheckout } = await import('../../app/api/checkout/route');
const { POST: postContact } = await import('../../app/api/contact/route');
const { POST: postRental } = await import('../../app/api/rental/route');

const createJsonRequest = (path: string, body: unknown): Request =>
  new Request(`http://localhost:3000${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

describe('Phase 2 Twenty follow-ups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a company-aware contact follow-up task', async () => {
    const response = await postContact(
      createJsonRequest('/api/contact', {
        name: 'Jane Operator',
        email: 'jane@acme-medtech.com',
        subject: 'Partnership inquiry',
        message: 'We want to discuss a clinical pilot for the Hylono stack.',
        inquiryType: 'b2b',
      })
    );

    expect(response.status).toBe(202);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledTimes(1);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'jane@acme-medtech.com',
        companyName: 'acme-medtech.com',
        source: 'contact:b2b',
        taskTitle: expect.stringContaining('Contact follow-up'),
        taskBodyText: expect.stringContaining('Company: acme-medtech.com'),
      })
    );
  });

  it('creates a company-aware booking follow-up task', async () => {
    const response = await postBooking(
      createJsonRequest('/api/booking', {
        name: 'Jonas Clinic',
        email: 'jonas@acme-medtech.com',
        bookingType: 'demo',
        preferredDate: '2026-04-10',
        preferredTime: '10:30',
        techInterest: 'HBOT',
      })
    );

    expect(response.status).toBe(202);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledTimes(1);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'jonas@acme-medtech.com',
        companyName: 'acme-medtech.com',
        source: 'booking:demo',
        taskTitle: expect.stringContaining('Booking follow-up'),
        taskBodyText: expect.stringContaining('Company: acme-medtech.com'),
      })
    );
  });

  it('creates a checkout opportunity and task for the customer company', async () => {
    const response = await postCheckout(
      createJsonRequest('/api/checkout', {
        items: [{ id: 'tech-hbot', quantity: 1 }],
        shipping: {
          firstName: 'Anna',
          lastName: 'Seller',
          email: 'anna@acme-medtech.com',
          phone: '+48123123123',
          address: 'Main Street 1',
          city: 'Warsaw',
          postalCode: '00-001',
          country: 'Poland',
        },
        paymentMethod: 'financing',
      })
    );

    expect(response.status).toBe(200);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledTimes(1);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'anna@acme-medtech.com',
        companyName: 'acme-medtech.com',
        source: 'checkout:financing',
        taskTitle: expect.stringContaining('Checkout follow-up'),
        taskBodyText: expect.stringContaining('Company: acme-medtech.com'),
        opportunity: expect.objectContaining({
          currencyCode: 'PLN',
          stage: 'NEW',
        }),
      })
    );
  });

  it('creates a rental opportunity for an email-backed customer', async () => {
    const response = await postRental(
      createJsonRequest('/api/rental', {
        userId: 'rental-ops',
        fullName: 'Rental Operator',
        email: 'ops@acme-medtech.com',
        phone: '+48123123123',
        address: 'Main Street 1',
        city: 'Warsaw',
        postalCode: '00-001',
        country: 'Poland',
        termMonths: 12,
        items: [
          {
            techId: 'tech-hbot',
            quantity: 2,
            monthlyPrice: 249.5,
          },
        ],
      })
    );

    expect(response.status).toBe(201);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledTimes(1);
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ops@acme-medtech.com',
        companyName: 'acme-medtech.com',
        source: 'rental:pending',
        taskTitle: expect.stringContaining('Rental follow-up'),
        taskBodyText: expect.stringContaining('Estimated contract value:'),
        opportunity: expect.objectContaining({
          name: expect.stringContaining('Rental request'),
          currencyCode: 'EUR',
          stage: 'NEW',
        }),
      })
    );
  });
});
