import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react';
import { SmartText } from './SmartText';
import { MedicalDisclaimer } from './shared/MedicalDisclaimer';
import { HELP_FAQ_DATA } from '@/content/help-faq';

const FAQ_DATA = HELP_FAQ_DATA;

export const FAQPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItem, setOpenItem] = useState<string | null>(null);

    const filteredFAQ = FAQ_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <HelpCircle className="mx-auto mb-4 text-cyan-500" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4 futuristic-font">Frequently Asked Questions</h1>
                    <p className="text-slate-500 max-w-xl mx-auto">Find answers to common questions about our bio-optimization technologies, protocols, and services</p>
                </motion.div>

                {/* Search */}
                <div className="relative mb-12">
                    <label htmlFor="faq-search" className="sr-only">
                        Search frequently asked questions
                    </label>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        id="faq-search"
                        type="text"
                        placeholder="Search questions..."
                        aria-label="Search frequently asked questions"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                </div>

                {/* FAQ Accordion */}
                {filteredFAQ.map((category, ci) => (
                    <motion.div
                        key={ci}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: ci * 0.1 }}
                        className="mb-8"
                    >
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{category.category}</h2>
                        {category.evidenceSource && (
                            <p className="text-xs text-slate-500 mb-3">Evidence source: {category.evidenceSource}</p>
                        )}
                        <div className="space-y-3">
                            {category.items.map((item, i) => {
                                const itemId = `${ci}-${i}`;
                                const isOpen = openItem === itemId;
                                return (
                                    <div key={item.q} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors">
                                        <button
                                            onClick={() => setOpenItem(isOpen ? null : itemId)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="font-medium text-slate-900">{item.q}</span>
                                            <ChevronDown className={`text-slate-400 ui-transition-fast ${isOpen ? 'rotate-180' : ''}`} size={20} />
                                        </button>
                                        <div className="ui-accordion-grid" data-open={isOpen}>
                                            <div className="px-6 pb-4">
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    <SmartText>{item.a}</SmartText>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                {/* Still have questions CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 text-white">
                        <MessageCircle className="mx-auto mb-4 opacity-80" size={32} />
                        <h3 className="text-xl font-bold mb-2">Still Have Questions?</h3>
                        <p className="text-cyan-100 mb-6 text-sm">Our bio-optimization specialists are available 24/7 to help you find the answers you need.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-6 py-3 bg-white text-cyan-600 rounded-xl font-bold text-sm hover:bg-cyan-50 transition-all">
                                Schedule Consultation
                            </button>
                            <button className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold text-sm hover:bg-cyan-700 transition-all border border-cyan-400">
                                Start Live Chat
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-6">
                    <MedicalDisclaimer type="general" compact className="text-center" />
                </div>
            </div>
        </div>
    );
};
