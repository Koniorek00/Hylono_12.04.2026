"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Settings, Check } from 'lucide-react';
import Link from 'next/link';
import {
    COOKIE_CONSENT_EVENT,
    COOKIE_CONSENT_KEY,
    openCookieSettings,
} from '@/src/lib/cookie-consent';
import { useFocusTrap } from '../hooks/useFocusTrap';

// Consent schema version — bump this when categories change to re-prompt users
const CONSENT_VERSION = '1.1';
const CONSENT_COOKIE_KEY = 'cookieConsent';
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export interface CookiePreferences {
    essential: true;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
    version: string;
}

const writeConsentCookie = (record: CookiePreferences): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const encoded = encodeURIComponent(JSON.stringify(record));
    const secureAttribute =
        typeof window !== 'undefined' && window.location.protocol === 'https:'
            ? '; Secure'
            : '';

    document.cookie = `${CONSENT_COOKIE_KEY}=${encoded}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secureAttribute}`;
};

const clearConsentCookie = (): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const secureAttribute =
        typeof window !== 'undefined' && window.location.protocol === 'https:'
            ? '; Secure'
            : '';

    document.cookie = `${CONSENT_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax${secureAttribute}`;
};

const parseStoredConsent = (raw: string): CookiePreferences | null => {
    try {
        const stored: Partial<CookiePreferences> = JSON.parse(raw);

        if (stored.version !== CONSENT_VERSION) {
            return null;
        }

        if (typeof stored.timestamp !== 'string') {
            return null;
        }

        if (typeof stored.analytics !== 'boolean' || typeof stored.marketing !== 'boolean') {
            return null;
        }

        return {
            essential: true,
            analytics: stored.analytics,
            marketing: stored.marketing,
            timestamp: stored.timestamp,
            version: CONSENT_VERSION,
        };
    } catch {
        return null;
    }
};

export { openCookieSettings };

interface CookieSettingsButtonProps {
    className?: string;
    label?: string;
}

export const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({
    className,
    label = 'Cookie Settings',
}) => {
    const [openSignal, setOpenSignal] = useState(0);

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    openCookieSettings();
                    setOpenSignal((value) => value + 1);
                }}
                className={className}
            >
                {label}
            </button>
            {openSignal > 0 ? <CookieConsent forceOpenSignal={openSignal} /> : null}
        </>
    );
};

interface CookieConsentProps {
    forceOpenSignal?: number;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ forceOpenSignal }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true as const, // Required for core site behavior and cannot be changed
        analytics: false,
        marketing: false,
    });
    const customizeButtonRef = useRef<HTMLButtonElement>(null);
    const consentDialogRef = useFocusTrap<HTMLDivElement>({
        active: isVisible && showSettings,
        initialFocus: showSettings
            ? '#cookie-consent-settings-close'
            : false,
        clickOutsideDeactivates: false,
        escapeDeactivates: false,
    });

    useEffect(() => {
        let isMounted = true;
        const showBanner = () => {
            if (isMounted) setIsVisible(true);
        };

        let raw: string | null = null;
        try {
            raw = localStorage.getItem(COOKIE_CONSENT_KEY);
        } catch {
            // Storage inaccessible (private browsing) — show banner
            showBanner();
            return () => { isMounted = false; };
        }

        if (!raw) {
            // No consent stored → show banner immediately (consent-first)
            clearConsentCookie();
            showBanner();
            return () => { isMounted = false; };
        }

        const stored = parseStoredConsent(raw);
        if (!stored) {
            // Corrupted data → re-prompt
            try { localStorage.removeItem(COOKIE_CONSENT_KEY); } catch { /* ignore */ }
            clearConsentCookie();
            showBanner();
            return () => { isMounted = false; };
        }

        // Returning visitors: keep server-readable consent parity in sync
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(stored));
        } catch { /* ignore */ }
        writeConsentCookie(stored);
        setPreferences({
            essential: true,
            analytics: stored.analytics,
            marketing: stored.marketing,
        });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!forceOpenSignal) {
            return;
        }

        setShowSettings(true);
        setIsVisible(true);
    }, [forceOpenSignal]);

    // Listen for the global "open cookie settings" event (from footer link)
    useEffect(() => {
        const handler = () => {
            setShowSettings(true);
            setIsVisible(true);
        };
        window.addEventListener(COOKIE_CONSENT_EVENT, handler);
        return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handler);
    }, []);

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || !showSettings) {
                return;
            }

            event.preventDefault();
            setShowSettings(false);
            window.requestAnimationFrame(() => customizeButtonRef.current?.focus());
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, showSettings]);

    const saveConsent = (prefs: { essential: true; analytics: boolean; marketing: boolean }) => {
        const record: CookiePreferences = {
            ...prefs,
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
        };
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
        } catch { /* ignore */ }
        writeConsentCookie(record);
        // Notify analytics module (and any other listeners) of the consent change
        window.dispatchEvent(new CustomEvent('hylono:consent-updated', { detail: record }));
    };

    const handleAcceptAll = () => {
        saveConsent({ essential: true, analytics: true, marketing: true });
        setIsVisible(false);
        setShowSettings(false);
    };

    const handleAcceptEssential = () => {
        saveConsent({ essential: true, analytics: false, marketing: false });
        setIsVisible(false);
        setShowSettings(false);
    };

    const handleSavePreferences = () => {
        saveConsent(preferences);
        setIsVisible(false);
        setShowSettings(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 sm:px-6 sm:pb-6"
                    role={showSettings ? 'dialog' : 'region'}
                    aria-modal={showSettings ? 'true' : undefined}
                    aria-label={showSettings ? 'Cookie consent settings' : 'Cookie consent banner'}
                >
                    <div
                        ref={consentDialogRef}
                        tabIndex={-1}
                        className={`mx-auto w-full overflow-hidden border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur ${
                            showSettings ? 'max-w-2xl rounded-[30px]' : 'max-w-4xl rounded-[32px]'
                        }`}
                    >
                        {!showSettings ? (
                            <div className="bg-gradient-to-r from-white via-white to-slate-50 p-5 sm:p-6 lg:p-7">
                                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                                    <div className="flex items-start gap-4 sm:gap-5">
                                        <div
                                            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-50 shadow-sm"
                                            aria-hidden="true"
                                        >
                                            <Cookie className="text-amber-600" size={24} />
                                        </div>
                                        <div className="max-w-2xl">
                                            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                                                We use cookies
                                            </h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                Essential storage keeps the site working. Optional analytics stay off
                                                until you choose otherwise. Read our{' '}
                                                <Link href="/cookie-policy" className="text-cyan-600 underline">
                                                    Cookie Policy
                                                </Link>{' '}
                                                and{' '}
                                                <Link href="/privacy" className="text-cyan-600 underline">
                                                    Privacy Policy
                                                </Link>{' '}
                                                for details.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:justify-end">
                                        <button
                                            ref={customizeButtonRef}
                                            id="cookie-consent-customize"
                                            type="button"
                                            onClick={() => setShowSettings(true)}
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                            aria-label="Open cookie preference settings"
                                        >
                                            <Settings size={16} aria-hidden="true" /> Customize
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptEssential}
                                            className="min-h-11 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                        >
                                            Reject Optional Cookies
                                            <span className="sr-only"> Essential Only</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="min-h-11 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                                        >
                                            Accept All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 id="cookie-consent-settings-title" className="font-bold text-slate-900">
                                        Cookie Preferences
                                    </h3>
                                    <button
                                        id="cookie-consent-settings-close"
                                        type="button"
                                        onClick={() => setShowSettings(false)}
                                        className="text-slate-400 hover:text-slate-600"
                                        aria-label="Back to cookie banner"
                                    >
                                        <X size={20} aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {/* Essential — always on, non-toggleable */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div>
                                            <span className="font-medium text-slate-900">Essential Cookies</span>
                                            <p className="text-xs text-slate-500">Required for site functionality. Cannot be disabled.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked
                                            disabled
                                            className="w-5 h-5 accent-cyan-500"
                                            aria-label="Essential cookies (required)"
                                        />
                                    </div>

                                    {/* Analytics */}
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                        <div>
                                            <span className="font-medium text-slate-900">Analytics Cookies</span>
                                            <p className="text-xs text-slate-500">Used for opted-in site analytics through PostHog.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) =>
                                                setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                                            }
                                            className="w-5 h-5 accent-cyan-500"
                                        />
                                    </label>

                                    {/* Marketing */}
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                        <div>
                                            <span className="font-medium text-slate-900">Marketing Cookies</span>
                                            <p className="text-xs text-slate-500">Stores your marketing preference so optional tags can respect it if enabled.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) =>
                                                setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))
                                            }
                                            className="w-5 h-5 accent-cyan-500"
                                        />
                                    </label>
                                </div>

                                <p className="text-xs text-slate-400 mb-4">
                                    Your consent is recorded with a timestamp and version number. You can reopen Cookie Settings from the footer at any time.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleSavePreferences}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check size={16} aria-hidden="true" /> Save Preferences
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
