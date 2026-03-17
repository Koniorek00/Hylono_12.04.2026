import React from 'react';
import { motion } from 'motion/react';
import { Shield, Wrench, Phone, Clock, CheckCircle, FileText, Mail, HelpCircle } from 'lucide-react';

export const WarrantyPage: React.FC = () => {
    const warrantyFeatures = [
        { icon: <Shield />, title: '2-Year Standard Warranty', desc: 'All products include comprehensive coverage' },
        { icon: <Clock />, title: '24/7 Support', desc: 'Round-the-clock technical assistance' },
        { icon: <Wrench />, title: 'Free Repairs', desc: 'Manufacturing defects covered at no cost' },
        { icon: <Phone />, title: 'Dedicated Hotline', desc: 'Priority support for warranty claims' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <Shield className="mx-auto text-cyan-500 mb-4" size={48} />
                    <h1 id="warranty-hero-headline" className="text-4xl font-bold text-slate-900 mb-4">Warranty & Service</h1>
                    <p id="warranty-hero-description" className="text-lg text-slate-600">Your investment is protected</p>
                </div>

                {/* Warranty Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {warrantyFeatures.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl p-6 text-center shadow-sm"
                        >
                            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{feature.title}</h3>
                            <p className="text-xs text-slate-500">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* What's Covered */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">What's Covered</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'Manufacturing defects',
                            'Component failures',
                            'Electronic malfunctions',
                            'Structural issues',
                            'Control system errors',
                            'Pressure seal integrity',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <CheckCircle className="text-emerald-500" size={18} />
                                <span className="text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Extended Warranty */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-8">
                    <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Shield className="text-amber-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Extended Warranty Available</h2>
                            <p className="text-slate-300 mb-4">
                                Extend your coverage to 5 years with our Premium Protection Plan.
                                Includes priority service, annual maintenance, and free parts replacement.
                            </p>
                            <button className="px-6 py-3 bg-amber-500 text-slate-900 rounded-xl font-bold hover:bg-amber-400 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>

                {/* Service Request */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Wrench size={20} /> Request Service
                    </h2>
                    <form className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input aria-label="Full Name" placeholder="Full Name" className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                            <input aria-label="Email" placeholder="Email" type="email" className="px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                        </div>
                        <input aria-label="Product Serial Number" placeholder="Product Serial Number" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none" />
                        <select aria-label="Issue Type" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none text-slate-600">
                            <option>Select Issue Type</option>
                            <option>Equipment not working</option>
                            <option>Unusual noise/vibration</option>
                            <option>Display/control issue</option>
                            <option>Seal/pressure problem</option>
                            <option>Other</option>
                        </select>
                        <textarea aria-label="Describe the issue" placeholder="Describe the issue..." className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none h-32 resize-none" />
                        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">
                            Submit Service Request
                        </button>
                    </form>
                </div>

                {/* Contact */}
                <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-slate-500">
                    <a href="mailto:support@hylono.com" className="flex items-center gap-2 hover:text-cyan-600">
                        <Mail size={16} /> support@hylono.com
                    </a>
                    <a href="tel:+48123456789" className="flex items-center gap-2 hover:text-cyan-600">
                        <Phone size={16} /> +48 123 456 789
                    </a>
                    <a href="#faq" className="flex items-center gap-2 hover:text-cyan-600">
                        <HelpCircle size={16} /> Support FAQ
                    </a>
                </div>
            </div>
        </div>
    );
};

