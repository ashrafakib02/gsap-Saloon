/**
 * useCameraState — Full Camera State Snapshot
 *
 * Provides access to the complete camera state including position, lookAt,
 * FOV, mode, viewport, quality profile, and constraints.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { cameraManager } from '../camera-manager';
import { useCameraContext } from '../camera-provider';

import type { CameraSnapshot } from '../camera.types';

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
 * The complete camera state for rendering and debugging.
 */
export interface CameraStateReturn {
  /** Current camera position [x, y, z]. */
  readonly position: readonly [number, number, number];
  /** Current camera lookAt target [x, y, z]. */
  readonly lookAt: readonly [number, number, number];
  /** Current field of view in degrees. */
  readonly fov: number;
  /** Current near clipping plane. */
  readonly near: number;
  /** Current far clipping plane. */
  readonly far: number;
  /** Current camera mode. */
  readonly mode: CameraSnapshot['mode'];
  /** Current viewport dimensions. */
  readonly viewport: CameraSnapshot['viewport'];
  /** Quality-adapted camera settings. */
  readonly qualityProfile: CameraSnapshot['qualityProfile'];
  /** Position and orientation constraints. */
  readonly constraints: CameraSnapshot['constraints'];
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
}

/**
 * Access the complete camera state.
 *
 * Returns a derived object with position, lookAt, FOV, clipping planes,
 * mode, viewport, quality profile, and constraints. Useful for components
 * that need to render camera helpers or debug overlays.
 *
 * Must be used within a {@link CameraRoot}.
 *
 * @example
 * ```tsx
 * function CameraDebug() {
 *   const state = useCameraState();
 *   return (
 *     <div>
 *       <p>Mode: {state.mode}</p>
 *       <p>FOV: {state.fov}°</p>
 *       <p>Position: [{state.position.join(', ')}]</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCameraState(): CameraStateReturn {
  /* Confirm the provider is mounted. */
  useCameraContext();

  const snapshot = useSyncExternalStore(
    subscribeCamera,
    getCameraSnapshot,
    getCameraSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ state: CameraStateReturn; snapshot: CameraSnapshot } | null>(
    null,
  );

  const state: CameraStateReturn = {
    position: snapshot.position,
    lookAt: snapshot.lookAt,
    fov: snapshot.fov,
    near: snapshot.near,
    far: snapshot.far,
    mode: snapshot.mode,
    viewport: snapshot.viewport,
    qualityProfile: snapshot.qualityProfile,
    constraints: snapshot.constraints,
    isReducedMotion: snapshot.isReducedMotion,
  };

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { state, snapshot };
  } else if (
    prevRef.current.state.position !== state.position ||
    prevRef.current.state.lookAt !== state.lookAt ||
    prevRef.current.state.fov !== state.fov ||
    prevRef.current.state.mode !== state.mode
  ) {
    prevRef.current = { state, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.state, [state]);
}
