'use client';

import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

interface TimelinePhase {
  phase: string;
  timeframe: string;
  outcomes: string[];
}

interface TechDetailTimelineSectionProps {
  phases: TimelinePhase[];
  accentColor: string;
  themeColor: string;
}

export function TechDetailTimelineSection({
  phases,
  accentColor,
  themeColor,
}: TechDetailTimelineSectionProps) {
  return (
    <section id="what-to-expect" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest block mb-2">
            Expected Results
          </span>
          <h2 className="text-3xl font-bold text-slate-900">What to Expect</h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm">
            Your progress unfolds in phases. Consistency is the key variable.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-cyan-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-8 h-8 ${accentColor} rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0`}
                >
                  {idx + 1}
                </div>
                <div>
                  <span className="font-black text-slate-900 text-sm block">{phase.phase}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${themeColor}`}>
                    {phase.timeframe}
                  </span>
                </div>
              </div>
              <ul className="space-y-2">
                {phase.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6 italic">
          Results are based on consistent use and may vary. Individual response depends on baseline
          health, frequency of use, and protocol adherence. This is not a promise of a specific
          outcome.
        </p>
      </div>
    </section>
  );
}
