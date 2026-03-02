import React from 'react';
import { motion } from 'motion/react';

interface BioBodyMapProps {
    scores: {
        recovery: number;
        cognitive: number;
        cellular: number;
        pain: number;
        longevity: number;
    };
    hoveredMetric: string | null;
}

export const BioBodyMap: React.FC<BioBodyMapProps> = ({ scores, hoveredMetric }) => {
    // Determine opacity based on scores or hover state
    const getOpacity = (metric: string, score: number) => {
        if (hoveredMetric && hoveredMetric !== metric) return 0.1;
        if (hoveredMetric === metric) return 1;
        return 0.3 + (score / 200); // Base visibility + intensity
    };

    const getGlow = (metric: string, color: string) => {
        return hoveredMetric === metric ? `drop-shadow(0 0 10px ${color})` : 'none';
    };

    return (
        <div className="relative w-full h-[400px] flex items-center justify-center">
            <svg viewBox="0 0 200 450" className="h-full w-auto overflow-visible">
                {/* Silhouette Outline */}
                <path
                    d="M100,30 C115,30 125,40 125,55 C125,65 120,70 120,80 L140,85 L160,150 L145,200 L145,250 L130,300 L135,380 L120,440 L80,440 L65,380 L70,300 L55,250 L55,200 L40,150 L60,85 L80,80 C80,70 75,65 75,55 C75,40 85,30 100,30 Z"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="2"
                    opacity="0.5"
                />

                {/* BRAIN (Cognitive) */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: getOpacity('cognitive', scores.cognitive) }}
                    style={{ filter: getGlow('cognitive', '#38bdf8') }}
                >
                    <circle cx="100" cy="55" r="15" fill="#0ea5e9" className="mix-blend-screen" />
                    <circle cx="100" cy="55" r="8" fill="#bae6fd" />
                </motion.g>

                {/* HEART/LUNGS (Longevity/Systemic) */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: getOpacity('longevity', scores.longevity) }}
                    style={{ filter: getGlow('longevity', '#22c55e') }}
                >
                    <path d="M85,100 Q100,120 115,100 L100,140 Z" fill="#22c55e" className="mix-blend-screen" />
                </motion.g>

                {/* MUSCLES (Recovery) */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: getOpacity('recovery', scores.recovery) }}
                    style={{ filter: getGlow('recovery', '#f43f5e') }}
                >
                    {/* Shoulders/Arms */}
                    <ellipse cx="60" cy="110" rx="10" ry="20" fill="#f43f5e" className="mix-blend-screen" />
                    <ellipse cx="140" cy="110" rx="10" ry="20" fill="#f43f5e" className="mix-blend-screen" />
                    {/* Thighs */}
                    <ellipse cx="80" cy="250" rx="12" ry="40" fill="#f43f5e" className="mix-blend-screen" />
                    <ellipse cx="120" cy="250" rx="12" ry="40" fill="#f43f5e" className="mix-blend-screen" />
                </motion.g>

                {/* CELLS (Cellular - Distributed) */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: getOpacity('cellular', scores.cellular) }}
                    style={{ filter: getGlow('cellular', '#a855f7') }}
                >
                    {/* Scattered Particles */}
                    {[...Array(12)].map((_, i) => (
                        <circle key={`particle-${i}`} cx={70 + Math.random() * 60} cy={80 + Math.random() * 300} r="2" fill="#a855f7" className="animate-pulse" />
                    ))}
                </motion.g>

                {/* JOINTS (Pain) */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: getOpacity('pain', scores.pain) }}
                    style={{ filter: getGlow('pain', '#fcd34d') }}
                >
                    <circle cx="140" cy="110" r="4" fill="#fcd34d" />
                    <circle cx="60" cy="110" r="4" fill="#fcd34d" />
                    <circle cx="145" cy="200" r="4" fill="#fcd34d" />
                    <circle cx="55" cy="200" r="4" fill="#fcd34d" />
                    <circle cx="120" cy="300" r="5" fill="#fcd34d" />
                    <circle cx="80" cy="300" r="5" fill="#fcd34d" />
                </motion.g>

            </svg>

            {/* Labels overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {hoveredMetric === 'cognitive' && <span className="absolute top-[10%] left-[60%] text-cyan-400 text-xs font-bold bg-cyan-900/80 px-2 py-1 rounded border border-cyan-500/50">Neuro-Optimization</span>}
                {hoveredMetric === 'recovery' && <span className="absolute top-[50%] right-[10%] text-rose-400 text-xs font-bold bg-rose-900/80 px-2 py-1 rounded border border-rose-500/50">Muscle Tissue</span>}
            </div>
        </div>
    );
};

