import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';
import { calculateRentalTotal, GOAL_BUNDLES, GoalBundle } from '../utils/PricingEngine';
import {
    Check, Plus, X, ArrowRight, ArrowLeft, ShoppingBag,
    Zap, Shield, PhoneCall, RotateCcw, ChevronDown, ChevronUp,
    Sparkles
} from 'lucide-react';

// ─── Color map — Tailwind-safe classes per tech ──────────────────────────────
const TECH_COLORS: Record<TechType, { bg: string; border: string; text: string; badge: string; dot: string }> = {
    [TechType.HBOT]: {
        bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700',
        badge: 'bg-cyan-100 text-cyan-700', dot: 'bg-cyan-500',
    },
    [TechType.PEMF]: {
        bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500',
    },
    [TechType.RLT]: {
        bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700',
        badge: 'bg-red-100 text-red-700', dot: 'bg-red-500',
    },
    [TechType.HYDROGEN]: {
        bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
        badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500',
    },
    [TechType.EWOT]: {
        bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500',
    },
    [TechType.SAUNA_BLANKET]: {
        bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500',
    },
    [TechType.EMS]: {
        bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
        badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500',
    },
    [TechType.VNS]: {
        bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700',
        badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500',
    },
    [TechType.HYPOXIC]: {
        bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700',
        badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500',
    },
    [TechType.CRYO]: {
        bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500',
    },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface RentalConfiguratorProps {
    onCheckout?: () => void;
    onNavigate?: (path: string) => void;
}

type WizardStep = 'goal' | 'devices' | 'summary';

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS: { id: WizardStep; label: string }[] = [
    { id: 'goal', label: 'Your Goal' },
    { id: 'devices', label: 'Your Devices' },
    { id: 'summary', label: 'Your Bundle' },
];

const StepIndicator: React.FC<{ current: WizardStep }> = ({ current }) => {
    const currentIdx = STEPS.findIndex(s => s.id === current);
    return (
        <div className="flex items-center justify-center gap-0 mb-8 px-4">
            {STEPS.map((step, idx) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-1 min-w-0">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                ${idx < currentIdx ? 'bg-emerald-500 text-white' :
                                    idx === currentIdx ? 'bg-slate-900 text-white' :
                                        'bg-slate-100 text-slate-400'}`}
                        >
                            {idx < currentIdx ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-medium tracking-wide whitespace-nowrap
                            ${idx === currentIdx ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.label}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300
                            ${idx < currentIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// ─── Goal Card ────────────────────────────────────────────────────────────────
const GoalCard: React.FC<{
    bundle: GoalBundle;
    selected: boolean;
    onClick: () => void;
}> = ({ bundle, selected, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        aria-pressed={selected}
        className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 w-full group
            ${selected
                ? 'bg-slate-900 border-slate-900 shadow-lg'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
    >
        {selected && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" />
            </div>
        )}
        <div className="text-3xl mb-3 leading-none" role="img" aria-hidden="true">
            {bundle.icon}
        </div>
        <div className={`font-semibold text-base mb-1 transition-colors
            ${selected ? 'text-white' : 'text-slate-900'}`}>
            {bundle.label}
        </div>
        <div className={`text-sm transition-colors
            ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
            {bundle.subtitle}
        </div>
    </motion.button>
);

// ─── Device Card ──────────────────────────────────────────────────────────────
const DeviceCard: React.FC<{
    techId: TechType;
    selected: boolean;
    recommended: boolean;
    onToggle: () => void;
}> = ({ techId, selected, recommended, onToggle }) => {
    const tech = TECH_DETAILS[techId];
    const colors = TECH_COLORS[techId];
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            layout
            className={`rounded-2xl border-2 overflow-hidden transition-all duration-200
                ${selected
                    ? `border-slate-900 shadow-lg`
                    : `${colors.border} hover:shadow-md`
                }`}
        >
            <div className={`p-4 ${selected ? 'bg-slate-900' : colors.bg}`}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl leading-none" role="img" aria-hidden="true">
                            {tech.icon}
                        </span>
                        <div>
                            <div className={`font-semibold text-sm leading-tight
                                ${selected ? 'text-white' : 'text-slate-900'}`}>
                                {tech.friendlyName}
                            </div>
                            {recommended && !selected && (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-0.5 ${colors.text}`}>
                                    <Sparkles size={9} />
                                    Recommended
                                </span>
                            )}
                            {selected && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-0.5 text-emerald-400">
                                    <Check size={9} />
                                    Added
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        aria-label={selected ? `Remove ${tech.friendlyName}` : `Add ${tech.friendlyName}`}
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all
                            ${selected
                                ? 'bg-white/10 hover:bg-white/20 text-white'
                                : `bg-white ${colors.text} border ${colors.border} hover:bg-slate-50`
                            }`}
                    >
                        {selected ? <X size={14} /> : <Plus size={14} />}
                    </button>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-3
                    ${selected ? 'text-slate-300' : 'text-slate-600'}`}>
                    {tech.plainDescription}
                </p>

                {/* Price row */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className={`text-xl font-black ${selected ? 'text-white' : 'text-slate-900'}`}>
                            €{tech.rentalPrice}
                        </span>
                        <span className={`text-xs ml-1 ${selected ? 'text-slate-400' : 'text-slate-400'}`}>
                            /month
                        </span>
                    </div>
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className={`flex items-center gap-1 text-[11px] font-medium transition-colors
                            ${selected ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        aria-expanded={expanded}
                        aria-label={expanded ? 'Hide details' : 'Learn more'}
                    >
                        {expanded ? 'Less' : 'Learn more'}
                        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                </div>

                {/* Expandable detail */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className={`mt-3 pt-3 border-t ${selected ? 'border-white/10' : colors.border}`}>
                                <div className="flex flex-wrap gap-1.5">
                                    {tech.benefits.slice(0, 4).map(b => (
                                        <span key={b} className={`px-2 py-0.5 rounded-full text-[11px] font-medium
                                            ${selected ? 'bg-white/10 text-slate-200' : `${colors.badge}`}`}>
                                            {b}
                                        </span>
                                    ))}
                                </div>
                                {tech.rentalTerms && (
                                    <p className={`text-[11px] mt-2 ${selected ? 'text-slate-400' : 'text-slate-400'}`}>
                                        📋 {tech.rentalTerms}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ─── Synergy Banner ───────────────────────────────────────────────────────────
const SynergyBanner: React.FC<{ selectedItems: TechType[] }> = ({ selectedItems }) => {
    if (selectedItems.length < 2) return null;

    // Find the best synergy pair among selected items
    let bestSynergy: { label: string; description: string; boost: number } | null = null;
    for (const id of selectedItems) {
        const tech = TECH_DETAILS[id];
        for (const syn of tech.synergies) {
            if (selectedItems.includes(syn.targetId)) {
                if (!bestSynergy || syn.boost > bestSynergy.boost) {
                    bestSynergy = syn;
                }
            }
        }
    }

    if (!bestSynergy) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4"
        >
            <div className="text-emerald-500 flex-shrink-0 mt-0.5">
                <Zap size={16} />
            </div>
            <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                    {bestSynergy.label} — Synergy Active ✨
                </div>
                <div className="text-xs text-emerald-600 leading-relaxed">
                    {bestSynergy.description}
                </div>
            </div>
        </motion.div>
    );
};

// ─── Pricing Panel ────────────────────────────────────────────────────────────
const PricingPanel: React.FC<{
    selectedItems: TechType[];
    onContinue: () => void;
    continueLabel: string;
    disabled: boolean;
}> = ({ selectedItems, onContinue, continueLabel, disabled }) => {
    const pricing = calculateRentalTotal(selectedItems);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            {/* Items list */}
            {selectedItems.length > 0 ? (
                <div className="space-y-2 mb-4">
                    {selectedItems.map(id => {
                        const tech = TECH_DETAILS[id];
                        const colors = TECH_COLORS[id];
                        return (
                            <div key={id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">{tech.icon}</span>
                                    <span className="text-sm text-slate-600">{tech.friendlyName}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-800">
                                    €{tech.rentalPrice}/mo
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-slate-400 text-center py-3 mb-4">
                    Select devices to see pricing
                </p>
            )}

            {selectedItems.length > 0 && (
                <>
                    <div className="h-px bg-slate-100 mb-4" />

                    {/* Subtotal */}
                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                        <span>Subtotal</span>
                        <span>€{pricing.total}/mo</span>
                    </div>

                    {/* Savings */}
                    {pricing.discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600 mb-2 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Zap size={12} />
                                Bundle Discount
                            </span>
                            <span>−€{pricing.discount.toFixed(0)}/mo</span>
                        </div>
                    )}

                    <div className="h-px bg-slate-100 my-3" />

                    {/* Total */}
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                            Total
                        </span>
                        <span className="text-3xl font-black text-slate-900">
                            €{pricing.finalTotal.toFixed(0)}
                        </span>
                    </div>
                    <div className="text-right text-xs text-slate-400 mb-4">per month</div>

                    {/* Savings badge */}
                    {pricing.discount > 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center mb-4">
                            <p className="text-xs font-semibold text-emerald-700">
                                🎉 {pricing.savingsMessage}
                            </p>
                            <p className="text-[11px] text-emerald-600 mt-0.5">{pricing.bundleName}</p>
                        </div>
                    )}

                    {/* Hint for more savings */}
                    {selectedItems.length === 1 && (
                        <p className="text-xs text-slate-400 text-center mb-4">
                            Add 1 more device to unlock 15% bundle savings
                        </p>
                    )}
                </>
            )}

            <button
                onClick={onContinue}
                disabled={disabled}
                className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                    ${!disabled
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
            >
                {continueLabel}
                {!disabled && <ArrowRight size={15} />}
            </button>
        </div>
    );
};

// ─── Trust Signals ────────────────────────────────────────────────────────────
const TrustSignals: React.FC = () => (
    <div className="grid grid-cols-3 gap-3 mt-4">
        {[
            { icon: <RotateCcw size={16} />, label: 'Cancel anytime', sub: 'After minimum term' },
            { icon: <PhoneCall size={16} />, label: 'Free setup call', sub: 'Expert guidance' },
            { icon: <Shield size={16} />, label: 'CE Marked', sub: 'Verified devices' },
        ].map(({ icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-slate-50 rounded-xl">
                <div className="text-slate-500">{icon}</div>
                <span className="text-xs font-semibold text-slate-700 leading-tight">{label}</span>
                <span className="text-[11px] text-slate-400">{sub}</span>
            </div>
        ))}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const RentalConfigurator: React.FC<RentalConfiguratorProps> = ({ onCheckout, onNavigate }) => {
    const [step, setStep] = useState<WizardStep>('goal');
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<TechType[]>([]);
    const [recommendedItems, setRecommendedItems] = useState<TechType[]>([]);

    // Derive recommended items from selected goals
    useEffect(() => {
        if (selectedGoals.length === 0) {
            setRecommendedItems([]);
            return;
        }
        const deviceSet = new Set<TechType>();
        GOAL_BUNDLES.forEach(bundle => {
            if (selectedGoals.includes(bundle.id)) {
                bundle.devices.forEach(d => deviceSet.add(d));
            }
        });
        setRecommendedItems(Array.from(deviceSet));
    }, [selectedGoals]);

    const toggleGoal = useCallback((goalId: string) => {
        setSelectedGoals(prev =>
            prev.includes(goalId)
                ? prev.filter(g => g !== goalId)
                : [...prev, goalId]
        );
    }, []);

    const toggleDevice = useCallback((id: TechType) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    }, []);

    const handleGoalContinue = () => {
        // Pre-select recommended devices
        setSelectedItems(recommendedItems.slice(0, 3)); // Cap at 3 for sane default
        setStep('devices');
    };

    const handleCheckout = () => {
        if (onCheckout) {
            onCheckout();
        } else if (onNavigate) {
            const params = new URLSearchParams();
            params.set('items', selectedItems.join(','));
            onNavigate(`rental/checkout?${params.toString()}`);
        }
    };

    const allDevices = Object.values(TECH_DETAILS);
    const pricing = calculateRentalTotal(selectedItems);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-1">
                    Device Rental Configurator
                </p>
                <h2 className="text-xl font-black text-white">
                    {step === 'goal' && 'What would you like to improve?'}
                    {step === 'devices' && 'Your personalised protocol'}
                    {step === 'summary' && 'Review your bundle'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                    {step === 'goal' && 'Choose one or more goals — we\'ll recommend the right devices.'}
                    {step === 'devices' && 'We\'ve selected your recommended devices. Adjust freely.'}
                    {step === 'summary' && 'Everything looks good. Start your rental today.'}
                </p>
            </div>

            {/* Step indicator */}
            <div className="pt-6 px-6">
                <StepIndicator current={step} />
            </div>

            {/* ── STEP 1: GOAL SELECTION ─────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {step === 'goal' && (
                    <motion.div
                        key="goal"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                            {GOAL_BUNDLES.map(bundle => (
                                <GoalCard
                                    key={bundle.id}
                                    bundle={bundle}
                                    selected={selectedGoals.includes(bundle.id)}
                                    onClick={() => toggleGoal(bundle.id)}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleGoalContinue}
                            disabled={selectedGoals.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                ${selectedGoals.length > 0
                                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {selectedGoals.length > 0
                                ? `See My Protocol (${recommendedItems.length} devices recommended)`
                                : 'Select at least one goal'}
                            {selectedGoals.length > 0 && <ArrowRight size={15} />}
                        </button>

                        <p className="text-xs text-slate-400 text-center mt-3">
                            Not sure? Our team can guide you — <button className="underline text-slate-500 hover:text-slate-700">Book a free call</button>
                        </p>
                    </motion.div>
                )}

                {/* ── STEP 2: DEVICE SELECTION ──────────────────────────── */}
                {step === 'devices' && (
                    <motion.div
                        key="devices"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: device grid */}
                            <div className="flex-1">
                                <SynergyBanner selectedItems={selectedItems} />

                                {/* Recommended section */}
                                {recommendedItems.length > 0 && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                            ✨ Recommended for your goals
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                            {recommendedItems.map(id => (
                                                <DeviceCard
                                                    key={id}
                                                    techId={id}
                                                    selected={selectedItems.includes(id)}
                                                    recommended={true}
                                                    onToggle={() => toggleDevice(id)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* All other devices */}
                                {allDevices.some(t => !recommendedItems.includes(t.id)) && (
                                    <>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            All devices
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {allDevices
                                                .filter(t => !recommendedItems.includes(t.id))
                                                .map(tech => (
                                                    <DeviceCard
                                                        key={tech.id}
                                                        techId={tech.id}
                                                        selected={selectedItems.includes(tech.id)}
                                                        recommended={false}
                                                        onToggle={() => toggleDevice(tech.id)}
                                                    />
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Right: pricing panel */}
                            <div className="lg:w-72 flex-shrink-0">
                                <div className="lg:sticky lg:top-4">
                                    <PricingPanel
                                        selectedItems={selectedItems}
                                        onContinue={() => setStep('summary')}
                                        continueLabel={selectedItems.length > 0 ? 'Review Bundle' : 'Select a Device'}
                                        disabled={selectedItems.length === 0}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep('goal')}
                            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mt-5 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to goals
                        </button>
                    </motion.div>
                )}

                {/* ── STEP 3: SUMMARY ────────────────────────────────────── */}
                {step === 'summary' && (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: Bundle summary */}
                            <div className="flex-1">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                                    Your {pricing.bundleName || 'Selected'} Protocol
                                </h3>

                                {/* Device list */}
                                <div className="space-y-2 mb-6">
                                    {selectedItems.map(id => {
                                        const tech = TECH_DETAILS[id];
                                        const colors = TECH_COLORS[id];
                                        return (
                                            <div key={id}
                                                className={`flex items-center justify-between p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl leading-none">{tech.icon}</span>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900">
                                                            {tech.friendlyName}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {tech.rentalTerms || 'Flexible rental'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-bold ${colors.text}`}>
                                                    €{tech.rentalPrice}/mo
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Synergy note */}
                                <SynergyBanner selectedItems={selectedItems} />

                                {/* What happens next */}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                        What happens next
                                    </h4>
                                    <div className="space-y-2.5">
                                        {[
                                            { step: '1', text: 'Submit your application — takes 3 minutes' },
                                            { step: '2', text: 'Our team calls you to confirm & schedule delivery' },
                                            { step: '3', text: 'Devices delivered and set up at your location' },
                                            { step: '4', text: 'Free onboarding call to help you get started' },
                                        ].map(({ step: s, text }) => (
                                            <div key={s} className="flex items-start gap-2.5">
                                                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                                                    {s}
                                                </div>
                                                <span className="text-sm text-slate-600">{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Pricing + CTA */}
                            <div className="lg:w-72 flex-shrink-0">
                                <div className="lg:sticky lg:top-4 space-y-4">
                                    {/* Price summary */}
                                    <div className="bg-slate-900 text-white rounded-2xl p-5">
                                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">
                                            Monthly Summary
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm text-slate-400">
                                                <span>Subtotal ({selectedItems.length} devices)</span>
                                                <span>€{pricing.total}/mo</span>
                                            </div>
                                            {pricing.discount > 0 && (
                                                <div className="flex justify-between text-sm text-emerald-400 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Zap size={12} /> Bundle saving
                                                    </span>
                                                    <span>−€{pricing.discount.toFixed(0)}/mo</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px bg-white/10 mb-4" />

                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm font-bold uppercase tracking-wider">Total</span>
                                            <span className="text-4xl font-black">
                                                €{pricing.finalTotal.toFixed(0)}
                                            </span>
                                        </div>
                                        <div className="text-right text-xs text-slate-500 mb-5">per month</div>

                                        {pricing.discount > 0 && (
                                            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-2.5 text-center mb-5">
                                                <p className="text-xs font-semibold text-emerald-300">
                                                    {pricing.savingsMessage}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleCheckout}
                                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                                        >
                                            <ShoppingBag size={15} />
                                            Start My 30-Day Trial
                                        </button>

                                        <p className="text-[11px] text-slate-500 text-center mt-3 leading-relaxed">
                                            No commitment beyond your minimum term.
                                            Cancel with 30 days notice after that.
                                        </p>
                                    </div>

                                    {/* Trust signals */}
                                    <TrustSignals />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep('devices')}
                            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mt-5 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to devices
                        </button>

                        {/* Medical disclaimer */}
                        <p className="text-[11px] text-slate-400 mt-4 leading-relaxed border-t border-slate-100 pt-4">
                            Wellness equipment for general wellbeing planning only.
                            Hylono devices are designed to support general wellness. Consult your healthcare provider before use.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

