import React from 'react';
import { TechData } from '../../../types';
import { TechAddonCard } from '../../TechAddonCard';

interface TechAddonsProps {
    data: TechData;
    selectedAddons: string[];
    onToggleAddon: (id: string) => void;
}

export const TechAddons: React.FC<TechAddonsProps> = ({ data, selectedAddons, onToggleAddon }) => {
    if (!data.addons || data.addons.length === 0) return null;

    return (
        <section id="config" className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-cyan-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">System Enhancements</span>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Complete Your Setup</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Tailor your {data.name} system with premium accessories and performance upgrades.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.addons.map((addon) => (
                        <TechAddonCard
                            key={addon.id}
                            addon={addon}
                            isSelected={selectedAddons.includes(addon.id)}
                            onToggle={() => onToggleAddon(addon.id)}
                            accentColor={data.accentColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
