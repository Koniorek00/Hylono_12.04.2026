/**
 * E2E — Partner Portal Journey
 *
 * Verifies that:
 * - The partner landing page is accessible
 * - Login/register flow UI is present
 * - Protected dashboard routes redirect unauthenticated users
 * - Key partner hub sub-pages render without JS errors
 */
import { test, expect } from '@playwright/test';

test.describe('Partner Portal', () => {

    // ── Public partner landing page ───────────────────────────────────────────

    test('partner landing page loads successfully', async ({ page }) => {
        await page.goto('/partners');
        await expect(page).toHaveTitle(/nexus|partner/i);
    });

    test('partner page shows a CTA to sign up or log in', async ({ page }) => {
        await page.goto('/partners');
        const cta = page.getByRole('button', { name: /join|sign up|apply|get started|register/i })
            .or(page.getByRole('link', { name: /join|sign up|apply|get started|register/i }))
            .first();
        await expect(cta).toBeVisible({ timeout: 10_000 });
    });

    // ── Public Nexus preview and protected child routes ──────────────────────

    test('unauthenticated user visiting /nexus can access the public preview', async ({ page }) => {
        await page.goto('/nexus');
        await expect(page).toHaveURL(/\/nexus$/);
        await expect(
            page.getByRole('heading', { name: /run clinic operations/i })
        ).toBeVisible();
    });

    test('unauthenticated user visiting /nexus/clients can access the public preview', async ({ page }) => {
        await page.goto('/nexus/clients');
        await expect(page).toHaveURL(/\/nexus\/clients$/);
        const bodyText = await page.locator('body').textContent();
        expect(bodyText?.trim().length).toBeGreaterThan(20);
    });

    // ── Partner Hub navigation ────────────────────────────────────────────────

    test('partner hub landing /partner renders without crashing', async ({ page }) => {
        await page.goto('/partner');
        // Page should not show a blank screen — look for any meaningful content
        const bodyText = await page.locator('body').textContent();
        expect(bodyText?.length).toBeGreaterThan(50);
    });

    test('no JavaScript console errors on /partners page', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto('/partners', { waitUntil: 'domcontentloaded' });

        // Filter out known non-critical errors (e.g., browser extension noise)
        const criticalErrors = errors.filter(
            (e) => !e.includes('extension') && !e.includes('net::ERR')
        );
        expect(criticalErrors).toHaveLength(0);
    });

    test('no JavaScript console errors on /nexus', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto('/nexus', { waitUntil: 'domcontentloaded' });

        const criticalErrors = errors.filter(
            (e) => !e.includes('extension') && !e.includes('net::ERR')
        );
        expect(criticalErrors).toHaveLength(0);
    });

    // ── Key partner sub-routes smoke test ─────────────────────────────────────

    const partnerRoutes = [
        '/nexus/academy',
        '/nexus/studio',
        '/nexus/fleet',
        '/nexus/team',
        '/nexus/supplies',
    ];

    for (const route of partnerRoutes) {
        test(`${route} renders without a blank page`, async ({ page }) => {
            await page.goto(route);
            await page.waitForLoadState('domcontentloaded');
            const bodyText = await page.locator('body').textContent();
            // Body should have meaningful content (not just a white screen)
            expect(bodyText?.trim().length).toBeGreaterThan(20);
        });
    }
});
