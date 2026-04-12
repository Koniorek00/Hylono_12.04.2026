import { createHmac, timingSafeEqual } from 'node:crypto';

export interface StripeWebhookEvent<TObject = Record<string, unknown>> {
  created: number;
  data: {
    object: TObject;
  };
  id: string;
  livemode: boolean;
  type: string;
}

export interface StripePaymentIntentLike {
  cancellation_reason?: string | null;
  id: string;
  last_payment_error?: {
    code?: string | null;
    message?: string | null;
  } | null;
  metadata?: Record<string, string>;
  object: 'payment_intent';
  status?: string;
}

const DEFAULT_TOLERANCE_SECONDS = 300;

function parseStripeSignatureHeader(signatureHeader: string): {
  signatures: string[];
  timestamp: number | null;
} {
  const parts = signatureHeader.split(',');
  const signatures: string[] = [];
  let timestamp: number | null = null;

  for (const part of parts) {
    const [rawKey, rawValue] = part.split('=');
    const key = rawKey?.trim();
    const value = rawValue?.trim();

    if (!key || !value) {
      continue;
    }

    if (key === 't') {
      const parsed = Number.parseInt(value, 10);
      timestamp = Number.isFinite(parsed) ? parsed : null;
      continue;
    }

    if (key === 'v1') {
      signatures.push(value);
    }
  }

  return {
    signatures,
    timestamp,
  };
}

export function verifyStripeWebhookSignature(input: {
  payload: string;
  secret: string;
  signatureHeader: string | null;
  toleranceSeconds?: number;
}): boolean {
  const { payload, secret, signatureHeader } = input;
  const toleranceSeconds =
    input.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;

  if (!signatureHeader) {
    return false;
  }

  const { signatures, timestamp } = parseStripeSignatureHeader(signatureHeader);
  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
  if (ageSeconds > toleranceSeconds) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  const expectedBuffer = Buffer.from(expectedSignature);

  return signatures.some((signature) => {
    const providedBuffer = Buffer.from(signature);

    if (providedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(providedBuffer, expectedBuffer);
  });
}

export function parseStripeWebhookEvent(
  payload: string
): StripeWebhookEvent | null {
  try {
    return JSON.parse(payload) as StripeWebhookEvent;
  } catch {
    return null;
  }
}
