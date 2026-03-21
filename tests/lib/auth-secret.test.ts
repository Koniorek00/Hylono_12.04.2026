import { describe, expect, it } from 'vitest';
import {
  deriveDevelopmentAuthSecret,
  resolveAuthSecret,
} from '@/lib/auth-secret';

describe('deriveDevelopmentAuthSecret', () => {
  it('returns a stable sha256 hex digest for the same seed', () => {
    const first = deriveDevelopmentAuthSecret('repo-seed');
    const second = deriveDevelopmentAuthSecret('repo-seed');

    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  it('varies when the seed changes', () => {
    expect(deriveDevelopmentAuthSecret('repo-a')).not.toBe(
      deriveDevelopmentAuthSecret('repo-b')
    );
  });
});

describe('resolveAuthSecret', () => {
  it('prefers the explicit secret when present', () => {
    expect(
      resolveAuthSecret({
        explicitSecret: 'configured-secret',
        nodeEnv: 'development',
        seed: 'repo-seed',
      })
    ).toBe('configured-secret');
  });

  it('falls back to a deterministic development secret outside production', () => {
    expect(
      resolveAuthSecret({
        nodeEnv: 'development',
        seed: 'repo-seed',
      })
    ).toBe(deriveDevelopmentAuthSecret('repo-seed'));

    expect(
      resolveAuthSecret({
        nodeEnv: 'test',
        seed: 'repo-seed',
      })
    ).toBe(deriveDevelopmentAuthSecret('repo-seed'));
  });

  it('keeps production strict when no explicit secret is configured', () => {
    expect(
      resolveAuthSecret({
        nodeEnv: 'production',
        seed: 'repo-seed',
      })
    ).toBeUndefined();
  });

  it('can opt into a deterministic fallback for local production-style previews', () => {
    expect(
      resolveAuthSecret({
        nodeEnv: 'production',
        seed: 'repo-seed',
        allowProductionFallback: true,
      })
    ).toBe(deriveDevelopmentAuthSecret('repo-seed'));
  });
});
