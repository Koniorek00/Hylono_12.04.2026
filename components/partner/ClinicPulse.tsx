import React from 'react';
import { motion } from 'motion/react';

export const ClinicPulse: React.FC = () => {
    // Generate mock data points
    const data = Array.from({ length: 40 }, (_, i) => ({
        value: 30 + Math.random() * 40 + (i % 5 === 0 ? 50 : 0) // Add "heartbeat" spikes
    }));

    return (
        <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg h-full min-h-[160px] flex flex-col justify-between">
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg mb-1">Clinic Pulse</h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Live Activity</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold">8</div>
                    <div className="text-xs text-slate-400">Active Sessions</div>
                </div>
            </div>

            {/* Simulated Live Graph */}
            <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-between px-2 gap-1 opacity-50">
                {data.map((point, i) => (
                    <motion.div
                        key={i}
                        className="w-full bg-cyan-500/40 rounded-t-sm"
                        initial={{ height: `${point.value}%` }}
                        animate={{
                            height: [`${point.value}%`, `${Math.max(10, point.value + (Math.random() * 20 - 10))}%`]
                        }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2,
                            delay: i * 0.05
                        }}
                    />
                ))}
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />
        </div>
    );
};

