/**
 * Multitool Widget — Floating side widget with multiple tools
 * 
 * A persistent, modular floating widget that houses:
 * - Page Navigator: Table of contents with scroll-spy and peek tooltips
 * - Reading Tools: Text size, line height, font, and contrast toggles
 * - Focus Mode: Distraction-free reading mode
 * - Quick Support: Help and support triggers
 * 
 * Features:
 * - Global keyboard shortcut: Press `?` to toggle
 * - Mobile bottom sheet layout
 * - Smart auto-hide FAB during scroll
 * - Persistent settings via Zustand + localStorage
 * - Semantic section detection (specs, benefits, pricing, evidence)
 * - "Peek" tooltips with extracted metrics
 * 
 * @example
 * ```tsx
 * import { MultitoolContainer } from '@/components/ui/Multitool';
 * 
 * // Basic usage
 * <MultitoolContainer />
 * 
 * // With custom section selector
 * <MultitoolContainer sectionSelector="[data-section]" />
 * 
 * // With support callback
 * <MultitoolContainer onSupport={() => openDemoModal()} />
 * 
 * // Disable keyboard shortcut
 * <MultitoolContainer enableKeyboardShortcut={false} />
 * ```
 */

// Main container
export { MultitoolContainer, default } from './MultitoolContainer';

// Individual tools
export { PageNavigator } from './tools/PageNavigator';
export { ReadingTools } from './tools/ReadingTools';
export { QuickSupport } from './tools/QuickSupport';
export { FocusMode } from './tools/FocusMode';

// Hooks
export { useScrollSpy } from './hooks/useScrollSpy';
export { usePageStructure } from './hooks/usePageStructure';

// Components
export { PeekTooltip, usePeekTooltip } from './components/PeekTooltip';

// Utilities
export {
  extractSectionMetric,
  detectSectionType,
  getSectionPreview,
  formatMetricForPeek,
} from './utils/extractMetrics';

// Types
export type {
  MultitoolContainerProps,
  PageNavigatorProps,
  ReadingToolsProps,
  QuickSupportProps,
  FocusModeProps,
  SectionInfo,
  EnhancedSectionInfo,
  UseScrollSpyOptions,
  ReadingProgress,
} from './types';

// Re-export utility types
export type { SectionType, ExtractedMetric } from './utils/extractMetrics';

// Re-export store types for convenience
export type { ToolId, TextSize, LineHeight, ReadingFont } from '../../../stores/multitoolStore';
