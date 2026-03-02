import * as Sentry from '@sentry/nextjs';
import { readRuntimeEnv } from './lib/env';

export async function register() {
  if (readRuntimeEnv('NEXT_RUNTIME') === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (readRuntimeEnv('NEXT_RUNTIME') === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;