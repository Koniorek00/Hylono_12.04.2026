"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Star, ArrowRight, Quote } from 'lucide-react';
import { NavigateFunction } from '../types';
import { MedicalDisclaimer } from './shared/MedicalDisclaimer';

interface TestimonialsPageProps {
    onNavigate: NavigateFunction;
}

const TESTIMONIALS = [
    {
        name: 'Dr. Marcus Van den Berg',
        role: 'Performance Consultant, Amsterdam',
        modality: 'HBOT',
        quote: 'I added the HBOT chamber to my clinic 14 months ago. We observed encouraging user-reported progress, especially in post-surgical rehabilitation support pathways. The Hylono onboarding and documentation quality has been excellent.',
        rating: 5,
        initials: 'MV',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Sophie L.',
        role: 'Triathlete, Lyon',
        modality: 'PEMF + RLT',
        quote: 'I rent two modalities, PEMF and red light. Over several weeks, my recovery routine felt more structured and I was able to return to training with better consistency. The protocol guidance helped me stay disciplined.',
        rating: 5,
        initials: 'SL',
        gradient: 'from-orange-400 to-red-500',
    },
    {
        name: 'Clinic Director, Vienna',
        role: 'Wellness Centre Owner',
        modality: 'Full Stack',
        quote: "We expanded our clinic offering through Hylono's wholesale programme. Staff training was thorough, devices have been reliable, and client engagement with our wellness programmes has improved.",
        rating: 5,
        initials: 'CD',
        gradient: 'from-purple-500 to-violet-500',
    },
    {
        name: 'Tomasz K.',
        role: 'Longevity Enthusiast, Warsaw',
        modality: 'Hydrogen Inhalation',
        quote: 'I was sceptical about hydrogen inhalation, but the trial period helped me evaluate it safely. After six weeks, I noticed better routine consistency and decided to keep the system.',
        rating: 5,
        initials: 'TK',
        gradient: 'from-teal-500 to-emerald-500',
    },
    {
        name: 'Elena R.',
        role: 'Functional Wellness Practitioner, Madrid',
        modality: 'HBOT + PEMF',
        quote: 'I include Hylono protocols in broader client wellness plans where appropriate. The evidence summaries, device quality, and support ecosystem make it easier to deploy responsibly in a structured workflow.',
        rating: 5,
        initials: 'ER',
        gradient: 'from-pink-500 to-rose-500',
    },
    {
        name: 'James O.',
        role: 'Biohacker & Tech Founder, London',
        modality: 'HBOT',
        quote: 'I started with the trial window to evaluate fit. Within the first weeks, I noticed improvements in sleep routine consistency and subjective recovery, so I chose to continue.',
        rating: 5,
        initials: 'JO',
        gradient: 'from-cyan-500 to-blue-600',
    },
];

const CASE_STUDIES = [
    {
        title: 'Triathlon Recovery Protocol',
        tag: 'PEMF + RLT',
        result: 'Shorter recovery intervals reported',
        desc: 'A professional triathlete implemented a dual-modality protocol combining PEMF stimulation and red light photobiomodulation. Across a 12-week season, self-reported recovery windows trended downward compared with their previous baseline.',
    },
    {
        title: 'Post-Surgical Rehabilitation',
        tag: 'HBOT',
        result: 'Encouraging rehabilitation support trend',
        desc: 'A 54-year-old user incorporated mild HBOT alongside standard physiotherapy following knee replacement surgery. Progress notes suggested results consistent with structured adherence and multidisciplinary follow-up.',
    },
    {
        title: 'Executive Cognitive Performance',
        tag: 'H2 + PEMF',
        result: 'Sustained focus routine improvements',
        desc: 'A C-suite executive implemented a morning hydrogen inhalation and PEMF stack. Self-reported cognitive performance scores trended upward over 60 days using repeated assessment prompts.',
    },
];

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();
    const [filter, setFilter] = useState<string>('All');
    const modalities = ['All', 'HBOT', 'PEMF', 'PEMF + RLT', 'Hydrogen', 'Full Stack'];

    const filtered =
        filter === 'All' ? TESTIMONIALS : TESTIMONIALS.filter((testimonial) => testimonial.modality.includes(filter));

    return (
        <div className="min-h-screen bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-6 py-24 text-white">
                <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
                            <Star size={12} /> Verified Reviews
                        </span>
                        <h1 className="mb-6 text-5xl font-black leading-tight futuristic-font md:text-6xl">
                            Results That
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                                Speak for Themselves
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-300">
                            From elite athletes to functional wellness practitioners, experience-led
                            stories show how people integrate structured wellness protocols.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="bg-white px-6 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 flex flex-wrap justify-center gap-3">
                        {modalities.map((modality) => (
                            <button
                                key={modality}
                                onClick={() => setFilter(modality)}
                                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                                    filter === modality
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {modality}
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={reduced ? false : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <Quote size={20} className="mb-4 text-slate-200" />
                                <div className="mb-4 flex gap-0.5">
                                    {Array.from({ length: testimonial.rating }).map((_, ratingIndex) => (
                                        <Star
                                            key={ratingIndex}
                                            size={13}
                                            className="fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <p className="mb-6 text-sm italic leading-relaxed text-slate-600">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-xs font-bold text-white`}
                                    >
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-xs text-slate-400">{testimonial.role}</p>
                                    </div>
                                    <span className="ml-auto rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                                        {testimonial.modality}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-14 text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                            Practice Outcomes
                        </span>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900 futuristic-font">
                            Case Studies
                        </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {CASE_STUDIES.map((caseStudy, index) => (
                            <motion.div
                                key={caseStudy.title}
                                initial={reduced ? false : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="rounded-3xl border border-slate-100 bg-white p-8"
                            >
                                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600">
                                    {caseStudy.tag}
                                </span>
                                <h3 className="mt-4 mb-2 font-bold text-slate-900">
                                    {caseStudy.title}
                                </h3>
                                <p className="mb-4 text-2xl font-black text-cyan-500">
                                    {caseStudy.result}
                                </p>
                                <p className="text-sm leading-relaxed text-slate-500">
                                    {caseStudy.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-4">
                <div className="mx-auto max-w-5xl">
                    <MedicalDisclaimer type="testimonial" showCitationDisclaimer variant="info" />
                </div>
            </section>

            <section className="bg-gradient-to-br from-slate-900 to-cyan-950 px-6 py-20 text-center text-white">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-4 text-3xl font-bold futuristic-font">Start Your Story</h2>
                    <p className="mb-8 text-sm text-slate-300">
                        Join 2,500+ people building more consistent wellness routines with Hylono.
                        30-day evaluation window. Terms apply.
                    </p>
                    <button
                        onClick={() => onNavigate('store')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-colors hover:bg-slate-100"
                    >
                        Shop Devices <ArrowRight size={15} />
                    </button>
                </div>
            </section>
        </div>
    );
};
