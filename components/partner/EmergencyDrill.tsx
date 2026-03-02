import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Siren, Clock, Skull, CheckCircle } from 'lucide-react';

interface EmergencyDrillProps {
    scenario: string;
    options: { label: string; correct: boolean }[];
    onComplete: (success: boolean) => void;
}

export const EmergencyDrill: React.FC<EmergencyDrillProps> = ({ scenario, options, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(100); // 100% time
    const [failed, setFailed] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!failed && !success) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        setFailed(true);
                        return 0;
                    }
                    return prev - 1; // Decreases by 1% every ~100ms (10s total)
                });
            }, 100);
            return () => clearInterval(timer);
        }
    }, [failed, success]);

    const handleOptionClick = (isCorrect: boolean) => {
        if (failed || success) return;

        if (isCorrect) {
            setSuccess(true);
            setTimeout(() => onComplete(true), 2000);
        } else {
            setFailed(true);
        }
    };

    const handleRetry = () => {
        setTimeLeft(100);
        setFailed(false);
        setSuccess(false);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-md animate-pulse-slow">
            {/* Red Alert Overlay */}
            <div className="absolute inset-0 border-[20px] border-red-600/20 pointer-events-none animate-pulse" />

            <div className="w-full max-w-sm bg-slate-900 rounded-2xl border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] p-6 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-red-900/50 pb-4">
                    <div className="bg-red-500/20 p-2 rounded-full animate-bounce">
                        <Siren className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest leading-none">Emergency</h2>
                        <span className="text-white font-mono text-xs tracking-[0.2em] uppercase">Red Alert Protocol</span>
                    </div>
                </div>

                {!failed && !success && (
                    <>
                        {/* Scenario */}
                        <div className="mb-8 text-center">
                            <p className="text-lg font-bold text-white mb-2">{scenario}</p>
                            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700 relative">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-red-600 to-orange-500"
                                    style={{ width: `${timeLeft}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-black drop-shadow-md">
                                    <Clock className="w-3 h-3 mr-1" /> CRITICAL TIME WINDOW
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleOptionClick(opt.correct)}
                                    className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-white text-white font-bold rounded-xl transition-all active:scale-95 uppercase text-sm tracking-wide shadow-lg"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Failure State */}
                {failed && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <Skull className="w-20 h-20 text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-white mb-2">DRILL FAILED</h3>
                        <p className="text-red-400 mb-6 font-mono text-sm">Patient status critical. Response time too slow or incorrect action taken.</p>
                        <button
                            onClick={handleRetry}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                        >
                            Retry Protocol
                        </button>
                    </motion.div>
                )}

                {/* Success State */}
                {success && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">CRISIS AVERTED</h3>
                        <p className="text-emerald-400 mb-6 font-mono text-sm">Correct protocol executed. Patient stabilized.</p>
                        <div className="text-amber-400 font-bold text-lg animate-pulse">
                            +500 XP AWARDED
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

