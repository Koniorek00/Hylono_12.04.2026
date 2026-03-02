import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Circle, ExternalLink, LifeBuoy, Users } from 'lucide-react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import Link from 'next/link';

interface OnboardingFlowProps {
    onComplete: () => void;
}

interface ChecklistItem {
    id: string;
    title: string;
    status: 'complete' | 'pending';
    date?: string;
    details?: string;
    links?: { label: string; href: string; external?: boolean }[];
}

const CHECKLIST: ChecklistItem[] = [
    { id: 'order', title: 'Order placed', status: 'complete', date: '2026-02-20' },
    { id: 'payment', title: 'Payment confirmed', status: 'complete', date: '2026-02-20' },
    {
        id: 'delivery',
        title: 'Delivery (estimated: 2026-02-27)',
        status: 'pending',
        details: 'Shipment is being prepared. You can track your parcel once courier data is available.',
        links: [{ label: 'Track shipment →', href: '/support' }],
    },
    {
        id: 'setup',
        title: 'Prepare your space',
        status: 'pending',
        links: [{ label: 'Guide: how to prepare your room →', href: '/learning' }],
    },
    {
        id: 'first-session',
        title: 'First session',
        status: 'pending',
        links: [
            { label: 'Starter protocol: 14 days →', href: '/protocols' },
            { label: 'Video: first session step by step →', href: '/videos' },
        ],
    },
    {
        id: 'full-protocol',
        title: 'Full protocol',
        status: 'pending',
        links: [{ label: 'Choose a protocol tailored to you →', href: '/protocols' }],
    },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
    const onboardingEnabled = useFeatureFlag('feature_onboarding');
    const [expandedItem, setExpandedItem] = useState<string | null>(
        CHECKLIST[2]?.id ?? CHECKLIST[0]?.id ?? null
    );

    if (!onboardingEnabled) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 p-4">
                <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl">
                    <h2 className="text-2xl font-black text-slate-900 mb-3 futuristic-font">Onboarding preview</h2>
                    <p className="text-slate-600 mb-6">The enhanced getting started checklist is currently disabled.</p>
                    <button onClick={onComplete} className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold">
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-2xl"
            >
                <div className="p-6 md:p-8 border-b border-slate-100">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 futuristic-font">Your getting started plan</h1>
                    <p className="text-sm text-slate-600 mt-2">Track setup progress and open practical guides for your first sessions.</p>
                </div>

                <div className="p-6 md:p-8 space-y-3">
                    {CHECKLIST.map((item) => {
                        const isExpanded = expandedItem === item.id;
                        return (
                            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                                    className="w-full text-left min-h-11 px-4 py-4 flex items-start gap-3"
                                    aria-expanded={isExpanded}
                                >
                                    {item.status === 'complete' ? (
                                        <CheckCircle2 size={18} className="text-emerald-600 mt-0.5" />
                                    ) : (
                                        <Circle size={18} className="text-slate-400 mt-0.5" />
                                    )}
                                    <span className="flex-1">
                                        <span className="block text-sm font-semibold text-slate-900">{item.title}</span>
                                        {item.date && (
                                            <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                                <Calendar size={12} /> {item.date}
                                            </span>
                                        )}
                                    </span>
                                </button>

                                {isExpanded && (item.details || item.links) && (
                                    <div className="px-4 pb-4 pl-11">
                                        {item.details && <p className="text-sm text-slate-600 mb-2">{item.details}</p>}
                                        <div className="space-y-1">
                                            {item.links?.map((link) => (
                                                link.external ? (
                                                    <a
                                                        key={link.label}
                                                        href={link.href}
                                                        className="inline-flex items-center gap-1 text-sm text-cyan-700 hover:underline mr-4"
                                                        target="_blank"
                                                        rel="noreferrer noopener"
                                                    >
                                                        {link.label}
                                                        <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <Link
                                                        key={link.label}
                                                        href={link.href}
                                                        className="inline-flex items-center gap-1 text-sm text-cyan-700 hover:underline mr-4"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>

                <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-5">
                        <p className="text-sm font-semibold text-slate-900 mb-2">Need help?</p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/support" className="min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                                <LifeBuoy size={14} /> Contact support
                            </Link>
                            <Link href="/advisors" className="min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                                <Users size={14} /> Book a setup consultation
                            </Link>
                        </div>
                    </div>

                    <button onClick={onComplete} className="w-full min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold">
                        Continue
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
