/**
 * usePerformanceBudgetMetrics — Metric Queries and Values
 *
 * Subscribes to the budget-manager snapshot and provides access to
 * metric information: all registered metrics, their latest values,
 * and per-category metric groupings. Useful for debug overlays and
 * metric-driven UI.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { performanceBudgetManager } from '../performance-budget-manager';
import { usePerformanceBudgetContext } from '../performance-budget-provider';

import type {
  BudgetSnapshot,
  MetricId,
  MetricRuntimeState,
  BudgetCategory,
} from '../performance-budget.types';

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
 * Derived metric information for the performance budget system.
 */
export interface BudgetMetricsInfo {
  /** All metric runtime states. */
  readonly allMetrics: ReadonlyMap<MetricId, MetricRuntimeState>;
  /** All registered metric IDs. */
  readonly metricIds: readonly MetricId[];
  /** Total registered metric count. */
  readonly metricCount: number;
  /** Per-category metric groupings. */
  readonly metricsByCategory: ReadonlyMap<BudgetCategory, readonly MetricId[]>;
  /** Latest value for a specific metric. */
  readonly getLatestValue: (id: MetricId) => number;
}

/**
 * Access derived metric information.
 *
 * Must be used within a {@link PerformanceBudgetRoot}. Re-renders only
 * when the metric values change.
 *
 * @example
 * ```tsx
 * function MetricDisplay() {
 *   const { metricCount, getLatestValue } = usePerformanceBudgetMetrics();
 *   const fps = getLatestValue('fps');
 *   return <span>{metricCount} metrics, fps: {fps}</span>;
 * }
 * ```
 */
export function usePerformanceBudgetMetrics(): BudgetMetricsInfo {
  /* Confirm the provider is mounted. */
  usePerformanceBudgetContext();

  const snapshot = useSyncExternalStore(
    subscribeBudget,
    getBudgetSnapshot,
    getBudgetSnapshot,
  );

  return useMemo<BudgetMetricsInfo>(
    () => {
      const registry = performanceBudgetManager.getRegistry();
      const metricIds = registry.getMetricIds();

      /* Group metrics by category. */
      const metricsByCategory = new Map<BudgetCategory, MetricId[]>();
      for (const [id] of snapshot.metrics) {
        const def = performanceBudgetManager.getAllBudgetDefinitions()
          .find((d) => d.metricId === id);
        const category = def?.category ?? 'memory';
        const existing = metricsByCategory.get(category);
        if (existing) {
          existing.push(id);
        } else {
          metricsByCategory.set(category, [id]);
        }
      }

      const getLatestValue = (id: MetricId): number => {
        return snapshot.metrics.get(id)?.latestValue ?? 0;
      };

      return {
        allMetrics: snapshot.metrics,
        metricIds,
        metricCount: snapshot.metricCount,
        metricsByCategory,
        getLatestValue,
      };
    },
    [snapshot.metrics, snapshot.metricCount],
  );
}
