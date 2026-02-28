/**
 * ChamberProductCard
 * Individual product card for the HBOT chamber catalog.
 * Shows brand badge, key specs, highlights, and dual buy/rent CTAs.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, ShieldCheck, Zap, Users, Maximize2, Weight, Plus } from 'lucide-react';
import { ChamberProduct } from '../types';
import { OptimizedImage } from './shared/OptimizedImage';

interface ChamberProductCardProps {
    chamber: ChamberProduct;
    onViewDetail: (slug: string) => void;
    onAddToCompare?: (chamber: ChamberProduct) => void;
    isInCompare?: boolean;
    preferredMode?: 'buy' | 'rent';
}

// Brand badge config
const BRAND_CONFIG = {
    oxyhelp: {
        label: 'OxyHelp',
        badge: 'EU MADE',
        badgeClass: 'bg-blue-600 text-white',
        cardBorder: 'border-blue-100 hover:border-blue-300',
        accentBar: 'bg-gradient-to-r from-blue-600 to-blue-400',
        tagClass: 'bg-blue-50 text-blue-700 border border-blue-100',
        ctaBuy: 'bg-blue-600 hover:bg-blue-700 text-white',
        ctaRent: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    },
    'asian-series': {
        label: 'Standard Series',
        badge: 'VALUE SERIES',
        badgeClass: 'bg-slate-600 text-white',
        cardBorder: 'border-slate-200 hover:border-slate-300',
        accentBar: 'bg-gradient-to-r from-slate-500 to-slate-400',
        tagClass: 'bg-slate-50 text-slate-600 border border-slate-200',
        ctaBuy: 'bg-slate-700 hover:bg-slate-800 text-white',
        ctaRent: 'border border-slate-600 text-slate-600 hover:bg-slate-50',
    },
} as const;

const TYPE_CONFIG = {
    monoplace: { label: 'Monoplace', icon: <Maximize2 size={14} />, color: 'bg-cyan-50 text-cyan-700' },
    multiplace: { label: 'Multiplace', icon: <Users size={14} />, color: 'bg-violet-50 text-violet-700' },
    soft: { label: 'Soft Chamber', icon: <Zap size={14} />, color: 'bg-teal-50 text-teal-700' },
} as const;

// Placeholder image per type when no image URL provided
const PLACEHOLDER_IMAGES = {
    monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80',
    multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=600&q=80',
};

export const ChamberProductCard: React.FC<ChamberProductCardProps> = ({
    chamber,
    onViewDetail,
    onAddToCompare,
    isInCompare = false,
    preferredMode = 'buy',
}) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'rent'>(
        chamber.transactionModes.includes(preferredMode) ? preferredMode : chamber.transactionModes[0]
    );

    const brand = BRAND_CONFIG[chamber.brand];
    const typeConfig = TYPE_CONFIG[chamber.type];
    const heroImage = chamber.images.find((i) => i.role === 'hero')?.url || PLACEHOLDER_IMAGES[chamber.type];

    const hasBoth = chamber.transactionModes.includes('buy') && chamber.transactionModes.includes('rent');

    // Key specs to show on card — pick up to 3 most informative
    const cardSpecs = chamber.specifications.slice(0, 3);

    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
            className={`relative flex flex-col bg-white rounded-2xl border ${brand.cardBorder} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`}
            aria-label={`${chamber.fullName} — ${chamber.shortDescription.slice(0, 80)}`}
        >
            {/* Accent bar */}
            <div className={`h-1 w-full ${brand.accentBar}`} />

            {/* Image */}
            <div className="relative overflow-hidden h-52 bg-slate-50">
                <OptimizedImage
                    src={heroImage}
                    alt={chamber.images.find((i) => i.role === 'hero')?.alt || `${chamber.fullName} hyperbaric chamber`}
                    fallbackSrc={PLACEHOLDER_IMAGES[chamber.type]}
                    width={800}
                    height={208}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${brand.badgeClass}`}>
                        {brand.badge}
                    </span>
                    {chamber.type === 'soft' && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-500 text-white">
                            RENTAL AVAILABLE
                        </span>
                    )}
                </div>

                {/* Type chip */}
                <div className="absolute top-3 right-3">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${typeConfig.color}`}>
                        {typeConfig.icon}
                        {typeConfig.label}
                    </span>
                </div>

                {/* Compare toggle */}
                {onAddToCompare && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCompare(chamber);
                        }}
                        aria-pressed={isInCompare}
                        className={`absolute bottom-3 right-3 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                            isInCompare
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/90 text-slate-600 hover:bg-white hover:text-blue-600'
                        }`}
                    >
                        {isInCompare ? <Check size={12} /> : <Plus size={12} />}
                        {isInCompare ? 'Added' : 'Compare'}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                {/* Header */}
                <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {chamber.brandLabel}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-0.5">
                        {chamber.fullName}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {chamber.shortDescription}
                    </p>
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-4">
                    {chamber.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span className="leading-snug">{h}</span>
                        </li>
                    ))}
                </ul>

                {/* Key specs row */}
                {cardSpecs.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-slate-100">
                        {cardSpecs.map((spec, i) => (
                            <div key={i} className="text-center">
                                <p className="text-xs text-slate-400 leading-tight">{spec.label}</p>
                                <p className="text-xs font-semibold text-slate-700 leading-tight mt-0.5 truncate">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {chamber.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {chamber.certifications.slice(0, 2).map((cert, i) => (
                            <span key={i} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${brand.tagClass}`}>
                                <ShieldCheck size={11} />
                                {cert}
                            </span>
                        ))}
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Pricing / CTA */}
                <div className="pt-4 border-t border-slate-100">
                    {/* Buy/Rent toggle when both available */}
                    {hasBoth && (
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-3 text-xs font-medium">
                            <button
                                onClick={() => setActiveTab('buy')}
                                className={`flex-1 py-1.5 transition-colors ${
                                    activeTab === 'buy' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setActiveTab('rent')}
                                className={`flex-1 py-1.5 transition-colors ${
                                    activeTab === 'rent' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                Rent
                            </button>
                        </div>
                    )}

                    {/* Price display */}
                    <div className="mb-3">
                        {activeTab === 'buy' ? (
                            <div>
                                {chamber.pricing.buy ? (
                                    <p className="text-xl font-bold text-slate-900">
                                        €{chamber.pricing.buy.toLocaleString()}
                                    </p>
                                ) : (
                                    <p className="text-sm font-semibold text-slate-600">
                                        Contact for pricing
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                {chamber.pricing.rent?.monthly ? (
                                    <div>
                                        <span className="text-xl font-bold text-slate-900">
                                            €{chamber.pricing.rent.monthly.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-slate-400">/month</span>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Min. {chamber.pricing.rent.minimumMonths} months
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm font-semibold text-slate-600">
                                        Contact for rental pricing
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Primary CTA */}
                    <button
                        onClick={() => onViewDetail(chamber.slug)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            activeTab === 'buy' ? brand.ctaBuy : brand.ctaRent
                        }`}
                        aria-label={`View ${chamber.fullName} details`}
                    >
                        View Chamber
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </motion.article>
    );
};
