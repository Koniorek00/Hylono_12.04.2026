"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, Gift, TrendingUp, CheckCircle, ArrowRight, Mail, Globe, Building } from 'lucide-react';

export const AffiliatePage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const benefits = [
        { icon: <DollarSign />, title: '10% Commission', desc: 'Earn on every sale you refer' },
        { icon: <Gift />, title: 'Exclusive Codes', desc: 'Unique discount codes for your audience' },
        { icon: <TrendingUp />, title: 'Real-time Tracking', desc: 'Dashboard to monitor your earnings' },
        { icon: <Users />, title: '60-Day Cookie', desc: 'Earn credit for 60 days after click' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Hero */}
                <div className="text-center mb-16">
                    <Users className="mx-auto text-cyan-500 mb-4" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Affiliate Program</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Partner with Hylono and earn commissions by sharing bio-optimization technology
                        with your audience. Join health professionals, influencers, and wellness advocates.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl p-6 text-center shadow-sm"
                        >
                            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                                {b.icon}
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{b.title}</h3>
                            <p className="text-xs text-slate-500">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {[
                            { step: '1', title: 'Apply', desc: 'Fill out the form below' },
                            { step: '2', title: 'Get Approved', desc: 'We review within 48h' },
                            { step: '3', title: 'Share', desc: 'Get your unique links' },
                            { step: '4', title: 'Earn', desc: 'Receive monthly payouts' },
                        ].map((s, i) => (
                            <div key={s.step} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                                    {s.step}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{s.title}</p>
                                    <p className="text-sm text-slate-500">{s.desc}</p>
                                </div>
                                {i < 3 && <ArrowRight className="text-slate-300 hidden md:block" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Form */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
                    {submitted ? (
                        <div className="text-center py-8">
                            <CheckCircle className="mx-auto text-emerald-400 mb-4" size={48} />
                            <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
                            <p className="text-slate-300">We'll review your application and get back to you within 48 hours.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-center">Apply Now</h2>
                            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                                <input aria-label="Full Name" placeholder="Full Name" required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/50 focus:border-cyan-400 focus:outline-none" />
                                <input aria-label="Email" placeholder="Email" type="email" required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/50 focus:border-cyan-400 focus:outline-none" />
                                <input aria-label="Website or Social Media URL" placeholder="Website / Social Media URL" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/50 focus:border-cyan-400 focus:outline-none" />
                                <select aria-label="Audience Size" required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/70 focus:border-cyan-400 focus:outline-none">
                                    <option value="">Audience Size</option>
                                    <option>Under 1,000</option>
                                    <option>1,000 - 10,000</option>
                                    <option>10,000 - 100,000</option>
                                    <option>100,000+</option>
                                </select>
                                <textarea aria-label="Tell us about your audience" placeholder="Tell us about your audience..." rows={4} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/50 focus:border-cyan-400 focus:outline-none resize-none" />
                                <button type="submit" className="w-full py-4 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-400 transition-colors">
                                    Submit Application
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

