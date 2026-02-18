import React from 'react';
import { PartnerLayout } from './PartnerLayout';
import {
    TrendingUp,
    Zap,
    AlertCircle,
    ArrowRight,
    Users,
    Palette,
    Wrench,
    Brain,
    ShoppingBag,
    GraduationCap,
    LucideIcon,
    Flame,
    Target,
    Trophy,
    Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MorningBriefing } from './MorningBriefing';
import { ClinicPulse } from './ClinicPulse';
import { GrowthCatalyst } from './GrowthCatalyst';
import { EducationSender } from './EducationSender';
import { Leaderboard } from './Leaderboard';

// Quick Action Component
interface QuickActionProps {
    icon: LucideIcon;
    label: string;
    description: string;
    href: string;
    color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon: Icon, label, description, href, color }) => (
    <a
        href={href}
        className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all group flex items-center gap-4"
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">{label}</h4>
            <p className="text-xs text-slate-500 truncate">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all shrink-0" />
    </a>
);

const WidgetCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h3>
        {children}
    </div>
);

const StatPill: React.FC<{ label: string; value: string; trend?: string; positive?: boolean }> = ({ label, value, trend, positive }) => (
    <div className="flex flex-col">
        <span className="text-xs text-slate-400 mb-1">{label}</span>
        <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-800">{value}</span>
            {trend && (
                <span className={`text-xs font-bold mb-1 ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {positive ? '+' : ''}{trend}
                </span>
            )}
        </div>
    </div>
);

export const DashboardHome: React.FC = () => {
    return (
        <PartnerLayout title="Dashboard">

            <MorningBriefing />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <QuickAction
                            icon={Users}
                            label="Add New Patient"
                            description="Register a new client in Nexus"
                            href="/partner/nexus"
                            color="bg-cyan-50 text-cyan-600"
                        />
                        <QuickAction
                            icon={Palette}
                            label="Create Campaign"
                            description="Design marketing materials"
                            href="/partner/studio"
                            color="bg-purple-50 text-purple-600"
                        />
                        <QuickAction
                            icon={Wrench}
                            label="Log Service"
                            description="Record device maintenance"
                            href="/partner/fleet"
                            color="bg-amber-50 text-amber-600"
                        />
                        <QuickAction
                            icon={Brain}
                            label="Prescribe Protocol"
                            description="Create treatment pathway"
                            href="/partner/protocols"
                            color="bg-indigo-50 text-indigo-600"
                        />
                    </div>
                </div>

                <div className="h-full">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Status</h3>
                    <ClinicPulse />
                </div>
            </div>

            {/* Business Growth Engine */}
            <div className="mb-12">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Growth & Education Engine
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GrowthCatalyst />
                    <EducationSender />
                </div>
            </div>

            {/* Smart Nudges Row */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white flex items-center justify-between shadow-lg shadow-slate-900/10"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-cyan-400 font-medium">
                            <Zap className="w-4 h-4" /> Smart Insight
                        </div>
                        <h2 className="text-xl font-bold mb-1">Your HBOT usage is up 24% this week.</h2>
                        <p className="text-slate-400 text-sm">You are on track to verify "Platinum Partner" status by Feb 1st.</p>
                    </div>
                    <button className="px-5 py-2.5 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-cyan-50 transition-colors">
                        View Analytics
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-amber-900 flex flex-col justify-between"
                >
                    <div className="flex items-center gap-2 font-bold mb-2">
                        <AlertCircle className="w-5 h-5" /> Action Required
                    </div>
                    <p className="text-sm mb-4">Warranty check due for <span className="font-mono bg-amber-100 px-1 rounded">SN-8821</span> (Pinnacle 360).</p>
                    <button className="text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-900 text-left">
                        Start Diagnostics &rarr;
                    </button>
                </motion.div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <WidgetCard title="Revenue Pulse (Est)">
                    <StatPill label="Last 30 Days" value="$12,450" trend="12%" positive />
                    <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="h-full w-[75%] bg-emerald-500 rounded-full" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-right">75% of Monthly Goal</p>
                </WidgetCard>

                <WidgetCard title="Fleet Status">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Pinnacle HBOT
                            </div>
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">ONLINE</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Aurora RLT
                            </div>
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">ONLINE</span>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="w-2 h-2 rounded-full bg-slate-300" /> Core PEMF
                            </div>
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">OFFLINE</span>
                        </div>
                    </div>
                </WidgetCard>

                <WidgetCard title="Academy Progress">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 flex items-center justify-center font-bold text-slate-800">
                            2/3
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Staff Certified</p>
                            <p className="text-xs text-slate-400">1 Pending Review</p>
                        </div>
                    </div>
                    <button className="w-full py-2 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">
                        View Team Status
                    </button>
                </WidgetCard>

                <WidgetCard title="Referral Connect">
                    <StatPill label="Pending Commissions" value="$450.00" />
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>3 Home Units Active</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </WidgetCard>
            </div>

            {/* Learning Hub Section */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-500" /> Learning Hub
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Continue Learning Card */}
                    <motion.a
                        href="/partner/academy"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-5 h-5 text-orange-300" />
                            <span className="font-bold text-orange-200">3 Day Streak!</span>
                        </div>
                        <h4 className="text-xl font-bold mb-2">Continue Learning</h4>
                        <p className="text-cyan-100 text-sm mb-4">You were learning "Client Comfort Hacks"</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <Target className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-cyan-200">Today's XP</div>
                                    <div className="font-bold">+120 XP</div>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.a>

                    {/* Daily Challenges */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                Daily Challenges
                            </h4>
                            <span className="text-xs text-slate-400">Resets in 8h</span>
                        </div>
                        <div className="space-y-3">
                            {[
                                { title: 'Complete 2 Safety modules', reward: '+50 XP', progress: 50 },
                                { title: 'Pass a Stress Drill', reward: '+100 XP', progress: 0 },
                                { title: 'Watch 5 videos', reward: '+30 XP', progress: 80 },
                            ].map((challenge, idx) => (
                                <div key={idx} className="p-2 bg-slate-50 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-slate-700">{challenge.title}</span>
                                        <span className="text-[10px] text-amber-600 font-bold">{challenge.reward}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                            style={{ width: `${challenge.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <Leaderboard />
                </div>
            </div>

            {/* Recent generated assets */}
            <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Studio Assets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-[3/4] bg-white rounded-lg border border-slate-200 p-2 shadow-sm hover:border-cyan-500 cursor-pointer transition-colors group relative">
                        <div className="w-full h-full bg-slate-50 rounded flex items-center justify-center text-slate-300">
                            PDF
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur rounded-b-lg border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-700 truncate">Campaign_Oct_{i}</p>
                            <p className="text-[8px] text-slate-400">Oct 24 • Poster</p>
                        </div>
                    </div>
                ))}

                <a href="/partner/studio" className="aspect-[3/4] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-cyan-500 hover:text-cyan-500 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        +
                    </div>
                    <span className="text-xs font-bold">Create New</span>
                </a>
            </div>

        </PartnerLayout>
    );
};
