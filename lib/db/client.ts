import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { readRuntimeEnv } from '@/lib/env';
import * as schema from '@/lib/db/schema';

let databaseClient: NeonHttpDatabase<typeof schema> | null = null;

const getDatabaseUrl = (): string | undefined => readRuntimeEnv('DATABASE_URL');

export const isDatabaseConfigured = (): boolean => Boolean(getDatabaseUrl());

export function getDb(): NeonHttpDatabase<typeof schema> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for conversion API persistence.');
  }

  if (databaseClient) {
    return databaseClient;
  }

  const sqlClient = neon(databaseUrl);
  databaseClient = drizzle({ client: sqlClient, schema });
  return databaseClient;
}
