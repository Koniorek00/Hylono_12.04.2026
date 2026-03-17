'use client';

import React from 'react';
import { CheckCircle, Clock, User } from 'lucide-react';
import { MagneticButton } from '../shared/MagneticButton';
import { ScrollReveal } from '../shared/ScrollReveal';

interface HomeFinalCtaSectionProps {
  onLaunchBuilder: () => void;
  onNavigate: (path: string) => void;
}

export function HomeFinalCtaSection({
  onLaunchBuilder,
  onNavigate,
}: HomeFinalCtaSectionProps): React.JSX.Element {
  return (
    <section className="grain-overlay relative overflow-hidden bg-slate-50 py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-100/40 to-purple-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal direction="up">
          <h2 className="futuristic-font mb-6 text-3xl font-bold text-slate-900 md:text-5xl">Your Regeneration Architecture</h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-500">
            Stop guessing. Start measuring. Our protocol engineers will design a personalized
            regeneration stack based on your biology, goals, and lifestyle.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <MagneticButton
              onClick={onLaunchBuilder}
              className="flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-10 py-5 text-sm font-bold tracking-widest text-white uppercase shadow-xl shadow-slate-900/20 transition-colors hover:bg-slate-800"
              strength={0.3}
            >
              <User size={18} /> Design Your Protocol
            </MagneticButton>

            <MagneticButton
              onClick={() => onNavigate('contact')}
              className="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-10 py-5 text-sm font-bold tracking-widest text-slate-900 uppercase transition-colors hover:border-slate-400"
              strength={0.25}
            >
              <Clock size={18} /> Book Free Consultation
            </MagneticButton>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500" /> No commitment
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500" /> Flexible monthly plans
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500" /> Free shipping
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
