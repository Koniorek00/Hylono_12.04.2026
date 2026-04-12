'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Activity,
  Droplets,
  Hexagon,
  Instagram,
  Linkedin,
  Sun,
  Wind,
  Youtube,
  Zap,
} from 'lucide-react';
import { Newsletter } from '../../../components/Newsletter';
import { openCookieSettings } from '../../lib/cookie-consent';
import { TechType } from '../../../types';
import { footerTopicalGraphSections } from '@/content/topical-graph';
import { resolveLegacyPagePath } from '../../lib/navigation';

type FooterLink = {
  label: string;
  href?: string;
  page?: string;
  tech?: TechType;
  icon?: ReactNode;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: 'Technology',
    links: [
      { label: 'Hyperbaric (HBOT)', tech: TechType.HBOT, icon: <Wind size={12} /> },
      { label: 'Pulsed EMF (PEMF)', tech: TechType.PEMF, icon: <Activity size={12} /> },
      { label: 'Red Light (RLT)', tech: TechType.RLT, icon: <Sun size={12} /> },
      {
        label: 'Hydrogen (H2)',
        tech: TechType.HYDROGEN,
        icon: <Droplets size={12} />,
      },
      { label: 'Vagus Nerve (VNS)', tech: TechType.VNS, icon: <Zap size={12} /> },
      { label: 'EWOT Training', tech: TechType.EWOT, icon: <Wind size={12} /> },
      { label: 'Cryotherapy', tech: TechType.CRYO, icon: <Activity size={12} /> },
      { label: 'Compare All', page: 'store' },
    ],
  },
  ...footerTopicalGraphSections.map((section) => ({
    title: section.title,
    links: section.links.map((link) => ({
      label: link.label,
      href: link.href,
    })),
  })),
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', page: 'privacy' },
      { label: 'Terms of Service', page: 'terms' },
      { label: 'Shipping Policy', page: 'shipping' },
      { label: 'Returns Policy', page: 'returns' },
      { label: 'Warranty', page: 'warranty' },
      { label: 'Cookie Policy', page: 'cookie-policy' },
      { label: 'Sitemap', page: 'sitemap' },
    ],
  },
];

const resolveFooterHref = (link: FooterLink): string | null => {
  if (link.href) {
    return link.href;
  }

  if (link.tech) {
    return `/product/${link.tech.toLowerCase()}`;
  }

  if (link.page) {
    return resolveLegacyPagePath(link.page, { context: 'footer', tech: link.tech });
  }

  return null;
};

const FALLBACK_YEAR = '2026';

export function Footer() {
  const year = FALLBACK_YEAR;

  const socialLinkClasses =
    'flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]';

  return (
    <footer className="relative z-[60] overflow-hidden border-t border-white/5 bg-[#050505] py-16 text-white">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2">
            <Link href="/" prefetch={false} className="group mb-6 flex items-center gap-4">
              <Hexagon
                className="text-white transition-transform duration-700 group-hover:rotate-180"
                strokeWidth={1.2}
                size={36}
              />
              <div className="flex flex-col items-start text-left">
                <span className="futuristic-font text-2xl leading-none font-bold tracking-[0.1em] text-white">
                  HYLONO
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-cyan-500/80">
                  Bio-Optimization
                </span>
              </div>
            </Link>

            <p className="mb-8 text-[10px] font-medium tracking-widest text-gray-400 uppercase">
              © {year} HYLONO SYSTEMS
            </p>

            <div className="mb-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/hylono"
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClasses}
                aria-label="Follow Hylono on Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://x.com/hylono"
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClasses}
                aria-label="Follow Hylono on X (Twitter)"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>
              <a
                href="https://www.linkedin.com/company/hylono"
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClasses}
                aria-label="Follow Hylono on LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://www.youtube.com/@hylono"
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClasses}
                aria-label="Subscribe to Hylono on YouTube"
              >
                <Youtube size={14} />
              </a>
            </div>

            <div className="max-w-[340px]">
              <Newsletter />
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="mb-5 text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const href = resolveFooterHref(link);

                  return (
                    <li key={`${section.title}-${link.label}`}>
                      {href ? (
                        <Link
                          href={href}
                          prefetch={false}
                          className="group flex items-center gap-1.5 text-[11px] tracking-wide text-gray-400 transition-colors hover:text-white"
                        >
                          {link.icon ? (
                            <span className="opacity-40 transition-opacity group-hover:opacity-100">
                              {link.icon}
                            </span>
                          ) : null}
                          {link.label}
                        </Link>
                      ) : (
                        <span className="group flex cursor-not-allowed items-center gap-1.5 text-[11px] tracking-wide text-gray-500/70">
                          {link.icon ? <span className="opacity-30">{link.icon}</span> : null}
                          {link.label}
                        </span>
                      )}
                    </li>
                  );
                })}

                {section.title === 'Legal' ? (
                  <li>
                    <button
                      onClick={openCookieSettings}
                      className="group flex min-h-11 items-center gap-1.5 text-[11px] tracking-wide text-gray-400 transition-colors hover:text-white"
                    >
                      Cookie Settings
                    </button>
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </footer>
  );
}
