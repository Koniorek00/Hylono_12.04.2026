import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockDb = {
  insert: vi.fn(),
  select: vi.fn(),
};

const mockInsertValues = vi.fn();
const mockSelectFrom = vi.fn();
const mockSelectWhere = vi.fn();

mockDb.insert.mockReturnValue({ values: mockInsertValues });
mockDb.select.mockReturnValue({
  from: mockSelectFrom,
});
mockSelectFrom.mockReturnValue({ where: mockSelectWhere });

vi.mock('@/lib/db/client', () => ({
  isDatabaseConfigured: () => true,
  getDb: () => mockDb,
}));

const rentalStoreByUser = new Map<
  string,
  Array<{
    rentalId: string;
    userId: string;
    items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
    termMonths: number;
    status: 'pending' | 'active' | 'cancelled';
    totalMonthlyCents: number;
    createdAt: Date;
  }>
>();

mockInsertValues.mockImplementation(async (payload: {
  rentalId: string;
  userId: string;
  items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
  termMonths: number;
  status: 'pending' | 'active' | 'cancelled';
  totalMonthlyCents: number;
  createdAt: Date;
}) => {
  const existing = rentalStoreByUser.get(payload.userId) ?? [];
  rentalStoreByUser.set(payload.userId, [payload, ...existing]);
});

mockSelectWhere.mockImplementation(async () => {
  return Array.from(rentalStoreByUser.values()).flat();
});

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
    mockInsertValues.mockClear();
    mockSelectWhere.mockClear();
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

  it('creates and retrieves rental applications by user id', async () => {
    const userId = `USER-${Date.now().toString(36)}`;
    const createRequest = createPostRequest({
      userId,
      termMonths: 12,
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
        items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
      };
    };

    expect(createResponse.status).toBe(201);
    expect(createResult.success).toBe(true);
    expect(createResult.rental).toBeDefined();
    expect(createResult.rental?.userId).toBe(userId.toLowerCase());
    expect(createResult.rental?.items[0]?.techId).toBe('tech-hbot');

    const listResponse = await getRental(
      new Request(
        `http://localhost:3000/api/rental?userId=${encodeURIComponent(userId)}`,
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
    expect(listResult.rentals.length).toBeGreaterThan(0);
    expect(listResult.rentals.some((rental) => rental.id === createResult.rental?.id)).toBe(
      true
    );
  });

  it('normalizes userId and techId with slug-safe sanitization', async () => {
    const rawUserId = '  USER Name <> `  ';
    const createRequest = createPostRequest({
      userId: rawUserId,
      termMonths: 12,
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
        items: Array<{ techId: string; quantity: number; monthlyPrice: number }>;
      };
    };

    expect(createResponse.status).toBe(201);
    expect(createResult.success).toBe(true);
    expect(createResult.rental?.userId).toBe('user-name');
    expect(createResult.rental?.items[0]?.techId).toBe('tech-hbot');

    const listResponse = await getRental(
      new Request(
        `http://localhost:3000/api/rental?userId=${encodeURIComponent(rawUserId)}`,
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

  it('returns 400 for listing without user id', async () => {
    const response = await getRental(
      new Request('http://localhost:3000/api/rental', { method: 'GET' })
    );
    const result = (await response.json()) as {
      success: boolean;
      rentals: unknown[];
    };

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(Array.isArray(result.rentals)).toBe(true);
  });
});
