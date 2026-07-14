/**
 * useHeroA11y — Accessibility State Hook
 *
 * From DESIGN_SYSTEM §15 (Accessibility Standards):
 * "Accessibility is not a constraint on design — it is a quality standard."
 *
 * From VISUAL_RULES AC1:
 * "WCAG 2.1 Level AA is the minimum standard."
 *
 * This hook manages accessibility state that CSS cannot handle:
 * 1. Live region announcements for dynamic state changes
 * 2. Focus management after error recovery
 * 3. Reduced-motion detection coordination
 *
 * Architecture:
 *   use-hero-a11y.ts    → accessibility state (this file)
 *   hero-accessibility.css → accessibility CSS (focus, contrast, reduced-motion)
 *   hero.tsx            → consumes this hook, renders live region
 *
 * Why JS is needed here (not CSS):
 * - Live region announcements require DOM text updates (aria-live)
 * - Focus management after error requires imperative focus()
 * - Reduced-motion is detectable via CSS media queries, but
 *   JS coordination is needed for timing-dependent logic
 *
 * From TECHNICAL_ARCHITECTURE §16.4:
 * "Skip-to-content link is the first focusable element."
 *
 * TODO Phase 9: Coordinate with GSAP animations for announcement timing
 */

import { useEffect, useRef, useCallback } from 'react';

// ── Types ───────────────────────────────────────────────────

/** All dynamic states that require screen reader announcements */
export type HeroAnnouncement =
  | 'loading'
  | 'loaded'
  | 'error'
  | 'error-recovered'
  | null;

interface UseHeroA11yOptions {
  /** Current hero state for announcements */
  announce: HeroAnnouncement;
  /** Custom message override — if provided, announced instead of default */
  customMessage?: string;
}

interface UseHeroA11yReturn {
  /** Ref to attach to the live region DOM element */
  liveRegionRef: React.RefObject<HTMLDivElement>;
  /** Call after error to focus the retry button */
  focusRetryButton: () => void;
  /** Ref to store the retry button element for focus management */
  retryButtonRef: React.RefObject<HTMLButtonElement>;
}

// ── Default announcement messages ───────────────────────────

const DEFAULT_ANNOUNCEMENTS: Record<string, string> = {
  loading: 'Loading hero content.',
  loaded: 'Hero content loaded.',
  error: 'Failed to load hero content. A retry option is available.',
  'error-recovered': 'Hero content loaded successfully.',
};

// ── Hook ────────────────────────────────────────────────────

/**
 * Manages hero accessibility state: live region announcements
 * and focus management.
 *
 * Usage:
 * ```tsx
 * const { liveRegionRef, focusRetryButton, retryButtonRef } = useHeroA11y({
 *   announce: heroState === 'loading' ? 'loading'
 *     : heroState === 'loaded' ? 'loaded'
 *     : heroState === 'error' ? 'error'
 *     : null,
 * });
 *
 * // In JSX:
 * <div ref={liveRegionRef} className="hero-live-region" aria-live="polite" />
 * <button ref={retryButtonRef} onClick={retry}>Try again</button>
 * ```
 */
export function useHeroA11y({
  announce,
  customMessage,
}: UseHeroA11yOptions): UseHeroA11yReturn {
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const previousAnnouncement = useRef<HeroAnnouncement>(null);

  /**
   * Update the live region text to trigger a screen reader announcement.
   *
   * Technique: Clear the region, then set new text after a microtask.
   * This ensures the screen reader detects the change even if the
   * same text is set twice (e.g., two consecutive errors).
   */
  useEffect(() => {
    if (!liveRegionRef.current) return;
    if (announce === previousAnnouncement.current) return;

    previousAnnouncement.current = announce;

    if (announce === null) {
      liveRegionRef.current.textContent = '';
      return;
    }

    const message = customMessage || DEFAULT_ANNOUNCEMENTS[announce] || '';

    // Clear first, then set after microtask — ensures re-announcement
    liveRegionRef.current.textContent = '';
    const timer = setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [announce, customMessage]);

  /**
   * Focus the retry button after error recovery.
   *
   * From VISUAL_RULES AC4:
   * "Focus indicators are visible and high-contrast."
   *
   * From TECHNICAL_ARCHITECTURE §16.4:
   * "Focus management: After dynamic content changes, focus
   *  moves to the new content."
   */
  const focusRetryButton = useCallback(() => {
    // Use requestAnimationFrame to ensure DOM is updated before focusing
    requestAnimationFrame(() => {
      retryButtonRef.current?.focus();
    });
  }, []);

  return {
    liveRegionRef,
    focusRetryButton,
    retryButtonRef,
  };
}
