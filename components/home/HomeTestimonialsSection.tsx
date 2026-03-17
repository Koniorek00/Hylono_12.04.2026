'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../shared/ScrollReveal';
import { MedicalDisclaimer } from '../shared/MedicalDisclaimer';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  tech: string;
  tag: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The guided HBOT protocol felt immediately different from anything I'd tried before. The structured approach — timing, breathing, recovery intervals — made the experience feel genuinely purposeful. Worth every minute.",
    name: 'Marcus T.',
    role: 'Software Architect',
    tech: 'mHBOT Protocol',
    tag: 'Cognitive Support',
  },
  {
    quote:
      "I was skeptical about combining PEMF with hydrogen therapy, but the Hylono protocol stack made it easy to follow. The sleep quality improvement I noticed over several weeks was the most noticeable change in my routine.",
    name: 'Sarah K.',
    role: 'Entrepreneur',
    tech: 'PEMF + H₂ Stack',
    tag: 'Sleep Optimization',
  },
  {
    quote:
      "As a clinic director, I need technology I can trust with my clients. Hylono's full ecosystem gave us a credible, evidence-based platform to build our wellness protocols around. The quality is exceptional.",
    name: 'Dr. P. N.',
    role: 'Clinic Director',
    tech: 'Clinical Ecosystem',
    tag: 'Professional Use',
  },
];

export const HomeTestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">User Experiences</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 futuristic-font text-gray-900">Protocols in Practice</h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            How our users integrate Hylono technology into their daily lives. Individual results vary — these products are designed to support general wellbeing.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.12}>
          {TESTIMONIALS.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <motion.div
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 transition-all group h-full flex flex-col justify-between hover:shadow-2xl"
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="text-cyan-500/30" size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
                      {testimonial.tag}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                    <div className="text-xs text-cyan-600 font-medium">{testimonial.tech}</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <MedicalDisclaimer type="testimonial" compact className="text-center mt-8 block" />
      </div>
    </section>
  );
};
