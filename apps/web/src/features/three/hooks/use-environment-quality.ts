/**
 * useEnvironmentQuality — Quality-Adapted Environment Settings
 *
 * Provides access to the environment quality profile derived from the active
 * quality preset. Includes convenience booleans for feature gating.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { environmentManager } from '../environment-manager';
import { useEnvironmentContext } from '../environment-provider';

import type { EnvironmentSnapshot } from '../environment.types';

/**
 * Get the current environment snapshot (used by `useSyncExternalStore`).
 */
function getEnvironmentSnapshot(): EnvironmentSnapshot {
  return environmentManager.getSnapshot();
}

/**
 * Subscribe to environment snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeEnvironment(callback: () => void): () => void {
  return environmentManager.subscribe(callback);
}

/**
 * Return type — environment quality settings with convenience booleans.
 */
export interface UseEnvironmentQualityReturn {
  /** Active quality preset ('ultra' | 'high' | 'medium' | 'low' | 'minimal'). */
  readonly preset: EnvironmentSnapshot['qualityPreset'];
  /** Maximum HDR environment resolution in pixels. */
  readonly maxHDRResolution: number;
  /** Maximum reflection probe resolution in pixels. */
  readonly maxReflectionResolution: number;
  /** Whether reflection probes are enabled. */
  readonly reflectionsEnabled: boolean;
  /** Whether fog is enabled. */
  readonly fogEnabled: boolean;
  /** Fog precision (number of marching steps, 0 = disabled). */
  readonly fogPrecision: number;
  /** Whether sky dome is enabled. */
  readonly skyEnabled: boolean;
  /** Whether IBL (image-based lighting) is enabled. */
  readonly iblEnabled: boolean;
  /** Whether atmospheric effects are enabled. */
  readonly atmosphereEnabled: boolean;
  /** Procedural complexity level (0–100). */
  readonly proceduralComplexity: number;
  /** Maximum simultaneous environment transitions per frame. */
  readonly maxTransitionsPerFrame: number;
}

/**
 * Access the environment quality profile.
 *
 * Returns the quality-adapted settings derived from the active quality
 * preset. Useful for components that need to check feature availability
 * (e.g., whether reflections are enabled) before configuring environments.
 *
 * Must be used within an {@link EnvironmentRoot}.
 *
 * @example
 * ```tsx
 * function ReflectionGate() {
 *   const { reflectionsEnabled } = useEnvironmentQuality();
 *   if (!reflectionsEnabled) return null;
 *   return <ReflectionProbe />;
 * }
 * ```
 */
export function useEnvironmentQuality(): UseEnvironmentQualityReturn {
  /* Confirm the provider is mounted. */
  useEnvironmentContext();

  const snapshot = useSyncExternalStore(
    subscribeEnvironment,
    getEnvironmentSnapshot,
    getEnvironmentSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ quality: UseEnvironmentQualityReturn; snapshot: EnvironmentSnapshot } | null>(
    null,
  );

  const quality: UseEnvironmentQualityReturn = {
    preset: snapshot.qualityPreset,
    maxHDRResolution: snapshot.qualityProfile.maxHDRResolution,
    maxReflectionResolution: snapshot.qualityProfile.maxReflectionResolution,
    reflectionsEnabled: snapshot.qualityProfile.reflectionsEnabled,
    fogEnabled: snapshot.qualityProfile.fogEnabled,
    fogPrecision: snapshot.qualityProfile.fogPrecision,
    skyEnabled: snapshot.qualityProfile.skyEnabled,
    iblEnabled: snapshot.qualityProfile.iblEnabled,
    atmosphereEnabled: snapshot.qualityProfile.atmosphereEnabled,
    proceduralComplexity: snapshot.qualityProfile.proceduralComplexity,
    maxTransitionsPerFrame: snapshot.qualityProfile.maxTransitionsPerFrame,
  };

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { quality, snapshot };
  } else if (
    prevRef.current.quality.preset !== quality.preset ||
    prevRef.current.quality.maxHDRResolution !== quality.maxHDRResolution ||
    prevRef.current.quality.iblEnabled !== quality.iblEnabled
  ) {
    prevRef.current = { quality, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.quality, [quality]);
}
