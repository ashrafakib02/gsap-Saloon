/**
 * usePerformanceBudgetState — Derived Budget State (Counts, Exceeded, Progress)
 *
 * Subscribes to the budget-manager snapshot and derives aggregate state:
 * total budget count, exceeded count, recommendation count, overall health.
 * Useful for UI overlays, debug panels, and monitoring.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { performanceBudgetManager } from '../performance-budget-manager';
import { usePerformanceBudgetContext } from '../performance-budget-provider';

import type { BudgetSnapshot } from '../performance-budget.types';

/**
 * Get the current budget snapshot (used by `useSyncExternalStore`).
 */
function getBudgetSnapshot(): BudgetSnapshot {
  return performanceBudgetManager.getSnapshot();
}

/**
 * Subscribe to budget snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeBudget(callback: () => void): () => void {
  return performanceBudgetManager.subscribe(callback);
}

/**
 * Derived aggregate state for the performance budget system.
 */
export interface BudgetStateInfo {
  /** Total registered budget count. */
  readonly budgetCount: number;
  /** Total registered metric count. */
  readonly metricCount: number;
  /** Total registered profile count. */
  readonly profileCount: number;
  /** Number of budgets currently exceeded. */
  readonly exceededCount: number;
  /** Number of active recommendations. */
  readonly recommendationCount: number;
  /** Whether all budgets are within limits (none exceeded). */
  readonly isHealthy: boolean;
  /** Whether any budgets have been exceeded. */
  readonly hasExceeded: boolean;
  /** Active quality preset. */
  readonly qualityPreset: BudgetSnapshot['qualityPreset'];
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
  /** Budget health ratio (0-1, 1 = all healthy). */
  readonly healthRatio: number;
}

/**
 * Access derived aggregate budget state.
 *
 * Must be used within a {@link PerformanceBudgetRoot}. Re-renders only
 * when the derived aggregate values change.
 *
 * @example
 * ```tsx
 * function BudgetHealth() {
 *   const { isHealthy, exceededCount, healthRatio } = usePerformanceBudgetState();
 *   return (
 *     <div>
 *       <span>{isHealthy ? 'All OK' : `${exceededCount} exceeded`}</span>
 *       <span>{Math.round(healthRatio * 100)}% healthy</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePerformanceBudgetState(): BudgetStateInfo {
  /* Confirm the provider is mounted. */
  usePerformanceBudgetContext();

  const snapshot = useSyncExternalStore(
    subscribeBudget,
    getBudgetSnapshot,
    getBudgetSnapshot,
  );

  return useMemo<BudgetStateInfo>(
    () => ({
      budgetCount: snapshot.budgetCount,
      metricCount: snapshot.metricCount,
      profileCount: snapshot.profileCount,
      exceededCount: snapshot.exceededCount,
      recommendationCount: snapshot.recommendationCount,
      isHealthy: snapshot.exceededCount === 0 && snapshot.budgetCount > 0,
      hasExceeded: snapshot.exceededCount > 0,
      qualityPreset: snapshot.qualityPreset,
      isReducedMotion: snapshot.isReducedMotion,
      healthRatio: snapshot.budgetCount > 0
        ? (snapshot.budgetCount - snapshot.exceededCount) / snapshot.budgetCount
        : 1,
    }),
    [
      snapshot.budgetCount,
      snapshot.metricCount,
      snapshot.profileCount,
      snapshot.exceededCount,
      snapshot.recommendationCount,
      snapshot.qualityPreset,
      snapshot.isReducedMotion,
    ],
  );
}
