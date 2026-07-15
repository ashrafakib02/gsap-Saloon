/**
 * useCamera — Primary Public API for Camera State
 *
 * Subscribes to the {@link cameraManager} singleton via `useSyncExternalStore`
 * for the most efficient React 18 integration. Consumers re-render only when
 * the snapshot changes.
 *
 * Supports a selector overload identical to {@link useScene} for derived
 * slice access with equality comparison.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { cameraManager } from '../camera-manager';
import { useCameraContext } from '../camera-provider';

import type {
  CameraSnapshot,
  CameraSelector,
  CameraEquality,
} from '../camera.types';

/**
 * Get the current camera snapshot (used by `useSyncExternalStore`).
 */
function getCameraSnapshot(): CameraSnapshot {
  return cameraManager.getSnapshot();
}

/**
 * Subscribe to camera snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeCamera(callback: () => void): () => void {
  return cameraManager.subscribe(callback);
}

/**
 * Access the full camera snapshot.
 *
 * Must be used within a {@link CameraRoot}. The root confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function CameraOverview() {
 *   const snapshot = useCamera();
 *   return <span>Presets: {snapshot.presetCount}</span>;
 * }
 * ```
 */
export function useCamera(): CameraSnapshot;

/**
 * Access a derived slice of the camera snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function ActivePreset() {
 *   const preset = useCamera((s) => s.activePresetId);
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useCamera<T>(
  selector: CameraSelector<T>,
  equalityFn?: CameraEquality<T>,
): T;

export function useCamera<T>(
  selector?: CameraSelector<T>,
  equalityFn?: CameraEquality<T>,
): CameraSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  useCameraContext();

  const snapshot = useSyncExternalStore(
    subscribeCamera,
    getCameraSnapshot,
    getCameraSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: CameraSnapshot } | null>(
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
