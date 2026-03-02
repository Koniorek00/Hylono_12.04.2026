import React from 'react';
import Link from 'next/link';
import { PartnerLayout } from './PartnerLayout';
import {
    Users,
    Wrench,
    FileText,
    Calendar,
    ArrowRight,
    AlertTriangle,
    Activity,
    Palette,
    Plus,
    LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

interface KpiCardProps {
    label: string;
    value: string | number;
    sub: string;
    icon: LucideIcon;
    accent: string;          // Tailwind bg class for icon bg
    iconColor: string;       // Tailwind text class for icon
    alert?: boolean;
}

interface QuickActionProps {
    icon: LucideIcon;
    label: string;
    description: string;
    href: string;
    iconBg: string;
    iconColor: string;
}

interface ActivityItem {
    id: string;
    type: 'client' | 'service' | 'document' | 'appointment';
    text: string;
    time: string;
}

interface DeviceRow {
    id: string;
    name: string;
    serial: string;
    status: 'online' | 'maintenance' | 'offline';
    nextService: string;
}

// ─────────────────────────────────────────────────────────
// STATIC DATA (replace with API when available)
// ─────────────────────────────────────────────────────────

const RECENT_ACTIVITY: ActivityItem[] = [
    { id: 'a1', type: 'client',      text: 'New client registered — Maria K.',                 time: '2h ago' },
    { id: 'a2', type: 'service',     text: 'Service log added for Pinnacle 360 (SN-8821)',      time: '5h ago' },
    { id: 'a3', type: 'document',    text: 'Informed consent signed — James W.',                time: 'Yesterday' },
    { id: 'a4', type: 'appointment', text: 'Session completed — Sarah C. (HBOT Protocol A)',   time: 'Yesterday' },
    { id: 'a5', type: 'client',      text: 'Client notes updated — Robert P.',                  time: '2 days ago' },
];

const FLEET_ROWS: DeviceRow[] = [
    { id: 'd1', name: 'Pinnacle 360 Hard Shell', serial: 'SN-8821-HB',  status: 'online',      nextService: '01 Mar 2026' },
    { id: 'd2', name: 'Aurora Pro Panel',        serial: 'RLT-99X-02',  status: 'online',      nextService: '15 Jun 2026' },
    { id: 'd3', name: 'Core PEMF Mat',           serial: 'PEMF-PRO-55', status: 'maintenance', nextService: 'OVERDUE' },
];

const QUICK_ACTIONS: QuickActionProps[] = [
    {
        icon: Users,
        label: 'Add Client',
        description: 'Register a new client in Nexus',
        href: '/partner/nexus',
        iconBg: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
    },
    {
        icon: FileText,
        label: 'New Document',
        description: 'Consent form or waiver',
        href: '/partner/docs',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
    },
    {
        icon: Palette,
        label: 'Create Campaign',
        description: 'Open marketing studio',
        href: '/partner/studio',
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
    },
];

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

const KpiCard: React.FC<KpiCardProps> = ({
    label, value, sub, icon: Icon, accent, iconColor, alert,
}) => (
    <div className={`bg-white rounded-xl border ${alert ? 'border-amber-200' : 'border-slate-100'} shadow-sm p-5 flex items-start gap-4`}>
        <div className={`w-10 h-10 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5 leading-none">{value}</p>
            <p className={`text-xs mt-1 ${alert ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>{sub}</p>
        </div>
    </div>
);

const QuickAction: React.FC<QuickActionProps> = ({
    icon: Icon, label, description, href, iconBg, iconColor,
}) => (
    <Link
        href={href}
        className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:border-cyan-200 hover:shadow-md transition-all group"
    >
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">{label}</p>
            <p className="text-xs text-slate-400 truncate">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
);

const activityIcon = (type: ActivityItem['type']) => {
    switch (type) {
        case 'client':      return <Users className="w-3.5 h-3.5 text-cyan-500" />;
        case 'service':     return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
        case 'document':    return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
        case 'appointment': return <Calendar className="w-3.5 h-3.5 text-emerald-500" />;
    }
};

const DeviceStatusBadge: React.FC<{ status: DeviceRow['status'] }> = ({ status }) => {
    if (status === 'online') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
            </span>
        );
    }
    if (status === 'maintenance') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                <Wrench className="w-3 h-3" />
                Service
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
            Offline
        </span>
    );
};

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────

export const DashboardHome: React.FC = () => {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <PartnerLayout title="Overview">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Overview</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{today}</p>
                </div>
                <Link
                    href="/partner/nexus"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Client
                </Link>
            </div>

            {/* ── KPI Cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                >
                    <KpiCard
                        label="Active Clients"
                        value={88}
                        sub="12 at-risk — review needed"
                        icon={Users}
                        accent="bg-cyan-50"
                        iconColor="text-cyan-600"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <KpiCard
                        label="Fleet Health"
                        value="2 / 3"
                        sub="1 unit needs service"
                        icon={Activity}
                        accent="bg-amber-50"
                        iconColor="text-amber-600"
                        alert
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <KpiCard
                        label="Pending Documents"
                        value={4}
                        sub="Consent forms awaiting signature"
                        icon={FileText}
                        accent="bg-indigo-50"
                        iconColor="text-indigo-600"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <KpiCard
                        label="Sessions This Week"
                        value={14}
                        sub="Next: Today, 14:00"
                        icon={Calendar}
                        accent="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />
                </motion.div>
            </div>

            {/* ── Middle row: Fleet + Recent Activity ───────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">

                {/* Fleet Status (3/5) */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-900">Fleet Status</h2>
                        <Link href="/partner/fleet" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                            Manage <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {FLEET_ROWS.map((device) => (
                            <Link
                                key={device.id}
                                href="/partner/fleet"
                                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 group-hover:text-cyan-700 transition-colors truncate">
                                        {device.name}
                                    </p>
                                    <p className="text-[10px] font-mono text-slate-400">{device.serial}</p>
                                </div>
                                <DeviceStatusBadge status={device.status} />
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Next service</p>
                                    <p className={`text-xs font-medium ${device.nextService === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                        {device.nextService}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {FLEET_ROWS.some(d => d.status === 'maintenance') && (
                        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 flex items-center gap-2 text-xs text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Core PEMF Mat has an open service ticket. <Link href="/partner/fleet" className="font-bold underline hover:no-underline">View details</Link></span>
                        </div>
                    )}
                </motion.div>

                {/* Recent Activity (2/5) */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {RECENT_ACTIVITY.map((item) => (
                            <li key={item.id} className="flex items-start gap-3 px-5 py-3">
                                <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                    {activityIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-700 leading-snug">{item.text}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* ── Quick Actions ─────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {QUICK_ACTIONS.map((action) => (
                        <QuickAction key={action.href} {...action} />
                    ))}
                </div>
            </motion.div>

        </PartnerLayout>
    );
};

