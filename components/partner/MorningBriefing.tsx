import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudSun, Coffee, Calendar, TrendingUp } from 'lucide-react';

export const MorningBriefing: React.FC = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
        >
            <div className="flex items-start gap-6">
                <div className="hidden md:flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-500 shadow-sm border border-amber-200/50">
                        <Sun className="w-8 h-8" />
                    </div>
                    <div className="h-full w-px bg-gradient-to-b from-slate-200 to-transparent my-4" />
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Dr. Chen</span>
                    </h1>
                    <p className="text-slate-500 font-medium mb-6 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {date}
                    </p>

                    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Coffee className="w-4 h-4 text-slate-400" /> Daily Briefing
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                                    You have <strong className="text-slate-900">3 appointments</strong> scheduled today.
                                    Your fleet is operating at <strong className="text-emerald-600">100% capacity</strong>.
                                    Don't forget to review the <em>compliance alerts</em> from yesterday.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="text-right px-5 py-2 bg-slate-50/80 rounded-lg border border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Today's Revenue</div>
                                    <div className="text-xl font-bold text-emerald-600 flex items-center justify-end gap-1">
                                        +$1,240 <TrendingUp className="w-3 h-3" />
                                    </div>
                                    <div className="text-[10px] text-slate-400">3 Sessions</div>
                                </div>
                                <div className="text-right px-5 py-2 bg-slate-900 rounded-lg text-white shadow-lg shadow-slate-900/10">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Net Profit (MTD)</div>
                                    <div className="text-xl font-bold text-white flex items-center justify-end gap-1">
                                        $8,450
                                    </div>
                                    <div className="text-[10px] text-emerald-400 font-medium">
                                        Lease Covered ✓
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
