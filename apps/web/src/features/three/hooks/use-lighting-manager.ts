/**
 * useLightingManager — Direct Access to Lighting Manager Methods
 *
 * Provides a stable, memoized reference to the lighting-manager's mutation
 * methods. All returned functions are bound to the singleton and never
 * change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { useMemo } from 'react';

import { lightingManager } from '../lighting-manager';
import { useLightingContext } from '../lighting-provider';

/**
 * Return type — all readonly mutation methods on the lighting manager.
 */
export interface UseLightingManagerReturn {
  readonly registerPreset: typeof lightingManager.registerPreset;
  readonly unregisterPreset: typeof lightingManager.unregisterPreset;
  readonly getPresetDefinition: typeof lightingManager.getPresetDefinition;
  readonly getAllPresetDefinitions: typeof lightingManager.getAllPresetDefinitions;
  readonly hasPreset: typeof lightingManager.hasPreset;
  readonly setActivePreset: typeof lightingManager.setActivePreset;
  readonly setEnvironment: typeof lightingManager.setEnvironment;
  readonly setIntensity: typeof lightingManager.setIntensity;
  readonly setColorTemperature: typeof lightingManager.setColorTemperature;
  readonly setAmbientIntensity: typeof lightingManager.setAmbientIntensity;
  readonly setDirectionalIntensity: typeof lightingManager.setDirectionalIntensity;
  readonly setShadowsEnabled: typeof lightingManager.setShadowsEnabled;
  readonly setQualityPreset: typeof lightingManager.setQualityPreset;
  readonly setReducedMotion: typeof lightingManager.setReducedMotion;
  readonly getRegistry: typeof lightingManager.getRegistry;
}

/**
 * Access memoized lighting-manager methods.
 *
 * Must be used within a {@link LightingRoot}. Returns a stable object whose
 * methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function LightingControls() {
 *   const { registerPreset, setActivePreset } = useLightingManager();
 *
 *   const handleActivate = useCallback(() => {
 *     setActivePreset('hero');
 *   }, [setActivePreset]);
 *
 *   return <button onClick={handleActivate}>Activate Hero</button>;
 * }
 * ```
 */
export function useLightingManager(): UseLightingManagerReturn {
  /* Confirm the provider is mounted. */
  useLightingContext();

  return useMemo<UseLightingManagerReturn>(
    () => ({
      registerPreset: lightingManager.registerPreset,
      unregisterPreset: lightingManager.unregisterPreset,
      getPresetDefinition: lightingManager.getPresetDefinition,
      getAllPresetDefinitions: lightingManager.getAllPresetDefinitions,
      hasPreset: lightingManager.hasPreset,
      setActivePreset: lightingManager.setActivePreset,
      setEnvironment: lightingManager.setEnvironment,
      setIntensity: lightingManager.setIntensity,
      setColorTemperature: lightingManager.setColorTemperature,
      setAmbientIntensity: lightingManager.setAmbientIntensity,
      setDirectionalIntensity: lightingManager.setDirectionalIntensity,
      setShadowsEnabled: lightingManager.setShadowsEnabled,
      setQualityPreset: lightingManager.setQualityPreset,
      setReducedMotion: lightingManager.setReducedMotion,
      getRegistry: lightingManager.getRegistry,
    }),
    [],
  );
}
