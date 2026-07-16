/**
 * Materials Root — Lifecycle Owner for Materials Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * This component:
 *   - Reads ThreeContext to determine if 3D is enabled
 *   - Initializes the materials-manager singleton on mount
 *   - Subscribes to materials-manager state changes via useSyncExternalStore
 *   - Forwards quality and reduced-motion changes to materials-manager
 *   - Provides MaterialsContext to all material-consuming descendants
 *
 * Renders INSIDE SceneRoot — as children, not wrapping it.
 * Gates rendering behind threeCtx.isEnabled.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { useThree } from './hooks/use-three';
import { materialsManager } from './materials-manager';
import { MaterialsContext, type MaterialsContextValue } from './materials-provider';

import type { MaterialSnapshot } from './materials.types';

// ── Props ─────────────────────────────────────────────────

interface MaterialsRootProps {
  /** The materials-consuming subtree. */
  readonly children: ReactNode;
}

// ── useSyncExternalStore source ───────────────────────────

/** Subscribe to materials-manager state changes. */
function subscribeMaterials(callback: () => void): () => void {
  return materialsManager.subscribe(callback);
}

/** Get the current snapshot (for useSyncExternalStore). */
function getMaterialsSnapshot(): MaterialSnapshot {
  return materialsManager.getSnapshot();
}

// ── Component ─────────────────────────────────────────────

/**
 * Lifecycle owner for materials architecture.
 *
 * Initializes the materials-manager singleton and provides material state to
 * descendants. Renders inside SceneRoot as children. Gates behind
 * the Three context's isEnabled flag — when 3D is off, material state
 * remains at its default (no presets registered, zero revision).
 *
 * @example
 * ```tsx
 * <SceneRoot>
 *   <MaterialsRoot>
 *     <HeroMaterials />
 *   </MaterialsRoot>
 * </SceneRoot>
 * ```
 */
export function MaterialsRoot({ children }: MaterialsRootProps) {
  const { isEnabled, isReducedMotion, quality } = useThree();

  // ── Lifecycle: init / destroy ───────────────────────────

  useEffect(() => {
    if (!isEnabled) return;

    materialsManager.init();
    return () => {
      materialsManager.destroy();
    };
  }, [isEnabled]);

  // ── Forward upstream state changes ──────────────────────

  useEffect(() => {
    if (!isEnabled) return;
    materialsManager.setReducedMotion(isReducedMotion);
  }, [isEnabled, isReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    materialsManager.setQualityPreset(quality.preset);
  }, [isEnabled, quality.preset]);

  // ── Subscribe to snapshot ───────────────────────────────

  const snapshot = useSyncExternalStore(subscribeMaterials, getMaterialsSnapshot);

  // ── Derived state ───────────────────────────────────────

  const isEnabledMaterials = useMemo(
    () => isEnabled && materialsManager.isInitialized(),
    [isEnabled],
  );

  // ── Context value (memoized) ────────────────────────────

  const value = useMemo<MaterialsContextValue>(
    () => ({
      materialsManager,
      snapshot,
      isEnabled: isEnabledMaterials,
      isReducedMotion,
    }),
    [snapshot, isEnabledMaterials, isReducedMotion],
  );

  // ── Gate ───────────────────────────────────────────────

  if (!isEnabled) {
    return null;
  }

  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
}
