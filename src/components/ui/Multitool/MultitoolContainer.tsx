/**
 * MultitoolContainer — Floating HUD with FAB trigger
 * 
 * Features:
 * - Floating Action Button (FAB) anchored right-center
 * - Dropdown panel with glassmorphic styling
 * - Tool tabs with conditional visibility
 * - Responsive design (FAB → bottom sheet on mobile)
 * - WCAG compliant touch targets
 * - Global keyboard shortcut (?)
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { X, Compass } from 'lucide-react';
import { useMultitoolStore, type ToolId } from '../../../stores/multitoolStore';
import { ReadingTools, FocusMode, PageNavigator } from './tools';
import { useScrollSpy } from './hooks/useScrollSpy';
import type { MultitoolContainerProps } from './types';

// Z-index layers
const Z_INDEX_FAB = 35;
const Z_INDEX_PANEL = 50;

// FAB animation variants
const fabVariants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 0 : 0,
    x: reduced ? 0 : 80,
    transition: { duration: reduced ? 0.01 : 0.2 },
  }),
  visible: (reduced: boolean) => ({
    opacity: 1,
    x: 0,
    transition: { duration: reduced ? 0.01 : 0.2, delay: 0.1 },
  }),
};

// Pulse animation for FAB
const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: 1.5,
    opacity: 0,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: [0, 0, 0.58, 1],
    },
  },
};

// Dropdown animation variants
const panelEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const dropdownVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 0 : 0,
    y: reduced ? 0 : -8,
    scale: reduced ? 0.95 : 0.95,
    transition: { duration: reduced ? 0.01 : 0.15, ease: panelEase },
  }),
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: reduced ? 0.01 : 0.15, ease: panelEase },
  }),
};

// Mobile bottom sheet variants
const bottomSheetVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 0 : 0,
    y: reduced ? 0 : '100%',
    transition: { duration: reduced ? 0.01 : 0.3, ease: panelEase },
  }),
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0.01 : 0.3, ease: panelEase },
  }),
};

/**
 * Tool tab configuration (no support section)
 */
const TOOL_CONFIG: {
  id: ToolId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'reading', label: 'Reading', icon: <ReadingIcon /> },
  { id: 'navigator', label: 'Navigate', icon: <NavigateIcon /> },
  { id: 'focus', label: 'Focus', icon: <FocusIcon /> },
];

// Custom icons for tabs
function NavigateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function ReadingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
    </svg>
  );
}

/**
 * Dropdown Panel - Desktop
 */
const MultitoolDropdown: React.FC<{
  onClose: () => void;
  activeTool: ToolId | null;
  setActiveTool: (tool: ToolId) => void;
  sectionSelector?: string;
  hasNavigatorContent: boolean;
  position: { top: number; right: number };
}> = ({ 
  onClose, 
  activeTool, 
  setActiveTool, 
  sectionSelector,
  hasNavigatorContent,
  position,
}) => {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter visible tools based on context
  const visibleTools = TOOL_CONFIG.filter((tool) => {
    if (tool.id === 'navigator' && !hasNavigatorContent) return false;
    if (tool.id === 'focus' && !hasNavigatorContent) return false;
    return true;
  });

  // Auto-select first visible tool if current is hidden
  useEffect(() => {
    if (activeTool && !visibleTools.find(t => t.id === activeTool)) {
      setActiveTool(visibleTools[0]?.id || 'reading');
    }
  }, [activeTool, visibleTools, setActiveTool]);

  return (
    <motion.div
      ref={panelRef}
      custom={reduced}
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={`
        fixed
        w-[300px] max-w-[calc(100vw-32px)]
        bg-white/95 backdrop-blur-md
        border border-slate-200
        rounded-xl shadow-xl shadow-slate-900/15
        flex flex-col
        overflow-hidden ui-will-change
      `}
      style={{ 
        zIndex: Z_INDEX_PANEL,
        top: position.top,
        right: position.right,
      }}
      role="dialog"
      aria-label="Accessibility tools"
      aria-modal="false"
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Accessibility Tools
        </span>
        <motion.button
          whileTap={reduced ? undefined : { scale: 0.95 }}
          onClick={onClose}
          className={`
            w-8 h-8 flex items-center justify-center
            rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100
            transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
          `}
          aria-label="Close panel"
        >
          <X size={16} aria-hidden="true" />
        </motion.button>
      </div>

      {/* Content - show ReadingTools directly without tabs */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        <ReadingTools />
      </div>
    </motion.div>
  );
};

/**
 * Mobile Bottom Sheet
 */
const MultitoolBottomSheet: React.FC<{
  onClose: () => void;
  activeTool: ToolId | null;
  setActiveTool: (tool: ToolId) => void;
  sectionSelector?: string;
  hasNavigatorContent: boolean;
}> = ({
  onClose,
  activeTool,
  setActiveTool,
  sectionSelector,
  hasNavigatorContent,
}) => {
  const reduced = useReducedMotion();

  // Filter visible tools
  const visibleTools = TOOL_CONFIG.filter((tool) => {
    if (tool.id === 'navigator' && !hasNavigatorContent) return false;
    if (tool.id === 'focus' && !hasNavigatorContent) return false;
    return true;
  });

  useEffect(() => {
    if (activeTool && !visibleTools.find(t => t.id === activeTool)) {
      setActiveTool(visibleTools[0]?.id || 'reading');
    }
  }, [activeTool, visibleTools, setActiveTool]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
        style={{ zIndex: Z_INDEX_PANEL - 1 }}
        aria-hidden="true"
      />
      
      {/* Bottom sheet */}
      <motion.div
        custom={reduced}
        variants={bottomSheetVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`
          fixed bottom-0 left-0 right-0
          max-h-[70vh] rounded-t-2xl
          bg-white shadow-2xl shadow-slate-900/20
          flex flex-col overflow-hidden
        `}
        style={{ zIndex: Z_INDEX_PANEL }}
        role="dialog"
        aria-label="Accessibility tools"
        aria-modal="true"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Accessibility Tools
          </span>
          <button
            onClick={onClose}
            className="text-xs text-cyan-500 hover:text-cyan-600 font-medium"
          >
            Done
          </button>
        </div>

        {/* Tool tabs - icons only */}
        <div className="flex border-b border-slate-100" role="tablist">
          {visibleTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              role="tab"
              aria-selected={activeTool === tool.id}
              title={tool.label}
              className={`
                flex-1 min-h-[44px]
                flex items-center justify-center
                text-slate-500 ui-transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500
                ${activeTool === tool.id
                  ? 'text-cyan-600 bg-cyan-50/50 border-b-2 border-cyan-500 -mb-px'
                  : 'hover:text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        {/* Tool content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTool === 'navigator' && hasNavigatorContent && (
              <motion.div
                key="navigator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="tabpanel"
              >
                <PageNavigator sectionSelector={sectionSelector} />
              </motion.div>
            )}
            
            {activeTool === 'reading' && (
              <motion.div
                key="reading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="tabpanel"
              >
                <ReadingTools />
              </motion.div>
            )}
            
            {activeTool === 'focus' && hasNavigatorContent && (
              <motion.div
                key="focus"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="tabpanel"
              >
                <FocusMode sectionSelector={sectionSelector} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

/**
 * Main container component
 */
export const MultitoolContainer: React.FC<MultitoolContainerProps> = ({
  className = '',
  sectionSelector,
  onSupport,
  enableKeyboardShortcut = true,
  showFab = true,
}) => {
  const { isOpen, activeTool, toggle, close, setActiveTool, dropdownPosition } = useMultitoolStore();
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  
  // Use scroll spy to check for sections
  const { sections } = useScrollSpy({ sectionSelector });
  const hasNavigatorContent = sections.length > 0;

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global keyboard shortcut (?)
  useEffect(() => {
    if (!enableKeyboardShortcut) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        if (document.activeElement?.tagName === 'INPUT' || 
            document.activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        event.preventDefault();
        toggle();
      }
      
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcut, isOpen, toggle, close]);

  // Auto-select tool on open
  useEffect(() => {
    if (isOpen && !activeTool) {
      setActiveTool('reading');
    }
  }, [isOpen, activeTool, setActiveTool]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking the toggle button in navbar
      if (target.closest('[aria-label="Open accessibility tools"]')) {
        return;
      }
      // Close if clicking outside the panel
      if (!target.closest('[role="dialog"]')) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  // Handle FAB click - position dropdown next to FAB
  const handleFabClick = () => {
    // Position the dropdown next to the FAB (right side of viewport)
    const fabElement = document.querySelector('[data-fab="multitool"]') as HTMLElement;
    if (fabElement) {
      const rect = fabElement.getBoundingClientRect();
      // Use store's openAtPosition for consistent positioning
      useMultitoolStore.getState().openAtPosition({
        top: rect.top - 100, // Align with top of FAB area
        right: 80, // 80px from right (FAB width + margin)
      });
    } else {
      toggle();
    }
  };

  return (
    <div className={className}>
      {/* Floating Action Button (FAB) - always visible when panel is closed */}
      <AnimatePresence>
        {showFab && !isOpen && (
          <motion.button
            data-fab="multitool"
            custom={reduced}
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleFabClick}
            className={`
              fixed right-4
              w-14 h-14
              rounded-full
              bg-gradient-to-br from-cyan-500 to-teal-500
              text-white
              shadow-lg shadow-cyan-500/30
              flex items-center justify-center
              transition-[transform,box-shadow] duration-300
              hover:shadow-xl hover:shadow-cyan-500/40
              hover:scale-105
              active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2
              group ui-will-change
            `}
            style={{ 
              zIndex: Z_INDEX_FAB,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="Open page navigation tools"
            aria-expanded={isOpen}
          >
            {/* Pulse animation ring */}
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 rounded-full bg-cyan-400"
            />
            
            {/* Icon */}
            <Compass 
              size={24} 
              className="relative z-10 transition-transform duration-300 group-hover:rotate-45" 
            />
            
            {/* Tooltip */}
            <span className="
              absolute right-full mr-3
              px-3 py-1.5
              bg-slate-900/90 text-white
              text-xs font-medium
              rounded-lg
              whitespace-nowrap
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              pointer-events-none
            ">
              Page Navigator
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900/90" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel (dropdown or bottom sheet) */}
      <AnimatePresence mode="wait">
        {isOpen && (
          isMobile ? (
            <MultitoolBottomSheet
              key="bottomsheet"
              onClose={close}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              sectionSelector={sectionSelector}
              hasNavigatorContent={hasNavigatorContent}
            />
          ) : (
            <MultitoolDropdown
              key="dropdown"
              onClose={close}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              sectionSelector={sectionSelector}
              hasNavigatorContent={hasNavigatorContent}
              position={dropdownPosition}
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultitoolContainer;

