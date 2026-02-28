'use client';

import { useEffect } from 'react';
import { AuthProvider } from '../../../context/AuthContext';
import { CartProvider } from '../../../components/Cart';
import { WishlistProvider } from '../../../components/Wishlist';
import { initPostHog } from '../../lib/analytics';

// Must match the key in CookieConsent.tsx
const CONSENT_KEY = 'cookieConsent';

interface ConsentDetail {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Returning visitor: initialize analytics only if previously consented.
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<ConsentDetail>;
        if (stored.analytics === true) {
          void initPostHog();
        }
      }
    } catch {
      // Corrupted localStorage — skip analytics init.
    }

    // New consent granted this session.
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
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
