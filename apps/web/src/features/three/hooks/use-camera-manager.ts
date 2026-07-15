/**
 * useCameraManager — Direct Access to Camera Manager Methods
 *
 * Provides a stable, memoized reference to the camera-manager's mutation
 * methods. All returned functions are bound to the singleton and never
 * change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { useMemo } from 'react';

import { cameraManager } from '../camera-manager';
import { useCameraContext } from '../camera-provider';

/**
 * Return type — all readonly mutation methods on the camera manager.
 */
export interface UseCameraManagerReturn {
  readonly registerPreset: typeof cameraManager.registerPreset;
  readonly unregisterPreset: typeof cameraManager.unregisterPreset;
  readonly getPresetDefinition: typeof cameraManager.getPresetDefinition;
  readonly getAllPresetDefinitions: typeof cameraManager.getAllPresetDefinitions;
  readonly hasPreset: typeof cameraManager.hasPreset;
  readonly setActivePreset: typeof cameraManager.setActivePreset;
  readonly registerTarget: typeof cameraManager.registerTarget;
  readonly unregisterTarget: typeof cameraManager.unregisterTarget;
  readonly getTargetDefinition: typeof cameraManager.getTargetDefinition;
  readonly getAllTargetDefinitions: typeof cameraManager.getAllTargetDefinitions;
  readonly hasTarget: typeof cameraManager.hasTarget;
  readonly setActiveTarget: typeof cameraManager.setActiveTarget;
  readonly setMode: typeof cameraManager.setMode;
  readonly setPosition: typeof cameraManager.setPosition;
  readonly setLookAt: typeof cameraManager.setLookAt;
  readonly setFov: typeof cameraManager.setFov;
  readonly setNear: typeof cameraManager.setNear;
  readonly setFar: typeof cameraManager.setFar;
  readonly setViewport: typeof cameraManager.setViewport;
  readonly setQualityPreset: typeof cameraManager.setQualityPreset;
  readonly setReducedMotion: typeof cameraManager.setReducedMotion;
  readonly getRegistry: typeof cameraManager.getRegistry;
}

/**
 * Access memoized camera-manager methods.
 *
 * Must be used within a {@link CameraRoot}. Returns a stable object whose
 * methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function CameraControls() {
 *   const { registerPreset, setActivePreset } = useCameraManager();
 *
 *   const handleActivate = useCallback(() => {
 *     setActivePreset('hero');
 *   }, [setActivePreset]);
 *
 *   return <button onClick={handleActivate}>Activate Hero</button>;
 * }
 * ```
 */
export function useCameraManager(): UseCameraManagerReturn {
  /* Confirm the provider is mounted. */
  useCameraContext();

  return useMemo<UseCameraManagerReturn>(
    () => ({
      registerPreset: cameraManager.registerPreset,
      unregisterPreset: cameraManager.unregisterPreset,
      getPresetDefinition: cameraManager.getPresetDefinition,
      getAllPresetDefinitions: cameraManager.getAllPresetDefinitions,
      hasPreset: cameraManager.hasPreset,
      setActivePreset: cameraManager.setActivePreset,
      registerTarget: cameraManager.registerTarget,
      unregisterTarget: cameraManager.unregisterTarget,
      getTargetDefinition: cameraManager.getTargetDefinition,
      getAllTargetDefinitions: cameraManager.getAllTargetDefinitions,
      hasTarget: cameraManager.hasTarget,
      setActiveTarget: cameraManager.setActiveTarget,
      setMode: cameraManager.setMode,
      setPosition: cameraManager.setPosition,
      setLookAt: cameraManager.setLookAt,
      setFov: cameraManager.setFov,
      setNear: cameraManager.setNear,
      setFar: cameraManager.setFar,
      setViewport: cameraManager.setViewport,
      setQualityPreset: cameraManager.setQualityPreset,
      setReducedMotion: cameraManager.setReducedMotion,
      getRegistry: cameraManager.getRegistry,
    }),
    [],
  );
}
