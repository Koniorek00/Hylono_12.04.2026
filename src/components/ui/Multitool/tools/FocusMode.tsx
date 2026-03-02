/**
 * FocusMode — Distraction-free reading mode
 * 
 * Features:
 * - Dims all content except active section
 * - Toggle to enable/disable
 * - Auto-sync with active section from navigator
 * - Visual indicator of focus state
 */
import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff, Focus, Info } from 'lucide-react';
import { useMultitoolStore } from '../../../../stores/multitoolStore';
import { useScrollSpy } from '../hooks/useScrollSpy';
import type { FocusModeProps } from '../types';

export const FocusMode: React.FC<FocusModeProps> = ({ 
  className = '',
  sectionSelector,
}) => {
  const { 
    focusMode, 
    focusModeSectionId,
    toggleFocusMode, 
    setFocusSection 
  } = useMultitoolStore();
  const { sections, activeSectionId } = useScrollSpy({ sectionSelector });
  const reduced = useReducedMotion();

  // Auto-update focus section when scrolling (if focus mode is active)
  useEffect(() => {
    if (focusMode && activeSectionId) {
      setFocusSection(activeSectionId);
    }
  }, [focusMode, activeSectionId, setFocusSection]);

  // Get current section title
  const currentSection = sections.find(s => s.id === focusModeSectionId);
  const hasSections = sections.length > 0;

  return (
    <div className={`${className}`} role="group" aria-label="Focus mode controls">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
        <Focus size={14} className="text-slate-400" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Focus Mode
        </span>
      </div>

      <div className="py-3 px-2 space-y-3">
        {/* Focus mode toggle */}
        <div className="px-1">
          <motion.button
            onClick={toggleFocusMode}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            className={`
              w-full min-h-[44px] rounded-lg px-3
              flex items-center justify-between
              text-sm transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
              ${focusMode
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }
            `}
            role="switch"
            aria-checked={focusMode}
            aria-label="Focus mode"
            disabled={!hasSections}
          >
            <div className="flex items-center gap-2">
              {focusMode ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{focusMode ? 'Focus Active' : 'Enable Focus'}</span>
            </div>
            <div 
              className={`
                w-5 h-5 rounded-full flex items-center justify-center
                ${focusMode ? 'bg-white/20' : 'bg-slate-200'}
              `}
            >
              {focusMode && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-white"
                />
              )}
            </div>
          </motion.button>
        </div>

        {/* Current section indicator */}
        {focusMode && currentSection && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-1"
          >
            <div className="bg-cyan-50 rounded-lg px-3 py-2 border border-cyan-100">
              <span className="text-[10px] text-cyan-600 font-medium uppercase tracking-wider">
                Focused Section
              </span>
              <p className="text-sm text-cyan-700 font-medium mt-0.5 truncate">
                {currentSection.title}
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!hasSections && (
          <div className="px-1">
            <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Focus mode requires page sections. Navigate to a content page to use this feature.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {hasSections && !focusMode && (
          <div className="px-1">
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Focus mode dims all content except the current section, helping you concentrate on reading.
            </p>
          </div>
        )}

        {/* Reading tip when active */}
        {focusMode && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-1"
          >
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Scroll to change focus. Use the Navigator to jump to specific sections.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FocusMode;
