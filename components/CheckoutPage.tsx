import React, { useActionState, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Truck, CreditCard, Check, ChevronRight, Lock, MapPin, Shield } from 'lucide-react';
import { useCart } from './Cart';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { checkoutContent } from '../content/checkout';
import { submitCheckoutFormAction, type FormActionResult } from '../src/actions/formActions';

type Step = 'shipping' | 'payment' | 'confirm';

export const CheckoutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { items, total, clearCart } = useCart();
    const [step, setStep] = useState<Step>('shipping');
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderOutcomeMessage, setOrderOutcomeMessage] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [intendedUseAttestation, setIntendedUseAttestation] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank_transfer' | 'financing'>('bank_transfer');

    const checkoutTrustEnabled = useFeatureFlag('feature_checkout_trust');

    const [shipping, setShipping] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Poland',
    });

    const isShippingValid =
        shipping.firstName.trim().length > 0 &&
        shipping.lastName.trim().length > 0 &&
        shipping.email.trim().includes('@') &&
        shipping.address.trim().length > 0 &&
        shipping.city.trim().length > 0 &&
        shipping.postalCode.trim().length > 0 &&
        shipping.country.trim().length > 0;

    const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
        { key: 'shipping', label: checkoutContent.steps.shipping, icon: <Truck size={18} /> },
        { key: 'payment', label: checkoutContent.steps.payment, icon: <CreditCard size={18} /> },
        { key: 'confirm', label: checkoutContent.steps.confirm, icon: <Check size={18} /> },
    ];

    const [checkoutActionState, checkoutFormAction, checkoutPending] = useActionState<FormActionResult, FormData>(
        submitCheckoutFormAction,
        { success: false, message: '' }
    );

    useEffect(() => {
        if (checkoutActionState.success) {
            setOrderId(checkoutActionState.orderId ?? null);
            setOrderOutcomeMessage(
                checkoutActionState.message || `Order ${checkoutActionState.orderId ?? ''} received.`
            );
            try {
                if (checkoutActionState.orderId) {
                    sessionStorage.setItem('hylono_last_order_ref', checkoutActionState.orderId);
                }
            } catch {
                // no-op
            }
            clearCart();
            setOrderComplete(true);
            setSubmitError(null);
            return;
        }

        if (checkoutActionState.message) {
            setSubmitError(checkoutActionState.message);
        }
    }, [checkoutActionState, clearCart]);

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-24">
                <div className="max-w-lg mx-auto px-6 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <Check className="text-white" size={48} />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">{checkoutContent.success.title}</h1>
                    <p className="text-slate-600 mb-8">
                        {orderOutcomeMessage || `${checkoutContent.success.messagePrefix} ${shipping.email}`}
                    </p>
                    {orderId && <p className="text-sm text-slate-400 mb-8">{checkoutContent.success.orderPrefix} {orderId}</p>}
                    <button
                        onClick={() => onNavigate('account')}
                        className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold"
                    >
                        {checkoutContent.success.cta}
                    </button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-24">
                <div className="max-w-lg mx-auto px-6 text-center">
                    <ShoppingBag className="mx-auto text-slate-300 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">{checkoutContent.meta.emptyCartTitle}</h1>
                    <button
                        onClick={() => onNavigate('store')}
                        className="text-cyan-600 font-medium min-h-11 px-4"
                        aria-label="Continue shopping to checkout"
                    >
                        {checkoutContent.meta.continueShopping}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{checkoutContent.meta.title}</h1>

                <div className="flex items-center justify-center mb-12">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.key}>
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                    step === s.key
                                        ? 'bg-slate-900 text-white'
                                        : steps.findIndex((x) => x.key === step) > i
                                          ? 'bg-emerald-500 text-white'
                                          : 'bg-slate-200 text-slate-500'
                                }`}
                            >
                                {s.icon}
                                <span className="text-sm font-medium">{s.label}</span>
                            </div>
                            {i < steps.length - 1 && <ChevronRight className="mx-2 text-slate-300" size={20} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 'shipping' && (
                                <motion.div
                                    key="shipping"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <MapPin size={20} /> {checkoutContent.shipping.title}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            aria-label={checkoutContent.shipping.firstName}
                                            placeholder={checkoutContent.shipping.firstName}
                                            value={shipping.firstName}
                                            onChange={(event) => setShipping({ ...shipping, firstName: event.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none min-h-11"
                                        />
                                        <input
                                            aria-label={checkoutContent.shipping.lastName}
                                            placeholder={checkoutContent.shipping.lastName}
                                            value={shipping.lastName}
                                            onChange={(event) => setShipping({ ...shipping, lastName: event.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none min-h-11"
                                        />
                                        <input
                                            aria-label={checkoutContent.shipping.email}
                                            placeholder={checkoutContent.shipping.email}
                                            type="email"
                                            value={shipping.email}
                                            onChange={(event) => setShipping({ ...shipping, email: event.target.value })}
                                            className="col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none min-h-11"
                                        />
                                        <input
                                            aria-label={checkoutContent.shipping.phone}
                                            placeholder={checkoutContent.shipping.phone}
                                            value={shipping.phone}
                                            onChange={(event) => setShipping({ ...shipping, phone: event.target.value })}
                                            className="col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none min-h-11"
                                        />
                                        <input
                                            aria-label={checkoutContent.shipping.streetAddress}
                                            placeholder={checkoutContent.shipping.streetAddress}
                                            value={shipping.address}
                                            onChange={(event) => setShipping({ ...shipping, address: event.target.value })}
                                            className="col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none min-h-11"
                                        />
                                        <input
                                            aria-label={checkoutContent.shipping.city}
                                            placeholder={checkoutContent.shipping.city}
                                            value={shipping.city}
                                            onChange={(event) => setShipping({ ...shipping, city: event.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none min-h-11"
                                        />
                                        <input
                                            aria-label={checkoutContent.shipping.postalCode}
                                            placeholder={checkoutContent.shipping.postalCode}
                                            value={shipping.postalCode}
                                            onChange={(event) => setShipping({ ...shipping, postalCode: event.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none min-h-11"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setStep('payment')}
                                        disabled={!isShippingValid}
                                        className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors min-h-11 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {checkoutContent.shipping.continueToPayment}
                                    </button>
                                    {!isShippingValid && (
                                        <p className="mt-3 text-sm text-slate-500">
                                            Complete the shipping fields before continuing to payment.
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {step === 'payment' && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <CreditCard size={20} /> {checkoutContent.payment.title}
                                    </h2>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl min-h-11 opacity-60">
                                            <input type="radio" name="payment" value="card" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')} className="accent-cyan-500" disabled />
                                            <div className="flex-1">
                                                <span className="font-medium">{checkoutContent.payment.cardTitle}</span>
                                                <p className="text-xs text-slate-400">Temporarily unavailable in this checkout. Choose bank transfer or financing.</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-cyan-500 min-h-11">
                                            <input type="radio" name="payment" value="bank_transfer" checked={selectedPaymentMethod === 'bank_transfer'} onChange={() => setSelectedPaymentMethod('bank_transfer')} className="accent-cyan-500" />
                                            <div className="flex-1">
                                                <span className="font-medium">{checkoutContent.payment.bankTransferTitle}</span>
                                                <p className="text-xs text-slate-400">{checkoutContent.payment.bankTransferDescription}</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-cyan-500 min-h-11">
                                            <input type="radio" name="payment" value="financing" checked={selectedPaymentMethod === 'financing'} onChange={() => setSelectedPaymentMethod('financing')} className="accent-cyan-500" />
                                            <div className="flex-1">
                                                <span className="font-medium">{checkoutContent.payment.financingTitle}</span>
                                                <p className="text-xs text-slate-400">{checkoutContent.payment.financingFromPrefix} {Math.round(total / 36).toLocaleString()} {checkoutContent.payment.financingPerMonthSuffix}</p>
                                            </div>
                                        </label>
                                    </div>

                                    {checkoutTrustEnabled && (
                                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="flex flex-wrap gap-3 text-xs text-slate-600 font-medium" aria-label="Checkout trust signals">
                                                {checkoutContent.trustSignals.map((signal) => (
                                                    <span key={signal}>{signal}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => setStep('shipping')} className="px-6 py-4 text-slate-600 font-medium min-h-11">
                                            {checkoutContent.payment.back}
                                        </button>
                                        <button
                                            onClick={() => setStep('confirm')}
                                            className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors min-h-11"
                                        >
                                            {checkoutContent.payment.reviewOrder}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'confirm' && (
                                <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Check size={20} /> {checkoutContent.confirmation.title}
                                    </h2>
                                    <div className="space-y-4 mb-6">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-xs text-slate-400 mb-1">{checkoutContent.confirmation.shippingTo}</p>
                                            <p className="font-medium">
                                                {shipping.firstName} {shipping.lastName}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {shipping.address}, {shipping.city} {shipping.postalCode}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-xs text-slate-400 mb-1">Payment route</p>
                                            <p className="font-medium">
                                                {selectedPaymentMethod === 'bank_transfer'
                                                    ? checkoutContent.payment.bankTransferTitle
                                                    : checkoutContent.payment.financingTitle}
                                            </p>
                                        </div>
                                    </div>

                                    {checkoutTrustEnabled && (
                                        <label className="flex items-start gap-3 text-sm text-slate-700 mb-5 min-h-11">
                                            <input
                                                type="checkbox"
                                                checked={intendedUseAttestation}
                                                onChange={(event) => setIntendedUseAttestation(event.target.checked)}
                                                className="mt-1 accent-cyan-600"
                                                name="intended_use_attestation"
                                            />
                                            <span>{checkoutContent.intendedUseAttestation}</span>
                                        </label>
                                    )}

                                    <div className="flex gap-4 items-start">
                                        <button onClick={() => setStep('payment')} className="px-6 py-4 text-slate-600 font-medium min-h-11">
                                            {checkoutContent.payment.back}
                                        </button>
                                        {submitError && (
                                            <p className="flex-1 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2" role="alert">
                                                {submitError}
                                            </p>
                                        )}
                                        <form action={checkoutFormAction} className="flex-1">
                                            <input
                                                type="hidden"
                                                name="itemsJson"
                                                value={JSON.stringify(
                                                    items.map((item) => ({
                                                        id: item.id,
                                                        name: item.name,
                                                        price: item.price,
                                                        quantity: item.quantity,
                                                    }))
                                                )}
                                            />
                                            <input type="hidden" name="shippingJson" value={JSON.stringify(shipping)} />
                                            <input type="hidden" name="paymentMethod" value={selectedPaymentMethod} />
                                            <button
                                                type="submit"
                                                disabled={checkoutPending || (checkoutTrustEnabled && !intendedUseAttestation)}
                                                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-11"
                                            >
                                                {checkoutPending ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                        </svg>
                                                        {checkoutContent.confirmation.processing}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock size={16} /> {checkoutContent.confirmation.placeOrder}
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-32">
                        <h3 className="font-bold text-slate-900 mb-4">{checkoutContent.summary.title}</h3>
                        <div className="space-y-3 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-slate-600">
                                        {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} PLN</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">{checkoutContent.summary.subtotal}</span>
                                <span>{total.toLocaleString()} PLN</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">{checkoutContent.summary.shipping}</span>
                                <span className="text-emerald-600">{checkoutContent.summary.shippingFree}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>{checkoutContent.summary.total}</span>
                                <span className="text-cyan-600">{total.toLocaleString()} PLN</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="text-emerald-500" size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{checkoutContent.trustLayer.badge}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {Array.from(new Set(items.map((item) => item.id.split('-')[0]))).map((modality) => (
                                    <div
                                        key={modality}
                                        className="px-2 py-0.5 bg-emerald-500/10 text-[8px] font-bold text-emerald-600 rounded-md border border-emerald-500/20 uppercase tracking-tighter"
                                    >
                                        {checkoutContent.trustLayer.verifiedPrefix} {modality}
                                    </div>
                                ))}
                            </div>

                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                {checkoutContent.trustLayer.note}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
