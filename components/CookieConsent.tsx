import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // Always true
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, []);

    const handleAcceptAll = () => {
        const fullConsent = { essential: true, analytics: true, marketing: true };
        localStorage.setItem('cookieConsent', JSON.stringify(fullConsent));
        setIsVisible(false);
    };

    const handleAcceptEssential = () => {
        const essentialOnly = { essential: true, analytics: false, marketing: false };
        localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
        setIsVisible(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
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
                >
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        {!showSettings ? (
                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Cookie className="text-amber-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">We use cookies</h3>
                                        <p className="text-sm text-slate-500">
                                            We use cookies to improve your experience and analyze site usage.
                                            Read our <a href="/privacy" className="text-cyan-600 underline">Privacy Policy</a> for details.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Settings size={16} /> Customize
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
                                    <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div>
                                            <span className="font-medium text-slate-900">Essential Cookies</span>
                                            <p className="text-xs text-slate-500">Required for site functionality</p>
                                        </div>
                                        <input type="checkbox" checked disabled className="w-5 h-5 accent-cyan-500" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                        <div>
                                            <span className="font-medium text-slate-900">Analytics Cookies</span>
                                            <p className="text-xs text-slate-500">Help us understand usage patterns</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                            className="w-5 h-5 accent-cyan-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                        <div>
                                            <span className="font-medium text-slate-900">Marketing Cookies</span>
                                            <p className="text-xs text-slate-500">Personalized ads and content</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                            className="w-5 h-5 accent-cyan-500"
                                        />
                                    </label>
                                </div>

                                <button
                                    onClick={handleSavePreferences}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check size={16} /> Save Preferences
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
