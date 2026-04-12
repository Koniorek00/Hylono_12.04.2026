import { expect, test } from '@playwright/test';

test.describe('Auth Boundary', () => {
  test('unauthenticated protected routes redirect to login with a safe next param', async ({
    page,
  }) => {
    await page.goto('/account', { waitUntil: 'domcontentloaded' });

    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/login');
    expect(currentUrl.searchParams.get('auth')).toBe('required');
    expect(currentUrl.searchParams.get('next')).toBe('/account');
  });

  test('a bogus Auth.js session cookie does not unlock Nexus routes', async ({
    context,
    page,
  }) => {
    await context.addCookies([
      {
        name: 'authjs.session-token',
        value: 'bogus-session-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/nexus', { waitUntil: 'domcontentloaded' });

    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/login');
    expect(currentUrl.searchParams.get('next')).toBe('/nexus');
  });
});
