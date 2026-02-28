import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'home', path: '/' },
  { name: 'store-listing', path: '/rental' },
  { name: 'product-detail', path: '/product/hbot' },
  { name: 'contact', path: '/contact' },
  { name: 'dashboard', path: '/account' },
];

for (const pageDef of pages) {
  test(`WCAG critical audit: ${pageDef.name} (${pageDef.path})`, async ({ page, context }) => {
    // Middleware auth gate for dashboard/account pages expects a cookie.
    await context.addCookies([
      {
        name: 'hylono_session',
        value: 'step8-audit-session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto(pageDef.path, { waitUntil: 'networkidle' });

    const axe = new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('[data-testid="skip-axe"]');

    const { violations } = await axe.analyze();
    const blocking = violations.filter((violation) => violation.impact === 'critical');

    expect(
      blocking,
      blocking
        .map((v) => `${v.id} (${v.impact}): ${v.help} | nodes=${v.nodes.length}`)
        .join('\n')
    ).toEqual([]);
  });
}
