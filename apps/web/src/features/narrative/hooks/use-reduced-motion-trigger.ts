/**
 * useReducedMotionTrigger — Reduced Motion Integration Hook
 *
 * Bridges the ScrollTrigger system with the user's
 * prefers-reduced-motion preference. Provides:
 *
 * - Real-time detection of reduced-motion changes
 * - Automatic system-wide handling when preference changes
 * - Per-trigger behavior configuration support
 *
 * This hook does NOT create or manage triggers. It only
 * listens for reduced-motion changes and notifies the
 * ScrollTrigger manager.
 *
 * Phase 5.4: Infrastructure hook — no animation logic.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { prefersReducedMotion, isReducedMotion } = useReducedMotionTrigger();
 *
 *   return (
 *     <div className={isReducedMotion ? 'reduced-motion' : ''}>
 *       ...
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect, useState, useCallback, useMemo } from 'react';

import { handleReducedMotionChange } from '../scrolltrigger-manager';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useReducedMotionTrigger.
 */
export interface UseReducedMotionTriggerReturn {
  /** Whether reduced motion is currently preferred */
  readonly prefersReducedMotion: boolean;
  /** Alias for prefersReducedMotion — common naming convention */
  readonly isReducedMotion: boolean;
  /** Manually trigger reduced-motion handling */
  readonly notifyChange: (isActive: boolean) => void;
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Listens for prefers-reduced-motion changes and notifies
 * the ScrollTrigger manager.
 *
 * Uses matchMedia for real-time OS-level preference detection.
 * SSR-safe — defaults to false on the server.
 *
 * From DESIGN_SYSTEM §14:
 * "When prefers-reduced-motion: reduce is active —
 *  all scroll animations instant, all hover transitions instant."
 *
 * From MEMORY.md §10:
 * "Accessibility is non-negotiable."
 *
 * @returns Reduced motion state and notification API
 */
export function useReducedMotionTrigger(): UseReducedMotionTriggerReturn {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      const newValue = event.matches;
      setPrefersReduced(newValue);
      handleReducedMotionChange(newValue);
    };

    /* Set initial value */
    setPrefersReduced(mql.matches);

    /* Listen for changes */
    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  const notifyChange = useCallback((isActive: boolean) => {
    handleReducedMotionChange(isActive);
  }, []);

  return useMemo(
    () => ({
      prefersReducedMotion: prefersReduced,
      isReducedMotion: prefersReduced,
      notifyChange,
    }),
    [prefersReduced, notifyChange],
  );
}
