/**
 * useAssets — Primary Public API for Asset Pipeline State
 *
 * Subscribes to the {@link assetManager} singleton via `useSyncExternalStore`
 * for the most efficient React 18 integration. Consumers re-render only when
 * the snapshot changes.
 *
 * Supports a selector overload identical to {@link useScene} for
 * derived slice access with equality comparison.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { assetManager } from '../asset-manager';
import { useAssetContext } from '../asset-provider';

import type {
  AssetSnapshot,
  AssetSelector,
  AssetEquality,
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
 * Access the full asset snapshot.
 *
 * Must be used within an {@link AssetRoot}. The root confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function AssetOverview() {
 *   const snapshot = useAssets();
 *   return <span>Assets: {snapshot.assetCount}</span>;
 * }
 * ```
 */
export function useAssets(): AssetSnapshot;

/**
 * Access a derived slice of the asset snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function LoadedAssets() {
 *   const count = useAssets((s) => s.loadedCount);
 *   return <span>{count} loaded</span>;
 * }
 * ```
 */
export function useAssets<T>(
  selector: AssetSelector<T>,
  equalityFn?: AssetEquality<T>,
): T;

export function useAssets<T>(
  selector?: AssetSelector<T>,
  equalityFn?: AssetEquality<T>,
): AssetSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  useAssetContext();

  const snapshot = useSyncExternalStore(
    subscribeAsset,
    getAssetSnapshot,
    getAssetSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: AssetSnapshot } | null>(
    null,
  );

  const selected = selector
    ? selector(snapshot)
    : (snapshot as T);

  const eq = equalityFn ?? (Object as { is: (a: unknown, b: unknown) => boolean }).is;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { selected, snapshot };
  } else if (!eq(prevRef.current.selected, selected)) {
    prevRef.current = { selected, snapshot };
  }

  /* Memoize to avoid returning a new object reference when the selected
     value is structurally equal. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.selected, [selected]);
}
