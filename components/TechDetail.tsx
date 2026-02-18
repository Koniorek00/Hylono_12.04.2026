import React, { useState, useEffect } from 'react';
import { TechData, ViewMode, TechType } from '../types';
import { HbotVisual, PemfVisual, RltVisual, HydrogenVisual } from './Visualizations';
import { ArrowLeft, ArrowRight, Play, CheckCircle, Shield, Zap, Brain, Activity, Wind, Sun, Droplets, Sparkles, ChevronDown, ChevronUp, Clock, AlertTriangle, Calendar, Phone, Star, Quote } from 'lucide-react';
import { SmartText } from './SmartText';
import { motion, AnimatePresence } from 'framer-motion';
import { useTech } from '../hooks/useTech';
import { ProductStructuredData, BreadcrumbStructuredData } from './StructuredData';
import { TechAddons } from './product/detail/TechAddons';
import { TechResources } from './product/detail/TechResources';

interface TechDetailProps {
    techId: TechType;
    onBack: () => void;
    onJumpToTech: (id: TechType) => void;
    ownedTech?: TechType[];
}

const TECH_ICONS: Record<TechType, React.ReactNode> = {
    [TechType.HBOT]: <Wind size={32} />,
    [TechType.PEMF]: <Activity size={32} />,
    [TechType.RLT]: <Sun size={32} />,
    [TechType.HYDROGEN]: <Droplets size={32} />
};

const TECH_GRADIENTS: Record<TechType, string> = {
    [TechType.HBOT]: "from-cyan-500/10 via-blue-500/5 to-white",
    [TechType.PEMF]: "from-purple-500/10 via-fuchsia-500/5 to-white",
    [TechType.RLT]: "from-red-500/10 via-orange-500/5 to-white",
    [TechType.HYDROGEN]: "from-sky-500/10 via-teal-500/5 to-white"
};

export const TechDetail: React.FC<TechDetailProps> = ({ techId, onBack, onJumpToTech, ownedTech = [] }) => {
    const { getTechDetails, getTechKnowledge } = useTech();
    const data = getTechDetails(techId);
    const knowledge = getTechKnowledge(techId);
    const [mode, setMode] = useState<ViewMode>(ViewMode.STANDARD);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [showSafety, setShowSafety] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const isExpert = mode === ViewMode.EXPERT;
    const gradientClass = TECH_GRADIENTS[data.id];

    // Sync ViewMode with URL
    useEffect(() => {
        const syncUrlState = () => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('view') === 'science') setMode(ViewMode.EXPERT);
            else setMode(ViewMode.STANDARD);
        };

        syncUrlState();
        window.addEventListener('popstate', syncUrlState);
        return () => window.removeEventListener('popstate', syncUrlState);
    }, [techId]);

    const toggleMode = (newMode: ViewMode) => {
        setMode(newMode);
        const params = new URLSearchParams(window.location.search);
        if (newMode === ViewMode.EXPERT) params.set('view', 'science');
        else params.delete('view');
        window.history.pushState(null, '', window.location.pathname + '?' + params.toString());
    };

    return (
        <div className="min-h-screen bg-white">
            {/* JSON-LD Structured Data for SEO */}
            <ProductStructuredData techId={techId} />
            <BreadcrumbStructuredData items={[
                { name: 'Home', url: 'https://hylono.com/' },
                { name: 'Store', url: 'https://hylono.com/store' },
                { name: data.name, url: `https://hylono.com/product/${techId}` }
            ]} />

            {/* === HERO SECTION === */}
            <section className={`relative pt-28 pb-20 overflow-hidden bg-gradient-to-b ${gradientClass}`}>
                {/* Background Visual */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    {data.id === TechType.HBOT && <HbotVisual />}
                    {data.id === TechType.PEMF && <PemfVisual />}
                    {data.id === TechType.RLT && <RltVisual />}
                    {data.id === TechType.HYDROGEN && <HydrogenVisual />}
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* LEFT: Product Info */}
                        <div>
                            {/* Badges */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle size={10} /> FDA Cleared
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">HSA/FSA</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-none">
                                {data.name}
                            </h1>
                            <p className="text-xl text-slate-500 font-light mb-8 leading-relaxed">
                                {data.tagline}
                            </p>

                            {/* Price Block */}
                            <div className="flex items-end gap-6 mb-8">
                                <div>
                                    <span className="text-4xl font-black text-slate-900">{data.price}</span>
                                    <span className="text-sm text-slate-400 ml-2">one-time</span>
                                </div>
                                <div className="border-l border-slate-200 pl-6">
                                    <span className="text-sm text-slate-400 block">or rent from</span>
                                    <span className="text-xl font-bold text-cyan-600">${data.rentalPrice}/mo</span>
                                </div>
                            </div>

                            {/* Primary CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20">
                                    Order Now <ArrowRight size={18} />
                                </button>
                                <button className="flex-1 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-sm hover:border-slate-400 transition-all flex items-center justify-center gap-3">
                                    <Calendar size={18} /> Book Demo
                                </button>
                            </div>

                            {/* Trust Line */}
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span>5-Year Warranty</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>30-Day Returns</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-emerald-500" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Visual */}
                        <div className="flex items-center justify-center">
                            <div className={`w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-white to-slate-100 shadow-2xl shadow-slate-200/50 flex items-center justify-center border border-slate-100`}>
                                <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${data.accentColor} flex items-center justify-center text-white shadow-xl`}>
                                    {TECH_ICONS[data.id]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === DESCRIPTION with inline View Toggle === */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Inline Toggle */}
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">
                            {isExpert ? 'Mechanism of Action' : 'What It Does'}
                        </h2>
                        <div className="inline-flex bg-slate-100 p-1 rounded-full">
                            <button
                                onClick={() => toggleMode(ViewMode.STANDARD)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${!isExpert ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Simple
                            </button>
                            <button
                                onClick={() => toggleMode(ViewMode.EXPERT)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isExpert ? 'bg-cyan-500 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Science
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isExpert ? (
                            <motion.p
                                key="simple"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-xl text-slate-600 leading-relaxed"
                            >
                                <SmartText>{data.descriptionStandard}</SmartText>
                            </motion.p>
                        ) : (
                            <motion.div
                                key="science"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-slate-900 rounded-3xl p-8"
                            >
                                <p className="text-lg text-cyan-100/80 font-mono leading-relaxed mb-8">
                                    <SmartText>{data.descriptionExpert}</SmartText>
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    {data.technicalSpecs.map((spec) => (
                                        <div key={spec.label} className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
                                            <span className="text-[10px] uppercase tracking-wider text-cyan-400 block mb-1">{spec.label}</span>
                                            <span className="text-xl font-mono font-bold text-white">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Clinical Review Badge */}
                    {(data.lastReviewed || data.reviewedBy) && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-400">
                                {data.lastReviewed && (
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle size={12} className="text-emerald-500" />
                                        <span>
                                            Last clinically reviewed: {new Date(data.lastReviewed).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                                {data.reviewedBy && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="hidden sm:inline text-slate-300">|</span>
                                        <span>Reviewed by {data.reviewedBy}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* === BENEFITS === */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Key Benefits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {data.benefits.map((benefit) => (
                            <div
                                key={benefit}
                                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all"
                            >
                                <div className={`w-12 h-12 ${data.accentColor} rounded-xl flex items-center justify-center mx-auto mb-4 text-white`}>
                                    <Sparkles size={20} />
                                </div>
                                <span className="font-bold text-slate-900"><SmartText>{benefit}</SmartText></span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === SYNERGIES (Simplified Bar) === */}
            {data.synergies && data.synergies.length > 0 && (
                <section className="py-12 bg-slate-900">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <Sparkles className="text-cyan-400" size={24} />
                                <div>
                                    <h3 className="text-white font-bold text-lg">Pairs Well With</h3>
                                    <p className="text-slate-400 text-sm">Combine for enhanced results</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {data.synergies.slice(0, 2).map((syn) => (
                                    <button
                                        key={syn.targetId}
                                        onClick={() => onJumpToTech(syn.targetId)}
                                        className="flex items-center gap-3 px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-all group"
                                    >
                                        <div className={`w-10 h-10 ${getTechDetails(syn.targetId).accentColor} rounded-lg flex items-center justify-center text-white`}>
                                            {TECH_ICONS[syn.targetId]}
                                        </div>
                                        <div className="text-left">
                                            <span className="text-white font-bold block">{getTechDetails(syn.targetId).name}</span>
                                            <span className="text-emerald-400 text-xs font-bold">+{syn.boost}% synergy</span>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === SYSTEM ENHANCEMENTS === */}
            <TechAddons
                data={data}
                selectedAddons={selectedAddons}
                onToggleAddon={toggleAddon}
            />

            {/* === DEEP INTELLIGENCE === */}
            <TechResources data={data} />

            {/* === FAQ === */}
            {data.faqs && data.faqs.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
                        <div className="space-y-4">
                            {data.faqs.map((faq, idx) => (
                                <div key={faq.question} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                                    >
                                        <span className="font-bold text-slate-900">{faq.question}</span>
                                        {expandedFaq === idx ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
                                    </button>
                                    <AnimatePresence>
                                        {expandedFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 text-slate-600">
                                                    <SmartText>{faq.answer}</SmartText>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* === SAFETY (Collapsible) === */}
            <section className="py-12 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <button
                        onClick={() => setShowSafety(!showSafety)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <Shield size={20} />
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-slate-900 block">Safety & Compliance</span>
                                <span className="text-xs text-slate-500">FDA clearance, contraindications, and verified claims</span>
                            </div>
                        </div>
                        {showSafety ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                    </button>

                    <AnimatePresence>
                        {showSafety && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
                                    {/* Approved Claims */}
                                    {knowledge && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-500" /> Verified Claims
                                            </h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {knowledge.approvedClaims.map((claim) => (
                                                    <li key={claim} className="text-sm text-slate-600 flex items-start gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                                        {claim}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Contraindications */}
                                    {data.contraindications && data.contraindications.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-amber-500" /> Important Safety Info
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {data.contraindications.slice(0, 4).map((ci) => (
                                                    <div key={ci.condition} className={`p-3 rounded-lg text-xs ${ci.status === 'safe' ? 'bg-emerald-50 text-emerald-700' :
                                                        ci.status === 'caution' ? 'bg-amber-50 text-amber-700' :
                                                            'bg-red-50 text-red-700'
                                                        }`}>
                                                        <span className="font-bold block">{ci.condition}</span>
                                                        <span className="opacity-80">{ci.reason}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Disclaimer */}
                                    <p className="text-[10px] text-slate-400 italic leading-relaxed">
                                        {knowledge?.disclaimers[0] || 'Consult your physician before beginning any new health program. This device is not intended to diagnose, treat, cure, or prevent any disease.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* === STICKY CTA BAR === */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 py-4 px-6 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-2xl font-bold text-slate-900">{data.name}</span>
                        <span className="text-xl text-slate-300">|</span>
                        <span className="text-2xl font-bold text-slate-900">{data.price}</span>
                        <span className="text-sm text-cyan-600 font-bold">or {data.financing}</span>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg">
                            Order Now <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom padding for sticky bar */}
            <div className="h-24"></div>
        </div>
    );
};
