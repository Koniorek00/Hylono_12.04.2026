import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { NavigateFunction } from '../types';
import { FeatureGate } from './FeatureGate';
import { rentalCheckoutContent } from '../content/rentalCheckout';

interface RentalCheckoutPageProps {
    onNavigate: NavigateFunction;
}

interface RentalPlan {
    id: string;
    label: string;
    monthlyPrice: number;
    minPeriod: string;
}

const RENTAL_PLANS: RentalPlan[] = [
    { id: 'starter', label: 'Starter 3-month plan', monthlyPrice: 129, minPeriod: '3 months' },
    { id: 'standard', label: 'Standard 6-month plan', monthlyPrice: 109, minPeriod: '6 months' },
    { id: 'performance', label: 'Performance 12-month plan', monthlyPrice: 89, minPeriod: '12 months' },
];

const DEFAULT_RENTAL_PLAN: RentalPlan =
    RENTAL_PLANS[1] ??
    RENTAL_PLANS[0] ?? {
        id: 'starter',
        label: 'Starter 3-month plan',
        monthlyPrice: 129,
        minPeriod: '3 months',
    };

const LegacyRentalCheckoutFallback: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-3 futuristic-font">Rental checkout</h1>
            <p className="text-slate-600 mb-6">Enhanced rental checkout is currently disabled.</p>
            <button
                onClick={() => onNavigate('rental')}
                className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold"
            >
                Back to rental plans
            </button>
        </div>
    </div>
);

const EnhancedRentalCheckout: React.FC<RentalCheckoutPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();

    const [selectedPlanId, setSelectedPlanId] = useState(DEFAULT_RENTAL_PLAN.id);
    const [deliveryName, setDeliveryName] = useState('');
    const [deliveryEmail, setDeliveryEmail] = useState('');
    const [deliveryPhone, setDeliveryPhone] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryCity, setDeliveryCity] = useState('');
    const [deliveryPostalCode, setDeliveryPostalCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
    const [acceptRentalTerms, setAcceptRentalTerms] = useState(false);
    const [acceptIntendedUse, setAcceptIntendedUse] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const selectedPlan = useMemo(
        () => RENTAL_PLANS.find((plan) => plan.id === selectedPlanId) ?? DEFAULT_RENTAL_PLAN,
        [selectedPlanId],
    );

    const productTitle = 'Hylono mHBOT Starter System';
    const deposit = 199;
    const firstPayment = selectedPlan.monthlyPrice + deposit;

    const isDeliveryValid =
        deliveryName.trim().length > 1 &&
        deliveryEmail.includes('@') &&
        deliveryAddress.trim().length > 4 &&
        deliveryCity.trim().length > 1 &&
        deliveryPostalCode.trim().length > 2;

    const canSubmit = isDeliveryValid && acceptRentalTerms && acceptIntendedUse;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!canSubmit) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6">
                <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center mb-5">
                        <CheckCircle size={30} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3 futuristic-font">Rental activated</h1>
                    <p className="text-slate-600 mb-6">
                        Your first payment of €{firstPayment} was authorized using {paymentMethod === 'card' ? 'card' : 'bank transfer'}.
                    </p>
                    <button
                        onClick={() => onNavigate('account')}
                        className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold inline-flex items-center gap-2"
                    >
                        Continue to order confirmation
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.aside
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 h-fit"
                >
                    <h1 className="text-2xl font-black text-slate-900 mb-4 futuristic-font">{rentalCheckoutContent.title}</h1>

                    <div className="rounded-2xl border border-slate-200 p-4">
                        <h2 className="text-sm font-semibold text-slate-900">{productTitle}</h2>
                        <p className="text-xs text-slate-500 mt-1">Plan: {selectedPlan.label}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-1">€{selectedPlan.monthlyPrice}/mo</p>
                    </div>

                    <dl className="mt-5 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">First month</dt>
                            <dd className="text-slate-800">€{selectedPlan.monthlyPrice}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Refundable deposit</dt>
                            <dd className="text-slate-800">€{deposit}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Delivery and setup</dt>
                            <dd className="text-emerald-700">Included</dd>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex justify-between font-bold">
                            <dt className="text-slate-900">Due today</dt>
                            <dd className="text-slate-900">€{firstPayment}</dd>
                        </div>
                    </dl>

                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">{rentalCheckoutContent.depositNote}</p>
                </motion.aside>

                <motion.section
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">Select rental plan</legend>
                            <div className="space-y-2">
                                {RENTAL_PLANS.map((plan) => (
                                    <label key={plan.id} className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="rental-plan"
                                            className="mt-1 accent-cyan-600"
                                            checked={selectedPlanId === plan.id}
                                            onChange={() => setSelectedPlanId(plan.id)}
                                        />
                                        <span className="text-sm text-slate-700">
                                            {plan.label} — €{plan.monthlyPrice}/mo
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">Delivery details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="rental-name" className="text-sm font-semibold text-slate-700 block mb-2">Full name</label>
                                    <input
                                        id="rental-name"
                                        value={deliveryName}
                                        onChange={(event) => setDeliveryName(event.target.value)}
                                        className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rental-email" className="text-sm font-semibold text-slate-700 block mb-2">Email</label>
                                    <input
                                        id="rental-email"
                                        type="email"
                                        value={deliveryEmail}
                                        onChange={(event) => setDeliveryEmail(event.target.value)}
                                        className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="rental-phone" className="text-sm font-semibold text-slate-700 block mb-2">Phone</label>
                                    <input
                                        id="rental-phone"
                                        value={deliveryPhone}
                                        onChange={(event) => setDeliveryPhone(event.target.value)}
                                        className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rental-postal" className="text-sm font-semibold text-slate-700 block mb-2">Postal code</label>
                                    <input
                                        id="rental-postal"
                                        value={deliveryPostalCode}
                                        onChange={(event) => setDeliveryPostalCode(event.target.value)}
                                        className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="rental-address" className="text-sm font-semibold text-slate-700 block mb-2">Address</label>
                                <input
                                    id="rental-address"
                                    value={deliveryAddress}
                                    onChange={(event) => setDeliveryAddress(event.target.value)}
                                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="rental-city" className="text-sm font-semibold text-slate-700 block mb-2">City</label>
                                <input
                                    id="rental-city"
                                    value={deliveryCity}
                                    onChange={(event) => setDeliveryCity(event.target.value)}
                                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                                    required
                                />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">Rental terms</legend>
                            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                                <div className="flex items-start gap-2 mb-2 text-cyan-900">
                                    <Info size={16} className="mt-0.5" />
                                    <p className="text-sm font-semibold">Program conditions</p>
                                </div>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-cyan-900">
                                    {rentalCheckoutContent.terms.map((term) => (
                                        <li key={term}>{term.replace('{selectedPlan.minPeriod}', selectedPlan.minPeriod)}</li>
                                    ))}
                                </ul>
                            </div>
                            <label className="mt-4 min-h-11 flex items-start gap-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={acceptRentalTerms}
                                    onChange={(event) => setAcceptRentalTerms(event.target.checked)}
                                    className="mt-1 accent-cyan-600"
                                />
                                <span>
                                    {rentalCheckoutContent.termsAcceptance}{' '}
                                    <Link href="/terms" className="text-cyan-700 underline" target="_blank" rel="noreferrer">
                                        Full terms →
                                    </Link>
                                </span>
                            </label>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-bold text-slate-900 mb-3">Payment</legend>
                            <div className="space-y-2">
                                <label className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rental-payment"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                        className="mt-1 accent-cyan-600"
                                    />
                                    <span className="text-sm text-slate-700">Credit / debit card</span>
                                </label>
                                <label className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rental-payment"
                                        checked={paymentMethod === 'bank'}
                                        onChange={() => setPaymentMethod('bank')}
                                        className="mt-1 accent-cyan-600"
                                    />
                                    <span className="text-sm text-slate-700">Bank transfer</span>
                                </label>
                            </div>
                        </fieldset>

                        <label className="min-h-11 flex items-start gap-3 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={acceptIntendedUse}
                                onChange={(event) => setAcceptIntendedUse(event.target.checked)}
                                className="mt-1 accent-cyan-600"
                            />
                            <span>{rentalCheckoutContent.intendedUse}</span>
                        </label>

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {rentalCheckoutContent.paymentButtonPrefix} €{firstPayment}
                        </button>
                    </form>
                </motion.section>
            </div>
        </div>
    );
};

export const RentalCheckoutPage: React.FC<RentalCheckoutPageProps> = ({ onNavigate }) => {
    return (
        <FeatureGate flag="feature_rental_checkout" fallback={<LegacyRentalCheckoutFallback onNavigate={onNavigate} />}>
            <EnhancedRentalCheckout onNavigate={onNavigate} />
        </FeatureGate>
    );
};
