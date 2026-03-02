type FeatureFlagEnvValue = 'true' | 'false';

const PUBLIC_FLAG_PREFIX = 'NEXT_PUBLIC_FLAG_';

const isPublicEnvKey = (key: string): boolean => key.startsWith('NEXT_PUBLIC_');

const isFeatureFlagPublicKey = (key: string): boolean =>
  key.startsWith(PUBLIC_FLAG_PREFIX);

export const readPublicRuntimeEnv = (key: string): string | undefined => {
  if (!isPublicEnvKey(key)) return undefined;

  if (typeof process === 'undefined' || typeof process.env === 'undefined') {
    return undefined;
  }

  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const getFeatureFlagCandidates = (flag: string): string[] => {
  const normalized = isFeatureFlagPublicKey(flag)
    ? flag.slice(PUBLIC_FLAG_PREFIX.length)
    : flag;

  const candidates = [normalized, normalized.toUpperCase()]
    .filter((value) => value.length > 0)
    .map((value) => `${PUBLIC_FLAG_PREFIX}${value}`);

  return Array.from(new Set(candidates));
};

export const readFeatureFlagEnvOverride = (
  flag: string
): FeatureFlagEnvValue | undefined => {
  const candidates = getFeatureFlagCandidates(flag);

  for (const envKey of candidates) {
    const value = readPublicRuntimeEnv(envKey);
    if (value === 'true' || value === 'false') {
      return value;
    }
  }

  return undefined;
};

export const setFeatureFlagEnvOverrideForTests = (
  flag: string,
  value: FeatureFlagEnvValue | undefined
): void => {
  if (typeof process === 'undefined' || typeof process.env === 'undefined') {
    return;
  }

  const candidates = getFeatureFlagCandidates(flag);
  const primaryKey = candidates[0];

  for (const envKey of candidates) {
    delete process.env[envKey];
  }

  if (typeof value === 'undefined' || !primaryKey) {
    return;
  }

  process.env[primaryKey] = value;
};