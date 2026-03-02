import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import { Mail, CheckCircle, BellOff, AlertTriangle, ArrowRight } from 'lucide-react';
import { NavigateFunction } from '../types';

interface UnsubscribePageProps {
    onNavigate: NavigateFunction;
}

const EMAIL_TYPES = [
    { id: 'marketing', label: 'Marketing & Promotions', description: 'Sales, discounts, and new product announcements' },
    { id: 'newsletter', label: 'Weekly Newsletter', description: 'Protocol tips, research highlights, and community news' },
    { id: 'product_updates', label: 'Product Updates', description: 'Firmware updates, new features, and accessory releases' },
    { id: 'educational', label: 'Educational Content', description: 'Science explainers, how-to guides, and webinar invites' },
];

type Step = 'form' | 'confirmed';

export const UnsubscribePage: React.FC<UnsubscribePageProps> = ({ onNavigate }) => {
    const shouldReduceMotion = useReducedMotion();
    const [step, setStep] = useState<Step>('form');
    const [email, setEmail] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [allSelected, setAllSelected] = useState(false);
    const [emailError, setEmailError] = useState('');

    const toggleType = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) { next.delete(id); } else { next.add(id); }
            return next;
        });
        setAllSelected(false);
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelected(new Set());
            setAllSelected(false);
        } else {
            setSelected(new Set(EMAIL_TYPES.map(t => t.id)));
            setAllSelected(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@') || !email.includes('.')) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        if (selected.size === 0 && !allSelected) {
            setEmailError('Please select at least one email type to unsubscribe from, or choose "Unsubscribe from all".');
            return;
        }
        setEmailError('');
        setStep('confirmed');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950">
            <section className="pt-28 pb-24 px-6">
                <div className="max-w-2xl mx-auto">
                    {step === 'form' ? (
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6">
                                    <BellOff size={28} className="text-slate-400" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold futuristic-font text-white mb-3">
                                    Manage Email Preferences
                                </h1>
                                <p className="text-slate-400">
                                    Choose which types of emails you'd like to stop receiving. You can re-subscribe at any time from your account settings.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="bg-slate-800/60 rounded-3xl border border-slate-700/50 p-8 space-y-6">
                                {/* Email input */}
                                <div>
                                    <label className="block text-sm text-slate-300 font-medium mb-2" htmlFor="unsub-email">
                                        Your email address
                                    </label>
                                    <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3">
                                        <Mail size={16} className="text-slate-500 shrink-0" />
                                        <input
                                            id="unsub-email"
                                            type="email"
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                                            placeholder="you@example.com"
                                            className="bg-transparent text-white placeholder-slate-500 text-sm flex-1 outline-none"
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                {/* Email type selection */}
                                <div>
                                    <p className="text-sm text-slate-300 font-medium mb-3">Unsubscribe from</p>
                                    <div className="space-y-3">
                                        {EMAIL_TYPES.map(type => (
                                            <label
                                                key={type.id}
                                                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${selected.has(type.id)
                                                    ? 'border-cyan-500/50 bg-cyan-500/5'
                                                    : 'border-slate-700 hover:border-slate-500'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(type.id)}
                                                    onChange={() => toggleType(type.id)}
                                                    className="mt-0.5 accent-cyan-500"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-white">{type.label}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{type.description}</p>
                                                </div>
                                            </label>
                                        ))}

                                        {/* Unsubscribe from all */}
                                        <label
                                            className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${allSelected
                                                ? 'border-red-500/50 bg-red-500/5'
                                                : 'border-slate-700 hover:border-slate-500'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={toggleAll}
                                                className="mt-0.5 accent-red-500"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-white">Unsubscribe from all Hylono emails</p>
                                                <p className="text-xs text-slate-400 mt-0.5">You will still receive transactional emails about your orders and account security.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Transactional note */}
                                <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-200/80">
                                        Order confirmations, shipping updates, and account security emails cannot be unsubscribed from as they are essential for service delivery.
                                    </p>
                                </div>

                                {emailError && (
                                    <p className="text-red-400 text-sm">{emailError}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                                >
                                    Confirm Preferences
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8">
                                <CheckCircle size={40} className="text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold futuristic-font text-white mb-4">Preferences Updated</h2>
                            <p className="text-slate-400 mb-2">
                                We've updated your email preferences for <span className="text-white font-medium">{email}</span>.
                            </p>
                            <p className="text-slate-500 text-sm mb-10">
                                Changes may take up to 48 hours to take effect across all email systems.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => onNavigate('account')}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2"
                                >
                                    Account Settings <ArrowRight size={16} />
                                </button>
                                <button
                                    onClick={() => onNavigate('home')}
                                    className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-semibold px-8 py-3 rounded-full transition-all"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

