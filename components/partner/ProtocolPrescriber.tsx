import React, { useState } from 'react';
import { PartnerLayout } from './PartnerLayout';
import {
    Search,
    BookOpen,
    Zap,
    Moon,
    Brain,
    Dumbbell,
    Printer,
    Share2,
    Info,
    ChevronRight,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data: Wellness Pathways (Protocol Database)
// "Goals" map to "Protocols"
const PATHWAYS = [
    {
        id: 'p1',
        title: 'Deep Rest & Sleep',
        icon: Moon,
        color: 'text-indigo-500 bg-indigo-50',
        tags: ['insomnia', 'stress', 'jet lag', 'rest'],
        protocol: {
            name: 'Circadian Reset Stack',
            duration: '90 min',
            steps: [
                { type: 'PEMF', setting: 'Delta Wave (3Hz)', duration: '15 min', note: 'Pre-session relaxation' },
                { type: 'HBOT', setting: '1.3 ATA', duration: '60 min', note: 'Standard pressure' },
                { type: 'RLT', setting: 'Near-Infrared only', duration: '15 min', note: 'Post-session grounding' }
            ],
            disclaimer: 'Supports natural sleep cycles and relaxation.'
        }
    },
    {
        id: 'p2',
        title: 'Physical Recovery',
        icon: Dumbbell,
        color: 'text-rose-500 bg-rose-50',
        tags: ['muscle', 'soreness', 'injury', 'training', 'marathon'],
        protocol: {
            name: 'Athlete Recovery Stack',
            duration: '60 min',
            steps: [
                { type: 'RLT', setting: 'Red + NIR (Combo)', duration: '10 min', note: 'Target affected areas' },
                { type: 'HBOT', setting: '1.5 ATA', duration: '45 min', note: 'Higher pressure for oxygenation' }
            ],
            disclaimer: 'Optimizes recovery after intense physical exertion.'
        }
    },
    {
        id: 'p3',
        title: 'Cognitive Boost',
        icon: Brain,
        color: 'text-cyan-500 bg-cyan-50',
        tags: ['focus', 'brain fog', 'exam', 'work', 'clarity'],
        protocol: {
            name: 'Executive Focus Stack',
            duration: '45 min',
            steps: [
                { type: 'PEMF', setting: 'Beta Wave (14Hz)', duration: '10 min', note: 'Alertness priming' },
                { type: 'HBOT', setting: '1.3 ATA', duration: '30 min', note: 'Short & sharp session' },
                { type: 'Hydrogen', setting: 'Inhalation', duration: 'During HBOT', note: 'Synergistic effect' }
            ],
            disclaimer: 'Enhances mental clarity and alertness.'
        }
    },
    {
        id: 'p4',
        title: 'Energy & Vitality',
        icon: Zap,
        color: 'text-amber-500 bg-amber-50',
        tags: ['fatigue', 'tired', 'energy', 'wellness'],
        protocol: {
            name: 'Vitality Recharge',
            duration: '60 min',
            steps: [
                { type: 'RLT', setting: 'Full Body', duration: '15 min', note: 'Mitochondrial charge' },
                { type: 'HBOT', setting: '1.3-1.4 ATA', duration: '45 min', note: 'Systemic oxygenation' }
            ],
            disclaimer: 'Promotes general vitality and energy levels.'
        }
    }
];

export const ProtocolPrescriber: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPath, setSelectedPath] = useState<typeof PATHWAYS[0] | null>(null);

    // Filter logic
    const filteredPathways = PATHWAYS.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <PartnerLayout title="Wellness Pathway Finder">

            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">

                {/* Left: Finder */}
                <div className="w-full lg:w-2/5 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm shrink-0">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Find a Recommendation</h2>
                            <p className="text-sm text-slate-500">Search by client goal or feeling (e.g., "Tired", "Sore").</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="What is the client experiencing?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {filteredPathways.map(path => (
                            <motion.button
                                key={path.id}
                                layoutId={`card-${path.id}`}
                                onClick={() => setSelectedPath(path)}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${selectedPath?.id === path.id ? 'bg-cyan-50 border-cyan-500 ring-1 ring-cyan-500' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${path.color}`}>
                                    <path.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-cyan-700">{path.title}</h3>
                                    <div className="flex flex-wrap gap-1mt-1">
                                        <span className="text-xs text-slate-400">{path.tags.slice(0, 3).join(', ')}</span>
                                    </div>
                                </div>
                                <ChevronRight className={`ml-auto w-5 h-5 text-slate-300 transition-transform ${selectedPath?.id === path.id ? 'text-cyan-500 rotate-90' : 'group-hover:translate-x-1'}`} />
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Right: Protocol Detail (The "Prescription") */}
                <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">

                    {selectedPath ? (
                        <>
                            {/* Header */}
                            <div className="p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-sm ${selectedPath.color}`}>
                                        <selectedPath.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recommended Protocol</p>
                                        <h2 className="text-3xl font-bold text-slate-900">{selectedPath.protocol.name}</h2>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-sm font-medium text-slate-600 flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedPath.protocol.duration}</span>
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Non-Medical Wellness</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 transition-colors" title="Print Card">
                                        <Printer className="w-5 h-5" />
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                        <Share2 className="w-4 h-4" /> Send to Client
                                    </button>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="p-8 flex-1 overflow-y-auto">
                                <div className="space-y-8 relative">
                                    {/* Connectivity Line */}
                                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100" />

                                    {selectedPath.protocol.steps.map((step, i) => (
                                        <div key={i} className="relative flex gap-6">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold z-10 shrink-0 border-4 border-white shadow-sm">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-cyan-200 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-lg text-slate-800">{step.type}</h4>
                                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">{step.duration}</span>
                                                </div>
                                                <p className="text-sm text-cyan-600 font-medium mb-1">{step.setting}</p>
                                                <p className="text-xs text-slate-400">{step.note}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Disclaimer Box */}
                                <div className="mt-10 p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-amber-800 text-xs leading-relaxed">
                                    <Info className="w-5 h-5 shrink-0" />
                                    <div>
                                        <p className="font-bold mb-1">Clinic Notice</p>
                                        <p>This suggestion is for general wellness and relaxation purposes only. It is not intended to diagnose, treat, or cure any medical condition. Clients with specific medical concerns should consult a physician.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Empty State
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <BookOpen className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Client Goal</h3>
                            <p className="max-w-md">Search for keywords like "Sleep" or "Energy" on the left to see our recommended Synergy Stacks.</p>
                        </div>
                    )}

                </div>
            </div>

        </PartnerLayout>
    );
};
