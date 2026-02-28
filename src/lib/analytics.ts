// NOTE: PostHog is intentionally NOT statically imported here.
// Using `import type` keeps type info for TypeScript while adding ZERO bytes
// to the initial bundle. The actual posthog-js code is only downloaded via
// the dynamic import() inside initPostHog() — after the user gives analytics
// consent. This saves ~950 kB from the initial bundle for non-consenting visitors.
import type { PostHog } from 'posthog-js';

// EU PostHog endpoint — keeps data in Europe (GDPR data residency)
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

let initialized = false;
let posthogInstance: PostHog | null = null;

// Must match the key used in CookieConsent.tsx
const CONSENT_KEY = 'cookieConsent';

interface StoredConsent {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
    version: string;
}

const getStoredConsent = (): StoredConsent | null => {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        return raw ? (JSON.parse(raw) as StoredConsent) : null;
    } catch {
        return null;
    }
};

/**
 * Initialize PostHog — GDPR-compliant, lazy-loaded.
 *
 * This function dynamically imports posthog-js ONLY when called, meaning
 * the ~950 kB posthog bundle is never shipped to visitors who decline
 * analytics cookies. Call it only after the user has given analytics consent.
 *
 * Idempotent — safe to call multiple times (no-ops after first call).
 * Called by AppProviders when:
 *   (a) stored analytics consent is detected on app mount, OR
 *   (b) the user accepts analytics via the CookieConsent banner
 */
export const initPostHog = async (): Promise<void> => {
    if (typeof window === 'undefined' || !POSTHOG_KEY || initialized) return;

    // Dynamic import — posthog-js only downloads here, not in the main bundle
    const { default: posthog } = await import('posthog-js');
    posthogInstance = posthog;

    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false, // We fire $pageview manually on route change
        persistence: 'localStorage',
        // GDPR: start opted-out — opt in below only if analytics consent confirmed
        opt_out_capturing_by_default: true,
    });
    initialized = true;

    // Honour consent given in a previous session (checked by AppProviders before
    // calling this function, but double-check here for safety)
    const prior = getStoredConsent();
    if (prior?.analytics === true) {
        posthog.opt_in_capturing();
    }

    // React to consent changes dispatched by CookieConsent.tsx (same tab)
    window.addEventListener('hylono:consent-updated', (e: Event) => {
        const detail = (e as CustomEvent<StoredConsent>).detail;
        if (detail?.analytics) {
            posthog.opt_in_capturing();
        } else {
            posthog.opt_out_capturing();
        }
    });

    // React to consent changes in other tabs via storage event
    window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key === CONSENT_KEY && e.newValue) {
            try {
                const consent = JSON.parse(e.newValue) as StoredConsent;
                if (consent.analytics) {
                    posthog.opt_in_capturing();
                } else {
                    posthog.opt_out_capturing();
                }
            } catch {
                // malformed JSON — ignore
            }
        }
    });
};

/** Programmatically opt in (e.g. after inline consent UI). */
export const optInAnalytics = (): void => {
    if (initialized && posthogInstance) posthogInstance.opt_in_capturing();
};

/** Programmatically opt out (e.g. on consent withdrawal). */
export const optOutAnalytics = (): void => {
    if (initialized && posthogInstance) posthogInstance.opt_out_capturing();
};

// ─── Typed event catalogue ────────────────────────────────────────────────────

const safe = (fn: () => void): void => {
    if (
        typeof window !== 'undefined' &&
        initialized &&
        posthogInstance !== null &&
        !posthogInstance.has_opted_out_capturing()
    ) {
        fn();
    }
};

export const analytics = {
    /** Fire a manual SPA page-view. Call on every route change. */
    pageView: (path: string): void =>
        safe(() => posthogInstance!.capture('$pageview', { $current_url: path })),

    // ── E-commerce ────────────────────────────────────────────────────────────
    productViewed: (productId: string, productName: string, price?: number): void =>
        safe(() => posthogInstance!.capture('product_viewed', { product_id: productId, product_name: productName, price })),

    addedToCart: (productId: string, productName: string, quantity: number, price: number): void =>
        safe(() => posthogInstance!.capture('added_to_cart', {
            product_id: productId,
            product_name: productName,
            quantity,
            price,
            value: price * quantity,
        })),

    checkoutStarted: (cartValue: number, itemCount: number): void =>
        safe(() => posthogInstance!.capture('checkout_started', { cart_value: cartValue, item_count: itemCount })),

    purchaseCompleted: (orderId: string, totalValue: number, items: string[]): void =>
        safe(() => posthogInstance!.capture('purchase_completed', { order_id: orderId, total_value: totalValue, items })),

    // ── Rental funnel ─────────────────────────────────────────────────────────
    rentalStarted: (productId: string, plan: string): void =>
        safe(() => posthogInstance!.capture('rental_started', { product_id: productId, plan })),

    rentalCompleted: (productId: string, plan: string, value: number): void =>
        safe(() => posthogInstance!.capture('rental_completed', { product_id: productId, plan, value })),

    // ── Protocol events ───────────────────────────────────────────────────────
    protocolStarted: (protocolId: string, protocolName: string): void =>
        safe(() => posthogInstance!.capture('protocol_started', { protocol_id: protocolId, protocol_name: protocolName })),

    protocolCompleted: (protocolId: string, duration: number): void =>
        safe(() => posthogInstance!.capture('protocol_completed', { protocol_id: protocolId, duration_minutes: duration })),

    // ── Generic ───────────────────────────────────────────────────────────────
    capture: (event: string, properties?: Record<string, unknown>): void =>
        safe(() => posthogInstance!.capture(event, properties)),

    identify: (distinctId: string, properties?: Record<string, unknown>): void => {
        if (typeof window !== 'undefined' && initialized && posthogInstance) {
            posthogInstance.identify(distinctId, properties);
        }
    },

    reset: (): void => {
        if (typeof window !== 'undefined' && initialized && posthogInstance) posthogInstance.reset();
    },
};

export default analytics;
