/**
 * CookieConsent Component Tests
 * Covers: initial render, accept-all, essential-only, per-category toggles,
 * localStorage persistence, GDPR version tracking, and banner dismissal.
 *
 * Storage key used by the component: 'cookieConsent'
 * Consent version used by the component: '1.1' (string)
 */
import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CookieConsent } from '../../components/CookieConsent';

// ─── Constants matching the component's internals ─────────────────────────────
const STORAGE_KEY = 'cookieConsent';   // matches CONSENT_KEY in component
const COOKIE_KEY = 'cookieConsent';
const CONSENT_VERSION = '1.1';         // matches CONSENT_VERSION in component

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clearConsent() {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
}

function getStoredConsent() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}

function getCookieConsent() {
    const cookie = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${COOKIE_KEY}=`));

    if (!cookie) {
        return null;
    }

    const value = cookie.slice(`${COOKIE_KEY}=`.length);

    try {
        return JSON.parse(decodeURIComponent(value));
    } catch {
        return null;
    }
}

function preStoreConsent(overrides: Record<string, unknown> = {}) {
    const defaults = {
        essential: true,
        analytics: true,
        marketing: false,
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION, // current version — no re-prompt
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaults, ...overrides }));
}

/**
 * Flush pending effects/state updates after initial render.
 * CookieConsent banner now appears immediately when consent is missing.
 */
async function showBanner() {
    await act(async () => {
        await Promise.resolve();
    });
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('CookieConsent', () => {
    beforeEach(() => {
        clearConsent();
    });

    afterEach(() => {
        clearConsent();
    });

    // ── Visibility ────────────────────────────────────────────────────────────

    it('renders the consent banner when no consent is stored', async () => {
        render(<CookieConsent />);
        await showBanner();
        // Banner is a dialog per ARIA implementation
        expect(screen.queryByRole('dialog')).not.toBeNull();
    });

    it('shows "We use cookies" heading in banner', async () => {
        render(<CookieConsent />);
        await showBanner();
        // The component renders an h3 with exact text "We use cookies".
        // Use role query to avoid ambiguity with paragraph text that also
        // contains the words "we use cookies".
        expect(screen.queryByRole('heading', { name: /we use cookies/i })).not.toBeNull();
    });

    it('does not render the banner when valid consent is already stored', async () => {
        preStoreConsent(); // current version → no re-prompt
        render(<CookieConsent />);
        await showBanner();
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('synchronizes cookieConsent cookie for returning visitors with valid stored consent', async () => {
        preStoreConsent({ analytics: true, marketing: false });
        render(<CookieConsent />);
        await showBanner();

        expect(screen.queryByRole('dialog')).toBeNull();

        await waitFor(() => {
            const cookieConsent = getCookieConsent();
            expect(cookieConsent).not.toBeNull();
            expect(cookieConsent?.analytics).toBe(true);
            expect(cookieConsent?.marketing).toBe(false);
            expect(cookieConsent?.essential).toBe(true);
            expect(cookieConsent?.version).toBe(CONSENT_VERSION);
        });
    });

    it('re-prompts when stored consent has an old version', async () => {
        preStoreConsent({ version: '1.0' }); // outdated → should re-prompt
        render(<CookieConsent />);
        await showBanner();
        expect(screen.queryByRole('dialog')).not.toBeNull();
    });

    // ── Accept All ───────────────────────────────────────────────────────────

    it('stores all-true consent when "Accept All" is clicked', async () => {
        render(<CookieConsent />);
        await showBanner();

        const acceptBtn = screen.queryByRole('button', { name: /accept all/i });
        expect(acceptBtn).not.toBeNull();
        if (acceptBtn) fireEvent.click(acceptBtn);

        const stored = getStoredConsent();
        expect(stored).not.toBeNull();
        expect(stored.analytics).toBe(true);
        expect(stored.marketing).toBe(true);
        expect(stored.essential).toBe(true);

        const cookieConsent = getCookieConsent();
        expect(cookieConsent).not.toBeNull();
        expect(cookieConsent?.analytics).toBe(true);
        expect(cookieConsent?.marketing).toBe(true);
        expect(cookieConsent?.essential).toBe(true);
    });

    it('persists a timestamp when accepting all', async () => {
        render(<CookieConsent />);
        await showBanner();

        const acceptBtn = screen.queryByRole('button', { name: /accept all/i });
        if (acceptBtn) fireEvent.click(acceptBtn);

        const stored = getStoredConsent();
        expect(stored?.timestamp).toBeDefined();
        expect(() => new Date(stored.timestamp)).not.toThrow();
    });

    it('stores version string in consent object', async () => {
        render(<CookieConsent />);
        await showBanner();

        const acceptBtn = screen.queryByRole('button', { name: /accept all/i });
        if (acceptBtn) fireEvent.click(acceptBtn);

        const stored = getStoredConsent();
        expect(stored?.version).toBe(CONSENT_VERSION);
        expect(typeof stored.version).toBe('string');
    });

    // ── Essential Only ────────────────────────────────────────────────────────

    it('stores only-necessary consent when "Essential Only" is clicked', async () => {
        render(<CookieConsent />);
        await showBanner();

        const essentialBtn = screen.queryByRole('button', { name: /essential only/i });
        expect(essentialBtn).not.toBeNull();
        if (essentialBtn) fireEvent.click(essentialBtn);

        const stored = getStoredConsent();
        expect(stored).not.toBeNull();
        expect(stored.analytics).toBe(false);
        expect(stored.marketing).toBe(false);
        expect(stored.essential).toBe(true);

        const cookieConsent = getCookieConsent();
        expect(cookieConsent).not.toBeNull();
        expect(cookieConsent?.analytics).toBe(false);
        expect(cookieConsent?.marketing).toBe(false);
        expect(cookieConsent?.essential).toBe(true);
    });

    // ── Banner dismissal ─────────────────────────────────────────────────────

    it('banner disappears after accepting all', async () => {
        render(<CookieConsent />);
        await showBanner();

        const acceptBtn = screen.queryByRole('button', { name: /accept all/i });
        if (!acceptBtn) return;
        fireEvent.click(acceptBtn);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });

    it('banner disappears after choosing Essential Only', async () => {
        render(<CookieConsent />);
        await showBanner();

        const essentialBtn = screen.queryByRole('button', { name: /essential only/i });
        if (!essentialBtn) return;
        fireEvent.click(essentialBtn);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });

    // ── Customize / granular preferences ─────────────────────────────────────

    it('opens preference settings panel when "Customize" is clicked', async () => {
        render(<CookieConsent />);
        await showBanner();

        const customizeBtn = screen.queryByRole('button', { name: /customize/i })
            ?? screen.queryByRole('button', { name: /open cookie preference/i });
        expect(customizeBtn).not.toBeNull();
        if (customizeBtn) fireEvent.click(customizeBtn);

        await waitFor(() => {
            expect(screen.queryByText(/cookie preferences/i)).not.toBeNull();
        });
    });

    it('saves custom preferences via Save Preferences button', async () => {
        render(<CookieConsent />);
        await showBanner();

        // Open customize panel
        const customizeBtn = screen.queryByRole('button', { name: /customize/i })
            ?? screen.queryByRole('button', { name: /open cookie preference/i });
        if (!customizeBtn) return;
        fireEvent.click(customizeBtn);

        await waitFor(() => {
            expect(screen.queryByText(/cookie preferences/i)).not.toBeNull();
        });

        // Save without changing anything (essential=true, analytics=false, marketing=false)
        const saveBtn = screen.queryByRole('button', { name: /save preferences/i });
        if (!saveBtn) return;
        fireEvent.click(saveBtn);

        const stored = getStoredConsent();
        expect(stored).not.toBeNull();
        expect(stored.version).toBe(CONSENT_VERSION);
        expect(stored.essential).toBe(true);

        const cookieConsent = getCookieConsent();
        expect(cookieConsent).not.toBeNull();
        expect(cookieConsent?.version).toBe(CONSENT_VERSION);
    });

    // ── Global event trigger ──────────────────────────────────────────────────

    it('re-opens banner when hylono:open-cookie-settings event is dispatched', async () => {
        preStoreConsent(); // consent already given — banner should not auto-show
        render(<CookieConsent />);
        await showBanner();
        expect(screen.queryByRole('dialog')).toBeNull();

        // Simulate clicking "Cookie Settings" link in footer
        await act(async () => {
            window.dispatchEvent(new CustomEvent('hylono:open-cookie-settings'));
        });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeNull();
        });
    });
});
