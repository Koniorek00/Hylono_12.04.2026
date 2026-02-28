import { chromium } from '@playwright/test';

const base = process.env.ROUTE_CHECK_BASE_URL ?? 'http://localhost:4018';
const routes = ['/', '/about', '/blog', '/contact', '/checkout', '/protocols', '/rental', '/privacy', '/support', '/warranty'];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const route of routes) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };
  const onPageError = (err) => pageErrors.push(String(err));

  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  try {
    const resp = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
    results.push({
      route,
      status: resp?.status() ?? null,
      consoleErrorCount: consoleErrors.length,
      pageErrorCount: pageErrors.length,
      consoleErrors,
      pageErrors,
    });
  } catch (e) {
    results.push({
      route,
      status: null,
      error: String(e),
      consoleErrorCount: consoleErrors.length,
      pageErrorCount: pageErrors.length,
      consoleErrors,
      pageErrors,
    });
  }

  page.off('console', onConsole);
  page.off('pageerror', onPageError);
}

const clientNav = {
  from: '/',
  to: null,
  foundLink: false,
  documentRequestsAfterClick: null,
  fullReloadDetected: null,
  note: '',
};

try {
  await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 30000 });
  const documentUrls = [];
  const onResponse = (resp) => {
    try {
      if (resp.request().resourceType() === 'document') {
        documentUrls.push(resp.url());
      }
    } catch {
      // no-op
    }
  };

  page.on('response', onResponse);

  const candidateHrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) => {
    return anchors
      .map((anchor) => anchor.getAttribute('href'))
      .filter((href) => typeof href === 'string' && href.length > 1 && !href.startsWith('/#'));
  });

  const uniqueHrefs = [...new Set(candidateHrefs)];
  const targetHref = uniqueHrefs.find((href) => href !== '/');

  if (targetHref) {
    clientNav.to = targetHref;
    const link = page.locator(`a[href="${targetHref}"]`).first();
    clientNav.foundLink = true;
    await link.click({ timeout: 5000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(300);

    const aboutDocRequests = documentUrls.filter((url) => {
      try {
        const parsed = new URL(url);
        return parsed.pathname === targetHref;
      } catch {
        return false;
      }
    }).length;

    clientNav.documentRequestsAfterClick = aboutDocRequests;
    clientNav.fullReloadDetected = aboutDocRequests > 0;
  } else {
    clientNav.note = 'No eligible internal route link found on homepage for click-based client navigation check.';
  }

  page.off('response', onResponse);
} catch (e) {
  clientNav.note = String(e);
}

console.log(JSON.stringify({ routeChecks: results, clientNav }, null, 2));

await browser.close();
