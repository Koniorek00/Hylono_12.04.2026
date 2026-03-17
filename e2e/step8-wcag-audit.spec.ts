import { expect, test, type BrowserContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'home', path: '/' },
  { name: 'store-listing', path: '/rental' },
  { name: 'store', path: '/store' },
  { name: 'product-detail', path: '/product/hbot' },
  { name: 'wellness-planner', path: '/wellness-planner' },
  { name: 'faq', path: '/faq' },
  { name: 'support', path: '/support' },
  { name: 'checkout', path: '/checkout' },
  { name: 'contact', path: '/contact' },
  { name: 'dashboard', path: '/account' },
];

const CRITICAL_WCAG_RULES = [
  'aria-allowed-attr',
  'aria-command-name',
  'aria-hidden-body',
  'aria-hidden-focus',
  'aria-input-field-name',
  'aria-meter-name',
  'aria-progressbar-name',
  'aria-required-attr',
  'aria-required-children',
  'aria-required-parent',
  'aria-roles',
  'aria-toggle-field-name',
  'aria-valid-attr',
  'aria-valid-attr-value',
  'button-name',
  'document-title',
  'duplicate-id-aria',
  'html-has-lang',
  'html-lang-valid',
  'image-alt',
  'input-button-name',
  'input-image-alt',
  'label',
  'link-name',
  'meta-viewport',
  'nested-interactive',
  'select-name',
  'summary-name',
  'svg-img-alt',
  'valid-lang',
];

function stripExecutableMarkup(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<link[^>]+rel=["']preload["'][^>]*as=["']script["'][^>]*>/gi, '');
}

async function requestHtml(context: BrowserContext, baseURL: string, route: string) {
  const htmlResponse = await context.request.get(`${baseURL}${route}`);
  expect(htmlResponse.status(), `HTML response status for route ${route}`).toBeLessThan(400);
  const html = await htmlResponse.text();
  expect(html, `No server HTML for route ${route}`).toContain('<html');
  return stripExecutableMarkup(html);
}

for (const pageDef of pages) {
  test(`WCAG critical audit: ${pageDef.name} (${pageDef.path})`, async ({ page, context, baseURL }) => {
    test.setTimeout(90_000);
    expect(baseURL).toBeTruthy();

    // Middleware auth gate for dashboard/account pages expects a cookie.
    await context.addCookies([
      {
        name: 'hylono_session',
        value: 'step8-audit-session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    const html = await requestHtml(context, baseURL!, pageDef.path);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const { violations } = await new AxeBuilder({ page })
      .include('main')
      .include('nav[aria-label="Main navigation"]')
      .exclude('[data-testid="skip-axe"]')
      .options({
        runOnly: {
          type: 'rule',
          values: CRITICAL_WCAG_RULES,
        },
        resultTypes: ['violations'],
      })
      .analyze();

    const blocking = violations.filter((violation) => violation.impact === 'critical');

    expect(
      blocking,
      blocking
        .map((v) => `${v.id} (${v.impact}): ${v.help} | nodes=${v.nodes.length}`)
        .join('\n')
    ).toEqual([]);
  });
}
