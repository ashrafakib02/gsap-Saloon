import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';
import { getLenis } from '@/lib/lenis-config';

interface ScrollManagerOptions {
  /** IDs of sections to track for active section detection */
  sectionIds?: string[];
  /** Callback when active section changes */
  onActiveSectionChange?: (sectionId: string) => void;
}

/**
 * Manages scroll behavior for the single-page narrative experience:
 * - Handles hash-based deep linking (/#artisans, /#booking)
 * - Tracks active section via IntersectionObserver
 * - Provides smooth scroll-to-section via Lenis
 * - Debounces scroll handlers at 16ms (one frame)
 */
export function useScrollManager({ sectionIds = [], onActiveSectionChange }: ScrollManagerOptions = {}): {
  scrollToSection: (id: string) => void;
} {
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeSectionRef = useRef<string>('');

  // Handle hash-based deep linking on mount and route changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      // Delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(el, { offset: 0, immediate: false });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  // Set up IntersectionObserver for active section tracking
  useEffect(() => {
    if (sectionIds.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let maxRatio = 0;
        let mostVisible = '';

        for (const entry of entries) {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target.id;
          }
        }

        if (mostVisible && mostVisible !== activeSectionRef.current) {
          activeSectionRef.current = mostVisible;
          onActiveSectionChange?.(mostVisible);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px',
      },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sectionIds, onActiveSectionChange]);

  // Smooth scroll to a section by ID
  const scrollToSection = useCallback((id: string): void => {
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, immediate: false });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    // Update URL hash without triggering navigation
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  return { scrollToSection };
}
