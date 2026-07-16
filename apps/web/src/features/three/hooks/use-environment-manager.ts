/**
 * useEnvironmentManager — Direct Access to Environment Manager Methods
 *
 * Provides a stable, memoized reference to the environment-manager's mutation
 * methods. All returned functions are bound to the singleton and never
 * change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { useMemo } from 'react';

import { environmentManager } from '../environment-manager';
import { useEnvironmentContext } from '../environment-provider';

/**
 * Return type — all readonly mutation methods on the environment manager.
 */
export interface UseEnvironmentManagerReturn {
  readonly registerPreset: typeof environmentManager.registerPreset;
  readonly unregisterPreset: typeof environmentManager.unregisterPreset;
  readonly getPresetDefinition: typeof environmentManager.getPresetDefinition;
  readonly getAllPresetDefinitions: typeof environmentManager.getAllPresetDefinitions;
  readonly hasPreset: typeof environmentManager.hasPreset;
  readonly setActivePreset: typeof environmentManager.setActivePreset;
  readonly registerCategory: typeof environmentManager.registerCategory;
  readonly unregisterCategory: typeof environmentManager.unregisterCategory;
  readonly hasCategory: typeof environmentManager.hasCategory;
  readonly registerGroup: typeof environmentManager.registerGroup;
  readonly unregisterGroup: typeof environmentManager.unregisterGroup;
  readonly hasGroup: typeof environmentManager.hasGroup;
  readonly setQualityPreset: typeof environmentManager.setQualityPreset;
  readonly setReducedMotion: typeof environmentManager.setReducedMotion;
  readonly getRegistry: typeof environmentManager.getRegistry;
}

/**
 * Access memoized environment-manager methods.
 *
 * Must be used within an {@link EnvironmentRoot}. Returns a stable object whose
 * methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function EnvironmentControls() {
 *   const { registerPreset, setActivePreset } = useEnvironmentManager();
 *
 *   const handleActivate = useCallback(() => {
 *     setActivePreset('hero');
 *   }, [setActivePreset]);
 *
 *   return <button onClick={handleActivate}>Activate Hero</button>;
 * }
 * ```
 */
export function useEnvironmentManager(): UseEnvironmentManagerReturn {
  /* Confirm the provider is mounted. */
  useEnvironmentContext();

  return useMemo<UseEnvironmentManagerReturn>(
    () => ({
      registerPreset: environmentManager.registerPreset,
      unregisterPreset: environmentManager.unregisterPreset,
      getPresetDefinition: environmentManager.getPresetDefinition,
      getAllPresetDefinitions: environmentManager.getAllPresetDefinitions,
      hasPreset: environmentManager.hasPreset,
      setActivePreset: environmentManager.setActivePreset,
      registerCategory: environmentManager.registerCategory,
      unregisterCategory: environmentManager.unregisterCategory,
      hasCategory: environmentManager.hasCategory,
      registerGroup: environmentManager.registerGroup,
      unregisterGroup: environmentManager.unregisterGroup,
      hasGroup: environmentManager.hasGroup,
      setQualityPreset: environmentManager.setQualityPreset,
      setReducedMotion: environmentManager.setReducedMotion,
      getRegistry: environmentManager.getRegistry,
    }),
    [],
  );
}
