"use client";

/**
 * PageNavigator — Dynamic table of contents with scroll-spy and peek tooltips
 * 
 * Features:
 * - Auto-detects page sections using usePageStructure hook
 * - Highlights active section on scroll (Intersection Observer)
 * - Smooth scrolling to sections with header offset
 * - Reading progress bar
 * - "Peek" tooltips showing extracted metrics
 * - Empty state handling
 * - Key section highlighting (specs, pricing, evidence)
 */
import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { List, FileText, Clock, ArrowUp, Sparkles } from 'lucide-react';
import { usePageStructure, type EnhancedSectionInfo } from '../hooks/usePageStructure';
import { PeekTooltip, usePeekTooltip } from '../components/PeekTooltip';
import { useMultitoolStore } from '../../../../stores/multitoolStore';
import type { PageNavigatorProps } from '../types';
import type { SectionType } from '../utils/extractMetrics';

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

/**
 * Calculate estimated reading time
 */
const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Get page reading time
 */
const getPageReadingTime = (): number => {
  const articleContent = document.querySelector('article, main, .prose') || document.body;
  const text = articleContent.textContent || '';
  return calculateReadingTime(text);
};

/**
 * Reading progress bar component
 */
const ReadingProgressBar: React.FC<{
  progress: number;
  currentSection: number;
  totalSections: number;
  readingTime: number;
}> = ({ progress, currentSection, totalSections, readingTime }) => {
  const reduced = useReducedMotion();

  return (
    <div className="px-3 py-2 border-b border-slate-100">
      {/* Progress bar */}
      <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden mb-2">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
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
          {currentSection} / {totalSections} sections
        </span>
      </div>
    </div>
  );
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
 * Single navigation item in the TOC
 */
const NavItem: React.FC<{
  section: EnhancedSectionInfo;
  isActive: boolean;
  isFocusMode: boolean;
  focusSectionId: string | null;
  onClick: () => void;
  index: number;
  showPeek: boolean;
  onHover: (showing: boolean) => void;
}> = ({ section, isActive, isFocusMode, focusSectionId, onClick, index, showPeek, onHover }) => {
  const reduced = useReducedMotion();
  const { setFocusSection } = useMultitoolStore();
  const itemRef = React.useRef<HTMLDivElement>(null);
  
  // Truncate long titles
  const displayTitle = section.title.length > 35 
    ? `${section.title.substring(0, 33)}...` 
    : section.title;

  const handleClick = () => {
    onClick();
    if (isFocusMode) {
      setFocusSection(section.id);
    }
  };

  return (
    <motion.div
      ref={itemRef}
      custom={index}
      initial={reduced ? false : 'hidden'}
      animate="visible"
      variants={itemVariants}
      className="relative"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <motion.button
        whileTap={reduced ? undefined : { scale: 0.98 }}
        onClick={handleClick}
        className={`
          w-full text-left px-3 py-2 rounded-lg
          min-h-[44px] flex items-center gap-2
          text-sm transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
          ${isActive 
            ? 'bg-cyan-50 text-cyan-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }
          ${isFocusMode && focusSectionId === section.id ? 'ring-2 ring-cyan-400' : ''}
        `}
        aria-current={isActive ? 'location' : undefined}
        role="link"
      >
        {/* Level indicator / Key section indicator */}
        <span 
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isActive ? 'bg-cyan-500' : section.isKeySection ? 'bg-cyan-400' : 'bg-slate-300'
          }`}
          style={{ marginLeft: `${(section.level - 1) * 8}px` }}
          aria-hidden="true"
        />
        
        <span className="truncate flex-1">{displayTitle}</span>
        
        {/* Key section badge */}
        {section.isKeySection && !isActive && (
          <Sparkles 
            size={10} 
            className="text-cyan-400 shrink-0 opacity-60" 
            aria-hidden="true"
          />
        )}
        
        {/* Metric preview inline (for key sections) */}
        {section.metric && isActive && (
          <span className="text-xs text-cyan-500 font-medium shrink-0">
            {section.metric.value}
          </span>
        )}
        
        {/* Focus mode indicator */}
        {isFocusMode && isActive && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"
            aria-label="Focused section"
          />
        )}
      </motion.button>

      {/* Peek Tooltip */}
      {showPeek && section.metric && (
        <PeekTooltip
          metric={section.metric}
          sectionType={section.type}
          preview={section.preview}
          isVisible={showPeek}
        />
      )}
    </motion.div>
  );
};

/**
 * Empty state when no sections found
 */
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
    <FileText 
      size={24} 
      className="text-slate-300 mb-2" 
      aria-hidden="true"
    />
    <p className="text-xs text-slate-400">
      No sections found on this page
    </p>
  </div>
);

/**
 * Scroll to top button
 */
const ScrollToTop: React.FC<{ visible: boolean }> = ({ visible }) => {
  const reduced = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={scrollToTop}
          className="w-[calc(100%-24px)] min-h-[44px] rounded-lg mt-2 mx-3
            flex items-center justify-center gap-2
            text-xs text-slate-500 bg-slate-50
            hover:bg-slate-100 hover:text-slate-600
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          aria-label="Scroll to top of page"
        >
          <ArrowUp size={12} aria-hidden="true" />
          <span>Back to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export const PageNavigator: React.FC<PageNavigatorProps> = ({
  className = '',
  sectionSelector,
  showProgress = true,
  showReadingTime = true,
}) => {
  const { 
    sections, 
    keySections, 
    activeSectionId, 
    isLoading,
    scrollToSection 
  } = usePageStructure({ sectionSelector });
  
  const { focusMode, focusModeSectionId } = useMultitoolStore();
  const reduced = useReducedMotion();
  
  // Peek tooltip state
  const { visibleTooltip, showTooltip, hideTooltip, isTooltipVisible } = usePeekTooltip(400);
  
  // Reading progress state
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Calculate reading time on mount
  useEffect(() => {
    setReadingTime(getPageReadingTime());
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setReadingProgress(progress);
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find current section index
  const currentSectionIndex = useMemo(() => {
    const idx = sections.findIndex(s => s.id === activeSectionId);
    return idx >= 0 ? idx + 1 : 0;
  }, [sections, activeSectionId]);

  const hasSections = sections.length > 0;

  // Handle hover state for peek tooltip
  const handleItemHover = (sectionId: string, isHovering: boolean) => {
    if (isHovering) {
      setHoveredSection(sectionId);
      showTooltip(sectionId);
    } else {
      setHoveredSection(null);
      hideTooltip();
    }
  };

  return (
    <div className={`${className}`} role="navigation" aria-label="Page sections">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
        <List size={14} className="text-slate-400" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          On This Page
        </span>
        {hasSections && (
          <span className="ml-auto text-xs text-slate-400">
            {sections.length}
          </span>
        )}
      </div>

      {/* Reading progress bar */}
      {showProgress && hasSections && (
        <ReadingProgressBar
          progress={readingProgress}
          currentSection={currentSectionIndex}
          totalSections={sections.length}
          readingTime={readingTime}
        />
      )}

      {/* Key sections quick access (if present) */}
      {keySections.length > 0 && keySections.length < sections.length && (
        <div className="px-3 py-2 border-b border-slate-100 flex flex-wrap gap-1.5">
          {keySections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
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
      <div className="py-2 max-h-[35vh] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div key="loading" className="px-3 py-4 text-center">
              <div className="animate-pulse flex flex-col gap-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ) : hasSections ? (
            sections.map((section, index) => (
              <NavItem
                key={section.id}
                section={section}
                isActive={activeSectionId === section.id}
                isFocusMode={focusMode}
                focusSectionId={focusModeSectionId}
                onClick={() => scrollToSection(section.id)}
                index={index}
                showPeek={isTooltipVisible(section.id)}
                onHover={(showing) => handleItemHover(section.id, showing)}
              />
            ))
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to top */}
      <ScrollToTop visible={showScrollTop} />
    </div>
  );
};

export default PageNavigator;
