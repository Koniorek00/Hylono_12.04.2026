/**
 * ChamberFinder
 * 3-step guided wizard to recommend the right HBOT chamber.
 * Use case → Scale → Budget → Recommendation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Home, Building2, Dumbbell, HeartPulse, Users, User, Wallet, RotateCcw } from 'lucide-react';
import { ChamberProduct } from '../types';
import { ALL_CHAMBERS } from '../constants/chambers';
import { OptimizedImage } from './shared/OptimizedImage';

interface ChamberFinderProps {
    onSelect: (slug: string) => void;
    onClose?: () => void;
}

type StepId = 'useCase' | 'scale' | 'commitment';

interface OptionCard {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
}

const STEPS: { id: StepId; question: string; options: OptionCard[] }[] = [
    {
        id: 'useCase',
        question: 'What\'s your primary use case?',
        options: [
            {
                id: 'personal',
                label: 'Personal Wellness',
                description: 'Daily recovery, anti-aging, and longevity — for yourself or your household.',
                icon: <Home size={24} />,
            },
            {
                id: 'sports',
                label: 'Sports & Performance',
                description: 'Accelerate recovery between training sessions, enhance performance.',
                icon: <Dumbbell size={24} />,
            },
            {
                id: 'clinic',
                label: 'Clinic / Professional',
                description: 'Wellness centre, spa, chiropractic, rehabilitation — for multiple clients.',
                icon: <Building2 size={24} />,
            },
            {
                id: 'wellness-biz',
                label: 'Wellness Business',
                description: 'Group sessions, luxury wellness destination, or premium health club.',
                icon: <HeartPulse size={24} />,
            },
        ],
    },
    {
        id: 'scale',
        question: 'How many people will use the chamber per session?',
        options: [
            {
                id: 'solo',
                label: 'Just me / 1 person',
                description: 'A personal sanctuary for solo sessions.',
                icon: <User size={24} />,
            },
            {
                id: 'small-group',
                label: '2–3 people',
                description: 'Couples, small teams, or family sessions.',
                icon: <Users size={24} />,
            },
            {
                id: 'medium-group',
                label: '4–5 people',
                description: 'Small group or clinic throughput.',
                icon: <Users size={24} />,
            },
            {
                id: 'try-first',
                label: 'I want to try first',
                description: 'Start with a rental to experience HBOT before committing.',
                icon: <RotateCcw size={24} />,
            },
        ],
    },
    {
        id: 'commitment',
        question: 'How do you want to acquire the chamber?',
        options: [
            {
                id: 'buy',
                label: 'Purchase outright',
                description: 'Full ownership — best value for regular long-term use.',
                icon: <Wallet size={24} />,
            },
            {
                id: 'rent',
                label: 'Rent monthly',
                description: 'Flexible terms from €X/month. No large upfront investment.',
                icon: <RotateCcw size={24} />,
            },
            {
                id: 'rent-to-own',
                label: 'Rent, then buy',
                description: 'Trial the therapy first. Rental can credit toward future purchase.',
                icon: <ChevronRight size={24} />,
            },
        ],
    },
];

// Scoring logic: map answers to chamber scores
function scoreChambers(answers: Record<string, string>): ChamberProduct[] {
    const scored: { chamber: ChamberProduct; score: number }[] = ALL_CHAMBERS.map((c) => {
        let score = 0;

        // Use case scoring
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

        // Scale scoring
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

        // Commitment scoring
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

export const ChamberFinder: React.FC<ChamberFinderProps> = ({ onSelect, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [recommendations, setRecommendations] = useState<ChamberProduct[] | null>(null);

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const canProgress = !!answers[step.id];

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

    const PLACEHOLDER_IMAGES = {
        monoplace: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80',
        multiplace: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
        soft: 'https://images.unsplash.com/photo-1588776814546-1ffedde2e85b?w=400&q=80',
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Find Your Chamber</h2>
                        <p className="text-blue-100 text-sm mt-0.5">
                            3 questions to your perfect HBOT chamber
                        </p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors" aria-label="Close finder">
                            ✕
                        </button>
                    )}
                </div>

                {/* Progress bar */}
                {!recommendations && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-blue-200 mb-1.5">
                            <span>Step {currentStep + 1} of {STEPS.length}</span>
                            <span>{Math.round(((currentStep + (canProgress ? 1 : 0)) / STEPS.length) * 100)}% complete</span>
                        </div>
                        <div className="h-1.5 bg-blue-400/40 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white rounded-full"
                                animate={{ width: `${((currentStep + (canProgress ? 1 : 0)) / STEPS.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {recommendations ? (
                        // Results
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Your recommendations</h3>
                                <p className="text-sm text-slate-500">Based on your answers, these chambers match your needs best.</p>
                            </div>

                            <div className="space-y-3">
                                {recommendations.map((c, i) => (
                                    <motion.div
                                        key={c.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 ${
                                            i === 0 ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'
                                        }`}
                                        onClick={() => onSelect(c.slug)}
                                    >
                                        {i === 0 && (
                                            <span className="absolute text-xs font-bold text-blue-600 -translate-y-6 translate-x-1">
                                                Best match
                                            </span>
                                        )}
                                        <OptimizedImage
                                            src={c.images.find((img) => img.role === 'hero')?.url || PLACEHOLDER_IMAGES[c.type]}
                                            alt={c.fullName}
                                            fallbackSrc={PLACEHOLDER_IMAGES[c.type]}
                                            width={64}
                                            height={64}
                                            sizes="64px"
                                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            {i === 0 && (
                                                <span className="inline-block text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full mb-1">
                                                    ★ Best match
                                                </span>
                                            )}
                                            <p className="font-bold text-slate-900 text-sm">{c.fullName}</p>
                                            <p className="text-xs text-slate-500 line-clamp-1">{c.shortDescription.slice(0, 80)}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-400 shrink-0" />
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={handleReset}
                                className="mt-4 w-full text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <RotateCcw size={14} />
                                Start over
                            </button>
                        </motion.div>
                    ) : (
                        // Questions
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 className="text-base font-bold text-slate-900 mb-4">{step.question}</h3>

                            <div className="grid grid-cols-2 gap-3">
                                {step.options.map((option) => {
                                    const selected = answers[step.id] === option.id;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleAnswer(option.id)}
                                            className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all duration-150 ${
                                                selected
                                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                    : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                                            }`}
                                            aria-pressed={selected}
                                        >
                                            <div className={`p-2 rounded-lg ${selected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {option.icon}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${selected ? 'text-blue-700' : 'text-slate-800'}`}>
                                                    {option.label}
                                                </p>
                                                <p className="text-xs text-slate-500 leading-snug mt-0.5">
                                                    {option.description}
                                                </p>
                                            </div>
                                            {selected && (
                                                <Check size={14} className="text-blue-600 self-end" />
                                            )}
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
                <div className="px-6 pb-6 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canProgress}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLastStep ? 'See recommendations' : 'Next'}
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
