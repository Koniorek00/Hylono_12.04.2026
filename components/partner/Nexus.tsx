import React, { useState, useMemo } from 'react';
import { PartnerLayout } from './PartnerLayout';
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Phone,
    Mail,
    Calendar,
    ChevronRight,
    Users,
    AlertTriangle,
    Activity,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { ClientProfile } from './nexus/ClientProfile';

// MOCK DATA for Registry - moved outside component to prevent recreation
const REGISTRY = [
    { id: '1', name: 'James Wilson', dob: '1984-02-12', status: 'Active', protocol: 'Neural Repair', adherence: 92, risk: 'low' as const, next: 'Today, 14:00' },
    { id: '2', name: 'Sarah Connor', dob: '1990-06-25', status: 'Active', protocol: 'Systemic Anti-Inf', adherence: 65, risk: 'med' as const, next: 'Tomorrow, 09:00' },
    { id: '3', name: 'Robert Paulson', dob: '1975-11-03', status: 'Review', protocol: 'Pending', adherence: 0, risk: 'high' as const, next: '--' },
];

export const Nexus: React.FC = () => {
    // State to toggle between List view and Detail view
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter patients based on search query
    const filteredRegistry = useMemo(() => {
        if (!searchQuery.trim()) return REGISTRY;
        const query = searchQuery.toLowerCase();
        return REGISTRY.filter(patient => 
            patient.name.toLowerCase().includes(query) ||
            patient.dob.includes(query) ||
            patient.id.includes(query)
        );
    }, [searchQuery]);

    // If a client is selected, show the new Nexus 2.0 Profile View
    if (selectedClient) {
        return (
            <PartnerLayout title="Nexus Clinical Intelligence">
                <ClientProfile onBack={() => setSelectedClient(null)} />
            </PartnerLayout>
        );
    }

    // Otherwise, show the Clinical Registry
    return (
        <PartnerLayout title="Patient Registry">
            <div className="p-4 md:p-6 h-full flex flex-col font-sans">
                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 shrink-0 gap-3">
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64 md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, MRN, or DOB..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 shadow-sm text-sm"
                            />
                        </div>
                        <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-slate-300 shadow-sm shrink-0" aria-label="Filter">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-4 md:gap-6 text-xs font-mono text-slate-500">
                            <div><span className="font-bold text-slate-800">142</span> Total</div>
                            <div><span className="font-bold text-emerald-600">88</span> Active</div>
                            <div><span className="font-bold text-amber-600">12</span> At Risk</div>
                        </div>
                        <button className="px-4 md:px-5 py-2 md:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg transition-all text-sm">
                            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Register</span> Patient
                        </button>
                    </div>
                </div>

                {/* Clinical Registry Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-3 md:py-4 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patient Identity</th>
                                    <th className="text-left py-3 md:py-4 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Status</th>
                                    <th className="text-left py-3 md:py-4 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Care Plan</th>
                                    <th className="text-left py-3 md:py-4 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adherence</th>
                                    <th className="text-left py-3 md:py-4 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Next Appt</th>
                                    <th className="py-3 md:py-4 px-4 md:px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRegistry.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        onClick={() => setSelectedClient(`client-${patient.id}`)}
                                        className="hover:bg-slate-50 cursor-pointer transition-all group"
                                    >
                                        <td className="py-3 md:py-4 px-4 md:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 font-mono text-xs group-hover:bg-cyan-50 group-hover:text-cyan-600 group-hover:border-cyan-200 transition-colors">
                                                    {patient.name.charAt(0)}{patient.name.split(' ')[1]?.charAt(0) || ''}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono">DOB: {patient.dob}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 md:py-4 px-4 md:px-6">
                                            <div className="flex flex-col gap-1">
                                                {patient.risk === 'high' ? (
                                                    <span className="inline-flex max-w-min items-center gap-1.5 px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold uppercase border border-red-100 whitespace-nowrap">
                                                        <AlertTriangle className="w-3 h-3" /> High Risk
                                                    </span>
                                                ) : patient.risk === 'med' ? (
                                                    <span className="inline-flex max-w-min items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase border border-amber-100 whitespace-nowrap">
                                                        <Activity className="w-3 h-3" /> Monitor
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex max-w-min items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-100 whitespace-nowrap">
                                                        <CheckCircle2 className="w-3 h-3" /> Stable
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 md:py-4 px-4 md:px-6 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                <span className="text-xs font-bold text-slate-700">{patient.protocol}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 md:py-4 px-4 md:px-6">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:block">Adherence</span>
                                                    <div className="w-16 md:w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${patient.adherence > 80 ? 'bg-emerald-500' : patient.adherence > 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                                                            style={{ width: `${patient.adherence}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs font-mono font-bold text-slate-600">{patient.adherence}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-mono text-slate-600 hidden sm:table-cell">
                                            {patient.next}
                                        </td>
                                        <td className="py-3 md:py-4 px-4 md:px-6 text-right">
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors inline-block" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
};
