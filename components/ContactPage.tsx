import React, { useActionState, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, AlertTriangle, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { getCSRFToken, validateCSRFToken } from '../utils/csrf';
import { submitContactFormAction, type FormActionResult } from '../src/actions/formActions';

export const ContactPage: React.FC = () => {
    const [formStep, setFormStep] = useState(1);
    const [userType, setUserType] = useState<'owner' | 'clinic' | 'curious' | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        // Dynamic fields
        serialNumber: '',
        clinicName: '',
        patientCount: '',
        interest: '',
        // CSRF token
        csrfToken: ''
    });
    const [csrfTokenError, setCsrfTokenError] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [showCallbackModal, setShowCallbackModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [_selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [contactActionState, contactFormAction, contactPending] = useActionState<FormActionResult, FormData>(
        submitContactFormAction,
        { success: false, message: '' }
    );
    
    // Initialize CSRF token
    React.useEffect(() => {
        const token = getCSRFToken();
        setFormData(prev => ({ ...prev, csrfToken: token }));
    }, []);

    // Emergency keywords check
    React.useEffect(() => {
        const keywords = ['pain', 'heart', 'emergency', 'stroke', 'bleeding', 'unconscious', 'chest'];
        const messageLower = formData.message.toLowerCase();
        const hasEmergency = keywords.some(keyword => messageLower.includes(keyword));

        if (hasEmergency) {
            setShowEmergencyModal(true);
        }
    }, [formData.message]);

    const handleNextStep = () => {
        setFormStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setFormStep(prev => prev - 1);
    };

    React.useEffect(() => {
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
        // CSRF token validation
        const storedToken = getCSRFToken();
        const submittedToken = formData.csrfToken;

        if (!validateCSRFToken(submittedToken, storedToken)) {
            setCsrfTokenError(true);
            e.preventDefault();
            return;
        }

        setCsrfTokenError(false);
        setSubmitError(null);
    };

    const handleCallbackSchedule = (slot: string) => {
        if (!selectedDate) return;

        setSelectedSlot(slot);
        const dateStr = selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

        setTimeout(() => {
            setShowCallbackModal(false);
            setSelectedDate(null);
            // TODO: connect to /api/callback endpoint when implemented
            window.alert(`Callback scheduled for ${dateStr} at ${slot}`);
        }, 500);
    };

    const getNextBusinessDays = (count: number) => {
        const days = [];
        const current = new Date();
        while (days.length < count) {
            current.setDate(current.getDate() + 1);
            if (current.getDay() !== 0 && current.getDay() !== 6) {
                days.push(new Date(current));
            }
        }
        return days;
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-24 relative overflow-hidden">
            {/* Emergency Modal */}
            <AnimatePresence>
                {showEmergencyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                        onClick={() => setShowEmergencyModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-l-4 border-red-500"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 text-red-600 mb-4">
                                <AlertTriangle size={32} />
                                <h3 className="text-xl font-bold">Medical Emergency Warning</h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                It looks like you might be describing a medical emergency.
                                Hylono products and support are <strong>not</strong> for emergency medical use.
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="tel:112" // EU Emergency
                                    className="block w-full py-3 bg-red-600 text-white text-center rounded-xl font-bold hover:bg-red-700 transition"
                                >
                                    Call Emergency Services (112)
                                </a>
                                <button
                                    onClick={() => setShowEmergencyModal(false)}
                                    className="block w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition"
                                >
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setShowCallbackModal(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Schedule a Callback</h3>
                                    <p className="text-slate-500">Pick a 15-minute slot that works for you.</p>
                                </div>
                                <div className="p-3 bg-cyan-50 rounded-full text-cyan-600">
                                    <Calendar size={24} />
                                </div>
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
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className="text-sm text-cyan-600 font-bold mb-4 flex items-center gap-1 hover:underline"
                                    >
                                        <ChevronLeft size={14} /> Back to available dates
                                    </button>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">
                                        Select Time for {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {['09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM', '01:00 PM', '02:30 PM', '03:45 PM', '04:15 PM'].map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => handleCallbackSchedule(slot)}
                                                className="py-3 px-4 rounded-xl border border-slate-200 text-sm font-medium hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 transition-all text-slate-600"
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <button
                                onClick={() => setShowCallbackModal(false)}
                                className="w-full py-3 text-slate-400 font-medium hover:text-slate-600 transition"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto px-6">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-slate-500">We're here to help with your regeneration journey</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Wizard Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
                    >
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="text-emerald-600" size={28} />
                                </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                {ticketId && (
                                    <p className="text-xs font-mono bg-slate-100 text-slate-500 px-3 py-1 rounded-lg inline-block mb-2">
                                        Ticket: {ticketId}
                                    </p>
                                )}
                                <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form action={contactFormAction} onSubmit={handleSubmitValidation} className="h-full flex flex-col justify-between min-h-[400px]">
                                {/* CSRF Token - Hidden Field */}
                                <input type="hidden" name="csrfToken" value={formData.csrfToken} />
                                <input type="hidden" name="userType" value={userType ?? ''} />
                                <input type="hidden" name="subject" value={formData.subject || `Contact from ${userType ?? 'website'}`} />
                                <input type="hidden" name="message" value={formData.message} />
                                <input type="hidden" name="serialNumber" value={formData.serialNumber} />
                                <input type="hidden" name="clinicName" value={formData.clinicName} />
                                <input type="hidden" name="interest" value={formData.interest} />
                                
                                {csrfTokenError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">Security validation failed. Please refresh the page and try again.</p>
                                    </div>
                                )}
                                <div className="flex gap-2 mb-8">
                                    {[1, 2, 3].map(step => (
                                        <div
                                            key={step}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${step <= formStep ? 'bg-cyan-500' : 'bg-slate-100'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex-grow">
                                    <AnimatePresence mode="wait">
                                        {formStep === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-4"
                                            >
                                                <h3 className="text-xl font-bold text-slate-900 mb-6">First, tell us who you are:</h3>
                                                {[
                                                    { id: 'owner', label: 'I am a Device Owner', desc: 'Support for my Hylono device' },
                                                    { id: 'clinic', label: 'I represent a Clinic', desc: 'Commercial inquiries & partnerships' },
                                                    { id: 'curious', label: 'I am curious', desc: 'Questions about products & science' }
                                                ].map((type) => (
                                                    <button
                                                        key={type.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setUserType(type.id as 'owner' | 'clinic' | 'curious');
                                                            handleNextStep();
                                                        }}
                                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${userType === type.id ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                                                    >
                                                        <div className="font-bold text-slate-900">{type.label}</div>
                                                        <div className="text-sm text-slate-500">{type.desc}</div>
                                                    </button>
                                                ))}

                                                {/* Quick Message Option */}
                                                <div className="pt-4 mt-4 border-t border-slate-100">
                                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">or skip the questions</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUserType(null);
                                                            setFormStep(3); // Skip directly to message form
                                                        }}
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
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-xl font-bold text-slate-900 mb-4">A few details about your needs:</h3>

                                                {userType === 'owner' && (
                                                    <div>
                                                        <label htmlFor="contact-serial" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Device Serial Number (Optional)</label>
                                                        <input
                                                            id="contact-serial"
                                                            type="text"
                                                            value={formData.serialNumber}
                                                                name="serialNumber"
                                                            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                            placeholder="e.g. HY-2024-XXXX"
                                                        />
                                                    </div>
                                                )}

                                                {userType === 'clinic' && (
                                                    <>
                                                        <div>
                                                            <label htmlFor="contact-clinic-name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Clinic Name</label>
                                                            <input
                                                                id="contact-clinic-name"
                                                                type="text"
                                                                value={formData.clinicName}
                                                                name="clinicName"
                                                                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                                placeholder="Your Clinic Name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="contact-patient-count" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Approx. Monthly Patients</label>
                                                            <select
                                                                id="contact-patient-count"
                                                                value={formData.patientCount}
                                                                onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })}
                                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                            >
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
                                                        <label htmlFor="contact-interest" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">I'm most interested in...</label>
                                                        <select
                                                            id="contact-interest"
                                                            value={formData.interest}
                                                            name="interest"
                                                            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                        >
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
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-4"
                                            >
                                                <h3 className="text-xl font-bold text-slate-900 mb-4">How can we reach you?</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Name</label>
                                                        <input
                                                            id="contact-name"
                                                            type="text"
                                                            name="name"
                                                            required
                                                            aria-required="true"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                            placeholder="Your Name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
                                                        <input
                                                            id="contact-email"
                                                            type="email"
                                                            name="email"
                                                            required
                                                            aria-required="true"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                            placeholder="Email Address"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Message</label>
                                                    <textarea
                                                        id="contact-message"
                                                        required
                                                        aria-required="true"
                                                        value={formData.message}
                                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                        rows={4}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                                                        placeholder="Tell us more..."
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                                    {formStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2"
                                        >
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                    )}

                                    {formStep < 3 ? (
                                        (formStep === 2) && (
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="ml-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                                            >
                                                Next <ChevronRight size={18} />
                                            </button>
                                        )
                                    ) : (
                                    <>
                                            {submitError && (
                                                <p className="ml-auto text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                                                    {submitError}
                                                </p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={contactPending}
                                                className="ml-auto w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {contactPending ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                        </svg>
                                                        Sending…
                                                    </>
                                                ) : (
                                                    <><Send size={18} /> Send Message</>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        )}
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {[
                            { icon: Mail, label: "Email", value: "contact@hylono.com", href: "mailto:contact@hylono.com" },
                            { icon: MapPin, label: "Location", value: "Warsaw, Poland", href: "https://maps.google.com/?q=Warsaw+Poland" },
                            { icon: Clock, label: "Hours", value: "Mon-Fri: 9:00 - 18:00 CET", href: "mailto:contact@hylono.com" },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-lg transition-all"
                            >
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
                        <button
                            onClick={() => setShowCallbackModal(true)}
                            className="w-full flex items-center gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all text-left group"
                        >
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-600/60">No Waiting On Hold</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg text-slate-900 font-bold">Schedule a Callback</p>
                                    <ChevronRight size={16} className="text-amber-500" />
                                </div>
                            </div>
                        </button>

                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
                            <MessageCircle className="mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                            <p className="text-sm opacity-80 mb-4">Our support team is available Mon-Fri, 9am-6pm CET to answer your questions.</p>
                            <p className="text-xs opacity-60">Email us at support@hylono.com or call +48 123 456 789</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

