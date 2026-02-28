import { expect, test } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/careers',
  '/conditions',
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
  '/press',
  '/privacy',
  '/product/mhbot-st1700',
  '/protocols',
  '/rental',
  '/research',
  '/returns',
  '/shipping',
  '/support',
  '/terms',
  '/warranty',
];

test('Step 8.10 JS-disabled public pages render visible SSR content', async ({ browser, baseURL }) => {
  test.setTimeout(180_000);
  expect(baseURL).toBeTruthy();

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const route of PUBLIC_ROUTES) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response, `Missing navigation response for route ${route}`).toBeTruthy();
    expect(response?.status(), `Unexpected status for route ${route}`).toBeLessThan(400);

    const bodyText = await page.locator('body').innerText();
    expect(
      bodyText.trim().length,
      `Expected visible SSR content with JS disabled on route ${route}`
    ).toBeGreaterThan(80);
  }

  await context.close();
});