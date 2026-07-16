/**
 * useLightingState — Full Lighting State Snapshot
 *
 * Provides access to the complete lighting state including intensity,
 * color temperature, ambient/directional levels, shadows, quality profile,
 * and constraints.
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
 * The complete lighting state for rendering and debugging.
 */
export interface LightingStateReturn {
  /** Current global intensity multiplier. */
  readonly intensity: number;
  /** Current color temperature in Kelvin. */
  readonly colorTemperature: number;
  /** Current ambient light intensity. */
  readonly ambientIntensity: number;
  /** Current directional light intensity. */
  readonly directionalIntensity: number;
  /** Whether shadows are enabled. */
  readonly shadowsEnabled: boolean;
  /** Current active environment. */
  readonly activeEnvironment: LightingSnapshot['activeEnvironment'];
  /** Quality-adapted lighting settings. */
  readonly qualityProfile: LightingSnapshot['qualityProfile'];
  /** Lighting constraints. */
  readonly constraints: LightingSnapshot['constraints'];
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
}

/**
 * Access the complete lighting state.
 *
 * Returns a derived object with intensity, color temperature, ambient,
 * directional, shadows, environment, quality profile, and constraints.
 * Useful for components that need to configure lighting or debug overlays.
 *
 * Must be used within a {@link LightingRoot}.
 *
 * @example
 * ```tsx
 * function LightingDebug() {
 *   const state = useLightingState();
 *   return (
 *     <div>
 *       <p>Intensity: {state.intensity}</p>
 *       <p>Color Temp: {state.colorTemperature}K</p>
 *       <p>Shadows: {state.shadowsEnabled ? 'on' : 'off'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLightingState(): LightingStateReturn {
  /* Confirm the provider is mounted. */
  useLightingContext();

  const snapshot = useSyncExternalStore(
    subscribeLighting,
    getLightingSnapshot,
    getLightingSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ state: LightingStateReturn; snapshot: LightingSnapshot } | null>(
    null,
  );

  const state: LightingStateReturn = {
    intensity: snapshot.intensity,
    colorTemperature: snapshot.colorTemperature,
    ambientIntensity: snapshot.ambientIntensity,
    directionalIntensity: snapshot.directionalIntensity,
    shadowsEnabled: snapshot.shadowsEnabled,
    activeEnvironment: snapshot.activeEnvironment,
    qualityProfile: snapshot.qualityProfile,
    constraints: snapshot.constraints,
    isReducedMotion: snapshot.isReducedMotion,
  };

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { state, snapshot };
  } else if (
    prevRef.current.state.intensity !== state.intensity ||
    prevRef.current.state.colorTemperature !== state.colorTemperature ||
    prevRef.current.state.shadowsEnabled !== state.shadowsEnabled ||
    prevRef.current.state.activeEnvironment !== state.activeEnvironment
  ) {
    prevRef.current = { state, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.state, [state]);
}
