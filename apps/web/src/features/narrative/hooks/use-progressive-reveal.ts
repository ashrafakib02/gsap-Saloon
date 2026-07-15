/**
 * useProgressiveReveal — Base Progressive Reveal Hook
 *
 * The primary hook for consuming the centralized progressive reveal
 * state. Returns the current reveal snapshot (or a selected slice),
 * re-rendering only when the selected value changes.
 *
 * Use this as the foundation for all reveal-state consumption.
 * Specialized hooks (useRevealGroup, useRevealItem, etc.) are built
 * on top of this hook with specific selectors.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Avoid rerenders. Use immutable snapshots. Memoized selectors."
 *
 * Phase 5.6: React subscription layer — no animation logic.
 *
 * @example
 * ```tsx
 * // Full snapshot (use sparingly — re-renders on every change)
 * function RevealDebug() {
 *   const snapshot = useProgressiveReveal();
 *   return <pre>{snapshot.revealedItemIds.join(', ')}</pre>;
 * }
 *
 * // With selector (recommended — re-renders only on relevant change)
 * function RevealProgress() {
 *   const progress = useProgressiveReveal((s) => s.overallProgress);
 *   return <div style={{ width: `${progress * 100}%` }} />;
 * }
 * ```
 */

import { useEffect, useRef, useState } from 'react';

import { progressiveRevealManager } from '../progressive-reveal-manager';

import type {
  ProgressiveRevealSnapshot,
  RevealSelector,
  RevealEquality,
} from '../progressive-reveal.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useProgressiveReveal.
 *
 * When called without a selector, returns the full snapshot.
 * When called with a selector, returns the selected value of type T.
 */
export type UseProgressiveRevealReturn<T = ProgressiveRevealSnapshot> = T;

// ── Hook ────────────────────────────────────────────────────

/**
 * Subscribes to the centralized progressive reveal state.
 *
 * Returns the current reveal snapshot (or a selected slice),
 * re-rendering the component only when the selected value changes.
 *
 * The hook initializes the reveal manager on first mount and cleans
 * up its subscription on unmount.
 *
 * @param selector - Optional selector to extract a slice of the snapshot
 * @param equalityFn - Optional equality function (default: Object.is)
 * @returns The current reveal snapshot or selected slice
 */
export function useProgressiveReveal<T = ProgressiveRevealSnapshot>(
  selector?: RevealSelector<T>,
  equalityFn?: RevealEquality<T>,
): UseProgressiveRevealReturn<T> {
  /* Initialize the reveal manager on first mount */
  useEffect(() => {
    progressiveRevealManager.init();
  }, []);

  /* Store selector and equality in refs to avoid re-subscribing */
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const equalityRef = useRef(equalityFn);
  equalityRef.current = equalityFn;

  /* Initialize state — compute initial selected value */
  const [state, setState] = useState<T>(() => {
    const snap = progressiveRevealManager.getSnapshot();
    return selector ? selector(snap) : (snap as unknown as T);
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  /* Subscribe to reveal state changes */
  useEffect(() => {
    const currentSelector = selectorRef.current;

    if (currentSelector) {
      /* Selector-based subscription — only re-render when selected value changes */
      const unsubscribe = progressiveRevealManager.subscribeSelector(
        currentSelector,
        () => {
          const snap = progressiveRevealManager.getSnapshot();
          const newValue = currentSelector(snap);

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
    const unsubscribe = progressiveRevealManager.subscribe(() => {
      setState(progressiveRevealManager.getSnapshot() as unknown as T);
    });

    return unsubscribe;
  }, [selector, equalityFn]);

  return state;
}
