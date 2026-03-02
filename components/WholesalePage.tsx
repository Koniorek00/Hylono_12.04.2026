import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Building2, Users, Truck, HeadphonesIcon, Award, BarChart3 } from 'lucide-react';
import { NavigateFunction } from '../types';

interface WholesalePageProps { onNavigate: NavigateFunction; }

const TIERS = [
    { name: 'Starter Clinic', min: 2, discount: '10%', support: 'Email', training: 'Online', badge: null },
    { name: 'Certified Partner', min: 5, discount: '18%', support: 'Priority', training: 'On-site', badge: 'Most Popular' },
    { name: 'Elite Fleet', min: 10, discount: '25%+', support: 'Dedicated Manager', training: 'Custom', badge: 'Best Value' },
];

export const WholesalePage: React.FC<WholesalePageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();
    return (
        <div className="min-h-screen bg-white">
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white py-28 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Building2 size={12} /> Wholesale & B2B
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 futuristic-font leading-none">
                            Equip Your Clinic.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Scale Your Impact.</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Volume pricing, dedicated account management, staff training, and extended warranties for clinics, spas, and wellness centres.
                        </p>
                        <button onClick={() => onNavigate('contact')} className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-100 transition-colors shadow-xl">
                            Request Wholesale Quote <ArrowRight size={15} />
                        </button>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Volume Tiers</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-3 futuristic-font">Wholesale Pricing Tiers</h2>
                        <p className="text-slate-500 mt-3 text-sm">Pricing based on number of units across all modalities. Mix and match HBOT, PEMF, RLT, and Hydrogen.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {TIERS.map((tier, i) => (
                            <motion.div key={tier.name} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className={`rounded-3xl p-8 border-2 ${i === 1 ? 'border-cyan-400 bg-cyan-50' : 'border-slate-100 bg-white'} relative`}>
                                {tier.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{tier.badge}</span>}
                                <h3 className="font-black text-slate-900 text-xl mb-1">{tier.name}</h3>
                                <p className="text-slate-500 text-sm mb-6">From {tier.min} units</p>
                                <div className="text-4xl font-black text-cyan-500 mb-6">{tier.discount}<span className="text-lg text-slate-400 font-normal"> off RRP</span></div>
                                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                                    <li className="flex items-center gap-2"><Award size={14} className="text-cyan-500" />{tier.support} support</li>
                                    <li className="flex items-center gap-2"><Users size={14} className="text-cyan-500" />{tier.training} staff training</li>
                                    <li className="flex items-center gap-2"><Truck size={14} className="text-cyan-500" />Priority delivery</li>
                                    <li className="flex items-center gap-2"><BarChart3 size={14} className="text-cyan-500" />Partner portal access</li>
                                </ul>
                                <button onClick={() => onNavigate('contact')} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                    Enquire Now
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 futuristic-font">What's Included</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: HeadphonesIcon, title: 'Dedicated Account Manager', desc: 'A single point of contact for all orders, training, and technical support.' },
                            { icon: Users, title: 'Staff Certification Training', desc: 'Online and on-site training modules to certify your team on every modality.' },
                            { icon: Award, title: 'Extended 7-Year Warranty', desc: 'Wholesale partners receive an extended 7-year warranty vs the standard 5-year.' },
                        ].map((b, i) => (
                            <motion.div key={b.title} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-3xl p-8 border border-slate-100">
                                <div className="w-11 h-11 bg-cyan-50 rounded-2xl flex items-center justify-center mb-5"><b.icon size={20} className="text-cyan-600" /></div>
                                <h3 className="font-bold text-slate-900 mb-2">{b.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <Building2 size={40} className="text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4 futuristic-font">Ready to Equip Your Clinic?</h2>
                    <p className="text-slate-300 mb-8 text-sm">Fill in our wholesale enquiry form and a B2B specialist will contact you within 2 business days.</p>
                    <button onClick={() => onNavigate('contact')} className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-100 transition-colors">
                        Request Wholesale Quote <ArrowRight size={15} />
                    </button>
                </div>
            </section>
        </div>
    );
};

