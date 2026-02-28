import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, ArrowRight, Quote } from 'lucide-react';
import { NavigateFunction } from '../types';

interface TestimonialsPageProps { onNavigate: NavigateFunction; }

const TESTIMONIALS = [
    { name: 'Dr. Marcus Van den Berg', role: 'Performance Physician, Amsterdam', modality: 'HBOT', quote: 'I added the HBOT chamber to my clinic 14 months ago. The patient outcomes have been exceptional — particularly for neurological recovery and post-surgical rehab. The Hylono support team is unmatched.', rating: 5, initials: 'MV', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Sophie L.', role: 'Triathlete, Lyon', modality: 'PEMF + RLT', quote: 'I rent two modalities — PEMF and red light. My recovery windows have dropped dramatically. I\'m back in full training within 24 hours of a race now. Genuinely changed my career trajectory.', rating: 5, initials: 'SL', gradient: 'from-orange-400 to-red-500' },
    { name: 'Clinic Director, Vienna', role: 'Wellness Centre Owner', modality: 'Full Stack', quote: 'We kitted out our entire clinic through Hylono\'s wholesale programme. The training for our staff was thorough, the devices are rock solid, and our client retention has improved significantly.', rating: 5, initials: 'CD', gradient: 'from-purple-500 to-violet-500' },
    { name: 'Tomasz K.', role: 'Longevity Enthusiast, Warsaw', modality: 'Hydrogen Inhalation', quote: 'I was sceptical about H2 therapy, but within 6 weeks my inflammation markers dropped significantly. The 30-day guarantee gave me the confidence to try it. Kept it. No regrets.', rating: 5, initials: 'TK', gradient: 'from-teal-500 to-emerald-500' },
    { name: 'Elena R.', role: 'Functional Medicine Practitioner, Madrid', modality: 'HBOT + PEMF', quote: 'I prescribe Hylono protocols to my clients as part of comprehensive treatment plans. The evidence base, the device quality, and the protocol support ecosystem are far ahead of the competition.', rating: 5, initials: 'ER', gradient: 'from-pink-500 to-rose-500' },
    { name: 'James O.', role: 'Biohacker & Tech Founder, London', modality: 'HBOT', quote: 'I was sceptical, so the 30-day guarantee was the only reason I pulled the trigger. Ended up keeping it. Results were undeniable within 2 weeks — clarity, sleep, recovery. All improved.', rating: 5, initials: 'JO', gradient: 'from-cyan-500 to-blue-600' },
];

const CASE_STUDIES = [
    { title: 'Triathlon Recovery Protocol', tag: 'PEMF + RLT', result: '40% faster recovery time', desc: 'A professional triathlete implemented a dual-modality protocol combining PEMF stimulation and red light photobiomodulation. Recovery windows dropped from 72 hours to under 48 hours across a 12-week season.' },
    { title: 'Post-Surgical Rehabilitation', tag: 'HBOT', result: '3x faster tissue repair', desc: 'A 54-year-old patient used mild HBOT as an adjunct to standard physiotherapy following knee replacement surgery. Surgeon noted significantly accelerated tissue healing at the 8-week assessment.' },
    { title: 'Executive Cognitive Performance', tag: 'H2 + PEMF', result: 'Sustained focus improvement', desc: 'A C-suite executive implemented a morning hydrogen inhalation and PEMF stack. Self-reported cognitive performance scores increased by 31% over 60 days using validated assessment tools.' },
];

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();
    const [filter, setFilter] = useState<string>('All');
    const modalities = ['All', 'HBOT', 'PEMF', 'PEMF + RLT', 'Hydrogen', 'Full Stack'];

    const filtered = filter === 'All' ? TESTIMONIALS : TESTIMONIALS.filter(t => t.modality.includes(filter));

    return (
        <div className="min-h-screen bg-white">
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white py-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Star size={12} /> Verified Reviews
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 futuristic-font leading-tight">
                            Results That<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">Speak for Themselves</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            From elite athletes to functional medicine practitioners — real people, real results, real data.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                        {modalities.map(m => (
                            <button key={m} onClick={() => setFilter(m)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filter === m ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {m}
                            </button>
                        ))}
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((t, i) => (
                            <motion.div key={t.name} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <Quote size={20} className="text-slate-200 mb-4" />
                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-slate-600 text-sm italic leading-relaxed mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-xs`}>{t.initials}</div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                                        <p className="text-xs text-slate-400">{t.role}</p>
                                    </div>
                                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">{t.modality}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Studies */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Clinical Outcomes</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-3 futuristic-font">Case Studies</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {CASE_STUDIES.map((cs, i) => (
                            <motion.div key={cs.title} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl p-8 border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">{cs.tag}</span>
                                <h3 className="font-bold text-slate-900 mt-4 mb-2">{cs.title}</h3>
                                <p className="text-2xl font-black text-cyan-500 mb-4">{cs.result}</p>
                                <p className="text-slate-500 text-sm leading-relaxed">{cs.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-cyan-950 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4 futuristic-font">Start Your Story</h2>
                    <p className="text-slate-300 mb-8 text-sm">Join 2,500+ people who have transformed their performance with Hylono. 30-day guarantee. Zero risk.</p>
                    <button onClick={() => onNavigate('store')} className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-100 transition-colors shadow-xl">
                        Shop Devices <ArrowRight size={15} />
                    </button>
                </div>
            </section>
        </div>
    );
};
