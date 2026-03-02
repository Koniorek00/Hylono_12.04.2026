"use client";

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle, Copy, Mail, MessageCircle, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { NavigateFunction } from '../types';
import { FeatureGate } from './FeatureGate';
import { referralContent } from '../content/referral';

interface ReferralPageProps {
    onNavigate: NavigateFunction;
}

interface ReferralRecord {
    id: string;
    friendName: string;
    status: keyof typeof referralContent.statuses;
    credit: number;
}

const LegacyReferralFallback: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-6">
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-100 bg-white p-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-3 futuristic-font">Referral Program</h1>
            <p className="text-slate-600 mb-6">Referral dashboard is currently unavailable.</p>
            <button onClick={() => onNavigate('rewards')} className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold">
                Visit rewards
            </button>
        </div>
    </div>
);

const EnhancedReferralPage: React.FC<ReferralPageProps> = ({ onNavigate }) => {
    const router = useRouter();
    const reduced = useReducedMotion();
    const { data: session } = useSession();
    const user = session?.user;
    const [copied, setCopied] = useState(false);

    const referralLink = useMemo(() => {
        const identitySeed = user?.email ?? user?.name ?? 'DEMOUSER';
        const slug = identitySeed.slice(0, 8).toUpperCase();
        return `${window.location.origin}/store?ref=HYLONO-${slug}`;
    }, [user?.email, user?.name]);

    const referrals: ReferralRecord[] = useMemo(
        () => [
            { id: 'r-1', friendName: 'Alex P.', status: 'completed', credit: 150 },
            { id: 'r-2', friendName: 'Nina M.', status: 'pending', credit: 0 },
            { id: 'r-3', friendName: 'Chris R.', status: 'canceled', credit: 0 },
        ],
        [],
    );

    const referralBalance = referrals.reduce((sum, item) => sum + item.credit, 0);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    const shareByEmail = () => {
        window.open(`mailto:?subject=Try Hylono&body=${encodeURIComponent(referralLink)}`, '_blank', 'noopener,noreferrer');
    };

    const shareByWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(referralLink)}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 futuristic-font">{referralContent.title}</h1>
                        <p className="text-slate-300">{referralContent.subtitle}</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-14 px-6">
                <div className="max-w-4xl mx-auto rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
                    {user ? (
                        <>
                            <label htmlFor="referral-link" className="text-sm font-semibold text-slate-800 block mb-2">
                                Your referral link
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    id="referral-link"
                                    value={referralLink}
                                    readOnly
                                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                                />
                                <button
                                    onClick={copyLink}
                                    className="min-h-11 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                                >
                                    {copied ? <CheckCircle size={15} /> : <Copy size={15} />} {copied ? 'Copied' : referralContent.copyLabel}
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4" aria-label="Share channels">
                                <button onClick={shareByEmail} className="min-h-11 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 inline-flex items-center gap-2">
                                    <Mail size={14} /> Email
                                </button>
                                <button onClick={shareByWhatsApp} className="min-h-11 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 inline-flex items-center gap-2">
                                    <MessageCircle size={14} /> WhatsApp
                                </button>
                                <button onClick={copyLink} className="min-h-11 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 inline-flex items-center gap-2">
                                    <Share2 size={14} /> Copy link
                                </button>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Your referrals</h2>
                                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-slate-600">
                                            <tr>
                                                <th className="text-left px-4 py-3 font-semibold">Friend</th>
                                                <th className="text-left px-4 py-3 font-semibold">Status</th>
                                                <th className="text-left px-4 py-3 font-semibold">Credit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {referrals.map((item) => (
                                                <tr key={item.id} className="border-t border-slate-100">
                                                    <td className="px-4 py-3 text-slate-800">{item.friendName}</td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                                                item.status === 'completed'
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : item.status === 'pending'
                                                                      ? 'bg-amber-100 text-amber-700'
                                                                      : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                        >
                                                            {referralContent.statuses[item.status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-800">{item.credit > 0 ? `+€${item.credit}` : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-semibold text-slate-900">
                                    {referralContent.balancePrefix} €{referralBalance}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">{referralContent.balanceNote}</p>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                            <p className="text-slate-700 mb-4">{referralContent.loginPrompt}</p>
                            <button
                                onClick={() => {
                                    router.push('/account?redirect=/referral');
                                    window.scrollTo(0, 0);
                                }}
                                className="min-h-11 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold"
                            >
                                {referralContent.loginButton}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export const ReferralPage: React.FC<ReferralPageProps> = ({ onNavigate }) => {
    return (
        <FeatureGate flag="feature_referral" fallback={<LegacyReferralFallback onNavigate={onNavigate} />}>
            <EnhancedReferralPage onNavigate={onNavigate} />
        </FeatureGate>
    );
};

