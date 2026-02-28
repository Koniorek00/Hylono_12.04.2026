import React, { useState } from 'react';
import { PartnerLayout } from './PartnerLayout';
import { SkillRadarChart } from './SkillRadarChart';
import { CertificationTracker } from './CertificationTracker';
import { RolePathSelector } from './RolePathSelector';
import { motion } from 'framer-motion';
import {
    User,
    Settings,
    Award,
    Target,
    BookOpen,
    Clock,
    Zap,
    Flame,
    ChevronRight,
    Edit2,
    Camera
} from 'lucide-react';

const MOCK_SKILLS = [
    { name: 'Operations', score: 85, icon: '⚙️' },
    { name: 'Safety', score: 70, icon: '🛡️' },
    { name: 'Client Care', score: 90, icon: '💝' },
    { name: 'Technical', score: 55, icon: '🔧' },
    { name: 'Sales', score: 40, icon: '💰' },
];

const MOCK_STATS = {
    totalXP: 1750,
    modulesCompleted: 24,
    hoursLearned: 12.5,
    currentStreak: 3,
    longestStreak: 15,
    quizAccuracy: 87
};

export const PartnerProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'skills' | 'certs' | 'path' | 'notes'>('skills');

    return (
        <PartnerLayout title="My Profile">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 mb-8 relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl" />
                </div>

                <div className="relative flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                            👩‍⚕️
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-white">Dr. Sarah Mitchell</h1>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                                Gold Partner
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">Primary Operator • Wellness Clinic NYC</p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-400" />
                                <div>
                                    <div className="text-xl font-bold text-white">{MOCK_STATS.totalXP.toLocaleString()}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Total XP</div>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-slate-700" />
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-400" />
                                <div>
                                    <div className="text-xl font-bold text-white">{MOCK_STATS.currentStreak}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Day Streak</div>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-slate-700" />
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <div className="text-xl font-bold text-white">{MOCK_STATS.quizAccuracy}%</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-slate-700" />
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-400" />
                                <div>
                                    <div className="text-xl font-bold text-white">{MOCK_STATS.hoursLearned}h</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Learned</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                        <Edit2 className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                {[
                    { id: 'skills', label: 'Skill Radar', icon: Target },
                    { id: 'certs', label: 'Certifications', icon: Award },
                    { id: 'path', label: 'Learning Path', icon: BookOpen },
                    { id: 'notes', label: 'My Notes', icon: BookOpen },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'skills' | 'certs' | 'path' | 'notes')}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
                            ${activeTab === tab.id
                                ? 'text-cyan-600 border-cyan-500'
                                : 'text-slate-500 border-transparent hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="grid md:grid-cols-2 gap-8">
                {activeTab === 'skills' && (
                    <>
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-lg">📊</span> Competency Radar
                            </h3>
                            <SkillRadarChart skills={MOCK_SKILLS} />
                            <p className="text-xs text-slate-400 text-center mt-4">
                                Complete more modules to improve your skill scores
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Skill Breakdown</h3>
                            <div className="space-y-4">
                                {MOCK_SKILLS.map((skill) => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-600">{skill.icon} {skill.name}</span>
                                            <span className={`font-bold ${skill.score >= 80 ? 'text-emerald-600' : skill.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                                                {skill.score}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.score}%` }}
                                                transition={{ duration: 0.5 }}
                                                className={`h-full rounded-full ${skill.score >= 80 ? 'bg-emerald-500' : skill.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'certs' && (
                    <div className="md:col-span-2">
                        <CertificationTracker />
                    </div>
                )}

                {activeTab === 'path' && (
                    <div className="md:col-span-2">
                        <RolePathSelector />
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Saved Bookmarks & Notes</h3>
                        <div className="space-y-3">
                            {[
                                { video: 'Quick Start: Chamber Prep', timestamp: 25, note: 'Important safety tip here!', date: 'Today' },
                                { video: 'Client Comfort Hacks', timestamp: 60, note: 'Remember this sequence', date: 'Yesterday' },
                                { video: 'Emergency Response', timestamp: 30, note: 'Practice this drill weekly', date: '3 days ago' },
                            ].map((bookmark, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded font-mono">@{bookmark.timestamp}%</span>
                                            <h4 className="font-medium text-slate-900 mt-1">{bookmark.video}</h4>
                                        </div>
                                        <span className="text-xs text-slate-400">{bookmark.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{bookmark.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PartnerLayout>
    );
};
