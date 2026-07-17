/**
 * usePerformanceBudget — Primary Public API for Budget State
 *
 * Subscribes to the {@link performanceBudgetManager} singleton via
 * `useSyncExternalStore` for the most efficient React 18 integration.
 * Consumers re-render only when the snapshot changes.
 *
 * Supports a selector overload for derived slice access with equality
 * comparison.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { performanceBudgetManager } from '../performance-budget-manager';
import { usePerformanceBudgetContext } from '../performance-budget-provider';

import type {
  BudgetSnapshot,
  BudgetSelector,
  BudgetEquality,
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
 * Access the full budget snapshot.
 *
 * Must be used within a {@link PerformanceBudgetRoot}. The root confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function BudgetOverview() {
 *   const snapshot = usePerformanceBudget();
 *   return <span>Budgets: {snapshot.budgetCount}</span>;
 * }
 * ```
 */
export function usePerformanceBudget(): BudgetSnapshot;

/**
 * Access a derived slice of the budget snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function ExceededCount() {
 *   const count = usePerformanceBudget((s) => s.exceededCount);
 *   return <span>{count} exceeded</span>;
 * }
 * ```
 */
export function usePerformanceBudget<T>(
  selector: BudgetSelector<T>,
  equalityFn?: BudgetEquality<T>,
): T;

export function usePerformanceBudget<T>(
  selector?: BudgetSelector<T>,
  equalityFn?: BudgetEquality<T>,
): BudgetSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  usePerformanceBudgetContext();

  const snapshot = useSyncExternalStore(
    subscribeBudget,
    getBudgetSnapshot,
    getBudgetSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: BudgetSnapshot } | null>(
    null,
  );

  const selected = selector
    ? selector(snapshot)
    : (snapshot as T);

  const eq = equalityFn ?? (Object as { is: (a: unknown, b: unknown) => boolean }).is;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { selected, snapshot };
  } else if (!eq(prevRef.current.selected, selected)) {
    prevRef.current = { selected, snapshot };
  }

  /* Memoize to avoid returning a new object reference when the selected
     value is structurally equal. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.selected, [selected]);
}
