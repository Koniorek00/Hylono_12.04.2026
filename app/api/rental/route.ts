import { z } from 'zod';
import { and, eq, gte, ne } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import {
    MOBILE_AUTH_SCOPE_RENTALS_READ,
    readBearerToken,
    verifyMobileAuthToken,
} from '@/lib/mobile-auth';
import { resolveRentalPlan } from '@/lib/commerce/rental-catalog';
import { ensureDatabaseReady, getDb, isDatabaseConfigured } from '@/lib/db/client';
import { rentalApplicationsTable, type RentalContactRecord } from '@/lib/db/schema';
import { dispatchIntakeEventToN8n } from '@/lib/integrations/n8n';
import { syncAndNotifySubscriberViaNovu } from '@/lib/integrations/novu';
import { syncPersonAndFollowUpToTwenty } from '@/lib/integrations/twenty';
import {
    buildRequestFingerprint,
    recentSubmissionThreshold,
} from '../_shared/fingerprints';
import {
    createRateLimitResponse,
    consumeRateLimit,
} from '../_shared/rate-limit';
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

export interface RentalContact {
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    company?: string;
}

export interface CreateRentalPayload {
    items: RentalItem[];
    userId?: string;
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    company?: string;
    termMonths?: number;
}

export interface RentalResponse {
    id: string;
    userId: string;
    contact: RentalContactRecord | null;
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
    userId: z.string().trim().min(1).optional(),
    fullName: z.string().trim().min(2, 'Missing required field: fullName').max(120),
    email: z.string().trim().email('Missing or invalid required field: email').max(254),
    phone: z.string().trim().max(30).optional(),
    address: z.string().trim().min(3, 'Missing required field: address').max(200),
    city: z.string().trim().min(2, 'Missing required field: city').max(100),
    postalCode: z.string().trim().min(2, 'Missing required field: postalCode').max(20),
    country: z.string().trim().min(2, 'Missing required field: country').max(50),
    company: z.string().trim().max(100).optional(),
    termMonths: z.number().int().min(1).max(60).optional().default(12),
}) satisfies z.ZodType<CreateRentalPayload>;

const RENTAL_RATE_LIMIT = {
    bucket: 'rental',
    limit: 5,
    windowMs: 10 * 60 * 1000,
} as const;

const normalizeEmail = (value: string): string =>
    sanitizeText(value, {
        maxLength: 254,
        context: 'email',
    });

const normalizeUserId = (userId: string): string => {
    const trimmed = userId.trim();

    if (isEmailLike(trimmed)) {
        return normalizeEmail(trimmed);
    }

    return sanitizeText(trimmed, {
        maxLength: 120,
        context: 'slug',
    }).toLowerCase();
};

const normalizeRentalItems = (
    items: RentalItem[],
    termMonths: number
): RentalItem[] | null => {
    const resolvedItems = items.map((item) => {
        const normalizedTechId = sanitizeText(item.techId, {
            maxLength: 80,
            context: 'slug',
        }).toLowerCase();
        const resolvedPlan = resolveRentalPlan(normalizedTechId, termMonths);

        if (!resolvedPlan) {
            return null;
        }

        return {
            techId: resolvedPlan.productId,
            quantity: item.quantity,
            monthlyPrice: Number(resolvedPlan.monthlyPrice.toFixed(2)),
        } satisfies RentalItem;
    });

    if (resolvedItems.some((item) => item === null)) {
        return null;
    }

    return resolvedItems.filter(
        (item): item is RentalItem => Boolean(item)
    );
};

const toMinorUnit = (value: number): number => Math.round(value * 100);

const fromMinorUnit = (value: number): number => Number((value / 100).toFixed(2));

const isEmailLike = (value: string): boolean =>
    z.string().email().safeParse(value).success;

const normalizeContact = (contact: RentalContact): RentalContactRecord => ({
    fullName: sanitizeText(contact.fullName, {
        maxLength: 120,
        context: 'default',
    }),
    email: normalizeEmail(contact.email),
    phone: contact.phone
        ? sanitizeText(contact.phone, {
            maxLength: 30,
            context: 'phone',
        })
        : undefined,
    address: sanitizeText(contact.address, {
        maxLength: 200,
        context: 'multiline',
    }),
    city: sanitizeText(contact.city, {
        maxLength: 100,
        context: 'default',
    }),
    postalCode: sanitizeText(contact.postalCode, {
        maxLength: 20,
        context: 'default',
    }),
    country: sanitizeText(contact.country, {
        maxLength: 50,
        context: 'default',
    }),
    company: contact.company
        ? sanitizeText(contact.company, {
            maxLength: 100,
            context: 'default',
        })
        : undefined,
});

const COMMON_EMAIL_DOMAINS = new Set([
    'gmail.com',
    'googlemail.com',
    'hotmail.com',
    'icloud.com',
    'interia.pl',
    'o2.pl',
    'outlook.com',
    'proton.me',
    'protonmail.com',
    'wp.pl',
    'yahoo.com',
]);

function inferCompanyNameFromEmail(email: string): string | undefined {
    const domain = email.trim().toLowerCase().split('@')[1];

    if (!domain || COMMON_EMAIL_DOMAINS.has(domain)) {
        return undefined;
    }

    return domain;
}

async function resolveAuthenticatedRentalUserId(
    request: Request
): Promise<string> {
    const session = await auth();
    const sessionEmail = session?.user?.email
        ? normalizeUserId(session.user.email)
        : '';

    if (sessionEmail) {
        return sessionEmail;
    }

    const bearerToken = readBearerToken(request);
    if (!bearerToken) {
        return '';
    }

    const claims = verifyMobileAuthToken(bearerToken, 'access');
    if (
        !claims ||
        !claims.scope.includes(MOBILE_AUTH_SCOPE_RENTALS_READ)
    ) {
        return '';
    }

    return normalizeUserId(claims.email);
}

/**
 * POST /api/rental
 * Creates a new rental agreement record.
 */
export async function POST(request: Request): Promise<Response> {
    try {
        const rateLimitState = consumeRateLimit(request, RENTAL_RATE_LIMIT);
        if (!rateLimitState.allowed) {
            return createRateLimitResponse(
                rateLimitState,
                'Too many rental requests. Please wait a few minutes and try again.'
            );
        }

        const rawBody = await readJsonBody(request);
        const parsed = createRentalPayloadSchema.safeParse(rawBody);

        if (!parsed.success) {
            return validationErrorResponse(parsed.error);
        }

        const {
            items,
            userId,
            fullName,
            email,
            phone,
            address,
            city,
            postalCode,
            country,
            company,
            termMonths = 12,
        } = parsed.data;
        const normalizedContact = normalizeContact({
            fullName,
            email,
            phone,
            address,
            city,
            postalCode,
            country,
            company,
        });
        const normalizedUserId = normalizeUserId(userId ?? normalizedContact.email);
        const normalizedItems = normalizeRentalItems(items, termMonths);

        if (!normalizedItems) {
            return Response.json(
                {
                    success: false,
                    message: 'One or more rental items or term selections are invalid. Please refresh and try again.',
                } satisfies RentalCreateResponse,
                { status: 400 }
            );
        }

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

        await ensureDatabaseReady();
        const db = getDb();

        const totalMonthlyAmount = normalizedItems.reduce(
            (sum, item) => sum + item.monthlyPrice * item.quantity,
            0
        );
        const submissionHash = buildRequestFingerprint({
            contact: normalizedContact,
            items: normalizedItems,
            termMonths,
            userId: normalizedUserId,
        });
        const duplicateAfter = recentSubmissionThreshold();
        const recentDuplicate = (await db
            .select()
            .from(rentalApplicationsTable)
            .where(
                and(
                    eq(rentalApplicationsTable.submissionHash, submissionHash),
                    gte(rentalApplicationsTable.createdAt, duplicateAfter)
                )
            ))
            .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0];

        if (recentDuplicate) {
            const duplicateRental: RentalResponse = {
                id: recentDuplicate.rentalId,
                userId: recentDuplicate.userId,
                contact:
                    (recentDuplicate.contact as RentalContactRecord | null) ?? null,
                items: recentDuplicate.items,
                termMonths: recentDuplicate.termMonths,
                status: recentDuplicate.status as RentalResponse['status'],
                totalMonthly: fromMinorUnit(recentDuplicate.totalMonthlyCents),
                createdAt: recentDuplicate.createdAt.toISOString(),
            };

            return Response.json(
                {
                    success: true,
                    message: `We already received this rental request. Reference: ${duplicateRental.id}.`,
                    rental: duplicateRental,
                } satisfies RentalCreateResponse,
                { status: 200 }
            );
        }

        const rentalId = crypto.randomUUID();
        const createdAt = new Date();

        await db.insert(rentalApplicationsTable).values({
            id: crypto.randomUUID(),
            rentalId,
            userId: normalizedUserId,
            contact: normalizedContact,
            items: normalizedItems,
            termMonths,
            status: 'pending',
            totalMonthlyCents: toMinorUnit(totalMonthlyAmount),
            submissionHash,
            createdAt,
        });

        const rental: RentalResponse = {
            id: rentalId,
            userId: normalizedUserId,
            contact: normalizedContact,
            items: normalizedItems,
            termMonths,
            status: 'pending',
            totalMonthly: Number(totalMonthlyAmount.toFixed(2)),
            createdAt: createdAt.toISOString(),
        };

        const emailBackedRental = isEmailLike(normalizedContact.email);
        const estimatedContractValueCents = toMinorUnit(totalMonthlyAmount) * termMonths;

        await Promise.allSettled([
            dispatchIntakeEventToN8n({
                target: 'rental',
                eventType: 'rental.requested',
                payload: rental,
            }),
            emailBackedRental
                ? syncPersonAndFollowUpToTwenty({
                    email: normalizedContact.email,
                    fullName: normalizedContact.fullName,
                    phone: normalizedContact.phone,
                    city: normalizedContact.city,
                    companyName: normalizedContact.company ?? inferCompanyNameFromEmail(normalizedContact.email),
                    source: 'rental:pending',
                    taskTitle: `Rental follow-up ${rental.id}`,
                    taskBodyText: [
                        `Rental: ${rental.id}`,
                        `Customer: ${normalizedContact.fullName}`,
                        `Email: ${normalizedContact.email}`,
                        `Phone: ${normalizedContact.phone ?? 'N/A'}`,
                        `Address: ${normalizedContact.address}`,
                        `City: ${normalizedContact.city}`,
                        `Postal code: ${normalizedContact.postalCode}`,
                        `Country: ${normalizedContact.country}`,
                        `Company: ${normalizedContact.company ?? 'N/A'}`,
                        `Status: ${rental.status}`,
                        `Term months: ${rental.termMonths}`,
                        `Total monthly: ${rental.totalMonthly}`,
                        `Estimated contract value: ${fromMinorUnit(estimatedContractValueCents)}`,
                        '',
                        `Items: ${rental.items.map((item) => `${item.techId} x${item.quantity} @ ${item.monthlyPrice}`).join(', ')}`,
                        '',
                        `Lookup key: ${normalizedUserId}`,
                    ].join('\n'),
                    opportunity: {
                        name: `Rental request ${rental.id}`,
                        amountMicros: estimatedContractValueCents * 10000,
                        currencyCode: 'EUR',
                        stage: 'NEW',
                    },
                })
                : Promise.resolve(),
            emailBackedRental
                ? syncAndNotifySubscriberViaNovu({
                    email: normalizedContact.email,
                    fullName: normalizedContact.fullName,
                    phone: normalizedContact.phone,
                    source: 'rental:pending',
                    title: 'Rental request received',
                    message: `Your rental request ${rental.id} is recorded and awaiting operator review.`,
                    data: {
                        rentalId: rental.id,
                        fullName: normalizedContact.fullName,
                        email: normalizedContact.email,
                        phone: normalizedContact.phone ?? null,
                        address: normalizedContact.address,
                        city: normalizedContact.city,
                        postalCode: normalizedContact.postalCode,
                        country: normalizedContact.country,
                        company: normalizedContact.company ?? null,
                        status: rental.status,
                        termMonths: rental.termMonths,
                        totalMonthly: rental.totalMonthly,
                        items: rental.items,
                    },
                    payload: {
                        rentalId: rental.id,
                        fullName: normalizedContact.fullName,
                        email: normalizedContact.email,
                        city: normalizedContact.city,
                        country: normalizedContact.country,
                        status: rental.status,
                        termMonths: rental.termMonths,
                        totalMonthly: rental.totalMonthly,
                    },
                })
                : Promise.resolve(),
        ]);

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
        const sessionEmail = await resolveAuthenticatedRentalUserId(request);

        if (!sessionEmail) {
            return Response.json(
                {
                    success: false,
                    message: 'Authentication required.',
                    rentals: [],
                } satisfies RentalListResponse,
                { status: 401 }
            );
        }

        const url = new URL(request.url);
        const rawUserId =
            url.searchParams.get('userId') ?? url.searchParams.get('email');
        const userId = rawUserId ? normalizeUserId(rawUserId) : sessionEmail;

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

        if (userId !== sessionEmail) {
            return Response.json(
                {
                    success: false,
                    message: 'You are not allowed to access rental records for another account.',
                    rentals: [],
                } satisfies RentalListResponse,
                { status: 403 }
            );
        }

        await ensureDatabaseReady();
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
                contact: (rental.contact as RentalContactRecord | null) ?? null,
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
