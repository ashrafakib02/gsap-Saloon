/**
 * useLighting — Primary Public API for Lighting State
 *
 * Subscribes to the {@link lightingManager} singleton via `useSyncExternalStore`
 * for the most efficient React 18 integration. Consumers re-render only when
 * the snapshot changes.
 *
 * Supports a selector overload identical to {@link useCamera} for derived
 * slice access with equality comparison.
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { lightingManager } from '../lighting-manager';
import { useLightingContext } from '../lighting-provider';

import type {
  LightingSnapshot,
  LightingSelector,
  LightingEquality,
} from '../lighting.types';

/**
 * Get the current lighting snapshot (used by `useSyncExternalStore`).
 */
function getLightingSnapshot(): LightingSnapshot {
  return lightingManager.getSnapshot();
}

/**
 * Subscribe to lighting snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeLighting(callback: () => void): () => void {
  return lightingManager.subscribe(callback);
}

/**
 * Access the full lighting snapshot.
 *
 * Must be used within a {@link LightingRoot}. The root confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function LightingOverview() {
 *   const snapshot = useLighting();
 *   return <span>Presets: {snapshot.presetCount}</span>;
 * }
 * ```
 */
export function useLighting(): LightingSnapshot;

/**
 * Access a derived slice of the lighting snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function ActivePreset() {
 *   const preset = useLighting((s) => s.activePresetId);
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useLighting<T>(
  selector: LightingSelector<T>,
  equalityFn?: LightingEquality<T>,
): T;

export function useLighting<T>(
  selector?: LightingSelector<T>,
  equalityFn?: LightingEquality<T>,
): LightingSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  useLightingContext();

  const snapshot = useSyncExternalStore(
    subscribeLighting,
    getLightingSnapshot,
    getLightingSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: LightingSnapshot } | null>(
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
