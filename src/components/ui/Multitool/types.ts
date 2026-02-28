/**
 * Multitool Widget Types
 */
import type { ToolId } from '../../../stores/multitoolStore';
import type { SectionType, ExtractedMetric } from './utils/extractMetrics';

export interface MultitoolTool {
  id: ToolId;
  label: string;
  icon: React.ReactNode;
  description: string;
  /** Whether this tool should be hidden on certain pages */
  hideWhen?: () => boolean;
}

export interface SectionInfo {
  id: string;
  title: string;
  level: number;
  element: HTMLElement;
}

/**
 * Enhanced section info with metric extraction
 */
export interface EnhancedSectionInfo extends SectionInfo {
  /** Semantic section type */
  type: SectionType;
  /** Extracted primary metric */
  metric: ExtractedMetric | null;
  /** Short content preview */
  preview: string;
  /** Whether section is a key section (specs, pricing, evidence) */
  isKeySection: boolean;
}

export interface UseScrollSpyOptions {
  /** Selector for section elements */
  sectionSelector?: string;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
  /** Offset from top for active section calculation */
  offset?: number;
}

export interface ReadingToolsProps {
  className?: string;
}

export interface PageNavigatorProps {
  className?: string;
  /** Custom selector for sections */
  sectionSelector?: string;
  /** Show reading progress bar */
  showProgress?: boolean;
  /** Show estimated reading time */
  showReadingTime?: boolean;
}

export interface QuickSupportProps {
  className?: string;
  /** Callback when support is triggered */
  onSupport?: () => void;
}

export interface FocusModeProps {
  className?: string;
  /** Custom section selector */
  sectionSelector?: string;
}

export interface MultitoolContainerProps {
  /** Additional class names */
  className?: string;
  /** Custom section selector for navigator */
  sectionSelector?: string;
  /** Support callback */
  onSupport?: () => void;
  /** Enable global keyboard shortcut (?) */
  enableKeyboardShortcut?: boolean;
  /** Show the floating FAB button (set false when triggering from header) */
  showFab?: boolean;
}

export interface ReadingProgress {
  /** Current scroll progress 0-100 */
  progress: number;
  /** Current section being viewed */
  currentSection: string | null;
  /** Total sections count */
  totalSections: number;
  /** Current section index (1-based) */
  currentSectionIndex: number;
}