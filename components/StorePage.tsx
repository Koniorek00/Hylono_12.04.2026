import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RentalConfigurator } from './RentalConfigurator';
import { ArrowRight, Check, ShieldCheck, Truck, ChevronRight, Eye, Zap, Sparkles, Activity, Wind, Sun, Droplets, CheckCircle } from 'lucide-react';
import { useTech } from '../hooks/useTech';
import { TechData, TechType } from '../types';
import { analytics } from '../src/lib/analytics';

interface StorePageProps {
    onNavigate: (page: string) => void;
    onSelectTech: (tech: TechType) => void;
}

// Tech-specific icons for visual distinction
const TECH_ICONS: Record<TechType, React.ReactNode> = {
    [TechType.HBOT]: <Wind size={28} />,
    [TechType.PEMF]: <Activity size={28} />,
    [TechType.RLT]: <Sun size={28} />,
    [TechType.HYDROGEN]: <Droplets size={28} />
};

export const StorePage: React.FC<StorePageProps> = ({ onNavigate, onSelectTech }) => {
    const { allTech } = useTech();
    const [mode, setMode] = useState<'RENT' | 'BUY'>('BUY');
    const [hoveredCard, setHoveredCard] = useState<TechType | null>(null);

    const handleProductClick = React.useCallback((tech: TechData) => {
        // Track product viewed event
        analytics.productViewed(
            tech.id,
            tech.name,
            parseInt(tech.price.replace(/[^0-9]/g, ''))
        );
        onSelectTech(tech.id);
    }, [onSelectTech]);

    return (
        <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">

            {/* Hero Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
                >
                    <Sparkles size={12} /> Research-Grade Bio-Optimization
                </motion.div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 futuristic-font leading-tight">
                    Technology <span className="text-cyan-500">+</span> Protocol
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                    Every system includes expert-designed protocols and clinical support. Rent to experience, own to commit—either way, you get the complete Hylono ecosystem.
                </p>
            </div>

            {/* Mode Toggle - Refined */}
            <div className="flex justify-center mb-16">
                <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl relative shadow-inner">
                    <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white shadow-lg rounded-xl transition-all duration-500 ease-out ${mode === 'BUY' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'}`} />
                    <button
                        onClick={() => setMode('RENT')}
                        className={`relative z-10 px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${mode === 'RENT' ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                        Rent & Explore
                    </button>
                    <button
                        onClick={() => setMode('BUY')}
                        className={`relative z-10 px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${mode === 'BUY' ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                        Purchase
                    </button>
                </div>
            </div>

            {/* RENTAL MODE */}
            <AnimatePresence mode="wait">
                {mode === 'RENT' && (
                    <motion.div
                        key="rent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        <RentalConfigurator onNavigate={onNavigate} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                            {[
                                { icon: <Truck className="text-cyan-500" size={24} />, title: 'White Glove Delivery', desc: 'Professional installation and protocol onboarding included with every rental.' },
                                { icon: <ShieldCheck className="text-emerald-500" size={24} />, title: 'Full Coverage Warranty', desc: '100% parts, labor, and performance guarantee throughout your rental.' },
                                { icon: <ArrowRight className="text-purple-500" size={24} />, title: 'Equity Conversion', desc: 'Apply 50% of rental payments toward ownership. Your investment compounds.' },
                            ].map((item) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="mb-4">{item.icon}</div>
                                    <h3 className="font-bold text-lg mb-2 text-slate-900">{item.title}</h3>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* PURCHASE MODE - Premium Catalog */}
                {mode === 'BUY' && (
                    <motion.div
                        key="buy"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {allTech.map((tech, index) => (
                                <motion.div
                                    key={tech.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onMouseEnter={() => setHoveredCard(tech.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => handleProductClick(tech)}
                                    className={`group relative bg-white rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500
                                    ${hoveredCard === tech.id ? 'shadow-2xl shadow-cyan-500/10 scale-[1.02]' : 'shadow-lg hover:shadow-xl'}
                                `}
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${tech.id === TechType.HBOT ? 'from-cyan-500/5 to-blue-500/5' :
                                        tech.id === TechType.PEMF ? 'from-purple-500/5 to-indigo-500/5' :
                                            tech.id === TechType.RLT ? 'from-red-500/5 to-orange-500/5' :
                                                'from-sky-500/5 to-teal-500/5'
                                        }`} />

                                    <div className="relative z-10 p-8 sm:p-10">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-5">
                                                {/* Tech Icon */}
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${tech.accentColor} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                    {TECH_ICONS[tech.id]}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{tech.name}</h3>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-bold mt-1">{tech.tagline}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Benefits Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                            {tech.benefits.slice(0, 4).map((b) => (
                                                <div key={b} className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold block">{b}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-slate-100 pt-6" />

                                        {/* Footer: Price & Actions */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{tech.price}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">or</span>
                                                    <span className="text-xs text-cyan-600 font-bold">{tech.financing}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                {/* Explore CTA */}
                                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] group-hover:bg-cyan-500 transition-colors">
                                                    Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trust Markers Section */}
            <div className="mt-24 pt-12 border-t border-slate-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                    {[
                        { icon: <ShieldCheck size={20} />, text: "256-bit SSL Encryption" },
                        { icon: <Sparkles size={20} />, text: "Premium Build Quality" },
                        { icon: <Truck size={20} />, text: "Global Freight Logistics" },
                        { icon: <CheckCircle size={20} className="text-emerald-500" />, text: "Verified Compliance" }
                    ].map((badge) => (
                        <div key={badge.text} className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {badge.icon}
                            <span>{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
