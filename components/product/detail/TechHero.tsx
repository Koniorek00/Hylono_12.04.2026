/**
 * TechHero
 * Shared hero for technology product pages.
 *
 * Notes:
 * - HBOT uses the shared chamber selector as the single visible selector surface.
 * - Hydrogen uses the premium route catalog directly in the hero so the
 *   selector sits in the same decision zone as HBOT.
 */

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Shield,
    CheckCircle,
    Phone,
    ShoppingBag,
    ChevronDown,
    Users,
    Maximize2,
    Wind,
    Sun,
    Droplets,
    Activity,
} from 'lucide-react';
import { TechData, TechType } from '../../../types';
import { ALL_CHAMBERS } from '../../../constants/chambers';
import {
    formatPln,
    getHydrogenPremiumPath,
    hydrogenPremiumLineMeta,
    hydrogenPremiumPages,
    type HydrogenPremiumLineId,
    type HydrogenPremiumPageRecord,
    type HydrogenPremiumSlug,
} from '../../../content/hydrogen-premium-2026';
import { OptimizedImage } from '../../shared/OptimizedImage';

const TECH_CONFIG: {
    type: TechType;
    title: string;
    tagline: string;
    icon: React.ReactNode;
    iconBg: string;
}[] = [
    {
        type: TechType.HBOT,
        title: 'HBOT',
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
        tagline: 'Molecular Hydrogen Delivery Systems',
        icon: <Droplets size={28} />,
        iconBg: 'bg-sky-500',
    },
];

const PLACEHOLDER_IMAGES: Record<string, string> = {
    monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80',
    multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80',
    soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=900&q=80',
};

const TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
    monoplace: { label: 'Monoplace', icon: <Maximize2 size={14} /> },
    multiplace: { label: 'Multiplace', icon: <Users size={14} /> },
    soft: { label: 'Soft Chamber', icon: <Wind size={14} /> },
};

const HYDROGEN_LINE_ORDER: HydrogenPremiumLineId[] = ['personal', 'intensive', 'advanced', 'water'];
const DEFAULT_HYDROGEN_PAGE_SLUG: HydrogenPremiumSlug = 'os-ho450-p';

const getHydrogenPriceRangeLabel = (page: HydrogenPremiumPageRecord) => {
    const prices = page.variants.map((variant) => variant.grossPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max ? formatPln(min) : `${formatPln(min)} to ${formatPln(max)}`;
};

const getHydrogenDeliveryLabel = (page: HydrogenPremiumPageRecord) => {
    if (page.lineId === 'water') return 'Hydrogen water route';
    if (page.slug.includes('-p-') || page.slug.endsWith('-p')) return 'Pulse-controlled H2 + O2';
    if (page.variants.some((variant) => Boolean(variant.oxygen))) return 'Continuous H2 + O2';
    return 'Pure hydrogen inhalation';
};

const getHydrogenOutputSummary = (page: HydrogenPremiumPageRecord, lineRangeLabel: string) => {
    if (page.variants.length === 1) {
        const variant = page.variants[0];
        if (!variant) return lineRangeLabel;
        return variant.oxygen ? `${variant.hydrogen} H2 + ${variant.oxygen} O2` : variant.hydrogen;
    }

    return lineRangeLabel;
};

type FloatingItem = {
    label: string;
    value: string;
};

interface TechHeroProps {
    data: TechData;
    onBack: () => void;
    onNavigate?: (path: string) => void;
    selectedHbotChamberSlug?: string;
    onSelectHbotChamber?: (slug: string) => void;
    compareChamberIds?: string[];
    onToggleCompareChamber?: (chamberId: string) => void;
}

export const TechHero: React.FC<TechHeroProps> = ({
    data,
    selectedHbotChamberSlug,
    onSelectHbotChamber,
    compareChamberIds = [],
    onToggleCompareChamber,
}) => {
    const [fallbackSelectedChamberId, setFallbackSelectedChamberId] = useState<string | null>(null);
    const [expandedTypes, setExpandedTypes] = useState<string[]>(['monoplace']);
    const [selectedHydrogenSlug, setSelectedHydrogenSlug] = useState<HydrogenPremiumSlug>(DEFAULT_HYDROGEN_PAGE_SLUG);
    const [expandedHydrogenLines, setExpandedHydrogenLines] = useState<HydrogenPremiumLineId[]>(['personal']);

    const isHbot = data.id === TechType.HBOT;
    const isHydrogen = data.id === TechType.HYDROGEN;

    const defaultTechConfig = TECH_CONFIG[0] ?? {
        type: data.id,
        title: 'Technology',
        tagline: 'Performance wellness systems',
        icon: <Activity size={28} />,
        iconBg: 'bg-cyan-500',
    };
    const techConfig = TECH_CONFIG.find((item) => item.type === data.id) ?? defaultTechConfig;

    const chambersByType = useMemo(() => {
        if (!isHbot) return null;

        return {
            monoplace: ALL_CHAMBERS.filter((chamber) => chamber.type === 'monoplace'),
            multiplace: ALL_CHAMBERS.filter((chamber) => chamber.type === 'multiplace'),
            soft: ALL_CHAMBERS.filter((chamber) => chamber.type === 'soft'),
        };
    }, [isHbot]);

    const selectedChamber = useMemo(() => {
        if (!chambersByType) return null;

        if (selectedHbotChamberSlug) {
            return ALL_CHAMBERS.find((chamber) => chamber.slug === selectedHbotChamberSlug) ?? null;
        }

        if (fallbackSelectedChamberId) {
            return ALL_CHAMBERS.find((chamber) => chamber.id === fallbackSelectedChamberId) ?? null;
        }

        return ALL_CHAMBERS[0] ?? null;
    }, [chambersByType, fallbackSelectedChamberId, selectedHbotChamberSlug]);

    const hydrogenPagesByLine = useMemo(() => {
        if (!isHydrogen) return null;

        return HYDROGEN_LINE_ORDER.reduce((acc, lineId) => {
            acc[lineId] = hydrogenPremiumPages.filter((page) => page.lineId === lineId);
            return acc;
        }, {} as Record<HydrogenPremiumLineId, HydrogenPremiumPageRecord[]>);
    }, [isHydrogen]);

    const selectedHydrogenPage = useMemo(() => {
        if (!isHydrogen) return null;

        return (
            hydrogenPremiumPages.find((page) => page.slug === selectedHydrogenSlug) ??
            hydrogenPremiumPages.find((page) => page.slug === DEFAULT_HYDROGEN_PAGE_SLUG) ??
            hydrogenPremiumPages[0] ??
            null
        );
    }, [isHydrogen, selectedHydrogenSlug]);

    const selectedHydrogenLine = useMemo(() => {
        if (!selectedHydrogenPage) return null;
        return hydrogenPremiumLineMeta[selectedHydrogenPage.lineId];
    }, [selectedHydrogenPage]);

    const heroImage = useMemo(() => {
        if (isHbot && selectedChamber) {
            return selectedChamber.images.find((image) => image.role === 'hero')?.url || PLACEHOLDER_IMAGES[selectedChamber.type];
        }

        if (isHydrogen && selectedHydrogenPage) {
            return selectedHydrogenPage.image;
        }

        return null;
    }, [isHbot, isHydrogen, selectedChamber, selectedHydrogenPage]);

    const heroCardTitle = isHbot
        ? selectedChamber?.fullName ?? null
        : selectedHydrogenPage?.title ?? null;
    const heroCardKicker = isHbot
        ? selectedChamber?.brandLabel ?? null
        : selectedHydrogenLine
            ? `${selectedHydrogenLine.order} ${selectedHydrogenLine.title}`
            : null;
    const heroCardSummary = isHydrogen ? selectedHydrogenPage?.heroSummary ?? null : null;

    const hydrogenSnapshotItems: FloatingItem[] = useMemo(() => {
        if (!selectedHydrogenPage || !selectedHydrogenLine) return [];

        return [
            { label: 'Route price', value: getHydrogenPriceRangeLabel(selectedHydrogenPage) },
            {
                label: selectedHydrogenPage.lineId === 'water' ? 'Hydrogen concentration' : 'Output profile',
                value: getHydrogenOutputSummary(selectedHydrogenPage, selectedHydrogenLine.rangeLabel),
            },
            {
                label: 'Configurations',
                value: `${selectedHydrogenPage.variants.length} ${selectedHydrogenPage.variants.length === 1 ? 'model' : 'models'}`,
            },
            { label: 'Delivery', value: getHydrogenDeliveryLabel(selectedHydrogenPage) },
        ];
    }, [selectedHydrogenLine, selectedHydrogenPage]);

    const floatingCardTitle = isHydrogen ? 'Route Snapshot' : 'Hardware Profile';
    const floatingCardItems: FloatingItem[] = isHydrogen
        ? hydrogenSnapshotItems
        : selectedChamber?.specifications.slice(0, 4).map((spec) => ({ label: spec.label, value: spec.value })) ?? [];

    const heroTagline = isHydrogen && selectedHydrogenLine ? selectedHydrogenLine.subtitle : techConfig.tagline;
    const heroIntro = isHydrogen
        ? 'Compare the active hydrogen route, review where it fits in a daily Hylono stack, and jump directly into the exact family before you move into deeper protocol and support details.'
        : 'Compare configurations, review pricing and rental paths, and see how this device fits into a structured Hylono routine before you move into deeper specifications and support resources.';
    const primaryBadgeLabel = isHydrogen ? 'Premium lineup' : 'Guided setup';
    const secondaryBadgeLabel = isHydrogen
        ? `${hydrogenPremiumPages.length} routed pages`
        : ((selectedChamber?.pricing.rent ?? data.rentalPrice) ? 'Rental available' : 'Purchase support');

    const primaryPriceLabel = isHydrogen && selectedHydrogenPage
        ? getHydrogenPriceRangeLabel(selectedHydrogenPage)
        : selectedChamber
            ? (selectedChamber.pricing.buy ? `EUR ${selectedChamber.pricing.buy.toLocaleString()}` : 'Contact for Price')
            : data.price;
    const primaryPriceMeta = isHydrogen && selectedHydrogenPage
        ? 'Route price range'
        : selectedChamber
            ? 'Purchase'
            : 'one-time';

    const secondaryPriceLabel = isHydrogen && selectedHydrogenPage && selectedHydrogenLine
        ? getHydrogenOutputSummary(selectedHydrogenPage, selectedHydrogenLine.rangeLabel)
        : selectedChamber?.pricing.rent?.monthly
            ? `EUR ${selectedChamber.pricing.rent.monthly.toLocaleString()}/mo`
            : data.rentalPrice
                ? `$${data.rentalPrice}/mo`
                : null;
    const secondaryPriceMeta = isHydrogen && selectedHydrogenPage
        ? (selectedHydrogenPage.lineId === 'water' ? 'Hydrogen concentration' : 'Output profile')
        : 'Rental';

    const primaryCtaHref = isHydrogen && selectedHydrogenPage
        ? getHydrogenPremiumPath(selectedHydrogenPage.slug)
        : '/store';
    const primaryCtaLabel = isHydrogen && selectedHydrogenPage
        ? `Open ${selectedHydrogenPage.title}`
        : selectedChamber
            ? `Order ${selectedChamber.fullName}`
            : 'Order Now';
    const secondaryCtaLabel = isHydrogen ? 'Request Guidance' : 'Book Demo';

    const heroSectionStyle = isHydrogen && selectedHydrogenLine
        ? {
            backgroundImage: `radial-gradient(circle at 18% 18%, ${selectedHydrogenLine.glow}, transparent 34%), linear-gradient(180deg, #f7fbff 0%, ${selectedHydrogenLine.accentSoft} 34%, #ffffff 100%)`,
        }
        : undefined;

    const hydrogenVisualStyle = selectedHydrogenLine
        ? {
            background: `radial-gradient(circle at top right, ${selectedHydrogenLine.glow}, transparent 30%), linear-gradient(135deg, ${selectedHydrogenLine.dark} 0%, #07111c 55%, #02060d 100%)`,
        }
        : undefined;

    const toggleType = (type: string) => {
        setExpandedTypes((prev) =>
            prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
        );
    };

    const toggleHydrogenLine = (lineId: HydrogenPremiumLineId) => {
        setExpandedHydrogenLines((prev) =>
            prev.includes(lineId) ? prev.filter((item) => item !== lineId) : [...prev, lineId]
        );
    };

    const handleSelectChamber = (chamberId: string) => {
        const chamber = ALL_CHAMBERS.find((candidate) => candidate.id === chamberId);
        if (!chamber) return;

        if (onSelectHbotChamber) {
            onSelectHbotChamber(chamber.slug);
            return;
        }

        setFallbackSelectedChamberId(chamberId);
    };

    const handleSelectHydrogenPage = (page: HydrogenPremiumPageRecord) => {
        setSelectedHydrogenSlug(page.slug);
        setExpandedHydrogenLines((prev) =>
            prev.includes(page.lineId) ? prev : [...prev, page.lineId]
        );
    };

    return (
        <section
            className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-white"
            style={heroSectionStyle}
        >
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Link
                    href="/store"
                    prefetch={false}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="relative">
                        {heroCardTitle && heroImage ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isHydrogen ? selectedHydrogenPage?.slug ?? 'hydrogen-route' : selectedChamber?.id ?? 'selected-chamber'}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative aspect-[4/3] min-h-[360px] rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/5 group ${isHydrogen ? 'bg-slate-950' : 'bg-white'}`}
                                    style={isHydrogen ? hydrogenVisualStyle : undefined}
                                >
                                    <OptimizedImage
                                        src={heroImage}
                                        alt={heroCardTitle}
                                        fallbackSrc={isHbot && selectedChamber ? PLACEHOLDER_IMAGES[selectedChamber.type] : undefined}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${isHydrogen ? 'object-contain p-8' : 'object-cover'}`}
                                    />
                                    <div className={`absolute inset-0 pointer-events-none ${isHydrogen ? 'bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent' : 'bg-gradient-to-t from-slate-900/30 to-transparent'}`} />

                                    <div className="absolute top-6 left-6 flex flex-wrap items-center gap-3">
                                        <span
                                            className={`text-xs font-bold px-4 py-1.5 rounded-full ${isHydrogen ? 'border text-white backdrop-blur-sm' : selectedChamber?.brand === 'oxyhelp' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'}`}
                                            style={isHydrogen && selectedHydrogenLine
                                                ? {
                                                    borderColor: `${selectedHydrogenLine.accent}55`,
                                                    backgroundColor: `${selectedHydrogenLine.accent}22`,
                                                    color: selectedHydrogenLine.accent,
                                                }
                                                : undefined}
                                        >
                                            {isHydrogen
                                                ? heroCardKicker
                                                : selectedChamber?.brand === 'oxyhelp'
                                                    ? 'EU MADE'
                                                    : 'VALUE SERIES'}
                                        </span>
                                        {isHydrogen && selectedHydrogenPage && (
                                            <span className="text-xs font-bold px-4 py-1.5 rounded-full border border-white/15 bg-white/10 text-white">
                                                {selectedHydrogenPage.variants.length} {selectedHydrogenPage.variants.length === 1 ? 'model' : 'models'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6">
                                        {isHbot && heroCardKicker && (
                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">
                                                {heroCardKicker}
                                            </p>
                                        )}
                                        <h4 className="text-2xl font-black text-white italic tracking-tight">
                                            {heroCardTitle}
                                        </h4>
                                        {heroCardSummary && (
                                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">
                                                {heroCardSummary}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="flex items-center justify-center">
                                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-white to-slate-100 shadow-2xl shadow-slate-200/50 flex items-center justify-center border border-slate-100">
                                    <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${data.accentColor} flex items-center justify-center text-white shadow-xl`}>
                                        {techConfig.icon}
                                    </div>
                                </div>
                            </div>
                        )}

                        {floatingCardItems.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute -bottom-8 -right-4 lg:-right-8 w-72 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl hidden lg:block"
                            >
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">
                                    {floatingCardTitle}
                                </p>
                                <div className="space-y-3">
                                    {floatingCardItems.map((item) => (
                                        <div key={`${item.label}-${item.value}`} className="flex justify-between items-center gap-4 border-b border-white/5 pb-2 last:border-0">
                                            <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                                            <span className="text-xs text-white font-bold text-right">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div id="product-hero" className="lg:sticky lg:top-32">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[11px] bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle size={10} /> {primaryBadgeLabel}
                            </span>
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                {secondaryBadgeLabel}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-none">
                            {techConfig.title}
                        </h1>
                        <p className="text-xl text-slate-500 font-light mb-8 leading-relaxed">
                            {heroTagline}
                        </p>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 mb-8">
                            {heroIntro}
                        </p>

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
                                                <button
                                                    onClick={() => toggleType(type)}
                                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'monoplace' ? 'bg-blue-100 text-blue-600' : type === 'multiplace' ? 'bg-violet-100 text-violet-600' : 'bg-teal-100 text-teal-600'}`}>
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
                                                                {chambers.map((chamber) => {
                                                                    const isSelected = selectedChamber?.id === chamber.id;
                                                                    const inCompare = compareChamberIds.includes(chamber.id);

                                                                    return (
                                                                        <button
                                                                            key={chamber.id}
                                                                            onClick={() => handleSelectChamber(chamber.id)}
                                                                            className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all ${isSelected ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'}`}
                                                                        >
                                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-white bg-white' : 'border-slate-300'}`}>
                                                                                {isSelected && (
                                                                                    <div className="w-3 h-3 rounded-full bg-slate-900" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <span className="text-sm font-semibold truncate block">
                                                                                    {chamber.fullName}
                                                                                </span>
                                                                                <span className={`text-xs mt-1 block ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                                                                    {chamber.tagline}
                                                                                </span>
                                                                                {onToggleCompareChamber && (
                                                                                    <span
                                                                                        role="button"
                                                                                        tabIndex={0}
                                                                                        onClick={(event) => {
                                                                                            event.stopPropagation();
                                                                                            onToggleCompareChamber(chamber.id);
                                                                                        }}
                                                                                        onKeyDown={(event) => {
                                                                                            if (event.key === 'Enter' || event.key === ' ') {
                                                                                                event.preventDefault();
                                                                                                event.stopPropagation();
                                                                                                onToggleCompareChamber(chamber.id);
                                                                                            }
                                                                                        }}
                                                                                        aria-pressed={inCompare}
                                                                                        className={`mt-3 inline-flex min-h-11 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors ${inCompare ? 'bg-cyan-500 text-white border-cyan-500' : isSelected ? 'bg-transparent text-slate-200 border-slate-500 hover:border-cyan-300 hover:text-cyan-100' : 'bg-transparent text-slate-600 border-slate-300 hover:border-cyan-300 hover:text-cyan-700'}`}
                                                                                    >
                                                                                        {inCompare ? 'In compare' : 'Compare'}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {chamber.brand === 'oxyhelp' && (
                                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                                                                    EU
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
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

                        {hydrogenPagesByLine && selectedHydrogenPage && selectedHydrogenLine && (
                            <div className="mb-8">
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                    Select Configuration
                                </p>
                                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    {HYDROGEN_LINE_ORDER.map((lineId) => {
                                        const line = hydrogenPremiumLineMeta[lineId];
                                        const pages = hydrogenPagesByLine[lineId];
                                        if (!pages || pages.length === 0) return null;

                                        const isExpanded = expandedHydrogenLines.includes(lineId);
                                        const isActiveLine = selectedHydrogenPage.lineId === lineId;

                                        return (
                                            <div key={lineId} className="border-b border-slate-100 last:border-0">
                                                <button
                                                    onClick={() => toggleHydrogenLine(lineId)}
                                                    className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${isActiveLine ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black"
                                                            style={{
                                                                backgroundColor: `${line.accent}18`,
                                                                color: line.accent,
                                                            }}
                                                        >
                                                            {line.order}
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="text-sm font-bold text-slate-900">{line.title}</span>
                                                            <span className="text-xs text-slate-400 ml-2">({pages.length})</span>
                                                            <p className="text-xs text-slate-500 mt-1">{line.subtitle}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

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
                                                                {pages.map((page) => {
                                                                    const isSelected = selectedHydrogenPage.slug === page.slug;

                                                                    return (
                                                                        <button
                                                                            key={page.slug}
                                                                            onClick={() => handleSelectHydrogenPage(page)}
                                                                            className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all ${isSelected ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'}`}
                                                                        >
                                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-white bg-white' : 'border-slate-300'}`}>
                                                                                {isSelected && (
                                                                                    <div className="w-3 h-3 rounded-full bg-slate-900" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                                                    <div className="min-w-0">
                                                                                        <span className="text-sm font-semibold block truncate">
                                                                                            {page.title}
                                                                                        </span>
                                                                                        <span className={`text-xs mt-1 block ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                                                                            {page.catalogSummary}
                                                                                        </span>
                                                                                    </div>
                                                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                                                        {getHydrogenPriceRangeLabel(page)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
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

                        <div className="flex items-end gap-8 mb-8">
                            <div>
                                <span className={`font-black text-slate-900 ${isHydrogen ? 'text-3xl' : selectedChamber ? 'text-3xl' : 'text-4xl'}`}>
                                    {primaryPriceLabel}
                                </span>
                                <span className="text-sm text-slate-400 ml-2 uppercase font-bold tracking-tighter">
                                    {primaryPriceMeta}
                                </span>
                            </div>
                            {secondaryPriceLabel && (
                                <div className="border-l border-slate-200 pl-6">
                                    <span className="text-sm text-slate-400 block uppercase font-bold tracking-tighter mb-1">
                                        {secondaryPriceMeta}
                                    </span>
                                    <span className={`text-xl font-bold ${isHydrogen ? 'text-sky-600' : 'text-blue-600'}`}>
                                        {secondaryPriceLabel}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <Link
                                href={primaryCtaHref}
                                prefetch={false}
                                className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                            >
                                <ShoppingBag size={16} />
                                {primaryCtaLabel}
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href={`/contact?tech=${data.id.toLowerCase()}`}
                                prefetch={false}
                                className="flex-1 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-slate-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <Calendar size={16} /> {secondaryCtaLabel}
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            <Link href="/warranty" prefetch={false} className="flex items-center gap-2 hover:text-slate-600 transition-colors">
                                <Shield size={14} className="text-emerald-500" />
                                <span>Warranty Policy</span>
                            </Link>
                            <Link href="/returns" prefetch={false} className="flex items-center gap-2 hover:text-slate-600 transition-colors">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span>Returns Policy</span>
                            </Link>
                            <Link href={`/contact?tech=${data.id.toLowerCase()}`} prefetch={false} className="flex items-center gap-2 hover:text-slate-600 transition-colors">
                                <Phone size={14} className="text-emerald-500" />
                                <span>Contact Support</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {floatingCardItems.length > 0 && (
                <div className="lg:hidden max-w-7xl mx-auto px-6 mt-12">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">
                            {floatingCardTitle}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {floatingCardItems.slice(0, 6).map((item) => (
                                <div key={`${item.label}-${item.value}`} className="space-y-0.5">
                                    <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                                    <p className="text-sm font-bold text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
