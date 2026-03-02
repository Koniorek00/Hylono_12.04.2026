import React, { useActionState, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Sparkles, Check, AlertTriangle } from 'lucide-react';
import {
  submitNewsletterFormAction,
  submitNewsletterSafeAction,
  type FormActionResult,
} from '../src/actions/formActions';

export const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [actionState, formAction, pending] = useActionState<FormActionResult, FormData>(
        submitNewsletterFormAction,
        { success: false, message: '' }
    );

    useEffect(() => {
        if (!actionState.success || !email) return;

        const source = 'footer';
        void submitNewsletterSafeAction({ email, source });
    }, [actionState.success, email]);

    useEffect(() => {
        if (actionState.success) {
            setSubmitted(true);
            setEmail('');
        }
    }, [actionState.success]);

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-emerald-600"
            >
                <Check size={20} />
                <span className="text-sm font-medium">You're on the list!</span>
            </motion.div>
        );
    }

    return (
        <form action={formAction} className="flex gap-2">
            <input type="hidden" name="source" value="footer" />
            <div className="relative flex-1">
                <label htmlFor="newsletter-email-footer" className="sr-only">Email address</label>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                <input
                    id="newsletter-email-footer"
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email address for newsletter"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none text-base"
                />
            </div>
            <button
                type="submit"
                disabled={pending}
                className="px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold text-sm transition-colors"
            >
                {pending ? 'Subscribing…' : 'Subscribe'}
            </button>
        </form>
    );
};

// Newsletter Section for Home page
export const NewsletterSection: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [homeError, setHomeError] = useState<string | null>(null);
    const [actionState, formAction, pending] = useActionState<FormActionResult, FormData>(
        submitNewsletterFormAction,
        { success: false, message: '' }
    );

    useEffect(() => {
        if (!actionState.success || !email) return;

        const source = 'home-section';
        void submitNewsletterSafeAction({ email, source });
    }, [actionState.success, email]);

    useEffect(() => {
        if (actionState.success) {
            setSubmitted(true);
            setEmail('');
            setHomeError(null);
        } else if (actionState.message) {
            setHomeError(actionState.message);
        }
    }, [actionState.success, actionState.message]);

    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                <Sparkles className="mx-auto mb-6 text-cyan-400" size={32} />
                <h2 className="text-3xl font-bold text-white mb-4">Stay in the Loop</h2>
                <p className="text-slate-400 mb-8">
                    Get exclusive insights on bio-optimization, early access to new products, and protocol updates.
                </p>

                {submitted ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 text-emerald-400"
                    >
                        <Check className="mx-auto mb-2" size={32} />
                        <p className="font-bold">Welcome to the inner circle!</p>
                        <p className="text-sm opacity-80">Check your inbox for a confirmation email.</p>
                    </motion.div>
                ) : (
                    <form action={formAction} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input type="hidden" name="source" value="home-section" />
                        <label htmlFor="newsletter-email-section" className="sr-only">Email address</label>
                        <input
                            id="newsletter-email-section"
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            aria-label="Email address for newsletter"
                            className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={pending}
                            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                        >
                            {pending ? 'Subscribing…' : 'Subscribe'}
                        </button>
                    </form>
                )}

                {homeError && (
                    <div className="flex items-start gap-2 mt-4 text-amber-400 text-xs text-left max-w-md mx-auto">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>{homeError}</span>
                    </div>
                )}
                <p className="text-xs text-slate-500 mt-4">
                    No spam, ever. Unsubscribe anytime.
                </p>
            </div>
        </section>
    );
};

