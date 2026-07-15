/**
 * useCameraTarget — Active Target for the Camera
 *
 * Subscribes to the active camera target ID from the camera-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { cameraManager } from '../camera-manager';
import { useCameraContext } from '../camera-provider';

import type { CameraTarget, CameraSnapshot } from '../camera.types';

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
 * Access the currently active camera target ID.
 *
 * Returns `null` when no target is active (default state). When a target
 * is activated via `setActiveTarget`, this hook updates.
 *
 * Must be used within a {@link CameraRoot}.
 *
 * @example
 * ```tsx
 * function ActiveTargetBadge() {
 *   const target = useCameraTarget();
 *   return <span>Target: {target ?? 'none'}</span>;
 * }
 * ```
 */
export function useCameraTarget(): CameraTarget | null {
  /* Confirm the provider is mounted. */
  useCameraContext();

  const snapshot = useSyncExternalStore(
    subscribeCamera,
    getCameraSnapshot,
    getCameraSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ targetId: CameraTarget | null; snapshot: CameraSnapshot } | null>(
    null,
  );

  const targetId: CameraTarget | null = snapshot.activeTargetId;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { targetId, snapshot };
  } else if (prevRef.current.targetId !== targetId) {
    prevRef.current = { targetId, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.targetId, [targetId]);
}
