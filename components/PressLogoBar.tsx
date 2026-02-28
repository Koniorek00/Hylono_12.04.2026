import React from 'react';
import { useReducedMotion } from 'framer-motion';

interface Pub { name: string; cls: string; }

const PUBS: Pub[] = [
  { name: 'Forbes',           cls: 'font-black tracking-tight text-lg' },
  { name: 'Men’s Health',     cls: 'font-bold tracking-wide text-sm uppercase' },
  { name: 'Vogue',            cls: 'font-black italic tracking-widest text-xl' },
  { name: 'CNN Health',       cls: 'font-black tracking-tight text-base' },
  { name: 'TechCrunch',       cls: 'font-extrabold tracking-tight text-base' },
  { name: 'Business Insider', cls: 'font-bold tracking-wide text-sm' },
  { name: 'GQ',               cls: 'font-black tracking-widest text-2xl' },
  { name: 'The Guardian',     cls: 'font-bold tracking-wide text-sm' },
  { name: 'Wired',            cls: 'font-black italic tracking-tight text-xl' },
  { name: 'Vice',             cls: 'font-black tracking-widest text-xl' },
];

/**
 * PressLogoBar
 * Auto-scrolling marquee of publication wordmarks on dark slate-900 strip.
 */
export const PressLogoBar: React.FC = () => {
  const reduced = useReducedMotion();
  const items = [...PUBS, ...PUBS];
  return (
    <section
      aria-label="Press coverage"
      className="relative bg-slate-900 border-t border-b border-slate-800 overflow-hidden py-7"
    >
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="flex items-center">
        <div className="shrink-0 pl-8 pr-6 z-20 flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500 whitespace-nowrap">
            As seen in
          </span>
          <div className="w-px h-7 bg-slate-700" />
        </div>
        <div className="overflow-hidden flex-1">
          <div
            aria-hidden="true"
            className="flex items-center gap-14"
            style={
              reduced
                ? {}
                : {
                    width: "max-content",
                    animation: "pressLogoScroll 36s linear infinite",
                  }
            }
          >
            {items.map((pub, i) => (
              <span
                key={pub.name + i}
                className={
                  pub.cls +
                  ' text-white/25 hover:text-white/90 transition-all duration-500' +
                  ' cursor-default whitespace-nowrap select-none grayscale hover:grayscale-0'
                }
              >
                {pub.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pressLogoScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*='pressLogoScroll'] { animation: none !important; }
        }
      `}</style>
    </section>
  );
};
