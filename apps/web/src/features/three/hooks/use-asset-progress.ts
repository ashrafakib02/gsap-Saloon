/**
 * useAssetProgress — Progress Tracking (Overall, Per-Bundle, Per-Category)
 *
 * Subscribes to the asset-manager snapshot and derives progress information:
 * overall progress, per-bundle progress, and per-category asset counts.
 * Useful for loading screens, progress bars, and bundle-aware lazy loading.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { assetManager } from '../asset-manager';
import { useAssetContext } from '../asset-provider';

import type {
  AssetSnapshot,
  AssetGroupId,
  AssetCategoryId,
  AssetBundleState,
  AssetCategoryState,
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
 * Derived progress information for the asset pipeline.
 */
export interface AssetProgressInfo {
  /** Overall progress (0-1), derived from loaded / total. */
  readonly overallProgress: number;
  /** Per-bundle progress, keyed by bundle ID. */
  readonly bundleProgress: ReadonlyMap<AssetGroupId, number>;
  /** Per-bundle state (full state for each bundle). */
  readonly bundleStates: ReadonlyMap<AssetGroupId, AssetBundleState>;
  /** Per-category asset counts. */
  readonly categoryCounts: ReadonlyMap<AssetCategoryId, number>;
  /** Per-category states (full state for each category). */
  readonly categoryStates: ReadonlyMap<AssetCategoryId, AssetCategoryState>;
  /** Total asset count across all bundles. */
  readonly totalAssets: number;
  /** Total loaded across all bundles. */
  readonly totalLoaded: number;
}

/**
 * Access derived progress information.
 *
 * Must be used within an {@link AssetRoot}. Re-renders only when the
 * progress values change.
 *
 * @example
 * ```tsx
 * function LoadingBar() {
 *   const { overallProgress } = useAssetProgress();
 *   return <div style={{ width: `${overallProgress * 100}%` }} />;
 * }
 *
 * function BundleStatus({ bundleId }: { bundleId: AssetGroupId }) {
 *   const { bundleProgress } = useAssetProgress();
 *   const progress = bundleProgress.get(bundleId) ?? 0;
 *   return <span>{Math.round(progress * 100)}%</span>;
 * }
 * ```
 */
export function useAssetProgress(): AssetProgressInfo {
  /* Confirm the provider is mounted. */
  useAssetContext();

  const snapshot = useSyncExternalStore(
    subscribeAsset,
    getAssetSnapshot,
    getAssetSnapshot,
  );

  return useMemo<AssetProgressInfo>(
    () => {
      /* Derive per-bundle progress. */
      const bundleProgress = new Map<AssetGroupId, number>();
      for (const [id, state] of snapshot.bundles) {
        bundleProgress.set(id, state.progress);
      }

      /* Derive per-category asset counts. */
      const categoryCounts = new Map<AssetCategoryId, number>();
      for (const [id, state] of snapshot.categories) {
        categoryCounts.set(id, state.assetCount);
      }

      const totalAssets = snapshot.assetCount;
      const totalLoaded = snapshot.loadedCount;

      const overallProgress = totalAssets > 0
        ? totalLoaded / totalAssets
        : 0;

      return {
        overallProgress,
        bundleProgress,
        bundleStates: snapshot.bundles,
        categoryCounts,
        categoryStates: snapshot.categories,
        totalAssets,
        totalLoaded,
      };
    },
    [
      snapshot.assetCount,
      snapshot.loadedCount,
      snapshot.bundles,
      snapshot.categories,
    ],
  );
}
