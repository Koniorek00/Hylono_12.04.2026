
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Target, Activity, Heart, Brain, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MockAuthService } from '../lib/mockAuth';

export const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const goals = [
        { id: 'regeneration', title: 'Accelerated Regeneration', icon: Activity, desc: 'Faster recovery from injuries and training.' },
        { id: 'longevity', title: 'Longevity & Anti-Aging', icon: Heart, desc: 'Optimizing cellular health and lifespan.' },
        { id: 'cognitive', title: 'Cognitive Performance', icon: Brain, desc: 'Sharper focus, memory, and mental clarity.' },
        { id: 'energy', title: 'Peak Energy Levels', icon: Zap, desc: 'Sustained vitality throughout the day.' },
    ];

    const toggleSelection = (id: string) => {
        setSelections(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        // Simulate saving preferences
        await MockAuthService._delay(800);
        await MockAuthService.updateProfile({
            // In a real app we would store this in a 'preferences' metadata field
            // For mock, we just proceed
        } as any);
        setIsSubmitting(false);
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]"
            >
                {/* Visual Side */}
                <div className="md:w-1/3 bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-6">
                            <Target className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Personalize Your Journey</h2>
                        <p className="text-slate-400 text-sm">Help us tailor your Hylono experience to your specific bio-optimization goals.</p>
                    </div>

                    {/* Abstract bg elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Content Side */}
                <div className="md:w-2/3 p-8 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">What are your primary goals?</h3>
                        <div className="grid gap-4">
                            {goals.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => toggleSelection(goal.id)}
                                    className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all
                                        ${selections.includes(goal.id)
                                            ? 'border-cyan-500 bg-cyan-50'
                                            : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <div className={`mt-1 p-2 rounded-lg ${selections.includes(goal.id) ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <goal.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${selections.includes(goal.id) ? 'text-slate-900' : 'text-slate-700'}`}>{goal.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{goal.desc}</p>
                                    </div>
                                    <div className={`ml-auto mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center
                                        ${selections.includes(goal.id) ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-200'}
                                    `}>
                                        {selections.includes(goal.id) && <Check size={14} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleComplete}
                            disabled={selections.length === 0 || isSubmitting}
                            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Personalizing...' : 'Complete Setup'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
