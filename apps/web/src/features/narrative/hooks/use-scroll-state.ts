/**
 * useScrollState — Main Scroll State Hook
 *
 * The primary hook for consuming centralized scroll state.
 * Returns the current scroll state snapshot, re-rendering
 * only when the selected value changes.
 *
 * Use this as the foundation for all scroll-state consumption.
 * Specialized hooks (useCurrentSection, useScrollProgress, etc.)
 * are built on top of this hook with specific selectors.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Avoid rerenders. Use immutable snapshots. Memoized selectors."
 *
 * Phase 5.5: React subscription layer — no animation logic.
 *
 * @example
 * ```tsx
 * // Full state (use sparingly — re-renders on every change)
 * function ScrollDebug() {
 *   const state = useScrollState();
 *   return <pre>{JSON.stringify(state, null, 2)}</pre>;
 * }
 *
 * // With selector (recommended — re-renders only on relevant change)
 * function ProgressBar() {
 *   const progress = useScrollState((s) => s.pageProgress);
 *   return <div style={{ width: `${progress * 100}%` }} />;
 * }
 * ```
 */

import { useState, useEffect, useRef } from 'react';

import { scrollStateManager } from '../scroll-state-manager';

import type {
  ScrollState,
  ScrollStateSelector,
  ScrollStateEquality,
} from '../scroll-state.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollState.
 *
 * When called without a selector, returns the full ScrollState.
 * When called with a selector, returns the selected value of type T.
 */
export type UseScrollStateReturn<T = ScrollState> = T;

// ── Hook ────────────────────────────────────────────────────

/**
 * Subscribes to the centralized scroll state.
 *
 * Returns the current scroll state snapshot (or a selected slice),
 * re-rendering the component only when the selected value changes.
 *
 * The hook initializes the scroll state manager on first mount
 * and cleans up subscriptions on unmount.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Context values memoized with useMemo to prevent
 *  unnecessary consumer re-renders."
 *
 * @param selector - Optional selector to extract a slice of state
 * @param equalityFn - Optional equality function (default: Object.is)
 * @returns The current scroll state or selected slice
 */
export function useScrollState<T = ScrollState>(
  selector?: ScrollStateSelector<T>,
  equalityFn?: ScrollStateEquality<T>,
): UseScrollStateReturn<T> {
  /* Initialize the scroll state manager on first mount */
  useEffect(() => {
    scrollStateManager.init();
  }, []);

  /* Store selector and equality function in refs to avoid re-subscribing */
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const equalityRef = useRef(equalityFn);
  equalityRef.current = equalityFn;

  /* Initialize state — compute initial selected value */
  const [state, setState] = useState<T>(() => {
    const snap = scrollStateManager.getSnapshot();
    return selector ? selector(snap) : (snap as T);
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  /* Subscribe to state changes */
  useEffect(() => {
    const currentSelector = selectorRef.current;

    if (currentSelector) {
      /* Selector-based subscription — only re-render when selected value changes */
      const unsubscribe = scrollStateManager.subscribeSelector(
        currentSelector,
        () => {
          const snap = scrollStateManager.getSnapshot();
          const newValue = currentSelector(snap);

          /* Compare with current value to avoid unnecessary updates */
          const isEqual = equalityRef.current
            ? equalityRef.current(stateRef.current, newValue)
            : Object.is(stateRef.current, newValue);

          if (!isEqual) {
            setState(newValue);
          }
        },
        equalityFn,
      );

      return unsubscribe;
    }

    /* No selector — subscribe to all changes */
    const unsubscribe = scrollStateManager.subscribe(() => {
      setState(scrollStateManager.getSnapshot() as T);
    });

    return unsubscribe;
  }, [selector, equalityFn]);

  return state;
}
