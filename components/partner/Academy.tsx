import React, { useState } from 'react';
import { PartnerLayout } from './PartnerLayout';
import { MicroLearningFeed } from './MicroLearningFeed';
import { AITutor } from './AITutor';
import { Bot, Award, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Academy: React.FC = () => {
    const [showAITutor, setShowAITutor] = useState(false);

    // Mock progress data
    const certProgress = 65;
    const currentCert = 'HBOT Operator Level 1';
    const xpToday = 120;

    return (
        <PartnerLayout title="Hylono Academy">
            {/* AI Tutor Toggle Button */}
            <button
                onClick={() => setShowAITutor(!showAITutor)}
                className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all
                    ${showAITutor
                        ? 'bg-slate-700 text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                    }`}
            >
                <Bot className="w-6 h-6" />
            </button>

            {/* AI Tutor Panel */}
            <AnimatePresence>
                {showAITutor && <AITutor onClose={() => setShowAITutor(false)} />}
            </AnimatePresence>

            {/* Certification Progress Banner */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700"
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Award className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{currentCert}</h3>
                            <p className="text-slate-400 text-sm">Complete training to earn your certificate</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-400">
                                <Zap className="w-4 h-4" />
                                <span className="font-bold">+{xpToday} XP today</span>
                            </div>
                        </div>
                        <a
                            href="/partner/profile"
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                        >
                            View Progress <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${certProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                        />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>Progress</span>
                        <span className="text-cyan-400 font-bold">{certProgress}%</span>
                    </div>
                </div>
            </motion.div>

            {/* Micro-Learning Feed (Main Content) */}
            <div className="mb-8">
                <MicroLearningFeed />
            </div>

            {/* Quick Tips Section */}
            <div className="grid md:grid-cols-3 gap-4">
                <QuickTipCard
                    emoji="💡"
                    title="Learn in 5 minutes"
                    description="Our micro-modules are designed for busy schedules"
                />
                <QuickTipCard
                    emoji="🎯"
                    title="Follow the path"
                    description="Click 'Start Journey' for guided learning"
                />
                <QuickTipCard
                    emoji="🤖"
                    title="Ask questions"
                    description="Use the AI Tutor for instant help"
                />
            </div>
        </PartnerLayout>
    );
};

const QuickTipCard: React.FC<{ emoji: string; title: string; description: string }> = ({ emoji, title, description }) => (
    <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
        <span className="text-2xl mb-2 block">{emoji}</span>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
);
