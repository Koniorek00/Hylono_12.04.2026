import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import Link from 'next/link';

// Consent schema version — bump this when categories change to re-prompt users
const CONSENT_VERSION = '1.1';
const CONSENT_KEY = 'cookieConsent';

export interface CookiePreferences {
    essential: true;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
    version: string;
}

/** Dispatch this event anywhere in the app to re-open the cookie banner */
export const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('hylono:open-cookie-settings'));
};

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true as const, // Always true, cannot be changed
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        let isMounted = true;
        const showBanner = () => {
            if (isMounted) setIsVisible(true);
        };

        // Check if user has already consented with the current version
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) {
            // No consent stored → show banner immediately (consent-first)
            showBanner();
            return;
        }
        try {
            const stored: Partial<CookiePreferences> = JSON.parse(raw);
            // Re-prompt if consent was given under an older schema version
            if (!stored.version || stored.version !== CONSENT_VERSION) {
                localStorage.removeItem(CONSENT_KEY);
                showBanner();
            }
        } catch {
            // Corrupted data → re-prompt
            localStorage.removeItem(CONSENT_KEY);
            showBanner();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    // Listen for the global "open cookie settings" event (from footer link)
    useEffect(() => {
        const handler = () => {
            setShowSettings(true);
            setIsVisible(true);
        };
        window.addEventListener('hylono:open-cookie-settings', handler);
        return () => window.removeEventListener('hylono:open-cookie-settings', handler);
    }, []);

    const saveConsent = (prefs: { essential: true; analytics: boolean; marketing: boolean }) => {
        const record: CookiePreferences = {
            ...prefs,
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
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
                    className="fixed bottom-0 left-0 right-0 z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Cookie consent settings"
                >
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        {!showSettings ? (
                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                        <Cookie className="text-amber-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">We use cookies</h3>
                                        <p className="text-sm text-slate-500">
                                            We use cookies to improve your experience and analyze site usage.
                                            Read our{' '}
                                            <Link href="/privacy" className="text-cyan-600 underline">
                                                Privacy Policy
                                            </Link>{' '}
                                            for details.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        aria-label="Open cookie preference settings"
                                    >
                                        <Settings size={16} aria-hidden="true" /> Customize
                                    </button>
                                    <button
                                        onClick={handleAcceptEssential}
                                        className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Essential Only
                                    </button>
                                    <button
                                        onClick={handleAcceptAll}
                                        className="px-6 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                                    >
                                        Accept All
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-slate-900">Cookie Preferences</h3>
                                    <button
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
                                            aria-label="Essential cookies (always enabled)"
                                        />
                                    </div>

                                    {/* Analytics */}
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                        <div>
                                            <span className="font-medium text-slate-900">Analytics Cookies</span>
                                            <p className="text-xs text-slate-500">Help us understand how visitors use the site. No personal data shared.</p>
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
                                            <p className="text-xs text-slate-500">Used to show relevant offers. You can opt out at any time.</p>
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
                                    Your consent is recorded with a timestamp and version number for GDPR compliance.
                                </p>

                                <button
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
