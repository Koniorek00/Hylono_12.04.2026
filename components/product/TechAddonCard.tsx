import React from 'react';
import { motion } from 'motion/react';
import { Plus, Check } from 'lucide-react';
import { TechAddon } from '../../types';

interface TechAddonCardProps {
    addon: TechAddon;
    isSelected: boolean;
    onToggle: () => void;
    accentColor: string;
}

export const TechAddonCard: React.FC<TechAddonCardProps> = ({ addon, isSelected, onToggle, accentColor }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group
                ${isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/20'
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
                }
            `}
            onClick={onToggle}
        >
            {/* Background Glow for Selected State */}
            {isSelected && (
                <div className={`absolute top-0 right-0 w-32 h-32 ${accentColor.replace('bg-', 'bg-')}/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2`} />
            )}

            <div className="p-6 relative z-10 flex flex-col h-full">
                {/* Header: Category & Checkbox */}
                <div className="flex justify-between items-start mb-4">
                    <span className={`
                        text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md
                        ${isSelected ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-slate-500'}
                    `}>
                        {addon.category}
                    </span>
                    <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                        ${isSelected ? 'bg-cyan-500 text-white rotate-0' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200 rotate-90'}
                    `}>
                        {isSelected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                    <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {addon.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                        {addon.description}
                    </p>
                </div>

                {/* Footer: Price */}
                <div className="mt-6 pt-4 border-t border-dashed border-slate-700/10 flex items-center justify-between">
                    <span className={`font-mono font-bold text-lg ${isSelected ? 'text-cyan-400' : 'text-slate-900'}`}>
                        +${addon.price.toLocaleString()}
                    </span>
                    {isSelected && (
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            Added to Config
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

