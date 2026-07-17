/**
 * useAssetManager — Direct Access to Asset Manager Methods
 *
 * Provides a stable, memoized reference to the asset-manager's mutation
 * methods. All returned functions are bound to the singleton and never
 * change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { useMemo } from 'react';

import { assetManager } from '../asset-manager';
import { useAssetContext } from '../asset-provider';

/**
 * Return type — all readonly mutation methods on the asset manager.
 */
export interface UseAssetManagerReturn {
  readonly registerAsset: typeof assetManager.registerAsset;
  readonly unregisterAsset: typeof assetManager.unregisterAsset;
  readonly setAssetState: typeof assetManager.setAssetState;
  readonly setAssetProgress: typeof assetManager.setAssetProgress;
  readonly setAssetError: typeof assetManager.setAssetError;
  readonly registerBundle: typeof assetManager.registerBundle;
  readonly unregisterBundle: typeof assetManager.unregisterBundle;
  readonly setCacheEntry: typeof assetManager.setCacheEntry;
  readonly removeCacheEntry: typeof assetManager.removeCacheEntry;
  readonly setQualityPreset: typeof assetManager.setQualityPreset;
  readonly setReducedMotion: typeof assetManager.setReducedMotion;
  readonly getRegistry: typeof assetManager.getRegistry;
  readonly getAssetDefinition: typeof assetManager.getAssetDefinition;
  readonly getAllAssetDefinitions: typeof assetManager.getAllAssetDefinitions;
  readonly hasAsset: typeof assetManager.hasAsset;
  readonly getBundleDefinition: typeof assetManager.getBundleDefinition;
  readonly hasBundle: typeof assetManager.hasBundle;
  readonly hasCategory: typeof assetManager.hasCategory;
  readonly getDependencyGraph: typeof assetManager.getDependencyGraph;
  readonly getDependencies: typeof assetManager.getDependencies;
  readonly getDependents: typeof assetManager.getDependents;
  readonly getCacheEntry: typeof assetManager.getCacheEntry;
}

/**
 * Access memoized asset-manager methods.
 *
 * Must be used within an {@link AssetRoot}. Returns a stable object whose
 * methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function AssetControls() {
 *   const { registerAsset, setAssetState } = useAssetManager();
 *
 *   const handleRegister = useCallback(() => {
 *     registerAsset({ id: 'hero-model', category: 'models' });
 *   }, [registerAsset]);
 *
 *   return <button onClick={handleRegister}>Register</button>;
 * }
 * ```
 */
export function useAssetManager(): UseAssetManagerReturn {
  /* Confirm the provider is mounted. */
  useAssetContext();

  return useMemo<UseAssetManagerReturn>(
    () => ({
      registerAsset: assetManager.registerAsset,
      unregisterAsset: assetManager.unregisterAsset,
      setAssetState: assetManager.setAssetState,
      setAssetProgress: assetManager.setAssetProgress,
      setAssetError: assetManager.setAssetError,
      registerBundle: assetManager.registerBundle,
      unregisterBundle: assetManager.unregisterBundle,
      setCacheEntry: assetManager.setCacheEntry,
      removeCacheEntry: assetManager.removeCacheEntry,
      setQualityPreset: assetManager.setQualityPreset,
      setReducedMotion: assetManager.setReducedMotion,
      getRegistry: assetManager.getRegistry,
      getAssetDefinition: assetManager.getAssetDefinition,
      getAllAssetDefinitions: assetManager.getAllAssetDefinitions,
      hasAsset: assetManager.hasAsset,
      getBundleDefinition: assetManager.getBundleDefinition,
      hasBundle: assetManager.hasBundle,
      hasCategory: assetManager.hasCategory,
      getDependencyGraph: assetManager.getDependencyGraph,
      getDependencies: assetManager.getDependencies,
      getDependents: assetManager.getDependents,
      getCacheEntry: assetManager.getCacheEntry,
    }),
    [],
  );
}
