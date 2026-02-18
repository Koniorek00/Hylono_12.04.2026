import React from 'react';
import { Shield, Lock, FileKey, Globe, CheckCircle2 } from 'lucide-react';

export const ComplianceBadges: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-4 items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-600">
                <Shield size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
                <Globe size={16} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider">GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
                <Lock size={16} className="text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider">AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
                <FileKey size={16} className="text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Zero Trust</span>
            </div>
        </div>
    );
};
