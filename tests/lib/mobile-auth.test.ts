import { describe, expect, it } from 'vitest';
import {
  MOBILE_AUTH_SCOPE_RENTALS_READ,
  issueMobileAuthSession,
  verifyMobileAuthToken,
} from '@/lib/mobile-auth';

describe('mobile auth token helpers', () => {
  it('issues and verifies scoped access and refresh tokens', () => {
    const session = issueMobileAuthSession({
      email: 'operator@hylono.example',
      name: 'Operator',
    });

    expect(session).not.toBeNull();
    expect(session?.tokenType).toBe('Bearer');
    expect(session?.scopes).toEqual([MOBILE_AUTH_SCOPE_RENTALS_READ]);

    const accessClaims = verifyMobileAuthToken(
      session?.accessToken ?? '',
      'access'
    );
    const refreshClaims = verifyMobileAuthToken(
      session?.refreshToken ?? '',
      'refresh'
    );

    expect(accessClaims?.email).toBe('operator@hylono.example');
    expect(accessClaims?.scope).toContain(MOBILE_AUTH_SCOPE_RENTALS_READ);
    expect(refreshClaims?.email).toBe('operator@hylono.example');
  });

  it('rejects tampered tokens', () => {
    const session = issueMobileAuthSession({
      email: 'operator@hylono.example',
    });
    const tamperedAccessToken = `${session?.accessToken ?? ''}tampered`;

    expect(verifyMobileAuthToken(tamperedAccessToken, 'access')).toBeNull();
  });
});
