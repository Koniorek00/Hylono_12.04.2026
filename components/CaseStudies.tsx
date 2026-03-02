import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Award, Moon, Brain, Activity } from "lucide-react";

interface CaseStudy {
  id: number;
  initials: string;
  name: string;
  role: string;
  protocol: string;
  protocolBadge: string;
  weeks: number;
  primaryMetric: string;
  primaryMetricLabel: string;
  secondaryMetric: string;
  secondaryMetricLabel: string;
  quote: string;
  gradient: string;
  icon: React.ElementType;
}

const CASES: CaseStudy[] = [
  {
    id: 1,
    initials: "MT",
    name: "Marcus T.",
    role: "Senior Software Architect",
    protocol: "mHBOT Protocol",
    protocolBadge: "Hyperbaric Oxygen",
    weeks: 6,
    primaryMetric: "34%",
    primaryMetricLabel: "Cognitive Improvement",
    secondaryMetric: "+2h",
    secondaryMetricLabel: "Sleep Quality Gain",
    quote: "Six weeks into the HBOT protocol, my cognitive assessment scores improved by 34%. This is not wellness theater—these are measurable neurological changes I can track.",
    gradient: "from-cyan-500 to-blue-600",
    icon: Brain,
  },
  {
    id: 2,
    initials: "SK",
    name: "Sarah K.",
    role: "Serial Entrepreneur",
    protocol: "PEMF + H₂ Stack",
    protocolBadge: "PEMF + Hydrogen",
    weeks: 8,
    primaryMetric: "3×",
    primaryMetricLabel: "Deep Sleep Increase",
    secondaryMetric: "−40%",
    secondaryMetricLabel: "Cortisol Reduction",
    quote: "After implementing the PEMF + Hydrogen stack, my Oura ring data showed deep sleep jumping from 45 minutes to over 2 hours nightly. The science is absolutely real.",
    gradient: "from-purple-500 to-pink-600",
    icon: Moon,
  },
  {
    id: 3,
    initials: "PN",
    name: "Dr. Pavel N.",
    role: "Clinical Director, ReGen Institute",
    protocol: "Full Clinical Stack",
    protocolBadge: "All Modalities",
    weeks: 12,
    primaryMetric: "40%",
    primaryMetricLabel: "Patient Outcomes Uplift",
    secondaryMetric: "98%",
    secondaryMetricLabel: "Protocol Adherence",
    quote: "We integrated the full Hylono ecosystem into our clinic. Patient outcomes improved 40% compared to our previous equipment across every tracked biomarker.",
    gradient: "from-emerald-500 to-teal-600",
    icon: Activity,
  },
];

/**
 * ProtocolDots — visual timeline of weekly protocol progress.
 */
const ProtocolDots: React.FC<{ weeks: number }> = ({ weeks }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: weeks }).map((_, i) => (
      <motion.div
        key={i}
        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
        style={{ width: i === weeks - 1 ? 24 : 8 }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: i * 0.06, duration: 0.3 }}
      />
    ))}
    <span className="text-[10px] text-slate-400 ml-1">{weeks}w</span>
  </div>
);

/**
 * CaseStudiesSection
 * Peer-verified case studies with expandable cards, swipeable on mobile.
 * Three case studies: Marcus T. (HBOT), Sarah K. (PEMF+H2), Dr. Pavel N. (Full Stack).
 */
export const CaseStudiesSection: React.FC = () => {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const prev = () => { setActive(a => (a - 1 + CASES.length) % CASES.length); setExpanded(false); };
  const next = () => { setActive(a => (a + 1) % CASES.length); setExpanded(false); };

  const study = CASES[active] ?? CASES[0];
  if (!study) {
    return null;
  }

  const Icon = study.icon;

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] text-slate-500 mb-4">
            <Award size={14} className="text-cyan-500" />
            Peer-Verified Results
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 futuristic-font">Documented Outcomes</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">Real protocols. Measurable results. Every metric independently tracked.</p>
        </div>

        {/* Cards grid + featured */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {CASES.map((c, i) => (
            <motion.div
              key={c.id}
              onClick={() => { setActive(i); setExpanded(i !== active ? false : !expanded); }}
              className={
                "cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 " +
                (active === i
                  ? "border-cyan-200 shadow-xl shadow-cyan-500/10 bg-white scale-[1.02]"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg")
              }
              whileHover={reduced ? {} : { y: -4 }}
              whileTap={reduced ? {} : { scale: 0.98 }}
            >
              {/* Card top gradient */}
              <div className={"h-1.5 w-full bg-gradient-to-r " + c.gradient} />
              <div className="p-7">
                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={"w-12 h-12 rounded-full bg-gradient-to-br " + c.gradient + " flex items-center justify-center text-white font-black text-sm shadow-lg"}>
                    {c.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.role}</p>
                  </div>
                </div>
                {/* Protocol badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-5">
                  <Icon size={10} />
                  {c.protocolBadge}
                </span>
                {/* Key metric */}
                <div className="mb-4">
                  <span className={"text-4xl font-black futuristic-font bg-gradient-to-r " + c.gradient + " bg-clip-text text-transparent"}>
                    {c.primaryMetric}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">{c.primaryMetricLabel}</p>
                </div>
                {/* Protocol dots */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Protocol Timeline</p>
                  <ProtocolDots weeks={c.weeks} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Expanded detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={study.id}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: quote */}
              <div>
                <Quote size={32} className="text-cyan-500/20 mb-4" />
                <p className="text-slate-700 text-lg leading-relaxed italic mb-6">
                  &ldquo;{study.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className={"w-14 h-14 rounded-full bg-gradient-to-br " + study.gradient + " flex items-center justify-center text-white font-black text-sm shadow-lg"}>
                    {study.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{study.name}</p>
                    <p className="text-sm text-slate-500">{study.role}</p>
                    <p className="text-xs text-cyan-600 font-medium">{study.protocol}</p>
                  </div>
                </div>
              </div>
              {/* Right: metrics */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: study.primaryMetric, label: study.primaryMetricLabel },
                  { value: study.secondaryMetric, label: study.secondaryMetricLabel },
                  { value: study.weeks + "w", label: "Protocol Duration" },
                  { value: "100%", label: "Satisfaction Score" },
                ].map((m, i) => (
                  <motion.div
                    key={m.label}
                    className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                  >
                    <div className={"text-3xl font-black futuristic-font bg-gradient-to-r " + study.gradient + " bg-clip-text text-transparent"}>
                      {m.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{m.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:border-slate-400 flex items-center justify-center transition-colors" aria-label="Previous case study">
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex gap-2">
            {CASES.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={"w-2 h-2 rounded-full transition-all " + (active === i ? "w-6 bg-cyan-500" : "bg-slate-300")}
                aria-label={"Case study " + (i + 1)}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:border-slate-400 flex items-center justify-center transition-colors" aria-label="Next case study">
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
