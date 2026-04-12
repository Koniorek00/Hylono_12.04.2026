import { eq } from 'drizzle-orm';
import { ensureDatabaseReady, getDb, isDatabaseConfigured } from '@/lib/db/client';
import {
  checkoutOrdersTable,
  stripeWebhookEventsTable,
} from '@/lib/db/schema';
import { env } from '@/lib/env';
import {
  parseStripeWebhookEvent,
  type StripePaymentIntentLike,
  verifyStripeWebhookSignature,
} from '@/lib/stripe-webhooks';

type WebhookOrderStatus =
  | 'payment_intent_failed'
  | 'payment_succeeded'
  | 'payment_canceled';

const isSupportedStripeEvent = (
  eventType: string
): eventType is
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'payment_intent.canceled' =>
  eventType === 'payment_intent.succeeded' ||
  eventType === 'payment_intent.payment_failed' ||
  eventType === 'payment_intent.canceled';

const resolveWebhookStatus = (
  eventType: 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'payment_intent.canceled'
): WebhookOrderStatus => {
  if (eventType === 'payment_intent.succeeded') {
    return 'payment_succeeded';
  }

  if (eventType === 'payment_intent.canceled') {
    return 'payment_canceled';
  }

  return 'payment_intent_failed';
};

const resolveStripeErrorMessage = (
  paymentIntent: StripePaymentIntentLike,
  eventType: 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'payment_intent.canceled'
): string | null => {
  if (eventType === 'payment_intent.succeeded') {
    return null;
  }

  if (eventType === 'payment_intent.canceled') {
    return paymentIntent.cancellation_reason ?? 'Stripe canceled the payment intent.';
  }

  return (
    paymentIntent.last_payment_error?.message ??
    paymentIntent.last_payment_error?.code ??
    'Stripe reported a payment intent failure.'
  );
};

export async function POST(request: Request): Promise<Response> {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET missing');
    return Response.json(
      {
        received: false,
        message: 'Stripe webhook secret is not configured.',
      },
      { status: 503 }
    );
  }

  const payload = await request.text();
  const signatureHeader = request.headers.get('stripe-signature');

  if (
    !verifyStripeWebhookSignature({
      payload,
      secret: webhookSecret,
      signatureHeader,
    })
  ) {
    return Response.json(
      {
        received: false,
        message: 'Invalid Stripe webhook signature.',
      },
      { status: 400 }
    );
  }

  const event = parseStripeWebhookEvent(payload);
  if (!event) {
    return Response.json(
      {
        received: false,
        message: 'Invalid Stripe webhook payload.',
      },
      { status: 400 }
    );
  }

  if (!isDatabaseConfigured()) {
    console.error('[stripe-webhook] DATABASE_URL missing; cannot reconcile event', {
      eventId: event.id,
      eventType: event.type,
    });
    return Response.json(
      {
        received: false,
        message: 'Persistence is unavailable for Stripe reconciliation.',
      },
      { status: 503 }
    );
  }

  await ensureDatabaseReady();
  const db = getDb();

  const existingEvent = (
    await db
      .select()
      .from(stripeWebhookEventsTable)
      .where(eq(stripeWebhookEventsTable.id, event.id))
  )[0];

  if (existingEvent) {
    return Response.json(
      {
        received: true,
        duplicate: true,
      },
      { status: 200 }
    );
  }

  if (!isSupportedStripeEvent(event.type)) {
    return Response.json(
      {
        received: true,
        ignored: true,
      },
      { status: 200 }
    );
  }

  const paymentIntent = event.data.object as unknown as StripePaymentIntentLike;
  if (!paymentIntent || paymentIntent.object !== 'payment_intent' || !paymentIntent.id) {
    return Response.json(
      {
        received: false,
        message: 'Unsupported Stripe object payload.',
      },
      { status: 400 }
    );
  }

  let order = (
    await db
      .select()
      .from(checkoutOrdersTable)
      .where(eq(checkoutOrdersTable.stripePaymentIntentId, paymentIntent.id))
  )[0];

  if (!order && paymentIntent.metadata?.orderId) {
    order = (
      await db
        .select()
        .from(checkoutOrdersTable)
        .where(eq(checkoutOrdersTable.orderId, paymentIntent.metadata.orderId))
    )[0];
  }

  if (!order) {
    console.error('[stripe-webhook] No matching checkout order found', {
      eventId: event.id,
      eventType: event.type,
      paymentIntentId: paymentIntent.id,
      orderId: paymentIntent.metadata?.orderId,
    });

    return Response.json(
      {
        received: false,
        message: 'No matching checkout order found for Stripe event.',
      },
      { status: 500 }
    );
  }

  const nextStatus = resolveWebhookStatus(event.type);
  const lastErrorMessage = resolveStripeErrorMessage(paymentIntent, event.type);
  const paidAt = nextStatus === 'payment_succeeded' ? new Date() : null;

  await db
    .update(checkoutOrdersTable)
    .set({
      status: nextStatus,
      stripePaymentIntentId: paymentIntent.id,
      lastErrorMessage,
      paidAt,
      updatedAt: new Date(),
    })
    .where(eq(checkoutOrdersTable.orderId, order.orderId));

  await db
    .insert(stripeWebhookEventsTable)
    .values({
      id: event.id,
      eventType: event.type,
      stripePaymentIntentId: paymentIntent.id,
      orderId: order.orderId,
    })
    .onConflictDoNothing();

  console.info('[stripe-webhook] Reconciled checkout order', {
    eventId: event.id,
    eventType: event.type,
    orderId: order.orderId,
    paymentIntentId: paymentIntent.id,
    status: nextStatus,
  });

  return Response.json(
    {
      received: true,
      orderId: order.orderId,
      status: nextStatus,
    },
    { status: 200 }
  );
}
