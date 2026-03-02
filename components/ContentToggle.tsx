import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ContentToggleProps {
    options: [string, string];
    children: [React.ReactNode, React.ReactNode];
    defaultIndex?: number;
}

export const ContentToggle: React.FC<ContentToggleProps> = ({
    options,
    children,
    defaultIndex = 0
}) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);

    return (
        <div>
            {/* Toggle Switch */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-slate-100 rounded-full p-1">
                    {options.map((option, i) => (
                        <button
                            key={option}
                            onClick={() => setActiveIndex(i)}
                            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeIndex === i ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            {activeIndex === i && (
                                <motion.div
                                    layoutId="toggle-bg"
                                    className="absolute inset-0 bg-slate-900 rounded-full"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {children[activeIndex]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Pricing Toggle Example
export const PricingToggle: React.FC = () => (
    <ContentToggle options={['Monthly', 'Annual (Save 20%)']}>
        <div className="grid md:grid-cols-3 gap-6">
            {[
                { name: 'Basic', price: 2999, features: ['HBOT Access', 'Email Support', 'Basic Analytics'] },
                { name: 'Pro', price: 5999, features: ['All Basic Features', 'PEMF Integration', 'Priority Support', 'Advanced Analytics'] },
                { name: 'Enterprise', price: 9999, features: ['All Pro Features', 'Dedicated Manager', 'Custom Integration', 'On-site Training'] },
            ].map((plan) => (
                <div key={plan.name} className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-xl text-slate-900">{plan.name}</h3>
                    <p className="text-3xl font-bold text-cyan-600 mt-2">{plan.price} PLN<span className="text-sm text-slate-400">/mo</span></p>
                    <ul className="mt-4 space-y-2">
                        {plan.features.map(f => <li key={f} className="text-sm text-slate-600">✓ {f}</li>)}
                    </ul>
                </div>
            ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {[
                { name: 'Basic', price: 28790, features: ['HBOT Access', 'Email Support', 'Basic Analytics'] },
                { name: 'Pro', price: 57590, features: ['All Basic Features', 'PEMF Integration', 'Priority Support', 'Advanced Analytics'] },
                { name: 'Enterprise', price: 95990, features: ['All Pro Features', 'Dedicated Manager', 'Custom Integration', 'On-site Training'] },
            ].map((plan) => (
                <div key={plan.name} className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-xl text-slate-900">{plan.name}</h3>
                    <p className="text-3xl font-bold text-cyan-600 mt-2">{plan.price.toLocaleString()} PLN<span className="text-sm text-slate-400">/yr</span></p>
                    <ul className="mt-4 space-y-2">
                        {plan.features.map(f => <li key={f} className="text-sm text-slate-600">✓ {f}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    </ContentToggle>
);

// Standard/Expert Mode Toggle
export const ExplanationToggle: React.FC<{ standard: React.ReactNode; expert: React.ReactNode }> = ({ standard, expert }) => (
    <ContentToggle options={['Standard', 'Expert']}>
        {standard}
        {expert}
    </ContentToggle>
);

