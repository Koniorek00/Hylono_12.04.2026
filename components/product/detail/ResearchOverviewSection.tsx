'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MedicalDisclaimer } from '../../shared/MedicalDisclaimer';

interface ResearchStat {
  value: string;
  label: string;
  sub: string;
}

interface ResearchApplication {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface ResearchOverviewSectionProps {
  themeLabel: string;
  themeColorClass: string;
  title: string;
  intro: string;
  stats: ResearchStat[];
  supportTitle: string;
  applications: ResearchApplication[];
  hoverBorderClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

export function ResearchOverviewSection({
  themeLabel,
  themeColorClass,
  title,
  intro,
  stats,
  supportTitle,
  applications,
  hoverBorderClass,
  iconBgClass,
  iconColorClass,
}: ResearchOverviewSectionProps): React.ReactElement {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className={`${themeColorClass} text-[10px] font-bold uppercase tracking-widest block mb-2`}>
            {themeLabel}
          </span>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">{intro}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm"
            >
              <div className={`${themeColorClass} text-3xl font-black mb-1`}>{stat.value}</div>
              <div className="font-bold text-slate-900 text-sm mb-0.5">{stat.label}</div>
              <div className="text-xs text-slate-400">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-10">
          <span className={`${themeColorClass} text-[10px] font-bold uppercase tracking-widest block mb-2`}>
            Research-Backed Applications
          </span>
          <h3 className="text-3xl font-bold text-slate-900">{supportTitle}</h3>
          <MedicalDisclaimer type="research" compact className="mt-3 text-center max-w-2xl mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {applications.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl p-5 border border-slate-100 ${hoverBorderClass} hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 ${iconBgClass} rounded-xl flex items-center justify-center ${iconColorClass} shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}