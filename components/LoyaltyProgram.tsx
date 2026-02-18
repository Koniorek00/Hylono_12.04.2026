import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Gift, Trophy, Zap, Crown, ChevronRight } from 'lucide-react';

export const LoyaltyProgram: React.FC = () => {
    const tiers = [
        { name: 'Bronze', icon: <Award />, points: '0-999', benefits: ['5% off purchases', 'Birthday bonus', 'Newsletter exclusives'], color: 'from-amber-600 to-amber-700' },
        { name: 'Silver', icon: <Star />, points: '1,000-4,999', benefits: ['10% off purchases', 'Free shipping', 'Early access to sales', 'Priority support'], color: 'from-slate-400 to-slate-500' },
        { name: 'Gold', icon: <Crown />, points: '5,000+', benefits: ['15% off purchases', 'Free installation', 'VIP concierge', 'Exclusive events', 'Free maintenance year'], color: 'from-amber-400 to-yellow-500' },
    ];

    const earnMethods = [
        { action: 'Purchase', points: '1 point per 10 PLN', icon: <Zap /> },
        { action: 'Leave a Review', points: '50 points', icon: <Star /> },
        { action: 'Refer a Friend', points: '500 points', icon: <Gift /> },
        { action: 'Complete Profile', points: '100 points', icon: <Award /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <Trophy className="mx-auto text-amber-500 mb-4" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Hylono Rewards</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Earn points on every purchase and unlock exclusive benefits.
                        The more you invest in your wellness, the more you save.
                    </p>
                </div>

                {/* User Stats (Mock) */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                                <Star className="text-white" size={32} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Your Tier</p>
                                <p className="text-2xl font-bold text-slate-900">Silver Member</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-cyan-600">2,450</p>
                            <p className="text-sm text-slate-500">Points Balance</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-500">Next Tier: Gold</p>
                            <div className="w-48 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                <div className="w-1/2 h-full bg-amber-500 rounded-full" />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">2,550 points to go</p>
                        </div>
                    </div>
                </div>

                {/* Tiers */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Membership Tiers</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`rounded-2xl overflow-hidden ${i === 2 ? 'ring-2 ring-amber-400' : ''}`}
                        >
                            <div className={`bg-gradient-to-br ${tier.color} p-6 text-white text-center`}>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    {tier.icon}
                                </div>
                                <h3 className="text-xl font-bold">{tier.name}</h3>
                                <p className="text-sm opacity-80">{tier.points} points</p>
                            </div>
                            <div className="bg-white p-6">
                                <ul className="space-y-2">
                                    {tier.benefits.map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                                            <ChevronRight size={14} className="text-cyan-500" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* How to Earn */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How to Earn Points</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {earnMethods.map((method) => (
                        <div key={method.action} className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3 text-cyan-600">
                                {method.icon}
                            </div>
                            <p className="font-bold text-slate-900 text-sm mb-1">{method.action}</p>
                            <p className="text-xs text-cyan-600 font-medium">{method.points}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
                    <Trophy className="mx-auto text-amber-400 mb-4" size={40} />
                    <h2 className="text-2xl font-bold mb-2">Start Earning Today</h2>
                    <p className="text-slate-300 mb-6">Create an account to join the rewards program</p>
                    <button className="px-8 py-4 bg-amber-500 text-slate-900 rounded-xl font-bold hover:bg-amber-400 transition-colors">
                        Join Hylono Rewards
                    </button>
                </div>
            </div>
        </div>
    );
};
