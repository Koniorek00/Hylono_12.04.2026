import React, { useState } from 'react';
import { Shield, FileText, Download, UserX, AlertTriangle, CheckCircle, Activity, Lock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const DataGovernance: React.FC = () => {
    const [auditLog] = useState([
        { id: 1, action: 'DATA_READ', resource: 'medical_records/rec_882', user: 'Dr. Sarah Chen', time: '10:42 AM', status: 'AUTHORIZED' },
        { id: 2, action: 'CLAIM_UPDATE', resource: 'users/uid_123', user: 'Admin System', time: '09:15 AM', status: 'EXECUTED' },
        { id: 3, action: 'LOGIN_ATTEMPT', resource: 'auth/session', user: 'Client Device', time: '09:14 AM', status: 'VERIFIED' },
    ]);

    const [anonymized, setAnonymized] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Shield className="text-emerald-500" /> Security & Compliance Hub
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                            <Lock size={12} /> CMEK ENCRYPTED
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                            <Activity size={12} /> AUDIT ACTIVE
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* --- LEFT COLUMN: DATA RIGHTS --- */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">My Data Rights (GDPR/HIPAA)</h4>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-bold text-slate-700 text-sm">Portability Export</div>
                                    <div className="text-xs text-slate-500 mt-1">Download your full raw clinical data in JSON format.</div>
                                </div>
                                <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-600">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-bold text-slate-700 text-sm">Identity Anonymization</div>
                                    <div className="text-xs text-slate-500 mt-1">Redact PII from clinical research datasets.</div>
                                </div>
                                <button
                                    onClick={() => setAnonymized(!anonymized)}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${anonymized ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${anonymized ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {anonymized && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                    <CheckCircle size={12} /> Identity masked in all outbound analytics.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: FORENSIC AUDIT LOG --- */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center justify-between">
                            <span>Forensic Access Log</span>
                            <span className="text-[10px] text-slate-400 font-normal">Immutable (WORM)</span>
                        </h4>
                        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-xs font-mono">
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-slate-400">
                                <span>Recent Access Events</span>
                                <Eye size={12} />
                            </div>
                            <div className="p-1 space-y-0.5">
                                {auditLog.map(log => (
                                    <div key={log.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded transition-colors group">
                                        <span className="text-slate-500 w-16">{log.time}</span>
                                        <span className={`w-2 h-2 rounded-full ${log.status === 'AUTHORIZED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                        <span className="text-slate-300 flex-1 truncate">{log.action}</span>
                                        <span className="text-slate-500 text-[10px] truncate max-w-[100px]">{log.resource}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                            <Lock size={10} /> Log stream secured via VPC Service Controls
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
