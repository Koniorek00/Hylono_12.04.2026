"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { PageNavigatorDropdown } from '../ui/BreadcrumbBar/PageNavigatorDropdown';
import {
  BreadcrumbNav,
  type BreadcrumbItem,
} from '../ui/BreadcrumbBar/BreadcrumbNav';

interface BreadcrumbsProps {
  pathParts: string[];
  showPageNavigator?: boolean;
}

const capitalizeWords = (str: string): string =>
  str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
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

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  pathParts,
  showPageNavigator = true,
}) => {
  const parts = pathParts.filter((part) => part !== '');
  const reduced = useReducedMotion();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backToTopButtonClassName =
    'flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition-[color,background-color,border-color,box-shadow] duration-200 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] sm:font-medium sm:tracking-[0.15em] sm:uppercase';
  const pageNavigatorButtonClassName = [
    'flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5',
    'text-[11px] font-medium tracking-[0.15em] uppercase',
    'transition-[color,background-color,border-color,box-shadow] duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
    isDropdownOpen
      ? 'border-slate-900 bg-slate-900 text-white'
      : 'text-slate-500 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700',
  ].join(' ');

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
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

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'home')) {
    return null;
  }

  return (
    <nav
      aria-label="Page breadcrumb and navigation"
      className="futuristic-font mx-auto flex max-w-7xl flex-col gap-2 px-4 text-[11px] font-medium tracking-[0.08em] text-slate-500 normal-case sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:text-[13px] sm:tracking-[0.16em] sm:uppercase"
    >
      <div className="min-w-0 flex-1">
        <BreadcrumbNav items={breadcrumbItems} showHomeIcon={false} />
      </div>

      {showPageNavigator ? (
        <div
          className="flex w-full shrink-0 items-center justify-end gap-2 self-start rounded-xl border border-slate-200 bg-white px-1 py-1 shadow-sm shadow-slate-200/60 sm:ml-4 sm:w-auto sm:self-auto"
          style={{
            backgroundColor: '#ffffff',
            opacity: 1,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
        >
          <button
            type="button"
            onClick={handleScrollToTop}
            className={backToTopButtonClassName}
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp size={12} aria-hidden="true" />
            <span className="hidden sm:inline">Back to top</span>
          </button>

          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={pageNavigatorButtonClassName}
              aria-expanded={isDropdownOpen}
              aria-controls={isDropdownOpen ? 'breadcrumb-page-sections' : undefined}
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
                  id="breadcrumb-page-sections"
                  variants={reduced ? undefined : dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="
                    absolute right-0 mt-2
                    w-72 max-w-[90vw]
                    overflow-hidden rounded-xl border border-slate-200
                    bg-white shadow-xl shadow-slate-900/15
                  "
                  style={{
                    backgroundColor: '#ffffff',
                    opacity: 1,
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                  }}
                  aria-label="Page sections"
                >
                  <PageNavigatorDropdown onSectionClick={() => setIsDropdownOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : null}
    </nav>
  );
};
