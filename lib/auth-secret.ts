import { createHash } from 'node:crypto';

const DEVELOPMENT_AUTH_SECRET_NAMESPACE = 'hylono-auth-dev-fallback';

type AuthNodeEnv = 'development' | 'test' | 'production';

interface ResolveAuthSecretOptions {
  explicitSecret?: string;
  nodeEnv: AuthNodeEnv;
  seed?: string;
  allowProductionFallback?: boolean;
}

export const deriveDevelopmentAuthSecret = (seed: string): string =>
  createHash('sha256')
    .update(`${DEVELOPMENT_AUTH_SECRET_NAMESPACE}:${seed}`)
    .digest('hex');

export const resolveAuthSecret = ({
  explicitSecret,
  nodeEnv,
  seed = process.cwd(),
  allowProductionFallback = false,
}: ResolveAuthSecretOptions): string | undefined => {
  const normalizedSecret = explicitSecret?.trim();

  if (normalizedSecret) {
    return normalizedSecret;
  }

  if (nodeEnv === 'production' && !allowProductionFallback) {
    return undefined;
  }

  return deriveDevelopmentAuthSecret(seed);
};
