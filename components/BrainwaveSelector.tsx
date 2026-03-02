import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Waves, Moon, Zap, X, Check } from 'lucide-react';


type BrainwaveState = 'ALPHA' | 'THETA' | 'DELTA' | 'GAMMA';

interface BrainwaveSelectorProps {
    onSelect: (state: BrainwaveState) => void;
    isOpen: boolean;
    onClose: () => void;
}

const BRAINWAVE_STATES: { id: BrainwaveState; name: string; hz: string; description: string; icon: React.ReactNode; color: string }[] = [
    {
        id: 'GAMMA',
        name: 'Gamma',
        hz: '30-100 Hz',
        description: 'Peak focus, heightened perception, cognitive enhancement',
        icon: <Zap size={20} />,
        color: 'from-yellow-400 to-orange-500'
    },
    {
        id: 'ALPHA',
        name: 'Alpha',
        hz: '8-13 Hz',
        description: 'Relaxed focus, flow state, creative visualization',
        icon: <Waves size={20} />,
        color: 'from-cyan-400 to-blue-500'
    },
    {
        id: 'THETA',
        name: 'Theta',
        hz: '4-8 Hz',
        description: 'Deep meditation, intuition, subconscious access',
        icon: <Brain size={20} />,
        color: 'from-purple-400 to-indigo-500'
    },
    {
        id: 'DELTA',
        name: 'Delta',
        hz: '0.5-4 Hz',
        description: 'Deep healing sleep, cellular regeneration, restoration',
        icon: <Moon size={20} />,
        color: 'from-indigo-400 to-slate-600'
    },
];

export const BrainwaveSelector: React.FC<BrainwaveSelectorProps> = ({ onSelect, isOpen, onClose }) => {
    const [selected, setSelected] = useState<BrainwaveState | null>(null);

    const handleConfirm = () => {
        if (selected) {
            onSelect(selected);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl border bg-white border-slate-200"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-100">
                                <Brain className="text-slate-700" size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-slate-900">
                                Select Target State
                            </h3>
                            <p className="text-sm text-slate-500">
                                Choose the brainwave frequency for your session
                            </p>
                        </div>

                        <div className="space-y-3">
                            {BRAINWAVE_STATES.map((state) => (
                                <button
                                    key={state.id}
                                    onClick={() => setSelected(state.id)}
                                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group
                                        ${selected === state.id
                                            ? `border-transparent bg-gradient-to-r ${state.color} text-white`
                                            : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${selected === state.id ? 'bg-white/20' : 'bg-white'}`}>
                                        {state.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{state.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${selected === state.id ? 'bg-white/20' : 'bg-slate-200 text-slate-600'}`}>
                                                {state.hz}
                                            </span>
                                        </div>
                                        <p className={`text-xs mt-1 ${selected === state.id ? 'text-white/80' : 'text-slate-500'}`}>
                                            {state.description}
                                        </p>
                                    </div>
                                    {selected === state.id && <Check size={20} />}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!selected}
                            className={`w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all
                                ${selected
                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Confirm State
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

