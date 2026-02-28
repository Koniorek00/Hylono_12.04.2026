/**
 * POST /api/checkout
 * Creates an order and initiates payment processing.
 *
 * When STRIPE_SECRET_KEY is set, creates a real Stripe PaymentIntent.
 * Until then, returns a mock success response so the UI flow can be tested.
 *
 * @env STRIPE_SECRET_KEY   - Server-side Stripe secret key (never exposed to client)
 * @env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Publishable key for Stripe Elements (client-safe)
 */

import { z } from 'zod';
import { readJsonBody, sanitizeText, validationErrorResponse } from '../_shared/validation';

interface OrderItem {
    id: string;
    name: string;
    price: number;
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

const checkoutSchema = z.object({
    items: z.array(
        z.object({
            id: z.string().trim().min(1, 'Invalid item in cart.'),
            name: z.string().trim().min(1, 'Invalid item in cart.'),
            price: z.number().positive('Invalid item in cart.'),
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
            email: shipping.email.trim().toLowerCase(),
            phone: shipping.phone ? sanitizeText(shipping.phone, 30) : undefined,
            address: sanitizeText(shipping.address, 200),
            city: sanitizeText(shipping.city, 100),
            postalCode: sanitizeText(shipping.postalCode, 20),
            country: sanitizeText(shipping.country ?? 'Poland', 50),
        };

        // --- Calculate total (server-side — never trust client totals) ---
        const totalCents = items.reduce((sum, item) => sum + Math.round(item.price * 100 * item.quantity), 0);

        // Generate order ID
        const orderId = `HYL-${Date.now().toString(36).toUpperCase()}`;

        // --- Stripe Payment Intent (card payments) ---
        if (paymentMethod === 'card') {
            const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

            if (stripeSecretKey) {
                // Real Stripe integration
                const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${stripeSecretKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
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
                    return Response.json(
                        { success: false, message: 'Payment processing failed. Please try again.' } satisfies CheckoutResponse,
                        { status: 502 }
                    );
                }

                const paymentIntent = await stripeResponse.json();

                return Response.json(
                    {
                        success: true,
                        message: 'Payment intent created. Complete payment with Stripe Elements.',
                        orderId,
                        clientSecret: paymentIntent.client_secret,
                    } satisfies CheckoutResponse,
                    { status: 200 }
                );
            } else {
                // STRIPE_SECRET_KEY not set — log and return mock success for development
                console.warn(`[checkout] STRIPE_SECRET_KEY not set. Mock order ${orderId} for ${sanitizedShipping.email} (${(totalCents / 100).toFixed(2)} PLN)`);
            }
        }

        // --- Non-card payments (bank transfer, financing) ---
        // These require manual processing — notify team via email
        // TODO: Wire up Resend email notification here (see /api/contact/route.ts for pattern)
        console.warn(`[checkout] ${paymentMethod} order ${orderId} from ${sanitizedShipping.email} — ${(totalCents / 100).toFixed(2)} PLN`);

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
