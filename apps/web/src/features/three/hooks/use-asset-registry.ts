/**
 * useAssetRegistry — Read-Only Asset Registry Queries
 *
 * Provides access to the read-only registry query interface from the
 * asset manager. The registry exposes computed queries over the current
 * snapshot — asset counts, filtered lists, dependency lookups — without
 * exposing mutation methods.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { useMemo } from 'react';

import { assetManager } from '../asset-manager';
import { useAssetContext } from '../asset-provider';

import type { AssetRegistry } from '../asset.types';

/**
 * Access the read-only asset registry.
 *
 * Must be used within an {@link AssetRoot}. Returns a stable registry
 * reference whose query methods read from the latest snapshot.
 *
 * @example
 * ```tsx
 * function AssetList() {
 *   const registry = useAssetRegistry();
 *   const modelIds = registry.getAssetsByCategory('models');
 *   return <span>{modelIds.length} models</span>;
 * }
 * ```
 */
export function useAssetRegistry(): AssetRegistry {
  /* Confirm the provider is mounted. */
  useAssetContext();

  return useMemo<AssetRegistry>(
    () => assetManager.getRegistry(),
    [],
  );
}
