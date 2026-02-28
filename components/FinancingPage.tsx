import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowRight, CreditCard } from 'lucide-react';
import { NavigateFunction } from '../types';
import { financingContent } from '../content/financing';
import { FeatureGate } from './FeatureGate';

interface FinancingPageProps {
    onNavigate: NavigateFunction;
}

const LegacyFinancingFallback: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => (
    <div className="min-h-screen bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4 futuristic-font">Flexible Financing</h1>
            <p className="text-slate-600 mb-8">Updated financing calculator is coming soon.</p>
            <button onClick={() => onNavigate('store')} className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold">
                Shop products
            </button>
        </div>
    </div>
);

const EnhancedFinancingPage: React.FC<FinancingPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();
    const [selectedProductId, setSelectedProductId] = useState(financingContent.products[0]?.id ?? '');
    const selectedProduct = financingContent.products.find((product) => product.id === selectedProductId) ?? financingContent.products[0];
    const [selectedMonths, setSelectedMonths] = useState(selectedProduct?.installmentOptions[0]?.months ?? 0);

    const selectedInstallment = useMemo(() => {
        const currentProduct = financingContent.products.find((product) => product.id === selectedProductId) ?? selectedProduct;
        return currentProduct?.installmentOptions.find((option) => option.months === selectedMonths) ?? currentProduct?.installmentOptions[0];
    }, [selectedMonths, selectedProduct, selectedProductId]);

    const totalCost = selectedInstallment ? (selectedInstallment.monthlyAmount * selectedInstallment.months).toFixed(2) : '0.00';

    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 futuristic-font">{financingContent.title}</h1>
                        <p className="text-slate-300 max-w-2xl mx-auto">{financingContent.subtitle}</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-100 p-6 md:p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-5">Installment calculator</h2>

                    <label htmlFor="financing-product" className="text-sm font-semibold text-slate-700 block mb-2">
                        Product
                    </label>
                    <select
                        id="financing-product"
                        value={selectedProductId}
                        onChange={(event) => {
                            const nextId = event.target.value;
                            const nextProduct = financingContent.products.find((product) => product.id === nextId) ?? financingContent.products[0];
                            setSelectedProductId(nextId);
                            setSelectedMonths(nextProduct.installmentOptions[0]?.months ?? 0);
                        }}
                        className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                    >
                        {financingContent.products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.label} (€{product.basePrice.toLocaleString()})
                            </option>
                        ))}
                    </select>

                    {selectedProduct && (
                        <fieldset className="mt-6" aria-label="Installment period">
                            <legend className="text-sm font-semibold text-slate-700 mb-3">Installment options</legend>
                            <div className="space-y-3">
                                {selectedProduct.installmentOptions.map((option) => (
                                    <label
                                        key={option.months}
                                        className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 flex items-start gap-3 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="installment-period"
                                            checked={selectedMonths === option.months}
                                            onChange={() => setSelectedMonths(option.months)}
                                            className="mt-1 accent-cyan-600"
                                        />
                                        <span className="text-sm text-slate-700">
                                            {option.months} payments × €{option.monthlyAmount.toFixed(2)} {option.interestRate === 0 ? '(0%)' : `(${option.interestRate}%)`}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    )}

                    {selectedInstallment && (
                        <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm text-cyan-900 flex items-start gap-3" role="status" aria-live="polite">
                            <AlertCircle size={18} className="mt-0.5" />
                            <p>
                                Total cost: €{totalCost}. No hidden fees.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-14 px-6 border-t border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Alternative: rental program</h2>
                    <p className="text-slate-600 mb-5">{financingContent.rentalCtaText}</p>
                    <button
                        onClick={() => onNavigate('rental')}
                        className="min-h-11 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold inline-flex items-center gap-2"
                    >
                        <CreditCard size={16} />
                        {financingContent.rentalButton}
                    </button>
                </div>
            </section>

            <section className="py-14 px-6 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-5">FAQ</h2>
                    <div className="space-y-3">
                        {financingContent.faq.map((faq) => (
                            <details key={faq.q} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                <summary className="cursor-pointer min-h-11 text-sm font-semibold text-slate-900 flex items-center">{faq.q}</summary>
                                <p className="text-sm text-slate-600 leading-relaxed mt-2">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                    <button
                        onClick={() => onNavigate('store')}
                        className="mt-6 min-h-11 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center gap-2"
                    >
                        Shop & apply at checkout
                        <ArrowRight size={14} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export const FinancingPage: React.FC<FinancingPageProps> = ({ onNavigate }) => {
    return (
        <FeatureGate flag="feature_financing_page" fallback={<LegacyFinancingFallback onNavigate={onNavigate} />}>
            <EnhancedFinancingPage onNavigate={onNavigate} />
        </FeatureGate>
    );
};
