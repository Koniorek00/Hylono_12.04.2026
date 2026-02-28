import React from 'react';
import { PartnerLayout } from './PartnerLayout';
import { GraduationCap, Clock } from 'lucide-react';

export const Academy: React.FC = () => (
    <PartnerLayout title="Academy">
        <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-cyan-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Academy — Coming Soon</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Structured training modules, certification tracks, and protocol education for your clinical team. We're building something worth waiting for.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Launching Q3 2026
            </div>
        </div>
    </PartnerLayout>
);
