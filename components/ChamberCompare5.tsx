/**
 * ChamberCompare5
 * Fresh redesign — dark frosted glass comparison table.
 * Floating compare dock + full immersive comparison modal.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Scale, Check, Minus, ChevronDown, ChevronUp, ArrowRight, SplitSquareHorizontal } from 'lucide-react';
import { ChamberProduct } from '../types';
import { OptimizedImage } from './shared/OptimizedImage';

interface ChamberCompare5Props {
    chambers: ChamberProduct[];
    onRemove: (id: string) => void;
    onClear: () => void;
    onNavigate: (slug: string) => void;
}

const COMPARISON_ROWS: { label: string; category: string; extractor: (c: ChamberProduct) => string }[] = [
    { category: 'Identity', label: 'Type', extractor: (c) => c.type.charAt(0).toUpperCase() + c.type.slice(1) },
    { category: 'Identity', label: 'Brand', extractor: (c) => c.brandLabel },
    { category: 'Identity', label: 'Variant', extractor: (c) => c.variantLabel },
    { category: 'Specs', label: 'Max Pressure', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('pressure'))?.value || '—' },
    { category: 'Specs', label: 'Diameter / Size', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('diameter'))?.value || c.specifications.find((s) => s.label.toLowerCase().includes('dimension'))?.value || '—' },
    { category: 'Specs', label: 'Internal Volume', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('volume'))?.value || '—' },
    { category: 'Specs', label: 'Weight', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('weight'))?.value || '—' },
    { category: 'Specs', label: 'Seating', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('seat') || s.label.toLowerCase().includes('capacity'))?.value || (c.type === 'monoplace' || c.type === 'soft' ? '1 user' : '—') },
    { category: 'Specs', label: 'Control', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('control'))?.value || '—' },
    { category: 'Specs', label: 'Safety Systems', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('safety'))?.value || '—' },
    { category: 'Specs', label: 'Warranty', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('warranty'))?.value || '—' },
    { category: 'Specs', label: 'Origin', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('origin') || s.label.toLowerCase().includes('manufactur'))?.value || '—' },
    { category: 'Pricing', label: 'Purchase', extractor: (c) => (c.pricing.buy ? `€${c.pricing.buy.toLocaleString()}` : 'Contact us') },
    { category: 'Pricing', label: 'Monthly Rental', extractor: (c) => (c.pricing.rent?.monthly ? `€${c.pricing.rent.monthly.toLocaleString()}/mo` : c.transactionModes.includes('rent') ? 'Contact us' : 'N/A') },
    { category: 'Pricing', label: 'Min. Rental Term', extractor: (c) => (c.pricing.rent ? `${c.pricing.rent.minimumMonths} months` : 'N/A') },
];

const PLACEHOLDER_IMAGES = {
    monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80',
    multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=400&q=80',
};

const CATEGORY_COLORS: Record<string, string> = {
    Identity: 'text-slate-400',
    Specs: 'text-cyan-400',
    Pricing: 'text-emerald-400',
};

// ── Floating Compare Dock ────────────────────────────────────────────────────

export const ChamberCompareDock5: React.FC<{
    chambers: ChamberProduct[];
    onRemove: (id: string) => void;
    onClear: () => void;
    onOpenCompare: () => void;
}> = ({ chambers, onRemove, onClear, onOpenCompare }) => {
    if (chambers.length === 0) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
        >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/50 px-5 py-3">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Icon + count */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <SplitSquareHorizontal size={15} className="text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white leading-none">{chambers.length}/3</p>
                            <p className="text-[10px] text-slate-500 leading-none mt-0.5">comparing</p>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-white/[0.08] hidden sm:block" />

                    {/* Chamber chips */}
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                        {chambers.map((c) => (
                            <div
                                key={c.id}
                                className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs"
                            >
                                <span className="font-semibold text-white">{c.fullName}</span>
                                <button
                                    onClick={() => onRemove(c.id)}
                                    aria-label={`Remove ${c.fullName}`}
                                    className="text-slate-500 hover:text-slate-200 transition-colors"
                                >
                                    <X size={11} />
                                </button>
                            </div>
                        ))}
                        {Array.from({ length: 3 - chambers.length }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="flex items-center gap-1 border border-dashed border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[10px] text-slate-600"
                            >
                                + slot
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={onClear}
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={onOpenCompare}
                            disabled={chambers.length < 2}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                        >
                            Compare
                            <ArrowRight size={13} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ── Full Comparison Table ────────────────────────────────────────────────────

export const ChamberCompare5: React.FC<ChamberCompare5Props> = ({
    chambers,
    onRemove,
    onClear,
    onNavigate,
}) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(['Identity', 'Specs', 'Pricing'])
    );

    const toggleCategory = (cat: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
            return next;
        });
    };

    const categories = Array.from(new Set(COMPARISON_ROWS.map((r) => r.category)));

    return (
        <div className="w-full">
            {/* Chamber headers */}
            <div
                className="grid gap-4 mb-6 sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm py-4"
                style={{ gridTemplateColumns: `180px repeat(${chambers.length}, 1fr)` }}
            >
                <div className="flex items-end pb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compare</p>
                </div>
                {chambers.map((c) => {
                    const heroUrl = c.images.find((i) => i.role === 'hero')?.url || PLACEHOLDER_IMAGES[c.type];
                    return (
                        <div key={c.id} className="relative">
                            <button
                                onClick={() => onRemove(c.id)}
                                aria-label={`Remove ${c.fullName}`}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-slate-800 border border-white/[0.1] rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors z-10"
                            >
                                <X size={11} />
                            </button>
                            <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-slate-900">
                                <div className="relative h-32 overflow-hidden">
                                    <OptimizedImage
                                        src={heroUrl}
                                        alt={c.fullName}
                                        fallbackSrc={PLACEHOLDER_IMAGES[c.type]}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                </div>
                                <div className="p-3">
                                    <p className="text-[10px] text-slate-500 font-medium">{c.brandLabel}</p>
                                    <p className="font-bold text-white text-sm leading-tight">{c.fullName}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{c.shortDescription.slice(0, 65)}…</p>
                                    <button
                                        onClick={() => onNavigate(c.slug)}
                                        className="mt-2 w-full text-xs font-bold py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 transition-all"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Comparison rows by category */}
            <div className="space-y-2">
                {categories.map((cat) => {
                    const rows = COMPARISON_ROWS.filter((r) => r.category === cat);
                    const isExpanded = expandedCategories.has(cat);
                    const catColor = CATEGORY_COLORS[cat] || 'text-slate-400';

                    return (
                        <div key={cat} className="rounded-2xl overflow-hidden border border-white/[0.06]">
                            {/* Category header */}
                            <button
                                onClick={() => toggleCategory(cat)}
                                className="w-full flex items-center justify-between px-5 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                aria-expanded={isExpanded}
                            >
                                <span className={`text-xs font-bold uppercase tracking-widest ${catColor}`}>{cat}</span>
                                <span className="text-slate-500">
                                    {isExpanded ? <ChevronUp size={15} className="ui-transition-fast" /> : <ChevronDown size={15} className="ui-transition-fast" />}
                                </span>
                            </button>

                            {/* Rows */}
                            <div className="ui-accordion-grid" data-open={isExpanded}>
                                <div className="divide-y divide-white/[0.04]">
                                    {rows.map((row) => {
                                        const values = chambers.map(row.extractor);
                                        return (
                                            <div
                                                key={row.label}
                                                className="grid gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors"
                                                style={{ gridTemplateColumns: `180px repeat(${chambers.length}, 1fr)` }}
                                            >
                                                <p className="text-xs text-slate-500 font-medium">{row.label}</p>
                                                {values.map((v, vi) => (
                                                    <p key={vi} className="text-xs font-semibold text-slate-200">
                                                        {v}
                                                    </p>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Features comparison */}
            <div className="mt-2 rounded-2xl overflow-hidden border border-white/[0.06]">
                <button
                    onClick={() => toggleCategory('Features')}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                    aria-expanded={expandedCategories.has('Features')}
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Features</span>
                    <span className="text-slate-500">
                        {expandedCategories.has('Features') ? <ChevronUp size={15} className="ui-transition-fast" /> : <ChevronDown size={15} className="ui-transition-fast" />}
                    </span>
                </button>
                <div className="ui-accordion-grid" data-open={expandedCategories.has('Features')}>
                    <div className="divide-y divide-white/[0.04]">
                        {Array.from(new Set(chambers.flatMap((c) => c.highlights))).map((feature) => (
                            <div
                                key={feature}
                                className="grid gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors"
                                style={{ gridTemplateColumns: `180px repeat(${chambers.length}, 1fr)` }}
                            >
                                <p className="text-xs text-slate-500 font-medium leading-snug">{feature}</p>
                                {chambers.map((c, ci) => {
                                    const has = c.highlights.includes(feature) || c.features.includes(feature);
                                    return (
                                        <div key={ci}>
                                            {has ? (
                                                <div className="w-5 h-5 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
                                                    <Check size={10} className="text-emerald-400" />
                                                </div>
                                            ) : (
                                                <Minus size={14} className="text-white/[0.15]" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-600 mt-6 pt-4 border-t border-white/[0.05] leading-relaxed">
                Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.
                Specifications subject to change — contact us to confirm before purchase.
            </p>
        </div>
    );
};
