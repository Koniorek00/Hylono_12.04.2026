import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle, Lock, Download, Share2 } from 'lucide-react';

interface Certificate {
    id: string;
    title: string;
    description: string;
    level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    progress: number; // 0-100
    totalModules: number;
    completedModules: number;
    earnedDate?: string;
}

const MOCK_CERTIFICATES: Certificate[] = [
    {
        id: 'cert-1',
        title: 'HBOT Operator Level 1',
        description: 'Basic chamber operation and safety protocols',
        level: 'Bronze',
        progress: 100,
        totalModules: 5,
        completedModules: 5,
        earnedDate: '2026-01-15'
    },
    {
        id: 'cert-2',
        title: 'Client Experience Pro',
        description: 'Advanced client comfort and communication',
        level: 'Silver',
        progress: 60,
        totalModules: 5,
        completedModules: 3
    },
    {
        id: 'cert-3',
        title: 'Emergency Response Master',
        description: 'Critical incident handling and protocols',
        level: 'Gold',
        progress: 20,
        totalModules: 8,
        completedModules: 2
    },
    {
        id: 'cert-4',
        title: 'Clinical Excellence',
        description: 'Complete mastery of all Hylono protocols',
        level: 'Platinum',
        progress: 0,
        totalModules: 15,
        completedModules: 0
    }
];

const getLevelColor = (level: Certificate['level']) => {
    switch (level) {
        case 'Bronze': return 'from-amber-600 to-orange-700';
        case 'Silver': return 'from-slate-400 to-slate-500';
        case 'Gold': return 'from-amber-400 to-yellow-500';
        case 'Platinum': return 'from-cyan-400 to-blue-500';
    }
};

const getLevelBg = (level: Certificate['level']) => {
    switch (level) {
        case 'Bronze': return 'bg-amber-50 border-amber-200';
        case 'Silver': return 'bg-slate-50 border-slate-200';
        case 'Gold': return 'bg-amber-50 border-amber-300';
        case 'Platinum': return 'bg-cyan-50 border-cyan-200';
    }
};

export const CertificationTracker: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Certifications
                </h3>
                <span className="text-xs text-slate-500">1 of 4 earned</span>
            </div>

            <div className="grid gap-3">
                {MOCK_CERTIFICATES.map((cert, idx) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border ${getLevelBg(cert.level)} relative overflow-hidden`}
                    >
                        {/* Level Badge */}
                        <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-bl-lg bg-gradient-to-r ${getLevelColor(cert.level)}`}>
                            {cert.level}
                        </div>

                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cert.progress === 100 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                {cert.progress === 100 ? (
                                    <CheckCircle className="w-5 h-5 text-white" />
                                ) : cert.progress === 0 ? (
                                    <Lock className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <span className="text-sm font-bold text-slate-600">{cert.progress}%</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm">{cert.title}</h4>
                                <p className="text-xs text-slate-500 mb-2">{cert.description}</p>

                                {/* Progress Bar */}
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cert.progress}%` }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className={`h-full bg-gradient-to-r ${getLevelColor(cert.level)}`}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>{cert.completedModules}/{cert.totalModules} modules</span>
                                    {cert.earnedDate && (
                                        <span className="text-emerald-600">Earned {cert.earnedDate}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons for Earned Certificates */}
                        {cert.progress === 100 && (
                            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                                <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors">
                                    <Download className="w-3 h-3" /> Download PDF
                                </button>
                                <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors">
                                    <Share2 className="w-3 h-3" /> Share
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

