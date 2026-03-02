import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Calendar, Phone, Users } from 'lucide-react';
import { NavigateFunction } from '../types';
import { advisorsContent } from '../content/advisors';
import { FeatureGate } from './FeatureGate';
import { OptimizedImage } from './shared/OptimizedImage';

interface AdvisorsPageProps {
    onNavigate: NavigateFunction;
}

const LegacyAdvisorsFallback: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => (
    <div className="min-h-screen bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4 futuristic-font">Scientific Advisory Board</h1>
            <p className="text-slate-600 mb-8">Advisor profile updates are currently being prepared.</p>
            <button
                onClick={() => onNavigate('research')}
                className="min-h-11 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold"
            >
                Visit Research Hub
            </button>
        </div>
    </div>
);

const EnhancedAdvisorsPage: React.FC<AdvisorsPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();

    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 futuristic-font">{advisorsContent.title}</h1>
                        <p className="text-slate-300 max-w-2xl mx-auto">{advisorsContent.subtitle}</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Advisor profiles">
                    {advisorsContent.advisors.map((advisor, index) => (
                        <motion.article
                            key={advisor.id}
                            initial={reduced ? false : { opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: index * 0.05 }}
                            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <OptimizedImage
                                    src={advisor.photo}
                                    alt={advisor.name}
                                    width={80}
                                    height={80}
                                    sizes="80px"
                                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100"
                                />
                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-slate-900">{advisor.name}</h2>
                                    <p className="text-sm text-slate-500">{advisor.title}</p>
                                    <p className="text-sm text-slate-700 mt-2">
                                        Specializes in: {advisor.specializations.join(', ')}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 mt-4 leading-relaxed">{advisor.bio}</p>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6" role="group" aria-label={`Booking options for ${advisor.name}`}>
                                <button
                                    onClick={() => onNavigate('contact')}
                                    className="min-h-11 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                                    aria-label={`Book a 30 minute video call with ${advisor.name}`}
                                >
                                    <Calendar size={16} />
                                    Book a video call (30 min)
                                </button>
                                <button
                                    onClick={() => onNavigate('contact')}
                                    className="min-h-11 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold inline-flex items-center justify-center gap-2"
                                    aria-label={`Book a phone call with ${advisor.name}`}
                                >
                                    <Phone size={16} />
                                    Book a phone call
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            <section className="py-14 px-6 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">{advisorsContent.howItWorksTitle}</h2>
                    <ol className="space-y-3" aria-label="How advisor consultations work">
                        {advisorsContent.howItWorksSteps.map((step, idx) => (
                            <li key={step} className="rounded-2xl bg-white border border-slate-100 p-4 flex items-start gap-3">
                                <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold inline-flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                </span>
                                <span className="text-sm text-slate-700">{step}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-8">
                        <button
                            onClick={() => onNavigate('research')}
                            className="min-h-11 px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 inline-flex items-center gap-2"
                        >
                            <Users size={16} />
                            Browse evidence standards
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export const AdvisorsPage: React.FC<AdvisorsPageProps> = ({ onNavigate }) => {
    return (
        <FeatureGate flag="feature_advisors_page" fallback={<LegacyAdvisorsFallback onNavigate={onNavigate} />}>
            <EnhancedAdvisorsPage onNavigate={onNavigate} />
        </FeatureGate>
    );
};

