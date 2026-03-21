import React from 'react';
import { Tier } from '../types';
import { CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';

const TECH_TREE_MAPPING = {
    [Tier.FOUNDATION]: [
        { name: 'Circadian App', owned: true },
        { name: 'Magnesium', owned: true },
        { name: 'Blue Blockers', owned: false }
    ],
    [Tier.CORE]: [
        { name: 'Smart Mattress', owned: true },
        { name: 'PEMF Mat', owned: false },
        { name: 'Oura Ring', owned: true }
    ],
    [Tier.OPTIMIZATION]: [
        { name: 'HBOT Chamber', owned: false },
        { name: 'Hydrogen Inhaler', owned: false },
        { name: 'Cryo Local', owned: false }
    ]
};

export const EcosystemTree: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-8">
            {Object.entries(TECH_TREE_MAPPING).map(([tier, items], idx) => (
                <div key={tier} className="relative">
                    {/* Connecting Line */}
                    {idx < 2 && (
                        <div className="absolute left-6 top-12 bottom-[-32px] w-0.5 bg-slate-800 -z-10" />
                    )}

                    <div className="flex items-start gap-6">
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 bg-slate-950 z-10 
                            ${idx === 0 ? 'border-emerald-500 text-emerald-500' : idx === 1 ? 'border-cyan-500 text-cyan-500' : 'border-purple-500 text-purple-500'}`}
                        >
                            <span className="font-bold text-xs">0{idx + 1}</span>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">{tier} Tier</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {items.map((item) => (
                                    <div
                                        key={item.name}
                                        className={`p-4 rounded-xl border flex items-center justify-between group transition-all
                                            ${item.owned
                                                ? 'bg-slate-900 border-slate-700 opacity-100'
                                                : 'bg-slate-950 border-dashed border-slate-800 opacity-60 hover:opacity-100 hover:border-gray-600 cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.owned ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Lock size={16} className="text-gray-600" />}
                                            <span className={`text-sm ${item.owned ? 'text-white' : 'text-gray-400'}`}>{item.name}</span>
                                        </div>
                                        {!item.owned && <ArrowUpRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
