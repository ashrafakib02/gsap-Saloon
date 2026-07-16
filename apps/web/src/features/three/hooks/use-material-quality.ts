/**
 * useMaterialQuality — Quality-Adapted Material Settings
 *
 * Provides access to the material quality profile derived from the active
 * quality preset. Includes convenience booleans for feature gating.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { materialsManager } from '../materials-manager';
import { useMaterialsContext } from '../materials-provider';

import type { MaterialSnapshot } from '../materials.types';

/**
 * Get the current material snapshot (used by `useSyncExternalStore`).
 */
function getMaterialsSnapshot(): MaterialSnapshot {
  return materialsManager.getSnapshot();
}

/**
 * Subscribe to material snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeMaterials(callback: () => void): () => void {
  return materialsManager.subscribe(callback);
}

/**
 * Return type — material quality settings with convenience booleans.
 */
export interface UseMaterialQualityReturn {
  /** Active quality preset ('ultra' | 'high' | 'medium' | 'low' | 'minimal'). */
  readonly preset: MaterialSnapshot['qualityPreset'];
  /** Maximum texture resolution in pixels (longest edge). */
  readonly maxTextureSize: number;
  /** Whether normal maps are enabled. */
  readonly normalMapsEnabled: boolean;
  /** Whether roughness / PBR metallic-roughness workflow is enabled. */
  readonly pbrEnabled: boolean;
  /** Whether clearcoat is enabled. */
  readonly clearcoatEnabled: boolean;
  /** Whether transmission / glass is enabled. */
  readonly transmissionEnabled: boolean;
  /** Whether subsurface scattering is enabled. */
  readonly subsurfaceEnabled: boolean;
  /** Whether anisotropy is enabled. */
  readonly anisotropyEnabled: boolean;
  /** Maximum simultaneous material swaps per frame. */
  readonly maxSwapsPerFrame: number;
  /** Whether texture compression is used. */
  readonly compressionEnabled: boolean;
}

/**
 * Access the material quality profile.
 *
 * Returns the quality-adapted settings derived from the active quality
 * preset. Useful for components that need to check feature availability
 * (e.g., whether normal maps are enabled) before configuring materials.
 *
 * Must be used within a {@link MaterialsRoot}.
 *
 * @example
 * ```tsx
 * function NormalMapGate() {
 *   const { normalMapsEnabled } = useMaterialQuality();
 *   if (!normalMapsEnabled) return null;
 *   return <NormalMappedMesh />;
 * }
 * ```
 */
export function useMaterialQuality(): UseMaterialQualityReturn {
  /* Confirm the provider is mounted. */
  useMaterialsContext();

  const snapshot = useSyncExternalStore(
    subscribeMaterials,
    getMaterialsSnapshot,
    getMaterialsSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ quality: UseMaterialQualityReturn; snapshot: MaterialSnapshot } | null>(
    null,
  );

  const quality: UseMaterialQualityReturn = {
    preset: snapshot.qualityPreset,
    maxTextureSize: snapshot.qualityProfile.maxTextureSize,
    normalMapsEnabled: snapshot.qualityProfile.normalMapsEnabled,
    pbrEnabled: snapshot.qualityProfile.pbrEnabled,
    clearcoatEnabled: snapshot.qualityProfile.clearcoatEnabled,
    transmissionEnabled: snapshot.qualityProfile.transmissionEnabled,
    subsurfaceEnabled: snapshot.qualityProfile.subsurfaceEnabled,
    anisotropyEnabled: snapshot.qualityProfile.anisotropyEnabled,
    maxSwapsPerFrame: snapshot.qualityProfile.maxSwapsPerFrame,
    compressionEnabled: snapshot.qualityProfile.compressionEnabled,
  };

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { quality, snapshot };
  } else if (
    prevRef.current.quality.preset !== quality.preset ||
    prevRef.current.quality.maxTextureSize !== quality.maxTextureSize ||
    prevRef.current.quality.pbrEnabled !== quality.pbrEnabled
  ) {
    prevRef.current = { quality, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.quality, [quality]);
}
