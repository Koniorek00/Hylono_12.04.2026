'use client';

import React from 'react';
import { Activity, Brain, Sparkles } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../shared/ScrollReveal';

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Discover',
    desc: 'Explore our ecosystem of regeneration technologies. Use our goal-based filtering to find the best fit for your needs.',
    icon: Brain,
  },
  {
    step: '02',
    title: 'Configure',
    desc: 'Build your personalized protocol stack. Our synergy engine recommends optimal combinations and timing based on your goals.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Transform',
    desc: 'Receive your technology with guided onboarding. Track your progress, adjust protocols, and evolve your routine over time.',
    icon: Activity,
  },
] as const;

export function HomeHowItWorksSection(): React.JSX.Element {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" className="mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Simple Process</span>
          <h2 className="futuristic-font mt-4 text-3xl font-bold text-gray-900 md:text-5xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">From curiosity to optimization in three simple steps</p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-8 md:grid-cols-3" staggerDelay={0.15}>
          {HOW_IT_WORKS_STEPS.map((item) => (
            <StaggerItem key={item.step}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <div className="futuristic-font absolute top-2 right-4 select-none text-8xl font-black text-slate-50 transition-colors group-hover:text-slate-100">
                  {item.step}
                </div>
                <item.icon className="relative z-10 mb-6 text-cyan-500 transition-transform duration-300 group-hover:scale-110" size={32} />
                <h3 className="futuristic-font relative z-10 mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="relative z-10 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
