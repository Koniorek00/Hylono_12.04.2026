import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from './Cart';
import { WishlistProvider } from './Wishlist';
import { initPostHog } from '../src/lib/analytics';

// Must match the key in CookieConsent.tsx
const CONSENT_KEY = 'cookieConsent';

interface ConsentDetail {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
    version: string;
}

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    useEffect(() => {
        // ── Returning visitor: check stored consent ─────────────────────────
        // If the user already accepted analytics in a previous session, load
        // PostHog immediately. For new/declining visitors, PostHog is NEVER
        // downloaded — saving ~950 kB from the initial bundle.
        try {
            const raw = localStorage.getItem(CONSENT_KEY);
            if (raw) {
                const stored = JSON.parse(raw) as Partial<ConsentDetail>;
                if (stored.analytics === true) {
                    void initPostHog();
                }
            }
        } catch {
            // Corrupted localStorage — skip analytics init
        }

        // ── New consent granted this session ────────────────────────────────
        // CookieConsent.tsx dispatches this event when the user makes a choice.
        // Only initialize PostHog if they explicitly accept analytics.
        const handleConsentUpdate = (e: Event) => {
            if ('detail' in e) {
                const detail = (e as CustomEvent<ConsentDetail>).detail;
                if (detail?.analytics === true) {
                    void initPostHog();
                }
            }
        };

        window.addEventListener('hylono:consent-updated', handleConsentUpdate);
        return () => {
            window.removeEventListener('hylono:consent-updated', handleConsentUpdate);
        };
    }, []);

    return (
        <SessionProvider>
            <CartProvider>
                <WishlistProvider>
                    {children}
                </WishlistProvider>
            </CartProvider>
        </SessionProvider>
    );
};
