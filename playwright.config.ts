import { defineConfig, devices } from '@playwright/test';
import { readRuntimeEnv } from './lib/env';

const resolveWorkers = (): number => {
    const override = readRuntimeEnv('PLAYWRIGHT_WORKERS');

    if (!override) {
        return 1;
    }

    const parsed = Number.parseInt(override, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

/**
 * Hylono AntiGravity — Playwright E2E Configuration
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!readRuntimeEnv('CI'),
    /* Retry on CI only */
    retries: readRuntimeEnv('CI') ? 2 : 0,
    /* Opt out of parallel files on CI */
    workers: readRuntimeEnv('CI') ? 1 : resolveWorkers(),
    /* Reporter to use */
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
    /* Shared settings for all the projects below */
    use: {
        /* Base URL for page.goto('/') calls */
        baseURL: readRuntimeEnv('PLAYWRIGHT_BASE_URL') || 'http://localhost:3100',
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

    /* Run a fresh isolated production server instance per test run to avoid Turbopack dev chunk instability */
    webServer: {
        command: 'pnpm build && pnpm start --port 3100',
        url: 'http://localhost:3100',
        reuseExistingServer: false,
        timeout: 300_000,
        env: {
            ...process.env,
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'playwright-local-secret',
        },
    },
});
