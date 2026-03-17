/**
 * POST /api/checkout
 * Creates an order and initiates payment processing.
 *
 * When STRIPE_SECRET_KEY is set, creates a real Stripe PaymentIntent.
 * Without Stripe credentials, it gracefully falls back to manual confirmation
 * so checkout requests are still captured instead of failing with 501.
 *
 * @env STRIPE_SECRET_KEY   - Server-side Stripe secret key (never exposed to client)
 * @env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Publishable key for Stripe Elements (client-safe)
 */

import { z } from 'zod';
import { createHash } from 'node:crypto';
import { TECH_DETAILS } from '@/constants';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';
import { checkoutOrdersTable } from '@/lib/db/schema';
import { env } from '@/lib/env';
import { TechType } from '@/types';
import { readJsonBody, sanitizeText, validationErrorResponse } from '../_shared/validation';

interface OrderItem {
    id: string;
    quantity: number;
}

interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

interface CheckoutRequest {
    items: OrderItem[];
    shipping: ShippingAddress;
    paymentMethod: 'card' | 'bank_transfer' | 'financing';
}

interface CheckoutResponse {
    success: boolean;
    message: string;
    orderId?: string;
    clientSecret?: string; // Stripe PaymentIntent client secret (for card payments)
}

type CheckoutOrderStatus =
    | 'pending_card_configuration'
    | 'pending_payment_intent'
    | 'payment_intent_failed'
    | 'payment_intent_created'
    | 'awaiting_offline_payment';

const TECH_ID_TO_TYPE: Record<string, TechType> = {
    'tech-hbot': TechType.HBOT,
    'tech-pemf': TechType.PEMF,
    'tech-rlt': TechType.RLT,
    'tech-hydrogen': TechType.HYDROGEN,
    'tech-ewot': TechType.EWOT,
    'tech-sauna_blanket': TechType.SAUNA_BLANKET,
    'tech-ems': TechType.EMS,
    'tech-vns': TechType.VNS,
    'tech-hypoxic': TechType.HYPOXIC,
    'tech-cryo': TechType.CRYO,
};

const toMinorUnit = (amountText: string): number => {
    const parsed = Number(amountText.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 0;
    }

    return Math.round(parsed * 100);
};

const getTrustedUnitPriceCents = (itemId: string): number | null => {
    const techType = TECH_ID_TO_TYPE[itemId.trim().toLowerCase()];

    if (!techType) {
        return null;
    }

    const tech = TECH_DETAILS[techType];
    const unitPriceCents = toMinorUnit(tech.price);

    return unitPriceCents > 0 ? unitPriceCents : null;
};

const buildCheckoutIdempotencyKey = (
    items: Array<{ id: string; quantity: number; unitPriceCents: number }>,
    customerEmail: string,
    paymentMethod: CheckoutRequest['paymentMethod']
): string => {
    const normalizedPayload = JSON.stringify({
        customerEmail,
        paymentMethod,
        items: items
            .slice()
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((item) => ({
                id: item.id,
                quantity: item.quantity,
                unitPriceCents: item.unitPriceCents,
            })),
    });

    return createHash('sha256').update(normalizedPayload).digest('hex');
};

const checkoutSchema = z.object({
    items: z.array(
        z.object({
            id: z.string().trim().min(1, 'Invalid item in cart.'),
            name: z.string().trim().optional(),
            price: z.number().optional(),
            quantity: z.number().int().min(1, 'Invalid item quantity.').max(100, 'Invalid item quantity.'),
        })
    ).min(1, 'Cart is empty.'),
    shipping: z.object({
        firstName: z.string().trim().min(1, 'Full name is required.'),
        lastName: z.string().trim().min(1, 'Full name is required.'),
        email: z.string().trim().email('Valid email is required.'),
        phone: z.string().trim().max(30).optional(),
        address: z.string().trim().min(1, 'Street address is required.').max(200),
        city: z.string().trim().min(1, 'City is required.').max(100),
        postalCode: z.string().trim().min(1, 'Postal code is required.').max(20),
        country: z.string().trim().min(1).max(50),
    }),
    paymentMethod: z.enum(['card', 'bank_transfer', 'financing']),
}) satisfies z.ZodType<CheckoutRequest>;

export async function POST(request: Request): Promise<Response> {
    try {
        const rawBody = await readJsonBody(request);
        const parsed = checkoutSchema.safeParse(rawBody);

        if (!parsed.success) {
            return validationErrorResponse(parsed.error);
        }

        const { items, shipping, paymentMethod } = parsed.data;

        // --- Sanitize ---
        const sanitizedShipping = {
            firstName: sanitizeText(shipping.firstName, 50),
            lastName: sanitizeText(shipping.lastName, 50),
            email: sanitizeText(shipping.email, {
                maxLength: 254,
                context: 'email',
            }),
            phone: shipping.phone
                ? sanitizeText(shipping.phone, {
                    maxLength: 30,
                    context: 'phone',
                })
                : undefined,
            address: sanitizeText(shipping.address, 200),
            city: sanitizeText(shipping.city, 100),
            postalCode: sanitizeText(shipping.postalCode, 20),
            country: sanitizeText(shipping.country ?? 'Poland', 50),
        };

        const trustedItems = items.map((item) => {
            const unitPriceCents = getTrustedUnitPriceCents(item.id);

            if (!unitPriceCents) {
                return null;
            }

            return {
                id: item.id,
                quantity: item.quantity,
                unitPriceCents,
            };
        });

        if (trustedItems.some((item) => item === null)) {
            return Response.json(
                {
                    success: false,
                    message: 'One or more cart items are invalid. Please refresh your cart and try again.',
                } satisfies CheckoutResponse,
                { status: 400 }
            );
        }

        const resolvedItems = trustedItems.filter((item): item is NonNullable<typeof item> => Boolean(item));

        // --- Calculate total from trusted server-side catalog prices ---
        const totalCents = resolvedItems.reduce(
            (sum, item) => sum + (item.unitPriceCents * item.quantity),
            0
        );

        if (!isDatabaseConfigured()) {
            console.error('[checkout] DATABASE_URL missing; cannot persist order');
            return Response.json(
                {
                    success: false,
                    message: 'Checkout is temporarily unavailable. Please try again shortly.',
                } satisfies CheckoutResponse,
                { status: 503 }
            );
        }

        const db = getDb();

        // Generate order ID
        const orderId = `HYL-${Date.now().toString(36).toUpperCase()}`;
        const orderItemsRecord = resolvedItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
        }));

        const persistOrder = async (
            status: CheckoutOrderStatus,
            stripePaymentIntentId?: string
        ): Promise<void> => {
            await db.insert(checkoutOrdersTable).values({
                id: crypto.randomUUID(),
                orderId,
                paymentMethod,
                email: sanitizedShipping.email,
                shipping: sanitizedShipping,
                items: orderItemsRecord,
                totalCents,
                status,
                stripePaymentIntentId,
            });
        };

        // --- Stripe Payment Intent (card payments) ---
        if (paymentMethod === 'card') {
            const stripeSecretKey = env.STRIPE_SECRET_KEY;
            const idempotencyKey = buildCheckoutIdempotencyKey(
                resolvedItems,
                sanitizedShipping.email,
                paymentMethod
            );

            if (!stripeSecretKey) {
                await persistOrder('pending_card_configuration');

                return Response.json(
                    {
                        success: false,
                        message: 'Card payments are temporarily unavailable. Please choose bank transfer or financing.',
                        orderId,
                    } satisfies CheckoutResponse,
                    { status: 503 }
                );
            }

            const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${stripeSecretKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Idempotency-Key': idempotencyKey,
                },
                body: new URLSearchParams({
                    amount: String(totalCents),
                    currency: 'pln',
                    'metadata[orderId]': orderId,
                    'metadata[customerEmail]': sanitizedShipping.email,
                    'receipt_email': sanitizedShipping.email,
                    'description': `Hylono Order ${orderId}`,
                }),
            });

            if (!stripeResponse.ok) {
                const stripeError = await stripeResponse.json();
                console.error('[checkout] Stripe PaymentIntent error:', stripeError);

                await persistOrder('payment_intent_failed');

                return Response.json(
                    {
                        success: false,
                        message: 'Card authorization failed. Please try again or use another payment method.',
                        orderId,
                    } satisfies CheckoutResponse,
                    { status: 502 }
                );
            }

            const paymentIntent = await stripeResponse.json() as {
                id: string;
                client_secret?: string;
            };

            await persistOrder('payment_intent_created', paymentIntent.id);

            return Response.json(
                {
                    success: true,
                    message: 'Payment intent created. Complete payment with Stripe Elements.',
                    orderId,
                    clientSecret: paymentIntent.client_secret,
                } satisfies CheckoutResponse,
                { status: 200 }
            );
        }

        // --- Non-card payments (bank transfer, financing) ---
        await persistOrder('awaiting_offline_payment');

        return Response.json(
            {
                success: true,
                message: `Order ${orderId} received. We will contact you at ${sanitizedShipping.email} with payment instructions.`,
                orderId,
            } satisfies CheckoutResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('[checkout] Error processing order:', error);
        return Response.json(
            { success: false, message: 'An unexpected error occurred. Please try again.' } satisfies CheckoutResponse,
            { status: 500 }
        );
    }
}

export function GET(): Response {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
