/**
 * useCameraPreset — Active Preset for the Camera
 *
 * Subscribes to the active camera preset ID from the camera-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { cameraManager } from '../camera-manager';
import { useCameraContext } from '../camera-provider';

import type { CameraPresetId, CameraSnapshot } from '../camera.types';

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
 * Access the currently active camera preset ID.
 *
 * Returns `null` when no preset is active (default state). When a preset
 * is activated via `setActivePreset`, this hook updates.
 *
 * Must be used within a {@link CameraRoot}.
 *
 * @example
 * ```tsx
 * function ActivePresetBadge() {
 *   const preset = useCameraPreset();
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useCameraPreset(): CameraPresetId | null {
  /* Confirm the provider is mounted. */
  useCameraContext();

  const snapshot = useSyncExternalStore(
    subscribeCamera,
    getCameraSnapshot,
    getCameraSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ presetId: CameraPresetId | null; snapshot: CameraSnapshot } | null>(
    null,
  );

  const presetId: CameraPresetId | null = snapshot.activePresetId;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { presetId, snapshot };
  } else if (prevRef.current.presetId !== presetId) {
    prevRef.current = { presetId, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.presetId, [presetId]);
}
