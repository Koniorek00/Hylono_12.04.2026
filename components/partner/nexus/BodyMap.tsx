import React from 'react';
import { motion } from 'motion/react';

interface BodyMapProps {
    onZoneClick: (zone: string) => void;
    activeZones: string[];
}

export const BodyMap: React.FC<BodyMapProps> = ({ onZoneClick, activeZones }) => {

    // Helper for interactive zone areas
    const Zone = ({ id, label, path, cx, cy }: { id: string, label: string, path: string, cx: number, cy: number }) => {
        const isActive = activeZones.includes(id);

        return (
            <g
                onClick={() => onZoneClick(id)}
                className="cursor-pointer group"
            >
                <motion.path
                    d={path}
                    initial={false}
                    animate={{
                        fill: isActive ? '#06b6d4' : '#f1f5f9', // cyan-500 vs slate-100
                        stroke: isActive ? '#0891b2' : '#cbd5e1', // cyan-600 vs slate-300
                    }}
                    whileHover={{ fill: isActive ? '#0891b2' : '#e2e8f0' }}
                    className="transition-colors duration-200"
                    strokeWidth="2"
                />
                {/* Connector Dot */}
                <circle cx={cx} cy={cy} r="4" className={`fill-current ${isActive ? 'text-cyan-600' : 'text-slate-300 group-hover:text-slate-400'}`} />

                {/* Floating Label (Visible on Hover/Active) */}
                <motion.foreignObject x={cx + 15} y={cy - 12} width="100" height="30" className="pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                        whileHover={{ opacity: 1, x: 0 }} // Logic doesn't work perfectly on group hover in SVG foreignObject, but isActive handles state
                        className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded backdrop-blur-sm ${isActive ? 'bg-cyan-50/90 text-cyan-700' : 'bg-slate-800/80 text-white'}`}
                    >
                        {label}
                    </motion.div>
                </motion.foreignObject>
            </g>
        );
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-white rounded-xl border border-slate-100 p-4 overflow-hidden">
            <div className="absolute top-3 left-3 flex flex-col gap-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hylono Bio-Twin</div>
                <div className="text-[9px] text-slate-300">INTERACTIVE ANATOMY v1.0</div>
            </div>

            <svg viewBox="0 0 200 450" className="h-full w-auto max-h-[400px]">
                {/* Silhouette Outline (Abstract) */}

                {/* HEAD */}
                <Zone
                    id="head"
                    label="Brain / Neuro"
                    cx={100} cy={45}
                    path="M 75 40 Q 75 10 100 10 Q 125 10 125 40 Q 125 70 100 70 Q 75 70 75 40 Z" // Simplified Head
                />

                {/* CHEST / THORAX */}
                <Zone
                    id="chest"
                    label="Cardio / Resp"
                    cx={100} cy={110}
                    path="M 65 80 L 135 80 L 125 150 L 75 150 Z" // Simplified Chest
                />

                {/* ABDOMEN */}
                <Zone
                    id="gut"
                    label="Metabolic / Gut"
                    cx={100} cy={180}
                    path="M 75 155 L 125 155 L 120 210 L 80 210 Z"
                />

                {/* ARMS (Combined L/R for simplicity in demo) */}
                <Zone
                    id="arms"
                    label="Musculoskeletal"
                    cx={150} cy={130}
                    path="M 140 85 L 170 180 L 155 185 L 130 90 Z" // Right Arm
                />

                {/* LEGS / KNEES */}
                <Zone
                    id="legs"
                    label="Joints / Mobility"
                    cx={100} cy={300}
                    path="M 80 215 L 120 215 L 110 380 L 90 380 Z" // Legs
                />

            </svg>

            {/* Legend / Tip */}
            <div className="absolute bottom-3 text-center w-full">
                <p className="text-[10px] text-slate-400 italic">Click active zones to toggle conditions</p>
            </div>
        </div>
    );
};

