/**
 * useSceneManager — Direct Access to Scene Manager Methods
 *
 * Provides a stable, memoized reference to the scene-manager's mutation
 * methods. All returned functions are bound to the singleton and never
 * change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useMemo } from 'react';

import { sceneManager } from '../scene-manager';
import { useSceneContext } from '../scene-provider';

/**
 * Return type — all readonly mutation methods on the scene manager.
 */
export interface UseSceneManagerReturn {
  readonly registerScene: typeof sceneManager.registerScene;
  readonly unregisterScene: typeof sceneManager.unregisterScene;
  readonly setSceneStage: typeof sceneManager.setSceneStage;
  readonly setSceneVisibility: typeof sceneManager.setSceneVisibility;
  readonly registerSlot: typeof sceneManager.registerSlot;
  readonly unregisterSlot: typeof sceneManager.unregisterSlot;
  readonly setQualityPreset: typeof sceneManager.setQualityPreset;
  readonly setReducedMotion: typeof sceneManager.setReducedMotion;
  readonly getRegistry: typeof sceneManager.getRegistry;
  readonly getSceneDefinition: typeof sceneManager.getSceneDefinition;
  readonly getAllSceneDefinitions: typeof sceneManager.getAllSceneDefinitions;
  readonly hasScene: typeof sceneManager.hasScene;
  readonly getLayer: typeof sceneManager.getLayer;
  readonly getAllLayers: typeof sceneManager.getAllLayers;
  readonly hasLayer: typeof sceneManager.hasLayer;
  readonly getSlot: typeof sceneManager.getSlot;
  readonly getAllSlots: typeof sceneManager.getAllSlots;
  readonly hasSlot: typeof sceneManager.hasSlot;
}

/**
 * Access memoized scene-manager methods.
 *
 * Must be used within a {@link SceneRoot}. Returns a stable object whose
 * methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function SceneControls() {
 *   const { registerScene, setSceneStage } = useSceneManager();
 *
 *   const handleActivate = useCallback(() => {
 *     setSceneStage('hero-atmosphere', 'active');
 *   }, [setSceneStage]);
 *
 *   return <button onClick={handleActivate}>Activate</button>;
 * }
 * ```
 */
export function useSceneManager(): UseSceneManagerReturn {
  /* Confirm the provider is mounted. */
  useSceneContext();

  return useMemo<UseSceneManagerReturn>(
    () => ({
      registerScene: sceneManager.registerScene,
      unregisterScene: sceneManager.unregisterScene,
      setSceneStage: sceneManager.setSceneStage,
      setSceneVisibility: sceneManager.setSceneVisibility,
      registerSlot: sceneManager.registerSlot,
      unregisterSlot: sceneManager.unregisterSlot,
      setQualityPreset: sceneManager.setQualityPreset,
      setReducedMotion: sceneManager.setReducedMotion,
      getRegistry: sceneManager.getRegistry,
      getSceneDefinition: sceneManager.getSceneDefinition,
      getAllSceneDefinitions: sceneManager.getAllSceneDefinitions,
      hasScene: sceneManager.hasScene,
      getLayer: sceneManager.getLayer,
      getAllLayers: sceneManager.getAllLayers,
      hasLayer: sceneManager.hasLayer,
      getSlot: sceneManager.getSlot,
      getAllSlots: sceneManager.getAllSlots,
      hasSlot: sceneManager.hasSlot,
    }),
    [],
  );
}
