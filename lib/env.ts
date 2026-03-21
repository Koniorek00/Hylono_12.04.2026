import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AUTH_CREDENTIALS_EMAIL: z.string().email().optional(),
    AUTH_CREDENTIALS_PASSWORD_HASH: z.string().min(1).optional(),
    ARCJET_KEY: z.string().min(1).optional(),
    DATABASE_URL: z.string().url().optional(),
    N8N_BOOKING_WEBHOOK_URL: z.string().url().optional(),
    N8N_ORDER_WEBHOOK_URL: z.string().url().optional(),
    N8N_CONTACT_WEBHOOK_URL: z.string().url().optional(),
    N8N_NEWSLETTER_WEBHOOK_URL: z.string().url().optional(),
    N8N_RENTAL_WEBHOOK_URL: z.string().url().optional(),
    N8N_WEBHOOK_SIGNING_KEY: z.string().min(1).optional(),
    N8N_WEBHOOK_TIMEOUT_MS: z.string().regex(/^\d+$/).optional(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    POSTGRES_ROOT_PASSWORD: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_AUDIENCE_ID: z.string().min(1).optional(),
    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
    SENTRY_DSN: z.string().min(1).optional(),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    TWENTY_API_BASE_URL: z.string().url().optional(),
    TWENTY_API_KEY: z.string().min(1).optional(),
    TRIGGER_PROJECT_REF: z.string().min(1).optional(),
    TRIGGER_SECRET_KEY: z.string().min(1).optional(),
    UPLOADTHING_SECRET: z.string().min(1).optional(),
    NOVU_API_BASE_URL: z.string().url().optional(),
    NOVU_API_SECRET: z.string().min(1).optional(),
    NOVU_WORKFLOW_ID: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3001'),
    NEXT_PUBLIC_CONTROL_PANEL_URL: z.string().url().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default('https://eu.i.posthog.com'),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1).optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url().default('https://hylono.eu'),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  },
  runtimeEnv: {
    AUTH_CREDENTIALS_EMAIL: process.env.AUTH_CREDENTIALS_EMAIL,
    AUTH_CREDENTIALS_PASSWORD_HASH: process.env.AUTH_CREDENTIALS_PASSWORD_HASH,
    ARCJET_KEY: process.env.ARCJET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    N8N_BOOKING_WEBHOOK_URL: process.env.N8N_BOOKING_WEBHOOK_URL,
    N8N_ORDER_WEBHOOK_URL: process.env.N8N_ORDER_WEBHOOK_URL,
    N8N_CONTACT_WEBHOOK_URL: process.env.N8N_CONTACT_WEBHOOK_URL,
    N8N_NEWSLETTER_WEBHOOK_URL: process.env.N8N_NEWSLETTER_WEBHOOK_URL,
    N8N_RENTAL_WEBHOOK_URL: process.env.N8N_RENTAL_WEBHOOK_URL,
    N8N_WEBHOOK_SIGNING_KEY: process.env.N8N_WEBHOOK_SIGNING_KEY,
    N8N_WEBHOOK_TIMEOUT_MS: process.env.N8N_WEBHOOK_TIMEOUT_MS,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    POSTGRES_ROOT_PASSWORD: process.env.POSTGRES_ROOT_PASSWORD,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CONTROL_PANEL_URL: process.env.NEXT_PUBLIC_CONTROL_PANEL_URL,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    TWENTY_API_BASE_URL: process.env.TWENTY_API_BASE_URL,
    TWENTY_API_KEY: process.env.TWENTY_API_KEY,
    TRIGGER_PROJECT_REF: process.env.TRIGGER_PROJECT_REF,
    TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    NOVU_API_BASE_URL: process.env.NOVU_API_BASE_URL,
    NOVU_API_SECRET: process.env.NOVU_API_SECRET,
    NOVU_WORKFLOW_ID: process.env.NOVU_WORKFLOW_ID,
  },
  emptyStringAsUndefined: true,
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === 'true' || process.env.CI === 'true',
});

type FeatureFlagEnvValue = 'true' | 'false';

export const readRuntimeEnv = (key: string): string | undefined =>
  process.env[key];

export const readFeatureFlagEnvOverride = (
  flag: string
): FeatureFlagEnvValue | undefined => {
  const value = readRuntimeEnv(`NEXT_PUBLIC_FLAG_${flag}`);

  if (value === 'true' || value === 'false') {
    return value;
  }

  return undefined;
};

export const setFeatureFlagEnvOverrideForTests = (
  flag: string,
  value: FeatureFlagEnvValue | undefined
): void => {
  const key = `NEXT_PUBLIC_FLAG_${flag}`;

  if (typeof value === 'undefined') {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
};
