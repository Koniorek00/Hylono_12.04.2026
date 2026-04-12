import { createHash } from 'node:crypto';

export const RECENT_SUBMISSION_WINDOW_MS = 10 * 60 * 1000;

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => typeof entry !== 'undefined')
      .sort(([left], [right]) => left.localeCompare(right));

    return `{${entries
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

export function buildRequestFingerprint(value: unknown): string {
  return createHash('sha256').update(stableSerialize(value)).digest('hex');
}

export function recentSubmissionThreshold(
  windowMs = RECENT_SUBMISSION_WINDOW_MS
): Date {
  return new Date(Date.now() - windowMs);
}
