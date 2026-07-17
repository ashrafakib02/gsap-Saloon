/**
 * usePerformanceBudgetRegistry — Read-Only Budget Registry Queries
 *
 * Provides access to the read-only registry query interface from the
 * budget manager. The registry exposes computed queries over the current
 * snapshot — budget counts, filtered lists, exceeded budgets — without
 * exposing mutation methods.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { useMemo } from 'react';

import { performanceBudgetManager } from '../performance-budget-manager';
import { usePerformanceBudgetContext } from '../performance-budget-provider';

import type { BudgetRegistry } from '../performance-budget.types';

/**
 * Access the read-only performance budget registry.
 *
 * Must be used within a {@link PerformanceBudgetRoot}. Returns a stable
 * registry reference whose query methods read from the latest snapshot.
 *
 * @example
 * ```tsx
 * function BudgetList() {
 *   const registry = usePerformanceBudgetRegistry();
 *   const exceeded = registry.getExceededBudgets();
 *   return <span>{exceeded.length} exceeded budgets</span>;
 * }
 * ```
 */
export function usePerformanceBudgetRegistry(): BudgetRegistry {
  /* Confirm the provider is mounted. */
  usePerformanceBudgetContext();

  return useMemo<BudgetRegistry>(
    () => performanceBudgetManager.getRegistry(),
    [],
  );
}
