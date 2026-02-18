import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, TrendingUp, Globe, CheckCircle, Handshake, DollarSign, Headphones, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface PartnerFormData {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    partnershipType: string;
    country: string;
    message: string;
}

const initialFormData: PartnerFormData = {
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: '',
    country: '',
    message: '',
};

export const PartnerPortal: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Partial<PartnerFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<PartnerFormData> = {};
        
        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }
        if (!formData.contactName.trim()) {
            newErrors.contactName = 'Contact name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.partnershipType) {
            newErrors.partnershipType = 'Please select a partnership type';
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof PartnerFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleApplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Simulate API call - replace with actual endpoint
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In production, send to your API:
            // const response = await fetch('/api/partner-applications', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData),
            // });
            
            console.log('Partner application submitted:', formData);
            setSubmitStatus('success');
            setFormData(initialFormData);
            
            // Auto-close form after 3 seconds
            setTimeout(() => {
                setShowForm(false);
                setSubmitStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Failed to submit application:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const partnerTypes = [
        { icon: <Building />, title: 'Clinic Partner', desc: 'Wellness centers, spas, and clinics', benefits: ['Wholesale pricing', 'Co-marketing', 'Training'] },
        { icon: <Users />, title: 'Distributor', desc: 'Regional sales partners', benefits: ['Exclusive territory', 'Demo units', 'Sales support'] },
        { icon: <TrendingUp />, title: 'Integrator', desc: 'Equipment installers & service', benefits: ['Technical training', 'Certification', 'Lead referrals'] },
    ];

    const benefits = [
        { icon: <DollarSign />, title: 'Competitive Margins', desc: '20-40% wholesale discounts' },
        { icon: <Headphones />, title: 'Dedicated Support', desc: 'Partner success manager' },
        { icon: <Globe />, title: 'Marketing Support', desc: 'Co-branded materials' },
        { icon: <CheckCircle />, title: 'Certification', desc: 'Official Hylono Partner badge' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <Handshake className="mx-auto text-cyan-500 mb-4" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Partner With Hylono</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Join our network of wellness professionals and grow your business
                        with premium bio-optimization technology.
                    </p>
                </div>

                {/* Partner Types */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Partnership Options</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {partnerTypes.map((type, i) => (
                        <motion.div
                            key={type.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 text-cyan-600">
                                {type.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{type.title}</h3>
                            <p className="text-slate-500 text-sm mb-4">{type.desc}</p>
                            <ul className="space-y-2">
                                {type.benefits.map((b) => (
                                    <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle size={14} className="text-emerald-500" /> {b}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Partner Benefits */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">Partner Benefits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {benefits.map((b) => (
                            <div key={b.title} className="text-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    {b.icon}
                                </div>
                                <h3 className="font-bold text-sm mb-1">{b.title}</h3>
                                <p className="text-xs text-slate-400">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Existing Partner Login */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Existing Partners</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            Access your partner dashboard, place orders, and download resources.
                        </p>
                        <a href="/partner/dashboard" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
                            Launch Partner OS
                        </a>
                        <a href="/partner/studio" className="w-full mt-3 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                            <TrendingUp size={18} /> Access Marketing Studio
                        </a>
                    </div>

                    <div className="bg-cyan-50 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Become a Partner</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            Interested in partnering with Hylono? Tell us about your business.
                        </p>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-full py-4 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-600 flex items-center justify-center gap-2"
                        >
                            Apply Now <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Application Form */}
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-2xl p-8 shadow-sm mt-6"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Partner Application</h2>
                        <form onSubmit={handleApplicationSubmit} className="grid md:grid-cols-2 gap-4">
                            <input placeholder="Company Name" className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                            <input placeholder="Contact Name" className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                            <input placeholder="Email" type="email" className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                            <input placeholder="Phone" className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                            <select className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none text-slate-600">
                                <option>Partnership Type</option>
                                <option>Clinic Partner</option>
                                <option>Distributor</option>
                                <option>Integrator</option>
                            </select>
                            <input placeholder="Country" className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                            <textarea placeholder="Tell us about your business..." className="md:col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none h-24 resize-none" />
                            <button type="submit" className="md:col-span-2 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">
                                Submit Application
                            </button>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
