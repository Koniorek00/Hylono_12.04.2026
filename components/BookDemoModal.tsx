import React, { useActionState, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, CheckCircle, Calendar, Phone, Mail, User, ChevronDown, Clock, AlertTriangle } from 'lucide-react';
import { submitBookingFormAction, type FormActionResult } from '../src/actions/formActions';

export interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = 'call' | 'demo';

interface BookingFormValues {
  name: string;
  email: string;
  phone: string;
  interest: string;
  date: string;
}

const EMPTY: BookingFormValues = { name: '', email: '', phone: '', interest: '', date: '' };

const INTERESTS = [
  { value: '', label: 'Select your primary interest...' },
  { value: 'hbot', label: 'HBOT - Hyperbaric Oxygen Therapy' },
  { value: 'pemf', label: 'PEMF - Pulsed Electromagnetic Field' },
  { value: 'rlt', label: 'Red Light Therapy' },
  { value: 'h2', label: 'Molecular Hydrogen' },
  { value: 'full', label: 'Full Regeneration Stack' },
];

const TAB_COPY = {
  call: {
    headline: 'Book a Free Consultation',
    sub: 'Speak with a bio-optimization specialist who will help you choose the right next step.',
    cta: 'Send Consultation Request',
  },
  demo: {
    headline: 'Request a Live Demo',
    sub: 'Ask for a guided walkthrough with the Hylono team before you commit.',
    cta: 'Send Demo Request',
  },
} as const;

const inputClassName =
  'w-full py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 ui-transition-colors';

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<TabId>('call');
  const [form, setForm] = useState<BookingFormValues>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const copy = TAB_COPY[tab];
  const [bookingActionState, bookingFormAction, bookingPending] = useActionState<FormActionResult, FormData>(
    submitBookingFormAction,
    { success: false, message: '' }
  );

  useEffect(() => {
    if (bookingActionState.success) {
      setSubmitted(true);
      setBookError(null);
      return;
    }

    if (bookingActionState.message) {
      setBookError(bookingActionState.message);
    }
  }, [bookingActionState]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm(EMPTY);
      setBookError(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bd-bg"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="bd-panel"
              role="dialog"
              aria-modal="true"
              aria-label={copy.headline}
              initial={reduced ? false : { opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30"
            >
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-8 pt-8 pb-6">
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-400 mb-1">Hylono free session</p>
                <h2 className="text-2xl font-bold text-white futuristic-font">{copy.headline}</h2>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{copy.sub}</p>
                <div className="flex gap-1 p-1 bg-white/10 rounded-xl mt-5">
                  {(['call', 'demo'] as TabId[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setTab(option);
                        setSubmitted(false);
                        setBookError(null);
                      }}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg ui-transition-colors ${
                        tab === option ? 'bg-white text-slate-900 shadow-sm' : 'text-white/60 hover:text-white/90'
                      }`}
                    >
                      {option === 'call' ? 'Book a Call' : 'Book a Demo'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-8 py-7">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center text-center py-6"
                    >
                      <motion.div
                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5"
                        animate={reduced ? {} : { scale: [1, 1.1, 1], boxShadow: ['0 0 0 0px rgba(16,185,129,0)', '0 0 0 18px rgba(16,185,129,0.15)', '0 0 0 0px rgba(16,185,129,0)'] }}
                        transition={{ duration: 1.2, repeat: 2 }}
                      >
                        <CheckCircle className="text-emerald-500" size={40} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 futuristic-font">Request received</h3>
                      <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                        {bookingActionState.message || `We will review your ${tab === 'call' ? 'consultation' : 'demo'} request and follow up by email.`}
                      </p>
                      <div className="mt-5 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-xs text-slate-500">
                        <Clock size={13} />
                        <span>Preferred date: {form.date || 'Not provided'}</span>
                      </div>
                      <button onClick={handleClose} className="mt-6 px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors">
                        Done
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={`${tab}-form`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      action={bookingFormAction}
                      className="space-y-4"
                    >
                      <input type="hidden" name="type" value={tab} />
                      <input type="hidden" name="bookingType" value={tab === 'call' ? 'consultation' : 'demo'} />
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Full name" className={`${inputClassName} pl-10 pr-4`} />
                      </div>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Email address" className={`${inputClassName} pl-10 pr-4`} />
                      </div>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" className={`${inputClassName} pl-10 pr-4`} />
                      </div>
                      <div className="relative">
                        <select name="interest" value={form.interest} onChange={handleChange} required className={`${inputClassName} px-4 appearance-none`}>
                          {INTERESTS.map((option) => (
                            <option key={option.value} value={option.value} disabled={!option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          aria-label="Preferred date"
                          className={`${inputClassName} pl-10 pr-4`}
                        />
                      </div>
                      <button type="submit" disabled={bookingPending} className="w-full py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl uppercase tracking-widest hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed ui-transition-colors flex items-center justify-center gap-2 mt-2">
                        {bookingPending ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : copy.cta}
                      </button>
                      {bookError && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed" role="alert">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-500" />
                          <span>{bookError}</span>
                        </div>
                      )}
                      <p className="text-center text-xs text-slate-400">No commitment required. Free of charge.</p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
