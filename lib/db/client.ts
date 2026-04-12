import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { drizzle as drizzleNeon, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePostgresJs, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env, readRuntimeEnv } from '@/lib/env';
import * as schema from '@/lib/db/schema';

type HylonoDatabase =
  | NeonHttpDatabase<typeof schema>
  | PostgresJsDatabase<typeof schema>;

let databaseClient: HylonoDatabase | null = null;
let bootstrapPromise: Promise<void> | null = null;

const resolveConfiguredDatabaseUrl = (): string | undefined =>
  readRuntimeEnv('DATABASE_URL');

const resolveLocalFallbackDatabaseUrl = (): string | undefined => {
  if (!env.POSTGRES_ROOT_PASSWORD) {
    return undefined;
  }

  if (readRuntimeEnv('VERCEL')) {
    return undefined;
  }

  return `postgresql://postgres:${env.POSTGRES_ROOT_PASSWORD}@127.0.0.1:5432/postgres`;
};

const getDatabaseUrl = (): string | undefined =>
  resolveConfiguredDatabaseUrl() ?? resolveLocalFallbackDatabaseUrl();

const isNeonUrl = (databaseUrl: string): boolean => {
  try {
    const host = new URL(databaseUrl).hostname.toLowerCase();
    return host.includes('neon.tech');
  } catch {
    return false;
  }
};

const createDatabaseClient = (databaseUrl: string): HylonoDatabase => {
  if (isNeonUrl(databaseUrl)) {
    const sqlClient = neon(databaseUrl);
    return drizzleNeon({ client: sqlClient, schema });
  }

  const sqlClient = postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });

  return drizzlePostgresJs(sqlClient, { schema });
};

const bootstrapCoreTables = async (db: HylonoDatabase): Promise<void> => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id text PRIMARY KEY,
      ticket_id text NOT NULL UNIQUE,
      name text NOT NULL,
      email text NOT NULL,
      subject text NOT NULL,
      message text NOT NULL,
      phone text,
      company text,
      inquiry_type text NOT NULL,
      submission_hash text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS booking_requests (
      id text PRIMARY KEY,
      booking_ref text NOT NULL UNIQUE,
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      preferred_date text,
      preferred_time text,
      timezone text NOT NULL,
      tech_interest text,
      notes text,
      booking_type text NOT NULL,
      submission_hash text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      first_name text,
      source text NOT NULL,
      provider_synced boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS checkout_orders (
      id text PRIMARY KEY,
      order_id text NOT NULL UNIQUE,
      payment_method text NOT NULL,
      email text NOT NULL,
      request_fingerprint text,
      shipping jsonb NOT NULL,
      items jsonb NOT NULL,
      total_cents integer NOT NULL,
      currency text NOT NULL DEFAULT 'pln',
      status text NOT NULL,
      stripe_payment_intent_id text,
      stripe_client_secret text,
      last_error_message text,
      paid_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS rental_applications (
      id text PRIMARY KEY,
      rental_id text NOT NULL UNIQUE,
      user_id text NOT NULL,
      contact jsonb,
      items jsonb NOT NULL,
      term_months integer NOT NULL,
      status text NOT NULL,
      total_monthly_cents integer NOT NULL,
      submission_hash text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS stripe_webhook_events (
      id text PRIMARY KEY,
      event_type text NOT NULL,
      stripe_payment_intent_id text,
      order_id text,
      processed_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS rental_applications
    ADD COLUMN IF NOT EXISTS contact jsonb
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS contact_inquiries
    ADD COLUMN IF NOT EXISTS submission_hash text
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS booking_requests
    ADD COLUMN IF NOT EXISTS submission_hash text
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS checkout_orders
    ADD COLUMN IF NOT EXISTS request_fingerprint text
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS checkout_orders
    ADD COLUMN IF NOT EXISTS stripe_client_secret text
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS checkout_orders
    ADD COLUMN IF NOT EXISTS last_error_message text
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS checkout_orders
    ADD COLUMN IF NOT EXISTS paid_at timestamptz
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS checkout_orders
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()
  `);

  await db.execute(sql`
    ALTER TABLE IF EXISTS rental_applications
    ADD COLUMN IF NOT EXISTS submission_hash text
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS contact_inquiries_submission_hash_idx
    ON contact_inquiries (submission_hash)
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS booking_requests_submission_hash_idx
    ON booking_requests (submission_hash)
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS checkout_orders_request_fingerprint_idx
    ON checkout_orders (request_fingerprint)
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS rental_applications_submission_hash_idx
    ON rental_applications (submission_hash)
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS stripe_webhook_events_payment_intent_idx
    ON stripe_webhook_events (stripe_payment_intent_id)
  `);
};

export const isDatabaseConfigured = (): boolean => Boolean(getDatabaseUrl());

export function getDb(): HylonoDatabase {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for conversion API persistence.');
  }

  if (databaseClient) {
    return databaseClient;
  }

  databaseClient = createDatabaseClient(databaseUrl);
  return databaseClient;
}

export async function ensureDatabaseReady(): Promise<void> {
  if (bootstrapPromise) {
    await bootstrapPromise;
    return;
  }

  const db = getDb();
  bootstrapPromise = bootstrapCoreTables(db);
  await bootstrapPromise;
}
