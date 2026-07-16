/**
 * useMaterials — Primary Public API for Material State
 *
 * Subscribes to the {@link materialsManager} singleton via `useSyncExternalStore`
 * for the most efficient React 18 integration. Consumers re-render only when
 * the snapshot changes.
 *
 * Supports a selector overload identical to {@link useCamera} for derived
 * slice access with equality comparison.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { materialsManager } from '../materials-manager';
import { useMaterialsContext } from '../materials-provider';

import type {
  MaterialSnapshot,
  MaterialSelector,
  MaterialEquality,
} from '../materials.types';

/**
 * Get the current material snapshot (used by `useSyncExternalStore`).
 */
function getMaterialsSnapshot(): MaterialSnapshot {
  return materialsManager.getSnapshot();
}

/**
 * Subscribe to material snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeMaterials(callback: () => void): () => void {
  return materialsManager.subscribe(callback);
}

/**
 * Access the full material snapshot.
 *
 * Must be used within a {@link MaterialsRoot}. The root confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function MaterialsOverview() {
 *   const snapshot = useMaterials();
 *   return <span>Presets: {snapshot.presetCount}</span>;
 * }
 * ```
 */
export function useMaterials(): MaterialSnapshot;

/**
 * Access a derived slice of the material snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function ActivePreset() {
 *   const preset = useMaterials((s) => s.activePresetId);
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useMaterials<T>(
  selector: MaterialSelector<T>,
  equalityFn?: MaterialEquality<T>,
): T;

export function useMaterials<T>(
  selector?: MaterialSelector<T>,
  equalityFn?: MaterialEquality<T>,
): MaterialSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  useMaterialsContext();

  const snapshot = useSyncExternalStore(
    subscribeMaterials,
    getMaterialsSnapshot,
    getMaterialsSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: MaterialSnapshot } | null>(
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
