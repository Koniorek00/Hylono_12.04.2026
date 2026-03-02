import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { NavigateFunction } from '../types';
import { orderSuccessContent } from '../content/orderSuccess';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface OrderSuccessPageProps {
    onNavigate: NavigateFunction;
}

interface OrderDocument {
    id: string;
    label: string;
    href: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();
    const enhancedEnabled = useFeatureFlag('feature_order_confirmation_enhanced');

    const orderRef = (() => {
        try {
            return sessionStorage.getItem('hylono_last_order_ref') || `HYL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        } catch {
            return 'HYL-XXXXXX';
        }
    })();

    useEffect(() => {
        try {
            sessionStorage.removeItem('hylono_last_order_ref');
        } catch {
            // no-op
        }
    }, []);

    const orderDocuments: OrderDocument[] = [
        { id: 'doc-invoice', label: orderSuccessContent.documents.invoiceLabel, href: '/terms' },
        { id: 'doc-warranty', label: orderSuccessContent.documents.warrantyLabel, href: '/warranty' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-emerald-500/5 rounded-full blur-3xl" />
                </div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.45 }}
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle size={42} className="text-emerald-400" />
                        </div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-5">
                            <Sparkles size={12} />
                            {orderSuccessContent.hero.badge}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-3 futuristic-font">{orderSuccessContent.hero.title}</h1>
                        <p className="text-slate-300 text-base md:text-lg">{orderSuccessContent.hero.subtitle}</p>
                        <p className="text-sm text-slate-400 mt-4">
                            {orderSuccessContent.hero.orderReferencePrefix} <span className="font-mono text-cyan-400 font-bold">{orderRef}</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-14 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">{orderSuccessContent.setup.title}</h2>
                        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                            {orderSuccessContent.setup.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => onNavigate('onboarding')}
                                className="min-h-11 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                            >
                                {orderSuccessContent.setup.openOnboarding} <ArrowRight size={14} />
                            </button>
                            <button
                                onClick={() => onNavigate('support')}
                                className="min-h-11 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold"
                            >
                                {orderSuccessContent.setup.contactSupport}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {enhancedEnabled && (
                <section className="pb-16 px-6">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <article className="rounded-3xl border border-slate-100 bg-white p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{orderSuccessContent.nextTitle}</h3>
                            <ol className="space-y-2">
                                {orderSuccessContent.steps.map((step, index) => (
                                    <li key={step} className="text-sm text-slate-700 flex items-start gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-semibold inline-flex items-center justify-center shrink-0 mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                            <button
                                onClick={() => onNavigate('onboarding')}
                                className="mt-4 min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700"
                            >
                                {orderSuccessContent.onboardingButton}
                            </button>
                        </article>

                        {orderDocuments.length > 0 && (
                            <article className="rounded-3xl border border-slate-100 bg-white p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{orderSuccessContent.documentsTitle}</h3>
                                <ul className="space-y-2">
                                    {orderDocuments.map((document) => (
                                        <li key={document.id}>
                                            <Link href={document.href} className="text-sm text-cyan-700 hover:underline">
                                                {document.label} →
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )}

                        <article className="rounded-3xl border border-slate-100 bg-white p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{orderSuccessContent.referralTitle}</h3>
                            <p className="text-sm text-slate-600 mb-4">{orderSuccessContent.referralText}</p>
                            <button
                                onClick={() => onNavigate('referral')}
                                className="min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700"
                            >
                                {orderSuccessContent.referralButton}
                            </button>
                        </article>
                    </div>
                </section>
            )}
        </div>
    );
};

