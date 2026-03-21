'use client';

import React from 'react';
import { MarqueeTicker } from '../shared/MarqueeTicker';

export function HomeBrandTickerSection(): React.JSX.Element {
  return (
    <>
      <div className="overflow-hidden border-t border-slate-800 bg-slate-900 py-4">
        <MarqueeTicker
          items={[
            <span
              key="o"
              className="text-xs font-bold uppercase tracking-[0.4em] text-white/60"
            >
              Oxygen
            </span>,
            <span
              key="h"
              className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-400/80"
            >
              Hydrogen
            </span>,
            <span
              key="l"
              className="text-xs font-bold uppercase tracking-[0.4em] text-amber-400/80"
            >
              Light
            </span>,
            <span
              key="s"
              className="text-xs font-bold uppercase tracking-[0.4em] text-purple-400/80"
            >
              Signal
            </span>,
            <span
              key="p"
              className="text-xs font-bold uppercase tracking-[0.4em] text-white/60"
            >
              Protocol-as-Product
            </span>,
            <span
              key="r"
              className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400/80"
            >
              Regeneration
            </span>,
          ]}
          speed="slow"
          separator={<span className="mx-8 text-lg text-white/20">·</span>}
        />
      </div>

      <div className="overflow-hidden border-b border-slate-800/60 bg-slate-950 py-4">
        <MarqueeTicker
          direction="right"
          items={[
            <span
              key="c1"
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500"
            >
              Research Hub
            </span>,
            <span
              key="c2"
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500"
            >
              Guided Protocols
            </span>,
            <span
              key="c3"
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500"
            >
              Rental Planning
            </span>,
            <span
              key="c4"
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-600/60"
            >
              HBOT · PEMF · RLT · H2
            </span>,
            <span
              key="c5"
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500"
            >
              Support Coverage
            </span>,
            <span
              key="c6"
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500"
            >
              Warranty Guidance
            </span>,
            <span
              key="c7"
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500"
            >
              Returns Policy
            </span>,
          ]}
          speed="slow"
          separator={<span className="mx-6 text-sm text-slate-700">-</span>}
        />
      </div>
    </>
  );
}
