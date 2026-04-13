/**
 * RewardsPage
 * Unified rewards page consolidating Referral and Loyalty programs.
 * 
 * Sections:
 *  1. Referral Rewards — Share code, earn €150-250 per referral
 *  2. Purchase Points — Earn points on purchases, tier benefits
 * 
 * Route: /rewards
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
    Gift, Copy, CheckCircle, Share2, Users, TrendingUp, ArrowRight,
    Award, Star, Crown, Zap, Trophy, ChevronRight
} from 'lucide-react';
import { NavigateFunction } from '../types';

interface RewardsPageProps {
    onNavigate?: NavigateFunction;
    isAuthenticated?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// REFERRAL DATA
// ─────────────────────────────────────────────────────────────────────────────

const REFERRAL_STEPS = [
    { step: '01', title: 'Share Your Link', desc: 'Share your unique code with anyone who could benefit from bio-optimisation.', icon: Share2, color: 'text-cyan-400' },
    { step: '02', title: 'Friend Gets €150 Off', desc: 'They receive €150 off their first order using your code.', icon: Gift, color: 'text-violet-400' },
    { step: '03', title: 'You Earn Credit', desc: '€150-250 credit added to your account once their order ships.', icon: TrendingUp, color: 'text-emerald-400' },
    { step: '04', title: 'Unlimited Referrals', desc: 'No cap on how much credit you can earn.', icon: Users, color: 'text-amber-400' },
];

const REFERRAL_TIERS = [
    { name: 'Advocate', range: '1–4', reward: '€150', perks: ['€150 credit per referral', 'Early access', 'Email updates'], badge: 'bg-slate-700 text-slate-300' },
    { name: 'Champion', range: '5–14', reward: '€200', perks: ['€200 credit per referral', 'Priority support', 'Beta testing', 'Quarterly gifts'], badge: 'bg-cyan-500/20 text-cyan-300', featured: true },
    { name: 'Ambassador', range: '15+', reward: '€250', perks: ['€250 credit per referral', 'Account manager', 'Co-branded content', 'Summit invite'], badge: 'bg-amber-500/20 text-amber-300' },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOYALTY DATA
// ─────────────────────────────────────────────────────────────────────────────

const LOYALTY_TIERS = [
    { name: 'Bronze', icon: Award, points: '0–999', benefits: ['5% off purchases', 'Birthday bonus', 'Newsletter exclusives'], color: 'from-amber-600 to-amber-700' },
    { name: 'Silver', icon: Star, points: '1,000–4,999', benefits: ['10% off purchases', 'Free shipping', 'Early access', 'Priority support'], color: 'from-slate-400 to-slate-500' },
    { name: 'Gold', icon: Crown, points: '5,000+', benefits: ['15% off purchases', 'Free installation', 'VIP concierge', 'Exclusive events', 'Free maintenance year'], color: 'from-amber-400 to-yellow-500' },
];

const EARN_METHODS = [
    { action: 'Purchase', points: '1 point per 10 PLN', icon: Zap },
    { action: 'Leave a Review', points: '50 points', icon: Star },
    { action: 'Refer a Friend', points: '500 points', icon: Gift },
    { action: 'Complete Profile', points: '100 points', icon: Award },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const RewardsPage: React.FC<RewardsPageProps> = ({
    onNavigate,
    isAuthenticated = false,
}) => {
    const shouldReduceMotion = useReducedMotion();
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState<'referral' | 'loyalty'>('referral');
    const DEMO_CODE = 'HYLONO-DEMO123';

    const handleCopy = () => {
        navigator.clipboard.writeText(DEMO_CODE).catch(() => null);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 pt-10 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 text-cyan-400 text-xs tracking-widest uppercase mb-6">
                        <Trophy size={12} /> Hylono Rewards
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold futuristic-font text-white mb-4">
                        Earn As You Optimize
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Two ways to earn: refer friends for instant credit, or accumulate points with every purchase.
                    </p>
                </motion.div>

                {!isAuthenticated && (
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto mb-10 rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 text-center"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                            Public preview
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Browse the reward structure before you sign in. Personal balances,
                            referral codes, and member actions unlock from your Hylono account.
                        </p>
                        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                                onClick={() => onNavigate?.('account')}
                                className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
                            >
                                Sign in for your rewards
                            </button>
                            <button
                                onClick={() => onNavigate?.('store')}
                                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
                            >
                                Explore the store first
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Section Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-slate-800/60 rounded-2xl p-1.5 border border-slate-700/50">
                        <button
                            onClick={() => setActiveSection('referral')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                                activeSection === 'referral'
                                    ? 'bg-cyan-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Gift size={16} /> Referral Program
                        </button>
                        <button
                            onClick={() => setActiveSection('loyalty')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                                activeSection === 'loyalty'
                                    ? 'bg-cyan-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Star size={16} /> Loyalty Points
                        </button>
                    </div>
                </div>

                {/* Referral Section */}
                {activeSection === 'referral' && (
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Referral Code Box */}
                        <div className="max-w-md mx-auto mb-16">
                            <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-6 text-center">
                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Your referral code</p>
                                <div className="flex items-center justify-center gap-3">
                                    <p className="text-white font-mono font-bold text-xl tracking-wider">{DEMO_CODE}</p>
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            copied ? 'bg-emerald-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'
                                        }`}
                                    >
                                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <p className="text-slate-500 text-xs mt-3">Sign in to get your personal code</p>
                            </div>
                        </div>

                        {/* How It Works */}
                        <h2 className="text-2xl font-bold futuristic-font text-white text-center mb-8">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {REFERRAL_STEPS.map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50"
                                >
                                    <div className="text-3xl font-bold futuristic-font text-slate-700 mb-3">{item.step}</div>
                                    <item.icon size={24} className={`mb-3 ${item.color}`} />
                                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                                    <p className="text-slate-400 text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Referral Tiers */}
                        <h2 className="text-2xl font-bold futuristic-font text-white text-center mb-8">Referral Tiers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {REFERRAL_TIERS.map((tier, i) => (
                                <motion.div
                                    key={tier.name}
                                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`relative bg-slate-800/60 rounded-2xl p-6 border ${
                                        tier.featured ? 'border-cyan-500/50 ring-1 ring-cyan-500/30' : 'border-slate-700/50'
                                    }`}
                                >
                                    {tier.featured && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${tier.badge}`}>
                                        {tier.name}
                                    </div>
                                    <div className="text-3xl font-bold futuristic-font text-white mb-1">{tier.reward}</div>
                                    <div className="text-slate-400 text-xs mb-4">{tier.range} successful referrals</div>
                                    <ul className="space-y-2">
                                        {tier.perks.map((perk, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                                                <CheckCircle size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Loyalty Section */}
                {activeSection === 'loyalty' && (
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* User Stats (Mock) */}
                        <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-8 mb-12">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                                        <Star className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm">Your Tier</p>
                                        <p className="text-2xl font-bold text-white futuristic-font">Silver Member</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-cyan-400 futuristic-font">2,450</p>
                                    <p className="text-slate-400 text-sm">Points Balance</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-400 text-sm">Next Tier: Gold</p>
                                    <div className="w-48 h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                        <div className="w-1/2 h-full bg-amber-500 rounded-full" />
                                    </div>
                                    <p className="text-slate-500 text-xs mt-1">2,550 points to go</p>
                                </div>
                            </div>
                        </div>

                        {/* Loyalty Tiers */}
                        <h2 className="text-2xl font-bold futuristic-font text-white text-center mb-8">Membership Tiers</h2>
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {LOYALTY_TIERS.map((tier, i) => (
                                <motion.div
                                    key={tier.name}
                                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`rounded-2xl overflow-hidden ${i === 2 ? 'ring-2 ring-amber-400' : ''}`}
                                >
                                    <div className={`bg-gradient-to-br ${tier.color} p-6 text-white text-center`}>
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <tier.icon size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold">{tier.name}</h3>
                                        <p className="text-sm opacity-80">{tier.points} points</p>
                                    </div>
                                    <div className="bg-slate-800/80 p-6">
                                        <ul className="space-y-2">
                                            {tier.benefits.map((benefit) => (
                                                <li key={benefit} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <ChevronRight size={14} className="text-cyan-400" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* How to Earn */}
                        <h2 className="text-2xl font-bold futuristic-font text-white text-center mb-8">How to Earn Points</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {EARN_METHODS.map((method) => (
                                <div key={method.action} className="bg-slate-800/60 rounded-xl p-6 text-center border border-slate-700/50">
                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-cyan-400">
                                        <method.icon size={24} />
                                    </div>
                                    <p className="font-bold text-white text-sm mb-1">{method.action}</p>
                                    <p className="text-xs text-cyan-400 font-medium">{method.points}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* CTA */}
                <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 rounded-3xl p-10 text-center"
                >
                    <Trophy className="mx-auto text-amber-400 mb-4" size={40} />
                    <h2 className="text-2xl font-bold futuristic-font text-white mb-3">Start Earning Today</h2>
                    <p className="text-slate-400 mb-6">Create an account to join the rewards program and track your progress.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => onNavigate?.('account')}
                            className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2"
                        >
                            Join Rewards <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => onNavigate?.('store')}
                            className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-semibold px-8 py-3 rounded-full transition-all"
                        >
                            Browse Store
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default RewardsPage;
