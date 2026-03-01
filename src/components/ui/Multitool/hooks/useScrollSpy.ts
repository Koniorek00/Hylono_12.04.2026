/**
 * useScrollSpy — Detects active section based on scroll position
 * 
 * Used by PageNavigator to highlight current section in viewport.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import type { SectionInfo, UseScrollSpyOptions } from '../types';

const DEFAULT_OPTIONS: Required<UseScrollSpyOptions> = {
  sectionSelector: 'section[id], [data-section-id]',
  rootMargin: '-20% 0px -70% 0px',
  threshold: 0,
  offset: 100,
};

export function useScrollSpy(options?: UseScrollSpyOptions) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract section info from DOM elements
  const extractSectionInfo = useCallback((element: Element): SectionInfo | null => {
    const id = element.id || element.getAttribute('data-section-id');
    if (!id) return null;

    // Try to find a heading for the title
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    const title = heading?.textContent?.trim() || 
                  element.getAttribute('data-section-title') || 
                  element.getAttribute('aria-label') ||
                  `Section ${id}`;

    // Determine heading level for hierarchy
    const headingTag = heading?.tagName.toLowerCase();
    const level = headingTag ? parseInt(headingTag.replace('h', '')) : 2;

    return {
      id,
      title,
      level,
      element: element as HTMLElement,
    };
  }, []);

  // Update sections list
  const updateSections = useCallback(() => {
    const elements = document.querySelectorAll(opts.sectionSelector);
    const newSections: SectionInfo[] = [];

    elements.forEach((element) => {
      const info = extractSectionInfo(element);
      if (info) {
        newSections.push(info);
      }
    });

    setSections(newSections);
  }, [opts.sectionSelector, extractSectionInfo]);

  // Setup intersection observer
  useEffect(() => {
    // Initial section discovery
    updateSections();

    // Create intersection observer
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
          const id = entryTarget.id || entryTarget.getAttribute('data-section-id');
          if (id) {
            setActiveSectionId(id);
          }
        }
      },
      {
        rootMargin: opts.rootMargin,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all sections
    const elements = document.querySelectorAll(opts.sectionSelector);
    elements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    // Cleanup
    return () => {
      observerRef.current?.disconnect();
    };
  }, [opts.sectionSelector, opts.rootMargin, updateSections]);

  // Re-scan when DOM changes (for SPA navigation)
  useEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      updateSections();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [updateSections]);

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId) || 
                    document.querySelector(`[data-section-id="${sectionId}"]`);
    
    if (element) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });

      // Update URL hash without triggering scroll
      history.replaceState(null, '', `#${sectionId}`);
      
      // Update active section immediately for better UX
      setActiveSectionId(sectionId);
    }
  }, []);

  return {
    sections,
    activeSectionId,
    scrollToSection,
    refreshSections: updateSections,
  };
}

export default useScrollSpy;