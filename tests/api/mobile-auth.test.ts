import { randomBytes, scryptSync } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetRateLimitStoreForTests } from '@/app/api/_shared/rate-limit';

const buildPasswordHash = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');

  return `scrypt$${salt}$${hash}`;
};

const { POST: createMobileSession } = await import(
  '@/app/api/mobile/auth/route'
);
const { POST: refreshMobileSession } = await import(
  '@/app/api/mobile/auth/refresh/route'
);

describe('mobile auth API', () => {
  beforeEach(() => {
    resetRateLimitStoreForTests();
    vi.unstubAllEnvs();
    vi.stubEnv('AUTH_CREDENTIALS_EMAIL', 'operator@hylono.example');
    vi.stubEnv(
      'AUTH_CREDENTIALS_PASSWORD_HASH',
      buildPasswordHash('super-secret-password')
    );
  });

  it('creates a mobile session for valid credentials', async () => {
    const response = await createMobileSession(
      new Request('http://localhost:3000/api/mobile/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'operator@hylono.example',
          password: 'super-secret-password',
        }),
      })
    );
    const result = (await response.json()) as {
      success: boolean;
      session?: {
        accessToken: string;
        refreshToken: string;
        user: {
          email: string;
        };
      };
    };

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.session?.accessToken).toBeTruthy();
    expect(result.session?.refreshToken).toBeTruthy();
    expect(result.session?.user.email).toBe('operator@hylono.example');
  });

  it('rejects invalid credentials', async () => {
    const response = await createMobileSession(
      new Request('http://localhost:3000/api/mobile/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'operator@hylono.example',
          password: 'wrong-password',
        }),
      })
    );
    const result = (await response.json()) as {
      success: boolean;
      message: string;
    };

    expect(response.status).toBe(401);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email or password.');
  });

  it('refreshes a session from a valid refresh token', async () => {
    const initialResponse = await createMobileSession(
      new Request('http://localhost:3000/api/mobile/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'operator@hylono.example',
          password: 'super-secret-password',
        }),
      })
    );
    const initialResult = (await initialResponse.json()) as {
      success: boolean;
      session?: {
        refreshToken: string;
      };
    };

    const refreshResponse = await refreshMobileSession(
      new Request('http://localhost:3000/api/mobile/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: initialResult.session?.refreshToken,
        }),
      })
    );
    const refreshResult = (await refreshResponse.json()) as {
      success: boolean;
      session?: {
        accessToken: string;
      };
    };

    expect(initialResult.success).toBe(true);
    expect(refreshResponse.status).toBe(200);
    expect(refreshResult.success).toBe(true);
    expect(refreshResult.session?.accessToken).toBeTruthy();
  });
});
