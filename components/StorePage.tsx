import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RentalConfigurator } from './RentalConfigurator';
import {
    ArrowRight,
    ShieldCheck,
    Truck,
    ChevronRight,
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
import { FilterState, ProductFilters } from './ProductFilters';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { products as catalogProducts } from '../content/products';

interface StorePageProps {
    onNavigate: (page: string) => void;
    onSelectTech: (tech: TechType) => void;
    onNavigateChambers?: () => void;
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
    if (tech.id === TechType.HBOT) return 'mHBOT';
    if (tech.id === TechType.HYDROGEN) return 'Hydrogen';
    if (tech.id === TechType.RLT) return 'Red light / NIR';
    if (tech.id === TechType.PEMF) return 'PEMF';

    const loweredName = tech.name.toLowerCase();
    if (loweredName.includes('oxygen') || loweredName.includes('o2')) return 'Oxygen';

    return tech.name;
};

const modalityToTechMap: Record<string, TechType> = {
    mHBOT: TechType.HBOT,
    H2_inhalation: TechType.HYDROGEN,
    H2_water: TechType.HYDROGEN,
    RLT_NIR: TechType.RLT,
    PEMF: TechType.PEMF,
    VNS: TechType.VNS,
};

export const StorePage: React.FC<StorePageProps> = ({ onNavigate, onSelectTech, onNavigateChambers }) => {
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
                    if (selectedTech === 'mHBOT') return tech.id === TechType.HBOT;
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

    return (
        <div className="min-h-screen pt-10 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">

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

            {/* Not Sure? Quiz Entry */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-4 mb-8"
            >
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <Zap size={16} className="text-cyan-500" />
                    <span className="text-sm text-slate-500">Not sure which technology is right for you?</span>
                    <button
                        onClick={() => onNavigate('onboarding')}
                        className="text-sm font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition-colors"
                    >
                        Take the 60-second quiz <ChevronRight size={14} />
                    </button>
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
                                        data-testid="product-card"
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

                                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                                    {/* Explore CTA */}
                                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] group-hover:bg-cyan-500 transition-colors">
                                                        Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                    {/* HBOT-only: Browse Chambers CTA */}
                                                    {tech.id === TechType.HBOT && onNavigateChambers && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onNavigateChambers();
                                                            }}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-100 transition-colors"
                                                        >
                                                            <Wind size={13} />
                                                            Chambers
                                                        </button>
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

