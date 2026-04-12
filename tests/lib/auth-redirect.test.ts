import { describe, expect, it } from 'vitest';
import {
  buildLoginRedirectPath,
  DEFAULT_AUTH_SUCCESS_PATH,
  getSafeAuthRedirectPath,
  getSafeAuthRedirectUrl,
  resolveLoginRedirectPath,
} from '@/lib/auth-redirect';

describe('buildLoginRedirectPath', () => {
  it('preserves the requested protected path and query string', () => {
    expect(buildLoginRedirectPath('/nexus/clients?tab=active')).toBe(
      '/login?auth=required&next=%2Fnexus%2Fclients%3Ftab%3Dactive'
    );
  });
});

describe('getSafeAuthRedirectPath', () => {
  it('allows safe relative paths', () => {
    expect(getSafeAuthRedirectPath('/nexus/studio?action=new')).toBe(
      '/nexus/studio?action=new'
    );
  });

  it('blocks login and auth callback loops', () => {
    expect(getSafeAuthRedirectPath('/login?auth=required')).toBe(
      DEFAULT_AUTH_SUCCESS_PATH
    );
    expect(getSafeAuthRedirectPath('/api/auth/callback/credentials')).toBe(
      DEFAULT_AUTH_SUCCESS_PATH
    );
  });

  it('rejects external absolute URLs unless they match the configured base URL', () => {
    expect(
      getSafeAuthRedirectPath('https://evil.example/steal-me', {
        baseUrl: 'https://hylono.eu',
      })
    ).toBe(DEFAULT_AUTH_SUCCESS_PATH);
  });

  it('accepts same-origin absolute callback URLs', () => {
    expect(
      getSafeAuthRedirectPath('https://hylono.eu/nexus/team?view=certs', {
        baseUrl: 'https://hylono.eu',
      })
    ).toBe('/nexus/team?view=certs');
  });

  it('rejects protocol-relative values', () => {
    expect(getSafeAuthRedirectPath('//evil.example')).toBe(
      DEFAULT_AUTH_SUCCESS_PATH
    );
  });
});

describe('resolveLoginRedirectPath', () => {
  it('prefers the explicit next parameter', () => {
    expect(
      resolveLoginRedirectPath({
        next: '/account?tab=settings',
        callbackUrl: '/nexus',
      })
    ).toBe('/account?tab=settings');
  });

  it('falls back to callbackUrl when next is absent', () => {
    expect(
      resolveLoginRedirectPath(
        {
          callbackUrl: 'https://hylono.eu/nexus/docs',
        },
        { baseUrl: 'https://hylono.eu' }
      )
    ).toBe('/nexus/docs');
  });
});

describe('getSafeAuthRedirectUrl', () => {
  it('returns an absolute same-origin URL', () => {
    expect(
      getSafeAuthRedirectUrl(
        '/nexus/fleet',
        'https://hylono.eu',
        DEFAULT_AUTH_SUCCESS_PATH
      )
    ).toBe('https://hylono.eu/nexus/fleet');
  });

  it('falls back to the default account path for unsafe values', () => {
    expect(
      getSafeAuthRedirectUrl(
        'https://evil.example/redirect',
        'https://hylono.eu',
        DEFAULT_AUTH_SUCCESS_PATH
      )
    ).toBe('https://hylono.eu/account');
  });
});
