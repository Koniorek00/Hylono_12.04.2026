import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, X } from 'lucide-react';


interface CenteringPracticeProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    duration?: number; // seconds
}

export const CenteringPractice: React.FC<CenteringPracticeProps> = ({
    isOpen,
    onClose,
    onComplete,
    duration = 60
}) => {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [secondsLeft, setSecondsLeft] = useState(duration);
    const [breathCount, setBreathCount] = useState(0);

    // Breathing cycle: 4s inhale, 4s hold, 6s exhale = 14s per cycle
    const INHALE_DURATION = 4000;
    const HOLD_DURATION = 4000;
    const EXHALE_DURATION = 6000;

    useEffect(() => {
        if (!isOpen) {
            setSecondsLeft(duration);
            setBreathCount(0);
            setPhase('inhale');
            return;
        }

        // Countdown timer
        const countdown = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [isOpen, duration, onComplete]);

    // Breathing cycle controller
    useEffect(() => {
        if (!isOpen) return;

        const cycle = () => {
            setPhase('inhale');
            setTimeout(() => {
                setPhase('hold');
                setTimeout(() => {
                    setPhase('exhale');
                    setBreathCount((prev) => prev + 1);
                }, HOLD_DURATION);
            }, INHALE_DURATION);
        };

        cycle();
        const interval = setInterval(cycle, INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION);
        return () => clearInterval(interval);
    }, [isOpen]);

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In';
            case 'hold': return 'Hold';
            case 'exhale': return 'Release';
        }
    };

    const getOrbScale = () => {
        switch (phase) {
            case 'inhale': return 1.4;
            case 'hold': return 1.4;
            case 'exhale': return 1;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-slate-50" />

                    <div className="relative z-10 text-center">
                        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>

                        {/* Breathing Orb */}
                        <motion.div
                            animate={{ scale: getOrbScale() }}
                            transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 0.1, ease: 'easeInOut' }}
                            className={`w-48 h-48 mx-auto rounded-full mb-12 flex items-center justify-center bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-500 shadow-[0_0_80px_rgba(6,182,212,0.4)]
                                }`}
                        >
                            <Wind className="text-white/80" size={48} />
                        </motion.div>

                        {/* Phase Indicator */}
                        <motion.h2
                            key={phase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-light tracking-widest uppercase mb-4 text-slate-700"
                        >
                            {getPhaseText()}
                        </motion.h2>

                        {/* Timer */}
                        <p className="text-6xl font-bold mb-8 text-slate-900">
                            {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
                        </p>

                        {/* Progress */}
                        <div className="w-64 mx-auto">
                            <div className="h-1 rounded-full bg-slate-200">
                                <motion.div
                                    className="h-full rounded-full bg-cyan-500"
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${(secondsLeft / duration) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs mt-4 uppercase tracking-widest text-slate-400">
                                {breathCount} breaths completed
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

