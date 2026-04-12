/**
 * POST /api/checkout
 * Creates an order intake record and, when enabled, prepares Stripe payment intent state.
 */

import { and, eq, gte } from 'drizzle-orm';
import { z } from 'zod';
import { TECH_DETAILS } from '@/constants';
import {
  buildRequestFingerprint,
  recentSubmissionThreshold,
} from '@/app/api/_shared/fingerprints';
import { ensureDatabaseReady, getDb, isDatabaseConfigured } from '@/lib/db/client';
import {
  checkoutOrdersTable,
  type CheckoutOrderItemRecord,
  type CheckoutShippingRecord,
} from '@/lib/db/schema';
import { env } from '@/lib/env';
import { dispatchIntakeEventToN8n } from '@/lib/integrations/n8n';
import { syncAndNotifySubscriberViaNovu } from '@/lib/integrations/novu';
import { syncPersonAndFollowUpToTwenty } from '@/lib/integrations/twenty';
import { TechType } from '@/types';
import { fetchWithTimeout } from '../_shared/http';
import { consumeRateLimit, createRateLimitResponse } from '../_shared/rate-limit';
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
  clientSecret?: string;
}

type CheckoutOrderStatus =
  | 'pending_card_configuration'
  | 'pending_payment_intent'
  | 'payment_intent_failed'
  | 'payment_intent_created'
  | 'payment_succeeded'
  | 'payment_canceled'
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

function inferCompanyNameFromEmail(email: string): string | undefined {
  const domain = email.trim().toLowerCase().split('@')[1];

  if (!domain || COMMON_EMAIL_DOMAINS.has(domain)) {
    return undefined;
  }

  return domain;
}

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1, 'Invalid item in cart.'),
        name: z.string().trim().optional(),
        price: z.number().optional(),
        quantity: z
          .number()
          .int()
          .min(1, 'Invalid item quantity.')
          .max(100, 'Invalid item quantity.'),
      })
    )
    .min(1, 'Cart is empty.'),
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

const CHECKOUT_RATE_LIMIT = {
  bucket: 'checkout',
  limit: 10,
  windowMs: 10 * 60 * 1000,
} as const;

const buildCheckoutRequestFingerprint = (
  items: CheckoutOrderItemRecord[],
  shipping: CheckoutShippingRecord,
  paymentMethod: CheckoutRequest['paymentMethod']
): string =>
  buildRequestFingerprint({
    items: items
      .slice()
      .sort((left, right) => left.id.localeCompare(right.id)),
    paymentMethod,
    shipping,
  });

const buildStripeIdempotencyKey = (orderId: string): string => `checkout:${orderId}`;

async function createStripePaymentIntent(input: {
  orderId: string;
  totalCents: number;
  customerEmail: string;
  stripeSecretKey: string;
}): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> {
  const stripeResponse = await fetchWithTimeout(
    'https://api.stripe.com/v1/payment_intents',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${input.stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': buildStripeIdempotencyKey(input.orderId),
      },
      body: new URLSearchParams({
        amount: String(input.totalCents),
        currency: 'pln',
        'metadata[orderId]': input.orderId,
        'metadata[customerEmail]': input.customerEmail,
        receipt_email: input.customerEmail,
        description: `Hylono Order ${input.orderId}`,
      }),
    }
  );

  if (!stripeResponse.ok) {
    const stripeErrorText = await stripeResponse.text();
    throw new Error(
      `stripe_status=${stripeResponse.status};body=${stripeErrorText.slice(0, 400)}`
    );
  }

  const paymentIntent = (await stripeResponse.json()) as {
    client_secret?: string;
    id?: string;
  };

  if (!paymentIntent.id || !paymentIntent.client_secret) {
    throw new Error('Stripe returned an incomplete PaymentIntent payload.');
  }

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const rateLimitState = consumeRateLimit(request, CHECKOUT_RATE_LIMIT);
    if (!rateLimitState.allowed) {
      return createRateLimitResponse(
        rateLimitState,
        'Too many checkout attempts. Please wait a few minutes and try again.'
      );
    }

    const rawBody = await readJsonBody(request);
    const parsed = checkoutSchema.safeParse(rawBody);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { items, shipping, paymentMethod } = parsed.data;

    const sanitizedShipping: CheckoutShippingRecord = {
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
    const inferredCompanyName = inferCompanyNameFromEmail(sanitizedShipping.email);

    const trustedItems = items.map((item) => {
      const unitPriceCents = getTrustedUnitPriceCents(item.id);

      if (!unitPriceCents) {
        return null;
      }

      return {
        id: item.id,
        quantity: item.quantity,
        unitPriceCents,
      } satisfies CheckoutOrderItemRecord;
    });

    if (trustedItems.some((item) => item === null)) {
      return Response.json(
        {
          success: false,
          message:
            'One or more cart items are invalid. Please refresh your cart and try again.',
        } satisfies CheckoutResponse,
        { status: 400 }
      );
    }

    const resolvedItems = trustedItems.filter(
      (item): item is CheckoutOrderItemRecord => Boolean(item)
    );

    const totalCents = resolvedItems.reduce(
      (sum, item) => sum + item.unitPriceCents * item.quantity,
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

    await ensureDatabaseReady();
    const db = getDb();

    const requestFingerprint = buildCheckoutRequestFingerprint(
      resolvedItems,
      sanitizedShipping,
      paymentMethod
    );
    const duplicateAfter = recentSubmissionThreshold();
    const existingOrder = (
      await db
        .select()
        .from(checkoutOrdersTable)
        .where(
          and(
            eq(checkoutOrdersTable.requestFingerprint, requestFingerprint),
            gte(checkoutOrdersTable.createdAt, duplicateAfter)
          )
        )
    ).sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0];

    const dispatchOrderState = async (input: {
      orderId: string;
      status: CheckoutOrderStatus;
      stripePaymentIntentId?: string;
    }): Promise<void> => {
      await Promise.allSettled([
        dispatchIntakeEventToN8n({
          target: 'order',
          eventType: 'order.created',
          payload: {
            orderId: input.orderId,
            paymentMethod,
            email: sanitizedShipping.email,
            shipping: sanitizedShipping,
            items: resolvedItems,
            totalCents,
            status: input.status,
            stripePaymentIntentId: input.stripePaymentIntentId,
          },
        }),
        syncPersonAndFollowUpToTwenty({
          email: sanitizedShipping.email,
          firstName: sanitizedShipping.firstName,
          lastName: sanitizedShipping.lastName,
          phone: sanitizedShipping.phone,
          city: sanitizedShipping.city,
          companyName: inferredCompanyName,
          source: `checkout:${paymentMethod}`,
          taskTitle: `Checkout follow-up ${input.orderId}`,
          taskBodyText: [
            `Order: ${input.orderId}`,
            `Status: ${input.status}`,
            `Payment method: ${paymentMethod}`,
            `Customer: ${sanitizedShipping.firstName} ${sanitizedShipping.lastName}`,
            `Email: ${sanitizedShipping.email}`,
            `Phone: ${sanitizedShipping.phone ?? 'N/A'}`,
            `City: ${sanitizedShipping.city}`,
            `Company: ${inferredCompanyName ?? 'N/A'}`,
            `Country: ${sanitizedShipping.country}`,
            `Total cents: ${totalCents}`,
            '',
            `Items: ${resolvedItems
              .map((item) => `${item.id} x${item.quantity}`)
              .join(', ')}`,
          ].join('\n'),
          opportunity: {
            name: `Checkout order ${input.orderId}`,
            amountMicros: totalCents * 10000,
            currencyCode: 'PLN',
            stage: 'NEW',
          },
        }),
        syncAndNotifySubscriberViaNovu({
          email: sanitizedShipping.email,
          firstName: sanitizedShipping.firstName,
          lastName: sanitizedShipping.lastName,
          phone: sanitizedShipping.phone,
          source: `checkout:${paymentMethod}`,
          title: 'Checkout intake captured',
          message: `Your Hylono order ${input.orderId} is recorded with status ${input.status}. We will keep you updated as payment and fulfillment progress.`,
          data: {
            orderId: input.orderId,
            paymentMethod,
            status: input.status,
            totalCents,
            items: resolvedItems,
            city: sanitizedShipping.city,
            country: sanitizedShipping.country,
            stripePaymentIntentId: input.stripePaymentIntentId ?? null,
          },
          payload: {
            orderId: input.orderId,
            paymentMethod,
            status: input.status,
            totalCents,
            city: sanitizedShipping.city,
            country: sanitizedShipping.country,
            stripePaymentIntentId: input.stripePaymentIntentId ?? null,
          },
        }),
      ]);
    };

    const insertOrder = async (input: {
      lastErrorMessage?: string;
      orderId: string;
      status: CheckoutOrderStatus;
      stripeClientSecret?: string;
      stripePaymentIntentId?: string;
    }): Promise<void> => {
      const now = new Date();

      await db.insert(checkoutOrdersTable).values({
        id: crypto.randomUUID(),
        orderId: input.orderId,
        paymentMethod,
        email: sanitizedShipping.email,
        requestFingerprint,
        shipping: sanitizedShipping,
        items: resolvedItems,
        totalCents,
        status: input.status,
        stripePaymentIntentId: input.stripePaymentIntentId,
        stripeClientSecret: input.stripeClientSecret,
        lastErrorMessage: input.lastErrorMessage,
        createdAt: now,
        updatedAt: now,
      });
    };

    const updateOrder = async (
      orderId: string,
      input: {
        lastErrorMessage?: string | null;
        paidAt?: Date | null;
        status: CheckoutOrderStatus;
        stripeClientSecret?: string | null;
        stripePaymentIntentId?: string | null;
      }
    ): Promise<void> => {
      await db
        .update(checkoutOrdersTable)
        .set({
          status: input.status,
          stripePaymentIntentId: input.stripePaymentIntentId ?? null,
          stripeClientSecret: input.stripeClientSecret ?? null,
          lastErrorMessage: input.lastErrorMessage ?? null,
          paidAt: input.paidAt ?? null,
          updatedAt: new Date(),
        })
        .where(eq(checkoutOrdersTable.orderId, orderId));
    };

    const returnExistingOfflineOrder = (
      orderId: string
    ): Response =>
      Response.json(
        {
          success: true,
          message: `Order ${orderId} was already received. We will continue with your payment instructions.`,
          orderId,
        } satisfies CheckoutResponse,
        { status: 200 }
      );

    if (existingOrder) {
      if (paymentMethod !== 'card') {
        return returnExistingOfflineOrder(existingOrder.orderId);
      }

      if (
        existingOrder.status === 'payment_intent_created' &&
        existingOrder.stripeClientSecret
      ) {
        return Response.json(
          {
            success: true,
            message: 'Payment intent already created. Continue payment with Stripe Elements.',
            orderId: existingOrder.orderId,
            clientSecret: existingOrder.stripeClientSecret,
          } satisfies CheckoutResponse,
          { status: 200 }
        );
      }

      if (existingOrder.status === 'payment_succeeded') {
        return Response.json(
          {
            success: true,
            message: `Order ${existingOrder.orderId} has already been paid and recorded.`,
            orderId: existingOrder.orderId,
          } satisfies CheckoutResponse,
          { status: 200 }
        );
      }

      if (existingOrder.status === 'pending_card_configuration') {
        return Response.json(
          {
            success: false,
            message:
              'Card payments are temporarily unavailable. Please choose bank transfer or financing.',
            orderId: existingOrder.orderId,
          } satisfies CheckoutResponse,
          { status: 503 }
        );
      }

      if (existingOrder.status === 'payment_intent_failed') {
        return Response.json(
          {
            success: false,
            message:
              'Card authorization failed. Please wait a moment before retrying or use another payment method.',
            orderId: existingOrder.orderId,
          } satisfies CheckoutResponse,
          { status: 502 }
        );
      }

      if (existingOrder.status === 'payment_canceled') {
        return Response.json(
          {
            success: false,
            message:
              'This card payment attempt was canceled. Please start a new checkout attempt.',
            orderId: existingOrder.orderId,
          } satisfies CheckoutResponse,
          { status: 409 }
        );
      }

      const stripeSecretKey = env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        await updateOrder(existingOrder.orderId, {
          status: 'pending_card_configuration',
          lastErrorMessage: 'Missing STRIPE_SECRET_KEY while resuming card order.',
        });
        await dispatchOrderState({
          orderId: existingOrder.orderId,
          status: 'pending_card_configuration',
        });

        return Response.json(
          {
            success: false,
            message:
              'Card payments are temporarily unavailable. Please choose bank transfer or financing.',
            orderId: existingOrder.orderId,
          } satisfies CheckoutResponse,
          { status: 503 }
        );
      }

      try {
        const paymentIntent = await createStripePaymentIntent({
          orderId: existingOrder.orderId,
          totalCents,
          customerEmail: sanitizedShipping.email,
          stripeSecretKey,
        });

        await updateOrder(existingOrder.orderId, {
          status: 'payment_intent_created',
          stripePaymentIntentId: paymentIntent.paymentIntentId,
          stripeClientSecret: paymentIntent.clientSecret,
          lastErrorMessage: null,
        });
        await dispatchOrderState({
          orderId: existingOrder.orderId,
          status: 'payment_intent_created',
          stripePaymentIntentId: paymentIntent.paymentIntentId,
        });

        return Response.json(
          {
            success: true,
            message: 'Payment intent created. Complete payment with Stripe Elements.',
            orderId: existingOrder.orderId,
            clientSecret: paymentIntent.clientSecret,
          } satisfies CheckoutResponse,
          { status: 200 }
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown Stripe failure.';

        console.error('[checkout] Stripe PaymentIntent resume failed', {
          orderId: existingOrder.orderId,
          error,
        });

        await updateOrder(existingOrder.orderId, {
          status: 'payment_intent_failed',
          lastErrorMessage: errorMessage,
        });
        await dispatchOrderState({
          orderId: existingOrder.orderId,
          status: 'payment_intent_failed',
        });

        return Response.json(
          {
            success: false,
            message:
              'Card authorization is temporarily unavailable. Please try again or use another payment method.',
            orderId: existingOrder.orderId,
          } satisfies CheckoutResponse,
          { status: 502 }
        );
      }
    }

    const orderId = `HYL-${Date.now().toString(36).toUpperCase()}`;

    if (paymentMethod === 'card') {
      const stripeSecretKey = env.STRIPE_SECRET_KEY;

      if (!stripeSecretKey) {
        await insertOrder({
          orderId,
          status: 'pending_card_configuration',
          lastErrorMessage: 'Missing STRIPE_SECRET_KEY.',
        });
        await dispatchOrderState({
          orderId,
          status: 'pending_card_configuration',
        });

        return Response.json(
          {
            success: false,
            message:
              'Card payments are temporarily unavailable. Please choose bank transfer or financing.',
            orderId,
          } satisfies CheckoutResponse,
          { status: 503 }
        );
      }

      await insertOrder({
        orderId,
        status: 'pending_payment_intent',
      });

      try {
        const paymentIntent = await createStripePaymentIntent({
          orderId,
          totalCents,
          customerEmail: sanitizedShipping.email,
          stripeSecretKey,
        });

        await updateOrder(orderId, {
          status: 'payment_intent_created',
          stripePaymentIntentId: paymentIntent.paymentIntentId,
          stripeClientSecret: paymentIntent.clientSecret,
          lastErrorMessage: null,
        });
        await dispatchOrderState({
          orderId,
          status: 'payment_intent_created',
          stripePaymentIntentId: paymentIntent.paymentIntentId,
        });

        return Response.json(
          {
            success: true,
            message: 'Payment intent created. Complete payment with Stripe Elements.',
            orderId,
            clientSecret: paymentIntent.clientSecret,
          } satisfies CheckoutResponse,
          { status: 200 }
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown Stripe failure.';

        console.error('[checkout] Stripe PaymentIntent request failed', {
          orderId,
          error,
        });

        await updateOrder(orderId, {
          status: 'payment_intent_failed',
          lastErrorMessage: errorMessage,
        });
        await dispatchOrderState({
          orderId,
          status: 'payment_intent_failed',
        });

        return Response.json(
          {
            success: false,
            message:
              'Card authorization is temporarily unavailable. Please try again or use another payment method.',
            orderId,
          } satisfies CheckoutResponse,
          { status: 502 }
        );
      }
    }

    await insertOrder({
      orderId,
      status: 'awaiting_offline_payment',
    });
    await dispatchOrderState({
      orderId,
      status: 'awaiting_offline_payment',
    });

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
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      } satisfies CheckoutResponse,
      { status: 500 }
    );
  }
}

export function GET(): Response {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}
