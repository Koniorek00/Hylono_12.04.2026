'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { batch3HomeContent } from '../../content/batch3';

interface HomeJumpstartSectionProps {
  homepageEnhancementsEnabled: boolean;
  lowestRental: number;
  onNavigate: (path: string) => void;
}

export function HomeJumpstartSection({
  homepageEnhancementsEnabled,
  lowestRental,
  onNavigate,
}: HomeJumpstartSectionProps): React.JSX.Element | null {
  if (!homepageEnhancementsEnabled) {
    return null;
  }

  return (
    <>
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 futuristic-font">
              {batch3HomeContent.jumpstart.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batch3HomeContent.jumpstart.cards.map((card) => (
              <button
                key={card.title}
                onClick={() => onNavigate(card.path)}
                className="text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-6 transition-colors"
              >
                <div className="text-2xl mb-3" aria-hidden>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 futuristic-font">
            {batch3HomeContent.popularGoals.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {batch3HomeContent.popularGoals.tiles.map((goal) => (
              <button
                key={goal.title}
                onClick={() => onNavigate(goal.path)}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 transition-colors text-center"
              >
                <div className="text-xl mb-2" aria-hidden>
                  {goal.icon}
                </div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-700">{goal.title}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-3 futuristic-font">{batch3HomeContent.rentalPromo.title}</h2>
              <p className="text-slate-300 text-sm mb-4 max-w-2xl">
                {batch3HomeContent.rentalPromo.description} From €{lowestRental}/mo.
              </p>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {batch3HomeContent.rentalPromo.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-400" /> {bullet}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onNavigate(batch3HomeContent.rentalPromo.ctaPath)}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs uppercase tracking-widest font-bold"
            >
              {batch3HomeContent.rentalPromo.cta}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
