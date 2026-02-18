import React, { useState, useEffect } from 'react';
import { Package, Lock, Timer, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    available: number;
    reserved: number;
    allowBackorder: boolean;
    onReserve: () => void;
}

export const StockMonitor: React.FC<Props> = ({ available, reserved, allowBackorder, onReserve }) => {
    // Simulating "Live" Updates
    const [liveAvailable, setLiveAvailable] = useState(available);
    const [liveReserved, setLiveReserved] = useState(reserved);
    const [isUpdating, setIsUpdating] = useState(false);

    // Randomly fluctuate stock every few seconds to simulate activity
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsUpdating(true);
                // Occasionally drop stock or increase reserved
                if (Math.random() > 0.5 && liveAvailable > 0) {
                    setLiveAvailable(prev => Math.max(0, prev - 1));
                    setLiveReserved(prev => prev + 1);
                }
                setTimeout(() => setIsUpdating(false), 1000);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [liveAvailable]);

    const isLowStock = liveAvailable < 5;

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 relative overflow-hidden">
            {/* Live Indicator */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Real-time Inventory</span>
                </div>
                {isUpdating && <RefreshCw size={12} className="text-slate-400 animate-spin" />}
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <div className="text-2xl font-bold text-slate-900 flex items-end gap-2">
                        {liveAvailable}
                        <span className="text-xs text-slate-500 font-normal mb-1">units available</span>
                    </div>
                    {isLowStock && (
                        <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                            <Timer size={10} /> High Demand: Selling fast
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider justify-end">
                        <Lock size={10} /> Reserved
                    </div>
                    <div className="text-lg font-mono text-slate-600">
                        {liveReserved}
                    </div>
                </div>
            </div>

            {/* Simulated Serverless Integration Message */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-start gap-2">
                <Info size={12} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-tight">
                    Inventory is locked via Firestore Transactions for 15 minutes during checkout to prevent overselling.
                </p>
            </div>
        </div>
    );
};
