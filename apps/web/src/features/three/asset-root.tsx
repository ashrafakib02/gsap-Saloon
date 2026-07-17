/**
 * Asset Root — Lifecycle Owner for Asset Pipeline Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * This component:
 *   - Reads ThreeContext to determine if 3D is enabled
 *   - Initializes the asset-manager singleton on mount
 *   - Subscribes to asset-manager state changes via useSyncExternalStore
 *   - Forwards quality and reduced-motion changes to asset-manager
 *   - Provides AssetContext to all asset-consuming descendants
 *
 * Renders INSIDE MaterialsRoot — as children, not wrapping it.
 * Gates rendering behind threeCtx.isEnabled.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { useThree } from './hooks/use-three';
import { assetManager } from './asset-manager';
import { AssetContext, type AssetContextValue } from './asset-provider';

import type { AssetSnapshot } from './asset.types';

// ── Props ──────────────────────────────────────────────────

interface AssetRootProps {
  /** The asset-consuming subtree. */
  readonly children: ReactNode;
}

// ── useSyncExternalStore source ────────────────────────────

/** Subscribe to asset-manager state changes. */
function subscribeAssets(callback: () => void): () => void {
  return assetManager.subscribe(callback);
}

/** Get the current snapshot (for useSyncExternalStore). */
function getAssetsSnapshot(): AssetSnapshot {
  return assetManager.getSnapshot();
}

// ── Component ──────────────────────────────────────────────

/**
 * Lifecycle owner for asset pipeline architecture.
 *
 * Initializes the asset-manager singleton and provides asset state to
 * descendants. Renders inside MaterialsRoot as children. Gates behind
 * the Three context's isEnabled flag — when 3D is off, asset state
 * remains at its default (no assets registered, zero revision).
 *
 * @example
 * ```tsx
 * <MaterialsRoot>
 *   <AssetRoot>
 *     <HeroAssets />
 *   </AssetRoot>
 * </MaterialsRoot>
 * ```
 */
export function AssetRoot({ children }: AssetRootProps) {
  const { isEnabled, isReducedMotion, quality } = useThree();

  // ── Lifecycle: init / destroy ────────────────────────────

  useEffect(() => {
    if (!isEnabled) return;

    assetManager.init();
    return () => {
      assetManager.destroy();
    };
  }, [isEnabled]);

  // ── Forward upstream state changes ───────────────────────

  useEffect(() => {
    if (!isEnabled) return;
    assetManager.setReducedMotion(isReducedMotion);
  }, [isEnabled, isReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    assetManager.setQualityPreset(quality.preset);
  }, [isEnabled, quality.preset]);

  // ── Subscribe to snapshot ────────────────────────────────

  const snapshot = useSyncExternalStore(subscribeAssets, getAssetsSnapshot);

  // ── Derived state ────────────────────────────────────────

  const isEnabledAssets = useMemo(
    () => isEnabled && assetManager.isInitialized(),
    [isEnabled],
  );

  // ── Context value (memoized) ─────────────────────────────

  const value = useMemo<AssetContextValue>(
    () => ({
      manager: assetManager,
      snapshot,
      isEnabled: isEnabledAssets,
      isReducedMotion,
    }),
    [snapshot, isEnabledAssets, isReducedMotion],
  );

  // ── Gate ─────────────────────────────────────────────────

  if (!isEnabled) {
    return null;
  }

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
}
