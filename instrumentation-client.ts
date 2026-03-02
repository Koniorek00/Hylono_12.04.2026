import * as Sentry from '@sentry/nextjs';
import { readPublicRuntimeEnv } from './utils/featureFlagEnv';

const sentryDsn = readPublicRuntimeEnv('NEXT_PUBLIC_SENTRY_DSN');

const runtimeEnvironment =
  readPublicRuntimeEnv('NEXT_PUBLIC_RUNTIME_ENV') ??
  readPublicRuntimeEnv('NEXT_PUBLIC_NODE_ENV') ??
  'development';

Sentry.init({
  dsn: sentryDsn,
  environment: runtimeEnvironment,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;