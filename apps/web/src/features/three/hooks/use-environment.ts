/**
 * useEnvironment — Primary Public API for Environment State
 *
 * Subscribes to the {@link environmentManager} singleton via `useSyncExternalStore`
 * for the most efficient React 18 integration. Consumers re-render only when
 * the snapshot changes.
 *
 * Supports a selector overload identical to {@link useCamera} for derived
 * slice access with equality comparison.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { environmentManager } from '../environment-manager';
import { useEnvironmentContext } from '../environment-provider';

import type {
  EnvironmentSnapshot,
  EnvironmentSelector,
  EnvironmentEquality,
} from '../environment.types';

/**
 * Get the current environment snapshot (used by `useSyncExternalStore`).
 */
function getEnvironmentSnapshot(): EnvironmentSnapshot {
  return environmentManager.getSnapshot();
}

/**
 * Subscribe to environment snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeEnvironment(callback: () => void): () => void {
  return environmentManager.subscribe(callback);
}

/**
 * Access the full environment snapshot.
 *
 * Must be used within an {@link EnvironmentRoot}. The root confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function EnvironmentOverview() {
 *   const snapshot = useEnvironment();
 *   return <span>Presets: {snapshot.presetCount}</span>;
 * }
 * ```
 */
export function useEnvironment(): EnvironmentSnapshot;

/**
 * Access a derived slice of the environment snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function ActivePreset() {
 *   const preset = useEnvironment((s) => s.activePresetId);
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useEnvironment<T>(
  selector: EnvironmentSelector<T>,
  equalityFn?: EnvironmentEquality<T>,
): T;

export function useEnvironment<T>(
  selector?: EnvironmentSelector<T>,
  equalityFn?: EnvironmentEquality<T>,
): EnvironmentSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  useEnvironmentContext();

  const snapshot = useSyncExternalStore(
    subscribeEnvironment,
    getEnvironmentSnapshot,
    getEnvironmentSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: EnvironmentSnapshot } | null>(
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
