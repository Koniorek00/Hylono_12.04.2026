'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Activity, Droplets, Sun, Wind } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../shared/ScrollReveal';
import { AnimatedCounter } from '../shared/AnimatedCounter';

const SCIENCE_STATS = [
  { end: 87, suffix: '+', label: 'Peer-Reviewed Studies' },
  { end: 12, suffix: '', label: 'Medical Advisors' },
  { end: 2500, suffix: '+', label: 'Active Users' },
  { end: 5, suffix: '-yr', label: 'Device Warranty' },
] as const;

const SCIENCE_MODALITIES = [
  {
    icon: Wind,
    label: 'Hyperbaric Oxygen',
    studies: '23 Published Trials',
    focus: 'Neuroinflammation • Tissue Repair',
  },
  {
    icon: Activity,
    label: 'PEMF Therapy',
    studies: '18 Clinical Studies',
    focus: 'Cellular Voltage • Pain Modulation',
  },
  {
    icon: Sun,
    label: 'Red Light Therapy',
    studies: '31 RCTs Reviewed',
    focus: 'Mitochondrial Function • Skin Health',
  },
  {
    icon: Droplets,
    label: 'Molecular Hydrogen',
    studies: '15 Human Trials',
    focus: 'Oxidative Stress • Neuroprotection',
  },
] as const;

export function HomeScienceSection(): React.JSX.Element {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        event.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
        event.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
      }}
    >
      <div className="home-science-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
        <ScrollReveal direction="right">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Research-Grade Protocols</span>
          <h2 className="futuristic-font mt-4 mb-6 text-3xl font-bold md:text-5xl">Science-First Engineering</h2>
          <p className="mb-8 leading-relaxed text-slate-300">
            We don&apos;t sell wellness trends. Every modality is reviewed against peer-reviewed clinical research,
            and protocol recommendations are designed to support safe, informed implementation.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {SCIENCE_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="futuristic-font text-2xl font-bold text-cyan-400">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2200} />
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.1}>
          {SCIENCE_MODALITIES.map((tech) => (
            <StaggerItem key={tech.label}>
              <motion.div
                className="h-full rounded-2xl border border-slate-700 bg-slate-800/30 p-6"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <tech.icon className="mb-3 text-cyan-400" size={28} />
                <div className="mb-1 font-bold text-white">{tech.label}</div>
                <div className="mb-2 text-xs font-medium text-cyan-400">{tech.studies}</div>
                <div className="text-[10px] leading-relaxed text-slate-500">{tech.focus}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
