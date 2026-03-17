import { z } from 'zod';
import { and, eq, ne } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';
import { rentalApplicationsTable } from '@/lib/db/schema';
import {
    readJsonBody,
    sanitizeText,
    validationErrorResponse,
} from '../_shared/validation';

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

interface RentalCreateResponse {
    success: boolean;
    message: string;
    rental?: RentalResponse;
    fieldErrors?: Record<string, string[]>;
}

interface RentalListResponse {
    success: boolean;
    message: string;
    rentals: RentalResponse[];
}

const createRentalPayloadSchema = z.object({
    items: z.array(
        z.object({
            techId: z.string().trim().min(1, 'Missing or invalid required field: items'),
            quantity: z.number().int().min(1, 'Missing or invalid required field: items'),
            monthlyPrice: z.number().nonnegative('Missing or invalid required field: items'),
        })
    ).min(1, 'Missing or invalid required field: items'),
    userId: z.string().trim().min(1, 'Missing required field: userId'),
    termMonths: z.number().int().min(1).max(60).optional().default(12),
}) satisfies z.ZodType<CreateRentalPayload>;

const normalizeUserId = (userId: string): string =>
    sanitizeText(userId, {
        maxLength: 120,
        context: 'slug',
    }).toLowerCase();

const normalizeRentalItems = (items: RentalItem[]): RentalItem[] =>
    items.map((item) => ({
        techId: sanitizeText(item.techId, {
            maxLength: 80,
            context: 'slug',
        }).toLowerCase(),
        quantity: item.quantity,
        monthlyPrice: Number(item.monthlyPrice.toFixed(2)),
    }));

const toMinorUnit = (value: number): number => Math.round(value * 100);

const fromMinorUnit = (value: number): number => Number((value / 100).toFixed(2));

/**
 * POST /api/rental
 * Creates a new rental agreement record.
 */
export async function POST(request: Request): Promise<Response> {
    try {
        const rawBody = await readJsonBody(request);
        const parsed = createRentalPayloadSchema.safeParse(rawBody);

        if (!parsed.success) {
            return validationErrorResponse(parsed.error);
        }

        const { items, userId, termMonths = 12 } = parsed.data;
        const normalizedUserId = normalizeUserId(userId);
        const normalizedItems = normalizeRentalItems(items);

        if (!isDatabaseConfigured()) {
            console.error('[RentalAPI] DATABASE_URL missing; cannot persist rental application');
            return Response.json(
                {
                    success: false,
                    message: 'Rental channel is temporarily unavailable. Please try again shortly.',
                } satisfies RentalCreateResponse,
                { status: 503 }
            );
        }

        const db = getDb();

        const totalMonthlyAmount = normalizedItems.reduce(
            (sum, item) => sum + item.monthlyPrice * item.quantity,
            0
        );

        const rentalId = crypto.randomUUID();
        const createdAt = new Date();

        await db.insert(rentalApplicationsTable).values({
            id: crypto.randomUUID(),
            rentalId,
            userId: normalizedUserId,
            items: normalizedItems,
            termMonths,
            status: 'pending',
            totalMonthlyCents: toMinorUnit(totalMonthlyAmount),
            createdAt,
        });

        const rental: RentalResponse = {
            id: rentalId,
            userId: normalizedUserId,
            items: normalizedItems,
            termMonths,
            status: 'pending',
            totalMonthly: Number(totalMonthlyAmount.toFixed(2)),
            createdAt: createdAt.toISOString(),
        };

        return Response.json(
            {
                success: true,
                message: `Rental application ${rental.id} received. Our team will contact you with next steps.`,
                rental,
            } satisfies RentalCreateResponse,
            { status: 201 }
        );
    } catch (error) {
        console.error('[RentalAPI] Error creating rental:', error);
        return Response.json(
            {
                success: false,
                message: 'An unexpected error occurred while creating the rental application.',
            } satisfies RentalCreateResponse,
            { status: 500 }
        );
    }
}

/**
 * GET /api/rental?userId=<id>
 * Fetches all non-cancelled rentals currently stored for a user.
 */
export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const rawUserId = url.searchParams.get('userId');
        const userId = rawUserId ? normalizeUserId(rawUserId) : '';

        if (!isDatabaseConfigured()) {
            return Response.json(
                {
                    success: false,
                    message: 'Rental channel is temporarily unavailable. Please try again shortly.',
                    rentals: [],
                } satisfies RentalListResponse,
                { status: 503 }
            );
        }

        if (!userId) {
            return Response.json(
                {
                    success: false,
                    message: 'Missing query param: userId',
                    rentals: [],
                } satisfies RentalListResponse,
                { status: 400 }
            );
        }

        const db = getDb();
        const persistedRentals = await db
            .select()
            .from(rentalApplicationsTable)
            .where(
                and(
                    eq(rentalApplicationsTable.userId, userId),
                    ne(rentalApplicationsTable.status, 'cancelled')
                )
            );

        const rentals = persistedRentals
            .map((rental) => ({
                id: rental.rentalId,
                userId: rental.userId,
                items: rental.items,
                termMonths: rental.termMonths,
                status: rental.status as RentalResponse['status'],
                totalMonthly: fromMinorUnit(rental.totalMonthlyCents),
                createdAt: rental.createdAt.toISOString(),
            }))
            .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

        return Response.json(
            {
                success: true,
                message: 'Rental applications retrieved successfully.',
                rentals,
            } satisfies RentalListResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('[RentalAPI] Error fetching rentals:', error);
        return Response.json(
            {
                success: false,
                message: 'An unexpected error occurred while fetching rentals.',
                rentals: [],
            } satisfies RentalListResponse,
            { status: 500 }
        );
    }
}
