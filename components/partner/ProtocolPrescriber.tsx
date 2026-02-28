import React from 'react';
import { PartnerLayout } from './PartnerLayout';
import { BookOpen, Clock } from 'lucide-react';

export const ProtocolPrescriber: React.FC = () => (
    <PartnerLayout title="Protocol Library">
        <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Protocol Library — Coming Soon</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Evidence-based treatment pathways for HBOT, PEMF, Red Light Therapy, and combination protocols. Tailored to client presentation and clinical goals.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                In development
            </div>
        </div>
    </PartnerLayout>
);
