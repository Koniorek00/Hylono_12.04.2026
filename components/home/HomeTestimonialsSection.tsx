'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../shared/ScrollReveal';

interface DecisionSupportCard {
  title: string;
  description: string;
  cta: string;
  href: string;
  Icon: typeof BookOpen;
}

const DECISION_SUPPORT_CARDS: DecisionSupportCard[] = [
  {
    title: 'Review the evidence before you commit',
    description:
      'Open the research hub to see study context, limitations, and the product routes connected to each topic.',
    cta: 'Open research',
    href: '/research',
    Icon: BookOpen,
  },
  {
    title: 'Start with rental when you want lower risk',
    description:
      'Compare monthly plans, onboarding expectations, and the return-or-buy-later path before taking on the full purchase price.',
    cta: 'See rental plans',
    href: '/rental',
    Icon: Truck,
  },
  {
    title: 'Verify the policy pages that protect the order',
    description:
      'Check shipping, returns, warranty, and support pages from the same flow you use to compare products.',
    cta: 'Review policies',
    href: '/returns',
    Icon: ShieldCheck,
  },
  {
    title: 'Talk to a real person when the choice is unclear',
    description:
      'Use contact when you need help with fit, delivery planning, financing questions, or a clinic / B2B request.',
    cta: 'Contact Hylono',
    href: '/contact',
    Icon: MessageCircle,
  },
];

export const HomeTestimonialsSection: React.FC = () => {
  return (
    <section className="border-y border-slate-100 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Decision Support
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-5xl futuristic-font">
            What Helps People Move Forward
          </h2>
          <p className="mt-4 text-slate-500">
            Instead of anonymous testimonials, Hylono keeps the next step visible: evidence when
            claims are discussed, policy pages when money is involved, and direct contact when you
            want a recommendation.
          </p>
        </ScrollReveal>

        <StaggerContainer className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4" staggerDelay={0.1}>
          {DECISION_SUPPORT_CARDS.map((card) => (
            <StaggerItem key={card.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="flex h-full flex-col rounded-3xl border border-slate-100 bg-slate-50 p-7 transition-all hover:shadow-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
                  <card.Icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                >
                  {card.cta}
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
