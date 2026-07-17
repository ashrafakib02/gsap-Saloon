/**
 * useAssetState — Derived Asset State (Counts, Memory, Progress)
 *
 * Subscribes to the asset-manager snapshot and derives aggregate state:
 * total asset count, loaded count, loading count, failed count,
 * total estimated memory, and overall progress. Useful for UI overlays,
 * loading screens, and debug panels.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { assetManager } from '../asset-manager';
import { useAssetContext } from '../asset-provider';

import type { AssetSnapshot } from '../asset.types';

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
 * Derived aggregate state for the asset pipeline.
 */
export interface AssetStateInfo {
  /** Total registered asset count. */
  readonly assetCount: number;
  /** Total loaded asset count. */
  readonly loadedCount: number;
  /** Total currently loading asset count. */
  readonly loadingCount: number;
  /** Total failed asset count. */
  readonly failedCount: number;
  /** Total estimated memory in bytes. */
  readonly totalEstimatedMemory: number;
  /** Overall progress (0-1), derived from loaded / total. */
  readonly overallProgress: number;
  /** Whether all assets are loaded (no pending, no failed). */
  readonly isComplete: boolean;
  /** Whether any assets have failed. */
  readonly hasFailures: boolean;
  /** Active quality preset. */
  readonly qualityPreset: AssetSnapshot['qualityPreset'];
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
}

/**
 * Access derived aggregate asset state.
 *
 * Must be used within an {@link AssetRoot}. Re-renders only when the
 * derived aggregate values change.
 *
 * @example
 * ```tsx
 * function AssetProgress() {
 *   const { loadedCount, totalEstimatedMemory, isComplete } = useAssetState();
 *   return (
 *     <div>
 *       <span>{loadedCount} loaded</span>
 *       <span>{totalEstimatedMemory} bytes</span>
 *       {isComplete && <span>All loaded!</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAssetState(): AssetStateInfo {
  /* Confirm the provider is mounted. */
  useAssetContext();

  const snapshot = useSyncExternalStore(
    subscribeAsset,
    getAssetSnapshot,
    getAssetSnapshot,
  );

  return useMemo<AssetStateInfo>(
    () => ({
      assetCount: snapshot.assetCount,
      loadedCount: snapshot.loadedCount,
      loadingCount: snapshot.loadingCount,
      failedCount: snapshot.failedCount,
      totalEstimatedMemory: snapshot.totalEstimatedMemory,
      overallProgress: snapshot.assetCount > 0
        ? snapshot.loadedCount / snapshot.assetCount
        : 0,
      isComplete:
        snapshot.loadingCount === 0
        && snapshot.failedCount === 0
        && snapshot.assetCount > 0,
      hasFailures: snapshot.failedCount > 0,
      qualityPreset: snapshot.qualityPreset,
      isReducedMotion: snapshot.isReducedMotion,
    }),
    [
      snapshot.assetCount,
      snapshot.loadedCount,
      snapshot.loadingCount,
      snapshot.failedCount,
      snapshot.totalEstimatedMemory,
      snapshot.qualityPreset,
      snapshot.isReducedMotion,
    ],
  );
}
