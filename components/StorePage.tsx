'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowRight,
    ShieldCheck,
    Truck,
    ChevronRight,
    MessageCircle,
    Zap,
    Sparkles,
    Activity,
    Wind,
    Sun,
    Droplets,
    CheckCircle,
    Star,
} from 'lucide-react';
import { useTech } from '../hooks/useTech';
import { TechData, TechType } from '../types';
import { analytics } from '../src/lib/analytics';
import type { FilterState } from './ProductFilters';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { products as catalogProducts } from '../content/products';

const RentalConfigurator = dynamic(
    () => import('./RentalConfigurator').then((module) => ({ default: module.RentalConfigurator })),
    { ssr: false, loading: () => null }
);

const ProductFilters = dynamic(
    () => import('./ProductFilters').then((module) => ({ default: module.ProductFilters })),
    { ssr: false, loading: () => null }
);

interface StorePageProps {
    onNavigate: (page: string) => void;
    onSelectTech: (tech: TechType) => void;
    onNavigateChambers?: () => void;
    productHrefForTech?: (tech: TechType) => string;
    plannerSummaryLines?: string[];
}

// Tech-specific icons for visual distinction
const TECH_ICONS: Partial<Record<TechType, React.ReactNode>> = {
    [TechType.HBOT]: <Wind size={28} />,
    [TechType.PEMF]: <Activity size={28} />,
    [TechType.RLT]: <Sun size={28} />,
    [TechType.HYDROGEN]: <Droplets size={28} />
};

const DEFAULT_STORE_FILTERS: FilterState = {
    priceRange: [0, 100000],
    rentalPriceRange: [0, 3000],
    technologies: [],
    goals: [],
    categories: [],
    pressureRating: [],
    availability: 'all',
    sortBy: 'featured',
};

const parsePriceValue = (price: string): number => {
    const parsed = Number(price.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeTerm = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const getModalityLabel = (tech: TechData): string => {
    if (tech.id === TechType.HBOT) return 'HBOT';
    if (tech.id === TechType.HYDROGEN) return 'Hydrogen';
    if (tech.id === TechType.RLT) return 'Red light / NIR';
    if (tech.id === TechType.PEMF) return 'PEMF';

    const loweredName = tech.name.toLowerCase();
    if (loweredName.includes('oxygen') || loweredName.includes('o2')) return 'Oxygen';

    return tech.name;
};

const modalityToTechMap: Record<string, TechType> = {
    HBOT: TechType.HBOT,
    H2_inhalation: TechType.HYDROGEN,
    H2_water: TechType.HYDROGEN,
    RLT_NIR: TechType.RLT,
    PEMF: TechType.PEMF,
    VNS: TechType.VNS,
};

export const StorePage: React.FC<StorePageProps> = ({
    onNavigate,
    onSelectTech,
    onNavigateChambers,
    productHrefForTech,
    plannerSummaryLines = [],
}) => {
    const { allTech } = useTech();
    const [mode, setMode] = useState<'RENT' | 'BUY'>('BUY');
    const [hoveredCard, setHoveredCard] = useState<TechType | null>(null);
    const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_STORE_FILTERS);
    const storeFiltersEnabled = useFeatureFlag('feature_store_filters');
    const storeCardsEnabled = useFeatureFlag('feature_store_cards');

    const productMetaByTech = useMemo(() => {
        const metadata = new Map<TechType, { rating?: number; reviewCount: number; ceMark?: boolean }>();

        catalogProducts.forEach((product) => {
            const mappedTech = modalityToTechMap[product.modality];
            if (!mappedTech) return;

            const existing = metadata.get(mappedTech);
            if (!existing || product.reviewCount > existing.reviewCount) {
                metadata.set(mappedTech, {
                    rating: product.rating,
                    reviewCount: product.reviewCount,
                    ceMark: product.ceMark,
                });
            }
        });

        return metadata;
    }, []);

    const filteredTech = useMemo(() => {
        if (!storeFiltersEnabled) return allTech;

        const selectedTechnologies = new Set(activeFilters.technologies);
        const selectedGoals = new Set(activeFilters.goals.map((goal) => normalizeTerm(goal)));

        const isRentalPriceFilterActive =
            activeFilters.rentalPriceRange[0] > DEFAULT_STORE_FILTERS.rentalPriceRange[0] ||
            activeFilters.rentalPriceRange[1] < DEFAULT_STORE_FILTERS.rentalPriceRange[1];

        let filtered = allTech.filter((tech) => {
            const parsedPrice = parsePriceValue(tech.price);
            const withinPurchaseRange =
                parsedPrice >= activeFilters.priceRange[0] &&
                parsedPrice <= activeFilters.priceRange[1];

            if (!withinPurchaseRange) return false;

            if (selectedTechnologies.size > 0) {
                const technologyMatches = Array.from(selectedTechnologies).some((selectedTech) => {
                    if (selectedTech === 'HBOT') return tech.id === TechType.HBOT;
                    if (selectedTech === 'H2') return tech.id === TechType.HYDROGEN;
                    if (selectedTech === 'RLT') return tech.id === TechType.RLT;
                    if (selectedTech === 'PEMF') return tech.id === TechType.PEMF;
                    if (selectedTech === 'O2') {
                        const indexableText = `${tech.name} ${tech.tagline} ${tech.descriptionStandard}`.toLowerCase();
                        return indexableText.includes('oxygen') || indexableText.includes('o2');
                    }
                    return false;
                });

                if (!technologyMatches) return false;
            }

            if (selectedGoals.size > 0) {
                const techGoals = tech.goals.map((goal) => normalizeTerm(goal));
                const hasGoalMatch = Array.from(selectedGoals).some((selectedGoal) =>
                    techGoals.some((techGoal) => techGoal.includes(selectedGoal) || selectedGoal.includes(techGoal))
                );

                if (!hasGoalMatch) return false;
            }

            if (activeFilters.availability === 'rental' && !tech.rentalPrice) return false;
            if ((activeFilters.availability === 'in-stock' || activeFilters.availability === 'instock') && tech.inventory.available <= 0) {
                return false;
            }

            if (isRentalPriceFilterActive) {
                const monthlyRental = tech.rentalPrice;
                if (!monthlyRental) return false;

                const withinRentalRange =
                    monthlyRental >= activeFilters.rentalPriceRange[0] &&
                    monthlyRental <= activeFilters.rentalPriceRange[1];

                if (!withinRentalRange) return false;
            }

            return true;
        });

        filtered = [...filtered];
        if (activeFilters.sortBy === 'price-low') {
            filtered.sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price));
        } else if (activeFilters.sortBy === 'price-high') {
            filtered.sort((a, b) => parsePriceValue(b.price) - parsePriceValue(a.price));
        } else if (activeFilters.sortBy === 'rating') {
            filtered.sort((a, b) => {
                const ratingA = productMetaByTech.get(a.id)?.rating ?? 0;
                const ratingB = productMetaByTech.get(b.id)?.rating ?? 0;
                return ratingB - ratingA;
            });
        }

        return filtered;
    }, [activeFilters, allTech, productMetaByTech, storeFiltersEnabled]);

    const handleProductClick = React.useCallback((tech: TechData) => {
        // Track product viewed event
        analytics.productViewed(
            tech.id,
            tech.name,
            parseInt(tech.price.replace(/[^0-9]/g, ''))
        );
        onSelectTech(tech.id);
    }, [onSelectTech]);

    const handleProductKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>, tech: TechData) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        handleProductClick(tech);
    }, [handleProductClick]);

    const modeSummary =
        mode === 'RENT'
            ? 'Choose rental when you want to test space, routine fit, and long-term confidence before committing.'
            : 'Choose purchase when you are ready for full ownership, financing, and the complete technical comparison.';
    const getProductHref = (tech: TechType): string =>
        productHrefForTech?.(tech) ?? `/product/${tech.toLowerCase()}`;
    const getRentalProductHref = (tech: TechType): string => {
        const baseHref = getProductHref(tech);
        return `${baseHref}${baseHref.includes('?') ? '&' : '?'}mode=rental`;
    };

    return (
        <div className="min-h-screen pt-10 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">

            {/* Hero Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
                >
                    <Sparkles size={12} /> Research-Grade Bio-Optimization
                </motion.div>
                <h1 id="store-hero-headline" className="mb-4 text-4xl font-bold leading-tight text-slate-900 futuristic-font sm:text-5xl md:text-6xl">
                    Choose the right technology, then choose how to start
                </h1>
                <p id="store-hero-description" className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                    Compare device categories, pricing, rental access, and protocol fit before you move into specifications, research, and delivery planning.
                </p>
                {plannerSummaryLines.length > 0 && (
                    <div className="mt-6 inline-flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                        <span className="font-semibold">Planner context:</span>
                        {plannerSummaryLines.map((line) => (
                            <span key={line} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-cyan-900">
                                {line}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
            >
                <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-3">
                    <Link
                        href="/wellness-planner"
                        prefetch={false}
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
                    >
                        <div className="flex items-center gap-3">
                            <Zap size={18} className="text-cyan-500" />
                            <span className="text-sm font-semibold text-slate-900">Get matched first</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                            Use the planner if you want a recommendation before comparing specs.
                        </p>
                    </Link>
                    <Link
                        href="/rental"
                        prefetch={false}
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
                    >
                        <div className="flex items-center gap-3">
                            <Truck size={18} className="text-cyan-500" />
                            <span className="text-sm font-semibold text-slate-900">Start with rental</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                            Lower upfront cost, guided onboarding, and a clearer try-before-you-buy path.
                        </p>
                    </Link>
                    <Link
                        href="/contact"
                        prefetch={false}
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
                    >
                        <div className="flex items-center gap-3">
                            <MessageCircle size={18} className="text-cyan-500" />
                            <span className="text-sm font-semibold text-slate-900">Talk to Hylono</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                            Ask about delivery, financing, clinic use, or which system fits your space.
                        </p>
                    </Link>
                </div>
            </motion.div>

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
            <p className="mx-auto mb-16 max-w-2xl text-center text-sm text-slate-500">
                {modeSummary}
            </p>

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
                                { icon: <Truck className="text-cyan-500" size={24} />, title: 'Delivery Planning', desc: 'Large-system logistics and onboarding steps are coordinated with the customer before dispatch.' },
                                { icon: <ShieldCheck className="text-emerald-500" size={24} />, title: 'Warranty Guidance', desc: 'Coverage terms and support responsibilities are documented per product line and plan type.' },
                                { icon: <ArrowRight className="text-purple-500" size={24} />, title: 'Upgrade Support', desc: 'Ask the team about purchase-transition options when you want to move beyond a rental phase.' },
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
                        {storeFiltersEnabled && (
                            <ProductFilters
                                onFilterChange={setActiveFilters}
                                productCount={filteredTech.length}
                            />
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredTech.map((tech, index) => {
                                const productMeta = productMetaByTech.get(tech.id);

                                return (
                                    <motion.article
                                        key={tech.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onMouseEnter={() => setHoveredCard(tech.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        onClick={() => handleProductClick(tech)}
                                        onKeyDown={(event) => handleProductKeyDown(event, tech)}
                                        data-testid="product-card"
                                        role="link"
                                        tabIndex={0}
                                        aria-label={`Open ${tech.name} details`}
                                        className={`product-card group relative bg-white rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500
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

                                            {storeCardsEnabled && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-700">
                                                        {getModalityLabel(tech)}
                                                    </span>
                                                    {tech.rentalPrice && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                                                            Rental
                                                        </span>
                                                    )}
                                                </div>
                                            )}

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
                                                        {storeCardsEnabled && tech.rentalPrice && (
                                                            <span className="text-[11px] text-slate-500 font-semibold mt-1">
                                                                or from €{tech.rentalPrice}/mo
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 w-full sm:w-auto">
                                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                                        <Link
                                                            href={getProductHref(tech.id)}
                                                            prefetch={false}
                                                            onClick={(event) => event.stopPropagation()}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] group-hover:bg-cyan-500 transition-colors"
                                                        >
                                                            View Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                        {tech.id === TechType.HBOT && onNavigateChambers && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onNavigateChambers();
                                                                }}
                                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-100 transition-colors"
                                                            >
                                                                <Wind size={13} />
                                                                Compare Chambers
                                                            </button>
                                                        )}
                                                    </div>
                                                    {tech.rentalPrice && (
                                                        <Link
                                                            href={getRentalProductHref(tech.id)}
                                                            prefetch={false}
                                                            onClick={(event) => event.stopPropagation()}
                                                            className="inline-flex items-center justify-center text-xs font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                                                        >
                                                            Start with rental from EUR {tech.rentalPrice}/mo
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>

                                            {storeCardsEnabled && (
                                                <div className="mt-6 pt-4 border-t border-slate-100">
                                                    {productMeta?.rating && productMeta.reviewCount >= 10 ? (
                                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                                            <Star size={13} className="text-amber-500 fill-amber-500" />
                                                            <span>{productMeta.rating.toFixed(1)} ({productMeta.reviewCount})</span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                                                            CE ✓
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>

                        {storeFiltersEnabled && filteredTech.length === 0 && (
                            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                                <p className="text-slate-600 text-sm">No products match your current filters. Try broadening your selection.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trust Markers Section */}
            <div className="mt-24 pt-12 border-t border-slate-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                    {[
                        { icon: <ShieldCheck size={20} />, text: "Checkout Security" },
                        { icon: <Sparkles size={20} />, text: "Premium Build Quality" },
                        { icon: <Truck size={20} />, text: "Global Freight Planning" },
                        { icon: <CheckCircle size={20} className="text-emerald-500" />, text: "Policy-Backed Support" }
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
