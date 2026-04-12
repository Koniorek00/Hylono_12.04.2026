'use client';

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
    Clock,
    Zap,
    MoreHorizontal,
    Bell,
} from 'lucide-react';
import { PartnerLayout } from './PartnerLayout';
import { SkillRadarChart } from './SkillRadarChart';

type TeamMemberStatus = 'Active' | 'In Training' | 'Needs Review';
type CompliancePriority = 'high' | 'medium';
type TeamFilter = 'All' | TeamMemberStatus;

interface TeamMember {
    id: number;
    name: string;
    role: string;
    status: TeamMemberStatus;
    progress: number;
    cert: string;
    lastActive: string;
    xp: number;
}

interface ComplianceAlert {
    id: number;
    user: string;
    issue: string;
    priority: CompliancePriority;
}

const TEAM_MEMBERS: TeamMember[] = [
    {
        id: 1,
        name: 'Operator 01',
        role: 'Operator',
        status: 'Active',
        progress: 85,
        cert: 'Level 2',
        lastActive: '2h ago',
        xp: 2450,
    },
    {
        id: 2,
        name: 'Operator 02',
        role: 'Operator',
        status: 'In Training',
        progress: 45,
        cert: 'Level 1',
        lastActive: '1d ago',
        xp: 850,
    },
    {
        id: 3,
        name: 'Front Desk 01',
        role: 'Front Desk',
        status: 'Needs Review',
        progress: 15,
        cert: 'None',
        lastActive: '5d ago',
        xp: 200,
    },
    {
        id: 4,
        name: 'Manager 01',
        role: 'Manager',
        status: 'Active',
        progress: 95,
        cert: 'Mastery',
        lastActive: '10m ago',
        xp: 4200,
    },
];

const COMPLIANCE_ALERTS: ComplianceAlert[] = [
    {
        id: 1,
        user: 'Front Desk 01',
        issue: 'Safety module review due',
        priority: 'high',
    },
    {
        id: 2,
        user: 'Operator 02',
        issue: 'Emergency drill assignment pending',
        priority: 'medium',
    },
];

const TEAM_FILTERS: TeamFilter[] = ['All', 'Active', 'In Training', 'Needs Review'];

const TEAM_SKILLS = [
    { name: 'Operations', score: 92, icon: 'OP' },
    { name: 'Safety', score: 88, icon: 'SF' },
    { name: 'Client Care', score: 95, icon: 'CC' },
    { name: 'Technical', score: 72, icon: 'TE' },
    { name: 'Sales', score: 65, icon: 'SL' },
];

const RECENT_ACTIVITY = [
    { user: 'Operator 01', action: 'completed', item: 'Level 2 Cert', time: '10m ago' },
    { user: 'Manager 01', action: 'unlocked', item: 'Mastery Badge', time: '1h ago' },
    { user: 'Operator 02', action: 'started', item: 'Safety Quiz', time: '3h ago' },
];

const STATUS_STYLES: Record<TeamMemberStatus, string> = {
    Active: 'bg-emerald-50 text-emerald-600',
    'In Training': 'bg-blue-50 text-blue-600',
    'Needs Review': 'bg-red-50 text-red-600',
};

export const TeamDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<TeamFilter>('All');

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredTeamMembers = TEAM_MEMBERS.filter((member) => {
        const matchesSearch =
            normalizedSearchTerm.length === 0 ||
            [member.name, member.role, member.status, member.cert]
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearchTerm);

        const matchesStatus =
            statusFilter === 'All' || member.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const certifiedStaffCount = TEAM_MEMBERS.filter(
        (member) => member.cert !== 'None'
    ).length;
    const averageProgress = Math.round(
        TEAM_MEMBERS.reduce((total, member) => total + member.progress, 0) /
            TEAM_MEMBERS.length
    );
    const complianceRate = Math.round(
        ((TEAM_MEMBERS.length - COMPLIANCE_ALERTS.length) / TEAM_MEMBERS.length) * 100
    );
    const filtersApplied =
        normalizedSearchTerm.length > 0 || statusFilter !== 'All';

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
    };

    return (
        <PartnerLayout title="Team Management">
            <div className="mb-4 md:mb-6 rounded-xl md:rounded-2xl border border-cyan-100 bg-cyan-50 p-4 md:p-5">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                    Workspace Preview
                </p>
                <p className="mt-2 text-sm md:text-[15px] leading-6 text-slate-700">
                    This team screen uses neutral placeholder staff labels until
                    authenticated staff records are connected to Nexus.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4 md:gap-6 md:mb-8">
                {[
                    {
                        label: 'Team Size',
                        value: TEAM_MEMBERS.length.toString(),
                        icon: Users,
                        color: 'text-blue-500',
                        bg: 'bg-blue-50',
                    },
                    {
                        label: 'Certified Staff',
                        value: certifiedStaffCount.toString(),
                        icon: Award,
                        color: 'text-emerald-500',
                        bg: 'bg-emerald-50',
                    },
                    {
                        label: 'Avg. Progress',
                        value: `${averageProgress}%`,
                        icon: Zap,
                        color: 'text-amber-500',
                        bg: 'bg-amber-50',
                    },
                    {
                        label: 'Compliance',
                        value: `${complianceRate}%`,
                        icon: TrendingUp,
                        color: 'text-purple-500',
                        bg: 'bg-purple-50',
                    },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="rounded-xl md:rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6"
                    >
                        <div
                            className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg md:mb-4 md:h-10 md:w-10 md:rounded-xl ${stat.bg} ${stat.color}`}
                        >
                            <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div className="text-xl font-bold text-slate-900 md:text-2xl">
                            {stat.value}
                        </div>
                        <div className="text-xs font-medium text-slate-400 md:text-sm">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6 md:gap-8 md:mb-8 lg:grid-cols-3">
                <div className="space-y-4 md:space-y-6 lg:col-span-2">
                    <div className="overflow-hidden rounded-xl md:rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-50 bg-slate-50/50 p-4 md:p-6 sm:flex-row sm:items-center">
                            <h2 className="font-bold text-slate-900">Staff Progress</h2>
                            <div className="flex w-full items-center gap-2 md:gap-3 sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search staff..."
                                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 sm:w-auto"
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(event.target.value)
                                        }
                                    />
                                </div>
                                <div className="relative shrink-0">
                                    <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <select
                                        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(
                                                event.target.value as TeamFilter
                                            )
                                        }
                                        aria-label="Filter staff by status"
                                    >
                                        {TEAM_FILTERS.map((filter) => (
                                            <option key={filter} value={filter}>
                                                {filter === 'All'
                                                    ? 'All statuses'
                                                    : filter}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-[600px] w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 md:px-6 md:py-4">Member</th>
                                        <th className="px-4 py-3 md:px-6 md:py-4">Role</th>
                                        <th className="px-4 py-3 md:px-6 md:py-4">Status</th>
                                        <th className="px-4 py-3 md:px-6 md:py-4">
                                            Course Progress
                                        </th>
                                        <th className="hidden px-4 py-3 md:px-6 md:py-4 sm:table-cell">
                                            XP
                                        </th>
                                        <th className="px-4 py-3 md:px-6 md:py-4" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredTeamMembers.length > 0 ? (
                                        filteredTeamMembers.map((member) => (
                                            <tr
                                                key={member.id}
                                                className="transition-colors hover:bg-slate-50/50"
                                            >
                                                <td className="px-4 py-3 md:px-6 md:py-4">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[10px] font-bold text-cyan-700 md:h-8 md:w-8 md:text-xs">
                                                            {member.name
                                                                .split(' ')
                                                                .map((part) => part[0])
                                                                .join('')}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="truncate text-xs font-bold text-slate-900 md:text-sm">
                                                                {member.name}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">
                                                                Last active: {member.lastActive}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4">
                                                    <span className="text-[10px] font-medium text-slate-600 md:text-xs">
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4">
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${STATUS_STYLES[member.status]}`}
                                                    >
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4">
                                                    <div className="w-24 md:w-32">
                                                        <div className="mb-1 flex justify-between text-[10px]">
                                                            <span className="text-slate-400">
                                                                {member.cert}
                                                            </span>
                                                            <span className="font-bold text-slate-700">
                                                                {member.progress}%
                                                            </span>
                                                        </div>
                                                        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full rounded-full bg-emerald-500"
                                                                style={{
                                                                    width: `${member.progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden px-4 py-3 md:px-6 md:py-4 sm:table-cell">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                                        <Zap className="h-3 w-3 text-amber-500" />
                                                        {member.xp.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right md:px-6 md:py-4">
                                                    <button className="text-slate-300 hover:text-slate-600">
                                                        <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center md:px-6"
                                            >
                                                <p className="text-sm font-medium text-slate-700">
                                                    No team members match the current filters.
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Adjust the search term or status filter to
                                                    restore the roster.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 p-3 md:p-4 sm:flex-row">
                            <p className="text-xs text-slate-500 md:text-sm">
                                Showing {filteredTeamMembers.length} of{' '}
                                {TEAM_MEMBERS.length} team members
                            </p>
                            {filtersApplied ? (
                                <button
                                    className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-600 hover:text-cyan-700 md:text-sm"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <span className="text-xs font-bold text-slate-400 md:text-sm">
                                    Staff directory preview
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl md:rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
                        <div className="mb-4 flex flex-col justify-between gap-2 md:mb-6 sm:flex-row sm:items-center">
                            <h2 className="text-sm font-bold text-slate-900 md:text-base">
                                Team Competency Radar
                            </h2>
                            <span className="text-[10px] text-slate-400 md:text-xs">
                                Aggregate scores of all operators
                            </span>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-8">
                            <div className="h-48 md:h-64">
                                <SkillRadarChart skills={TEAM_SKILLS} />
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 md:rounded-xl md:p-4">
                                    <h4 className="mb-1 text-[10px] font-bold uppercase text-emerald-800 md:text-xs">
                                        Strength
                                    </h4>
                                    <p className="text-xs text-emerald-700 md:text-sm">
                                        Team is performing at 95% for{' '}
                                        <strong>Client Care</strong>. Service feedback and
                                        follow-through remain consistently strong.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                    <h4 className="mb-1 text-xs font-bold uppercase text-amber-800">
                                        Improvement Area
                                    </h4>
                                    <p className="text-sm text-amber-700">
                                        <strong>Sales</strong> training is lagging. Consider
                                        assigning &quot;Conversion Conversations&quot; module.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-bold text-slate-900">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Compliance Alerts
                            </h3>
                            <button className="text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600">
                                Dismiss All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {COMPLIANCE_ALERTS.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="group relative rounded-xl border border-slate-100 bg-slate-50 p-3"
                                >
                                    <div className="flex gap-3">
                                        <div
                                            className={`h-8 w-1 rounded-full ${
                                                alert.priority === 'high'
                                                    ? 'bg-red-500'
                                                    : 'bg-amber-500'
                                            }`}
                                        />
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">
                                                {alert.user}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {alert.issue}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="absolute right-3 top-3 rounded-lg bg-white p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                                        <Bell className="h-3 w-3 text-cyan-600" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                            <Mail className="h-6 w-6 text-cyan-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold">Push Assignment</h3>
                        <p className="mb-6 text-sm text-slate-400">
                            Instantly assign a micro-module to specific team members.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">
                                    Module
                                </label>
                                <select className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm focus:border-cyan-500 focus:outline-none">
                                    <option>Safety Protocols v1.2</option>
                                    <option>Emergency Depressurization</option>
                                    <option>Client Intake Mastery</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">
                                    Target
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Operators', 'New Hires'].map((tag) => (
                                        <button
                                            key={tag}
                                            className="rounded-full bg-white/10 px-3 py-1 text-[10px] transition-colors hover:bg-cyan-500/20"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-900 shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-400">
                                Send Assignment
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                            <Clock className="h-4 w-4 text-slate-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {RECENT_ACTIVITY.map((activity) => (
                                <div
                                    key={`${activity.user}-${activity.time}`}
                                    className="flex gap-3 text-sm"
                                >
                                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                    <div>
                                        <span className="font-bold text-slate-900">
                                            {activity.user}
                                        </span>
                                        <span className="mx-1 text-slate-500">
                                            {activity.action}
                                        </span>
                                        <span className="font-medium text-cyan-600">
                                            {activity.item}
                                        </span>
                                        <div className="text-[10px] text-slate-400">
                                            {activity.time}
                                        </div>
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
