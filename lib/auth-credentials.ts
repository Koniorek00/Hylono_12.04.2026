import { scryptSync, timingSafeEqual } from 'node:crypto';

const PASSWORD_HASH_PREFIX = 'scrypt';
const DEFAULT_CREDENTIALS_NAME = 'Hylono User';

export interface CredentialsAuthConfig {
  email?: string;
  passwordHash?: string;
}

export type CredentialsVerificationResult =
  | {
      status: 'success';
      email: string;
      name: string;
    }
  | {
      status: 'invalid' | 'not_configured';
    };

export const normalizeCredentialsEmail = (value: string): string =>
  value.trim().toLowerCase();

export const readCredentialsAuthConfig = (): CredentialsAuthConfig => ({
  email: process.env.AUTH_CREDENTIALS_EMAIL?.trim(),
  passwordHash: process.env.AUTH_CREDENTIALS_PASSWORD_HASH?.trim(),
});

export const isCredentialsAuthConfigured = (
  config: CredentialsAuthConfig = readCredentialsAuthConfig()
): boolean => Boolean(config.email && config.passwordHash);

const verifyScryptPassword = (
  password: string,
  encodedHash: string
): boolean => {
  const [prefix, salt, hashHex] = encodedHash.split('$');

  if (
    prefix !== PASSWORD_HASH_PREFIX ||
    typeof salt !== 'string' ||
    typeof hashHex !== 'string' ||
    !salt ||
    !hashHex
  ) {
    return false;
  }

  try {
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(hashHex, 'hex');

    if (derived.length !== expected.length) {
      return false;
    }

    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
};

export const verifyConfiguredCredentials = (
  credentials: {
    email: string;
    password: string;
  },
  config: CredentialsAuthConfig = readCredentialsAuthConfig()
): CredentialsVerificationResult => {
  if (!config.email || !config.passwordHash) {
    return {
      status: 'not_configured',
    };
  }

  const normalizedEmail = normalizeCredentialsEmail(credentials.email);
  const normalizedExpectedEmail = normalizeCredentialsEmail(config.email);

  if (normalizedEmail !== normalizedExpectedEmail) {
    return {
      status: 'invalid',
    };
  }

  if (!verifyScryptPassword(credentials.password, config.passwordHash)) {
    return {
      status: 'invalid',
    };
  }

  return {
    status: 'success',
    email: normalizedExpectedEmail,
    name: DEFAULT_CREDENTIALS_NAME,
  };
};
