/**
 * useThreePerformance — Performance Snapshot with Direct Subscription
 *
 * Subscribes to the {@link threePerformanceManager} singleton via
 * `useSyncExternalStore` for the most efficient React 18 integration.
 * Consumers re-render only when the snapshot changes, even if the
 * provider's context hasn't re-rendered yet.
 *
 * Supports a selector overload identical to {@link useThree} for derived
 * slice access with equality comparison.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { threePerformanceManager } from '../three-performance';
import { useThreeContext } from '../three-context';

import type {
  ThreePerformanceSnapshot,
  ThreePerformanceSelector,
  ThreePerformanceEquality,
} from '../three.types';

/**
 * Get the current performance snapshot (used by `useSyncExternalStore`).
 */
function getPerformanceSnapshot(): ThreePerformanceSnapshot {
  return threePerformanceManager.getSnapshot();
}

/**
 * Subscribe to performance snapshot changes (used by `useSyncExternalStore`).
 */
function subscribePerformance(
  callback: () => void,
): () => void {
  return threePerformanceManager.subscribe(callback);
}

/**
 * Access the full performance snapshot.
 *
 * Must be used within a {@link ThreeProvider}. The provider confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function PerfBadge() {
 *   const snapshot = useThreePerformance();
 *   return <span>Quality: {snapshot.estimatedQuality}</span>;
 * }
 * ```
 */
export function useThreePerformance(): ThreePerformanceSnapshot;

/**
 * Access a derived slice of the performance snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function FrameBudget() {
 *   const budget = useThreePerformance((s) => s.frame.frameBudgetMs);
 *   return <span>{budget}ms</span>;
 * }
 * ```
 */
export function useThreePerformance<T>(
  selector: ThreePerformanceSelector<T>,
  equalityFn?: ThreePerformanceEquality<T>,
): T;

export function useThreePerformance<T>(
  selector?: ThreePerformanceSelector<T>,
  equalityFn?: ThreePerformanceEquality<T>,
): ThreePerformanceSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  useThreeContext();

  const snapshot = useSyncExternalStore(
    subscribePerformance,
    getPerformanceSnapshot,
    getPerformanceSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: ThreePerformanceSnapshot } | null>(
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
