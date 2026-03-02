import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    Users,
    TrendingUp,
    Award,
    AlertTriangle,
    Search,
    Filter,
    Mail,
    ChevronRight,
    CheckCircle,
    Clock,
    Zap,
    MoreHorizontal,
    Bell
} from 'lucide-react';
import { PartnerLayout } from './PartnerLayout';
import { SkillRadarChart } from './SkillRadarChart';

const TEAM_MEMBERS = [
    { id: 1, name: 'Alex Johnson', role: 'Operator', status: 'Active', progress: 85, cert: 'Level 2', lastActive: '2h ago', xp: 2450 },
    { id: 2, name: 'Maria Garcia', role: 'Operator', status: 'In Training', progress: 45, cert: 'Level 1', lastActive: '1d ago', xp: 850 },
    { id: 3, name: 'Sam Smith', role: 'Front Desk', status: 'Needs Review', progress: 15, cert: 'None', lastActive: '5d ago', xp: 200 },
    { id: 4, name: 'Jordan Lee', role: 'Manager', status: 'Active', progress: 95, cert: 'Mastery', lastActive: '10m ago', xp: 4200 },
];

const COMPLIANCE_ALERTS = [
    { id: 1, user: 'Sam Smith', issue: 'Safety Module Expired', priority: 'high' },
    { id: 2, user: 'Maria Garcia', issue: 'Emergency Drill Required', priority: 'medium' },
];

export const TeamDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <PartnerLayout title="Team Management">
            {/* Top Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {[
                    { label: 'Team Size', value: '4', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Certifications', value: '12', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Avg. Accuracy', value: '84%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Compliance', value: '75%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm"
                    >
                        <div className={`w-8 h-8 md:w-10 md:h-10 ${stat.bg} ${stat.color} rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4`}>
                            <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs md:text-sm text-slate-400 font-medium">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                {/* Main Staff List */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
                            <h2 className="font-bold text-slate-900">Staff Progress</h2>
                            <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search staff..."
                                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 w-full sm:w-auto"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 shrink-0">
                                    <Filter className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4">Member</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4">Role</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4">Status</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4">Course Progress</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 hidden sm:table-cell">XP</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {TEAM_MEMBERS.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-cyan-100 flex items-center justify-center text-[10px] md:text-xs font-bold text-cyan-700 shrink-0">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs md:text-sm font-bold text-slate-900 truncate">{member.name}</div>
                                                        <div className="text-[10px] text-slate-400">Last active: {member.lastActive}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <span className="text-[10px] md:text-xs text-slate-600 font-medium">{member.role}</span>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                                    ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                        member.status === 'In Training' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}
                                                >
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="w-24 md:w-32">
                                                    <div className="flex justify-between text-[10px] mb-1">
                                                        <span className="text-slate-400">{member.cert}</span>
                                                        <span className="font-bold text-slate-700">{member.progress}%</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{ width: `${member.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                                    <Zap className="w-3 h-3 text-amber-500" />
                                                    {member.xp.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                                <button className="text-slate-300 hover:text-slate-600">
                                                    <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-3 md:p-4 bg-slate-50 text-center border-t border-slate-100">
                            <button className="text-xs md:text-sm font-bold text-cyan-600 hover:text-cyan-700 flex items-center justify-center gap-2 mx-auto">
                                View Full Team Directory <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Team Skill Aggregation */}
                    <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
                            <h2 className="font-bold text-slate-900 text-sm md:text-base">Team Competency Radar</h2>
                            <span className="text-[10px] md:text-xs text-slate-400">Aggregate scores of all operators</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
                            <div className="h-48 md:h-64">
                                <SkillRadarChart skills={[
                                    { name: 'Operations', score: 92, icon: '⚙️' },
                                    { name: 'Safety', score: 88, icon: '🛡️' },
                                    { name: 'Client Care', score: 95, icon: '💝' },
                                    { name: 'Technical', score: 72, icon: '🔧' },
                                    { name: 'Sales', score: 65, icon: '💰' },
                                ]} />
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <div className="p-3 md:p-4 bg-emerald-50 rounded-lg md:rounded-xl border border-emerald-100">
                                    <h4 className="text-[10px] md:text-xs font-bold text-emerald-800 uppercase mb-1">Strength</h4>
                                    <p className="text-xs md:text-sm text-emerald-700">Team is performing at 95% for <strong>Client Care</strong>. Consistently high patient satisfaction scores.</p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <h4 className="text-xs font-bold text-amber-800 uppercase mb-1">Improvement Area</h4>
                                    <p className="text-sm text-amber-700"><strong>Sales</strong> training is lagging. Consider assigning "Conversion Conversations" module.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Compliance Panel */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Compliance Alerts
                            </h3>
                            <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600">Dismiss All</button>
                        </div>
                        <div className="space-y-3">
                            {COMPLIANCE_ALERTS.map((alert) => (
                                <div key={alert.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 relative group">
                                    <div className="flex gap-3">
                                        <div className={`w-1 h-8 rounded-full ${alert.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{alert.user}</div>
                                            <div className="text-xs text-slate-500">{alert.issue}</div>
                                        </div>
                                    </div>
                                    <button className="absolute top-3 right-3 p-1 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Bell className="w-3 h-3 text-cyan-600" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Assignment Tool */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Push Assignment</h3>
                        <p className="text-slate-400 text-sm mb-6">Instantly assign a micro-module to specific team members.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Module</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-500">
                                    <option>Safety Protocols v1.2</option>
                                    <option>Emergency Depressurization</option>
                                    <option>Client Intake Mastery</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Target</label>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Operators', 'New Hires'].map(tag => (
                                        <button key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[10px] hover:bg-cyan-500/20 transition-colors">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                                Send Assignment
                            </button>
                        </div>
                    </div>

                    {/* Team Activity Feed */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {[
                                { user: 'Alex', action: 'completed', item: 'Level 2 Cert', time: '10m ago' },
                                { user: 'Jordan', action: 'unlocked', item: 'Mastery Badge', time: '1h ago' },
                                { user: 'Maria', action: 'started', item: 'Safety Quiz', time: '3h ago' },
                            ].map((act, idx) => (
                                <div key={idx} className="flex gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="font-bold text-slate-900">{act.user}</span>
                                        <span className="text-slate-500 mx-1">{act.action}</span>
                                        <span className="text-cyan-600 font-medium">{act.item}</span>
                                        <div className="text-[10px] text-slate-400">{act.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
};

