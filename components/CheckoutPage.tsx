import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, CreditCard, Check, ChevronRight, Lock, MapPin, Phone, Mail, Shield } from 'lucide-react';
import { useCart } from './Cart';

type Step = 'shipping' | 'payment' | 'confirm';

export const CheckoutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { items, total, clearCart } = useCart();
    const [step, setStep] = useState<Step>('shipping');
    const [orderComplete, setOrderComplete] = useState(false);

    const [shipping, setShipping] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', postalCode: '', country: 'Poland'
    });

    const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
        { key: 'shipping', label: 'Shipping', icon: <Truck size={18} /> },
        { key: 'payment', label: 'Payment', icon: <CreditCard size={18} /> },
        { key: 'confirm', label: 'Confirm', icon: <Check size={18} /> },
    ];

    const handleSubmitOrder = () => {
        console.log('Order submitted:', { shipping, items, total });
        setOrderComplete(true);
        clearCart();
    };

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
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Order Confirmed!</h1>
                    <p className="text-slate-600 mb-8">
                        Thank you for your order. We've sent a confirmation email to {shipping.email}
                    </p>
                    <p className="text-sm text-slate-400 mb-8">Order #HYL-{Date.now().toString(36).toUpperCase()}</p>
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold"
                    >
                        Return to Home
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
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h1>
                    <button onClick={() => onNavigate('store')} className="text-cyan-600 font-medium">
                        Continue Shopping →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.key}>
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === s.key ? 'bg-slate-900 text-white' :
                                    steps.findIndex(x => x.key === step) > i ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
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
                    {/* Form Section */}
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
                                        <MapPin size={20} /> Shipping Information
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="First Name"
                                            value={shipping.firstName}
                                            onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                        />
                                        <input
                                            placeholder="Last Name"
                                            value={shipping.lastName}
                                            onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                        />
                                        <input
                                            placeholder="Email"
                                            type="email"
                                            value={shipping.email}
                                            onChange={e => setShipping({ ...shipping, email: e.target.value })}
                                            className="col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                        />
                                        <input
                                            placeholder="Phone"
                                            value={shipping.phone}
                                            onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                                            className="col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                        />
                                        <input
                                            placeholder="Street Address"
                                            value={shipping.address}
                                            onChange={e => setShipping({ ...shipping, address: e.target.value })}
                                            className="col-span-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                        />
                                        <input
                                            placeholder="City"
                                            value={shipping.city}
                                            onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                        />
                                        <input
                                            placeholder="Postal Code"
                                            value={shipping.postalCode}
                                            onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                                            className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setStep('payment')}
                                        className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                                    >
                                        Continue to Payment
                                    </button>
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
                                        <CreditCard size={20} /> Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-cyan-500">
                                            <input type="radio" name="payment" defaultChecked className="accent-cyan-500" />
                                            <div className="flex-1">
                                                <span className="font-medium">Credit/Debit Card</span>
                                                <p className="text-xs text-slate-400">Visa, Mastercard, American Express</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-cyan-500">
                                            <input type="radio" name="payment" className="accent-cyan-500" />
                                            <div className="flex-1">
                                                <span className="font-medium">Bank Transfer</span>
                                                <p className="text-xs text-slate-400">Direct bank transfer (EU)</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-cyan-500">
                                            <input type="radio" name="payment" className="accent-cyan-500" />
                                            <div className="flex-1">
                                                <span className="font-medium">Financing (36 months)</span>
                                                <p className="text-xs text-slate-400">From {Math.round(total / 36).toLocaleString()} PLN/month</p>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => setStep('shipping')} className="px-6 py-4 text-slate-600 font-medium">
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep('confirm')}
                                            className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                                        >
                                            Review Order
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
                                        <Check size={20} /> Review Your Order
                                    </h2>
                                    <div className="space-y-4 mb-6">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-xs text-slate-400 mb-1">Shipping to</p>
                                            <p className="font-medium">{shipping.firstName} {shipping.lastName}</p>
                                            <p className="text-sm text-slate-600">{shipping.address}, {shipping.city} {shipping.postalCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep('payment')} className="px-6 py-4 text-slate-600 font-medium">
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmitOrder}
                                            className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Lock size={16} /> Place Order
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-32">
                        <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
                        <div className="space-y-3 mb-4">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-slate-600">{item.name} × {item.quantity}</span>
                                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} PLN</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span>{total.toLocaleString()} PLN</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Shipping</span>
                                <span className="text-emerald-600">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span className="text-cyan-600">{total.toLocaleString()} PLN</span>
                            </div>
                        </div>

                        {/* Hylono Trust Layer Certification */}
                        <div className="mt-8 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="text-emerald-500" size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Trust Layer Certified</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {Array.from(new Set(items.map(i => i.id.split('-')[0]))).map(modality => (
                                    <div key={modality} className="px-2 py-0.5 bg-emerald-500/10 text-[8px] font-bold text-emerald-600 rounded-md border border-emerald-500/20 uppercase tracking-tighter">
                                        Verified {modality}
                                    </div>
                                ))}
                            </div>

                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                This order contains verified bio-optimization technology. All therapeutic claims are backed by Hylono Knowledge Packs and registered Trace IDs.
                            </p>
                            <div className="mt-3 flex items-center gap-1.5 text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">
                                <Check size={10} /> ISO 13485 Standards
                                <span className="mx-1 opacity-30">|</span>
                                <Check size={10} /> GDPR Compliant
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
