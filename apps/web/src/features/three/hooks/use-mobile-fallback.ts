/**
 * useMobileFallback — Full Snapshot or Selector Slice
 *
 * Main hook for accessing mobile fallback state. Supports two overload
 * signatures:
 *   1. useMobileFallback() — returns the full MobileFallbackSnapshot
 *   2. useMobileFallback(selector) — returns a derived slice
 *
 * Uses useSyncExternalStore + useRef equality pattern for optimal
 * re-render performance. Components re-render only when their selected
 * slice changes.
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { useRef, useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { useMobileFallbackContext } from '../mobile-fallback-provider';

import type {
  MobileFallbackSnapshot,
  MobileFallbackSelector,
  MobileFallbackEquality,
} from '../mobile-fallback.types';

// ── Overload Signatures ──────────────────────────────────────

/** Full snapshot overload. */
export function useMobileFallback(): MobileFallbackSnapshot;

/** Selector slice overload. */
export function useMobileFallback<T>(
  selector: MobileFallbackSelector<T>,
  equalityFn?: MobileFallbackEquality<T>,
): T;

// ── Implementation ───────────────────────────────────────────

export function useMobileFallback<T>(
  selector?: MobileFallbackSelector<T>,
  equalityFn?: MobileFallbackEquality<T>,
): MobileFallbackSnapshot | T {
  const { snapshot, manager } = useMobileFallbackContext();

  /* Store the equality function in a ref to avoid re-subscribing. */
  const equalityRef = useRef(equalityFn);
  equalityRef.current = equalityFn ?? (Object.is as MobileFallbackEquality<T>);

  /* Stable selector reference — always call the hook, never conditionally. */
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const wrappedSelector = useCallback(
    (state: MobileFallbackSnapshot): T => selectorRef.current!(state),
    [],
  );

  const getSnapshot = useCallback(
    () => manager.getSnapshot(),
    [manager],
  );

  const subscribe = useCallback(
    (callback: () => void) => manager.subscribe(callback),
    [manager],
  );

  /* Use the base snapshot for subscription, derive the selected value. */
  const selectedSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  /* If no selector, return the full snapshot directly. */
  const selected = useMemo(
    () => wrappedSelector(selectedSnapshot),
    [selectedSnapshot, wrappedSelector],
  );

  if (!selector) {
    return snapshot;
  }

  return selected;
}
