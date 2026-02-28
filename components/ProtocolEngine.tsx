import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, CheckCircle, Clock, Zap, Save, Sparkles, ArrowRight } from 'lucide-react';
import { TechType } from '../types';
import { useRouter } from 'next/navigation';

interface ProtocolEngineStep {
    title: string;
    desc: string;
    duration?: number; // in minutes
}

interface ProtocolEngineProps {
    steps: ProtocolEngineStep[];
    techName: string;
    accentColor: string;
    onComplete?: () => void;
    nextSynergy?: {
        name: string;
        id: TechType;
    };
}

export const ProtocolEngine: React.FC<ProtocolEngineProps> = ({ steps, techName, accentColor, onComplete, nextSynergy }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isCompleted, setIsCompleted] = useState(false);

    const step = steps[currentStep];
    const hasNext = currentStep < steps.length - 1;
    const hasPrev = currentStep > 0;

    // Initialize timer for current step
    useEffect(() => {
        if (step.duration) {
            setTimeLeft(step.duration * 60);
        } else {
            setTimeLeft(0);
        }
        setIsActive(false);
    }, [currentStep, step.duration]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (hasNext) {
                // Auto-advance or wait for user? Let's stay on current step but show completion
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, hasNext]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (hasNext) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const handlePrev = () => {
        if (hasPrev) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const progress = step.duration ? ((step.duration * 60 - timeLeft) / (step.duration * 60)) * 100 : 0;

    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-3xl p-12 text-center text-white shadow-2xl overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Protocol Complete</h2>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                    Excellent progress. Your {techName} session has been logged to your daily bio-analytics.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => { setCurrentStep(0); setIsCompleted(false); }}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
                    >
                        Repeat Session
                    </button>
                    <button
                        onClick={() => { onComplete?.(); }}
                        className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> Save to Dashboard
                    </button>
                </div>

                {nextSynergy && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 pt-8 border-t border-white/10"
                    >
                        <div className="flex items-center justify-between bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="text-left">
                                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                                    <Sparkles size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Synergy Recommended</span>
                                </div>
                                <h4 className="text-lg font-bold">Stack with {nextSynergy.name}</h4>
                                <p className="text-xs text-slate-400">Maximize your cellular window with a follow-up session.</p>
                            </div>
                            <button
                                className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-cyan-400 transition-all"
                                onClick={() => {
                                    // Logic to jump to next tech would go here
                                    router.push(`/product/${nextSynergy.id}?launch=true`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Continue Stack <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header / Active Step */}
            <div className={`p-6 ${accentColor} text-white flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                        {currentStep + 1}
                    </div>
                    <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Active Protocol</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono opacity-80">
                    <Clock size={12} /> SESSION ID: HYLO-{techName.substring(0, 3).toUpperCase()}-{(currentStep + 1).toString().padStart(3, '0')}
                </div>
            </div>

            <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Visualizer / Timer Overlay */}
                    <div className="relative aspect-square flex items-center justify-center">
                        {/* Progress ring background */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="fill-none stroke-slate-50 stroke-[8]"
                            />
                            <motion.circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className={`fill-none stroke-[8] ${steps[0].duration ? 'stroke-cyan-500' : 'stroke-slate-200'}`}
                                strokeDasharray="100 100"
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: 100 - progress }}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>

                        <div className="text-center z-10">
                            {step.duration ? (
                                <>
                                    <div className="text-5xl font-black text-slate-900 futuristic-font mb-2">
                                        {formatTime(timeLeft)}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Remaining
                                    </div>
                                </>
                            ) : (
                                <Zap size={48} className="text-slate-200 mx-auto" />
                            )}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed mb-8">
                                    {step.desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            {step.duration && (
                                <button
                                    onClick={() => setIsActive(!isActive)}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isActive
                                        ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {isActive ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                                </button>
                            )}
                            <button
                                onClick={() => { setIsActive(false); setTimeLeft(step.duration ? step.duration * 60 : 0); }}
                                className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                <RotateCcw size={20} />
                            </button>
                            <div className="flex-1" />
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrev}
                                    disabled={!hasPrev}
                                    className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="px-6 h-12 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md group"
                                >
                                    {hasNext ? 'Next Step' : 'Finish Session'} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Progress Bar */}
            <div className="h-2 bg-slate-50 w-full">
                <motion.div
                    className={`h-full ${accentColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
            </div>
        </div>
    );
};
