# SKILL: Playwright E2E Patterns
**Used by**: test-engineer

---

## Setup
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Critical Journey Tests for Hylono

### Rental Flow E2E
```typescript
// tests/e2e/rental-flow.spec.ts
test.describe('Rental Flow', () => {
  test('user can complete rental checkout', async ({ page }) => {
    await page.goto('/products/mhbot-chamber');
    
    // Verify rental CTA is visible and prominent
    const rentalCTA = page.getByRole('button', { name: /experience it|rent/i });
    await expect(rentalCTA).toBeVisible();
    
    // Start rental flow
    await rentalCTA.click();
    await expect(page).toHaveURL(/\/rental\/configure/);
    
    // Configure rental
    await page.getByRole('radio', { name: '30 days' }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Fill address
    await page.getByLabel('Street address').fill('Test Street 1');
    await page.getByLabel('City').fill('Amsterdam');
    await page.getByLabel('Postal code').fill('1234 AB');
    await page.getByRole('button', { name: 'Continue to payment' }).click();
    
    // Verify disclaimer shown
    await expect(page.getByText(/not intended to diagnose/i)).toBeVisible();
  });
  
  test('safety disclaimer is present on product page', async ({ page }) => {
    await page.goto('/products/mhbot-chamber');
    await expect(page.getByText(/consult your healthcare provider/i)).toBeVisible();
    await expect(page.getByText(/not intended to diagnose/i)).toBeVisible();
  });
});
```

### Navigation E2E
```typescript
test('critical content reachable within 3 clicks from homepage', async ({ page }) => {
  await page.goto('/');
  
  // Find rental path within 3 clicks
  await page.getByRole('link', { name: /devices|products/i }).first().click();
  await page.getByRole('link', { name: /oxygen|mhbot/i }).first().click();
  
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /rent|experience/i })).toBeVisible();
});
```

### Accessibility E2E
```typescript
import { checkA11y, injectAxe } from 'axe-playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});
```

## Page Object Model Pattern
```typescript
// tests/e2e/pages/ProductPage.ts
export class ProductPage {
  constructor(private page: Page) {}
  
  async goto(slug: string) {
    await this.page.goto(`/products/${slug}`);
  }
  
  async startRental() {
    await this.page.getByRole('button', { name: /rent|experience/i }).click();
  }
  
  async getSafetyDisclaimer() {
    return this.page.getByTestId('safety-disclaimer');
  }
  
  async verifyCompliance() {
    await expect(await this.getSafetyDisclaimer()).toBeVisible();
    await expect(this.page.getByText(/consult your healthcare provider/i)).toBeVisible();
  }
}
```

## Test Data Strategy
```typescript
// Use test fixtures, never production data
test.beforeEach(async ({ page }) => {
  // Mock API if needed
  await page.route('/api/v1/products', route => {
    route.fulfill({ json: MOCK_PRODUCTS });
  });
});
```
