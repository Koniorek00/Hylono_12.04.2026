import { defineConfig, devices } from '@playwright/test';

/**
 * Hylono AntiGravity — Playwright E2E Configuration
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel files on CI */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use */
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
    /* Shared settings for all the projects below */
    use: {
        /* Base URL for page.goto('/') calls */
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
        /* Collect trace on first retry for debugging */
        trace: 'on-first-retry',
        /* Always take screenshot on failure */
        screenshot: 'only-on-failure',
        /* Viewport matching typical desktop */
        viewport: { width: 1280, height: 720 },
        /* Reasonable timeout */
        actionTimeout: 10_000,
    },

    /* Test against desktop Chrome and Firefox, plus mobile Safari */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 13'] },
        },
    ],

    /* Run the Vite dev server before starting the tests */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
