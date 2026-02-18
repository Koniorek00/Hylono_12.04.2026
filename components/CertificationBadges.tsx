import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, FileCheck, Globe } from 'lucide-react';

interface CertificationBadge {
    name: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

const certifications: CertificationBadge[] = [
    { name: 'CE Certified', icon: <CheckCircle />, description: 'European Conformity', color: 'bg-blue-500' },
    { name: 'FDA Cleared', icon: <Shield />, description: 'US Medical Device Registration', color: 'bg-emerald-500' },
    { name: 'ISO 13485', icon: <Award />, description: 'Medical Device Quality Management', color: 'bg-purple-500' },
    { name: 'GDPR Compliant', icon: <FileCheck />, description: 'Data Protection Certified', color: 'bg-cyan-500' },
];

// Inline Certification Badges Row
export const CertificationBadgesRow: React.FC = () => (
    <div className="flex flex-wrap gap-3">
        {certifications.map((cert) => (
            <div
                key={cert.name}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm"
            >
                <div className={`w-6 h-6 ${cert.color} rounded-full flex items-center justify-center text-white`}>
                    {React.cloneElement(cert.icon as React.ReactElement<{ size?: number }>, { size: 14 })}
                </div>
                <span className="text-xs font-medium text-slate-700">{cert.name}</span>
            </div>
        ))}
    </div>
);

// Certification Section with Details
export const CertificationSection: React.FC = () => (
    <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
                <Shield className="mx-auto text-cyan-500 mb-4" size={40} />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Certified & Compliant</h2>
                <p className="text-slate-600">All Hylono products meet the highest international standards</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {certifications.map((cert, i) => (
                    <motion.div
                        key={cert.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 ${cert.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                            {React.cloneElement(cert.icon as React.ReactElement, { size: 24 })}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{cert.name}</h3>
                        <p className="text-xs text-slate-500">{cert.description}</p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-10 p-6 bg-white rounded-xl border border-slate-200 flex items-center gap-6">
                <Globe className="text-slate-400 flex-shrink-0" size={40} />
                <div>
                    <h3 className="font-bold text-slate-900 mb-1">EU Data Sovereignty</h3>
                    <p className="text-sm text-slate-600">
                        All data is processed and stored within the European Union, ensuring full compliance with GDPR
                        and the highest standards of data protection. Our servers are located in Frankfurt, Germany.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

// Trust Banner for Product Pages
export const TrustBanner: React.FC = () => (
    <div className="bg-slate-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>FDA Cleared</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>CE Certified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>Free EU Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>30-Day Returns</span>
            </div>
        </div>
    </div>
);
