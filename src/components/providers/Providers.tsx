'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../../../components/Cart';
import { WishlistProvider } from '../../../components/Wishlist';
import { initPostHog } from '../../lib/analytics';
import {
  detectConsentDrift,
  parseConsentCookie,
  parseConsentPayload,
} from '../../lib/consentParity';

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

const AUTH_SESSION_ROUTE_PREFIXES = [
  '/account',
  '/affiliate',
  '/login',
  '/partners',
  '/rewards',
];

function ProviderShell({ children }: ProvidersProps) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();

  useEffect(() => {
    let localStorageRaw: string | null = null;
    try { localStorageRaw = localStorage.getItem(CONSENT_KEY); } catch { /* ignore */ }
    const localStorageConsent = parseConsentPayload(localStorageRaw);
    const cookieConsent = parseConsentCookie(document.cookie, CONSENT_KEY);
    const driftReport = detectConsentDrift(localStorageConsent, cookieConsent);

    if (driftReport.hasDrift) {
      window.dispatchEvent(
        new CustomEvent('hylono:consent-drift', {
          detail: driftReport,
        })
      );
    }

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

  const requiresSessionProvider = AUTH_SESSION_ROUTE_PREFIXES.some((prefix) =>
    pathname === prefix || pathname?.startsWith(`${prefix}/`)
  );

  if (!requiresSessionProvider) {
    return <ProviderShell>{children}</ProviderShell>;
  }

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ProviderShell>{children}</ProviderShell>
    </SessionProvider>
  );
}
