import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, CreditCard, Banknote } from 'lucide-react';

interface FinancingModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    price: number;
}

export const FinancingModal: React.FC<FinancingModalProps> = ({ isOpen, onClose, productName, price }) => {
    const [months, setMonths] = useState(24);

    const interestRate = 0.08; // 8% annual
    const monthlyRate = interestRate / 12;
    const monthlyPayment = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalCost = monthlyPayment * months;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl z-50 overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Calculator className="text-cyan-500" size={24} />
                                <h2 className="text-xl font-bold text-slate-900">Financing Options</h2>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-6">{productName}</p>

                            <div className="bg-slate-50 rounded-xl p-6 mb-6">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Monthly Payment</p>
                                <p className="text-4xl font-bold text-slate-900">
                                    {Math.round(monthlyPayment).toLocaleString()} <span className="text-lg">PLN</span>
                                </p>
                                <p className="text-sm text-slate-400 mt-1">for {months} months</p>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm font-medium text-slate-700 mb-3">Select Term</p>
                                <div className="flex gap-2">
                                    {[12, 24, 36, 48].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMonths(m)}
                                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${months === m
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {m} mo
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Product Price</span>
                                    <span className="font-medium">{price.toLocaleString()} PLN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Total Interest</span>
                                    <span className="font-medium">{Math.round(totalCost - price).toLocaleString()} PLN</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t">
                                    <span className="font-bold">Total Cost</span>
                                    <span className="font-bold text-cyan-600">{Math.round(totalCost).toLocaleString()} PLN</span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 mb-6">
                                *Representative example: 8% APR. Subject to credit approval. Terms and conditions apply.
                            </p>

                            <button className="w-full py-4 bg-cyan-500 text-white rounded-xl font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2">
                                <CreditCard size={18} /> Apply for Financing
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Price Display with Financing Option
export const PriceWithFinancing: React.FC<{ price: number; productName: string }> = ({ price, productName }) => {
    const [showModal, setShowModal] = useState(false);
    const monthlyEstimate = Math.round(price / 36);

    return (
        <div>
            <div className="text-3xl font-bold text-slate-900">{price.toLocaleString()} PLN</div>
            <button
                onClick={() => setShowModal(true)}
                className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 mt-1"
            >
                <Banknote size={14} /> or from {monthlyEstimate.toLocaleString()} PLN/month
            </button>
            <FinancingModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                price={price}
                productName={productName}
            />
        </div>
    );
};
