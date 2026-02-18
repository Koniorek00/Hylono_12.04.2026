/**
 * Rental API Handler — Standard Web Fetch API (no Next.js dependency)
 * Compatible with: Vite dev server middleware, Cloudflare Workers, or any edge runtime.
 *
 * NOTE: This is a stateless handler stub. Wire `rentalService.createRental()`
 * to a real backend (Express server / Supabase Edge Function) before going to production.
 */

export interface RentalItem {
    techId: string;
    quantity: number;
    monthlyPrice: number;
}

export interface CreateRentalPayload {
    items: RentalItem[];
    userId: string;
    termMonths?: number;
}

export interface RentalResponse {
    id: string;
    userId: string;
    items: RentalItem[];
    termMonths: number;
    status: 'pending' | 'active' | 'cancelled';
    totalMonthly: number;
    createdAt: string;
}

/**
 * POST /api/rental
 * Creates a new rental agreement record.
 */
export async function POST(request: Request): Promise<Response> {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const body: CreateRentalPayload = await request.json();
        const { items, userId, termMonths = 12 } = body;

        // Input validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Missing or invalid required field: items' }),
                { status: 400, headers }
            );
        }
        if (!userId || typeof userId !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Missing required field: userId' }),
                { status: 400, headers }
            );
        }

        // TODO: Replace stub below with real DB call via Prisma:
        // const rental = await prisma.rental.create({ data: { userId, items, termMonths } });
        const totalMonthly = items.reduce(
            (sum, item) => sum + item.monthlyPrice * item.quantity,
            0
        );

        const rental: RentalResponse = {
            id: crypto.randomUUID(),
            userId,
            items,
            termMonths,
            status: 'pending',
            totalMonthly,
            createdAt: new Date().toISOString(),
        };

        return new Response(JSON.stringify(rental), { status: 201, headers });
    } catch (error) {
        console.error('[RentalAPI] Error creating rental:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers }
        );
    }
}

/**
 * GET /api/rental?userId=<id>
 * Fetches all active rentals for a given user. Stub — wire to Prisma.
 */
export async function GET(request: Request): Promise<Response> {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'Missing query param: userId' }),
                { status: 400, headers }
            );
        }

        // TODO: Replace stub below with:
        // const rentals = await prisma.rental.findMany({ where: { userId } });
        const rentals: RentalResponse[] = [];

        return new Response(JSON.stringify({ rentals }), { status: 200, headers });
    } catch (error) {
        console.error('[RentalAPI] Error fetching rentals:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers }
        );
    }
}
