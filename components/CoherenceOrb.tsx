import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';


interface CoherenceOrbProps {
    // Simulated coherence score 0-100
    // In production, this would come from HRV/biometric data
    baseScore?: number;
}

export const CoherenceOrb: React.FC<CoherenceOrbProps> = ({ baseScore = 65 }) => {
    const [score, setScore] = useState(baseScore);
    const [isExpanded, setIsExpanded] = useState(false);

    // Simulate slight score variations for lifelike feel
    useEffect(() => {
        const interval = setInterval(() => {
            setScore((prev) => {
                const delta = (Math.random() - 0.5) * 6;
                const newScore = Math.max(30, Math.min(100, prev + delta));
                return Math.round(newScore);
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getScoreColor = () => {
        if (score >= 80) return 'from-emerald-400 to-teal-500';
        if (score >= 60) return 'from-cyan-400 to-blue-500';
        if (score >= 40) return 'from-yellow-400 to-amber-500';
        return 'from-red-400 to-rose-500';
    };

    const getScoreLabel = () => {
        if (score >= 80) return 'Optimal';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Building';
        return 'Calibrating';
    };

    return (
        <div className="fixed top-24 right-8 z-40">
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                {/* Pulsing Orb */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${getScoreColor()} flex items-center justify-center shadow-lg`}
                    style={{
                        boxShadow: score >= 60
                            ? `0 0 ${score / 3}px rgba(6, 182, 212, 0.5)`
                            : `0 0 10px rgba(239, 68, 68, 0.3)`
                    }}
                >
                    <span className="text-white font-bold text-sm">{score}</span>
                </motion.div>
            </motion.button>

            {/* Expanded Details */}
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-16 w-56 p-4 rounded-2xl border backdrop-blur-xl shadow-xl bg-white/90 border-slate-200"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Activity size={14} className="text-cyan-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Coherence Score
                        </span>
                    </div>

                    <div className="text-3xl font-bold mb-1 text-slate-900">
                        {score}
                        <span className="text-sm font-normal text-slate-400">/100</span>
                    </div>

                    <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mb-4 ${score >= 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        <TrendingUp size={10} />
                        {getScoreLabel()}
                    </div>

                    <div className="space-y-2 text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Sessions Today</span>
                            <span className="text-slate-700">2</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Streak</span>
                            <span className="text-slate-700">7 days 🔥</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Weekly Avg</span>
                            <span className="text-slate-700">72</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
