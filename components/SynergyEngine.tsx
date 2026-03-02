import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    Play, Settings, HelpCircle, FileText, ChevronRight,
    Zap, Wind, Activity, Sun, Droplets, Clock, BookOpen, Phone
} from 'lucide-react';
import { TechType } from '../types';
import { TECH_DETAILS } from '../constants.ts';

interface SynergyEngineProps {
    ownedTech: TechType[];
    onNavigate?: (page: string) => void;
}

const TECH_ICONS: Partial<Record<TechType, React.ReactNode>> = {
    [TechType.HBOT]: <Wind size={24} />,
    [TechType.PEMF]: <Activity size={24} />,
    [TechType.RLT]: <Sun size={24} />,
    [TechType.HYDROGEN]: <Droplets size={24} />
};

// Simple protocols based on what user owns
const getProtocolsForTech = (tech: TechType) => {
    const protocols: Partial<Record<TechType, { name: string; duration: string; when: string }[]>> = {
        [TechType.HBOT]: [
            { name: 'Morning Session', duration: '60 min', when: 'After waking, before breakfast' },
            { name: 'Recovery Session', duration: '45 min', when: 'Post-workout within 2 hours' }
        ],
        [TechType.PEMF]: [
            { name: 'Quick Recharge', duration: '15 min', when: 'Anytime you need energy' },
            { name: 'Sleep Prep', duration: '20 min', when: '1 hour before bed' }
        ],
        [TechType.RLT]: [
            { name: 'Morning Light', duration: '10 min', when: 'First thing in the morning' },
            { name: 'Skin & Recovery', duration: '15 min', when: 'After shower or workout' }
        ],
        [TechType.HYDROGEN]: [
            { name: 'Focus Session', duration: '30 min', when: 'Before important work' },
            { name: 'Evening Wind-Down', duration: '20 min', when: 'After dinner' }
        ]
    };
    return protocols[tech] ?? [];
};

export const SynergyEngine: React.FC<SynergyEngineProps> = ({ ownedTech, onNavigate }) => {
    const [selectedDevice, setSelectedDevice] = useState<TechType | null>(ownedTech[0] || null);

    // If no devices, show simple CTA
    if (ownedTech.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} className="text-slate-600" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">No devices yet</h2>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Add your Hylono devices to get personalized protocols and usage guides.
                </p>
                <button
                    onClick={() => onNavigate?.('store')}
                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-cyan-400 transition-colors"
                >
                    Explore Devices
                </button>
            </div>
        );
    }

    const selectedData = selectedDevice ? TECH_DETAILS[selectedDevice] : null;
    const protocols = selectedDevice ? getProtocolsForTech(selectedDevice) : [];

    return (
        <div className="space-y-8">
            {/* My Devices - Simple Tabs */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">My Devices</h2>
                <div className="flex gap-3 flex-wrap">
                    {ownedTech.map(tech => {
                        const data = TECH_DETAILS[tech];
                        const isSelected = selectedDevice === tech;

                        return (
                            <button
                                key={tech}
                                onClick={() => setSelectedDevice(tech)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isSelected
                                        ? 'bg-white text-slate-900 border-white'
                                        : 'bg-slate-800/50 text-white border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg ${isSelected ? 'bg-slate-900' : data.accentColor} flex items-center justify-center ${isSelected ? 'text-white' : 'text-white'}`}>
                                    {TECH_ICONS[tech]}
                                </div>
                                <span className="font-medium">{data.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Device Panel */}
            {selectedDevice && selectedData && (
                <motion.div
                    key={selectedDevice}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all">
                            <BookOpen size={20} className="text-cyan-400" />
                            <span className="text-sm text-white">User Guide</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all">
                            <Settings size={20} className="text-purple-400" />
                            <span className="text-sm text-white">Settings</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all">
                            <HelpCircle size={20} className="text-amber-400" />
                            <span className="text-sm text-white">FAQ</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all">
                            <Phone size={20} className="text-emerald-400" />
                            <span className="text-sm text-white">Support</span>
                        </button>
                    </div>

                    {/* Suggested Protocols for THIS Device */}
                    <div>
                        <h3 className="text-base font-medium text-white mb-3">How to Use Your {selectedData.name}</h3>
                        <div className="space-y-3">
                            {protocols.map((protocol) => (
                                <div
                                    key={protocol.name}
                                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${selectedData.accentColor} flex items-center justify-center text-white`}>
                                            <Play size={16} fill="white" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{protocol.name}</h4>
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {protocol.duration}
                                                </span>
                                                <span>•</span>
                                                <span>{protocol.when}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                        <p className="text-sm text-cyan-100">
                            <span className="font-medium">Tip:</span> For best results with {selectedData.name},
                            {selectedDevice === TechType.HBOT && ' stay hydrated before and after your session.'}
                            {selectedDevice === TechType.PEMF && ' use on bare skin or thin clothing for optimal contact.'}
                            {selectedDevice === TechType.RLT && ' keep your eyes closed or wear the provided goggles.'}
                            {selectedDevice === TechType.HYDROGEN && ' breathe normally through the nasal cannula.'}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

