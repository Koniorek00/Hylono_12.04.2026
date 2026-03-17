'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Star, Zap } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../shared/ScrollReveal';
import { AnimatedCounter } from '../shared/AnimatedCounter';

interface HomeValuePropSectionProps {
  onNavigate: (path: string) => void;
}

export function HomeValuePropSection({ onNavigate }: HomeValuePropSectionProps): React.JSX.Element {
  return (
    <section className="py-24 bg-white relative overflow-hidden grain-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Why Hylono</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 text-gray-900">Built Different</h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[160px]" staggerDelay={0.08}>
          <StaggerItem className="md:col-span-5 md:row-span-2">
            <div className="bento-tile h-full p-10 flex flex-col justify-between group cursor-default">
              <Shield
                className="text-yellow-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500"
                size={48}
                strokeWidth={1}
              />
              <div>
                <h3 className="text-2xl font-bold mb-3 futuristic-font text-gray-900">Verified Trust</h3>
                <p className="text-gray-500 font-light leading-relaxed text-sm">
                  We rigorously filter global innovation—only devices with peer-reviewed evidence,
                  medical-grade certifications, and real-world efficacy enter our ecosystem.
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-4 md:row-span-1">
            <div className="bento-tile h-full p-8 flex items-center gap-6 group cursor-default">
              <Zap
                className="text-purple-500 shrink-0 group-hover:scale-110 transition-transform duration-300"
                size={36}
                strokeWidth={1.5}
              />
              <div>
                <h3 className="text-lg font-bold futuristic-font text-gray-900">Protocol Based</h3>
                <p className="text-gray-500 font-light text-sm">
                  Hardware is the vessel. Protocol is the system that may support better outcomes.
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-3 md:row-span-1">
            <div className="bento-tile h-full p-8 flex flex-col justify-between bg-slate-900 border-slate-900 text-white group cursor-default">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Users</span>
              <div className="text-4xl font-black text-cyan-400 futuristic-font">
                <AnimatedCounter end={2500} suffix="+" />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-4 md:row-span-1">
            <div className="bento-tile h-full p-8 flex items-center gap-6 group cursor-default bg-gradient-to-br from-cyan-50 to-white">
              <Star
                className="text-cyan-500 shrink-0 group-hover:scale-110 transition-transform duration-300"
                size={36}
                strokeWidth={1.5}
              />
              <div>
                <h3 className="text-lg font-bold futuristic-font text-gray-900">Access Layer</h3>
                <p className="text-gray-500 font-light text-sm">Elite tech democratization. Rent from €149/mo.</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-3 md:row-span-1">
            <div className="bento-tile h-full p-8 flex flex-col justify-between group cursor-default">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Studies Reviewed</span>
              <div className="text-4xl font-black text-slate-900 futuristic-font">
                <AnimatedCounter end={87} suffix="+" />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-7 md:row-span-1">
            <div
              className="bento-tile h-full p-8 flex items-center justify-between group cursor-pointer bg-gradient-to-r from-slate-900 to-slate-800 border-slate-900"
              onClick={() => onNavigate('rental')}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Rental Model</p>
                <h3 className="text-xl font-bold text-white">Start renting from €149/month →</h3>
              </div>
              <motion.div
                className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
                whileHover={{ scale: 1.15 }}
              >
                <ArrowRight className="text-white" size={20} />
              </motion.div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
