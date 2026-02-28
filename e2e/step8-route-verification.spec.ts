import { expect, test } from '@playwright/test';

const ROUTES_TO_VERIFY = [
  '/',
  '/about',
  '/account',
  '/affiliate',
  '/blog',
  '/blog/recovery-oxygen-foundation',
  '/careers',
  '/checkout',
  '/conditions',
  '/conditions/recovery',
  '/contact',
  '/cookie-policy',
  '/faq',
  '/firesafe',
  '/guarantee',
  '/help',
  '/hho-car-kit',
  '/learning',
  '/locator',
  '/meridian',
  '/onboarding',
  '/partners',
  '/press',
  '/privacy',
  '/product/mhbot-st1700',
  '/protocols',
  '/protocols/recovery-oxygen-foundation',
  '/rental',
  '/rental/checkout',
  '/research',
  '/returns',
  '/rewards',
  '/shipping',
  '/support',
  '/terms',
  '/warranty',
  '/wishlist',
];

test('Step 8.9 route verification: render + html source + zero console errors', async ({
  page,
  context,
  baseURL,
}) => {
  test.setTimeout(180_000);
  expect(baseURL).toBeTruthy();

  await context.addCookies([
    {
      name: 'hylono_session',
      value: 'step8-route-session',
      domain: 'localhost',
      path: '/',
    },
  ]);

  for (const route of ROUTES_TO_VERIFY) {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    const onConsole = (msg: { type(): string; text(): string }) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    const onPageError = (err: Error) => pageErrors.push(err.message);

    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response, `Missing navigation response for route ${route}`).toBeTruthy();
    expect(response?.status(), `Unexpected status for route ${route}`).toBeLessThan(400);

    const htmlResponse = await context.request.get(`${baseURL}${route}`);
    expect(htmlResponse.status(), `HTML response status for route ${route}`).toBeLessThan(400);
    const html = await htmlResponse.text();
    expect(html, `No server HTML for route ${route}`).toContain('<html');

    expect(consoleErrors, `Console errors on route ${route}:\n${consoleErrors.join('\n')}`).toEqual(
      []
    );
    expect(pageErrors, `Page errors on route ${route}:\n${pageErrors.join('\n')}`).toEqual([]);

    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }
});
