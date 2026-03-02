/**
 * ChamberFinder5
 * Fresh redesign — full-screen immersive wizard.
 * Large visual option cards, animated ring progress, cinematic results.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronRight, ChevronLeft, Check, Home, Building2,
    Dumbbell, HeartPulse, Users, User, Wallet,
    RotateCcw, X, Sparkles, ArrowRight,
} from 'lucide-react';
import { ChamberProduct } from '../types';
import { ALL_CHAMBERS } from '../constants/chambers';
import { OptimizedImage } from './shared/OptimizedImage';

interface ChamberFinder5Props {
    onSelect: (slug: string) => void;
    onClose?: () => void;
}

type StepId = 'useCase' | 'scale' | 'commitment';

interface OptionCard {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    emoji: string;
}

const STEPS: { id: StepId; question: string; subtitle: string; options: OptionCard[] }[] = [
    {
        id: 'useCase',
        question: 'What describes you best?',
        subtitle: 'Help us match the right chamber to your lifestyle',
        options: [
            {
                id: 'personal',
                label: 'Personal Wellness',
                description: 'Daily recovery, anti-aging, and longevity for yourself.',
                icon: <Home size={22} />,
                emoji: '🏡',
            },
            {
                id: 'sports',
                label: 'Sports & Performance',
                description: 'Accelerate recovery between training sessions.',
                icon: <Dumbbell size={22} />,
                emoji: '⚡',
            },
            {
                id: 'clinic',
                label: 'Clinic / Professional',
                description: 'Wellness centre, spa, chiropractic — for multiple clients.',
                icon: <Building2 size={22} />,
                emoji: '🏥',
            },
            {
                id: 'wellness-biz',
                label: 'Wellness Business',
                description: 'Group sessions, luxury destination, premium health club.',
                icon: <HeartPulse size={22} />,
                emoji: '✨',
            },
        ],
    },
    {
        id: 'scale',
        question: 'How many people per session?',
        subtitle: 'This helps us size the right chamber for your needs',
        options: [
            {
                id: 'solo',
                label: 'Just me',
                description: 'A personal sanctuary for solo sessions.',
                icon: <User size={22} />,
                emoji: '🧘',
            },
            {
                id: 'small-group',
                label: '2–3 people',
                description: 'Couples, small teams, or family sessions.',
                icon: <Users size={22} />,
                emoji: '👥',
            },
            {
                id: 'medium-group',
                label: '4–5 people',
                description: 'Small group or clinic throughput.',
                icon: <Users size={22} />,
                emoji: '👨‍👩‍👧‍👦',
            },
            {
                id: 'try-first',
                label: 'Try first',
                description: 'Start with a rental to experience HBOT before committing.',
                icon: <RotateCcw size={22} />,
                emoji: '🔄',
            },
        ],
    },
    {
        id: 'commitment',
        question: 'How do you want to acquire it?',
        subtitle: 'Both options include our full support and warranty',
        options: [
            {
                id: 'buy',
                label: 'Purchase outright',
                description: 'Full ownership — best value for regular long-term use.',
                icon: <Wallet size={22} />,
                emoji: '💎',
            },
            {
                id: 'rent',
                label: 'Monthly rental',
                description: 'Flexible terms. No large upfront investment.',
                icon: <RotateCcw size={22} />,
                emoji: '📅',
            },
            {
                id: 'rent-to-own',
                label: 'Rent, then buy',
                description: 'Trial first. Rental credits toward future purchase.',
                icon: <ChevronRight size={22} />,
                emoji: '🔑',
            },
        ],
    },
];

function scoreChambers(answers: Record<string, string>): ChamberProduct[] {
    const scored = ALL_CHAMBERS.map((c) => {
        let score = 0;

        if (answers.useCase === 'personal') {
            if (c.type === 'monoplace') score += 10;
            if (c.type === 'soft') score += 8;
        }
        if (answers.useCase === 'sports') {
            if (c.type === 'monoplace') score += 8;
            if (c.type === 'multiplace') score += 6;
            if (c.brand === 'oxyhelp') score += 3;
        }
        if (answers.useCase === 'clinic') {
            if (c.type === 'multiplace') score += 10;
            if (c.type === 'monoplace') score += 6;
            if (c.brand === 'oxyhelp') score += 3;
        }
        if (answers.useCase === 'wellness-biz') {
            if (c.type === 'multiplace') score += 12;
            if (c.brand === 'oxyhelp') score += 4;
        }
        if (answers.scale === 'solo') {
            if (c.type === 'monoplace') score += 10;
            if (c.type === 'soft') score += 7;
            if (c.type === 'multiplace') score -= 3;
        }
        if (answers.scale === 'small-group') {
            if (c.id === 'oxyhelp-oxylife-c2') score += 10;
            if (c.id === 'oxyhelp-oxylife-c3') score += 8;
        }
        if (answers.scale === 'medium-group') {
            if (c.id === 'oxyhelp-oxylife-c4') score += 12;
            if (c.id === 'oxyhelp-oxylife-c3') score += 10;
        }
        if (answers.scale === 'try-first') {
            if (c.type === 'soft') score += 15;
            if (c.type === 'monoplace' && c.transactionModes.includes('rent')) score += 8;
        }
        if (answers.commitment === 'rent' || answers.commitment === 'rent-to-own') {
            if (c.transactionModes.includes('rent')) score += 5;
            if (c.type === 'soft') score += 5;
        }
        if (answers.commitment === 'buy') {
            if (c.brand === 'oxyhelp') score += 3;
        }

        return { chamber: c, score };
    });

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((s) => s.chamber);
}

const PLACEHOLDER_IMAGES = {
    monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&q=80',
    multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80',
    soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=500&q=80',
};

// Circular progress ring
const ProgressRing: React.FC<{ progress: number; step: number; total: number }> = ({ progress, step, total }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
                <motion.circle
                    cx="36"
                    cy="36"
                    r={radius}
                    stroke="url(#ringGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-white">{step}</span>
                <span className="text-[9px] text-slate-400">of {total}</span>
            </div>
        </div>
    );
};

export const ChamberFinder5: React.FC<ChamberFinder5Props> = ({ onSelect, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [recommendations, setRecommendations] = useState<ChamberProduct[] | null>(null);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const step = STEPS[currentStep] ?? STEPS[0];
    if (!step) {
        return null;
    }

    const isLastStep = currentStep === STEPS.length - 1;
    const canProgress = !!answers[step.id];
    const progress = ((currentStep + (canProgress ? 1 : 0)) / STEPS.length) * 100;

    const handleAnswer = (optionId: string) => {
        setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
    };

    const handleNext = () => {
        if (isLastStep) {
            setRecommendations(scoreChambers(answers));
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setAnswers({});
        setRecommendations(null);
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            {/* Main panel */}
            <div className="bg-slate-950/95 backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06]">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/5 pointer-events-none" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ProgressRing
                                progress={recommendations ? 100 : progress}
                                step={recommendations ? STEPS.length : currentStep + 1}
                                total={STEPS.length}
                            />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles size={14} className="text-cyan-400" />
                                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                                        Chamber Finder
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {recommendations ? 'Your perfect matches' : 'Find your chamber'}
                                </h2>
                            </div>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                aria-label="Close finder"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {recommendations ? (
                            // ── Results ──────────────────────────────────────────
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <p className="text-sm text-slate-400 mb-6">
                                    Based on your answers, here are your top chamber matches — ranked by fit.
                                </p>

                                <div className="space-y-3">
                                    {recommendations.map((c, i) => {
                                        const fallbackImage = PLACEHOLDER_IMAGES[c.type] ?? PLACEHOLDER_IMAGES.monoplace;
                                        const heroUrl = c.images.find((img) => img.role === 'hero')?.url ?? fallbackImage;
                                        const isBest = i === 0;
                                        return (
                                            <motion.button
                                                key={c.id}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                onClick={() => onSelect(c.slug)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group hover:scale-[1.01] ${
                                                    isBest
                                                        ? 'border-cyan-500/40 bg-cyan-500/5 hover:border-cyan-400/60 hover:bg-cyan-500/10'
                                                        : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.06]'
                                                }`}
                                            >
                                                <div className="relative shrink-0">
                                                    <OptimizedImage
                                                        src={heroUrl}
                                                        alt={c.fullName}
                                                        fallbackSrc={fallbackImage}
                                                        width={80}
                                                        height={80}
                                                        sizes="80px"
                                                        className="w-20 h-20 rounded-xl object-cover"
                                                    />
                                                    {isBest && (
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                            <span className="text-[9px] font-bold text-white">★</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {isBest && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full mb-1.5">
                                                            <Sparkles size={9} />
                                                            Best match
                                                        </span>
                                                    )}
                                                    <p className="font-bold text-white text-sm leading-tight">{c.fullName}</p>
                                                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{c.shortDescription.slice(0, 90)}</p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {c.type.charAt(0).toUpperCase() + c.type.slice(1)} ·{' '}
                                                        {c.brandLabel}
                                                    </p>
                                                </div>

                                                <ArrowRight size={16} className={`shrink-0 transition-transform group-hover:translate-x-1 ${isBest ? 'text-cyan-400' : 'text-slate-500'}`} />
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleReset}
                                    className="mt-6 w-full text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={13} />
                                    Start over with different answers
                                </button>
                            </motion.div>
                        ) : (
                            // ── Questions ────────────────────────────────────────
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h3 className="text-2xl font-bold text-white mb-1">{step.question}</h3>
                                <p className="text-sm text-slate-400 mb-7">{step.subtitle}</p>

                                <div className={`grid gap-3 ${step.options.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
                                    {step.options.map((option) => {
                                        const selected = answers[step.id] === option.id;
                                        const hovered = hoveredOption === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handleAnswer(option.id)}
                                                onMouseEnter={() => setHoveredOption(option.id)}
                                                onMouseLeave={() => setHoveredOption(null)}
                                                className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border text-left transition-all duration-200 ${
                                                    selected
                                                        ? 'border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                                                        : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.06]'
                                                }`}
                                                aria-pressed={selected}
                                            >
                                                {/* Emoji */}
                                                <span className="text-2xl">{option.emoji}</span>

                                                <div>
                                                    <p className={`text-sm font-bold leading-tight mb-1 ${selected ? 'text-cyan-300' : 'text-white'}`}>
                                                        {option.label}
                                                    </p>
                                                    <p className="text-xs text-slate-400 leading-snug">
                                                        {option.description}
                                                    </p>
                                                </div>

                                                {/* Check indicator */}
                                                <AnimatePresence>
                                                    {selected && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0 }}
                                                            className="absolute top-3 right-3 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center"
                                                        >
                                                            <Check size={11} className="text-slate-950" strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer nav */}
                {!recommendations && (
                    <div className="px-8 pb-8 flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!canProgress}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                        >
                            {isLastStep ? 'See my matches' : 'Continue'}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
