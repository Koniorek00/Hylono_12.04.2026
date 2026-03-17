"use client";

/**
 * BreadcrumbBar — Navigation bar with breadcrumbs and page navigator dropdown
 * 
 * Features:
 * - Left side: Breadcrumb navigation trail
 * - Right side: "On This Page" dropdown with section navigation
 * - Symmetric spacing (equal margins on both sides)
 * - Fixed position below navbar
 * - Responsive design (collapses on mobile)
 * - WCAG compliant
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { ChevronDown, List } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { PageNavigatorDropdown } from './PageNavigatorDropdown';

export interface BreadcrumbBarProps {
  /** Breadcrumb items to display */
  breadcrumbs?: BreadcrumbItem[];
  /** CSS selector for page sections to navigate */
  sectionSelector?: string;
  /** Additional class names */
  className?: string;
}

// Default breadcrumbs for HERO-4.6T page
const DEFAULT_BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'HERO-4.6T', href: '/HERO-4.6T', isCurrent: true },
];

// Animation variants
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

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  breadcrumbs = DEFAULT_BREADCRUMBS,
  sectionSelector,
  className = '',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  // Close dropdown on outside click
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

  // Close dropdown on Escape
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

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <div
      className={`
        fixed top-[72px] left-0 right-0 z-40
        bg-slate-50/95 backdrop-blur-md
        border-b border-slate-200/80
        ${className}
      `}
      role="navigation"
      aria-label="Page navigation"
    >
      <div className="max-w-[1200px] w-full mx-auto px-6 h-[40px] flex items-center justify-between">
        {/* Left: Breadcrumb navigation */}
        <BreadcrumbNav items={breadcrumbs} />

        {/* Right: Page Navigator dropdown */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className={`
              flex items-center gap-2 px-3 py-1.5
              text-sm font-medium rounded-lg
              ui-transition-fast
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2
              ${
                isDropdownOpen
                  ? 'bg-cyan-700 text-white'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
              }
            `}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            aria-label="Page sections navigation"
          >
            <List size={14} aria-hidden="true" />
            <span className="hidden sm:inline">On This Page</span>
            <span className="sm:hidden">Navigate</span>
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            >
              <ChevronDown size={14} aria-hidden="true" />
            </motion.span>
          </button>

          {/* Dropdown panel */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                ref={dropdownRef}
                variants={reduced ? undefined : dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`
                  absolute right-0 mt-2
                  w-[280px] max-w-[calc(100vw-48px)]
                  bg-white/95 backdrop-blur-md
                  border border-slate-200
                  rounded-xl shadow-xl shadow-slate-900/15
                  overflow-hidden
                `}
                role="menu"
                aria-label="Page sections"
              >
                <PageNavigatorDropdown
                  sectionSelector={sectionSelector}
                  onSectionClick={closeDropdown}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbBar;
