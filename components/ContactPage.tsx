import Link from 'next/link';
import React, { useActionState, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { getCSRFToken, validateCSRFToken } from '../utils/csrf';
import {
  createCallbackRequestNote,
  upsertCallbackRequestNote,
} from '@/lib/callback-request';
import type { ContactIntentChoice, ContactPrefill } from '@/lib/contact-prefill';
import { submitContactFormAction, type FormActionResult } from '../src/actions/formActions';

type ContactIntent = ContactIntentChoice | null;

const CONTACT_INTENTS: Array<{
  id: Exclude<ContactIntent, null>;
  label: string;
  description: string;
  subject: string;
}> = [
  {
    id: 'curious',
    label: 'Product guidance',
    description: 'Compare systems, protocols, and what fits your goals.',
    subject: 'Product guidance request',
  },
  {
    id: 'rental',
    label: 'Rental planning',
    description: 'Ask about monthly plans, delivery, and try-before-you-buy options.',
    subject: 'Rental planning request',
  },
  {
    id: 'owner',
    label: 'Existing device support',
    description: 'Route operational questions or after-purchase support quickly.',
    subject: 'Device support request',
  },
  {
    id: 'clinic',
    label: 'Clinic / B2B',
    description: 'Discuss commercial use, rollout planning, and quote requests.',
    subject: 'Clinic / B2B inquiry',
  },
];

const MESSAGE_PLACEHOLDERS: Record<Exclude<ContactIntent, null>, string> = {
  curious:
    'Tell us what you are comparing, what goal you are working toward, or which system feels unclear.',
  rental:
    'Tell us which technology you are considering, the space you have available, and whether you want monthly pricing or a consultation.',
  owner: 'Tell us which device you own, what is happening, and what kind of help you need.',
  clinic: 'Tell us about your facility, use case, and what you need to evaluate next.',
};

const TOPIC_OPTIONS = [
  { value: 'hbot', label: 'Hyperbaric oxygen (HBOT)' },
  { value: 'hydrogen', label: 'Hydrogen systems' },
  { value: 'pemf', label: 'PEMF / VNS' },
  { value: 'rlt', label: 'Red light / PBM' },
  { value: 'delivery', label: 'Delivery, space, or installation planning' },
];

interface ContactPageProps {
  prefill?: ContactPrefill;
}

export const ContactPage: React.FC<ContactPageProps> = ({ prefill }) => {
  const [userType, setUserType] = useState<ContactIntent>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: '',
    serialNumber: '',
    clinicName: '',
    interest: '',
    csrfToken: '',
  });
  const [csrfTokenError, setCsrfTokenError] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [_selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [callbackNotice, setCallbackNotice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [contactActionState, contactFormAction, contactPending] = useActionState<
    FormActionResult,
    FormData
  >(submitContactFormAction, { success: false, message: '' });

  React.useEffect(() => {
    const token = getCSRFToken();
    setFormData((prev) => ({ ...prev, csrfToken: token }));
  }, []);

  React.useEffect(() => {
    const keywords = ['pain', 'heart', 'emergency', 'stroke', 'bleeding', 'unconscious', 'chest'];
    const messageLower = formData.message.toLowerCase();
    const hasEmergency = keywords.some((keyword) => messageLower.includes(keyword));

    if (hasEmergency) {
      setShowEmergencyModal(true);
    }
  }, [formData.message]);

  React.useEffect(() => {
    if (contactActionState.success) {
      setTicketId(contactActionState.ticketId ?? null);
      setSubmitted(true);
      setSubmitError(null);
      setCallbackNotice(null);
      return;
    }

    if (contactActionState.message) {
      setSubmitError(contactActionState.message);
    }
  }, [contactActionState]);

  React.useEffect(() => {
    if (!prefill) {
      return;
    }

    const nextIntent = prefill.intent ?? null;
    const fallbackSubject =
      nextIntent && CONTACT_INTENTS.find((item) => item.id === nextIntent)?.subject;

    setUserType((prev) => prev ?? nextIntent);
    setFormData((prev) => ({
      ...prev,
      subject: prev.subject || prefill.subject || fallbackSubject || '',
      message: prev.message || prefill.message || '',
      interest: prev.interest || prefill.interest || '',
      clinicName: prev.clinicName || prefill.clinicName || '',
    }));
  }, [prefill]);

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

  const handleIntentSelect = (intent: Exclude<ContactIntent, null>) => {
    const nextSubject = CONTACT_INTENTS.find((item) => item.id === intent)?.subject ?? '';

    setUserType(intent);
    setFormData((prev) => ({
      ...prev,
      subject: nextSubject,
      serialNumber: intent === 'owner' ? prev.serialNumber : '',
      clinicName: intent === 'clinic' ? prev.clinicName : '',
      interest: intent === 'curious' || intent === 'rental' ? prev.interest : '',
    }));
  };

  const formatCallbackDateLabel = (date: Date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

  const handleCallbackSchedule = (slot: string) => {
    if (!selectedDate) return;

    setSelectedSlot(slot);
    const callbackRequestNote = createCallbackRequestNote(
      formatCallbackDateLabel(selectedDate),
      slot
    );

    setFormData((prev) => ({
      ...prev,
      subject: prev.subject || 'Callback request',
      message: upsertCallbackRequestNote(prev.message, callbackRequestNote),
    }));
    setShowCallbackModal(false);
    setSelectedDate(null);
    setSubmitError(null);
    setCallbackNotice(
      'Preferred callback slot added to your message. Send the request below to confirm it with the Hylono team.'
    );
  };

  const getNextBusinessDays = (count: number) => {
    const days: Date[] = [];
    const current = new Date();

    while (days.length < count) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        days.push(new Date(current));
      }
    }

    return days;
  };

  const messagePlaceholder = userType
    ? MESSAGE_PLACEHOLDERS[userType]
    : 'Tell us what you need help with, which technology you are considering, or what next step feels unclear.';

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 pb-24 pt-10">
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
            onClick={() => setShowEmergencyModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="emergency-modal-title"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border-l-4 border-red-500 bg-white p-8 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-4 text-red-600">
                <AlertTriangle size={32} aria-hidden="true" />
                <h3 id="emergency-modal-title" className="text-xl font-bold">
                  Medical Emergency Warning
                </h3>
              </div>
              <p className="mb-6 text-slate-600">
                It looks like you might be describing a medical emergency. Hylono products and
                support are <strong>not</strong> for emergency medical use.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:112"
                  className="block w-full rounded-xl bg-red-600 py-3 text-center font-bold text-white transition hover:bg-red-700"
                >
                  Call Emergency Services (112)
                </a>
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="block w-full py-3 font-medium text-slate-500 transition hover:text-slate-800"
                >
                  I understand, continue writing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCallbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={() => setShowCallbackModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="callback-modal-title"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 id="callback-modal-title" className="text-2xl font-bold text-slate-900">
                    Schedule a Callback
                  </h3>
                  <p className="text-slate-500">Pick a 15-minute slot that works for you.</p>
                </div>
                <div className="rounded-full bg-cyan-50 p-3 text-cyan-600">
                  <Calendar size={24} />
                </div>
              </div>

              {!selectedDate ? (
                <div className="space-y-4">
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                    Select a Date
                  </h4>
                  <div className="grid gap-2">
                    {getNextBusinessDays(5).map((date) => {
                      const dateLabel = formatCallbackDateLabel(date);

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className="group w-full rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-cyan-500 hover:bg-cyan-50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 transition-colors group-hover:text-cyan-700">
                              {dateLabel}
                            </span>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-cyan-500" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="mb-4 flex items-center gap-1 text-sm font-bold text-cyan-600 hover:underline"
                  >
                    <ChevronLeft size={14} /> Back to available dates
                  </button>
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                    Select Time for{' '}
                    {selectedDate.toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h4>
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    {['09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM', '01:00 PM', '02:30 PM', '03:45 PM', '04:15 PM'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleCallbackSchedule(slot)}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                type="button"
                onClick={() => setShowCallbackModal(false)}
                className="w-full py-3 font-medium text-slate-400 transition hover:text-slate-600"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-700">
            Support, Rentals, And Product Guidance
          </span>
          <h1 id="contact-hero-headline" className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Get the right answer without the back-and-forth
          </h1>
          <p id="contact-hero-description" className="mt-4 text-lg text-slate-500">
            Choose the topic, send one message, or book a callback. Hylono routes rental planning,
            product questions, clinic requests, and owner support from one place.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
              Mon-Fri 9:00 - 18:00 CET
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
              Warsaw-based support
            </span>
            <button
              type="button"
              onClick={() => setShowCallbackModal(true)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-slate-900"
            >
              Schedule a callback
            </button>
          </div>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
          >
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Send className="text-emerald-600" size={28} />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Message Sent</h2>
                {ticketId && (
                  <p className="mb-2 inline-block rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs text-slate-500">
                    Ticket: {ticketId}
                  </p>
                )}
                <p className="mx-auto max-w-md text-slate-500">
                  Your request is in the queue. If you need a faster handoff, you can still book a
                  callback or continue comparing products while the team reviews your message.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/store"
                    prefetch={false}
                    className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Compare systems
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowCallbackModal(true)}
                    className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Schedule a callback
                  </button>
                </div>
              </div>
            ) : (
              <form action={contactFormAction} onSubmit={handleSubmitValidation} className="space-y-6">
                <input type="hidden" name="csrfToken" value={formData.csrfToken} />
                <input type="hidden" name="userType" value={userType ?? ''} />
                <input
                  type="hidden"
                  name="subject"
                  value={formData.subject || 'Website contact request'}
                />

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Send your request</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Required: name, email, and message. Everything else is optional and only helps
                    us route your request faster.
                  </p>
                </div>

                {csrfTokenError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-600">
                      Security validation failed. Refresh the page and try again.
                    </p>
                  </div>
                )}

                {callbackNotice && (
                  <div
                    role="status"
                    className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900"
                  >
                    {callbackNotice}
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Choose a route
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {CONTACT_INTENTS.map((intent) => (
                      <button
                        key={intent.id}
                        type="button"
                        onClick={() => handleIntentSelect(intent.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          userType === intent.id
                            ? 'border-cyan-500 bg-white shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{intent.label}</div>
                        <p className="mt-1 text-sm text-slate-500">{intent.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      aria-required="true"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      aria-required="true"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, email: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {userType === 'owner' && (
                  <div>
                    <label
                      htmlFor="contact-serial"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
                    >
                      Device serial number (optional)
                    </label>
                    <input
                      id="contact-serial"
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, serialNumber: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="For example HY-2024-XXXX"
                    />
                  </div>
                )}

                {userType === 'clinic' && (
                  <div>
                    <label
                      htmlFor="contact-clinic-name"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
                    >
                      Clinic or company name (optional)
                    </label>
                    <input
                      id="contact-clinic-name"
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, clinicName: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Your clinic or company"
                    />
                  </div>
                )}

                {(userType === 'curious' || userType === 'rental') && (
                  <div>
                    <label
                      htmlFor="contact-interest"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
                    >
                      Main topic (optional)
                    </label>
                    <select
                      id="contact-interest"
                      name="interest"
                      value={formData.interest}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, interest: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <option value="">Select a topic</option>
                      {TOPIC_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    aria-required="true"
                    value={formData.message}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, message: event.target.value }))
                    }
                    rows={6}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder={messagePlaceholder}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Choose a route if you want the reply tailored to support, rental, or commercial planning.
                  </p>
                  <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setShowCallbackModal(true)}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Schedule a callback
                    </button>
                    <button
                      type="submit"
                      disabled={contactPending}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {contactPending ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Send my request
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {submitError}
                  </p>
                )}
              </form>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Direct contact</h2>
              <div className="mt-5 space-y-4">
                <a
                  href="mailto:contact@hylono.com"
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                    <Mail className="text-slate-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</p>
                    <p className="text-base font-medium text-slate-900">contact@hylono.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                    <Clock className="text-slate-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Hours</p>
                    <p className="text-base font-medium text-slate-900">Mon-Fri: 9:00 - 18:00 CET</p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Warsaw+Poland"
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                    <MapPin className="text-slate-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Location</p>
                    <p className="text-base font-medium text-slate-900">Warsaw, Poland</p>
                  </div>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCallbackModal(true)}
              className="group flex w-full items-center gap-4 rounded-3xl border border-amber-100 bg-amber-50 p-6 text-left transition-all hover:border-amber-300 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-transform group-hover:scale-110">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600/70">
                  Callback option
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-slate-900">Book a 15-minute call</p>
                  <ChevronRight size={16} className="text-amber-500" />
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Use this when you want a faster conversation about fit, delivery, or quote planning.
                </p>
              </div>
            </button>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-cyan-600" size={20} />
                <h2 className="text-lg font-bold text-slate-900">What happens next</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>1. Your message is routed by topic so support, rentals, and clinic requests do not mix together.</p>
                <p>2. The team replies with the next practical step, whether that is a product link, a policy page, or a callback.</p>
                <p>3. You can keep comparing on-site while the request is being reviewed.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white">
              <MessageCircle className="mb-4" size={30} />
              <h2 className="text-xl font-bold">Prefer a faster route?</h2>
              <p className="mt-2 text-sm text-white/80">
                If you already know what you need, jump straight into the most relevant path.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/rental"
                  className="inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-900"
                >
                  Rental hub
                </Link>
                <Link
                  href="/store"
                  className="inline-flex min-h-11 items-center rounded-xl border border-white/30 px-4 text-sm font-semibold text-white"
                >
                  Compare systems
                </Link>
                <Link
                  href="/help"
                  className="inline-flex min-h-11 items-center rounded-xl border border-white/30 px-4 text-sm font-semibold text-white"
                >
                  Help center
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};
