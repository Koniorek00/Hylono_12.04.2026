"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ViewMode, TechType, ChamberType } from '../types';
import { HbotVisual, PemfVisual, RltVisual, HydrogenVisual } from './Visualizations';
import { ArrowLeft, ArrowRight, Play, CheckCircle, Shield, Zap, Brain, Activity, Wind, Sun, Droplets, Sparkles, ChevronDown, ChevronUp, Clock, AlertTriangle, Phone, Star, Quote, Moon, Sunrise, Building2, TrendingUp, Users, Pill, BarChart2, Target, FlaskConical, BookOpen, Video, ChevronRight, Flame, Thermometer, Radio, Mountain, Snowflake, Package, Headphones, Eye, Ear, Leaf, Heart, X } from 'lucide-react';
import { SmartText } from './SmartText';
import { motion, AnimatePresence } from 'motion/react';
import { useTech } from '../hooks/useTech';
import { TechAddons } from './product/detail/TechAddons';
import { TechHero } from './product/detail/TechHero';
import { productById } from '../content/products';
import { disclaimers } from '../content/disclaimers';
import { protocols } from '../content/protocols';
import { toProtocolCardView } from '../content/protocolView';
import { RESEARCH_STUDIES } from '../constants/content';
import { ReviewsSection } from './ReviewSystem';
import { ALL_CHAMBERS, getChamberBySlug } from '../constants/chambers';
import { batch3DocumentsByTech, batch3PdpContent, getBatch3SpecAnnotation } from '../content/batch3';
import { ProtocolCard } from './protocols/ProtocolCard';
import { FeatureGate } from './FeatureGate';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { pdpCommerceContent } from '../content/pdpCommerce';
import { ChamberCompare5, ChamberCompareDock5 } from './ChamberCompare5';
import { OptimizedImage } from './shared/OptimizedImage';
import { MedicalDisclaimer } from './shared/MedicalDisclaimer';
import { useCart } from './Cart';
import { ResearchOverviewSection } from './product/detail/ResearchOverviewSection';
import { TechDetailDeliverySection } from './product/detail/TechDetailDeliverySection';
import { TechDetailTimelineSection } from './product/detail/TechDetailTimelineSection';
import { RESULT_TIMELINES } from './product/detail/resultTimelines';

function renderChamberDescription(text: string): React.ReactNode {
    return text.split('\n').map((line, i) => {
        if (line.trim() === '') return <br key={`br-${i}`} />;

        const parts = line.split(/\*\*(.*?)\*\*/g);
        const rendered = parts.map((part, j) => (j % 2 === 1 ? <strong key={`${i}-${j}`}>{part}</strong> : part));

        if (line.startsWith('**') && line.endsWith('**')) {
            return (
                <h4 key={`h-${i}`} className="text-base font-bold text-slate-900 mt-5 mb-2">
                    {parts[1]}
                </h4>
            );
        }

        if (line.startsWith('- ')) {
            return (
                <li key={`li-${i}`} className="flex items-start gap-2 text-slate-700 text-sm leading-relaxed">
                    <span className="text-cyan-500 mt-1 shrink-0">•</span>
                    <span>{rendered}</span>
                </li>
            );
        }

        return (
            <p key={`p-${i}`} className="text-slate-700 text-sm leading-relaxed mb-2">
                {rendered}
            </p>
        );
    });
}

interface TechDetailProps {
    techId: TechType;
    onBack: () => void;
    onJumpToTech: (id: TechType) => void;
    onNavigate?: (page: string) => void;
    ownedTech?: TechType[];
}

const TECH_ICONS: Record<TechType, React.ReactNode> = {
    [TechType.HBOT]: <Wind size={32} />,
    [TechType.PEMF]: <Activity size={32} />,
    [TechType.RLT]: <Sun size={32} />,
    [TechType.HYDROGEN]: <Droplets size={32} />,
    [TechType.EWOT]: <Flame size={32} />,
    [TechType.SAUNA_BLANKET]: <Thermometer size={32} />,
    [TechType.EMS]: <Zap size={32} />,
    [TechType.VNS]: <Radio size={32} />,
    [TechType.HYPOXIC]: <Mountain size={32} />,
    [TechType.CRYO]: <Snowflake size={32} />,
};

const TECH_GRADIENTS: Record<TechType, string> = {
    [TechType.HBOT]: "from-cyan-500/10 via-blue-500/5 to-white",
    [TechType.PEMF]: "from-purple-500/10 via-fuchsia-500/5 to-white",
    [TechType.RLT]: "from-red-500/10 via-orange-500/5 to-white",
    [TechType.HYDROGEN]: "from-sky-500/10 via-teal-500/5 to-white",
    [TechType.EWOT]: "from-orange-500/10 via-amber-500/5 to-white",
    [TechType.SAUNA_BLANKET]: "from-amber-500/10 via-yellow-500/5 to-white",
    [TechType.EMS]: "from-violet-500/10 via-purple-500/5 to-white",
    [TechType.VNS]: "from-teal-500/10 via-emerald-500/5 to-white",
    [TechType.HYPOXIC]: "from-indigo-500/10 via-blue-500/5 to-white",
    [TechType.CRYO]: "from-sky-300/10 via-blue-300/5 to-white",
};

const CART_ITEM_GRADIENTS: Record<TechType, string> = {
    [TechType.HBOT]: 'from-cyan-500 to-blue-500',
    [TechType.PEMF]: 'from-purple-500 to-fuchsia-500',
    [TechType.RLT]: 'from-red-500 to-orange-500',
    [TechType.HYDROGEN]: 'from-sky-500 to-teal-500',
    [TechType.EWOT]: 'from-orange-500 to-amber-500',
    [TechType.SAUNA_BLANKET]: 'from-amber-500 to-yellow-500',
    [TechType.EMS]: 'from-violet-500 to-purple-500',
    [TechType.VNS]: 'from-teal-500 to-emerald-500',
    [TechType.HYPOXIC]: 'from-indigo-500 to-blue-500',
    [TechType.CRYO]: 'from-sky-400 to-blue-400',
};

const HBOT_DEFAULT_CHAMBER_SLUG = 'oxylife-i-90';
const HBOT_TYPE_ORDER: ChamberType[] = ['monoplace', 'multiplace', 'soft'];
const HBOT_TYPE_LABELS: Record<ChamberType, string> = {
    monoplace: 'Monoplace',
    multiplace: 'Multiplace',
    soft: 'Soft Chamber',
};

const TECH_ROUTE_CLUSTER_LINKS: Partial<
    Record<TechType, Array<{ href: string; label: string }>>
> = {
    [TechType.HBOT]: [
        { href: '/conditions/recovery', label: 'Recovery condition' },
        { href: '/conditions/vitality', label: 'Vitality condition' },
    ],
    [TechType.PEMF]: [
        { href: '/conditions/recovery', label: 'Recovery condition' },
        { href: '/conditions/sleep', label: 'Sleep condition' },
    ],
    [TechType.RLT]: [
        { href: '/conditions/comfort', label: 'Comfort condition' },
        { href: '/conditions/recovery', label: 'Recovery condition' },
    ],
    [TechType.HYDROGEN]: [
        { href: '/conditions/stress', label: 'Stress condition' },
        { href: '/conditions/vitality', label: 'Vitality condition' },
    ],
};
const HBOT_TYPE_BADGE_CLASSES: Record<ChamberType, string> = {
    monoplace: 'bg-blue-100 text-blue-700',
    multiplace: 'bg-violet-100 text-violet-700',
    soft: 'bg-teal-100 text-teal-700',
};

type PurchaseTrack = 'purchase' | 'rental';

const TECH_TO_CONTENT_PRODUCT_ID: Partial<Record<TechType, string>> = {
    [TechType.HBOT]: 'hbot-st1700',
    [TechType.HYDROGEN]: 'h2-hop450',
};

const FALLBACK_INSTALLMENT_MONTHS = [12, 24, 36, 48] as const;

const formatEuro = (value: number): string =>
    new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(value);

const parseNumericAmount = (value: string | undefined): number => {
    if (!value) return 0;
    const normalized = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(normalized) ? normalized : 0;
};

const parsePeriodToMonths = (period: string): number => {
    const match = period.match(/(\d+)/);
    if (!match) return 1;
    const numeric = Number(match[1]);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 1;
};

export const TechDetail: React.FC<TechDetailProps> = ({ techId, onBack, onJumpToTech, onNavigate, ownedTech = [] }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const modeParam = searchParams.get('mode');
    const { getTechDetails, getTechKnowledge } = useTech();
    const data = getTechDetails(techId);
    const knowledge = getTechKnowledge(techId);
    const pdpTrustHierarchyEnabled = useFeatureFlag('feature_pdp_trust_hierarchy');
    const pdpEvidenceEnabled = useFeatureFlag('feature_pdp_evidence');
    const pdpDocumentsEnabled = useFeatureFlag('feature_pdp_documents');
    const pdpContraindicationsEnabled = useFeatureFlag('feature_pdp_contraindications');
    const pdpSpecAnnotationsEnabled = useFeatureFlag('feature_pdp_spec_annotations');
    const pdpAdvisorCtaEnabled = useFeatureFlag('feature_pdp_advisor_cta');
    const pdpTradeInEnabled = useFeatureFlag('feature_pdp_tradein');
    const pdpDualTrackEnabled = useFeatureFlag('feature_pdp_dual_track');
    const pdpStickyCtaEnabled = useFeatureFlag('feature_pdp_sticky_cta');
    const pdpFinancingDrawerEnabled = useFeatureFlag('feature_pdp_financing_drawer');
    const { addItem } = useCart();

    const [mode, setMode] = useState<ViewMode>(ViewMode.STANDARD);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [showSafety, setShowSafety] = useState(false);
    const [expandedContraindication, setExpandedContraindication] = useState<string | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [showFinancing, setShowFinancing] = useState(false);
    const [loanTerm, setLoanTerm] = useState(24);
    const [showDelivery, setShowDelivery] = useState(false);
    const [selectedHbotChamberSlug, setSelectedHbotChamberSlug] = useState<string>(HBOT_DEFAULT_CHAMBER_SLUG);
    const [expandedHbotTypes, setExpandedHbotTypes] = useState<ChamberType[]>(['monoplace']);
    const [activeTrack, setActiveTrack] = useState<PurchaseTrack>(
        modeParam?.toLowerCase() === 'rental' ? 'rental' : 'purchase'
    );
    const [selectedRentalPeriod, setSelectedRentalPeriod] = useState<string>('');
    const [isCommercePanelInView, setIsCommercePanelInView] = useState(true);
    const [showMobileTrackDrawer, setShowMobileTrackDrawer] = useState(false);
    const [compareChamberIds, setCompareChamberIds] = useState<string[]>([]);
    const [showChamberCompareModal, setShowChamberCompareModal] = useState(false);
    const dualTrackPanelRef = useRef<HTMLDivElement | null>(null);

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const isExpert = mode === ViewMode.EXPERT;
    const gradientClass = TECH_GRADIENTS[data.id];
    const productDocuments = batch3DocumentsByTech[data.id] ?? [];
    const techSlug = data.id.toLowerCase();
    const productRentalHref = `/rental?device=${techSlug}`;
    const productContactHref = `/contact?tech=${techSlug}`;
    const guidanceUpdatedLabel = data.lastReviewed
        ? new Date(data.lastReviewed).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;
    const rentalCommitmentMonths = parsePeriodToMonths(data.rentalTerms ?? '1 month');
    const mappedProduct = useMemo(() => {
        const productId = TECH_TO_CONTENT_PRODUCT_ID[data.id];
        return productId ? productById[productId] : undefined;
    }, [data.id]);

    const rentalPlans = mappedProduct?.rentalPlans ?? [];
    const installmentOptions = mappedProduct?.installmentOptions ?? [];
    const purchasePriceValue = mappedProduct?.purchasePrice ?? parseNumericAmount(data.price);
    const purchasePriceLabel = purchasePriceValue > 0 ? formatEuro(purchasePriceValue) : data.price;
    const financingHint = mappedProduct?.financingEligible && mappedProduct.financingMonthlyFrom
        ? `or from ${formatEuro(mappedProduct.financingMonthlyFrom)}/mo`
        : (data.financing ? `or ${data.financing}` : null);

    const selectedRentalPlan = useMemo(() => {
        if (rentalPlans.length === 0) return undefined;
        return rentalPlans.find((plan) => plan.period === selectedRentalPeriod) ?? rentalPlans[0];
    }, [rentalPlans, selectedRentalPeriod]);

    const fallbackInstallmentOptions = useMemo(() => {
        if (!purchasePriceValue) return [];

        return FALLBACK_INSTALLMENT_MONTHS.map((months) => {
            const monthlyAmount = Math.round(purchasePriceValue / months);
            const interestRate = months <= 24 ? 0 : 3.9;

            return {
                months,
                monthlyAmount,
                interestRate,
            };
        });
    }, [purchasePriceValue]);

    const availableInstallmentOptions = installmentOptions.length > 0 ? installmentOptions : fallbackInstallmentOptions;
    const rentalBaselineMonthly = rentalPlans[0]?.monthlyPrice ?? data.rentalPrice ?? 0;
    const activeRentalMonthly = selectedRentalPlan?.monthlyPrice ?? rentalBaselineMonthly;
    const rentalPriceLabel = activeRentalMonthly > 0 ? `${formatEuro(activeRentalMonthly)}/mo` : null;
    const rentalDepositLabel = selectedRentalPlan?.deposit ? formatEuro(selectedRentalPlan.deposit) : null;
    const rentalMinimumPeriod = selectedRentalPlan?.minPeriod ?? data.rentalTerms ?? '1 month';
    const anxietyBufferItems = activeTrack === 'purchase' ? pdpCommerceContent.anxietyBuffers.purchase : pdpCommerceContent.anxietyBuffers.rental;
    const activeInstallment = availableInstallmentOptions.find((option) => option.months === loanTerm) ?? availableInstallmentOptions[0];

    const stickyDesktopPrice = activeTrack === 'purchase'
        ? purchasePriceLabel
        : (rentalPriceLabel ? `from ${rentalPriceLabel}` : pdpCommerceContent.trackLabels.rent);
    const stickyMobilePrice = activeTrack === 'purchase'
        ? purchasePriceLabel
        : (rentalPriceLabel ? `from ${rentalPriceLabel}` : pdpCommerceContent.pricing.rentalUnavailable);

    const activeTrackCtaLabel = activeTrack === 'purchase' ? pdpCommerceContent.cta.stickyAddToCart : pdpCommerceContent.cta.stickyTryIt;
    const mobilePrimaryLabel = activeTrack === 'purchase' ? pdpCommerceContent.cta.mobileBuy : pdpCommerceContent.cta.mobileRent;
    const alternativeTrack: PurchaseTrack = activeTrack === 'purchase' ? 'rental' : 'purchase';
    const alternativeTrackLabel = alternativeTrack === 'purchase' ? pdpCommerceContent.trackLabels.buyLower : pdpCommerceContent.trackLabels.rentLower;

    const addCurrentTechToCart = () => {
        addItem({
            id: `tech-${data.id.toLowerCase()}`,
            name: data.name,
            price: parseNumericAmount(data.price),
            image: CART_ITEM_GRADIENTS[data.id] ?? 'from-slate-400 to-slate-600',
        });
    };

    const handlePrimaryTrackAction = () => {
        if (activeTrack === 'purchase') {
            addCurrentTechToCart();
            return;
        }

        navigateToPage(`rental?device=${techSlug}`);
    };

    const handleSwitchTrack = (track: PurchaseTrack) => {
        setActiveTrack(track);
        setShowMobileTrackDrawer(false);
    };

    const calculateRentalSavings = (monthlyPrice: number, period: string): number => {
        if (!rentalBaselineMonthly || rentalBaselineMonthly <= monthlyPrice) return 0;
        const months = parsePeriodToMonths(period);
        return Math.max(0, (rentalBaselineMonthly - monthlyPrice) * months);
    };
    const contentCommerceProductId = TECH_TO_CONTENT_PRODUCT_ID[data.id];

    // Derived: matching research study for social proof strip — mapped by trace_id for precision
    const studyTraceIdMap: Partial<Record<TechType, string>> = {
        [TechType.HBOT]: 'HBOT-SPEC-001',
        [TechType.PEMF]: 'PEMF-SPEC-001',
        [TechType.RLT]: 'RLT-SPEC-001',
        [TechType.HYDROGEN]: 'H2-SPEC-001',
        [TechType.EWOT]: 'EWOT-SPEC-001',
        [TechType.SAUNA_BLANKET]: 'SAUNA-SPEC-001',
        [TechType.EMS]: 'EMS-SPEC-001',
        [TechType.VNS]: 'VNS-SPEC-001',
        [TechType.HYPOXIC]: 'HYPOXIC-SPEC-001',
        [TechType.CRYO]: 'CRYO-SPEC-001',
    };
    const relatedStudy = RESEARCH_STUDIES.find(s => s.trace_id === studyTraceIdMap[data.id]);

    const relatedProtocolModalitiesByTech: Partial<Record<TechType, string[]>> = {
        [TechType.HBOT]: ['HBOT'],
        [TechType.HYDROGEN]: ['H2'],
        [TechType.RLT]: ['RLT'],
        [TechType.PEMF]: ['PEMF'],
        [TechType.VNS]: ['PEMF'],
    };

    const relatedProtocolCards = useMemo(() => {
        const mappedModalities = relatedProtocolModalitiesByTech[data.id] ?? [];
        if (mappedModalities.length === 0) return [];

        return protocols
            .map((protocol) => toProtocolCardView(protocol.slug))
            .filter((card): card is NonNullable<typeof card> => Boolean(card))
            .filter((card) => card.modalities.some((modality) => mappedModalities.includes(modality)));
    }, [data.id]);
    const routeClusterLinks = useMemo(() => {
        const baseLinks = TECH_ROUTE_CLUSTER_LINKS[data.id] ?? [];
        const protocolLinks = relatedProtocolCards.slice(0, 2).map((protocolCard) => ({
            href: `/protocols/${protocolCard.slug}`,
            label: protocolCard.title,
        }));
        const utilityLinks = [
            { href: '/research', label: 'Research evidence' },
            { href: '/rental', label: 'Rental planning' },
            { href: '/contact', label: 'Talk to Hylono' },
        ];

        const seen = new Set<string>();

        return [...baseLinks, ...protocolLinks, ...utilityLinks].filter((link) => {
            if (seen.has(link.href)) {
                return false;
            }

            seen.add(link.href);
            return true;
        });
    }, [data.id, relatedProtocolCards]);

    const resultTimeline = RESULT_TIMELINES[data.id];

    const hbotChambersByType = useMemo(() => {
        return {
            monoplace: ALL_CHAMBERS.filter((c) => c.type === 'monoplace'),
            multiplace: ALL_CHAMBERS.filter((c) => c.type === 'multiplace'),
            soft: ALL_CHAMBERS.filter((c) => c.type === 'soft'),
        } as Record<ChamberType, typeof ALL_CHAMBERS>;
    }, []);

    const selectedHbotChamber = useMemo(() => {
        if (data.id !== TechType.HBOT) return null;

        return (
            getChamberBySlug(selectedHbotChamberSlug) ??
            getChamberBySlug(HBOT_DEFAULT_CHAMBER_SLUG) ??
            ALL_CHAMBERS[0] ??
            null
        );
    }, [data.id, selectedHbotChamberSlug]);

    const selectedHbotHeroImage = useMemo(() => {
        if (!selectedHbotChamber) return null;
        return selectedHbotChamber.images.find((img) => img.role === 'hero')?.url ?? null;
    }, [selectedHbotChamber]);

    const selectedCompareChambers = useMemo(() => {
        if (compareChamberIds.length === 0) return [];
        return ALL_CHAMBERS.filter((chamber) => compareChamberIds.includes(chamber.id));
    }, [compareChamberIds]);

    const isChamberInCompare = (chamberId: string) => compareChamberIds.includes(chamberId);

    const toggleCompareChamber = (chamberId: string) => {
        setCompareChamberIds((prev) => {
            if (prev.includes(chamberId)) {
                return prev.filter((id) => id !== chamberId);
            }

            if (prev.length >= 3) return prev;
            return [...prev, chamberId];
        });
    };

    const removeCompareChamber = (chamberId: string) => {
        setCompareChamberIds((prev) => prev.filter((id) => id !== chamberId));
    };

    const clearCompareChambers = () => {
        setCompareChamberIds([]);
        setShowChamberCompareModal(false);
    };

    useEffect(() => {
        if (searchParams.get('view') === 'science') {
            setMode(ViewMode.EXPERT);
            return;
        }

        setMode(ViewMode.STANDARD);
    }, [searchParams, techId]);

    useEffect(() => {
        if (modeParam?.toLowerCase() === 'rental') {
            setActiveTrack('rental');
            return;
        }

        if (typeof document !== 'undefined' && document.referrer.includes('/rental')) {
            setActiveTrack('rental');
        }
    }, [modeParam]);

    useEffect(() => {
        if (data.id !== TechType.HBOT) return;

        const urlSlug = searchParams.get('chamber');

        if (urlSlug && getChamberBySlug(urlSlug)) {
            setSelectedHbotChamberSlug(urlSlug);
            return;
        }

        setSelectedHbotChamberSlug(HBOT_DEFAULT_CHAMBER_SLUG);
    }, [data.id, searchParams]);

    useEffect(() => {
        if (!selectedHbotChamber) return;

        setExpandedHbotTypes((prev) =>
            prev.includes(selectedHbotChamber.type) ? prev : [...prev, selectedHbotChamber.type]
        );
    }, [selectedHbotChamber]);

    useEffect(() => {
        if (rentalPlans.length === 0) {
            setSelectedRentalPeriod('');
            return;
        }

        setSelectedRentalPeriod((previous) => {
            if (previous && rentalPlans.some((plan) => plan.period === previous)) {
                return previous;
            }

            const firstPlan = rentalPlans[0];
            return firstPlan?.period ?? '';
        });
    }, [rentalPlans]);

    useEffect(() => {
        if (availableInstallmentOptions.length === 0) return;

        setLoanTerm((previous) => {
            if (availableInstallmentOptions.some((option) => option.months === previous)) {
                return previous;
            }

            const firstInstallment = availableInstallmentOptions[0];
            return firstInstallment?.months ?? previous;
        });
    }, [availableInstallmentOptions]);

    useEffect(() => {
        if (!(pdpDualTrackEnabled && pdpStickyCtaEnabled)) {
            setIsCommercePanelInView(true);
            return;
        }

        const panelNode = dualTrackPanelRef.current;
        if (!panelNode) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsCommercePanelInView(entry?.isIntersecting ?? false);
            },
            {
                threshold: 0.25,
            }
        );

        observer.observe(panelNode);

        return () => observer.disconnect();
    }, [pdpDualTrackEnabled, pdpStickyCtaEnabled, data.id]);

    useEffect(() => {
        if (!(showFinancing || showMobileTrackDrawer)) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [showFinancing, showMobileTrackDrawer]);

    const toggleHbotType = (type: ChamberType) => {
        setExpandedHbotTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const selectHbotChamber = (slug: string) => {
        setSelectedHbotChamberSlug(slug);

        const params = new URLSearchParams(searchParams.toString());
        params.set('chamber', slug);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const toggleMode = (newMode: ViewMode) => {
        setMode(newMode);
        const params = new URLSearchParams(searchParams.toString());
        if (newMode === ViewMode.EXPERT) params.set('view', 'science');
        else params.delete('view');
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    const navigateToPage = (page: string) => {
        if (onNavigate) {
            onNavigate(page);
            return;
        }

        router.push(`/${page}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* === HERO SECTION === */}
            <TechHero data={data} onBack={onBack} onNavigate={onNavigate} />

            <FeatureGate flag="feature_pdp_dual_track">
                <section className="py-12 bg-white border-b border-slate-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div
                            ref={dualTrackPanelRef}
                            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm"
                        >
                            <div className="inline-flex w-full sm:w-auto bg-slate-100 p-1 rounded-2xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveTrack('purchase')}
                                    className={`flex-1 sm:flex-none min-h-11 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                                        activeTrack === 'purchase' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    aria-pressed={activeTrack === 'purchase'}
                                >
                                    {pdpCommerceContent.trackLabels.buy}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTrack('rental')}
                                    className={`flex-1 sm:flex-none min-h-11 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                                        activeTrack === 'rental' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    aria-pressed={activeTrack === 'rental'}
                                >
                                    {pdpCommerceContent.trackLabels.rent}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTrack === 'purchase' ? (
                                    <motion.div
                                        key="purchase-track"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex flex-wrap items-end gap-3 mb-2">
                                            <span className="text-3xl md:text-4xl font-black text-slate-900">{purchasePriceLabel}</span>
                                            <span className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold pb-1">{pdpCommerceContent.trackLabels.purchaseBadge}</span>
                                        </div>

                                        {financingHint && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!pdpFinancingDrawerEnabled) return;
                                                    setShowFinancing(true);
                                                }}
                                                className={`text-sm font-semibold ${pdpFinancingDrawerEnabled ? 'text-cyan-600 hover:text-cyan-700 underline underline-offset-4' : 'text-slate-500 cursor-default'}`}
                                                aria-label={pdpCommerceContent.pricing.financingAriaLabel}
                                            >
                                                {financingHint}
                                            </button>
                                        )}

                                        <div className="mt-5">
                                            <button
                                                type="button"
                                                onClick={handlePrimaryTrackAction}
                                                className="w-full sm:w-auto min-h-11 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-[0.18em] hover:bg-slate-800 transition-colors"
                                            >
                                                {pdpCommerceContent.cta.addToCart}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="rental-track"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex flex-wrap items-end gap-3 mb-1">
                                            <span className="text-3xl md:text-4xl font-black text-slate-900">{rentalPriceLabel ?? pdpCommerceContent.pricing.rentalUnavailable}</span>
                                            <span className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold pb-1">{pdpCommerceContent.trackLabels.rentalBadge}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{pdpCommerceContent.pricing.minimumPeriodPrefix} {rentalMinimumPeriod}</p>
                                        {rentalDepositLabel && (
                                            <p className="text-sm text-slate-600">{pdpCommerceContent.pricing.refundableDepositPrefix} {rentalDepositLabel}</p>
                                        )}

                                        {rentalPlans.length > 0 && (
                                            <div className="mt-5 space-y-2">
                                                {rentalPlans.map((plan) => {
                                                    const isSelected = selectedRentalPlan?.period === plan.period;
                                                    const savings = calculateRentalSavings(plan.monthlyPrice, plan.period);

                                                    return (
                                                        <button
                                                            key={plan.period}
                                                            type="button"
                                                            onClick={() => setSelectedRentalPeriod(plan.period)}
                                                            className={`w-full text-left min-h-11 rounded-xl border px-4 py-3 transition-colors ${isSelected ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-slate-300'}`}
                                                        >
                                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                                <span className="text-sm font-semibold text-slate-900">
                                                                    {plan.period} — {formatEuro(plan.monthlyPrice)}/mo
                                                                </span>
                                                                {savings > 0 && (
                                                                    <span className="text-xs font-semibold text-emerald-600">
                                                                        {pdpCommerceContent.pricing.savingsPrefix} {formatEuro(savings)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="mt-5">
                                            <Link
                                                href={productRentalHref}
                                                className="inline-flex w-full sm:w-auto min-h-11 items-center justify-center px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-[0.18em] hover:bg-slate-800 transition-colors"
                                            >
                                                {pdpCommerceContent.cta.tryIt}
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <ul className="space-y-2">
                                    {anxietyBufferItems.map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
                                    {disclaimers.pdp}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </FeatureGate>

            <section className="py-8 bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                            Browse the route
                        </p>
                        <h2 className="mt-2 text-xl font-bold text-slate-900">
                            Connect this device to conditions, research, protocols, and next steps
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm text-slate-600">
                            Use these direct links to move from the product detail into planning, evidence review, and practical next-step pages.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {routeClusterLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* === HBOT TOP MODEL SPOTLIGHT === */}
            {data.id === TechType.HBOT && selectedHbotChamber && (
                <section className="py-12 bg-white border-b border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Active HBOT Configuration</span>
                                <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedHbotChamber.fullName}</h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">{selectedHbotChamber.shortDescription}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedHbotChamber.specifications.slice(0, 4).map((spec) => (
                                        <div key={spec.label} className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">{spec.label}</span>
                                            <span className="text-sm font-bold text-slate-900">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
                                {selectedHbotHeroImage ? (
                                    <OptimizedImage
                                        src={selectedHbotHeroImage}
                                        alt={selectedHbotChamber.fullName}
                                        width={1200}
                                        height={680}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="w-full h-[280px] md:h-[340px] object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-[280px] md:h-[340px] bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-semibold">
                                        Chamber image coming soon
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <TechDetailDeliverySection
                dataName={data.name}
                showDelivery={showDelivery}
                onToggleDelivery={() => setShowDelivery((current) => !current)}
            />

{/* === RESEARCH SOCIAL PROOF STRIP === */}
            {relatedStudy && (
                <section id="research" className="py-8 bg-slate-900 border-b border-slate-800">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                            <div className="flex items-center gap-5">
                                <div className="text-4xl font-black text-cyan-400 tabular-nums">{relatedStudy.value}</div>
                                <div>
                                    <div className="text-white font-bold text-sm">{relatedStudy.metric}</div>
                                    <div className="text-slate-400 text-xs mt-0.5">{relatedStudy.title}</div>
                                </div>
                            </div>
                            <div className="hidden md:block w-px h-10 bg-slate-700" />
                            <div className="flex items-center gap-4 text-slate-400 text-xs flex-wrap justify-center">
                                <span className="flex items-center gap-1.5">
                                    <Users size={13} className="text-slate-500" />
                                    <strong className="text-slate-300">{relatedStudy.participants}</strong> participants
                                </span>
                                <span className="text-slate-700">·</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${relatedStudy.status === 'Published' ? 'bg-emerald-900/50 text-emerald-400' : relatedStudy.status === 'Peer Review' ? 'bg-blue-900/50 text-blue-400' : 'bg-amber-900/50 text-amber-400'}`}>
                                    {relatedStudy.status}
                                </span>
                                {relatedStudy.pubmedUrl && (
                                    <a href={relatedStudy.pubmedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-500 hover:text-cyan-400 transition-colors">
                                        <BookOpen size={12} /> PubMed →
                                    </a>
                                )}
                            </div>
                            <div className="hidden md:block w-px h-10 bg-slate-700" />
                            <p className="text-slate-400 text-xs max-w-xs text-center md:text-left leading-relaxed">{relatedStudy.description}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* === DESCRIPTION with inline View Toggle === */}
            <section id="description" className="py-20 bg-white">
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
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {data.technicalSpecs.map((spec) => {
                                        const annotation = pdpSpecAnnotationsEnabled
                                            ? getBatch3SpecAnnotation(data.id, spec.label)
                                            : null;

                                        return (
                                            <div key={spec.label} className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
                                                <span className="text-[10px] uppercase tracking-wider text-cyan-400 block mb-1">{spec.label}</span>
                                                <span className="text-xl font-mono font-bold text-white">{spec.value}</span>
                                                {annotation && (
                                                    <p className="text-[11px] leading-relaxed text-cyan-100/70 mt-2">{annotation}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {data.molecularPathways && data.molecularPathways.length > 0 && (
                                    <div className="border-t border-slate-700 pt-5">
                                        <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-3">Active Molecular Pathways</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.molecularPathways.map((pathway) => (
                                                <span key={pathway} className="text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full font-mono">
                                                    {pathway}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content Freshness */}
                    {guidanceUpdatedLabel && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <CheckCircle size={12} className="text-emerald-500" />
                                <span>Guidance updated: {guidanceUpdatedLabel}</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {pdpTrustHierarchyEnabled && (
                <section id="trust" className="py-14 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-8">
                            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Trust Signal</span>
                            <h2 className="text-2xl font-bold text-slate-900">Why this product made our shortlist</h2>
                            <p className="text-sm text-slate-500 mt-3 max-w-2xl mx-auto">
                                {batch3PdpContent.trustHierarchy.whySelected}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Documentation</span>
                                <p className="text-sm font-semibold text-slate-900">
                                    {productDocuments.length > 0
                                        ? `${productDocuments.length} downloadable document${productDocuments.length > 1 ? 's' : ''}`
                                        : 'Documentation available on request'}
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Protocol Readiness</span>
                                <p className="text-sm font-semibold text-slate-900">{batch3PdpContent.trustHierarchy.protocolSignal}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Content Status</span>
                                <p className="text-sm font-semibold text-slate-900">
                                    {guidanceUpdatedLabel ? `Updated ${guidanceUpdatedLabel}` : 'Evidence and policy links available on this route'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === HBOT CONFIGURATION SELECTOR (SSOT from chambers.ts) === */}
            {data.id === TechType.HBOT && selectedHbotChamber && (
                <section id="hbot-config" className="py-16 bg-slate-50 border-y border-slate-200">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-10">
                            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">HBOT Models</span>
                            <h2 className="text-3xl font-bold text-slate-900">Select Configuration</h2>
                            <p className="text-slate-500 mt-3 text-sm max-w-2xl mx-auto">
                                Model-specific content below updates from the same source used by chamber detail pages.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            {HBOT_TYPE_ORDER.map((type) => {
                                const chambers = hbotChambersByType[type];
                                if (!chambers || chambers.length === 0) return null;

                                const isExpanded = expandedHbotTypes.includes(type);
                                const isTypeSelected = selectedHbotChamber.type === type;

                                return (
                                    <div key={type} className="border-b border-slate-100 last:border-b-0">
                                        <button
                                            onClick={() => toggleHbotType(type)}
                                            className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${isTypeSelected ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${HBOT_TYPE_BADGE_CLASSES[type]}`}>
                                                    {HBOT_TYPE_LABELS[type]}
                                                </span>
                                                <span className="text-xs text-slate-400">{chambers.length} model{chambers.length > 1 ? 's' : ''}</span>
                                            </div>
                                            {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {chambers.map((chamber) => {
                                                            const isSelected = chamber.slug === selectedHbotChamber.slug;
                                                            return (
                                                                <button
                                                                    key={chamber.id}
                                                                    onClick={() => selectHbotChamber(chamber.slug)}
                                                                    className={`text-left p-4 rounded-2xl border transition-all ${isSelected ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                                >
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <div>
                                                                            <h3 className="font-bold text-sm">{chamber.fullName}</h3>
                                                                            <p className={`text-xs mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                                                                {chamber.tagline}
                                                                            </p>
                                                                        </div>
                                                                        {chamber.brand === 'oxyhelp' && (
                                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                                                                                EU
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <div className="mt-3 pt-3 border-t border-slate-200/70">
                                                                        <span
                                                                            role="button"
                                                                            tabIndex={0}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                toggleCompareChamber(chamber.id);
                                                                            }}
                                                                            onKeyDown={(event) => {
                                                                                if (event.key === 'Enter' || event.key === ' ') {
                                                                                    event.preventDefault();
                                                                                    event.stopPropagation();
                                                                                    toggleCompareChamber(chamber.id);
                                                                                }
                                                                            }}
                                                                            aria-pressed={isChamberInCompare(chamber.id)}
                                                                            className={`inline-flex min-h-11 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors ${isChamberInCompare(chamber.id)
                                                                                    ? 'bg-cyan-500 text-white border-cyan-500'
                                                                                    : 'bg-transparent text-slate-600 border-slate-300 hover:border-cyan-300 hover:text-cyan-700'
                                                                                }`}
                                                                        >
                                                                            {isChamberInCompare(chamber.id) ? 'In compare' : 'Compare'}
                                                                        </span>
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
                </section>
            )}

            {/* === HBOT COMPARE DOCK + MODAL === */}
            {data.id === TechType.HBOT && selectedCompareChambers.length > 0 && (
                <>
                    <ChamberCompareDock5
                        chambers={selectedCompareChambers}
                        onRemove={removeCompareChamber}
                        onClear={clearCompareChambers}
                        onOpenCompare={() => setShowChamberCompareModal(true)}
                    />

                    <AnimatePresence>
                        {showChamberCompareModal && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[95]"
                                    onClick={() => setShowChamberCompareModal(false)}
                                />
                                <motion.div
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="chamber-compare-modal-title"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed inset-x-3 md:inset-x-8 top-[5vh] bottom-[5vh] z-[96] rounded-2xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden"
                                >
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                                        <h3 id="chamber-compare-modal-title" className="text-base font-bold text-white">HBOT Chamber Comparison</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowChamberCompareModal(false)}
                                            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                                            aria-label="Close comparison"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    <div className="h-[calc(100%-73px)] overflow-auto p-4 md:p-6">
                                        <ChamberCompare5
                                            chambers={selectedCompareChambers}
                                            onRemove={removeCompareChamber}
                                            onClear={clearCompareChambers}
                                            onNavigate={(slug) => {
                                                const selected = getChamberBySlug(slug);
                                                if (selected) {
                                                    selectHbotChamber(slug);
                                                    setShowChamberCompareModal(false);
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* === HBOT MODEL-SPECIFIC DETAILS === */}
            {data.id === TechType.HBOT && selectedHbotChamber && (
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Active Configuration</span>
                            <h2 className="text-3xl font-bold text-slate-900">{selectedHbotChamber.fullName}</h2>
                            <p className="text-slate-500 mt-3 text-sm max-w-2xl mx-auto">{selectedHbotChamber.shortDescription}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Model Description</h3>
                                <div className="space-y-2">{renderChamberDescription(selectedHbotChamber.description)}</div>
                            </div>

                            <div className="bg-slate-900 text-white rounded-3xl p-8">
                                <h3 className="text-lg font-bold mb-5">Specifications</h3>
                                <div className="space-y-3">
                                    {selectedHbotChamber.specifications.map((spec) => (
                                        <div key={spec.label} className="flex items-start justify-between gap-4 border-b border-white/10 pb-2">
                                            <span className="text-xs text-slate-300">{spec.label}</span>
                                            <span className="text-sm font-semibold text-right">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === HYDROGEN: WHAT IS H2 THERAPY? === */}
            {data.id === TechType.HYDROGEN && (
                <>
                    <ResearchOverviewSection
                        themeLabel="The Science of Small"
                        themeColorClass="text-sky-600"
                        title="What is Hydrogen Therapy?"
                        intro="Molecular hydrogen (H₂) is the smallest molecule in existence — so small it crosses every barrier in your body, including the blood-brain barrier and mitochondrial membranes. It is the only antioxidant that selectively targets the most harmful free radicals while leaving beneficial signalling molecules untouched."
                        stats={[
                            { value: '99.99%', label: 'H₂ Purity', sub: 'PEM electrolysis standard' },
                            { value: '>1200 ppb', label: 'Water Concentration', sub: 'Per litre, support-level concentration' },
                            { value: '0.28 nm', label: 'Molecular Size', sub: 'Smallest bioactive support molecule' },
                            { value: '40%+', label: 'Nrf2 Upregulation', sub: 'Endogenous antioxidant boost' },
                        ]}
                        supportTitle="What Molecular Hydrogen May Support"
                        applications={[
                            { icon: <Flame size={18} />, title: 'Inflammatory Balance', desc: 'May support a balanced inflammatory response at the cellular level and day-to-day recovery comfort.' },
                            { icon: <Brain size={18} />, title: 'Neurological Support', desc: 'Can reach systemic circulation and may assist cellular resilience pathways linked to cognitive performance.' },
                            { icon: <Zap size={18} />, title: 'Athletic Recovery', desc: 'Reduces post-exercise muscle fatigue and oxidative stress for faster return to peak performance.' },
                            { icon: <Activity size={18} />, title: 'Metabolic Health', desc: 'May support healthy metabolic signaling, energy use efficiency, and routine wellness goals.' },
                            { icon: <Sparkles size={18} />, title: 'Skin Health', desc: 'Combats UV-induced oxidative damage, supporting skin elasticity and a more youthful appearance.' },
                            { icon: <Wind size={18} />, title: 'Respiratory Support', desc: 'May assist respiratory wellness by supporting oxidative balance in everyday breathing routines.' },
                            { icon: <Shield size={18} />, title: 'Immune Modulation', desc: 'May assist healthy immune signaling by supporting oxidative and inflammatory balance.' },
                            { icon: <Leaf size={18} />, title: 'Gut Health', desc: 'May support digestive comfort and overall gastrointestinal resilience as part of a broader wellness routine.' },
                            { icon: <Heart size={18} />, title: 'Mental Well-being', desc: 'Emerging research suggests molecular hydrogen may assist calm focus and cognitive recovery patterns.' },
                            { icon: <Target size={18} />, title: 'Gene Regulation', desc: 'Activates Nrf2 and HO-1 pathways involved in detoxification, antioxidant production, and cellular repair.' },
                            { icon: <BarChart2 size={18} />, title: 'Immune Balance Support', desc: 'By supporting immune signaling and oxidative balance, H₂ may assist systemic recovery capacity.' },
                            { icon: <CheckCircle size={18} />, title: 'Tissue Recovery', desc: 'Antioxidant activity may support natural tissue recovery and cellular repair processes.' },
                        ]}
                        hoverBorderClass="hover:border-sky-200"
                        iconBgClass="bg-sky-100"
                        iconColorClass="text-sky-600"
                    />
                    <p className="text-center text-[10px] text-slate-400 mt-[-2rem] mb-8 italic max-w-2xl mx-auto">
                        Research citations available in the Deep Intelligence section below.
                    </p>
                </>
            )}

            {/* === HYDROGEN: DELIVERY ECOSYSTEM === */}
            {data.id === TechType.HYDROGEN && (
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest block mb-2">Complete System</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Four Ways to Receive H₂</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                The Hydrogen ecosystem delivers molecular H₂ to different areas of the body simultaneously — inhalation for systemic coverage, goggles for eye support, earmuffs for auricular wellness routines, and the rod for hydrogen-rich water all day long.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1: HOP-450 Inhalation Unit */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-gradient-to-br from-sky-600 to-teal-500 rounded-3xl p-8 text-white overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <span className="text-[10px] bg-white/20 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">Primary Device</span>
                                            <h3 className="text-2xl font-black mt-3 mb-1">Inhalation Unit</h3>
                                            <p className="text-sky-100 text-sm font-mono">HOP-450 · PEM Electrolysis</p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <Wind size={32} />
                                        </div>
                                    </div>
                                    <p className="text-sky-100 text-sm leading-relaxed mb-6">
                                        Full-body systemic delivery. The HOP-450 generates 99.99% pure H₂ at 300–900 ml/min via PEM electrolysis. Breathe through a nasal cannula for 30–60 minutes to saturate tissues and cross the blood-brain barrier. Two modes: continuous or breath-triggered pulse.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {['300–900 ml/min', 'PEM electrolysis', 'Pulse + continuous', '>1200 ppb water'].map(tag => (
                                            <span key={tag} className="text-[11px] bg-white/15 text-white px-2.5 py-1 rounded-full font-bold">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                        <div>
                                            <span className="text-2xl font-black">$2,400</span>
                                            <span className="text-sky-200 text-sm ml-2">or $200/mo rental</span>
                                        </div>
                                        <button onClick={() => onNavigate?.('store')} className="px-5 py-2.5 bg-white text-sky-700 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors">
                                            Order →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2: H2 Goggles */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-sky-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <span className="text-[10px] bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Eye &amp; Skin Add-on</span>
                                        <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">H₂ Therapy Goggles</h3>
                                        <p className="text-slate-500 text-sm">Targeted periorbital delivery</p>
                                    </div>
                                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600">
                                        <Eye size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Precision-sealed goggles deliver molecular H₂ directly to the delicate eye area during inhalation sessions. Research suggests hydrogen may support UV-induced skin repair around the eyes, reduce puffiness, and support eye fatigue recovery. Connects directly to HOP-450 secondary port.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {['Connects to HOP-450', 'Soft silicone seal', 'UV repair support', 'Anti-fatigue'].map(tag => (
                                        <span key={tag} className="text-[11px] bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-bold border border-teal-100">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-2xl font-black text-slate-900">$129</span>
                                    <button onClick={() => onNavigate?.('store')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                        Add to Order →
                                    </button>
                                </div>
                            </motion.div>

                            {/* Card 3: H2 Earmuffs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 }}
                                className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Auricular Add-on</span>
                                        <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">H₂ Therapy Earmuffs</h3>
                                        <p className="text-slate-500 text-sm">Targeted inner ear delivery</p>
                                    </div>
                                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <Ear size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Soft hydrogen-delivery earmuffs for targeted auricular support. Designed to assist local oxidative balance and comfort-focused routines with an adjustable silicone seal that connects to the HOP-450 secondary output port.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {['Connects to HOP-450', 'Adjustable fit', 'Inner ear support', 'Anti-inflammatory'].map(tag => (
                                        <span key={tag} className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold border border-indigo-100">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-2xl font-black text-slate-900">$119</span>
                                    <button onClick={() => onNavigate?.('store')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                        Add to Order →
                                    </button>
                                </div>
                            </motion.div>

                            {/* Card 4: Hydrogen Water Rod */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Hydration Add-on</span>
                                        <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">Hydrogen Water Rod</h3>
                                        <p className="text-slate-500 text-sm">H₂-rich water, anywhere</p>
                                    </div>
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <FlaskConical size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Premium titanium PEM electrolysis rod that infuses any glass or bottle of water with molecular hydrogen exceeding 1200 ppb in under 10 minutes. Use it at home, in the office, or while travelling — no main unit required. Simply insert, press, wait 10 minutes, drink immediately.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {['>1200 ppb H₂', 'Any glass or bottle', 'Titanium PEM', '10 min per litre'].map(tag => (
                                        <span key={tag} className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-100">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-2xl font-black text-slate-900">$89</span>
                                    <button onClick={() => onNavigate?.('store')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                        Add to Order →
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Multi-zone session tip */}
                        <div className="mt-8 p-6 bg-sky-50 rounded-2xl border border-sky-100 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 mb-1">Pro Tip: The Full-Spectrum Session</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Run all four simultaneously — inhalation + goggles + earmuffs during your 30-minute session, then drink a glass of hydrogen-rich water made with the rod immediately after. This delivers H₂ systemically, to the eyes, to the ears, and through the gastrointestinal tract all in one session.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === RLT: WHAT IS RED LIGHT THERAPY? === */}
            {data.id === TechType.RLT && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-14">
                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest block mb-2">The Science of Light</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">What is Red Light Therapy?</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                Red and near-infrared light routines use specific wavelengths to support cellular energy production. Unlike UV exposure, these wellness wavelengths (630–660nm red, 810–850nm NIR) are selected to reach tissue depth bands without thermal stress.
                            </p>
                        </div>

                        {/* Key Science Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                            {[
                                { value: '630–660nm', label: 'Red Light', sub: 'Skin & surface tissues' },
                                { value: '810–850nm', label: 'Near-Infrared', sub: 'Deep tissue penetration' },
                                { value: '5,000+', label: 'Published Studies', sub: 'Peer-reviewed PBM research' },
                                { value: '22%', label: 'Collagen Increase', sub: 'In clinical studies' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl p-6 text-center border border-red-100 shadow-sm"
                                >
                                    <div className="text-3xl font-black text-red-600 mb-1">{stat.value}</div>
                                    <div className="font-bold text-slate-900 text-sm mb-0.5">{stat.label}</div>
                                    <div className="text-xs text-slate-400">{stat.sub}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* What RLT Helps With — 12-item grid */}
                        <div className="text-center mb-10">
                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest block mb-2">Research-Backed Applications</span>
                            <h3 className="text-3xl font-bold text-slate-900">What Red Light Therapy May Support</h3>
                            <MedicalDisclaimer type="research" compact className="mt-3 text-center max-w-lg mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { icon: <Sparkles size={18} />, title: 'Collagen Production', desc: 'Stimulates fibroblast activity for improved skin elasticity and reduced fine lines over 8–12 weeks.' },
                                { icon: <Zap size={18} />, title: 'Muscle Recovery', desc: 'Reduces post-exercise soreness and accelerates recovery through enhanced cellular repair.' },
                                { icon: <Brain size={18} />, title: 'Cognitive Support', desc: 'Near-infrared may penetrate the skull to support brain function and mental clarity.' },
                                { icon: <Activity size={18} />, title: 'Joint Comfort', desc: 'Anti-inflammatory effects may support mobility and reduce localised discomfort.' },
                                { icon: <Sun size={18} />, title: 'Skin Health', desc: 'Improves texture, reduces UV damage signs, and supports overall skin vitality.' },
                                { icon: <Moon size={18} />, title: 'Sleep Quality', desc: 'Morning red light exposure may help regulate circadian rhythms and sleep-wake cycles.' },
                                { icon: <Target size={18} />, title: 'Tissue Recovery Support', desc: 'Supports tissue recovery processes and natural restoration mechanisms.' },
                                { icon: <Shield size={18} />, title: 'Inflammation Reduction', desc: 'Modulates inflammatory markers and supports balanced immune response.' },
                                { icon: <Heart size={18} />, title: 'Hair Health', desc: 'May stimulate follicular activity and support hair thickness with consistent use.' },
                                { icon: <Wind size={18} />, title: 'Cellular Energy', desc: 'Activates cytochrome c oxidase in mitochondria for enhanced ATP production.' },
                                { icon: <CheckCircle size={18} />, title: 'Pain Relief', desc: 'Analgesic effects reported for various localised discomfort conditions.' },
                                { icon: <Flame size={18} />, title: 'Athletic Performance', desc: 'Pre-exercise use may delay fatigue and improve training adaptation.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-red-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-center text-[10px] text-slate-400 mt-8 italic max-w-2xl mx-auto">Research citations available in the Evidence Snapshot section below.</p>
                    </div>
                </section>
            )}

            {/* === RLT: WAVELENGTH COMPARISON === */}
            {data.id === TechType.RLT && (
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest block mb-2">Wavelength Science</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Red Light vs. Near-Infrared</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                Both wavelengths activate mitochondrial function, but penetrate to different depths. Using both together provides comprehensive surface-to-deep tissue coverage.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Red Light Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-gradient-to-br from-red-500 to-orange-400 rounded-3xl p-8 text-white overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <span className="text-[10px] bg-white/20 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">Visible Light</span>
                                            <h3 className="text-2xl font-black mt-3 mb-1">Red Light</h3>
                                            <p className="text-red-100 text-sm font-mono">630–660 nm wavelength</p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <Sun size={32} />
                                        </div>
                                    </div>
                                    <p className="text-red-100 text-sm leading-relaxed mb-6">
                                        Absorbed near the skin surface, ideal for dermatological applications. Targets fibroblasts to stimulate collagen production, improves skin texture, and supports tissue recovery.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {['Skin health', 'Collagen synthesis', 'Surface wounds', '5–10mm depth'].map(tag => (
                                            <span key={tag} className="text-[11px] bg-white/15 text-white px-2.5 py-1 rounded-full font-bold">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Near-Infrared Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-red-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <span className="text-[10px] bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Invisible to Eye</span>
                                        <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">Near-Infrared</h3>
                                        <p className="text-slate-500 text-sm">810–850 nm wavelength</p>
                                    </div>
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                                        <Activity size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Penetrates deeper into muscle, joint, and bone tissue. Reaches structures red light cannot, making it well-suited for recovery routines, comfort support, and deeper tissue-focused sessions.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {['Deep tissue', 'Muscle recovery', 'Joint support', '20–50mm depth'].map(tag => (
                                        <span key={tag} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold border border-slate-200">{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Pro Tip */}
                        <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 mb-1">Pro Tip: Use Both Together</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Most research uses combination red + NIR light for comprehensive coverage. Red light supports surface-level tissue while NIR reaches deeper structures simultaneously. Our devices allow you to select both wavelengths for full-spectrum sessions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === PEMF: WHAT IS ELECTROMAGNETIC THERAPY? === */}
            {data.id === TechType.PEMF && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-14">
                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest block mb-2">The Science of Electromagnetism</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">What is PEMF Therapy?</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                Pulsed Electromagnetic Field sessions use dynamic magnetic fields to induce gentle electrical activity in tissues. Unlike static magnets, PEMF's time-varying fields are designed to support cellular signaling through electromagnetic induction.
                            </p>
                        </div>

                        {/* Key Science Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                            {[
                                { value: '1–100 Hz', label: 'Frequency Range', sub: 'Supportive frequency window' },
                                { value: '7.83 Hz', label: 'Schumann Resonance', sub: "Earth's natural frequency" },
                                { value: '-70 to -90mV', label: 'Healthy Cell Voltage', sub: 'Transmembrane potential' },
                                { value: '19%', label: 'Deep Sleep Increase', sub: 'In clinical studies' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl p-6 text-center border border-purple-100 shadow-sm"
                                >
                                    <div className="text-3xl font-black text-purple-600 mb-1">{stat.value}</div>
                                    <div className="font-bold text-slate-900 text-sm mb-0.5">{stat.label}</div>
                                    <div className="text-xs text-slate-400">{stat.sub}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* What PEMF Helps With — 12-item grid */}
                        <div className="text-center mb-10">
                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest block mb-2">Research-Backed Applications</span>
                            <h3 className="text-3xl font-bold text-slate-900">What PEMF Therapy May Support</h3>
                            <MedicalDisclaimer type="research" compact className="mt-3 text-center max-w-lg mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { icon: <Moon size={18} />, title: 'Deep Sleep', desc: 'Low-frequency protocols (2–5 Hz) may extend N3 sleep phases and reduce onset latency.' },
                                { icon: <Zap size={18} />, title: 'Cellular Energy', desc: 'Supports maintenance of transmembrane potential for optimal cell function.' },
                                { icon: <Activity size={18} />, title: 'Microcirculation', desc: 'Induces nitric oxide release for improved local blood flow and oxygen delivery.' },
                                { icon: <Brain size={18} />, title: 'Stress Reduction', desc: 'Promotes parasympathetic activation and reduces cortisol levels.' },
                                { icon: <Flame size={18} />, title: 'Muscle Recovery', desc: 'Enhances post-exercise recovery and reduces delayed onset muscle soreness.' },
                                { icon: <Shield size={18} />, title: 'Inflammation Modulation', desc: 'Balanced cytokine response and reduced inflammatory markers.' },
                                { icon: <Target size={18} />, title: 'Pain Management', desc: 'Analgesic effects reported for various localised discomfort conditions.' },
                                { icon: <Sun size={18} />, title: 'Energy Levels', desc: 'Morning use may support natural alertness and vitality throughout the day.' },
                                { icon: <Heart size={18} />, title: 'Joint Mobility', desc: 'Supports comfortable movement and may reduce stiffness.' },
                                { icon: <Sparkles size={18} />, title: 'Tissue Repair', desc: 'Enhanced protein synthesis and cell proliferation for tissue recovery support.' },
                                { icon: <Wind size={18} />, title: 'Relaxation Response', desc: 'Delta-wave entrainment promotes deep relaxation and calm states.' },
                                { icon: <CheckCircle size={18} />, title: 'Circadian Alignment', desc: 'Schumann resonance protocols may support natural sleep-wake cycles.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-center text-[10px] text-slate-400 mt-8 italic max-w-2xl mx-auto">Research citations available in the Evidence Snapshot section below.</p>
                    </div>
                </section>
            )}

            {/* === PEMF: FREQUENCY GUIDE === */}
            {data.id === TechType.PEMF && (
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest block mb-2">Frequency Science</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Understanding PEMF Frequencies</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                Different frequencies produce different effects on the body. PEMF devices allow you to select frequencies that match your wellness goals — from deep relaxation to cellular activation.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { range: '1–10 Hz', effect: 'Delta/Theta Waves', use: 'Deep sleep, relaxation', color: 'from-indigo-500 to-purple-500' },
                                { range: '10–20 Hz', effect: 'Alpha Waves', use: 'Meditation, calm focus', color: 'from-purple-500 to-fuchsia-500' },
                                { range: '20–50 Hz', effect: 'Cellular Activation', use: 'Tissue repair, circulation', color: 'from-fuchsia-500 to-pink-500' },
                                { range: '50–100 Hz', effect: 'Beta Waves', use: 'Alertness, mental clarity', color: 'from-pink-500 to-rose-500' },
                            ].map((freq, i) => (
                                <motion.div
                                    key={freq.range}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`bg-gradient-to-br ${freq.color} rounded-2xl p-6 text-white`}
                                >
                                    <div className="text-2xl font-black mb-2">{freq.range}</div>
                                    <div className="text-sm font-bold text-white/90 mb-1">{freq.effect}</div>
                                    <div className="text-xs text-white/70">{freq.use}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Schumann Resonance Highlight */}
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                                <Activity size={22} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 mb-1">The Schumann Resonance (7.83 Hz)</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    This is the natural electromagnetic frequency of the Earth's ionosphere. Some research suggests it may be important for human biology, supporting circadian alignment and a sense of "grounding." Our PEMF devices include Schumann resonance protocols for those seeking Earth-frequency wellness support.
                                </p>
                            </div>
                        </div>

                        {/* Pacemaker Warning */}
                        <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
                            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-sm font-bold text-red-800 block">Important Safety Note</span>
                                <span className="text-xs text-red-700">PEMF devices can interfere with pacemakers and implanted electronic devices. If you have a pacemaker, insulin pump, or other implanted electronics, do not use PEMF sessions unless explicitly cleared by your licensed clinician.</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === HOW TO USE === */}
            {data.protocolSteps && data.protocolSteps.length > 0 && (
                <section id="how-to-use" className="py-20 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Step-By-Step</span>
                            <h2 className="text-3xl font-bold text-slate-900">How To Use It</h2>
                        </div>
                        <div className="relative">
                            {/* Connecting line */}
                            <div className="absolute top-8 left-[calc(16.67%)] right-[calc(16.67%)] h-px bg-slate-200 hidden md:block" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                {data.protocolSteps.map((step, idx) => (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.15 }}
                                        className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center"
                                    >
                                        <div className={`w-16 h-16 ${data.accentColor} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-xl font-black shadow-lg`}>
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wide">{step.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-4">{step.desc}</p>
                                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                                            <Clock size={12} />
                                            <span>{step.duration} min</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Optimal Timing Card */}
                        {data.optimalTiming && (
                            <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                                <div className={`w-14 h-14 ${data.accentColor} rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                                    {data.optimalTiming === 'morning' && <Sun size={24} />}
                                    {data.optimalTiming === 'afternoon' && <Zap size={24} />}
                                    {data.optimalTiming === 'evening' && <Moon size={24} />}
                                    {data.optimalTiming === 'any' && <Clock size={24} />}
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Optimal Timing</span>
                                    <p className="font-black text-slate-900 text-lg capitalize">
                                        {data.optimalTiming === 'any' ? 'Any Time of Day' : data.optimalTiming}
                                    </p>
                                    <p className="text-slate-500 text-sm mt-1">{data.timingReason}</p>
                                </div>
                                <div className="sm:ml-auto text-right hidden sm:block">
                                    <span className="text-xs text-slate-400 block">Total session time</span>
                                    <div className="text-2xl font-black text-slate-900">
                                        {data.protocolSteps.reduce((sum, s) => sum + (s.duration ?? 0), 0)} min
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* === BENEFITS === */}
            <section id="benefits" className="py-20 bg-slate-50">
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

            {pdpEvidenceEnabled && (
                <section id="evidence" className="py-16 bg-white border-y border-slate-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-8">
                            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Evidence Snapshot</span>
                            <h2 className="text-2xl font-bold text-slate-900">What current evidence suggests</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                                {relatedStudy ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl font-black text-cyan-600">{relatedStudy.value}</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{relatedStudy.metric}</p>
                                                <p className="text-xs text-slate-500">{relatedStudy.title}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{relatedStudy.description}</p>
                                        {relatedStudy.pubmedUrl && (
                                            <a
                                                href={relatedStudy.pubmedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                                            >
                                                <BookOpen size={14} /> View source on PubMed
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        We are continuously expanding modality-specific evidence summaries and will publish additional peer-reviewed references here.
                                    </p>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Verified claim themes</h3>
                                <ul className="space-y-2">
                                    {(knowledge?.approvedClaims ?? []).slice(0, 4).map((claim) => (
                                        <li key={claim} className="flex items-start gap-2 text-sm text-slate-700">
                                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <span>{claim}</span>
                                        </li>
                                    ))}
                                </ul>
                                <MedicalDisclaimer type="research" compact className="text-[11px] mt-4" />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === GOALS / IS THIS FOR YOU === */}
            {data.goals && data.goals.length > 0 && (
                <section id="goals" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-10">
                            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Designed For</span>
                            <h2 className="text-3xl font-bold text-slate-900">Is This Right For You?</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {data.goals.map((goal) => {
                                const goalMeta: Record<string, { icon: React.ReactNode; desc: string }> = {
                                    Rest: { icon: <Moon size={28} />, desc: 'Deeper sleep & recovery cycles' },
                                    Focus: { icon: <Brain size={28} />, desc: 'Mental clarity & cognitive flow' },
                                    Repair: { icon: <Zap size={28} />, desc: 'Tissue repair & regeneration' },
                                    Life: { icon: <Sparkles size={28} />, desc: 'Longevity & whole-body wellness' },
                                };
                                const meta = goalMeta[goal] || { icon: <Target size={28} />, desc: '' };
                                return (
                                    <motion.div
                                        key={goal}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="rounded-2xl p-6 text-center border-2 border-slate-100 hover:border-cyan-200 hover:shadow-md transition-all cursor-default"
                                    >
                                        <div className={`w-14 h-14 ${data.accentColor} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-sm`}>
                                            {meta.icon}
                                        </div>
                                        <h4 className="font-black text-slate-900 text-base mb-1">{goal}</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">{meta.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* === PERFORMANCE PROFILE === */}
            {data.comparisonScores && (
                <section className="py-16 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-10">
                            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Performance Profile</span>
                            <h2 className="text-3xl font-bold text-slate-900">What It Excels At</h2>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-5">
                            {(Object.entries(data.comparisonScores) as [string, number][]).map(([key, score]) => {
                                const labels: Record<string, string> = {
                                    recovery: 'Physical Recovery',
                                    cognitive: 'Cognitive Performance',
                                    cellular: 'Cellular Regeneration',
                                    pain: 'Pain Management',
                                    longevity: 'Longevity Support',
                                };
                                return (
                                    <div key={key} className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-600 w-40 shrink-0">{labels[key] || key}</span>
                                        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${score}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                                                className={`h-full rounded-full ${data.accentColor}`}
                                            />
                                        </div>
                                        <span className="text-sm font-black text-slate-900 w-10 text-right">{score}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-center text-xs text-slate-400 mt-4">Relative performance indicators based on clinical literature. Not comparative to other brands.</p>
                    </div>
                </section>
            )}

            {/* === SYNERGIES (Simplified Bar) === */}
            {data.synergies && data.synergies.length > 0 && (
                <section id="synergies" className="py-12 bg-slate-900">
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

            {/* === USED IN THESE PROTOCOLS === */}
            <FeatureGate flag="feature_pdp_protocols">
                {relatedProtocolCards.length > 0 && (
                    <section className="py-20 bg-white border-t border-slate-100">
                        <div className="max-w-6xl mx-auto px-6">
                            <div className="text-center mb-12">
                                <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">Protocol Ecosystem</span>
                                <h2 className="text-3xl font-bold text-slate-900">Protocols using this device</h2>
                                <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm">
                                    This technology appears in these step-by-step protocols.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {relatedProtocolCards.map((protocolCard) => (
                                    <ProtocolCard
                                        key={protocolCard.slug}
                                        protocol={protocolCard}
                                        onOpen={(protocolSlug) => {
                                            if (onNavigate) {
                                                onNavigate(`protocols/${protocolSlug}`);
                                                return;
                                            }

                                            router.push(`/protocols/${protocolSlug}`);
                                            window.scrollTo(0, 0);
                                        }}
                                        compact
                                    />
                                ))}
                            </div>

                            {onNavigate && (
                                <div className="text-center mt-10">
                                    <Link
                                        href="/protocols"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
                                    >
                                        Explore all protocols <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </FeatureGate>

            {/* === SYSTEM ENHANCEMENTS === */}
            <TechAddons
                data={data}
                selectedAddons={selectedAddons}
                onToggleAddon={toggleAddon}
            />

            
            {/* === STARTER BUNDLES === */}
            <section id="bundles" className="py-20 bg-slate-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-2">Curated Packages</span>
                        <h2 className="text-3xl font-bold text-white">Starter Bundles</h2>
                        <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">Everything you need to start your {data.name} journey - hand-picked and discounted for new users.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Bundle 1: Essential Start */}
                        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">Most Popular</span>
                                    <h3 className="text-xl font-black text-white">Essential Start</h3>
                                </div>
                                <div className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1.5 rounded-full">Save 10%</div>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {['Full {data.name} device', '3-month protocol guide (digital)', '1-hour onboarding call with a certified specialist', 'Quick-start digital library'].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-slate-700 pt-6">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-black text-white">
                                        {(()=>{const p=parseFloat(data.price.replace(/[^0-9.]/g,''))||0;return 'EUR '+(p*0.9).toLocaleString('de-DE',{maximumFractionDigits:0})})()}
                                    </span>
                                    <span className="text-sm text-slate-500 line-through">
                                        {(()=>{const p=parseFloat(data.price.replace(/[^0-9.]/g,''))||0;return 'EUR '+(p*1.15).toLocaleString('de-DE',{maximumFractionDigits:0})})()}
                                    </span>
                                </div>
                                <Link href={productContactHref} className="block w-full py-3 bg-cyan-500 text-white rounded-xl font-bold text-sm text-center hover:bg-cyan-400 transition-all">Request Essential Bundle</Link>
                            </div>
                        </div>
                        {/* Bundle 2: Pro Protocol */}
                        <div className="bg-slate-800 rounded-3xl p-8 border-2 border-cyan-500/30 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-bl-2xl">Recommended</div>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Advanced</span>
                                    <h3 className="text-xl font-black text-white">Pro Protocol</h3>
                                </div>
                                <div className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1.5 rounded-full">Save 15%</div>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {['Full {data.name} device + accessories', '6-month group coaching program', 'Priority support line (48h response)', 'Advanced protocol library (PDF + video)', 'Quarterly check-in calls with a specialist'].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                                        <CheckCircle size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-slate-700 pt-6">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-black text-white">
                                        {(()=>{const p=parseFloat(data.price.replace(/[^0-9.]/g,''))||0;return 'EUR '+(p*0.85+600).toLocaleString('de-DE',{maximumFractionDigits:0})})()}
                                    </span>
                                </div>
                                <Link href={productContactHref} className="block w-full py-3 bg-cyan-500 text-white rounded-xl font-bold text-sm text-center hover:bg-cyan-400 transition-all">Request Pro Bundle</Link>
                            </div>
                        </div>
                        {/* Bundle 3: Clinic Edition */}
                        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">Business</span>
                                    <h3 className="text-xl font-black text-white">Clinic Edition</h3>
                                </div>
                                <div className="bg-purple-500/20 text-purple-400 text-xs font-black px-3 py-1.5 rounded-full">Save 20%</div>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {['Full {data.name} device (clinical model)', 'Clinical staff training (on-site, 2 days)', 'Business setup consultation (3 sessions)', 'Ongoing monthly support retainer (3 months)', 'Marketing materials + client protocol templates', 'Priority technical support - same day response'].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                                        <CheckCircle size={14} className="text-purple-400 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-slate-700 pt-6">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-black text-white">
                                        {(()=>{const p=parseFloat(data.price.replace(/[^0-9.]/g,''))||0;return 'EUR '+(p*0.8+2500).toLocaleString('de-DE',{maximumFractionDigits:0})})()}
                                    </span>
                                    <span className="text-xs text-slate-400">clinic pricing</span>
                                </div>
                                <Link href={`${productContactHref}&intent=b2b`} className="block w-full py-3 bg-purple-500 text-white rounded-xl font-bold text-sm text-center hover:bg-purple-400 transition-all">Request Clinic Quote</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            

            {(pdpAdvisorCtaEnabled || (pdpTradeInEnabled && Boolean(contentCommerceProductId))) && (
                <section className="py-12 bg-white border-y border-slate-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pdpAdvisorCtaEnabled && (
                                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                                    <h3 className="text-lg font-bold text-slate-900">{batch3PdpContent.advisorCta.title}</h3>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Get a modality recommendation based on your goals, timing, and space constraints.
                                    </p>
                                    <Link
                                        href={`/${batch3PdpContent.advisorCta.path}?tech=${techSlug}`}
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800"
                                    >
                                        {batch3PdpContent.advisorCta.linkLabel}
                                    </Link>
                                </div>
                            )}

                            {pdpTradeInEnabled && contentCommerceProductId && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="text-lg font-bold text-slate-900">{batch3PdpContent.tradeInCta.text}</h3>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Typical rental commitment starts at {rentalCommitmentMonths} month{rentalCommitmentMonths > 1 ? 's' : ''}. Upgrade later and apply eligible value from your previous device.
                                    </p>
                                    <Link
                                        href={`/${batch3PdpContent.tradeInCta.path}?product=${contentCommerceProductId}`}
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-slate-700"
                                    >
                                        {batch3PdpContent.tradeInCta.linkLabel}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}


            
            {/* === CUSTOMER REVIEWS === */}
            <section id="reviews" className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <ReviewsSection
                productName={data.name}
                minReviewCount={batch3PdpContent.socialProof.minReviewCount}
                belowThresholdMessage={batch3PdpContent.socialProof.belowThresholdMessage}
            />
                </div>
            </section>

            <TechDetailTimelineSection
                phases={resultTimeline}
                accentColor={data.accentColor}
                themeColor={data.themeColor}
            />

            {/* === VIDEO PLACEHOLDER === */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">In Action</span>
                        <h2 className="text-3xl font-bold text-slate-900">See It In Action</h2>
                    </div>
                    <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center border border-slate-800 group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30`} />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className={`w-20 h-20 ${data.accentColor} rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                                <Play size={32} className="text-white ml-1" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-bold text-lg">Product demonstration video</p>
                                <p className="text-slate-400 text-sm mt-1">Full walkthrough · Setup guide · First session</p>
                            </div>
                            <span className="text-[10px] text-slate-500 border border-slate-700 px-3 py-1 rounded-full uppercase tracking-wider">Coming soon</span>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-slate-500 text-xs">
                            <Video size={12} />
                            <span>{data.name} — Full Demonstration</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* === B2B / PROFESSIONAL ROI === */}
            {data.roiModel && (
                <section className="py-20 bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                                        <Building2 size={20} />
                                    </div>
                                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">For Professionals</span>
                                </div>
                                <h2 className="text-4xl font-bold mb-6">Wellness Center<br />Revenue Calculator</h2>
                                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                    The {data.name} system can generate significant recurring revenue for wellness centers, clinics, and biohacking facilities.
                                </p>
                                <div className="space-y-3 mb-8">
                                    {['White-glove installation & staff training', 'Clinical protocol library included', 'Dedicated B2B support line', 'Co-marketing & referral programs'].map(item => (
                                        <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href={`${productContactHref}&intent=b2b`}
                                    className="flex items-center gap-2 px-8 py-4 bg-cyan-500 text-white rounded-2xl font-bold text-sm hover:bg-cyan-400 transition-all"
                                >
                                    Request B2B Pricing <ArrowRight size={18} />
                                </Link>
                            </div>
                            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
                                <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-cyan-400" /> Revenue Projection
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-xl">
                                        <div>
                                            <span className="text-slate-400 text-xs uppercase tracking-wider block">Avg Session Rate</span>
                                            <span className="text-white font-bold text-xl">${data.roiModel.avgSessionPrice}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-400 text-xs uppercase tracking-wider block">Sessions / Month</span>
                                            <span className="text-white font-bold text-xl">{data.roiModel.avgSessionsPerMonth}</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-700 pt-6 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Monthly Revenue Potential</span>
                                            <span className="text-3xl font-black text-cyan-400">
                                                ${(data.roiModel.avgSessionPrice * data.roiModel.avgSessionsPerMonth).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">Annual Revenue Potential</span>
                                            <span className="text-xl font-bold text-white">
                                                ${(data.roiModel.avgSessionPrice * data.roiModel.avgSessionsPerMonth * 12).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                                            <span className="text-slate-400 text-sm">Estimated Payback Period</span>
                                            <span className="text-sm font-bold text-emerald-400">
                                                ~{Math.ceil(parseInt(data.price.replace(/[^0-9]/g, '')) / (data.roiModel.avgSessionPrice * data.roiModel.avgSessionsPerMonth))} months
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 italic mt-4">Estimates based on market averages. Actual results vary by location and utilization.</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* === SAFETY (Collapsible) === */}
            <section id="safety" className="py-12 bg-slate-50 border-t border-slate-100">
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
                                <span className="font-bold text-slate-900 block">Safety &amp; Compliance</span>
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

                                    {/* Contraindications — full list */}
                                    {data.contraindications && data.contraindications.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-amber-500" /> Contraindications &amp; Safety
                                            </h4>
                                            {pdpContraindicationsEnabled ? (
                                                <div className="space-y-2">
                                                    {data.contraindications.map((ci) => {
                                                        const statusBlock =
                                                            ci.status === 'safe'
                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                                : ci.status === 'caution'
                                                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                                                    : 'bg-red-50 border-red-200 text-red-700';
                                                        const statusBadge =
                                                            ci.status === 'safe'
                                                                ? 'bg-emerald-200'
                                                                : ci.status === 'caution'
                                                                    ? 'bg-amber-200'
                                                                    : 'bg-red-200';

                                                        const isExpanded = expandedContraindication === ci.condition;

                                                        return (
                                                            <div key={ci.condition} className={`rounded-lg border ${statusBlock}`}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setExpandedContraindication((prev) =>
                                                                            prev === ci.condition ? null : ci.condition
                                                                        )
                                                                    }
                                                                    className="w-full flex items-center justify-between gap-3 p-3 text-left"
                                                                    aria-expanded={isExpanded}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${statusBadge}`}>
                                                                            {ci.status}
                                                                        </span>
                                                                        <span className="font-bold text-xs">{ci.condition}</span>
                                                                    </div>
                                                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                </button>
                                                                {isExpanded && (
                                                                    <p className="px-3 pb-3 text-xs opacity-90 leading-relaxed">{ci.reason}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {data.contraindications.map((ci) => (
                                                        <div key={ci.condition} className={`p-3 rounded-lg text-xs ${ci.status === 'safe' ? 'bg-emerald-50 text-emerald-700' : ci.status === 'caution' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${ci.status === 'safe' ? 'bg-emerald-200' : ci.status === 'caution' ? 'bg-amber-200' : 'bg-red-200'}`}>{ci.status}</span>
                                                                <span className="font-bold">{ci.condition}</span>
                                                            </div>
                                                            <span className="opacity-80">{ci.reason}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Drug Interactions */}
                                    {data.drugInteractions && data.drugInteractions.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <Pill size={14} className="text-blue-500" /> Drug Interactions
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {data.drugInteractions.map((di) => (
                                                    <div key={di.drugName} className={`p-3 rounded-lg text-xs ${di.status === 'safe' ? 'bg-emerald-50 text-emerald-700' : di.status === 'caution' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${di.status === 'safe' ? 'bg-emerald-200' : di.status === 'caution' ? 'bg-amber-200' : 'bg-red-200'}`}>{di.status}</span>
                                                            <span className="font-bold">{di.drugName}</span>
                                                        </div>
                                                        <span className="opacity-80">{di.reason}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Disclaimer */}
                                    <MedicalDisclaimer
                                        compact
                                        customText={knowledge?.disclaimers[0] ?? disclaimers.pdp}
                                        className="text-[10px]"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {pdpDocumentsEnabled && productDocuments.length > 0 && (
                <section className="py-12 bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="flex items-center justify-between gap-4 mb-5">
                            <div>
                                <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-1">Resources</span>
                                <h2 className="text-2xl font-bold text-slate-900">Planning and policy resources</h2>
                            </div>
                            <BookOpen className="text-cyan-500" size={20} />
                        </div>

                        <div className="space-y-3">
                            {productDocuments.map((document) => (
                                <a
                                    key={document.href}
                                    href={document.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 hover:border-cyan-300 hover:bg-cyan-50/50 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{document.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {document.type} · {document.size}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700">
                                        Open <ChevronRight size={14} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {pdpDualTrackEnabled && pdpStickyCtaEnabled ? (
                <>
                    <AnimatePresence>
                        {!isCommercePanelInView && (
                            <motion.div
                                key="pdp-desktop-sticky"
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="hidden md:block fixed top-0 left-0 right-0 z-[70] border-b border-slate-200 bg-white shadow-sm"
                            >
                                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{data.name}</p>
                                        <p className="text-xs text-slate-500">{stickyDesktopPrice}</p>
                                    </div>

                                    <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTrack('purchase')}
                                            className={`min-h-11 px-4 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] ${activeTrack === 'purchase' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                                        >
                                            {pdpCommerceContent.trackLabels.buy}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTrack('rental')}
                                            className={`min-h-11 px-4 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] ${activeTrack === 'rental' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                                        >
                                            {pdpCommerceContent.trackLabels.rent}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handlePrimaryTrackAction}
                                        className="min-h-11 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-[0.16em] hover:bg-slate-800 transition-colors"
                                    >
                                        {activeTrackCtaLabel}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isCommercePanelInView && (
                            <motion.div
                                key="pdp-mobile-sticky"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 16 }}
                                className="md:hidden fixed left-3 right-3 bottom-24 z-[70] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-lg"
                            >
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-sm font-bold text-slate-900 truncate">{stickyMobilePrice}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={handlePrimaryTrackAction}
                                        className="min-h-11 px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-[0.15em]"
                                    >
                                        {mobilePrimaryLabel}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowMobileTrackDrawer(true)}
                                        className="min-h-11 px-4 py-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-[0.15em]"
                                    >
                                        {`or ${alternativeTrackLabel} ▾`}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showMobileTrackDrawer && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-900/50 z-[80] md:hidden"
                                    onClick={() => setShowMobileTrackDrawer(false)}
                                />
                                <motion.div
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="mobile-track-drawer-title"
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                                    className="fixed inset-x-0 bottom-0 z-[81] md:hidden rounded-t-3xl bg-white border-t border-slate-200 p-6"
                                >
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <h3 id="mobile-track-drawer-title" className="text-base font-bold text-slate-900">{pdpCommerceContent.switchTrack.titlePrefix} {alternativeTrack === 'purchase' ? pdpCommerceContent.trackLabels.buy : pdpCommerceContent.trackLabels.rent}</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowMobileTrackDrawer(false)}
                                            className="p-2 rounded-lg hover:bg-slate-100"
                                            aria-label={pdpCommerceContent.switchTrack.drawerCloseAriaLabel}
                                        >
                                            <X size={16} className="text-slate-500" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-slate-600 mb-4">
                                        {alternativeTrack === 'purchase'
                                            ? `${purchasePriceLabel} ${pdpCommerceContent.switchTrack.oneTimePurchaseSuffix}`
                                            : `${rentalPriceLabel ?? pdpCommerceContent.pricing.rentalUnavailable} · ${pdpCommerceContent.switchTrack.minimumPrefix} ${rentalMinimumPeriod}`}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => handleSwitchTrack(alternativeTrack)}
                                        className="w-full min-h-11 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-[0.16em]"
                                    >
                                        {pdpCommerceContent.switchTrack.switchToPrefix} {alternativeTrack === 'purchase' ? pdpCommerceContent.trackLabels.buy : pdpCommerceContent.trackLabels.rent}
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 py-4 px-6 z-50 shadow-lg">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-2xl font-bold text-slate-900">{data.name}</span>
                            <span className="text-xl text-slate-300">|</span>
                            <span className="text-2xl font-bold text-slate-900">{data.price}</span>
                            <span className="text-sm text-cyan-600 font-bold">or {data.financing}</span>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={addCurrentTechToCart}
                                className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg"
                            >
                                Add to Cart <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {pdpDualTrackEnabled && pdpFinancingDrawerEnabled && (
                <AnimatePresence>
                    {showFinancing && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-slate-900/50 z-[90]"
                                onClick={() => setShowFinancing(false)}
                            />
                            <motion.aside
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="financing-drawer-title"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                                className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[91] shadow-2xl border-l border-slate-200"
                            >
                                <div className="h-full overflow-y-auto p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 id="financing-drawer-title" className="text-xl font-bold text-slate-900">{pdpCommerceContent.pricing.financingTitle}</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowFinancing(false)}
                                            className="p-2 rounded-lg hover:bg-slate-100"
                                            aria-label={pdpCommerceContent.switchTrack.closeFinancingAriaLabel}
                                        >
                                            <X size={18} className="text-slate-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {availableInstallmentOptions.map((option) => {
                                            const selected = loanTerm === option.months;
                                            const baseLabel = `${option.months} payments × ${formatEuro(option.monthlyAmount)}`;
                                            const withRate = option.interestRate === 0 ? `${baseLabel} (0%)` : `${baseLabel} (${option.interestRate.toFixed(1)}%)`;

                                            return (
                                                <button
                                                    key={option.months}
                                                    type="button"
                                                    onClick={() => setLoanTerm(option.months)}
                                                    className={`w-full min-h-11 rounded-xl border px-4 py-3 text-left transition-colors ${selected ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <span className="text-sm font-semibold text-slate-900">{withRate}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {activeInstallment && (
                                        <p className="mt-4 text-sm text-slate-500">
                                            Estimated monthly amount: <span className="font-semibold text-slate-900">{formatEuro(activeInstallment.monthlyAmount)}</span>
                                        </p>
                                    )}

                                    <p className="mt-3 text-sm text-slate-500">{pdpCommerceContent.pricing.noHiddenFees}</p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowFinancing(false);
                                            navigateToPage('financing');
                                        }}
                                        className="mt-4 text-sm font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1"
                                    >
                                        {pdpCommerceContent.pricing.financingCta} <ArrowRight size={14} />
                                    </button>

                                    <hr className="my-6 border-slate-200" />

                                    <p className="text-sm text-slate-600">
                                        {pdpCommerceContent.pricing.orRentPrefix} {rentalPriceLabel ? `from ${rentalPriceLabel}` : 'available plans on request'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTrack('rental');
                                            setShowFinancing(false);
                                        }}
                                        className="mt-2 text-sm font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1"
                                    >
                                        {pdpCommerceContent.pricing.compareBuyRent} <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            )}

            {/* Bottom padding for sticky elements */}
            <div className={pdpDualTrackEnabled && pdpStickyCtaEnabled ? 'h-28 md:h-8' : 'h-24'}></div>
        </div>
    );
};
