"use client";

/**
 * ReadingTools — Accessibility toggles for enhanced reading
 * 
 * Features:
 * - Text size control (4 levels)
 * - Font family selection (default, dyslexic)
 * - High contrast mode toggle
 * - Visual feedback for current settings
 */
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Contrast, RotateCcw, Check } from 'lucide-react';
import { useMultitoolStore } from '../../../../stores/multitoolStore';
import type { TextSize, ReadingFont } from '../../../../stores/multitoolStore';
import type { ReadingToolsProps } from '../types';

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  xs: '90%',
  sm: '100%',
  default: '120%',
  lg: '140%',
};

const FONT_LABELS: Record<ReadingFont, { name: string; description: string }> = {
  default: { name: 'Default', description: 'Outfit' },
  dyslexic: { name: 'Dyslexic', description: 'Accessible' },
};

export const ReadingTools: React.FC<ReadingToolsProps> = ({ className = '' }) => {
  const { 
    textSize, 
    readingFont,
    highContrast, 
    setTextSize, 
    setReadingFont,
    toggleHighContrast,
    reset,
  } = useMultitoolStore();
  const reduced = useReducedMotion();

  const handleReset = () => {
    reset();
  };

  const isDefaultState = textSize === 'sm' && readingFont === 'default' && !highContrast;

  return (
    <div className={`${className}`} role="group" aria-label="Reading tools">
      <div className="py-3 px-2 space-y-3">
        {/* Text Size Control */}
        <div className="px-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2 block">
            Text Size
          </span>
          <div className="grid grid-cols-4 gap-1" role="radiogroup" aria-label="Text size options">
            {(Object.keys(TEXT_SIZE_LABELS) as TextSize[]).map((size) => (
              <motion.button
                key={size}
                onClick={() => setTextSize(size)}
                whileTap={reduced ? undefined : { scale: 0.95 }}
                className={`
                  min-h-[44px] rounded-lg
                  flex items-center justify-center
                  text-sm font-semibold transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                  ${textSize === size
                    ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }
                `}
                role="radio"
                aria-checked={textSize === size}
                aria-label={`${TEXT_SIZE_LABELS[size]} text size`}
              >
                <span>{TEXT_SIZE_LABELS[size]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Font Family Control */}
        <div className="px-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2 block">
            Font Style
          </span>
          <div className="flex flex-col gap-1" role="radiogroup" aria-label="Font style options">
            {(Object.keys(FONT_LABELS) as ReadingFont[]).map((font) => (
              <motion.button
                key={font}
                onClick={() => setReadingFont(font)}
                whileTap={reduced ? undefined : { scale: 0.98 }}
                className={`
                  w-full min-h-[44px] rounded-lg px-3
                  flex items-center justify-between
                  text-sm transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                  ${readingFont === font
                    ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }
                `}
                role="radio"
                aria-checked={readingFont === font}
                aria-label={`${FONT_LABELS[font].name} font`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{FONT_LABELS[font].name}</span>
                  <span className="text-[10px] text-slate-400">{FONT_LABELS[font].description}</span>
                </div>
                {readingFont === font && (
                  <Check size={16} className="text-cyan-500" aria-hidden="true" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* High Contrast Toggle */}
        <div className="px-1">
          <motion.button
            onClick={toggleHighContrast}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            className={`
              w-full min-h-[44px] rounded-lg px-3
              flex items-center justify-between
              text-sm transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
              ${highContrast
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }
            `}
            role="switch"
            aria-checked={highContrast}
            aria-label="High contrast mode"
          >
            <div className="flex items-center gap-2">
              <Contrast size={16} aria-hidden="true" />
              <span>High Contrast</span>
            </div>
            <div 
              className={`
                w-5 h-5 rounded-full flex items-center justify-center
                ${highContrast ? 'bg-cyan-500' : 'bg-slate-200'}
              `}
            >
              {highContrast && <Check size={12} className="text-white" />}
            </div>
          </motion.button>
        </div>

        {/* Reset Button */}
        {!isDefaultState && (
          <motion.button
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={handleReset}
            className={`
              w-full min-h-[36px] rounded-lg px-3 mt-2
              flex items-center justify-center gap-2
              text-xs text-slate-500 bg-slate-50
              hover:bg-slate-100 hover:text-slate-600
              transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
            `}
            aria-label="Reset accessibility settings to default"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Reset to Default</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ReadingTools;
