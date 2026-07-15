/**
 * useCameraControls — Memoized Camera Control Methods
 *
 * Provides a stable, memoized reference to camera-manager mutation methods
 * that directly control camera state (position, lookAt, FOV, mode, preset,
 * target). All returned functions are bound to the singleton and never change
 * identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { useMemo } from 'react';

import { cameraManager } from '../camera-manager';
import { useCameraContext } from '../camera-provider';

/**
 * Return type — all camera control mutation methods.
 */
export interface UseCameraControlsReturn {
  /** Set the active camera preset (applies preset defaults). */
  readonly setActivePreset: typeof cameraManager.setActivePreset;
  /** Set the active camera target (updates lookAt to target position). */
  readonly setActiveTarget: typeof cameraManager.setActiveTarget;
  /** Set the camera operational mode. */
  readonly setMode: typeof cameraManager.setMode;
  /** Set the camera position [x, y, z]. */
  readonly setPosition: typeof cameraManager.setPosition;
  /** Set the camera lookAt target [x, y, z]. */
  readonly setLookAt: typeof cameraManager.setLookAt;
  /** Set the field of view in degrees. */
  readonly setFov: typeof cameraManager.setFov;
  /** Set the near clipping plane. */
  readonly setNear: typeof cameraManager.setNear;
  /** Set the far clipping plane. */
  readonly setFar: typeof cameraManager.setFar;
}

/**
 * Access memoized camera control methods.
 *
 * Must be used within a {@link CameraRoot}. Returns a stable object whose
 * methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function CameraControls() {
 *   const { setActivePreset, setMode } = useCameraControls();
 *
 *   const handleHeroPreset = useCallback(() => {
 *     setActivePreset('hero');
 *   }, [setActivePreset]);
 *
 *   const handleNarrativeMode = useCallback(() => {
 *     setMode('narrative');
 *   }, [setMode]);
 *
 *   return (
 *     <div>
 *       <button onClick={handleHeroPreset}>Hero</button>
 *       <button onClick={handleNarrativeMode}>Narrative</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCameraControls(): UseCameraControlsReturn {
  /* Confirm the provider is mounted. */
  useCameraContext();

  return useMemo<UseCameraControlsReturn>(
    () => ({
      setActivePreset: cameraManager.setActivePreset,
      setActiveTarget: cameraManager.setActiveTarget,
      setMode: cameraManager.setMode,
      setPosition: cameraManager.setPosition,
      setLookAt: cameraManager.setLookAt,
      setFov: cameraManager.setFov,
      setNear: cameraManager.setNear,
      setFar: cameraManager.setFar,
    }),
    [],
  );
}
