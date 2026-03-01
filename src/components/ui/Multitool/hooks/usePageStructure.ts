/**
 * usePageStructure — Enhanced page structure detection with metric extraction
 * 
 * Extends useScrollSpy capabilities with:
 * - Semantic section type detection (data-section="specs|benefits|pricing|evidence")
 * - Primary metric extraction for "Peek" tooltips
 * - Content preview generation
 * - Dynamic re-scanning for SPA navigation
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  extractSectionMetric, 
  detectSectionType, 
  getSectionPreview,
  type SectionType,
  type ExtractedMetric 
} from '../utils/extractMetrics';
import type { SectionInfo, UseScrollSpyOptions } from '../types';

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

interface UsePageStructureOptions extends UseScrollSpyOptions {
  /** Additional selectors to include */
  extraSelectors?: string[];
  /** Whether to extract metrics */
  extractMetrics?: boolean;
  /** Whether to generate previews */
  generatePreviews?: boolean;
  /** Preview max length */
  previewLength?: number;
}

// Default selectors for key page sections
const DEFAULT_SELECTORS = [
  'section[id]',
  '[data-section-id]',
  '[data-section]',
  'article[id]',
  '[id^="specifications"]',
  '[id^="benefits"]',
  '[id^="pricing"]',
  '[id^="evidence"]',
  '[id^="features"]',
  '[id^="reviews"]',
  '[id^="faq"]',
  '[id^="overview"]',
].join(', ');

// Key sections that should be highlighted/pinned
const KEY_SECTIONS: SectionType[] = ['specs', 'pricing', 'evidence', 'benefits', 'delivery', 'safety', 'goals', 'how-to-use'];

/**
 * Extracts comprehensive section information from a DOM element
 */
function extractEnhancedSectionInfo(
  element: Element, 
  options: { extractMetrics: boolean; generatePreviews: boolean; previewLength: number }
): EnhancedSectionInfo | null {
  // Get ID from various sources
  const id = element.id || 
             element.getAttribute('data-section-id') ||
             element.getAttribute('data-section');
  
  if (!id) return null;

  // Try to find a heading for the title
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  const title = heading?.textContent?.trim() || 
                element.getAttribute('data-section-title') || 
                element.getAttribute('aria-label') ||
                element.getAttribute('data-section-name') ||
                formatSectionId(id);

  // Determine heading level for hierarchy
  const headingTag = heading?.tagName.toLowerCase();
  const level = headingTag ? parseInt(headingTag.replace('h', '')) : 2;

  // Detect semantic section type
  const type = detectSectionType(element);

  // Extract primary metric
  const metric = options.extractMetrics ? extractSectionMetric(element) : null;

  // Generate preview
  const preview = options.generatePreviews 
    ? getSectionPreview(element, options.previewLength) 
    : '';

  return {
    id,
    title,
    level,
    element: element as HTMLElement,
    type,
    metric,
    preview,
    isKeySection: KEY_SECTIONS.includes(type),
  };
}

/**
 * Formats a section ID into a readable title
 */
function formatSectionId(id: string): string {
  return id
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/**
 * Hook for enhanced page structure detection
 */
export function usePageStructure(options: UsePageStructureOptions = {}) {
  const {
    sectionSelector = DEFAULT_SELECTORS,
    extraSelectors = [],
    extractMetrics = true,
    generatePreviews = true,
    previewLength = 80,
    rootMargin = '-20% 0px -70% 0px',
  } = options;

  const [sections, setSections] = useState<EnhancedSectionInfo[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Map<string, Element>>(new Map());

  // Combined selector
  const fullSelector = extraSelectors.length > 0
    ? `${sectionSelector}, ${extraSelectors.join(', ')}`
    : sectionSelector;

  // Extract options object
  const extractOptions = {
    extractMetrics,
    generatePreviews,
    previewLength,
  };

  // Update sections list
  const updateSections = useCallback(() => {
    const elements = document.querySelectorAll(fullSelector);
    const newSections: EnhancedSectionInfo[] = [];
    sectionsRef.current.clear();

    elements.forEach((element) => {
      const info = extractEnhancedSectionInfo(element, extractOptions);
      if (info) {
        newSections.push(info);
        sectionsRef.current.set(info.id, element);
      }
    });

    // Sort by DOM position
    newSections.sort((a, b) => {
      const position = a.element.compareDocumentPosition(b.element);
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    setSections(newSections);
    setIsLoading(false);
  }, [fullSelector, extractMetrics, generatePreviews, previewLength]);

  // Setup intersection observer
  useEffect(() => {
    setIsLoading(true);
    
    // Initial section discovery with increased delay for lazy-loaded components
    const initTimeout = setTimeout(() => {
      updateSections();
    }, 300);

    // Create intersection observer for visibility tracking
    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const mostVisibleEntry = entries.reduce<IntersectionObserverEntry | null>((currentMostVisible, entry) => {
          if (!entry.isIntersecting) {
            return currentMostVisible;
          }

          if (!currentMostVisible || entry.intersectionRatio > currentMostVisible.intersectionRatio) {
            return entry;
          }

          return currentMostVisible;
        }, null);

        if (mostVisibleEntry) {
          const entryTarget = mostVisibleEntry.target as HTMLElement;
          const id = entryTarget.id ||
                     entryTarget.getAttribute('data-section-id') ||
                     entryTarget.getAttribute('data-section');
          if (id) {
            setActiveSectionId(id);
          }
        }
      },
      {
        rootMargin,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all sections after initial discovery
    setTimeout(() => {
      sectionsRef.current.forEach((element) => {
        observerRef.current?.observe(element);
      });
    }, 150);

    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      observerRef.current?.disconnect();
    };
  }, [rootMargin, updateSections]);

  // Re-scan when URL changes (for SPA navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      // Small delay to let React render the new page content
      setTimeout(() => {
        updateSections();
      }, 200);
    };

    // Listen for popstate events (SPA navigation)
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [updateSections]);

  // Re-scan when DOM changes (for lazy content)
  useEffect(() => {
    const mutationObserver = new MutationObserver((mutations) => {
      // Only rescan if meaningful changes occurred
      const hasRelevantChanges = mutations.some(m => {
        // Check if nodes were added/removed that might contain sections
        return Array.from(m.addedNodes).some(node => 
          node instanceof Element && (
            node.matches?.(fullSelector) ||
            node.querySelector?.(fullSelector)
          )
        ) || Array.from(m.removedNodes).some(node =>
          node instanceof Element && (
            node.matches?.(fullSelector) ||
            node.querySelector?.(fullSelector)
          )
        );
      });

      if (hasRelevantChanges) {
        updateSections();
        
        // Re-observe new sections
        sectionsRef.current.forEach((element) => {
          observerRef.current?.observe(element);
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [fullSelector, updateSections]);

  // Scroll to section with offset for sticky headers
  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionsRef.current.get(sectionId) ||
                    document.getElementById(sectionId) || 
                    document.querySelector(`[data-section-id="${sectionId}"]`) ||
                    document.querySelector(`[data-section="${sectionId}"]`);
    
    if (element) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Calculate offset for sticky header (approximate)
      const headerOffset = 100; // Account for navbar + some padding
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      if (prefersReducedMotion) {
        window.scrollTo(0, offsetPosition);
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }

      // Update URL hash without triggering scroll
      history.replaceState(null, '', `#${sectionId}`);
      
      // Update active section immediately for better UX
      setActiveSectionId(sectionId);
    }
  }, []);

  // Get section by ID
  const getSection = useCallback((sectionId: string): EnhancedSectionInfo | undefined => {
    return sections.find(s => s.id === sectionId);
  }, [sections]);

  // Get sections by type
  const getSectionsByType = useCallback((type: SectionType): EnhancedSectionInfo[] => {
    return sections.filter(s => s.type === type);
  }, [sections]);

  // Get key sections (specs, pricing, evidence)
  const keySections = sections.filter(s => s.isKeySection);

  return {
    sections,
    keySections,
    activeSectionId,
    isLoading,
    scrollToSection,
    refreshSections: updateSections,
    getSection,
    getSectionsByType,
  };
}

export default usePageStructure;