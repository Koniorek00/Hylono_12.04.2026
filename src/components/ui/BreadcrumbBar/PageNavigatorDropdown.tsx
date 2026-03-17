"use client";

/**
 * PageNavigatorDropdown — Section navigation for the breadcrumb bar dropdown
 * 
 * Features:
 * - Reuses usePageStructure hook for section detection
 * - Highlights active section
 * - Smooth scrolling with header offset
 * - Reading progress indicator
 * - Compact styling for dropdown
 */
import React, { useMemo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Clock, Sparkles, ArrowUp, Settings, DollarSign, FileText, Heart, Target, HelpCircle, BookOpen, Zap, Shield, Truck, Flag, Layers, Package, PlayCircle, Award, Clock3, Info } from 'lucide-react';
import { usePageStructure } from '../Multitool/hooks/usePageStructure';
import type { SectionType } from '../Multitool/utils/extractMetrics';

export interface PageNavigatorDropdownProps {
  /** CSS selector for page sections */
  sectionSelector?: string;
  /** Callback when section is clicked */
  onSectionClick?: () => void;
}

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.02, duration: 0.15 },
  }),
};

/**
 * Calculate estimated reading time
 */
const calculateReadingTime = (): number => {
  const wordsPerMinute = 200;
  const articleContent = document.querySelector('article, main, .prose') || document.body;
  const text = articleContent.textContent || '';
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Get badge color based on section type
 */
const getSectionBadgeColor = (type: SectionType): string => {
  switch (type) {
    case 'specs':
      return 'bg-blue-100 text-blue-600';
    case 'pricing':
      return 'bg-green-100 text-green-600';
    case 'evidence':
      return 'bg-purple-100 text-purple-600';
    case 'benefits':
      return 'bg-cyan-100 text-cyan-600';
    default:
      return 'bg-slate-100 text-slate-500';
  }
};

/**
 * Get icon based on section type
 */
const getSectionIcon = (type: SectionType): React.ReactNode => {
  switch (type) {
    case 'specs':
      return <Settings size={12} aria-hidden="true" />;
    case 'pricing':
      return <DollarSign size={12} aria-hidden="true" />;
    case 'evidence':
      return <FileText size={12} aria-hidden="true" />;
    case 'benefits':
      return <Heart size={12} aria-hidden="true" />;
    case 'goals':
      return <Target size={12} aria-hidden="true" />;
    case 'faq':
      return <HelpCircle size={12} aria-hidden="true" />;
    case 'reviews':
      return <BookOpen size={12} aria-hidden="true" />;
    case 'safety':
      return <Shield size={12} aria-hidden="true" />;
    case 'protocols':
      return <Zap size={12} aria-hidden="true" />;
    case 'delivery':
      return <Truck size={12} aria-hidden="true" />;
    case 'features':
      return <Sparkles size={12} aria-hidden="true" />;
    case 'synergies':
      return <Layers size={12} aria-hidden="true" />;
    case 'bundles':
      return <Package size={12} aria-hidden="true" />;
    case 'how-to-use':
      return <PlayCircle size={12} aria-hidden="true" />;
    case 'trust':
      return <Award size={12} aria-hidden="true" />;
    case 'timeline':
      return <Clock3 size={12} aria-hidden="true" />;
    case 'description':
    case 'overview':
      return <Info size={12} aria-hidden="true" />;
    case 'gallery':
      return <FileText size={12} aria-hidden="true" />;
    case 'resources':
      return <BookOpen size={12} aria-hidden="true" />;
    default:
      return <Sparkles size={12} aria-hidden="true" />;
  }
};

export const PageNavigatorDropdown: React.FC<PageNavigatorDropdownProps> = ({
  sectionSelector,
  onSectionClick,
}) => {
  const {
    sections,
    keySections,
    activeSectionId,
    isLoading,
    scrollToSection,
  } = usePageStructure({ sectionSelector });

  const reduced = useReducedMotion();
  const [readingTime, setReadingTime] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate reading time on mount
  useEffect(() => {
    setReadingTime(calculateReadingTime());
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find current section index
  const currentSectionIndex = useMemo(() => {
    const idx = sections.findIndex(s => s.id === activeSectionId);
    return idx >= 0 ? idx + 1 : 0;
  }, [sections, activeSectionId]);

  const handleSectionClick = (sectionId: string) => {
    scrollToSection(sectionId);
    onSectionClick?.();
  };

  const hasSections = sections.length > 0;

  return (
    <div className="max-h-[50vh] overflow-hidden flex flex-col">
      {/* Header with progress */}
      {hasSections && (
        <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
          {/* Progress bar */}
          <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden mb-2">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
              initial={false}
              animate={{ width: `${readingProgress}%` }}
              transition={reduced ? { duration: 0 } : { duration: 0.15, ease: 'easeOut' }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={10} aria-hidden="true" />
              {readingTime} min read
            </span>
            <span>
              {currentSectionIndex} / {sections.length} sections
            </span>
          </div>
        </div>
      )}

      {/* Key sections quick access */}
      {keySections.length > 0 && keySections.length < sections.length && (
        <div className="px-3 py-2 border-b border-slate-100 flex flex-wrap gap-1.5">
          {keySections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`
                px-2 py-1 rounded text-xs font-medium
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                ${activeSectionId === section.id
                  ? 'bg-cyan-500 text-white'
                  : getSectionBadgeColor(section.type)
                }
              `}
            >
              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              {section.metric && (
                <span className="ml-1 opacity-75">
                  {section.metric.value}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Section list */}
      <div className="py-2 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="px-3 py-4 text-center">
            <div className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          </div>
        ) : hasSections ? (
          <ul role="menu" className="space-y-0.5">
            {sections.map((section, index) => {
              const isActive = activeSectionId === section.id;
              const displayTitle = section.title.length > 35
                ? `${section.title.substring(0, 33)}...`
                : section.title;
              const sectionIcon = getSectionIcon(section.type);

              return (
                <motion.li
                  key={section.id}
                  custom={index}
                  initial={reduced ? false : 'hidden'}
                  animate="visible"
                  variants={itemVariants}
                  role="menuitem"
                >
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className={`
                      w-full text-left px-3 py-2
                      min-h-[44px] flex items-center gap-2
                      text-sm transition-all duration-200
                      rounded-lg mx-1
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                      ${isActive
                        ? 'bg-cyan-50 text-cyan-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      }
                    `}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {/* Section type icon */}
                    <span
                      className={`shrink-0 ${
                        isActive 
                          ? 'text-cyan-500' 
                          : section.isKeySection 
                            ? 'text-cyan-400' 
                            : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    >
                      {sectionIcon}
                    </span>

                    <span className="truncate flex-1">{displayTitle}</span>

                    {/* Key section indicator */}
                    {section.isKeySection && !isActive && (
                      <Sparkles
                        size={10}
                        className="text-cyan-400 shrink-0 opacity-60"
                        aria-hidden="true"
                      />
                    )}

                    {/* Metric preview */}
                    {section.metric && isActive && (
                      <span className="text-xs text-cyan-500 font-medium shrink-0">
                        {section.metric.value}
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <Clock size={24} className="text-slate-300 mb-2" aria-hidden="true" />
            <p className="text-xs text-slate-400">
              No sections found on this page
            </p>
          </div>
        )}
      </div>

      {/* Scroll to top - always visible */}
      <div className="px-3 py-2 border-t border-slate-100">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
            onSectionClick?.();
          }}
          className="w-full min-h-[44px] rounded-lg
            flex items-center justify-center gap-2
            text-xs text-slate-600 bg-slate-50
            hover:bg-cyan-50 hover:text-cyan-700
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
            font-medium"
          role="menuitem"
        >
          <ArrowUp size={14} aria-hidden="true" />
          <span>Back to top</span>
        </button>
      </div>
    </div>
  );
};

export default PageNavigatorDropdown;
