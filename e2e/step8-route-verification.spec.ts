import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { BLOG_POSTS } from '@/constants/content';
import { conditionGoals } from '@/content/conditions';
import { protocols } from '@/content/protocols';
import { toBlogSlug } from '@/lib/blog';
import { getAllTechRouteSlugs } from '@/lib/product-routes';

const ROUTES_TO_VERIFY = [
  '/',
  '/about',
  '/account',
  '/affiliate',
  '/blog',
  `/blog/${toBlogSlug(BLOG_POSTS[0]!.title)}`,
  '/careers',
  '/checkout',
  '/conditions',
  `/conditions/${conditionGoals[0]!.slug}`,
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
  `/product/${getAllTechRouteSlugs()[0]!}`,
  '/protocols',
  `/protocols/${protocols[0]!.slug}`,
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

async function requestHtml(context: BrowserContext, baseURL: string, route: string) {
  const htmlResponse = await context.request.get(`${baseURL}${route}`);
  expect(htmlResponse.status(), `HTML response status for route ${route}`).toBeLessThan(400);
  const html = await htmlResponse.text();
  expect(html, `No server HTML for route ${route}`).toContain('<html');
  return htmlResponse;
}

async function gotoWithRetry(
  page: Page,
  route: string,
  attempts = [20_000, 30_000]
) {
  let lastError: unknown;

  for (const timeout of attempts) {
    try {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout });
      if (response) {
        return response;
      }
    } catch (error) {
      lastError = error;
      await page.goto('about:blank').catch(() => null);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Navigation failed for route ${route}`);
}

for (const route of ROUTES_TO_VERIFY) {
  test(`Step 8.9 route verification: ${route}`, async ({ page, context, baseURL }) => {
    test.setTimeout(90_000);
    expect(baseURL).toBeTruthy();

    await context.addCookies([
      {
        name: 'hylono_session',
        value: 'step8-route-session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    const onConsole = (msg: { type(): string; text(): string }) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    const onPageError = (err: Error) => pageErrors.push(err.message);

    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    await requestHtml(context, baseURL, route);
    const response = await gotoWithRetry(page, route);
    expect(response, `Missing navigation response for route ${route}`).toBeTruthy();
    expect(response?.status(), `Unexpected status for route ${route}`).toBeLessThan(400);

    expect(consoleErrors, `Console errors on route ${route}:\n${consoleErrors.join('\n')}`).toEqual(
      []
    );
    expect(pageErrors, `Page errors on route ${route}:\n${pageErrors.join('\n')}`).toEqual([]);

    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  });
}
