// Shared UI components - centralized exports
export { AnimatedCounter } from './AnimatedCounter';
export { CommandPalette } from './CommandPalette';
export { CustomCursor } from './CustomCursor';
export { FloatingCTA } from './FloatingCTA';
export { MagneticButton } from './MagneticButton';
export { MarqueeTicker } from './MarqueeTicker';
export { 
  MedicalDisclaimer, 
  ShortDisclaimer, 
  MdrComplianceBadge 
} from './MedicalDisclaimer';
export type { DisclaimerType } from './MedicalDisclaimer';
export { 
  disclaimers, 
  DISCLAIMER_CONTEXTS, 
  MDR_COMPLIANCE_STATEMENT, 
  CITATION_DISCLAIMER 
} from './MedicalDisclaimer';
export { ScrollReveal } from './ScrollReveal';
export { TextScramble } from './TextScramble';
export { TiltCard } from './TiltCard';

// Multitool Widget - floating side panel with tools
export { 
  MultitoolContainer,
  PageNavigator,
  ReadingTools,
  QuickSupport,
  useScrollSpy,
} from '../../src/components/ui/Multitool';
export type {
  MultitoolContainerProps,
  PageNavigatorProps,
  ReadingToolsProps,
  QuickSupportProps,
  SectionInfo,
  UseScrollSpyOptions,
  ToolId,
  TextSize,
} from '../../src/components/ui/Multitool';
