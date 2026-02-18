import { Shield, CheckCircle, Award, Globe, Server, FileCheck } from 'lucide-react';

export const TrustBadges = () => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full">
                <Shield size={16} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">FDA Cleared Class II</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full">
                <CheckCircle size={16} className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">HSA/FSA Eligible</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full hidden md:flex">
                <Globe size={16} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">MDR Compliant (EU)</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full hidden md:flex">
                <FileCheck size={16} className="text-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">TÜV SÜD Certified</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full">
                <Award size={16} className="text-purple-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Clinical Grade</span>
            </div>
        </div>
    );
};
