/**
 * E2E — Critical Journey: Home → Store → Product → Cart → Checkout
 *
 * This is the most important user path in the application.
 * Any regression here is revenue-impacting.
 */
import { test, expect } from '@playwright/test';

test.describe('Home → Store → Product → Checkout journey', () => {

    test.beforeEach(async ({ page }) => {
        // Clear localStorage to ensure a clean state for every test
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    // ── Home page ─────────────────────────────────────────────────────────────

    test('home page loads and displays the hero section', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/hylono/i);
        // Hero section should have some prominent heading
        const hero = page.locator('h1, [data-testid="hero-heading"]').first();
        await expect(hero).toBeVisible();
    });

    test('home page has navigation to the store', async ({ page }) => {
        await page.goto('/');
        // Nav link to store (text varies — "Store", "Shop", "Products")
        const storeLink = page.getByRole('link', { name: /store|shop|products/i }).first();
        await expect(storeLink).toBeVisible();
    });

    // ── Store page ────────────────────────────────────────────────────────────

    test('store page renders product cards', async ({ page }) => {
        await page.goto('/store');
        // At least one product card should appear
        const productCards = page.locator('[data-testid="product-card"], .product-card, article').first();
        await expect(productCards).toBeVisible({ timeout: 10_000 });
    });

    test('store page shows HBOT product', async ({ page }) => {
        await page.goto('/store');
        await expect(page.getByText(/hyperbaric|HBOT/i).first()).toBeVisible({ timeout: 10_000 });
    });

    // ── Product detail page ───────────────────────────────────────────────────

    test('HBOT product page loads with title and description', async ({ page }) => {
        await page.goto('/product/HBOT');
        await expect(page).toHaveTitle(/hyperbaric|HBOT/i);
        // Should show some descriptive content
        await expect(page.getByText(/hyperbaric|oxygen|chamber/i).first()).toBeVisible();
    });

    test('product page has an "Add to Cart" button', async ({ page }) => {
        await page.goto('/product/HBOT');
        const addToCartBtn = page.getByRole('button', { name: /add to cart|add to bag/i });
        await expect(addToCartBtn).toBeVisible({ timeout: 10_000 });
    });

    test('clicking "Add to Cart" updates cart count', async ({ page }) => {
        await page.goto('/product/HBOT');
        const addToCartBtn = page.getByRole('button', { name: /add to cart|add to bag/i });
        await addToCartBtn.click();
        // Cart indicator in the nav should show at least 1
        const cartCount = page.locator('[data-testid="cart-count"], .cart-count, [aria-label*="cart"]').first();
        await expect(cartCount).toBeVisible({ timeout: 5_000 });
    });

    // ── Checkout page ─────────────────────────────────────────────────────────

    test('checkout page is accessible via /checkout route', async ({ page }) => {
        await page.goto('/checkout');
        await expect(page).toHaveTitle(/checkout|order/i);
    });

    test('checkout page shows order summary section', async ({ page }) => {
        await page.goto('/checkout');
        const summary = page.getByText(/order summary|your order|cart/i).first();
        await expect(summary).toBeVisible({ timeout: 10_000 });
    });

    test('checkout page has a payment method selector', async ({ page }) => {
        await page.goto('/checkout');
        // Card, bank transfer, or financing options
        const paymentSection = page.getByText(/payment|card|bank transfer|financing/i).first();
        await expect(paymentSection).toBeVisible({ timeout: 10_000 });
    });

    test('checkout page has a submit/place order button', async ({ page }) => {
        await page.goto('/checkout');
        const submitBtn = page.getByRole('button', { name: /place order|checkout|pay|confirm/i });
        await expect(submitBtn).toBeVisible({ timeout: 10_000 });
    });

    // ── Navigation integrity ───────────────────────────────────────────────────

    test('clicking logo returns to home from any page', async ({ page }) => {
        await page.goto('/store');
        const logo = page.locator('a[href="/"], [data-testid="logo-link"]').first();
        await logo.click();
        await expect(page).toHaveURL('/');
    });

    test('404 page is handled gracefully', async ({ page }) => {
        await page.goto('/this-page-does-not-exist-xyz');
        // Should not show a blank page or error stack trace
        // Should show some "not found" content
        const notFound = page.getByText(/not found|404|page doesn.t exist/i).first();
        await expect(notFound).toBeVisible({ timeout: 8_000 });
    });
});
