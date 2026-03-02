/**
 * ChamberHero
 * Hero section for HBOT chamber product pages.
 * 
 * Features:
 *  - Chamber image display (replaces Performance Matrix)
 *  - Smart configuration selector - grouped by type, collapsible
 *  - Price block (Purchase + Rental)
 *  - CTAs (Order, Book Demo)
 *  - Trust badges
 *  - Hardware Profile floating card
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft, ArrowRight, Calendar, Shield, CheckCircle, Phone, ShoppingBag,
    ChevronDown, ChevronRight, Users, Maximize2, Wind,
} from 'lucide-react';
import { ChamberProduct, ChamberType } from '../../../types';
import { ALL_CHAMBERS, getChambersByType } from '../../../constants/chambers';
import { OptimizedImage } from '../../shared/OptimizedImage';

// ─── Type Group Config ────────────────────────────────────────────────────────

const TYPE_CONFIG: {
    type: ChamberType;
    label: string;
    icon: React.ReactNode;
    description: string;
}[] = [
    {
        type: 'monoplace',
        label: 'Monoplace',
        icon: <Maximize2 size={14} />,
        description: 'Solo hard-shell chambers',
    },
    {
        type: 'multiplace',
        label: 'Multiplace',
        icon: <Users size={14} />,
        description: 'Group chambers (2–5 users)',
    },
    {
        type: 'soft',
        label: 'Soft Chamber',
        icon: <Wind size={14} />,
        description: 'Portable home chambers',
    },
];

const PLACEHOLDER_IMAGES: Record<ChamberType, string> = {
    monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80',
    multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80',
    soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=900&q=80',
};

interface ChamberHeroProps {
    chamber: ChamberProduct;
    onBack: () => void;
    onSelectChamber: (slug: string) => void;
    onBookDemo?: () => void;
}

export const ChamberHero: React.FC<ChamberHeroProps> = ({
    chamber,
    onBack,
    onSelectChamber,
    onBookDemo,
}) => {
    const [selectedChamberId, setSelectedChamberId] = useState<string>(chamber.id);
    const [expandedTypes, setExpandedTypes] = useState<ChamberType[]>([chamber.type]);

    // Get the currently selected chamber
    const selectedChamber = useMemo(() => {
        return ALL_CHAMBERS.find(c => c.id === selectedChamberId) || chamber;
    }, [selectedChamberId, chamber]);

    // Group chambers by type
    const chambersByType = useMemo(() => {
        return {
            monoplace: ALL_CHAMBERS.filter(c => c.type === 'monoplace'),
            multiplace: ALL_CHAMBERS.filter(c => c.type === 'multiplace'),
            soft: ALL_CHAMBERS.filter(c => c.type === 'soft'),
        };
    }, []);

    // Get hero image
    const heroImage = selectedChamber.images.find(i => i.role === 'hero')?.url 
        || PLACEHOLDER_IMAGES[selectedChamber.type];

    // Toggle type expansion
    const toggleType = (type: ChamberType) => {
        setExpandedTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    // Handle chamber selection
    const handleSelectChamber = (chamberId: string) => {
        setSelectedChamberId(chamberId);
        const newChamber = ALL_CHAMBERS.find(c => c.id === chamberId);
        if (newChamber && newChamber.slug !== chamber.slug) {
            onSelectChamber(newChamber.slug);
        }
    };

    // Get display price
    const buyPrice = selectedChamber.pricing.buy;
    const rentPrice = selectedChamber.pricing.rent?.monthly;

    // Brand styling
    return (
        <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
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
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Chambers</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* LEFT: Chamber Image */}
                    <div className="relative">
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

                        {/* Hardware Profile Card - Floating */}
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
                    </div>

                    {/* RIGHT: Product Info & Selector */}
                    <div className="lg:sticky lg:top-32">
                        {/* Badges */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[11px] bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle size={10} /> FDA Cleared
                            </span>
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                HSA/FSA
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-none">
                            {selectedChamber.type === 'monoplace' ? 'mHBOT' : 
                             selectedChamber.type === 'multiplace' ? 'Multiplace HBOT' : 'Soft HBOT'}
                        </h1>
                        <p className="text-lg text-slate-500 font-light mb-8 leading-relaxed">
                            {selectedChamber.type === 'monoplace' 
                                ? 'Bio-Available Oxygen & Pressure' 
                                : selectedChamber.type === 'multiplace'
                                ? 'Group Therapy & Professional Use'
                                : 'Portable Home Wellness'}
                        </p>

                        {/* Configuration Selector */}
                        <div className="mb-8">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                Select Configuration
                            </p>
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                {TYPE_CONFIG.map((typeConfig) => {
                                    const typeChambers = chambersByType[typeConfig.type];
                                    if (typeChambers.length === 0) return null;
                                    
                                    const isExpanded = expandedTypes.includes(typeConfig.type);
                                    const isSelected = selectedChamber.type === typeConfig.type;
                                    
                                    return (
                                        <div key={typeConfig.type} className="border-b border-slate-100 last:border-0">
                                            {/* Type Header */}
                                            <button
                                                onClick={() => toggleType(typeConfig.type)}
                                                className={`w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors ${
                                                    isSelected ? 'bg-slate-50' : ''
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        typeConfig.type === 'monoplace' ? 'bg-blue-100 text-blue-600' :
                                                        typeConfig.type === 'multiplace' ? 'bg-violet-100 text-violet-600' :
                                                        'bg-teal-100 text-teal-600'
                                                    }`}>
                                                        {typeConfig.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="text-sm font-bold text-slate-900">{typeConfig.label}</span>
                                                        <span className="text-xs text-slate-400 ml-2">({typeChambers.length})</span>
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
                                                            {typeChambers.map((ch) => (
                                                                <button
                                                                    key={ch.id}
                                                                    onClick={() => handleSelectChamber(ch.id)}
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

                        {/* Price Block */}
                        <div className="flex items-end gap-8 mb-8">
                            <div>
                                {buyPrice ? (
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
                                )}
                            </div>
                            {rentPrice && (
                                <div className="border-l border-slate-200 pl-6">
                                    <span className="text-sm text-slate-400 block uppercase font-bold tracking-tighter mb-1">
                                        Rental
                                    </span>
                                    <span className="text-xl font-bold text-blue-600">
                                        €{rentPrice.toLocaleString()}/mo
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Primary CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <button
                                className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                            >
                                <ShoppingBag size={16} /> 
                                Order {selectedChamber.fullName}
                                <ArrowRight size={16} />
                            </button>
                            <button 
                                onClick={onBookDemo}
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
        </section>
    );
};
