"use client";

import React, { useState, useRef, useEffect } from 'react';
import { List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { PageNavigatorDropdown } from '../ui/BreadcrumbBar/PageNavigatorDropdown';
import {
  BreadcrumbNav,
  type BreadcrumbItem,
} from '../ui/BreadcrumbBar/BreadcrumbNav';

interface BreadcrumbsProps {
  pathParts: string[];
}

const capitalizeWords = (str: string): string =>
  str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const PAGE_LABELS: Record<string, string> = {
  home: 'Concept',
  product: 'Store',
  'wellness-planner': 'Wellness Planner',
  dashboard: 'Portal',
  store: 'Store',
  blog: 'Science & Research',
  evidence: 'Clinical Library',
  'advisory-board': 'Medical Advisory',
  outcomes: 'Bio-Tracking',
  checkout: 'Checkout',
  privacy: 'Privacy',
  terms: 'Terms',
  shipping: 'Shipping',
  // Product tech route slugs are lowercase (e.g. /product/hbot)
  hbot: 'Hyperbaric',
  pemf: 'PEMF',
  rlt: 'Red Light',
  hydrogen: 'Hydrogen',
  ewot: 'EWOT',
  vns: 'Vagus Nerve',
  cryo: 'Cryotherapy',
  ems: 'EMS',
  hypoxic: 'Hypoxic Training',
  sauna_blanket: 'Sauna Blanket',
};

const dropdownEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.95,
    transition: { duration: 0.15, ease: dropdownEase },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: dropdownEase },
  },
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathParts }) => {
  const parts = pathParts.filter((part) => part !== '');
  const reduced = useReducedMotion();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Concept', href: '/' },
    ...parts.map((part, index) => {
      const label = PAGE_LABELS[part] || capitalizeWords(part);
      const isLast = index === parts.length - 1;
      const normalizedTarget = parts.slice(0, index + 1).join('/');
      const href = normalizedTarget === 'product' ? '/store' : `/${normalizedTarget}`;

      return {
        label,
        href,
        isCurrent: isLast,
      };
    }),
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'home')) {
    return null;
  }

  return (
    <nav aria-label="Page breadcrumb and navigation" className="futuristic-font mx-auto flex max-w-7xl items-center justify-between px-6 text-[13px] font-medium tracking-[0.2em] text-slate-400 uppercase">
      <div className="flex items-center space-x-2">
        <BreadcrumbNav items={breadcrumbItems} />
      </div>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={`
            flex items-center gap-1.5 rounded-lg px-3 py-1.5
            text-[11px] font-medium tracking-[0.15em] uppercase
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2
            ${
              isDropdownOpen
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }
          `}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          aria-label="Page sections navigation"
        >
          <List size={12} aria-hidden="true" />
          <span className="hidden sm:inline">On This Page</span>
          <span className="sm:hidden">Navigate</span>
          <motion.span
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
          >
            <ChevronDown size={12} aria-hidden="true" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              variants={reduced ? undefined : dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="
                absolute right-0 mt-2
                w-[280px] max-w-[calc(100vw-48px)]
                overflow-hidden rounded-xl border border-slate-200
                bg-white/95 shadow-xl shadow-slate-900/15 backdrop-blur-md
              "
              role="menu"
              aria-label="Page sections"
            >
              <PageNavigatorDropdown onSectionClick={() => setIsDropdownOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};