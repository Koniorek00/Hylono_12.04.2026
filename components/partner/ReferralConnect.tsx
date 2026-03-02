import React, { useState } from 'react';
import { PartnerLayout } from './PartnerLayout';
import {
    Link2,
    Users,
    DollarSign,
    TrendingUp,
    Copy,
    ExternalLink,
    Plus,
    Search,
    CheckCircle,
    Clock,
    Mail,
    Phone,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

// Mock Referral Data
interface Referral {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'pending' | 'contacted' | 'converted' | 'lost';
    source: string;
    date: string;
    commission?: number;
}

const REFERRALS: Referral[] = [
    { id: '1', name: 'Michael Torres', email: 'm.torres@example.com', phone: '+1 555-0123', status: 'converted', source: 'Patient Referral', date: '2026-01-12', commission: 150 },
    { id: '2', name: 'Emily Watson', email: 'e.watson@example.com', phone: '+1 555-0456', status: 'contacted', source: 'Website Form', date: '2026-01-14' },
    { id: '3', name: 'David Kim', email: 'd.kim@example.com', phone: '+1 555-0789', status: 'pending', source: 'Patient Referral', date: '2026-01-15' },
];

const StatusBadge: React.FC<{ status: Referral['status'] }> = ({ status }) => {
    const styles: Record<Referral['status'], string> = {
        pending: 'bg-amber-50 text-amber-700',
        contacted: 'bg-blue-50 text-blue-700',
        converted: 'bg-emerald-50 text-emerald-700',
        lost: 'bg-slate-100 text-slate-500',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; trend?: string; positive?: boolean }> = ({ label, value, icon, trend, positive }) => (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">{icon}</div>
        </div>
        <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            {trend && (
                <span className={`text-xs font-bold mb-1 ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {positive ? '+' : ''}{trend}
                </span>
            )}
        </div>
    </div>
);

export const ReferralConnect: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const referralLink = 'https://hylono.com/ref/CF-4402';

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PartnerLayout title="Referral Connect">
            <div className="space-y-8">
                {/* Referral Link Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Your Referral Link</h2>
                            <p className="text-slate-400 text-sm mb-4">Share this link to earn commissions on new equipment sales.</p>
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-700 rounded-lg px-4 py-2 font-mono text-sm text-cyan-400">
                                    {referralLink}
                                </div>
                                <button
                                    onClick={copyLink}
                                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                                >
                                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Lifetime Earnings</p>
                            <p className="text-3xl font-bold text-emerald-400">$2,450</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Active Referrals" value="12" icon={<Users className="w-5 h-5" />} trend="3" positive />
                    <StatCard label="Pending Commission" value="$450" icon={<DollarSign className="w-5 h-5" />} />
                    <StatCard label="Conversion Rate" value="24%" icon={<TrendingUp className="w-5 h-5" />} trend="5%" positive />
                    <StatCard label="This Month" value="3" icon={<Link2 className="w-5 h-5" />} trend="1" positive />
                </div>

                {/* Referrals Table */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900">Referral Pipeline</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search referrals..."
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                <Plus className="w-4 h-4" />
                                Add Referral
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <div className="col-span-3">Contact</div>
                            <div className="col-span-2">Source</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Commission</div>
                            <div className="col-span-1"></div>
                        </div>
                        {REFERRALS.map(referral => (
                            <div key={referral.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-50 last:border-0 hover:bg-cyan-50/30 transition-colors">
                                <div className="col-span-3">
                                    <p className="font-bold text-slate-900">{referral.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {referral.email}</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-sm text-slate-600">{referral.source}</div>
                                <div className="col-span-2 text-sm text-slate-600">{referral.date}</div>
                                <div className="col-span-2"><StatusBadge status={referral.status} /></div>
                                <div className="col-span-2">
                                    {referral.commission ? (
                                        <span className="font-bold text-emerald-600">${referral.commission}</span>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </div>
                                <div className="col-span-1 text-right">
                                    <button className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
};

export default ReferralConnect;

