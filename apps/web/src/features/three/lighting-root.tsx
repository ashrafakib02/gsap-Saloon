/**
 * Lighting Root — Lifecycle Owner for Lighting Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * This component:
 *   - Reads ThreeContext to determine if 3D is enabled
 *   - Initializes the lighting-manager singleton on mount
 *   - Subscribes to lighting-manager state changes via useSyncExternalStore
 *   - Forwards quality and reduced-motion changes to lighting-manager
 *   - Provides LightingContext to all lighting-consuming descendants
 *
 * Renders INSIDE SceneRoot — as children, not wrapping it.
 * Gates rendering behind threeCtx.isEnabled.
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { useThree } from './hooks/use-three';
import { lightingManager } from './lighting-manager';
import { LightingContext, type LightingContextValue } from './lighting-provider';

import type { LightingSnapshot } from './lighting.types';

// ── Props ──────────────────────────────────────────────────

interface LightingRootProps {
  /** The lighting-consuming subtree. */
  readonly children: ReactNode;
}

// ── useSyncExternalStore source ───────────────────────────

/** Subscribe to lighting-manager state changes. */
function subscribeLighting(callback: () => void): () => void {
  return lightingManager.subscribe(callback);
}

/** Get the current snapshot (for useSyncExternalStore). */
function getLightingSnapshot(): LightingSnapshot {
  return lightingManager.getSnapshot();
}

// ── Component ──────────────────────────────────────────────

/**
 * Lifecycle owner for lighting architecture.
 *
 * Initializes the lighting-manager singleton and provides lighting state to
 * descendants. Renders inside SceneRoot as children. Gates behind
 * the Three context's isEnabled flag — when 3D is off, lighting state
 * remains at its default (no presets registered, zero revision).
 *
 * @example
 * ```tsx
 * <SceneRoot>
 *   <LightingRoot>
 *     <HeroLighting />
 *   </LightingRoot>
 * </SceneRoot>
 * ```
 */
export function LightingRoot({ children }: LightingRootProps) {
  const { isEnabled, isReducedMotion, quality } = useThree();

  // ── Lifecycle: init / destroy ──────────────────────────

  useEffect(() => {
    if (!isEnabled) return;

    lightingManager.init();
    return () => {
      lightingManager.destroy();
    };
  }, [isEnabled]);

  // ── Forward upstream state changes ─────────────────────

  useEffect(() => {
    if (!isEnabled) return;
    lightingManager.setReducedMotion(isReducedMotion);
  }, [isEnabled, isReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    lightingManager.setQualityPreset(quality.preset);
  }, [isEnabled, quality.preset]);

  // ── Subscribe to snapshot ──────────────────────────────

  const snapshot = useSyncExternalStore(subscribeLighting, getLightingSnapshot);

  // ── Derived state ──────────────────────────────────────

  const isEnabledLighting = useMemo(
    () => isEnabled && lightingManager.isInitialized(),
    [isEnabled],
  );

  // ── Context value (memoized) ───────────────────────────

  const value = useMemo<LightingContextValue>(
    () => ({
      lightingManager,
      snapshot,
      isEnabled: isEnabledLighting,
      isReducedMotion,
    }),
    [snapshot, isEnabledLighting, isReducedMotion],
  );

  // ── Gate ──────────────────────────────────────────────

  if (!isEnabled) {
    return null;
  }

  return (
    <LightingContext.Provider value={value}>
      {children}
    </LightingContext.Provider>
  );
}
