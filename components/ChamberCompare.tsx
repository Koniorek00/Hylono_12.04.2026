/**
 * ChamberCompare
 * Side-by-side comparison of up to 3 HBOT chambers.
 * Floating compare bar + full comparison modal.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Scale, Check, Minus, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { ChamberProduct } from '../types';
import { OptimizedImage } from './shared/OptimizedImage';

interface ChamberCompareProps {
    chambers: ChamberProduct[];
    onRemove: (id: string) => void;
    onClear: () => void;
    onNavigate: (slug: string) => void;
}

type SectionKey = 'specs' | 'features' | 'pricing';

// All spec labels we want to compare across chambers
const COMPARISON_ROWS: { label: string; key?: string; extractor: (c: ChamberProduct) => string }[] = [
    { label: 'Type', extractor: (c) => c.type.charAt(0).toUpperCase() + c.type.slice(1) },
    { label: 'Brand', extractor: (c) => c.brandLabel },
    { label: 'Variant', extractor: (c) => c.variantLabel },
    { label: 'Pressure', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('pressure'))?.value || '—' },
    { label: 'Diameter / Size', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('diameter'))?.value || c.specifications.find((s) => s.label.toLowerCase().includes('dimension'))?.value || '—' },
    { label: 'Internal Volume', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('volume'))?.value || '—' },
    { label: 'Weight', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('weight'))?.value || c.specifications.find((s) => s.label.toLowerCase().includes('kg'))?.value || '—' },
    { label: 'Seating Capacity', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('seat') || s.label.toLowerCase().includes('users') || s.label.toLowerCase().includes('capacity'))?.value || (c.type === 'monoplace' || c.type === 'soft' ? '1 user' : '—') },
    { label: 'Control Interface', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('control'))?.value || '—' },
    { label: 'Safety Systems', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('safety'))?.value || '—' },
    { label: 'Warranty', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('warranty'))?.value || '—' },
    { label: 'Manufacturing', extractor: (c) => c.specifications.find((s) => s.label.toLowerCase().includes('origin') || s.label.toLowerCase().includes('manufactur'))?.value || '—' },
    { label: 'Buy Available', extractor: (c) => (c.transactionModes.includes('buy') ? 'Yes' : 'No') },
    { label: 'Rent Available', extractor: (c) => (c.transactionModes.includes('rent') ? 'Yes' : 'No') },
    { label: 'Buy Price', extractor: (c) => (c.pricing.buy ? `€${c.pricing.buy.toLocaleString()}` : 'Contact us') },
    { label: 'Monthly Rental', extractor: (c) => (c.pricing.rent?.monthly ? `€${c.pricing.rent.monthly.toLocaleString()}/mo` : c.transactionModes.includes('rent') ? 'Contact us' : 'N/A') },
];

// Floating bar shown at bottom when chambers are selected for comparison
export const ChamberCompareBar: React.FC<{
    chambers: ChamberProduct[];
    onRemove: (id: string) => void;
    onClear: () => void;
    onOpenCompare: () => void;
}> = ({ chambers, onRemove, onClear, onOpenCompare }) => {
    if (chambers.length === 0) return null;

    return (
        <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Scale size={16} className="text-blue-600" />
                    Comparing {chambers.length}/3
                </div>

                <div className="flex items-center gap-2 flex-1 flex-wrap">
                    {chambers.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-2.5 py-1 text-sm"
                        >
                            <span className="font-medium text-slate-700">{c.fullName}</span>
                            <button
                                onClick={() => onRemove(c.id)}
                                aria-label={`Remove ${c.fullName} from comparison`}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: 3 - chambers.length }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="flex items-center gap-1.5 border-2 border-dashed border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-400"
                        >
                            + Add chamber
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClear}
                        className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Clear all
                    </button>
                    <button
                        onClick={onOpenCompare}
                        disabled={chambers.length < 2}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Compare {chambers.length < 2 ? '(add 1 more)' : 'now'}
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Full comparison modal
export const ChamberCompare: React.FC<ChamberCompareProps> = ({
    chambers,
    onRemove,
    onClear,
    onNavigate,
}) => {
    const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
        specs: true,
        features: false,
        pricing: true,
    });

    const toggleSection = (section: SectionKey) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const PLACEHOLDER_IMAGES = {
        monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80',
        multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
        soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=400&q=80',
    };

    return (
        <div className="w-full overflow-x-auto">
            {/* Chamber header row */}
            <div
                className="grid gap-4 mb-6"
                style={{ gridTemplateColumns: `200px repeat(${chambers.length}, 1fr)` }}
            >
                {/* Label col */}
                <div className="flex items-end pb-4">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Chamber</p>
                </div>

                {/* Chamber columns */}
                {chambers.map((c) => {
                    const fallbackImage = PLACEHOLDER_IMAGES[c.type] ?? PLACEHOLDER_IMAGES.monoplace;
                    const heroUrl = c.images.find((i) => i.role === 'hero')?.url ?? fallbackImage;
                    return (
                        <div key={c.id} className="relative">
                            <button
                                onClick={() => onRemove(c.id)}
                                aria-label={`Remove ${c.fullName}`}
                                className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors z-10"
                            >
                                <X size={13} />
                            </button>
                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                                <OptimizedImage
                                    src={heroUrl}
                                    alt={c.fullName}
                                    fallbackSrc={fallbackImage}
                                    width={640}
                                    height={160}
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-3">
                                    <p className="text-xs text-slate-400 font-medium">{c.brandLabel}</p>
                                    <p className="font-bold text-slate-900 text-sm leading-tight">{c.fullName}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.shortDescription.slice(0, 70)}…</p>
                                    <button
                                        onClick={() => onNavigate(c.slug)}
                                        className="mt-2 w-full text-xs font-semibold py-1.5 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Specs table */}
            <Section
                title="Specifications"
                sectionKey="specs"
                expanded={expandedSections.specs ?? false}
                onToggle={() => toggleSection('specs')}
            >
                {COMPARISON_ROWS.slice(0, 12).map((row) => (
                    <CompareRow
                        key={row.label}
                        label={row.label}
                        values={chambers.map(row.extractor)}
                        colCount={chambers.length}
                    />
                ))}
            </Section>

            {/* Features */}
            <Section
                title="Features"
                sectionKey="features"
                expanded={expandedSections.features ?? false}
                onToggle={() => toggleSection('features')}
            >
                {/* Collect all unique features across chambers */}
                {Array.from(new Set(chambers.flatMap((c) => c.highlights))).map((feature) => (
                    <CompareFeatureRow
                        key={feature}
                        label={feature}
                        values={chambers.map((c) => c.highlights.includes(feature) || c.features.includes(feature))}
                        colCount={chambers.length}
                    />
                ))}
            </Section>

            {/* Pricing */}
            <Section
                title="Pricing & Availability"
                sectionKey="pricing"
                expanded={expandedSections.pricing ?? false}
                onToggle={() => toggleSection('pricing')}
            >
                {COMPARISON_ROWS.slice(12).map((row) => (
                    <CompareRow
                        key={row.label}
                        label={row.label}
                        values={chambers.map(row.extractor)}
                        colCount={chambers.length}
                    />
                ))}
            </Section>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100">
                Designed for general wellbeing use and purchase planning. Confirm suitability with a qualified healthcare professional before use, and contact us to verify the current specification set before purchase.
            </p>
        </div>
    );
};

// Sub-components

const Section: React.FC<{
    title: string;
    sectionKey: string;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}> = ({ title, expanded, onToggle, children }) => (
    <div className="mb-4 border border-slate-200 rounded-xl overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            aria-expanded={expanded}
        >
            <span className="font-semibold text-slate-700 text-sm">{title}</span>
            {expanded ? <ChevronUp size={16} className="text-slate-400 ui-transition-fast" /> : <ChevronDown size={16} className="text-slate-400 ui-transition-fast" />}
        </button>
        <div className="ui-accordion-grid" data-open={expanded}>
            <div className="divide-y divide-slate-100">{children}</div>
        </div>
    </div>
);

const CompareRow: React.FC<{
    label: string;
    values: string[];
    colCount: number;
}> = ({ label, values, colCount }) => (
    <div
        className="grid gap-4 px-4 py-2.5 hover:bg-slate-50 transition-colors"
        style={{ gridTemplateColumns: `200px repeat(${colCount}, 1fr)` }}
    >
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        {values.map((v, i) => (
            <p key={i} className="text-sm text-slate-800 font-semibold">
                {v}
            </p>
        ))}
    </div>
);

const CompareFeatureRow: React.FC<{
    label: string;
    values: boolean[];
    colCount: number;
}> = ({ label, values, colCount }) => (
    <div
        className="grid gap-4 px-4 py-2 hover:bg-slate-50 transition-colors"
        style={{ gridTemplateColumns: `200px repeat(${colCount}, 1fr)` }}
    >
        <p className="text-sm text-slate-500">{label}</p>
        {values.map((v, i) => (
            <div key={i}>
                {v ? (
                    <Check size={16} className="text-emerald-500" />
                ) : (
                    <Minus size={16} className="text-slate-300" />
                )}
            </div>
        ))}
    </div>
);
