import { expect, test } from '@playwright/test';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROUTES_TO_AUDIT = [
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
  '/login',
  '/meridian',
  '/onboarding',
  '/partners',
  '/press',
  '/privacy',
  '/product/hbot-st1700',
  '/protocols',
  '/protocols/recovery-oxygen-foundation',
  '/rental',
  '/rental/checkout',
  '/research',
  '/returns',
  '/rewards',
  '/shipping',
  '/store',
  '/support',
  '/terms',
  '/warranty',
  '/wellness-planner',
  '/wishlist',
];

const REPORT_DIR = join(process.cwd(), 'reports', 'audits');
const REPORT_FILE = join(REPORT_DIR, 'PAGE_BUTTON_AUDIT_REPORT.md');

interface PageAuditResult {
  route: string;
  status: number | null;
  hasMainContent: boolean;
  consoleErrors: string[];
  pageErrors: string[];
  internalLinksChecked: string[];
  internalLinksBroken: string[];
  buttonChecks: string[];
  buttonProblems: string[];
}

const initReport = () => {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    REPORT_FILE,
    [
      '# Page + Button Audit Report',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Scope',
      '- Route status and content rendering',
      '- Internal links destination validity (status/content)',
      '- Visible button interactions (basic behavior + errors)',
      '',
      '---',
      '',
    ].join('\n'),
    'utf8'
  );
};

const appendSection = (lines: string[]) => {
  appendFileSync(REPORT_FILE, `${lines.join('\n')}\n`, 'utf8');
};

test('Comprehensive page + button audit with incremental reporting', async ({
  page,
  context,
  baseURL,
}) => {
  test.setTimeout(600_000);
  expect(baseURL).toBeTruthy();

  initReport();

  const allResults: PageAuditResult[] = [];

  for (const route of ROUTES_TO_AUDIT) {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    const onConsole = (msg: { type(): string; text(): string }) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    };
    const onPageError = (err: Error) => pageErrors.push(err.message);

    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    const status = response?.status() ?? null;

    const hasMainContent = await page
      .locator('main, [role="main"], h1, article, section')
      .first()
      .isVisible()
      .catch(() => false);

    const internalLinksChecked: string[] = [];
    const internalLinksBroken: string[] = [];

    const hrefs = await page.locator('a[href^="/"]').evaluateAll((nodes) =>
      Array.from(new Set(nodes.map((node) => node.getAttribute('href') ?? '').filter(Boolean)))
    );

    for (const href of hrefs.slice(0, 25)) {
      internalLinksChecked.push(href);
      const linkResponse = await context.request.get(`${baseURL}${href}`);
      const linkStatus = linkResponse.status();
      const linkHtml = await linkResponse.text();

      const isContentless = linkHtml.length < 400 || !linkHtml.includes('<html');
      const isBroken = linkStatus >= 400 || isContentless;

      if (isBroken) {
        internalLinksBroken.push(`${href} (status ${linkStatus}, contentLen ${linkHtml.length})`);
      }
    }

    const buttonChecks: string[] = [];
    const buttonProblems: string[] = [];

    const buttonCount = await page.locator('button:visible').count();
    const maxButtonsToCheck = Math.min(buttonCount, 12);

    for (let index = 0; index < maxButtonsToCheck; index += 1) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const button = page.locator('button:visible').nth(index);
      const buttonLabel = ((await button.innerText().catch(() => '')) || `button-${index + 1}`).trim();

      if (!buttonLabel) {
        buttonChecks.push(`button-${index + 1}: checked (empty label)`);
      }

      const beforeUrl = page.url();
      await button.click({ timeout: 4_000 }).catch(() => null);
      await page.waitForTimeout(300);

      const afterUrl = page.url();
      const dialogVisible = await page
        .locator('[role="dialog"], [aria-modal="true"]')
        .first()
        .isVisible()
        .catch(() => false);

      const routeConsoleErrors = consoleErrors.length;
      const routePageErrors = pageErrors.length;

      const changedUrl = beforeUrl !== afterUrl;
      const hadObservableEffect = changedUrl || dialogVisible;

      buttonChecks.push(
        `${buttonLabel || `button-${index + 1}`}: ${hadObservableEffect ? 'works (effect observed)' : 'no visible effect'}`
      );

      if (!hadObservableEffect) {
        buttonProblems.push(`${buttonLabel || `button-${index + 1}`}: no visible effect`);
      }

      if (routeConsoleErrors > 0 || routePageErrors > 0) {
        buttonProblems.push(
          `${buttonLabel || `button-${index + 1}`}: interaction produced errors (console/page errors present)`
        );
      }
    }

    page.off('console', onConsole);
    page.off('pageerror', onPageError);

    const pageResult: PageAuditResult = {
      route,
      status,
      hasMainContent,
      consoleErrors,
      pageErrors,
      internalLinksChecked,
      internalLinksBroken,
      buttonChecks,
      buttonProblems,
    };

    allResults.push(pageResult);

    appendSection([
      `## Route: ${route}`,
      `- Status: ${status ?? 'no response'}`,
      `- Main content visible: ${hasMainContent ? 'yes' : 'no'}`,
      `- Console errors: ${consoleErrors.length}`,
      `- Page errors: ${pageErrors.length}`,
      `- Internal links checked: ${internalLinksChecked.length}`,
      `- Internal links broken/contentless: ${internalLinksBroken.length}`,
      `- Buttons checked: ${buttonChecks.length}`,
      `- Button issues: ${buttonProblems.length}`,
      '',
      '### Working (checked)',
      ...[
        ...(status !== null && status < 400 ? ['- Route responds with <400 status'] : []),
        ...(hasMainContent ? ['- Content rendered (main landmark/section detected)'] : []),
        ...buttonChecks.map((entry) => `- ${entry}`),
      ],
      '',
      '### Not working / needs review',
      ...[
        ...(status === null || status >= 400
          ? [`- Route response problem: ${status ?? 'no response'}`]
          : []),
        ...(!hasMainContent ? ['- Main content not detected'] : []),
        ...internalLinksBroken.map((entry) => `- Broken/contentless internal link: ${entry}`),
        ...buttonProblems.map((entry) => `- ${entry}`),
        ...consoleErrors.map((entry) => `- Console error: ${entry}`),
        ...pageErrors.map((entry) => `- Runtime error: ${entry}`),
      ],
      '',
      '---',
      '',
    ]);
  }

  const failedPages = allResults.filter(
    (result) =>
      result.status === null ||
      result.status >= 400 ||
      !result.hasMainContent ||
      result.consoleErrors.length > 0 ||
      result.pageErrors.length > 0 ||
      result.internalLinksBroken.length > 0 ||
      result.buttonProblems.length > 0
  );

  appendSection([
    '## Global Summary',
    `- Total routes audited: ${allResults.length}`,
    `- Routes with any issue: ${failedPages.length}`,
    `- Routes fully clean: ${allResults.length - failedPages.length}`,
    '',
  ]);

  expect(allResults.length).toBeGreaterThan(0);
});
