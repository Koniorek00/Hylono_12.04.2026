import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    AlertCircle,
    ArrowRight,
    Building,
    CheckCircle,
    CheckCircle2,
    DollarSign,
    Globe,
    Handshake,
    Headphones,
    Loader2,
    TrendingUp,
    Users,
} from 'lucide-react';
import Link from 'next/link';

interface PartnerFormData {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    partnershipType: string;
    country: string;
    message: string;
}

interface PartnerPortalProps {
    isAuthenticated?: boolean;
    onRequestAccess?: () => void;
}

interface PartnerApplicationResponse {
    success?: boolean;
    message?: string;
    ticketId?: string;
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

const PARTNERSHIP_OPTIONS = [
    'Clinic Partner',
    'Distributor',
    'Integrator',
] as const;

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
    isAuthenticated = false,
    onRequestAccess,
}) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<PartnerFormData>>({});

    const validateForm = (): boolean => {
        const nextErrors: Partial<PartnerFormData> = {};

        if (!formData.companyName.trim()) {
            nextErrors.companyName = 'Company name is required';
        }
        if (!formData.contactName.trim()) {
            nextErrors.contactName = 'Contact name is required';
        }
        if (!formData.email.trim()) {
            nextErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = 'Please enter a valid email';
        }
        if (!formData.partnershipType) {
            nextErrors.partnershipType = 'Please select a partnership type';
        }
        if (!formData.country.trim()) {
            nextErrors.country = 'Country is required';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleInputChange = (field: keyof PartnerFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (submitStatus !== 'idle') {
            setSubmitStatus('idle');
            setSubmissionMessage('');
            setTicketId(null);
        }
    };

    const buildPartnerInquiryMessage = () => {
        const detailLines = [
            `Partnership type: ${formData.partnershipType}`,
            `Country: ${formData.country}`,
            `Phone: ${formData.phone.trim() || 'Not provided'}`,
            `Company: ${formData.companyName}`,
        ];
        const trimmedMessage = formData.message.trim();

        return trimmedMessage
            ? `${trimmedMessage}\n\nBusiness details:\n${detailLines.join('\n')}`
            : `Business details:\n${detailLines.join('\n')}`;
    };

    const handleApplicationSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            setSubmitStatus('error');
            setSubmissionMessage('Please fix the highlighted fields before submitting.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmissionMessage('');
        setTicketId(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.contactName.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim() || undefined,
                    company: formData.companyName.trim(),
                    subject: `Partner application: ${formData.partnershipType}`,
                    message: buildPartnerInquiryMessage(),
                    inquiryType: 'b2b',
                }),
            });

            const result = (await response
                .json()
                .catch(() => null)) as PartnerApplicationResponse | null;

            if (!response.ok || !result?.success) {
                throw new Error(
                    result?.message || 'Unable to submit your partner application right now.'
                );
            }

            setSubmitStatus('success');
            setSubmissionMessage(
                result.message || 'Partner application submitted successfully.'
            );
            setTicketId(result.ticketId ?? null);
            setFormData(initialFormData);
            setErrors({});
        } catch (error) {
            setSubmitStatus('error');
            setSubmissionMessage(
                error instanceof Error
                    ? error.message
                    : 'Unable to submit your partner application right now.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const partnerTypes = [
        {
            icon: <Building />,
            title: 'Clinic Partner',
            desc: 'Wellness centers, spas, and clinics',
            benefits: ['Wholesale pricing', 'Co-marketing', 'Training'],
        },
        {
            icon: <Users />,
            title: 'Distributor',
            desc: 'Regional sales partners',
            benefits: ['Exclusive territory', 'Demo units', 'Sales support'],
        },
        {
            icon: <TrendingUp />,
            title: 'Integrator',
            desc: 'Equipment installers and service',
            benefits: ['Technical training', 'Certification', 'Lead referrals'],
        },
    ];

    const benefits = [
        { icon: <DollarSign />, title: 'Competitive Margins', desc: '20-40% wholesale discounts' },
        { icon: <Headphones />, title: 'Dedicated Support', desc: 'Partner success manager' },
        { icon: <Globe />, title: 'Marketing Support', desc: 'Co-branded materials' },
        { icon: <CheckCircle />, title: 'Certification', desc: 'Official Hylono Partner badge' },
    ];

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {!isAuthenticated && (
                    <div className="mb-8 rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-700">
                            Public partner overview
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900">
                            Review the partner model first, then request access when you are ready.
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                            Existing partners can continue to Nexus for protected tools. New clinics,
                            distributors, and integrators can use the application form below to start
                            a B2B review without hitting a dead-end gate.
                        </p>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={onRequestAccess}
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Sign in to partner tools
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(true)}
                                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                            >
                                Start an application
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-center mb-16">
                    <Handshake className="mx-auto text-cyan-500 mb-4" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Partner With Hylono</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Join our network of wellness professionals and grow your business
                        with premium bio-optimization technology.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                    Partnership Options
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {partnerTypes.map((type, index) => (
                        <motion.div
                            key={type.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 text-cyan-600">
                                {type.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{type.title}</h3>
                            <p className="text-slate-500 text-sm mb-4">{type.desc}</p>
                            <ul className="space-y-2">
                                {type.benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">Partner Benefits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="text-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    {benefit.icon}
                                </div>
                                <h3 className="font-bold text-sm mb-1">{benefit.title}</h3>
                                <p className="text-xs text-slate-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Existing Partners</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            Access your partner dashboard, place orders, and download resources.
                        </p>
                        <Link
                            href="/nexus"
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
                        >
                            Open Nexus
                        </Link>
                        <Link
                            href="/nexus/studio"
                            className="w-full mt-3 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
                        >
                            <TrendingUp size={18} /> Access Marketing Studio
                        </Link>
                    </div>

                    <div className="bg-cyan-50 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Become a Partner</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            Interested in partnering with Hylono? Tell us about your business.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowForm((prev) => !prev)}
                            className="w-full py-4 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-600 flex items-center justify-center gap-2"
                        >
                            Apply Now <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-2xl p-8 shadow-sm mt-6"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Partner Application</h2>

                        {submitStatus !== 'idle' && submissionMessage && (
                            <div
                                role={submitStatus === 'success' ? 'status' : 'alert'}
                                className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                                    submitStatus === 'success'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                        : 'border-red-200 bg-red-50 text-red-700'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {submitStatus === 'success' ? (
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                                    ) : (
                                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                        <p>{submissionMessage}</p>
                                        {ticketId ? (
                                            <p className="mt-1 font-mono text-xs">Reference: {ticketId}</p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleApplicationSubmit} className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    aria-label="Company Name"
                                    value={formData.companyName}
                                    onChange={(event) => handleInputChange('companyName', event.target.value)}
                                    placeholder="Company Name"
                                    aria-invalid={Boolean(errors.companyName)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                                {errors.companyName ? (
                                    <p className="mt-2 text-xs text-red-600">{errors.companyName}</p>
                                ) : null}
                            </div>

                            <div>
                                <input
                                    aria-label="Contact Name"
                                    value={formData.contactName}
                                    onChange={(event) => handleInputChange('contactName', event.target.value)}
                                    placeholder="Contact Name"
                                    aria-invalid={Boolean(errors.contactName)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                                {errors.contactName ? (
                                    <p className="mt-2 text-xs text-red-600">{errors.contactName}</p>
                                ) : null}
                            </div>

                            <div>
                                <input
                                    aria-label="Email"
                                    value={formData.email}
                                    onChange={(event) => handleInputChange('email', event.target.value)}
                                    placeholder="Email"
                                    type="email"
                                    aria-invalid={Boolean(errors.email)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                                {errors.email ? (
                                    <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                                ) : null}
                            </div>

                            <div>
                                <input
                                    aria-label="Phone"
                                    value={formData.phone}
                                    onChange={(event) => handleInputChange('phone', event.target.value)}
                                    placeholder="Phone"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <select
                                    aria-label="Partnership Type"
                                    value={formData.partnershipType}
                                    onChange={(event) => handleInputChange('partnershipType', event.target.value)}
                                    aria-invalid={Boolean(errors.partnershipType)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none text-slate-600"
                                >
                                    <option value="">Partnership Type</option>
                                    {PARTNERSHIP_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.partnershipType ? (
                                    <p className="mt-2 text-xs text-red-600">{errors.partnershipType}</p>
                                ) : null}
                            </div>

                            <div>
                                <input
                                    aria-label="Country"
                                    value={formData.country}
                                    onChange={(event) => handleInputChange('country', event.target.value)}
                                    placeholder="Country"
                                    aria-invalid={Boolean(errors.country)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                                {errors.country ? (
                                    <p className="mt-2 text-xs text-red-600">{errors.country}</p>
                                ) : null}
                            </div>

                            <textarea
                                aria-label="Tell us about your business"
                                value={formData.message}
                                onChange={(event) => handleInputChange('message', event.target.value)}
                                placeholder="Tell us about your business, model, and what you need to evaluate..."
                                className="md:col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none h-24 resize-none"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="md:col-span-2 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        Submitting application
                                    </span>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </div>
        </main>
    );
};

