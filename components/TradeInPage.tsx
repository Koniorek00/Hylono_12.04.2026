import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle, Upload } from 'lucide-react';
import { NavigateFunction } from '../types';
import { tradeInContent } from '../content/tradeIn';
import { FeatureGate } from './FeatureGate';

interface TradeInPageProps {
    onNavigate: NavigateFunction;
}

const LegacyTradeInFallback: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => (
    <div className="min-h-screen bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4 futuristic-font">Trade-In Programme</h1>
            <p className="text-slate-600 mb-8">Enhanced valuation form is currently being prepared.</p>
            <button onClick={() => onNavigate('contact')} className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold">
                Contact support
            </button>
        </div>
    </div>
);

const EnhancedTradeInPage: React.FC<TradeInPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();
    const [submitted, setSubmitted] = useState(false);
    const [category, setCategory] = useState<string>(tradeInContent.categories[0]?.value ?? '');
    const [brandModel, setBrandModel] = useState('');
    const [condition, setCondition] = useState<string>(tradeInContent.conditions[0]?.value ?? '');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [photosCount, setPhotosCount] = useState(0);

    const isValid = Boolean(category && condition && name.trim() && email.trim() && brandModel.trim());

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white py-24 px-6">
                <div className="max-w-xl mx-auto text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center mb-5">
                        <CheckCircle size={30} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3 futuristic-font">Request submitted</h1>
                    <p className="text-slate-600 mb-6">{tradeInContent.disclaimer}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={() => onNavigate('store')} className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold inline-flex items-center justify-center gap-2">
                            Browse products <ArrowRight size={14} />
                        </button>
                        <button onClick={() => onNavigate('rental')} className="min-h-11 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold">
                            Explore rental
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 futuristic-font">{tradeInContent.title}</h1>
                        <p className="text-slate-300 max-w-2xl mx-auto">{tradeInContent.subtitle}</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <form onSubmit={onSubmit} className="space-y-8" aria-label="Trade-in valuation form">
                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">What device do you want to trade in?</legend>
                            <div className="space-y-2">
                                {tradeInContent.categories.map((item) => (
                                    <label key={item.value} className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="trade-category"
                                            className="mt-1 accent-cyan-600"
                                            checked={category === item.value}
                                            onChange={() => setCategory(item.value)}
                                        />
                                        <span className="text-sm text-slate-700">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                            <label htmlFor="brand-model" className="text-sm font-semibold text-slate-700 block mt-4 mb-2">Brand and model</label>
                            <input
                                id="brand-model"
                                value={brandModel}
                                onChange={(event) => setBrandModel(event.target.value)}
                                className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                placeholder="Example: Brand X / Model Y"
                                required
                            />
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">What condition is it in?</legend>
                            <div className="space-y-2">
                                {tradeInContent.conditions.map((item) => (
                                    <label key={item.value} className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="trade-condition"
                                            className="mt-1 accent-cyan-600"
                                            checked={condition === item.value}
                                            onChange={() => setCondition(item.value)}
                                        />
                                        <span className="text-sm text-slate-700">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">Photos (optional)</legend>
                            <label htmlFor="trade-photos" className="min-h-11 rounded-2xl border border-dashed border-slate-300 px-4 py-4 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <Upload size={16} />
                                Upload up to 5 photos
                            </label>
                            <input
                                id="trade-photos"
                                type="file"
                                accept="image/*"
                                multiple
                                className="sr-only"
                                onChange={(event) => {
                                    const total = Math.min(event.target.files?.length ?? 0, 5);
                                    setPhotosCount(total);
                                }}
                            />
                            {photosCount > 0 && <p className="text-xs text-slate-500 mt-2">Selected files: {photosCount}</p>}
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">Contact information</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="trade-name" className="text-sm font-semibold text-slate-700 block mb-2">Name</label>
                                    <input
                                        id="trade-name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="trade-email" className="text-sm font-semibold text-slate-700 block mb-2">Email</label>
                                    <input
                                        id="trade-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                        required
                                    />
                                </div>
                            </div>
                            <label htmlFor="trade-phone" className="text-sm font-semibold text-slate-700 block mt-4 mb-2">Phone</label>
                            <input
                                id="trade-phone"
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                            />
                        </fieldset>

                        <button
                            type="submit"
                            className="w-full min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isValid}
                        >
                            {tradeInContent.submitLabel}
                        </button>

                        <p className="text-sm text-slate-500">{tradeInContent.disclaimer}</p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export const TradeInPage: React.FC<TradeInPageProps> = ({ onNavigate }) => {
    return (
        <FeatureGate flag="feature_tradein_page" fallback={<LegacyTradeInFallback onNavigate={onNavigate} />}>
            <EnhancedTradeInPage onNavigate={onNavigate} />
        </FeatureGate>
    );
};
