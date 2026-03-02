/**
 * PeekTooltip — Hover tooltip showing extracted section metrics
 * 
 * Displays primary metric from section when hovering over nav items.
 * Uses glassmorphic styling consistent with Hylono design system.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import type { ExtractedMetric, SectionType } from '../utils/extractMetrics';

interface PeekTooltipProps {
  /** The metric to display */
  metric: ExtractedMetric | null;
  /** Section type for icon/label context */
  sectionType: SectionType;
  /** Content preview text */
  preview?: string;
  /** Whether tooltip is visible */
  isVisible: boolean;
  /** Position reference element */
  anchorRef?: React.RefObject<HTMLElement>;
  /** Additional class names */
  className?: string;
}

// Section type icons and labels
const SECTION_CONFIG: Record<SectionType, { icon: React.ReactNode; label: string }> = {
  specs: {
    icon: <SpecsIcon />,
    label: 'Technical Specs',
  },
  benefits: {
    icon: <BenefitsIcon />,
    label: 'Benefits',
  },
  pricing: {
    icon: <PricingIcon />,
    label: 'Pricing',
  },
  evidence: {
    icon: <EvidenceIcon />,
    label: 'Evidence',
  },
  features: {
    icon: <FeaturesIcon />,
    label: 'Features',
  },
  reviews: {
    icon: <ReviewsIcon />,
    label: 'Reviews',
  },
  faq: {
    icon: <FAQIcon />,
    label: 'FAQ',
  },
  overview: {
    icon: <OverviewIcon />,
    label: 'Overview',
  },
  gallery: {
    icon: <GalleryIcon />,
    label: 'Gallery',
  },
  protocols: {
    icon: <ProtocolsIcon />,
    label: 'Protocols',
  },
  resources: {
    icon: <ResourcesIcon />,
    label: 'Resources',
  },
  delivery: {
    icon: <ResourcesIcon />,
    label: 'Delivery',
  },
  safety: {
    icon: <EvidenceIcon />,
    label: 'Safety',
  },
  goals: {
    icon: <BenefitsIcon />,
    label: 'Goals',
  },
  synergies: {
    icon: <FeaturesIcon />,
    label: 'Synergies',
  },
  bundles: {
    icon: <PricingIcon />,
    label: 'Bundles',
  },
  'how-to-use': {
    icon: <ProtocolsIcon />,
    label: 'How To Use',
  },
  trust: {
    icon: <ReviewsIcon />,
    label: 'Trust',
  },
  timeline: {
    icon: <OverviewIcon />,
    label: 'Timeline',
  },
  description: {
    icon: <DefaultIcon />,
    label: 'Description',
  },
  default: {
    icon: <DefaultIcon />,
    label: 'Section',
  },
};

// SVG Icons
function SpecsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

function BenefitsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function PricingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

function EvidenceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function FeaturesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ReviewsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function FAQIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function OverviewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function ProtocolsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  );
}

function ResourcesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

function DefaultIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
}

// Animation variants
const tooltipEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const tooltipVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: reduced ? 0 : 0,
    y: reduced ? 0 : 4,
    scale: reduced ? 1 : 0.95,
    transition: { duration: reduced ? 0.01 : 0.15 },
  }),
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: reduced ? 0.01 : 0.15, ease: tooltipEase },
  }),
};

export const PeekTooltip: React.FC<PeekTooltipProps> = ({
  metric,
  sectionType,
  preview,
  isVisible,
  className = '',
}) => {
  const reduced = useReducedMotion();
  const config = SECTION_CONFIG[sectionType];
  
  // Don't render if no metric and no preview
  const hasContent = metric || preview;
  if (!hasContent) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          custom={reduced}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`
            absolute left-full ml-2 top-1/2 -translate-y-1/2
            w-40 p-2.5
            bg-white/95 backdrop-blur-md
            border border-slate-200
            rounded-lg shadow-lg shadow-slate-900/10
            z-50
            ${className}
          `}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {/* Section type header */}
          <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">
            {config.icon}
            <span className="text-[9px] uppercase tracking-wider font-medium">
              {config.label}
            </span>
          </div>

          {/* Primary metric */}
          {metric && (
            <div className="text-sm font-semibold text-cyan-600 mb-1">
              {metric.label ? (
                <span>
                  <span className="text-slate-500 text-xs">{metric.label}:</span>{' '}
                  {metric.value}
                </span>
              ) : (
                metric.value
              )}
            </div>
          )}

          {/* Preview text */}
          {preview && !metric && (
            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
              {preview}
            </p>
          )}

          {/* Arrow pointer */}
          <div 
            className="absolute right-full top-1/2 -translate-y-1/2
              w-0 h-0
              border-t-[6px] border-t-transparent
              border-b-[6px] border-b-transparent
              border-r-[6px] border-r-white/95"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Hook for managing tooltip visibility with hover delay
 */
export function usePeekTooltip(delay: number = 300) {
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback((sectionId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisibleTooltip(sectionId);
    }, delay);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisibleTooltip(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    visibleTooltip,
    showTooltip,
    hideTooltip,
    isTooltipVisible: (sectionId: string) => visibleTooltip === sectionId,
  };
}

export default PeekTooltip;
