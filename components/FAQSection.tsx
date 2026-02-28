import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items: FAQItem[];
}

// Helper function to create a slug from question
const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export const FAQSection: React.FC<FAQSectionProps> = ({ items }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                <HelpCircle className="text-cyan-500" />
                Technical FAQ
            </h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={slugify(item.question)} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left"
                            aria-expanded={openIndex === index}
                        >
                            <span className="font-bold text-slate-800">{item.question}</span>
                            <span className="ui-transition-fast">
                                {openIndex === index ? <Minus size={16} className="text-cyan-500" /> : <Plus size={16} className="text-slate-400" />}
                            </span>
                        </button>
                        <div className="ui-accordion-grid" data-open={openIndex === index}>
                            <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
