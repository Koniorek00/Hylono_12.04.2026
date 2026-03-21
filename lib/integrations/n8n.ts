import { createHmac, randomUUID } from 'node:crypto';
import { env } from '@/lib/env';

type IntakeWebhookTarget =
  | 'booking'
  | 'contact'
  | 'newsletter'
  | 'order'
  | 'rental';

type IntakeEventName =
  | 'booking.requested'
  | 'contact.created'
  | 'newsletter.subscribed'
  | 'order.created'
  | 'rental.requested';

interface WorkflowEnvelope<TPayload> {
  eventId: string;
  eventType: IntakeEventName;
  environment: typeof env.NODE_ENV;
  occurredAt: string;
  source: 'hylono-web';
  payload: TPayload;
}

interface DispatchOptions<TPayload> {
  eventType: IntakeEventName;
  payload: TPayload;
  target: IntakeWebhookTarget;
}

const DEFAULT_TIMEOUT_MS = 5000;

const resolveWebhookUrl = (
  target: IntakeWebhookTarget
): string | undefined => {
  if (target === 'contact') {
    return env.N8N_CONTACT_WEBHOOK_URL;
  }

  if (target === 'booking') {
    return env.N8N_BOOKING_WEBHOOK_URL;
  }

  if (target === 'order') {
    return env.N8N_ORDER_WEBHOOK_URL;
  }

  if (target === 'rental') {
    return env.N8N_RENTAL_WEBHOOK_URL;
  }

  return env.N8N_NEWSLETTER_WEBHOOK_URL;
};

const resolveTimeoutMs = (): number => {
  const configured = Number.parseInt(env.N8N_WEBHOOK_TIMEOUT_MS ?? '', 10);

  if (Number.isFinite(configured) && configured > 0) {
    return configured;
  }

  return DEFAULT_TIMEOUT_MS;
};

const buildHeaders = (
  body: string,
  eventId: string,
  eventType: IntakeEventName
): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-hylono-event-id': eventId,
    'x-hylono-event-type': eventType,
  };

  if (env.N8N_WEBHOOK_SIGNING_KEY) {
    headers['x-hylono-signature'] = createHmac(
      'sha256',
      env.N8N_WEBHOOK_SIGNING_KEY
    )
      .update(body)
      .digest('hex');
  }

  return headers;
};

export async function dispatchIntakeEventToN8n<TPayload>({
  eventType,
  payload,
  target,
}: DispatchOptions<TPayload>): Promise<void> {
  const webhookUrl = resolveWebhookUrl(target);

  if (!webhookUrl) {
    return;
  }

  const envelope: WorkflowEnvelope<TPayload> = {
    eventId: randomUUID(),
    eventType,
    environment: env.NODE_ENV,
    occurredAt: new Date().toISOString(),
    source: 'hylono-web',
    payload,
  };

  const body = JSON.stringify(envelope);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: buildHeaders(body, envelope.eventId, eventType),
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(resolveTimeoutMs()),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.warn('[n8n] Workflow dispatch returned non-2xx', {
        eventId: envelope.eventId,
        eventType,
        status: response.status,
        body: responseBody.slice(0, 400),
        target,
      });
    }
  } catch (error) {
    console.error('[n8n] Workflow dispatch failed', {
      eventId: envelope.eventId,
      eventType,
      target,
      error,
    });
  }
}
