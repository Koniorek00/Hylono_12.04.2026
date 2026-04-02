# SKILL: Playwright E2E Patterns (Next.js 16)
**Used by**: test-engineer

## Config Baseline
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});
```

## Critical Journeys
- Rental flow end-to-end
- Checkout success/error paths
- Product-page disclaimer visibility
- Key navigation reachability within 3 clicks
- Form validation paths (required/invalid/injection-like input)

## A11y in E2E
- Run axe checks on critical pages
- Verify keyboard-only flow for primary conversions

## Stability Rules
- Prefer role/label/test-id selectors over brittle CSS selectors
- Avoid fixed sleeps; use assertions/waits on expected UI state
- Investigate flakes before retries

## Data Strategy
- Use controlled fixtures/mocks for deterministic tests
- Never use production data in E2E
