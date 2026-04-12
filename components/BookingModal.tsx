import React, { useActionState, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, X, User, Check, ChevronLeft } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { submitBookingFormAction, type FormActionResult } from '../src/actions/formActions';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, productName }) => {
    const [step, setStep] = useState<'date' | 'time' | 'info'>('date');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [info, setInfo] = useState({ name: '', email: '', phone: '', notes: '' });
    const [submitted, setSubmitted] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingRef, setBookingRef] = useState<string | null>(null);
    const [bookingActionState, bookingFormAction, bookingPending] = useActionState<FormActionResult, FormData>(
        submitBookingFormAction,
        { success: false, message: '' }
    );

    const trapRef = useFocusTrap({
        active: isOpen,
        onDeactivate: onClose,
        escapeDeactivates: true,
        clickOutsideDeactivates: false,
    });

    const dates = Array.from({ length: 14 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index + 1);
        return date;
    });

    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    useEffect(() => {
        if (bookingActionState.success) {
            setBookingRef(bookingActionState.bookingRef ?? null);
            setSubmitted(true);
            setBookingError(null);
            return;
        }

        if (bookingActionState.message) {
            setBookingError(bookingActionState.message);
        }
    }, [bookingActionState]);

    const resetAndClose = () => {
        setStep('date');
        setSelectedDate(null);
        setSelectedTime(null);
        setSubmitted(false);
        setBookingError(null);
        setBookingRef(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={resetAndClose}
                    />
                    <motion.div
                        ref={trapRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="booking-modal-title"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl z-50 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        {submitted ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="text-white" size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Consultation request received</h2>
                                <p className="text-slate-600 mb-2">
                                    Requested slot: {selectedDate} at {selectedTime}
                                </p>
                                {bookingRef && (
                                    <p className="text-xs font-mono bg-slate-100 text-slate-500 px-3 py-1 rounded-lg inline-block mb-2">
                                        Ref: {bookingRef}
                                    </p>
                                )}
                                <p className="text-sm text-slate-400 mb-6">
                                    {bookingActionState.message || `We will review the request and reply to ${info.email}.`}
                                </p>
                                <button onClick={resetAndClose} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h2 id="booking-modal-title" className="text-xl font-bold text-slate-900">Book a Consultation</h2>
                                        {productName && <p className="text-sm text-slate-500">{productName}</p>}
                                    </div>
                                    <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600" aria-label="Close booking dialog">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {step === 'date' && (
                                        <div>
                                            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                                                <Calendar size={18} /> Select Date
                                            </h3>
                                            <div className="grid grid-cols-4 gap-2">
                                                {dates.map((date) => {
                                                    const dateLabel = date.toLocaleDateString('en-GB', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short',
                                                    });
                                                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                                    return (
                                                        <button
                                                            key={dateLabel}
                                                            disabled={isWeekend}
                                                            onClick={() => {
                                                                setSelectedDate(dateLabel);
                                                                setStep('time');
                                                            }}
                                                            className={`p-3 rounded-lg text-center text-sm ui-transition-colors ${
                                                                isWeekend
                                                                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                                                    : selectedDate === dateLabel
                                                                        ? 'bg-cyan-500 text-white'
                                                                        : 'bg-slate-100 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            <div className="font-medium">{date.getDate()}</div>
                                                            <div className="text-xs opacity-70">{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {step === 'time' && (
                                        <div>
                                            <button onClick={() => setStep('date')} className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                                                <ChevronLeft size={16} /> Back
                                            </button>
                                            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                                                <Clock size={18} /> Select Time
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-4">{selectedDate}</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {timeSlots.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => {
                                                            setSelectedTime(time);
                                                            setStep('info');
                                                        }}
                                                        className={`p-3 rounded-lg text-center font-medium ui-transition-colors ${
                                                            selectedTime === time ? 'bg-cyan-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {step === 'info' && (
                                        <form action={bookingFormAction}>
                                            <button type="button" onClick={() => setStep('time')} className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                                                <ChevronLeft size={16} /> Back
                                            </button>
                                            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                                                <User size={18} /> Your Details
                                            </h3>
                                            <input type="hidden" name="preferredDate" value={selectedDate ?? ''} />
                                            <input type="hidden" name="preferredTime" value={selectedTime ?? ''} />
                                            <input type="hidden" name="bookingType" value="consultation" />
                                            <div className="space-y-3">
                                                <input
                                                    aria-label="Full Name"
                                                    name="name"
                                                    placeholder="Full Name"
                                                    value={info.name}
                                                    onChange={(event) => setInfo({ ...info, name: event.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                                    required
                                                />
                                                <input
                                                    aria-label="Email"
                                                    name="email"
                                                    placeholder="Email"
                                                    type="email"
                                                    value={info.email}
                                                    onChange={(event) => setInfo({ ...info, email: event.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                                    required
                                                />
                                                <input
                                                    aria-label="Phone"
                                                    name="phone"
                                                    placeholder="Phone"
                                                    value={info.phone}
                                                    onChange={(event) => setInfo({ ...info, phone: event.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                                />
                                                <textarea
                                                    aria-label="Notes (optional)"
                                                    name="notes"
                                                    placeholder="Notes (optional)"
                                                    value={info.notes}
                                                    onChange={(event) => setInfo({ ...info, notes: event.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none h-24 resize-none"
                                                />
                                            </div>
                                            {bookingError && (
                                                <p role="alert" className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                                                    {bookingError}
                                                </p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={!info.name || !info.email || bookingPending}
                                                className="w-full mt-4 py-4 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {bookingPending ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : 'Send Request'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export const BookDemoButton: React.FC<{ productName?: string; className?: string }> = ({ productName, className = '' }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-6 py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white ui-transition-colors ${className}`}
            >
                <Calendar size={18} /> Book a Demo
            </button>
            <BookingModal isOpen={showModal} onClose={() => setShowModal(false)} productName={productName} />
        </>
    );
};
