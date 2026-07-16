/**
 * useMaterialsManager — Direct Access to Materials Manager Methods
 *
 * Provides a stable, memoized reference to the materials-manager's mutation
 * methods. All returned functions are bound to the singleton and never
 * change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { useMemo } from 'react';

import { materialsManager } from '../materials-manager';
import { useMaterialsContext } from '../materials-provider';

/**
 * Return type — all readonly mutation methods on the materials manager.
 */
export interface UseMaterialsManagerReturn {
  readonly registerPreset: typeof materialsManager.registerPreset;
  readonly unregisterPreset: typeof materialsManager.unregisterPreset;
  readonly getPresetDefinition: typeof materialsManager.getPresetDefinition;
  readonly getAllPresetDefinitions: typeof materialsManager.getAllPresetDefinitions;
  readonly hasPreset: typeof materialsManager.hasPreset;
  readonly setActivePreset: typeof materialsManager.setActivePreset;
  readonly registerCategory: typeof materialsManager.registerCategory;
  readonly unregisterCategory: typeof materialsManager.unregisterCategory;
  readonly hasCategory: typeof materialsManager.hasCategory;
  readonly registerGroup: typeof materialsManager.registerGroup;
  readonly unregisterGroup: typeof materialsManager.unregisterGroup;
  readonly hasGroup: typeof materialsManager.hasGroup;
  readonly setQualityPreset: typeof materialsManager.setQualityPreset;
  readonly setReducedMotion: typeof materialsManager.setReducedMotion;
  readonly getRegistry: typeof materialsManager.getRegistry;
}

/**
 * Access memoized materials-manager methods.
 *
 * Must be used within a {@link MaterialsRoot}. Returns a stable object whose
 * methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function MaterialControls() {
 *   const { registerPreset, setActivePreset } = useMaterialsManager();
 *
 *   const handleActivate = useCallback(() => {
 *     setActivePreset('hero');
 *   }, [setActivePreset]);
 *
 *   return <button onClick={handleActivate}>Activate Hero</button>;
 * }
 * ```
 */
export function useMaterialsManager(): UseMaterialsManagerReturn {
  /* Confirm the provider is mounted. */
  useMaterialsContext();

  return useMemo<UseMaterialsManagerReturn>(
    () => ({
      registerPreset: materialsManager.registerPreset,
      unregisterPreset: materialsManager.unregisterPreset,
      getPresetDefinition: materialsManager.getPresetDefinition,
      getAllPresetDefinitions: materialsManager.getAllPresetDefinitions,
      hasPreset: materialsManager.hasPreset,
      setActivePreset: materialsManager.setActivePreset,
      registerCategory: materialsManager.registerCategory,
      unregisterCategory: materialsManager.unregisterCategory,
      hasCategory: materialsManager.hasCategory,
      registerGroup: materialsManager.registerGroup,
      unregisterGroup: materialsManager.unregisterGroup,
      hasGroup: materialsManager.hasGroup,
      setQualityPreset: materialsManager.setQualityPreset,
      setReducedMotion: materialsManager.setReducedMotion,
      getRegistry: materialsManager.getRegistry,
    }),
    [],
  );
}
