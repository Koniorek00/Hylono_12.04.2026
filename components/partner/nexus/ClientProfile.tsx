import React, { useState, useMemo } from 'react';
import { HealthBook } from './HealthBook';
import { ProtocolEngine } from './ProtocolEngine';
import { ChevronLeft, Activity, Calendar, Clock, AlertCircle, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    risk: 'low' | 'moderate' | 'high';
}

interface ClientHealth {
    conditions: string[];
    contraindications: string[];
    biometrics?: {
        hrv: string;
        spo2: string;
        bpSys: string;
        bpDia: string;
        rhr: string;
    };
    pain?: number;
}

interface ClientProfileProps {
    client?: Client;
    onBack: () => void;
}

// MOCK DATA for Trends - moved outside component to prevent recreation
const BIOMETRIC_TRENDS: Record<string, { value: string; unit: string; trend: string; change: string }> = {
    hrv: { value: '54', unit: 'ms', trend: 'up', change: '+12%' },
    rhr: { value: '48', unit: 'bpm', trend: 'down', change: '-4%' },
    bp: { value: '118/76', unit: 'mmHg', trend: 'stable', change: '0%' },
    spO2: { value: '98', unit: '%', trend: 'up', change: '+1%' }
};

export const ClientProfile: React.FC<ClientProfileProps> = ({ client, onBack }) => {
    const [clientHealth, setClientHealth] = useState<ClientHealth>({ conditions: [], contraindications: [] });

    // Default mock client if not provided - memoized
    const activeClient = useMemo(() => client || { id: '8832-AX', name: 'John Doe', risk: 'moderate' as const }, [client]);

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* VITALS HEADER (Persistent) */}
            <div className="bg-white border-b border-slate-200 p-3 md:p-4 shadow-sm z-10 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 gap-3">
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onBack}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-lg md:text-xl border border-slate-200">
                        {activeClient.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">{activeClient.name}</h2>
                        <div className="flex items-center gap-2 md:gap-3 text-xs text-slate-500 flex-wrap">
                            <span>ID: <span className="font-mono text-slate-700">#{activeClient.id}</span></span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">DOB: 12/04/1984 (41y)</span>
                        </div>
                    </div>
                </div>

                {/* Active Alerts */}
                {activeClient.risk === 'high' && (
                    <div className="px-3 py-1 bg-red-50 border border-red-200 rounded-full flex items-center gap-2 text-xs font-bold text-red-600 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" /> Hypertension Alert
                    </div>
                )}

                {/* Biometric Sparklines - Hidden on mobile, visible on tablet+ */}
                <div className="hidden lg:flex gap-4 xl:gap-6">
                    {Object.entries(BIOMETRIC_TRENDS).map(([key, data]) => (
                        <div key={key} className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{key}</div>
                            <div className="font-mono font-bold text-slate-800 text-sm flex items-center justify-end gap-1">
                                {data.value} <span className="text-[10px] text-slate-400 font-normal">{data.unit}</span>
                            </div>
                            <div className={`text-[9px] font-bold flex items-center justify-end gap-0.5 ${data.trend === 'up' ? 'text-emerald-500' :
                                    data.trend === 'down' ? 'text-amber-500' :
                                        'text-slate-400'
                                }`}>
                                {data.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> :
                                    data.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" /> : null}
                                {data.change}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN WORKSPACE LAYOUT - Responsive Grid */}
            <div className="flex-1 overflow-hidden p-3 md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 h-full">
                    {/* LEFT: INTAKE (50% on desktop, full on mobile) */}
                    <div className="col-span-1 h-full overflow-hidden rounded-xl shadow-sm min-h-[400px] lg:min-h-0">
                        <HealthBook onChange={setClientHealth} />
                    </div>

                    {/* RIGHT: PRESCRIPTION AI (50% on desktop, full on mobile) */}
                    <div className="col-span-1 h-full overflow-hidden rounded-xl shadow-sm min-h-[400px] lg:min-h-0">
                        <ProtocolEngine clientData={clientHealth} />
                    </div>
                </div>
            </div>
        </div>
    );
};
