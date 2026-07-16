/**
 * useLightingQuality — Quality-Adapted Lighting Settings
 *
 * Provides access to the lighting quality profile derived from the active
 * quality preset. Includes convenience booleans for feature gating.
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { lightingManager } from '../lighting-manager';
import { useLightingContext } from '../lighting-provider';

import type { LightingSnapshot } from '../lighting.types';

/**
 * Get the current lighting snapshot (used by `useSyncExternalStore`).
 */
function getLightingSnapshot(): LightingSnapshot {
  return lightingManager.getSnapshot();
}

/**
 * Subscribe to lighting snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeLighting(callback: () => void): () => void {
  return lightingManager.subscribe(callback);
}

/**
 * Return type — lighting quality settings with convenience booleans.
 */
export interface UseLightingQualityReturn {
  /** Active quality preset ('ultra' | 'high' | 'medium' | 'low' | 'minimal'). */
  readonly preset: LightingSnapshot['qualityPreset'];
  /** Maximum number of lights allowed simultaneously. */
  readonly maxLights: number;
  /** Whether shadow rendering is enabled. */
  readonly shadowsEnabled: boolean;
  /** Shadow map resolution (0 = disabled). */
  readonly shadowMapSize: number;
  /** Whether environment maps / IBL are enabled. */
  readonly environmentEnabled: boolean;
  /** Whether dynamic lighting changes are allowed. */
  readonly dynamicEnabled: boolean;
  /** Whether bloom / post-lighting effects are allowed. */
  readonly effectsEnabled: boolean;
}

/**
 * Access the lighting quality profile.
 *
 * Returns the quality-adapted settings derived from the active quality
 * preset. Useful for components that need to check feature availability
 * (e.g., whether shadows are enabled) before configuring lighting.
 *
 * Must be used within a {@link LightingRoot}.
 *
 * @example
 * ```tsx
 * function ShadowGate() {
 *   const { shadowsEnabled } = useLightingQuality();
 *   if (!shadowsEnabled) return null;
 *   return <ShadowCaster />;
 * }
 * ```
 */
export function useLightingQuality(): UseLightingQualityReturn {
  /* Confirm the provider is mounted. */
  useLightingContext();

  const snapshot = useSyncExternalStore(
    subscribeLighting,
    getLightingSnapshot,
    getLightingSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ quality: UseLightingQualityReturn; snapshot: LightingSnapshot } | null>(
    null,
  );

  const quality: UseLightingQualityReturn = {
    preset: snapshot.qualityPreset,
    maxLights: snapshot.qualityProfile.maxLights,
    shadowsEnabled: snapshot.qualityProfile.shadowsEnabled,
    shadowMapSize: snapshot.qualityProfile.shadowMapSize,
    environmentEnabled: snapshot.qualityProfile.environmentEnabled,
    dynamicEnabled: snapshot.qualityProfile.dynamicEnabled,
    effectsEnabled: snapshot.qualityProfile.effectsEnabled,
  };

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { quality, snapshot };
  } else if (
    prevRef.current.quality.preset !== quality.preset ||
    prevRef.current.quality.maxLights !== quality.maxLights ||
    prevRef.current.quality.shadowsEnabled !== quality.shadowsEnabled
  ) {
    prevRef.current = { quality, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.quality, [quality]);
}
