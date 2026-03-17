'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Sparkles, Truck } from 'lucide-react';

interface TechDetailDeliverySectionProps {
  dataName: string;
  showDelivery: boolean;
  onToggleDelivery: () => void;
}

export function TechDetailDeliverySection({
  dataName,
  showDelivery,
  onToggleDelivery,
}: TechDetailDeliverySectionProps) {
  return (
    <section id="delivery" className="py-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6">
        <button
          type="button"
          onClick={onToggleDelivery}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
              <Truck size={20} />
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-900 block">Delivery and Installation Information</span>
              <span className="text-xs text-slate-500">
                Shipping timelines, white-glove setup and what to expect on delivery day
              </span>
            </div>
          </div>
          {showDelivery ? (
            <ChevronUp className="text-slate-400" />
          ) : (
            <ChevronDown className="text-slate-400" />
          )}
        </button>
        <AnimatePresence>
          {showDelivery && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-6 bg-white rounded-2xl border border-slate-200 space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Truck size={14} className="text-cyan-500" /> Estimated Delivery Times
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        region: 'European Union',
                        days: '5-10 business days',
                        note: 'Most orders arrive within 7 days',
                      },
                      {
                        region: 'United Kingdom',
                        days: '7-14 business days',
                        note: 'Customs clearance may add 1-2 days',
                      },
                      {
                        region: 'United States',
                        days: '10-21 business days',
                        note: 'Express shipping available at checkout',
                      },
                    ].map((region) => (
                      <div
                        key={region.region}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div className="font-bold text-slate-900 text-sm">{region.region}</div>
                        <div className="text-cyan-600 font-bold text-sm mt-1">{region.days}</div>
                        <div className="text-xs text-slate-400 mt-1">{region.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles size={14} className="text-cyan-500" /> White Glove Installation Service
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Every {dataName} order includes our premium white-glove delivery service at no
                    extra cost. Our certified technicians handle everything from unboxing and placement
                    to full system calibration and your first guided session.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Professional unpacking and debris removal',
                      'Optimal placement consultation',
                      'Full system setup and calibration',
                      'Safety briefing and protocol walkthrough',
                      'First session guided by a trained specialist',
                      '30-day follow-up support call included',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar size={14} className="text-cyan-500" /> What Happens on Delivery Day
                  </h4>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        time: 'Morning',
                        event: 'Our logistics team calls to confirm your 2-hour arrival window',
                      },
                      {
                        time: 'On arrival',
                        event:
                          'Technicians unbox and begin systematic setup in your chosen room',
                      },
                      {
                        time: 'After 2 hrs',
                        event:
                          'System calibrated and ready - your specialist guides your first session',
                      },
                      {
                        time: 'Same evening',
                        event: 'Digital setup guide and protocol library sent to your email',
                      },
                    ].map((step) => (
                      <div key={step.time} className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl">
                        <span className="text-xs font-black text-cyan-600 uppercase tracking-wider w-24 shrink-0 mt-0.5">
                          {step.time}
                        </span>
                        <span className="text-sm text-slate-600">{step.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100 flex items-start gap-3">
                  <div className="p-1.5 bg-cyan-100 rounded-lg text-cyan-600 shrink-0">
                    <Truck size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-cyan-900 block">Track Your Order</span>
                    <span className="text-xs text-cyan-700">
                      Once shipped, you will receive a tracking link via email and SMS. Our support
                      team is available 24/7 for delivery queries.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}