/**
 * TechHero
 * Hero section for technology product pages (HBOT, PEMF, RLT, Hydrogen).
 * 
 * Features:
 *  - Dynamic hero title and tagline based on tech type
 *  - Smart configuration selector for HBOT (shows all chambers)
 *  - Price block (Purchase + Rental)
 *  - CTAs (Order, Book Demo)
 *  - Trust badges
 *  - Hardware Profile floating card
 *  - Image display instead of icon circle for HBOT
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft, ArrowRight, Calendar, Shield, CheckCircle, Phone, ShoppingBag,
    ChevronDown, Users, Maximize2, Wind, Sun, Droplets, Activity,
} from 'lucide-react';
import { TechData, TechType, ChamberProduct } from '../../../types';
import { ALL_CHAMBERS } from '../../../constants/chambers';
import { OptimizedImage } from '../../shared/OptimizedImage';

// ─── Tech Type Config ────────────────────────────────────────────────────────

const TECH_CONFIG: {
    type: TechType;
    title: string;
    tagline: string;
    icon: React.ReactNode;
    iconBg: string;
}[] = [
    {
        type: TechType.HBOT,
        title: 'mHBOT',
        tagline: 'Bio-Available Oxygen & Pressure',
        icon: <Wind size={28} />,
        iconBg: 'bg-cyan-500',
    },
    {
        type: TechType.PEMF,
        title: 'PEMF',
        tagline: 'Pulsed Electromagnetic Field Therapy',
        icon: <Activity size={28} />,
        iconBg: 'bg-purple-500',
    },
    {
        type: TechType.RLT,
        title: 'Red Light',
        tagline: 'Photobiomodulation Therapy',
        icon: <Sun size={28} />,
        iconBg: 'bg-red-500',
    },
    {
        type: TechType.HYDROGEN,
        title: 'Hydrogen',
        tagline: 'Molecular Hydrogen Therapy',
        icon: <Droplets size={28} />,
        iconBg: 'bg-sky-500',
    },
];

// Placeholder images for chamber types
const PLACEHOLDER_IMAGES: Record<string, string> = {
    monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80',
    multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80',
    soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=900&q=80',
};

interface TechHeroProps {
    data: TechData;
    onBack: () => void;
    onNavigate?: (path: string) => void;
}

export const TechHero: React.FC<TechHeroProps> = ({
    data,
    onBack,
    onNavigate,
}) => {
    const [selectedChamberId, setSelectedChamberId] = useState<string | null>(null);
    const [expandedTypes, setExpandedTypes] = useState<string[]>(['monoplace']);

    // Get config for this tech type
    const defaultTechConfig = TECH_CONFIG[0] ?? {
        type: data.id,
        title: 'Technology',
        tagline: 'Performance wellness systems',
        icon: <Activity size={28} />,
        iconBg: 'bg-cyan-500',
    };
    const techConfig = TECH_CONFIG.find(t => t.type === data.id) ?? defaultTechConfig;

    // For HBOT, get all chambers grouped by type
    const chambersByType = useMemo(() => {
        if (data.id !== TechType.HBOT) return null;
        return {
            monoplace: ALL_CHAMBERS.filter(c => c.type === 'monoplace'),
            multiplace: ALL_CHAMBERS.filter(c => c.type === 'multiplace'),
            soft: ALL_CHAMBERS.filter(c => c.type === 'soft'),
        };
    }, [data.id]);

    // Get selected chamber
    const selectedChamber = useMemo(() => {
        if (!selectedChamberId || !chambersByType) return null;
        return ALL_CHAMBERS.find(c => c.id === selectedChamberId);
    }, [selectedChamberId, chambersByType]);

    // Get hero image
    const heroImage = selectedChamber 
        ? (selectedChamber.images.find(i => i.role === 'hero')?.url || PLACEHOLDER_IMAGES[selectedChamber.type])
        : null;

    // Toggle type expansion
    const toggleType = (type: string) => {
        setExpandedTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    // Get display price
    const buyPrice = selectedChamber?.pricing.buy;
    const rentPrice = selectedChamber?.pricing.rent?.monthly;

    // Type labels for chamber selector
    const TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
        monoplace: { label: 'Monoplace', icon: <Maximize2 size={14} /> },
        multiplace: { label: 'Multiplace', icon: <Users size={14} /> },
        soft: { label: 'Soft Chamber', icon: <Wind size={14} /> },
    };

    return (
        <section className={`relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-white`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* LEFT: Visual */}
                    <div className="relative">
                        {selectedChamber && heroImage ? (
                            // Show chamber image for HBOT
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedChamber.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative aspect-[4/3] bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/5 group"
                                >
                                    <OptimizedImage
                                        src={heroImage}
                                        alt={selectedChamber.fullName}
                                        fallbackSrc={PLACEHOLDER_IMAGES[selectedChamber.type]}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
                                    
                                    {/* Brand badge */}
                                    <div className="absolute top-6 left-6">
                                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                                            selectedChamber.brand === 'oxyhelp' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-slate-700 text-white'
                                        }`}>
                                            {selectedChamber.brand === 'oxyhelp' ? 'EU MADE' : 'VALUE SERIES'}
                                        </span>
                                    </div>

                                    {/* Chamber name overlay */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">
                                            {selectedChamber.brandLabel}
                                        </p>
                                        <h4 className="text-2xl font-black text-white italic tracking-tight">
                                            {selectedChamber.fullName}
                                        </h4>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            // Show icon circle for non-HBOT or when no chamber selected
                            <div className="flex items-center justify-center">
                                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-white to-slate-100 shadow-2xl shadow-slate-200/50 flex items-center justify-center border border-slate-100">
                                    <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${data.accentColor} flex items-center justify-center text-white shadow-xl`}>
                                        {techConfig.icon}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hardware Profile Card - Floating (only when chamber selected) */}
                        {selectedChamber && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute -bottom-8 -right-4 lg:-right-8 w-72 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl hidden lg:block"
                            >
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">
                                    Hardware Profile
                                </p>
                                <div className="space-y-3">
                                    {selectedChamber.specifications.slice(0, 4).map((spec, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                            <span className="text-xs text-slate-400 font-medium">{spec.label}</span>
                                            <span className="text-xs text-white font-bold">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* RIGHT: Product Info & Selector */}
                    <div className="lg:sticky lg:top-32">
                        {/* Badges */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[11px] bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle size={10} /> CE Marked
                            </span>
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                HSA/FSA
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-none">
                            {techConfig.title}
                        </h1>
                        <p className="text-xl text-slate-500 font-light mb-8 leading-relaxed">
                            {techConfig.tagline}
                        </p>

                        {/* Chamber Configuration Selector (HBOT only) */}
                        {chambersByType && (
                            <div className="mb-8">
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                    Select Configuration
                                </p>
                                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    {Object.entries(chambersByType).map(([type, chambers]) => {
                                        if (chambers.length === 0) return null;
                                        
                                        const isExpanded = expandedTypes.includes(type);
                                        const typeMeta = TYPE_LABELS[type] ?? {
                                            label: type,
                                            icon: <Activity size={14} />,
                                        };
                                        
                                        return (
                                            <div key={type} className="border-b border-slate-100 last:border-0">
                                                {/* Type Header */}
                                                <button
                                                    onClick={() => toggleType(type)}
                                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                            type === 'monoplace' ? 'bg-blue-100 text-blue-600' :
                                                            type === 'multiplace' ? 'bg-violet-100 text-violet-600' :
                                                            'bg-teal-100 text-teal-600'
                                                        }`}>
                                                            {typeMeta.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="text-sm font-bold text-slate-900">{typeMeta.label}</span>
                                                            <span className="text-xs text-slate-400 ml-2">({chambers.length})</span>
                                                        </div>
                                                    </div>
                                                    <ChevronDown 
                                                        size={16} 
                                                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                                    />
                                                </button>

                                                {/* Chamber Options */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden bg-slate-50/50"
                                                        >
                                                            <div className="px-5 pb-4 pt-1 space-y-1.5">
                                                                {chambers.map((ch) => (
                                                                    <button
                                                                        key={ch.id}
                                                                        onClick={() => setSelectedChamberId(ch.id)}
                                                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                                                                            selectedChamberId === ch.id
                                                                                ? 'bg-slate-900 text-white shadow-md'
                                                                                : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                                            selectedChamberId === ch.id
                                                                                ? 'border-white bg-white'
                                                                                : 'border-slate-300'
                                                                        }`}>
                                                                            {selectedChamberId === ch.id && (
                                                                                <div className="w-3 h-3 rounded-full bg-slate-900" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className="text-sm font-semibold truncate block">
                                                                                {ch.fullName}
                                                                            </span>
                                                                        </div>
                                                                        {ch.brand === 'oxyhelp' && (
                                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                                selectedChamberId === ch.id
                                                                                    ? 'bg-blue-500 text-white'
                                                                                    : 'bg-blue-100 text-blue-600'
                                                                            }`}>
                                                                                EU
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Price Block */}
                        <div className="flex items-end gap-8 mb-8">
                            <div>
                                {selectedChamber ? (
                                    buyPrice ? (
                                        <>
                                            <span className="text-3xl font-black text-slate-900">
                                                €{buyPrice.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-slate-400 ml-2 uppercase font-bold tracking-tighter">
                                                Purchase
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl font-bold text-slate-700">Contact for Price</span>
                                            <p className="text-xs text-slate-400 mt-0.5">Request a personalised quote</p>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <span className="text-4xl font-black text-slate-900">{data.price}</span>
                                        <span className="text-sm text-slate-400 ml-2">one-time</span>
                                    </>
                                )}
                            </div>
                            {selectedChamber ? (
                                rentPrice && (
                                    <div className="border-l border-slate-200 pl-6">
                                        <span className="text-sm text-slate-400 block uppercase font-bold tracking-tighter mb-1">
                                            Rental
                                        </span>
                                        <span className="text-xl font-bold text-blue-600">
                                            €{rentPrice.toLocaleString()}/mo
                                        </span>
                                    </div>
                                )
                            ) : (
                                data.rentalPrice && (
                                    <div className="border-l border-slate-200 pl-6">
                                        <span className="text-sm text-slate-400 block">or rent from</span>
                                        <span className="text-xl font-bold text-cyan-600">${data.rentalPrice}/mo</span>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Primary CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <button
                                onClick={() => onNavigate?.('store')}
                                className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                            >
                                <ShoppingBag size={16} /> 
                                {selectedChamber ? `Order ${selectedChamber.fullName}` : 'Order Now'}
                                <ArrowRight size={16} />
                            </button>
                            <button 
                                onClick={() => onNavigate?.('contact')}
                                className="flex-1 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-slate-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <Calendar size={16} /> Book Demo
                            </button>
                        </div>

                        {/* Trust Line */}
                        <div className="grid grid-cols-3 gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-emerald-500" />
                                <span>5-Year Warranty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span>30-Day Returns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-emerald-500" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Hardware Profile */}
            {selectedChamber && (
                <div className="lg:hidden max-w-7xl mx-auto px-6 mt-12">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">
                            Hardware Profile
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {selectedChamber.specifications.slice(0, 6).map((spec, i) => (
                                <div key={i} className="space-y-0.5">
                                    <p className="text-xs text-slate-400 font-medium">{spec.label}</p>
                                    <p className="text-sm font-bold text-white">{spec.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};