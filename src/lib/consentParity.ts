export interface ConsentRecord {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

export interface ConsentDriftReport {
  hasDrift: boolean;
  reasons: string[];
  localStorageConsent: ConsentRecord | null;
  cookieConsent: ConsentRecord | null;
}

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isString = (value: unknown): value is string => typeof value === 'string';

const toConsentRecord = (input: unknown): ConsentRecord | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const candidate = input as Partial<ConsentRecord>;
  if (
    !isBoolean(candidate.essential) ||
    !isBoolean(candidate.analytics) ||
    !isBoolean(candidate.marketing) ||
    !isString(candidate.timestamp) ||
    !isString(candidate.version)
  ) {
    return null;
  }

  return {
    essential: candidate.essential,
    analytics: candidate.analytics,
    marketing: candidate.marketing,
    timestamp: candidate.timestamp,
    version: candidate.version,
  };
};

export const parseConsentPayload = (raw: string | null | undefined): ConsentRecord | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return toConsentRecord(parsed);
  } catch {
    return null;
  }
};

export const readCookieValue = (
  cookieHeader: string,
  cookieKey: string
): string | null => {
  if (!cookieHeader.trim()) {
    return null;
  }

  const cookieEntry = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${cookieKey}=`));

  if (!cookieEntry) {
    return null;
  }

  return cookieEntry.slice(`${cookieKey}=`.length);
};

export const parseConsentCookie = (
  cookieHeader: string,
  cookieKey: string
): ConsentRecord | null => {
  const cookieValue = readCookieValue(cookieHeader, cookieKey);
  if (!cookieValue) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(cookieValue);
    return parseConsentPayload(decoded);
  } catch {
    return null;
  }
};

export const detectConsentDrift = (
  localStorageConsent: ConsentRecord | null,
  cookieConsent: ConsentRecord | null
): ConsentDriftReport => {
  const reasons: string[] = [];

  if (!localStorageConsent && cookieConsent) {
    reasons.push('cookie-present-localstorage-missing');
  }

  if (localStorageConsent && !cookieConsent) {
    reasons.push('localstorage-present-cookie-missing');
  }

  if (localStorageConsent && cookieConsent) {
    if (localStorageConsent.analytics !== cookieConsent.analytics) {
      reasons.push('analytics-mismatch');
    }

    if (localStorageConsent.marketing !== cookieConsent.marketing) {
      reasons.push('marketing-mismatch');
    }

    if (localStorageConsent.version !== cookieConsent.version) {
      reasons.push('version-mismatch');
    }
  }

  return {
    hasDrift: reasons.length > 0,
    reasons,
    localStorageConsent,
    cookieConsent,
  };
};