import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FlaskConical, Stethoscope, Activity, CheckCircle, ChevronRight } from 'lucide-react';

interface VerifiedTrustBadgeProps {
    className?: string;
}

export const VerifiedTrustBadge: React.FC<VerifiedTrustBadgeProps> = ({ className = '' }) => {
    const [isHovered, setIsHovered] = useState(false);

    const pillars = [
        {
            icon: <FlaskConical size={16} className="text-cyan-400" />,
            title: "3rd Party Tested",
            desc: "Independent lab verification for purity & safety",
            id: "verify-1"
        },
        {
            icon: <Stethoscope size={16} className="text-purple-400" />,
            title: "Research Backed",
            desc: "Protocols derived from peer-reviewed studies",
            id: "verify-2"
        },
        {
            icon: <Shield size={16} className="text-emerald-400" />,
            title: "Professional Build Quality",
            desc: "Built to documented quality and safety procedures",
            id: "verify-3"
        },
        {
            icon: <Activity size={16} className="text-amber-400" />,
            title: "Real-World Calibration",
            desc: "Optimized via 10,000+ user bio-sessions",
            id: "verify-4"
        }
    ];

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge Trigger */}
            <motion.div
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 hover:border-emerald-300 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-help group z-10 relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="relative">
                    <Shield size={18} className="text-emerald-500" />
                    <motion.div
                        className="absolute inset-0 bg-emerald-400 rounded-full opacity-20"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700 group-hover:text-emerald-700 transition-colors">
                    Verified Trust
                </span>
                <CheckCircle size={14} className="text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Expanded Flyout */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 md:w-80 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-5 z-50 overflow-hidden"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400" />
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verification Matrix</span>
                                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">100% PASS</span>
                            </div>

                            <div className="space-y-4">
                                {pillars.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-start gap-3 group/item"
                                    >
                                        <div className="mt-0.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100 group-hover/item:border-slate-300 transition-colors shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-800 group-hover/item:text-cyan-700 transition-colors flex items-center gap-1">
                                                {item.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
                                <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 mx-auto group/btn transition-all">
                                    View Full Transparency Report <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
