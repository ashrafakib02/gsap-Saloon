/**
 * useAccessibilityFallback — Full Snapshot or Selector Slice
 *
 * Main hook for accessing accessibility fallback state. Supports two overload
 * signatures:
 *   1. useAccessibilityFallback() — returns the full AccessibilitySnapshot
 *   2. useAccessibilityFallback(selector) — returns a derived slice
 *
 * Uses useSyncExternalStore + useRef equality pattern for optimal
 * re-render performance. Components re-render only when their selected
 * slice changes.
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { useRef, useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { useAccessibilityFallbackContext } from '../accessibility-fallback-provider';

import type {
  AccessibilitySnapshot,
  AccessibilitySelector,
  AccessibilityEquality,
} from '../accessibility-fallback.types';

// ── Overload Signatures ──────────────────────────────────────

/** Full snapshot overload. */
export function useAccessibilityFallback(): AccessibilitySnapshot;

/** Selector slice overload. */
export function useAccessibilityFallback<T>(
  selector: AccessibilitySelector<T>,
  equalityFn?: AccessibilityEquality<T>,
): T;

// ── Implementation ───────────────────────────────────────────

export function useAccessibilityFallback<T>(
  selector?: AccessibilitySelector<T>,
  equalityFn?: AccessibilityEquality<T>,
): AccessibilitySnapshot | T {
  const { snapshot, manager } = useAccessibilityFallbackContext();

  /* Store the equality function in a ref to avoid re-subscribing. */
  const equalityRef = useRef(equalityFn);
  equalityRef.current = equalityFn ?? (Object.is as AccessibilityEquality<T>);

  /* Stable selector reference — always call the hook, never conditionally. */
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const wrappedSelector = useCallback(
    (state: AccessibilitySnapshot): T => selectorRef.current!(state),
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
