import React from 'react';
import { motion } from 'motion/react';
import { Layers, ArrowRight, Zap, Activity, Brain, Plus } from 'lucide-react';
import { TechType } from '../types';

interface StackProps {
    currentTech: TechType;
    onJump: (tech: TechType) => void;
}

const STACKS = {
    [TechType.HBOT]: {
        title: "The Superhuman Protocol",
        description: "Sequence magnetism, oxygen, and light for maximum cellular uptake.",
        items: [
            { id: TechType.PEMF, name: "PEMF Mat", role: "Charge & Separate Cells", icon: Zap },
            { id: TechType.HBOT, name: "HBOT Chamber", role: "Saturate Plasma", icon: Activity },
            { id: TechType.RLT, name: "Red Light Panel", role: "Drive ATP Production", icon: ArrowRight }
        ],
        benefit: "10x Oxygen Delivery"
    },
    [TechType.PEMF]: {
        title: "Deep Sleep Stack",
        description: "Entrain brainwaves and activate parasympathetic restoration.",
        items: [
            { id: TechType.PEMF, name: "PEMF (Delta)", role: "Brainwave Entrainment", icon: Brain },
            { id: TechType.HYDROGEN, name: "Hydrogen", role: "Reduce Inflammation", icon: Activity },
            { id: TechType.RLT, name: "Red Light (PM)", role: "Melatonin Signal", icon: Layers }
        ],
        benefit: "+40% Deep Sleep"
    },
    [TechType.RLT]: {
        title: "The Circadian Reset",
        description: "Anchor your biological clock for energy and recovery.",
        items: [
            { id: TechType.HYDROGEN, name: "Hydrogen Water", role: "Morning Hydration", icon: Activity },
            { id: TechType.RLT, name: "Red Light", role: "Mitochondrial Kickstart", icon: Zap },
            { id: TechType.PEMF, name: "PEMF (Alpha)", role: "Focus State", icon: Brain }
        ],
        benefit: "All-Day Energy"
    },
    [TechType.HYDROGEN]: {
        title: "Cognitive Clarity Stack",
        description: "Eliminate brain fog and enhance neural processing speed.",
        items: [
            { id: TechType.HYDROGEN, name: "Hydrogen Inhalation", role: "Neutralize ROS", icon: Activity },
            { id: TechType.PEMF, name: "PEMF (Gamma)", role: "Insight & Binding", icon: Zap },
            { id: TechType.HBOT, name: "Soft HBOT", role: "Neural Fuel", icon: Brain }
        ],
        benefit: "Instant Clarity"
    }
};

export const ProtocolStacks: React.FC<StackProps> = ({ currentTech, onJump }) => {
    const stack = (STACKS as Record<string, typeof STACKS[keyof typeof STACKS]>)[currentTech];

    if (!stack) return null;

    return (
        <div className="bg-slate-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                {/* Header */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-cyan-400">
                        <Layers size={16} />
                        <span className="text-xs font-bold uppercase tracking-[0.3em]">Synergy Stack</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 futuristic-font">{stack.title}</h3>
                    <p className="text-slate-400 text-sm mb-6">{stack.description}</p>
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                        <Activity size={12} /> Target: {stack.benefit}
                    </div>
                </div>

                {/* Stack Visualizer */}
                <div className="flex md:flex-1 items-center gap-2 justify-center">
                    {stack.items.map((item: any, i: number) => (
                        <React.Fragment key={item.id}>
                            <motion.button
                                whileHover={{ y: -5 }}
                                onClick={() => item.id !== currentTech ? onJump(item.id) : null}
                                className={`relative p-4 rounded-xl border transition-all w-32 flex flex-col items-center text-center gap-2
                                    ${item.id === currentTech
                                        ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} className={item.id === currentTech ? 'text-cyan-400' : 'text-slate-500'} />
                                <span className="text-[10px] font-bold uppercase leading-tight">{item.name}</span>
                                <span className="text-[8px] opacity-60">{item.role}</span>

                                {item.id === currentTech && (
                                    <div className="absolute -top-2 -right-2 bg-cyan-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                        VIEWING
                                    </div>
                                )}
                            </motion.button>
                            {i < stack.items.length - 1 && (
                                <Plus size={16} className="text-slate-600 shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                    <button className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-cyan-50 transition-colors flex items-center gap-2">
                        Bundle & Save <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

