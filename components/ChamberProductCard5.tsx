/**
 * ChamberProductCard5
 * Fresh redesign — horizontal dark glass card with premium feel.
 * Cinema-inspired aesthetic. Left: large image. Right: data.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    ArrowRight, Check, ShieldCheck, Users, Maximize2,
    Wind, Plus, Minus, BadgeCheck, Zap,
} from 'lucide-react';
import { ChamberProduct } from '../types';
import { OptimizedImage } from './shared/OptimizedImage';

interface ChamberProductCard5Props {
    chamber: ChamberProduct;
    onViewDetail: (slug: string) => void;
    onAddToCompare?: (chamber: ChamberProduct) => void;
    isInCompare?: boolean;
    preferredMode?: 'buy' | 'rent';
    index?: number;
}

const TYPE_CONFIG = {
    monoplace: {
        label: 'Monoplace',
        icon: <Maximize2 size={12} />,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10 border-cyan-400/20',
        glow: 'shadow-cyan-500/20',
    },
    multiplace: {
        label: 'Multiplace',
        icon: <Users size={12} />,
        color: 'text-violet-400',
        bg: 'bg-violet-400/10 border-violet-400/20',
        glow: 'shadow-violet-500/20',
    },
    soft: {
        label: 'Soft Chamber',
        icon: <Wind size={12} />,
        color: 'text-teal-400',
        bg: 'bg-teal-400/10 border-teal-400/20',
        glow: 'shadow-teal-500/20',
    },
} as const;

const BRAND_CONFIG = {
    oxyhelp: {
        accent: 'from-blue-500 to-cyan-400',
        bar: 'bg-gradient-to-r from-blue-500 to-cyan-400',
        ctaBg: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400',
        badge: 'EU MADE',
        badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    },
    'asian-series': {
        accent: 'from-slate-400 to-slate-300',
        bar: 'bg-gradient-to-r from-slate-500 to-slate-400',
        ctaBg: 'bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400',
        badge: 'VALUE',
        badgeColor: 'text-slate-400 bg-slate-400/10 border-slate-400/30',
    },
} as const;

const PLACEHOLDER_IMAGES = {
    monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=700&q=85',
    multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=85',
    soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=700&q=85',
};

export const ChamberProductCard5: React.FC<ChamberProductCard5Props> = ({
    chamber,
    onViewDetail,
    onAddToCompare,
    isInCompare = false,
    preferredMode = 'buy',
    index = 0,
}) => {
    const initialTab: 'buy' | 'rent' = chamber.transactionModes.includes(preferredMode)
        ? preferredMode
        : chamber.transactionModes[0] === 'rent'
          ? 'rent'
          : 'buy';

    const [activeTab, setActiveTab] = useState<'buy' | 'rent'>(
        initialTab
    );

    const brand = BRAND_CONFIG[chamber.brand];
    const typeConfig = TYPE_CONFIG[chamber.type];
    const heroImage = chamber.images.find((i) => i.role === 'hero')?.url || PLACEHOLDER_IMAGES[chamber.type];
    const hasBoth = chamber.transactionModes.includes('buy') && chamber.transactionModes.includes('rent');
    const topSpecs = chamber.specifications.slice(0, 4);

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className={`group relative flex flex-col md:flex-row bg-slate-900/80 backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all duration-500 hover:shadow-2xl hover:${typeConfig.glow}`}
            aria-label={chamber.fullName}
        >
            {/* Gradient accent line top */}
            <div className={`absolute top-0 left-0 right-0 h-px ${brand.bar} opacity-60`} />

            {/* Left: Image */}
            <div className="relative md:w-72 lg:w-80 shrink-0 overflow-hidden h-56 md:h-auto">
                <OptimizedImage
                    src={heroImage}
                    alt={chamber.fullName}
                    fallbackSrc={PLACEHOLDER_IMAGES[chamber.type]}
                    width={960}
                    height={640}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/60 md:to-slate-900/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                {/* Type badge */}
                <div className="absolute top-4 left-4">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${typeConfig.bg} ${typeConfig.color}`}>
                        {typeConfig.icon}
                        {typeConfig.label}
                    </span>
                </div>

                {/* Brand badge */}
                <div className="absolute bottom-4 left-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${brand.badgeColor}`}>
                        {brand.badge}
                    </span>
                </div>

                {/* Compare toggle */}
                {onAddToCompare && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCompare(chamber); }}
                        aria-pressed={isInCompare}
                        className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border backdrop-blur-sm transition-all ${
                            isInCompare
                                ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-300'
                                : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20 hover:text-white'
                        }`}
                    >
                        {isInCompare ? <Minus size={11} /> : <Plus size={11} />}
                        {isInCompare ? 'Added' : 'Compare'}
                    </button>
                )}
            </div>

            {/* Right: Content */}
            <div className="flex flex-col flex-1 p-6 lg:p-7">
                {/* Header */}
                <div className="mb-4">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-1">
                        {chamber.brandLabel}
                    </p>
                    <h3 className="text-xl font-bold text-white leading-tight mb-1">
                        {chamber.fullName}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                        {chamber.shortDescription}
                    </p>
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-5">
                    {chamber.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={10} className="text-emerald-400" />
                            </div>
                            <span className="text-xs text-slate-300 leading-snug">{h}</span>
                        </li>
                    ))}
                </ul>

                {/* Specs grid */}
                {topSpecs.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        {topSpecs.map((spec, i) => (
                            <div key={i} className="space-y-0.5">
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide leading-none">{spec.label}</p>
                                <p className="text-xs font-bold text-slate-200 leading-snug">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {chamber.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                        {chamber.certifications.slice(0, 2).map((cert, i) => (
                            <span key={i} className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400">
                                <ShieldCheck size={10} className="text-emerald-400" />
                                {cert}
                            </span>
                        ))}
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Pricing + CTA */}
                <div className="pt-4 border-t border-white/[0.06]">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div>
                            {/* Buy/Rent mini toggle */}
                            {hasBoth && (
                                <div className="flex rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden text-[10px] font-semibold mb-2 w-fit">
                                    {(['buy', 'rent'] as const).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setActiveTab(m)}
                                            className={`px-3 py-1.5 transition-colors ${
                                                activeTab === m ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                        >
                                            {m === 'buy' ? 'Purchase' : 'Rental'}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Price */}
                            {activeTab === 'buy' ? (
                                chamber.pricing.buy ? (
                                    <p className="text-2xl font-bold text-white">
                                        €{chamber.pricing.buy.toLocaleString()}
                                    </p>
                                ) : (
                                    <div>
                                        <p className="text-sm font-bold text-slate-300">Contact for pricing</p>
                                        <p className="text-xs text-slate-500">Custom quote within 24h</p>
                                    </div>
                                )
                            ) : (
                                chamber.pricing.rent?.monthly ? (
                                    <div>
                                        <span className="text-2xl font-bold text-white">€{chamber.pricing.rent.monthly.toLocaleString()}</span>
                                        <span className="text-xs text-slate-400 ml-1">/mo</span>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-bold text-slate-300">Rental available</p>
                                        <p className="text-xs text-slate-500">Contact for terms</p>
                                    </div>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => onViewDetail(chamber.slug)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg ${brand.ctaBg}`}
                            aria-label={`View ${chamber.fullName} details`}
                        >
                            Explore
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};
