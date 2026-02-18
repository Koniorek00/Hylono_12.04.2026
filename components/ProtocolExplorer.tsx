
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, Brain, Zap, Clock, ArrowRight, Shield, Sparkles, Filter, CheckCircle2, Wind, Sun, Droplets } from 'lucide-react';
import { TechType, Protocol } from '../types';

// --- Temporary Mock Data (Should eventually move to constants) ---
const PROTOCOLS: Protocol[] = [
    {
        id: 'deep-sleep',
        name: 'Deep Sleep Architecture',
        tagline: 'Parasympathetic Restoration',
        description: 'A scientifically validated sequence to entrain Delta waves and maximise glymphatic drainage during sleep.',
        goals: ['Sleep', 'Recovery'],
        estimatedTotalTime: 60,
        stackCoherence: 98,
        steps: [
            { tech: TechType.HYDROGEN, duration: 15, instruction: 'Inhale while hydrating to neutralize daily oxidative stress.' },
            { tech: TechType.PEMF, duration: 30, instruction: 'Delta-wave entrainment to lower cortisol/adenosine balance.' },
            { tech: TechType.RLT, duration: 15, instruction: 'Red spectrum only (660nm) to stimulate melatonin precursors (optional).' }
        ]
    },
    {
        id: 'cognitive-prime',
        name: 'Cognitive Prime',
        tagline: 'Neuroplasticity Acceleration',
        description: 'Rapid-onset protocol to clear brain fog and increase sustained attention before high-demand tasks.',
        goals: ['Cognitive', 'Performance'],
        estimatedTotalTime: 45,
        stackCoherence: 95,
        steps: [
            { tech: TechType.PEMF, duration: 15, instruction: 'Alpha/Beta hybrid sweep to synchronize hemispheres.' },
            { tech: TechType.HBOT, duration: 30, instruction: '1.3 ATA pressure to flood neural tissue with oxygen.' }
        ]
    },
    {
        id: 'athlete-recovery',
        name: 'Systemic Repair',
        tagline: 'Post-Exertion Anabolic Switch',
        description: 'Flush lactate, reduce inflammation, and trigger stem cell mobilization after intense physical stress.',
        goals: ['Recovery', 'Performance'],
        estimatedTotalTime: 90,
        stackCoherence: 92,
        steps: [
            { tech: TechType.RLT, duration: 20, instruction: 'Full body exposure for mitochondrial recharge.' },
            { tech: TechType.HBOT, duration: 60, instruction: 'Macrophage activation and angiogenesis support.' },
            { tech: TechType.PEMF, duration: 10, instruction: 'Schumann resonance for grounding.' }
        ]
    },
    {
        id: 'cellular-detox',
        name: 'Cellular Detox',
        tagline: 'Oxidative Stress Reset',
        description: 'A focused approach to removing cellular debris and neutralizing free radicals.',
        goals: ['Longevity', 'Immunity'],
        estimatedTotalTime: 40,
        stackCoherence: 88,
        steps: [
            { tech: TechType.PEMF, duration: 20, instruction: 'Increased circulation mode to mobilize fluids.' },
            { tech: TechType.HYDROGEN, duration: 20, instruction: 'High-concentration inhalation.' }
        ]
    }
];

const GOAL_FILTERS = ['All', 'Sleep', 'Recovery', 'Cognitive', 'Performance', 'Longevity'];

export const ProtocolExplorer: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

    const filteredProtocols = activeFilter === 'All'
        ? PROTOCOLS
        : PROTOCOLS.filter(p => p.goals.includes(activeFilter));

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-24 text-white font-sans relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <Layers size={14} /> The Protocol Codex
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-6 futuristic-font tracking-tight">
                        Design Your State.
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                        Biology is programmable. Hylono protocols are engineered sequences of light, magnetism, oxygen, and hydrogen designed to trigger specific physiological outcomes.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-16">
                    {GOAL_FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider border transition-all
                                ${activeFilter === filter
                                    ? 'bg-white text-slate-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                    : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-white'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProtocols.map(protocol => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={protocol.id}
                                className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/50 transition-colors overflow-hidden cursor-pointer"
                                onClick={() => setSelectedProtocol(protocol)}
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Header */}
                                <div className="relative z-10 mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2">
                                            {protocol.goals.map(g => (
                                                <span key={g} className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-700">
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 text-cyan-500">
                                            <Sparkles size={14} />
                                            <span className="text-xs font-bold">{protocol.stackCoherence}% Synergy</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{protocol.name}</h3>
                                    <p className="text-sm text-slate-400">{protocol.tagline}</p>
                                </div>

                                {/* Tech Stack Visual */}
                                <div className="relative z-10 flex gap-2 mb-8">
                                    {protocol.steps.map((step) => (
                                        <div key={step.tech} className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-slate-700 group-hover:border-slate-500 transition-colors" title={step.tech}>
                                            {step.tech === TechType.HBOT && <Wind size={16} />}
                                            {step.tech === TechType.PEMF && <Zap size={16} />}
                                            {step.tech === TechType.RLT && <Sun size={16} />}
                                            {step.tech === TechType.HYDROGEN && <Droplets size={16} />}
                                        </div>
                                    ))}
                                    {/* Link Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />
                                </div>

                                {/* Footer */}
                                <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/50">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                                        <Clock size={12} />
                                        {protocol.estimatedTotalTime} MIN
                                    </div>
                                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                        View Blueprint <ArrowRight size={14} />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal Detail View */}
            <AnimatePresence>
                {selectedProtocol && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setSelectedProtocol(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedProtocol(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-20"
                            >
                                <ArrowRight className="rotate-45" /> {/* Close Icon Simulation */}
                            </button>

                            <div className="grid md:grid-cols-5 min-h-[500px]">
                                {/* Left: Info */}
                                <div className="md:col-span-2 p-10 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col">
                                    <div className="mb-auto">
                                        <div className="flex gap-2 mb-4">
                                            {selectedProtocol.goals.map(g => (
                                                <span key={g} className="px-2 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-900 text-[10px] font-bold uppercase tracking-widest">
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-4xl font-bold text-white mb-2">{selectedProtocol.name}</h2>
                                        <p className="text-lg text-cyan-400 mb-6">{selectedProtocol.tagline}</p>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                            {selectedProtocol.description}
                                        </p>

                                        <div className="space-y-4">
                                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                                <div className="flex items-center gap-2 mb-2 text-slate-300 font-bold text-xs uppercase tracking-widest">
                                                    <Clock size={14} /> Duration
                                                </div>
                                                <div className="text-2xl font-mono text-white">{selectedProtocol.estimatedTotalTime} min</div>
                                            </div>
                                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                                <div className="flex items-center gap-2 mb-2 text-slate-300 font-bold text-xs uppercase tracking-widest">
                                                    <Sparkles size={14} /> Synergy Score
                                                </div>
                                                <div className="text-2xl font-mono text-emerald-400">{selectedProtocol.stackCoherence}/100</div>
                                                <p className="text-[10px] text-slate-500 mt-1">High biological compatibility</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Steps */}
                                <div className="md:col-span-3 p-10 bg-slate-900">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Protocol Sequence</h3>

                                    <div className="space-y-0 relative">
                                        {/* Connecting Line */}
                                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800" />

                                        {selectedProtocol.steps.map((step, i) => (
                                            <div key={`${step.tech}-${i}`} className="relative flex gap-6 pb-12 last:pb-0 group">
                                                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex-shrink-0 flex items-center justify-center z-10 group-hover:border-cyan-500 group-hover:bg-cyan-950 group-hover:text-cyan-400 transition-all text-slate-500 font-bold">
                                                    {i + 1}
                                                </div>
                                                <div className="pt-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="text-xl font-bold text-white">{step.tech}</h4>
                                                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                                                            {step.duration} min
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-400 text-sm leading-relaxed">
                                                        {step.instruction}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                                            <Shield size={14} /> Clinically Verified
                                        </div>
                                        <button
                                            onClick={() => window.location.href = '/builder'}
                                            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded-lg transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                        >
                                            Build this Stack
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
