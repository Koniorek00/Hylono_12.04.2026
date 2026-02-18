import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';
import { calculateRentalTotal } from '../utils/PricingEngine';
import { Plus, X, ShoppingBag, ArrowRight, Check, Zap } from 'lucide-react';

interface RentalConfiguratorProps {
    onCheckout?: () => void;
    onNavigate?: (path: string) => void;
}

export const RentalConfigurator: React.FC<RentalConfiguratorProps> = ({ onCheckout, onNavigate }) => {
    // const router = useRouter(); // REMOVED: Incompatible with Vite
    const [selectedItems, setSelectedItems] = useState<TechType[]>([]);
    const [pricing, setPricing] = useState(calculateRentalTotal([]));

    useEffect(() => {
        setPricing(calculateRentalTotal(selectedItems));
    }, [selectedItems]);

    const toggleItem = (id: TechType) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(prev => prev.filter(item => item !== id));
        } else {
            setSelectedItems(prev => [...prev, id]);
        }
    };

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden flex flex-col md:flex-row">

            {/* LEFT: SELECTION GRID */}
            <div className="flex-1 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2 futuristic-font">Build Your Clinic</h3>
                <p className="text-sm text-slate-500 mb-8">Select 2+ modalities to unlock Synergy Tier pricing.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(TECH_DETAILS).map((tech) => (
                        <motion.button
                            key={tech.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleItem(tech.id)}
                            className={`relative p-4 rounded-2xl border text-left transition-all duration-300 group
                                ${selectedItems.includes(tech.id)
                                    ? 'bg-slate-900 border-slate-900 shadow-lg'
                                    : 'bg-white border-slate-200 hover:border-cyan-500/50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold uppercase tracking-widest ${selectedItems.includes(tech.id) ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-600'}`}>
                                    {tech.name}
                                </span>
                                {selectedItems.includes(tech.id) ? (
                                    <div className="bg-cyan-500 text-white rounded-full p-0.5"><Check size={12} /></div>
                                ) : (
                                    <div className="border border-slate-200 rounded-full p-0.5"><Plus size={12} className="text-slate-400" /></div>
                                )}
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-lg font-bold ${selectedItems.includes(tech.id) ? 'text-white' : 'text-slate-900'}`}>
                                    ${tech.rentalPrice}
                                </span>
                                <span className={`text-xs ${selectedItems.includes(tech.id) ? 'text-slate-400' : 'text-slate-400'}`}>/mo</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* RIGHT: PRICING ENGINE VISUALIZER */}
            <div className="w-full md:w-[400px] bg-slate-900 text-white p-8 flex flex-col relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400"> Monthly Estimate</span>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors duration-500
                            ${pricing.discount > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                            {pricing.tier}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>Subtotal</span>
                            <span>${pricing.total}</span>
                        </div>
                        {pricing.discount > 0 && (
                            <div className="flex justify-between text-sm text-emerald-400">
                                <span className="flex items-center gap-2"><Zap size={12} /> Bundle Savings</span>
                                <span>-${pricing.discount.toFixed(0)}</span>
                            </div>
                        )}
                        <div className="h-px bg-white/10 my-4" />
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold uppercase tracking-widest text-white">Total</span>
                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                ${pricing.finalTotal.toFixed(0)}
                            </span>
                        </div>
                        <div className="text-right text-xs text-slate-500 mt-1">per month</div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (onCheckout) {
                            onCheckout();
                        } else if (onNavigate) {
                            const params = new URLSearchParams();
                            params.set('items', selectedItems.join(','));
                            onNavigate(`rental/checkout?${params.toString()}`);
                        }
                    }}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                        ${selectedItems.length > 0
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                            : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
                >
                    <ShoppingBag size={16} />
                    {selectedItems.length > 0 ? 'Start Rental Application' : 'Select Devices'}
                </button>
            </div>
        </div>
    );
};
