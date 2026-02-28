/**
 * E2E — Cookie Consent GDPR Journey
 *
 * Verifies that:
 * - Banner appears on first visit
 * - Accept All stores correct consent
 * - Necessary Only stores only required consent
 * - Banner does not reappear after consent is given
 * - Consent persists across page navigation
 */
import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'cookieConsent';

test.describe('Cookie Consent GDPR', () => {

    test.beforeEach(async ({ page }) => {
        // Clear all storage so every test starts fresh
        await page.goto('/');
        await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
        // Reload to trigger fresh banner render
        await page.reload();
    });

    // ── Banner visibility ──────────────────────────────────────────────────────

    test('consent banner appears on first visit', async ({ page }) => {
        await page.goto('/');
        // Look for cookie consent text — exact wording may vary
        const banner = page.getByText(/cookie|consent|privacy/i).first();
        await expect(banner).toBeVisible({ timeout: 8_000 });
    });

    test('banner has an "Accept All" button', async ({ page }) => {
        await page.goto('/');
        const btn = page.getByRole('button', { name: /accept all|akceptuj/i });
        await expect(btn).toBeVisible({ timeout: 8_000 });
    });

    test('banner has an "Essential Only" (or equivalent reject) button', async ({ page }) => {
        await page.goto('/');
        const btn = page.getByRole('button', { name: /essential only|reject|necessary only|only necessary|decline/i });
        await expect(btn).toBeVisible({ timeout: 8_000 });
    });

    // ── Accept All flow ────────────────────────────────────────────────────────

    test('Accept All stores full consent in localStorage', async ({ page }) => {
        await page.goto('/');
        const acceptBtn = page.getByRole('button', { name: /accept all|akceptuj/i });
        await acceptBtn.click();

        const stored = await page.evaluate((key) => {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }, STORAGE_KEY);

        expect(stored).not.toBeNull();
        expect(stored.analytics).toBe(true);
        expect(stored.marketing).toBe(true);
        expect(stored.version).toBeDefined();
        expect(stored.timestamp).toBeDefined();
    });

    test('banner disappears after Accept All', async ({ page }) => {
        await page.goto('/');
        const acceptBtn = page.getByRole('button', { name: /accept all|akceptuj/i });
        await acceptBtn.click();

        // After accepting, the banner should not be visible
        await expect(
            page.getByRole('button', { name: /accept all|akceptuj/i })
        ).toBeHidden({ timeout: 5_000 });
    });

    // ── Reject / Necessary Only flow ──────────────────────────────────────────

    test('Necessary Only stores minimal consent', async ({ page }) => {
        await page.goto('/');
        const rejectBtn = page.getByRole('button', { name: /essential only|reject|necessary only|only necessary|decline/i });
        await rejectBtn.click();

        const stored = await page.evaluate((key) => {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }, STORAGE_KEY);

        expect(stored).not.toBeNull();
        expect(stored.analytics).toBe(false);
        expect(stored.marketing).toBe(false);
    });

    // ── Persistence across navigation ─────────────────────────────────────────

    test('banner does not reappear after consent is given and user navigates', async ({ page }) => {
        await page.goto('/');
        const acceptBtn = page.getByRole('button', { name: /accept all|akceptuj/i });
        await acceptBtn.click();

        // Navigate to another page
        await page.goto('/store');
        await page.waitForLoadState('domcontentloaded');

        // Banner should not reappear
        await expect(
            page.getByRole('button', { name: /accept all|akceptuj/i })
        ).toBeHidden({ timeout: 5_000 });
    });

    test('consent persists in localStorage across navigation', async ({ page }) => {
        await page.goto('/');
        const acceptBtn = page.getByRole('button', { name: /accept all|akceptuj/i });
        await acceptBtn.click();

        await page.goto('/about');

        const stored = await page.evaluate((key) => {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }, STORAGE_KEY);

        expect(stored).not.toBeNull();
        expect(stored.analytics).toBe(true);
    });
});
