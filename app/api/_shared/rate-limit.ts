interface RateLimitOptions {
  bucket: string;
  limit: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitState {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __hylonoRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const getRateLimitStore = (): Map<string, RateLimitEntry> => {
  if (!globalThis.__hylonoRateLimitStore) {
    globalThis.__hylonoRateLimitStore = new Map<string, RateLimitEntry>();
  }

  return globalThis.__hylonoRateLimitStore;
};

const resolveClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
};

export const consumeRateLimit = (
  request: Request,
  { bucket, limit, windowMs }: RateLimitOptions
): RateLimitState => {
  const store = getRateLimitStore();
  const now = Date.now();
  const key = `${bucket}:${resolveClientIp(request)}`;
  const existingEntry = store.get(key);

  const entry =
    existingEntry && existingEntry.resetAt > now
      ? existingEntry
      : { count: 0, resetAt: now + windowMs };

  entry.count += 1;
  store.set(key, entry);

  const remaining = Math.max(0, limit - entry.count);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((entry.resetAt - now) / 1000)
  );

  return {
    allowed: entry.count <= limit,
    limit,
    remaining,
    retryAfterSeconds,
    resetAt: entry.resetAt,
  };
};

export const createRateLimitResponse = (
  state: RateLimitState,
  message: string
): Response =>
  Response.json(
    {
      success: false,
      message,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(state.retryAfterSeconds),
        'X-RateLimit-Limit': String(state.limit),
        'X-RateLimit-Remaining': String(state.remaining),
        'X-RateLimit-Reset': String(state.resetAt),
      },
    }
  );

export const resetRateLimitStoreForTests = (): void => {
  getRateLimitStore().clear();
};
