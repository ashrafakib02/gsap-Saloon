/**
 * useAssetPriority — Priority-Based Asset Queries
 *
 * Subscribes to the asset-manager snapshot and derives priority-based
 * information: critical assets, high-priority assets, assets by priority
 * level, and whether all critical assets are loaded. Useful for
 * priority-aware loading strategies and startup gates.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { assetManager } from '../asset-manager';
import { useAssetContext } from '../asset-provider';

import type {
  AssetSnapshot,
  AssetId,
  AssetPriority,
} from '../asset.types';

/**
 * Get the current asset snapshot (used by `useSyncExternalStore`).
 */
function getAssetSnapshot(): AssetSnapshot {
  return assetManager.getSnapshot();
}

/**
 * Subscribe to asset snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeAsset(callback: () => void): () => void {
  return assetManager.subscribe(callback);
}

/**
 * Derived priority information for the asset pipeline.
 */
export interface AssetPriorityInfo {
  /** Asset IDs grouped by priority level. */
  readonly byPriority: ReadonlyMap<AssetPriority, readonly AssetId[]>;
  /** IDs of all critical assets. */
  readonly criticalIds: readonly AssetId[];
  /** IDs of all high-priority assets. */
  readonly highIds: readonly AssetId[];
  /** Whether all critical assets are in 'ready' state. */
  readonly criticalLoaded: boolean;
  /** Whether all critical and high assets are in 'ready' state. */
  readonly criticalAndHighLoaded: boolean;
  /** Count of critical assets still pending. */
  readonly criticalPendingCount: number;
  /** Count of high-priority assets still pending. */
  readonly highPendingCount: number;
}

/**
 * Access derived priority information.
 *
 * Must be used within an {@link AssetRoot`. Re-renders only when the
 * priority-derived values change.
 *
 * @example
 * ```tsx
 * function StartupGate() {
 *   const { criticalLoaded } = useAssetPriority();
 *   if (!criticalLoaded) return <LoadingScreen />;
 *   return <MainContent />;
 * }
 * ```
 */
export function useAssetPriority(): AssetPriorityInfo {
  /* Confirm the provider is mounted. */
  useAssetContext();

  const snapshot = useSyncExternalStore(
    subscribeAsset,
    getAssetSnapshot,
    getAssetSnapshot,
  );

  return useMemo<AssetPriorityInfo>(
    () => {
      const registry = assetManager.getRegistry();

      /* Group asset IDs by priority. */
      const priorities: AssetPriority[] = [
        'critical', 'high', 'normal', 'low', 'background', 'idle',
      ];
      const byPriority = new Map<AssetPriority, readonly AssetId[]>();
      for (const p of priorities) {
        byPriority.set(p, registry.getAssetsByPriority(p));
      }

      const criticalIds = byPriority.get('critical') ?? [];
      const highIds = byPriority.get('high') ?? [];

      /* Check if critical assets are loaded. */
      let criticalPendingCount = 0;
      for (const id of criticalIds) {
        const assetState = snapshot.assets.get(id);
        if (assetState && assetState.state !== 'ready') {
          criticalPendingCount += 1;
        }
      }

      /* Check if high-priority assets are loaded. */
      let highPendingCount = 0;
      for (const id of highIds) {
        const assetState = snapshot.assets.get(id);
        if (assetState && assetState.state !== 'ready') {
          highPendingCount += 1;
        }
      }

      return {
        byPriority,
        criticalIds,
        highIds,
        criticalLoaded: criticalPendingCount === 0 && criticalIds.length > 0,
        criticalAndHighLoaded:
          criticalPendingCount === 0
          && highPendingCount === 0
          && (criticalIds.length > 0 || highIds.length > 0),
        criticalPendingCount,
        highPendingCount,
      };
    },
    [snapshot.assets],
  );
}
