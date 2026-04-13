import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetRateLimitStoreForTests } from '../../app/api/_shared/rate-limit';
import { issueMobileAuthSession } from '@/lib/mobile-auth';

const mockDb = {
  insert: vi.fn(),
  select: vi.fn(),
};

const mockInsertValues = vi.fn();
const mockSelectFrom = vi.fn();
const mockSelectWhere = vi.fn();
const mockDispatchIntakeEventToN8n = vi.fn(async () => undefined);
const mockSyncAndNotifySubscriberViaNovu = vi.fn(async () => undefined);
const mockSyncPersonAndFollowUpToTwenty = vi.fn(async () => undefined);
const mockAuth = vi.fn<() => Promise<{ user: { email: string } } | null>>(
  async () => null
);

mockDb.insert.mockReturnValue({ values: mockInsertValues });
mockDb.select.mockReturnValue({
  from: mockSelectFrom,
});
mockSelectFrom.mockReturnValue({ where: mockSelectWhere });

vi.mock('@/lib/db/client', () => ({
  isDatabaseConfigured: () => true,
  getDb: () => mockDb,
  ensureDatabaseReady: vi.fn(async () => undefined),
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

vi.mock('@/lib/auth', () => ({
  auth: mockAuth,
}));

const rentalStoreByUser = new Map<
  string,
  Array<{
    rentalId: string;
    userId: string;
    contact: {
      fullName: string;
      email: string;
      phone?: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
      company?: string;
    } | null;
    items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
    termMonths: number;
    status: 'pending' | 'active' | 'cancelled';
    totalMonthlyCents: number;
    createdAt: Date;
  }>
>();

mockInsertValues.mockImplementation(
  async (payload: {
    rentalId: string;
    userId: string;
    contact: {
      fullName: string;
      email: string;
      phone?: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
      company?: string;
    } | null;
    items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
    termMonths: number;
    status: 'pending' | 'active' | 'cancelled';
    totalMonthlyCents: number;
    createdAt: Date;
  }) => {
    const existing = rentalStoreByUser.get(payload.userId) ?? [];
    rentalStoreByUser.set(payload.userId, [payload, ...existing]);
  }
);

mockSelectWhere.mockImplementation(async () => Array.from(rentalStoreByUser.values()).flat());

const { GET: getRental, POST: postRental } = await import('../../app/api/rental/route');

const createPostRequest = (body: unknown): Request =>
  new Request('http://localhost:3000/api/rental', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('rental API', () => {
  beforeEach(() => {
    rentalStoreByUser.clear();
    resetRateLimitStoreForTests();
    mockAuth.mockReset();
    mockInsertValues.mockClear();
    mockSelectWhere.mockClear();
    mockDispatchIntakeEventToN8n.mockClear();
    mockSyncAndNotifySubscriberViaNovu.mockClear();
    mockSyncPersonAndFollowUpToTwenty.mockClear();
  });

  it('rejects invalid payloads', async () => {
    const request = createPostRequest({ items: [], userId: '' });
    const response = await postRental(request);
    const result = (await response.json()) as {
      success: boolean;
      message: string;
    };

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
  });

  it('creates and retrieves rental applications with contact details', async () => {
    const email = `user-${Date.now().toString(36)}@hylono.example`;
    const createRequest = createPostRequest({
      termMonths: 6,
      userId: email,
      fullName: 'Hylono Operator',
      email,
      phone: '+48 600 111 222',
      address: 'Test Street 12',
      city: 'Warsaw',
      postalCode: '00-001',
      country: 'Poland',
      company: 'Hylono Labs',
      items: [
        {
          techId: 'TECH-HBOT',
          quantity: 2,
          monthlyPrice: 249.5,
        },
      ],
    });

    const createResponse = await postRental(createRequest);
    const createResult = (await createResponse.json()) as {
      success: boolean;
      rental?: {
        id: string;
        userId: string;
        contact: {
          fullName: string;
          email: string;
          city: string;
          country: string;
        };
        items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
      };
    };

    expect(createResponse.status).toBe(201);
    expect(createResult.success).toBe(true);
    expect(createResult.rental).toBeDefined();
    expect(createResult.rental?.userId).toBe(email);
    expect(createResult.rental?.contact.fullName).toBe('Hylono Operator');
    expect(createResult.rental?.contact.email).toBe(email);
    expect(createResult.rental?.items[0]?.techId).toBe('hbot-st1700');
    expect(createResult.rental?.items[0]?.monthlyPrice).toBe(1099);

    expect(mockDispatchIntakeEventToN8n).toHaveBeenCalledWith(
      expect.objectContaining({
        target: 'rental',
        eventType: 'rental.requested',
        payload: expect.objectContaining({
          contact: expect.objectContaining({
            email,
            fullName: 'Hylono Operator',
          }),
        }),
      })
    );
    expect(mockSyncPersonAndFollowUpToTwenty).toHaveBeenCalledWith(
      expect.objectContaining({
        email,
        fullName: 'Hylono Operator',
        companyName: 'Hylono Labs',
        taskTitle: expect.stringContaining('Rental follow-up'),
        opportunity: expect.objectContaining({
          name: expect.stringContaining('Rental request'),
          currencyCode: 'EUR',
        }),
      })
    );
    expect(mockSyncAndNotifySubscriberViaNovu).toHaveBeenCalledWith(
      expect.objectContaining({
        email,
        fullName: 'Hylono Operator',
        source: 'rental:pending',
      })
    );

    mockAuth.mockResolvedValue({
      user: {
        email,
      },
    });

    const listResponse = await getRental(
      new Request(`http://localhost:3000/api/rental?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      })
    );
    const listResult = (await listResponse.json()) as {
      success: boolean;
      rentals: Array<{ id: string; contact: { email: string } | null }>;
    };

    expect(listResponse.status).toBe(200);
    expect(listResult.success).toBe(true);
    expect(listResult.rentals.length).toBeGreaterThan(0);
    expect(listResult.rentals.some((rental) => rental.id === createResult.rental?.id)).toBe(true);
    expect(listResult.rentals[0]?.contact?.email).toBe(email);
  });

  it('normalizes userId and techId with slug-safe sanitization', async () => {
    const rawEmail = `  USER.Name+Tag@Example.com  `;
    const createRequest = createPostRequest({
      userId: rawEmail,
      fullName: 'User Name',
      email: rawEmail,
      address: 'Main Street 1',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
      termMonths: 6,
      items: [
        {
          techId: '  TECH HBOT <>  ',
          quantity: 1,
          monthlyPrice: 199.99,
        },
      ],
    });

    const createResponse = await postRental(createRequest);
    const createResult = (await createResponse.json()) as {
      success: boolean;
      rental?: {
        id: string;
        userId: string;
        contact: { email: string };
        items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
      };
    };

    expect(createResponse.status).toBe(201);
    expect(createResult.success).toBe(true);
    expect(createResult.rental?.userId).toBe('user.name+tag@example.com');
    expect(createResult.rental?.contact.email).toBe('user.name+tag@example.com');
    expect(createResult.rental?.items[0]?.techId).toBe('hbot-st1700');
    expect(createResult.rental?.items[0]?.monthlyPrice).toBe(1099);

    mockAuth.mockResolvedValue({
      user: {
        email: 'user.name+tag@example.com',
      },
    });

    const listResponse = await getRental(
      new Request(
        `http://localhost:3000/api/rental?userId=${encodeURIComponent(rawEmail)}`,
        {
          method: 'GET',
        }
      )
    );
    const listResult = (await listResponse.json()) as {
      success: boolean;
      rentals: Array<{ id: string }>;
    };

    expect(listResponse.status).toBe(200);
    expect(listResult.success).toBe(true);
    expect(listResult.rentals.some((rental) => rental.id === createResult.rental?.id)).toBe(
      true
    );
  });

  it('returns 401 for unauthenticated rental lookups', async () => {
    mockAuth.mockResolvedValue(null);

    const response = await getRental(
      new Request('http://localhost:3000/api/rental', { method: 'GET' })
    );
    const result = (await response.json()) as {
      success: boolean;
      rentals: unknown[];
    };

    expect(response.status).toBe(401);
    expect(result.success).toBe(false);
    expect(Array.isArray(result.rentals)).toBe(true);
  });

  it('returns 403 when a session tries to read another account', async () => {
    mockAuth.mockResolvedValue({
      user: {
        email: 'allowed@hylono.example',
      },
    });

    const response = await getRental(
      new Request('http://localhost:3000/api/rental?email=blocked@hylono.example', {
        method: 'GET',
      })
    );
    const result = (await response.json()) as {
      success: boolean;
      rentals: unknown[];
    };

    expect(response.status).toBe(403);
    expect(result.success).toBe(false);
    expect(Array.isArray(result.rentals)).toBe(true);
  });

  it('allows bearer-authenticated rental lookups for the same account', async () => {
    const email = 'mobile@hylono.example';
    const createRequest = createPostRequest({
      userId: email,
      fullName: 'Mobile User',
      email,
      address: 'Main Street 1',
      city: 'Warsaw',
      postalCode: '00-001',
      country: 'Poland',
      termMonths: 3,
      items: [
        {
          techId: 'TECH-HBOT',
          quantity: 1,
          monthlyPrice: 249.5,
        },
      ],
    });

    await postRental(createRequest);
    mockAuth.mockResolvedValue(null);
    const mobileSession = issueMobileAuthSession({
      email,
      name: 'Mobile User',
    });

    const response = await getRental(
      new Request(
        `http://localhost:3000/api/rental?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mobileSession?.accessToken ?? ''}`,
          },
        }
      )
    );
    const result = (await response.json()) as {
      success: boolean;
      rentals: Array<{ contact: { email: string } | null }>;
    };

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.rentals[0]?.contact?.email).toBe(email);
  });
});
