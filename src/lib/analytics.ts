/// <reference types="vite/client" />

import posthog from 'posthog-js';

// Vite uses import.meta.env for environment variables
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

let initialized = false;

export const initPostHog = () => {
    if (typeof window !== 'undefined' && POSTHOG_KEY && !initialized) {
        posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            capture_pageview: false, // Handle page views manually for SPA routing
            persistence: 'localStorage',
            opt_out_capturing_by_default: false, // GDPR: set true if needed
        });
        initialized = true;
        console.log('[Analytics] PostHog initialized');
    }
};

// Core analytics object with typed events
export const analytics = {
    // Page views
    pageView: (path: string) => {
        if (typeof window !== 'undefined' && initialized) {
            posthog.capture('$pageview', { $current_url: path });
        }
    },

    // E-commerce events
    productViewed: (productId: string, productName: string, price?: number) => {
        posthog.capture('product_viewed', {
            product_id: productId,
            product_name: productName,
            price
        });
    },

    addedToCart: (productId: string, productName: string, quantity: number, price: number) => {
        posthog.capture('added_to_cart', {
            product_id: productId,
            product_name: productName,
            quantity,
            price,
            value: price * quantity
        });
    },

    checkoutStarted: (cartValue: number, itemCount: number) => {
        posthog.capture('checkout_started', {
            cart_value: cartValue,
            item_count: itemCount
        });
    },

    purchaseCompleted: (orderId: string, totalValue: number, items: string[]) => {
        posthog.capture('purchase_completed', {
            order_id: orderId,
            total_value: totalValue,
            items
        });
    },

    // Protocol/Dashboard events
    protocolStarted: (protocolId: string, protocolName: string) => {
        posthog.capture('protocol_started', {
            protocol_id: protocolId,
            protocol_name: protocolName
        });
    },

    protocolCompleted: (protocolId: string, duration: number) => {
        posthog.capture('protocol_completed', {
            protocol_id: protocolId,
            duration_minutes: duration
        });
    },

    // Generic capture for custom events
    capture: (event: string, properties?: Record<string, unknown>) => {
        if (typeof window !== 'undefined') {
            posthog.capture(event, properties);
        }
    },

    // User identification (for logged-in users)
    identify: (distinctId: string, properties?: Record<string, unknown>) => {
        if (typeof window !== 'undefined') {
            posthog.identify(distinctId, properties);
        }
    },

    // Reset for logout
    reset: () => {
        if (typeof window !== 'undefined') {
            posthog.reset();
        }
    },
};

export default analytics;
