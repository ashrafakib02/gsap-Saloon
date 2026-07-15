/**
 * useRevealProgress — Overall Reveal Progress Hook
 *
 * Returns aggregate reveal progress across the whole system:
 * overall progress, revealed/pending/visible counts, and the total.
 *
 * Each value is derived from the reveal snapshot and re-renders only
 * when the aggregate changes.
 *
 * Phase 5.6: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function RevealMeter() {
 *   const { overallProgress, revealedCount, totalCount } = useRevealProgress();
 *   return <span>{revealedCount}/{totalCount} ({Math.round(overallProgress * 100)}%)</span>;
 * }
 * ```
 */

import { useProgressiveReveal } from './use-progressive-reveal';

import type { ProgressiveRevealSnapshot } from '../progressive-reveal.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useRevealProgress.
 */
export interface UseRevealProgressReturn {
  /** Overall reveal progress across all items (0→1) */
  readonly overallProgress: number;
  /** Number of revealed items */
  readonly revealedCount: number;
  /** Number of pending items */
  readonly pendingCount: number;
  /** Number of currently visible items */
  readonly visibleCount: number;
  /** Total registered item count */
  readonly totalCount: number;
}

// ── Selector ───────────────────────────────────────────────

/**
 * Extracts progress-relevant aggregates from the reveal snapshot.
 */
function progressSelector(
  snapshot: ProgressiveRevealSnapshot,
): UseRevealProgressReturn {
  return {
    overallProgress: snapshot.overallProgress,
    revealedCount: snapshot.revealedItemIds.length,
    pendingCount: snapshot.pendingItemIds.length,
    visibleCount: snapshot.visibleItemIds.length,
    totalCount: snapshot.items.size,
  };
}

/**
 * Equality function comparing each aggregate field.
 */
function progressEquality(
  prev: UseRevealProgressReturn,
  next: UseRevealProgressReturn,
): boolean {
  return (
    prev.overallProgress === next.overallProgress &&
    prev.revealedCount === next.revealedCount &&
    prev.pendingCount === next.pendingCount &&
    prev.visibleCount === next.visibleCount &&
    prev.totalCount === next.totalCount
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns aggregate reveal progress across the whole system.
 *
 * @returns Overall progress and item counts
 */
export function useRevealProgress(): UseRevealProgressReturn {
  return useProgressiveReveal(progressSelector, progressEquality);
}
