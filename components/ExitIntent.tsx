import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight, Mail } from 'lucide-react';

export const ExitIntent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        // Only trigger if mouse leaves from top of screen (exit intent)
        if (e.clientY <= 5) {
            const hasShown = sessionStorage.getItem('exitIntentShown');
            if (!hasShown) {
                setIsVisible(true);
                sessionStorage.setItem('exitIntentShown', 'true');
            }
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [handleMouseLeave]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Exit intent email:', email);
        setSubmitted(true);
        setTimeout(() => setIsVisible(false), 2000);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50"
                        onClick={() => setIsVisible(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -50 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl z-50 overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-8 text-center text-white">
                            <Gift className="mx-auto mb-4" size={48} />
                            <h2 className="text-2xl font-bold mb-2">Wait! Don't Leave Empty-Handed</h2>
                            <p className="text-white/80 text-sm">Get our exclusive Bio-Optimization Guide FREE</p>
                        </div>

                        <div className="p-6">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="text-emerald-600" size={32} />
                                    </div>
                                    <p className="font-bold text-slate-900">Check your inbox!</p>
                                    <p className="text-sm text-slate-500">Your guide is on its way.</p>
                                </div>
                            ) : (
                                <>
                                    <ul className="space-y-2 mb-6">
                                        <li className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-xs">✓</span>
                                            Complete HBOT protocol guide
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-xs">✓</span>
                                            10% off your first purchase
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-xs">✓</span>
                                            Early access to new products
                                        </li>
                                    </ul>

                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Get My Free Guide <ArrowRight size={18} />
                                        </button>
                                    </form>

                                    <p className="text-xs text-slate-400 text-center mt-4">
                                        No spam, ever. Unsubscribe anytime.
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
