/**
 * HelpCenterPage
 * Unified help center consolidating Support, FAQ, and Contact pages.
 * 
 * Tabs:
 *  1. FAQ — Searchable knowledge base
 *  2. Contact — Contact wizard + callback scheduler
 *  3. Device Support — Device scanner + enterprise support
 * 
 * Route: /help
 * Redirects: /support, /faq, /contact → /help with tab anchors
 */

import React, { useActionState, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
    HelpCircle, ChevronDown, Search, MessageCircle, Mail, Phone, MapPin,
    Send, Clock, AlertTriangle, ChevronRight, ChevronLeft, Calendar,
    Shield, ArrowRight, Users, Wrench, BookOpen, Package, Target
} from 'lucide-react';
import { SmartText } from './SmartText';
import { MedicalDisclaimer } from './shared/MedicalDisclaimer';
import { HELP_FAQ_DATA } from '@/content/help-faq';
import { siteEntity } from '@/content/site-entity';
import { DeviceScanner } from './support/DeviceScanner';
import { getCSRFToken, validateCSRFToken } from '../utils/csrf';
import { SmartMessageInput } from './SmartMessageInput';
import { SelectedItem } from './ProductProtocolBrowser';
import { submitContactFormAction, type FormActionResult } from '../src/actions/formActions';

// ─────────────────────────────────────────────────────────────────────────────
// FAQ DATA
// ─────────────────────────────────────────────────────────────────────────────

const FAQ_DATA = HELP_FAQ_DATA;

// ─────────────────────────────────────────────────────────────────────────────
// TAB CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'faq' | 'contact' | 'support';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={18} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
    { id: 'support', label: 'Device Support', icon: <Wrench size={18} /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface HelpCenterPageProps {
    initialTab?: TabId;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ initialTab = 'faq' }) => {
    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="min-h-screen bg-slate-50 pt-6 pb-24 md:pt-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* Hero Header */}
                <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
                    >
                        <Shield size={12} /> {siteEntity.supportCoverageLabel}
                    </motion.div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 futuristic-font">
                        Help Center
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Find answers, request support, and connect with the Hylono team for product, logistics, and protocol planning questions.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div role="tablist" aria-label="Help center sections" className="inline-flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`tabpanel-${tab.id}`}
                                id={`tab-${tab.id}`}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'faq' && (
                        <div role="tabpanel" id="tabpanel-faq" aria-labelledby="tab-faq">
                            <FAQTab key="faq" onOpenContact={() => setActiveTab('contact')} />
                        </div>
                    )}
                    {activeTab === 'contact' && (
                        <div role="tabpanel" id="tabpanel-contact" aria-labelledby="tab-contact">
                            <ContactTab key="contact" />
                        </div>
                    )}
                    {activeTab === 'support' && (
                        <div role="tabpanel" id="tabpanel-support" aria-labelledby="tab-support">
                            <SupportTab key="support" />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// FAQ TAB
// ─────────────────────────────────────────────────────────────────────────────

const FAQTab: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItem, setOpenItem] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();

    const filteredFAQ = FAQ_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
        >
            {/* Search */}
            <div className="relative mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    aria-label="Search frequently asked questions"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
            </div>

            {/* FAQ Accordion */}
            {filteredFAQ.map((category, ci) => (
                <div key={ci} className="mb-8">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{category.category}</h2>
                    {category.evidenceSource && (
                        <p className="text-xs text-slate-500 mb-3">Evidence source: {category.evidenceSource}</p>
                    )}
                    <div className="space-y-3">
                        {category.items.map((item, i) => {
                            const itemId = `${ci}-${i}`;
                            const isOpen = openItem === itemId;
                            return (
                                <div key={item.q} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors">
                                    <button
                                        onClick={() => setOpenItem(isOpen ? null : itemId)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="font-medium text-slate-900">{item.q}</span>
                                        <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pb-4"
                                            >
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    <SmartText>{item.a}</SmartText>
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 text-white text-center"
            >
                <MessageCircle className="mx-auto mb-4 opacity-80" size={32} />
                <h3 className="text-xl font-bold mb-2">Need a tailored answer?</h3>
                <p className="text-cyan-100 mb-6 text-sm">Use the contact tab for product matching, delivery questions, or support triage.</p>
                <button onClick={onOpenContact} className="px-6 py-3 bg-white text-cyan-600 rounded-xl font-bold text-sm hover:bg-cyan-50 transition-all">
                    Open contact options
                </button>
            </motion.div>

            <div className="mt-6">
                <MedicalDisclaimer type="general" compact className="text-center" />
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT TAB
// ─────────────────────────────────────────────────────────────────────────────

const ContactTab: React.FC = () => {
    const [formStep, setFormStep] = useState(1);
    const [userType, setUserType] = useState<'owner' | 'clinic' | 'curious' | null>(null);
    const [formData, setFormData] = useState({
        name: '', email: '', subject: '', message: '',
        serialNumber: '', clinicName: '', patientCount: '', interest: '', csrfToken: ''
    });
    const [csrfTokenError, setCsrfTokenError] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [showCallbackModal, setShowCallbackModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const [contactActionState, contactFormAction, contactPending] = useActionState<FormActionResult, FormData>(
        submitContactFormAction,
        { success: false, message: '' }
    );

    useEffect(() => {
        const token = getCSRFToken();
        setFormData(prev => ({ ...prev, csrfToken: token }));
    }, []);

    useEffect(() => {
        const keywords = ['pain', 'heart', 'emergency', 'stroke', 'bleeding', 'unconscious', 'chest'];
        const messageLower = formData.message.toLowerCase();
        if (keywords.some(keyword => messageLower.includes(keyword))) {
            setShowEmergencyModal(true);
        }
    }, [formData.message]);

    useEffect(() => {
        if (contactActionState.success) {
            setTicketId(contactActionState.ticketId ?? null);
            setSubmitted(true);
            setSubmitError(null);
            return;
        }

        if (contactActionState.message) {
            setSubmitError(contactActionState.message);
        }
    }, [contactActionState]);

    const handleSubmitValidation = (e: React.FormEvent<HTMLFormElement>) => {
        const storedToken = getCSRFToken();
        if (!validateCSRFToken(formData.csrfToken, storedToken)) {
            setCsrfTokenError(true);
            e.preventDefault();
            return;
        }

        setCsrfTokenError(false);
        setSubmitError(null);
    };

    const getNextBusinessDays = (count: number) => {
        const days = [];
        const current = new Date();
        while (days.length < count) {
            current.setDate(current.getDate() + 1);
            if (current.getDay() !== 0 && current.getDay() !== 6) days.push(new Date(current));
        }
        return days;
    };

    return (
        <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
        >
            {/* Emergency Modal */}
            <AnimatePresence>
                {showEmergencyModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                        onClick={() => setShowEmergencyModal(false)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="help-emergency-modal-title"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-l-4 border-red-500"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 text-red-600 mb-4">
                                <AlertTriangle size={32} aria-hidden="true" />
                                <h3 id="help-emergency-modal-title" className="text-xl font-bold">Medical Emergency Warning</h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                It looks like you might be describing a medical emergency.
                                Hylono products are <strong>not</strong> for emergency medical use.
                            </p>
                            <div className="space-y-3">
                                <a href="tel:112" className="block w-full py-3 bg-red-600 text-white text-center rounded-xl font-bold hover:bg-red-700 transition">
                                    Call Emergency Services (112)
                                </a>
                                <button onClick={() => setShowEmergencyModal(false)} className="block w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition">
                                    I understand, continue writing
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Callback Modal */}
            <AnimatePresence>
                {showCallbackModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setShowCallbackModal(false)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="help-callback-modal-title"
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 id="help-callback-modal-title" className="text-2xl font-bold text-slate-900">Schedule a Callback</h3>
                                    <p className="text-slate-500">Pick a 15-minute slot.</p>
                                </div>
                                <div className="p-3 bg-cyan-50 rounded-full text-cyan-600"><Calendar size={24} /></div>
                            </div>
                            {!selectedDate ? (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Select a Date</h4>
                                    <div className="grid gap-2">
                                        {getNextBusinessDays(5).map((date) => (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => setSelectedDate(date)}
                                                className="w-full p-4 rounded-xl border border-slate-200 text-left hover:border-cyan-500 hover:bg-cyan-50 transition-all group"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-700 group-hover:text-cyan-700">
                                                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-cyan-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <button onClick={() => setSelectedDate(null)} className="text-sm text-cyan-600 font-bold mb-4 flex items-center gap-1 hover:underline">
                                        <ChevronLeft size={14} /> Back to available dates
                                    </button>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">
                                        Select Time for {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {['09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM', '01:00 PM', '02:30 PM', '03:45 PM', '04:15 PM'].map(slot => (
                                            <button key={slot} onClick={() => { setShowCallbackModal(false); setSelectedDate(null); }}
                                                className="py-3 px-4 rounded-xl border border-slate-200 text-sm font-medium hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 transition-all text-slate-600">
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <button onClick={() => setShowCallbackModal(false)} className="w-full py-3 text-slate-400 font-medium hover:text-slate-600 transition">Cancel</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="text-emerald-600" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                            {ticketId && <p className="text-xs font-mono bg-slate-100 text-slate-500 px-3 py-1 rounded-lg inline-block mb-2">Ticket: {ticketId}</p>}
                            <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <form action={contactFormAction} onSubmit={handleSubmitValidation} className="h-full flex flex-col justify-between min-h-[400px]">
                            <input type="hidden" name="csrfToken" value={formData.csrfToken} />
                            <input type="hidden" name="userType" value={userType ?? ''} />
                            <input type="hidden" name="subject" value={formData.subject || `Contact from ${userType ?? 'website'}`} />
                            <input type="hidden" name="message" value={formData.message} />
                            <input type="hidden" name="serialNumber" value={formData.serialNumber} />
                            <input type="hidden" name="clinicName" value={formData.clinicName} />
                            <input type="hidden" name="interest" value={formData.interest} />
                            {csrfTokenError && (
                                <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">Security validation failed. Please refresh and try again.</p>
                                </div>
                            )}
                            <div className="flex gap-2 mb-8">
                                {[1, 2, 3].map(step => (
                                    <div key={step} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step <= formStep ? 'bg-cyan-500' : 'bg-slate-100'}`} />
                                ))}
                            </div>

                            <div className="flex-grow">
                                <AnimatePresence mode="wait">
                                    {formStep === 1 && (
                                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6">First, tell us who you are:</h3>
                                            {[
                                                { id: 'owner', label: 'I am a Device Owner', desc: 'Support for my Hylono device' },
                                                { id: 'clinic', label: 'I represent a Clinic', desc: 'Commercial inquiries & partnerships' },
                                                { id: 'curious', label: 'I am curious', desc: 'Questions about products & science' }
                                            ].map((type) => (
                                                <button key={type.id} type="button"
                                                    onClick={() => { setUserType(type.id as 'owner' | 'clinic' | 'curious'); setFormStep(2); }}
                                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${userType === type.id ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                                                    <div className="font-bold text-slate-900">{type.label}</div>
                                                    <div className="text-sm text-slate-500">{type.desc}</div>
                                                </button>
                                            ))}

                                            {/* Quick Message Option - Skip directly to message form */}
                                            <div className="pt-4 mt-4 border-t border-slate-100">
                                                <p className="text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">or skip the questions</p>
                                                <button
                                                    type="button"
                                                    onClick={() => { setUserType(null); setFormStep(3); }}
                                                    className="w-full text-left p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-bold text-slate-700 group-hover:text-cyan-700">Send a message directly</div>
                                                            <div className="text-sm text-slate-500">Get personalized help without the questions</div>
                                                        </div>
                                                        <Send size={18} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                                                    </div>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                    {formStep === 2 && (
                                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <h3 className="text-xl font-bold text-slate-900 mb-4">A few details about your needs:</h3>
                                            {userType === 'owner' && (
                                                <div>
                                                    <label htmlFor="hc-serial" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Device Serial Number (Optional)</label>
                                                    <input id="hc-serial" type="text" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                                        name="serialNumber"
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all" placeholder="e.g. HY-2024-XXXX" />
                                                </div>
                                            )}
                                            {userType === 'clinic' && (
                                                <>
                                                    <div>
                                                        <label htmlFor="hc-clinic-name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Clinic Name</label>
                                                        <input id="hc-clinic-name" type="text" value={formData.clinicName} onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                                            name="clinicName"
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all" placeholder="Your Clinic Name" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="hc-patient-count" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Approx. Monthly Patients</label>
                                                        <select id="hc-patient-count" value={formData.patientCount} onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all">
                                                            <option value="">Select range</option>
                                                            <option value="0-50">0 - 50</option>
                                                            <option value="51-200">51 - 200</option>
                                                            <option value="200+">200+</option>
                                                        </select>
                                                    </div>
                                                </>
                                            )}
                                            {userType === 'curious' && (
                                                <div>
                                                    <label htmlFor="hc-interest" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">I'm most interested in...</label>
                                                    <select id="hc-interest" value={formData.interest} onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                                        name="interest"
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all">
                                                        <option value="">Select topic</option>
                                                        <option value="hbot">Hyperbaric Oxygen (HBOT)</option>
                                                        <option value="pemf">PEMF Therapy</option>
                                                        <option value="hydrogen">Molecular Hydrogen</option>
                                                        <option value="investment">Investment Opportunities</option>
                                                    </select>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                    {formStep === 3 && (
                                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <h3 className="text-xl font-bold text-slate-900 mb-4">How can we reach you?</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="hc-name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Name</label>
                                                    <input id="hc-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        name="name"
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all" placeholder="Your Name" />
                                                </div>
                                                <div>
                                                    <label htmlFor="hc-email" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
                                                    <input id="hc-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        name="email"
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all" placeholder="Email Address" />
                                                </div>
                                            </div>
                                            {/* Smart Message Input with Product/Protocol Browser */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Message</label>
                                                <SmartMessageInput
                                                    value={formData.message}
                                                    onChange={(value) => setFormData({ ...formData, message: value })}
                                                    placeholder="Tell us what you're looking for..."
                                                    isSubmitting={contactPending}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                                {formStep > 1 && (
                                    <button type="button" onClick={() => {
                                        // If on step 3 with no userType (quick message), go back to step 1
                                        if (formStep === 3 && userType === null) {
                                            setFormStep(1);
                                        } else {
                                            setFormStep(prev => prev - 1);
                                        }
                                    }}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2">
                                        <ChevronLeft size={18} /> Back
                                    </button>
                                )}
                                {formStep < 3 ? (
                                    formStep === 2 && (
                                        <button type="button" onClick={() => setFormStep(3)}
                                            className="ml-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                            Next <ChevronRight size={18} />
                                        </button>
                                    )
                                ) : (
                                    <>
                                        {submitError && <p role="alert" className="ml-auto text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{submitError}</p>}
                                        <button type="submit" disabled={contactPending}
                                            className="ml-auto w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                            {contactPending ? (
                                                <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Sending…</>
                                            ) : (<><Send size={18} /> Send Message</>)}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                    {[
                        { icon: Mail, label: "Email", value: siteEntity.contactEmail, href: `mailto:${siteEntity.contactEmail}` },
                        { icon: MapPin, label: "Coverage", value: siteEntity.supportCoverageLabel, href: "/help" },
                        { icon: Clock, label: "Hours", value: siteEntity.supportHours, href: `mailto:${siteEntity.contactEmail}` },
                    ].map((item) => (
                        <a key={item.label} href={item.href}
                            className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                <item.icon className="text-slate-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                                <p className="text-lg text-slate-900 font-medium">{item.value}</p>
                            </div>
                        </a>
                    ))}

                    {/* Callback Tool */}
                    <button onClick={() => setShowCallbackModal(true)}
                        className="w-full flex items-center gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all text-left group">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-600/60">Planned response window</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg text-slate-900 font-bold">Schedule a Callback</p>
                                <ChevronRight size={16} className="text-amber-500" />
                            </div>
                        </div>
                    </button>

                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
                        <MessageCircle className="mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Need help with the next step?</h3>
                        <p className="text-sm opacity-80 mb-4">For the fastest routing, send your question with product, order, or protocol context.</p>
                        <p className="text-xs opacity-60">Email {siteEntity.supportEmail} and our team will route it to the right workflow.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT TAB (Device Support)
// ─────────────────────────────────────────────────────────────────────────────

const SupportTab: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();

    const contactCards = [
        { icon: <MessageCircle size={24} />, title: 'Support triage', desc: 'Best first step for product, order, and protocol questions.', action: 'Open contact form', color: 'bg-cyan-500' },
        { icon: <Phone size={24} />, title: 'Callback planning', desc: 'Request a scheduled response window for a guided conversation.', action: 'Request callback', color: 'bg-emerald-500' },
        { icon: <Mail size={24} />, title: 'Email support', desc: 'Useful when you need to send detailed context or follow-up notes.', action: 'Send email', color: 'bg-slate-900' },
    ];

    const helpCategories = [
        { title: 'Protocol Setup', desc: 'Initial configuration & optimization guides', icon: BookOpen },
        { title: 'Technical Support', desc: 'Hardware diagnostics & maintenance', icon: Wrench },
        { title: 'Order Management', desc: 'Tracking, returns & modifications', icon: Shield },
        { title: 'Clinical Guidance', desc: 'Contraindications & safety protocols', icon: HelpCircle },
    ];

    const responseMetrics = [
        { label: 'Primary support path', value: 'Email-led', icon: Clock },
        { label: 'Coverage', value: siteEntity.supportCoverageLabel, icon: Users },
        { label: 'Issue routing', value: 'By question type', icon: Shield },
    ];

    return (
        <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
        >
            {/* Response Metrics */}
            <div className="grid grid-cols-3 gap-6 mb-12">
                {responseMetrics.map((metric, i) => (
                    <div key={metric.label} className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                        <metric.icon className="mx-auto mb-3 text-cyan-500" size={20} />
                        <div className="text-2xl font-bold text-slate-900 futuristic-font">{metric.value}</div>
                        <div className="text-xs text-slate-500">{metric.label}</div>
                    </div>
                ))}
            </div>

            <DeviceScanner />

            {/* Main Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {contactCards.map((card, i) => (
                    <div key={card.title} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${card.color} shadow-lg`}>
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Guided</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                        <p className="text-slate-500 text-sm mb-6">{card.desc}</p>
                        <button className="w-full py-3 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            {card.action}
                        </button>
                    </div>
                ))}
            </div>

            {/* Resource Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Self-Service Resources</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {helpCategories.map((cat) => (
                            <button key={cat.title} className="p-6 bg-white rounded-2xl border border-slate-100 text-left hover:border-cyan-500 transition-colors group">
                                <cat.icon className="text-cyan-500 mb-3" size={20} />
                                <h3 className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                                    {cat.title} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </h3>
                                <p className="text-xs text-slate-400">{cat.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clinic & Partner Support */}
                <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                    <h2 className="text-2xl font-bold mb-6">Clinic & Partner Support</h2>
                    <p className="text-slate-400 text-sm mb-8">
                        Operating a clinic, studio, or partner workflow? Use the same support channel for rollout planning, logistics coordination, and documentation requests.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <Phone className="text-cyan-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Response Path</p>
                                <p className="font-sans text-lg">Scheduled callback or email triage</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <Mail className="text-emerald-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Support Email</p>
                                <p className="font-sans text-sm underline cursor-pointer">{siteEntity.supportEmail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HelpCenterPage;
