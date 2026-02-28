import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle, XCircle, Shield, RotateCcw, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Step { step: string; title: string; desc: string; color: string; }

const HOW_STEPS: Step[] = [
  { step: '01', title: 'Order Your Stack', desc: 'Select protocol, choose 30-day trial at checkout.', color: 'bg-cyan-500' },
  { step: '02', title: 'Receive and Unbox', desc: 'Device arrives in 3-5 business days with setup guide.', color: 'bg-cyan-500' },
  { step: '03', title: 'Use for 30 Days', desc: 'Follow your personalised protocol. Track biomarkers.', color: 'bg-cyan-500' },
  { step: '04', title: 'No Change? Contact Us', desc: 'If no measurable difference, reach out before day 30.', color: 'bg-amber-500' },
  { step: '05', title: 'Full Refund', desc: 'We arrange free collection and process your full refund.', color: 'bg-emerald-500' },
];
const COVERED = [
  'All devices purchased directly through hylono.com',
  'Devices used per the included protocol guide',
  'Returns requested within 30 calendar days of delivery',
  'Devices in original condition (normal use wear accepted)',
  'Any modality: HBOT, PEMF, Red Light, Hydrogen, or Full Stack',
];

const NOT_COVERED = [
  'Devices purchased from third-party resellers',
  'Returns requested after the 30-day window',
  'Devices with user-caused physical damage',
  'Consumables and disposable accessories',
  'Customised or bespoke protocol packages',
];

const TESTIMONIALS = [
  { quote: "I was sceptical, so the guarantee was the only reason I pulled the trigger. Ended up keeping it. Results were undeniable within 2 weeks.", name: "James O.", role: "Biohacker, London", initials: "JO", gradient: "from-cyan-500 to-blue-600" },
  { quote: "The peace of mind was huge. Knowing I could return it removed all the risk. Month four and I never looked back.", name: "Lena M.", role: "Functional Medicine Coach", initials: "LM", gradient: "from-purple-500 to-pink-600" },
];

/**
 * GuaranteePage
 * Risk-free 30-day trial guarantee landing page.
 * Sections: Hero, Promise, How It Works, Coverage, Testimonials, CTA.
 */
export const GuaranteePage: React.FC = () => {
  const reduced = useReducedMotion();
  return (
    <div className="min-h-screen bg-white">
      {/* ---- HERO ---- */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Shield size={14} />
              Risk-Free Trial
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 futuristic-font leading-none">
              30-Day Transformation
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Guarantee</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              If you don’t feel a measurable difference in 30 days, we’ll collect the device and refund every penny. No small print. No hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-100 transition-colors shadow-xl"
              >
                <Star size={16} className="text-cyan-500" />
                Start Risk-Free
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:border-white/40 transition-colors"
              >
                Ask a Question
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ---- OUR PROMISE ---- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Section 01</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4 futuristic-font">Our Promise</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            We believe so deeply in our technology that we’re willing to back every purchase with a no-questions-asked return policy. Here’s exactly what we guarantee.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Device Quality", desc: "Every device is CE-marked, ISO-certified, and tested before dispatch. If it arrives damaged, we replace it immediately." },
              { icon: RotateCcw, title: "Measurable Results", desc: "If you follow the protocol for 30 days and notice no measurable change in your tracked metrics, we refund 100%." },
              { icon: Clock, title: "Simple Process", desc: "No lengthy forms, no disputes. One email to support@hylono.com and we handle everything from collection to refund." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                  <item.icon size={22} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ---- HOW IT WORKS ---- */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Section 02</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 futuristic-font">How It Works</h2>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-cyan-300 via-cyan-500 to-emerald-500 md:hidden" />
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-cyan-300 via-cyan-500 to-emerald-500" />
            <div className="grid md:grid-cols-5 gap-6">
              {HOW_STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.45 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className={step.color + " w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg mb-4 z-10"}>
                    {step.step}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ---- COVERAGE DETAILS ---- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">The Fine Print (It is fair)</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 futuristic-font">What Is Covered</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-5 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-600" />Covered</h3>
              <ul className="space-y-3">
                {COVERED.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-emerald-800">
                    <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5 flex items-center gap-2"><XCircle size={18} className="text-slate-500" />Not Covered</h3>
              <ul className="space-y-3">
                {NOT_COVERED.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <XCircle size={15} className="text-slate-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* 5-Year Warranty Note */}
          <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white flex items-center gap-5">
            <Shield size={32} className="text-cyan-400 shrink-0" />
            <div>
              <p className="font-bold">5-Year Device Warranty</p>
              <p className="text-slate-400 text-sm mt-1">Separate from the 30-day return policy, all devices carry a 5-year manufacturer’s warranty against defects. This covers hardware failures, not normal wear.</p>
            </div>
          </div>
        </div>
      </section>
      {/* ---- TESTIMONIALS ---- */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Section 03</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 futuristic-font">What Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
              >
                <p className="text-slate-600 italic leading-relaxed mb-6">“{t.quote}”</p>
                <div className="flex items-center gap-4">
                  <div className={"w-11 h-11 rounded-full bg-gradient-to-br " + t.gradient + " flex items-center justify-center text-white font-bold text-sm"}>{t.initials}</div>
                  <div><p className="font-bold text-slate-900">{t.name}</p><p className="text-sm text-slate-500">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ---- FINAL CTA ---- */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Shield size={48} className="text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 futuristic-font">Start Risk-Free Today</h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
              Join 2,500+ people who have already transformed their performance with Hylono. You have absolutely nothing to lose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-100 transition-colors shadow-xl">
                <Star size={16} className="text-cyan-500" />
                Start Risk-Free
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:border-white/40 transition-colors">
                Ask a Question
                <ArrowRight size={14} />
              </Link>
            </div>
            <p className="mt-6 text-slate-500 text-sm">30-day return policy · 5-year warranty · Free collection · Full refund</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
