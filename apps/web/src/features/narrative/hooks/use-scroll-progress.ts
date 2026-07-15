/**
 * useScrollProgress — Scroll Progress Hook
 *
 * Returns multiple progress views for different consumption
 * contexts: page progress, section progress, timeline progress,
 * and normalized progress.
 *
 * Each progress value is a normalized 0→1 number suitable for
 * driving animations, UI indicators, and analytics.
 *
 * Phase 5.5: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function ProgressBar() {
 *   const { pageProgress, sectionProgress } = useScrollProgress();
 *
 *   return (
 *     <div>
 *       <div style={{ width: `${pageProgress * 100}%` }} />
 *       <span>Section: {Math.round(sectionProgress * 100)}%</span>
 *     </div>
 *   );
 * }
 * ```
 */

import { useScrollState } from './use-scroll-state';

import type { ScrollState } from '../scroll-state.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollProgress.
 */
export interface UseScrollProgressReturn {
  /** Overall page scroll progress (0→1) */
  readonly pageProgress: number;
  /** Progress within the current section (0→1) */
  readonly sectionProgress: number;
  /** Timeline progress (0→1) — mirrors pageProgress */
  readonly timelineProgress: number;
  /** Timeline-normalized progress (0→1) */
  readonly normalizedProgress: number;
  /** Raw scroll Y position (pixels) */
  readonly scrollY: number;
}

// ── Selector ───────────────────────────────────────────────

/**
 * Extracts progress-relevant fields from the scroll state.
 */
function progressSelector(state: ScrollState): UseScrollProgressReturn {
  return {
    pageProgress: state.pageProgress,
    sectionProgress: state.sectionProgress,
    timelineProgress: state.timelineProgress,
    normalizedProgress: state.timelineNormalizedProgress,
    scrollY: state.scrollY,
  };
}

/**
 * Equality function for the progress selector.
 * Compares each numeric field for precise change detection.
 */
function progressEquality(
  prev: UseScrollProgressReturn,
  next: UseScrollProgressReturn,
): boolean {
  return (
    prev.pageProgress === next.pageProgress &&
    prev.sectionProgress === next.sectionProgress &&
    prev.timelineProgress === next.timelineProgress &&
    prev.normalizedProgress === next.normalizedProgress &&
    prev.scrollY === next.scrollY
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns scroll progress information at multiple levels.
 *
 * Provides page-wide, section-specific, and timeline progress
 * values, all normalized to 0→1.
 *
 * @returns Progress values for different consumption contexts
 */
export function useScrollProgress(): UseScrollProgressReturn {
  return useScrollState(progressSelector, progressEquality);
}
