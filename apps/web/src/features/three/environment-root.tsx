/**
 * Environment Root — Lifecycle Owner for Environment Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * This component:
 *   - Reads ThreeContext to determine if 3D is enabled
 *   - Initializes the environment-manager singleton on mount
 *   - Subscribes to environment-manager state changes via useSyncExternalStore
 *   - Forwards quality and reduced-motion changes to environment-manager
 *   - Provides EnvironmentContext to all environment-consuming descendants
 *
 * Renders INSIDE SceneRoot — as children, not wrapping it.
 * Gates rendering behind threeCtx.isEnabled.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { useThree } from './hooks/use-three';
import { environmentManager } from './environment-manager';
import { EnvironmentContext, type EnvironmentContextValue } from './environment-provider';

import type { EnvironmentSnapshot } from './environment.types';

// ── Props ──────────────────────────────────────────────────

interface EnvironmentRootProps {
  /** The environment-consuming subtree. */
  readonly children: ReactNode;
}

// ── useSyncExternalStore source ────────────────────────────

/** Subscribe to environment-manager state changes. */
function subscribeEnvironment(callback: () => void): () => void {
  return environmentManager.subscribe(callback);
}

/** Get the current snapshot (for useSyncExternalStore). */
function getEnvironmentSnapshot(): EnvironmentSnapshot {
  return environmentManager.getSnapshot();
}

// ── Component ──────────────────────────────────────────────

/**
 * Lifecycle owner for environment architecture.
 *
 * Initializes the environment-manager singleton and provides environment state to
 * descendants. Renders inside SceneRoot as children. Gates behind
 * the Three context's isEnabled flag — when 3D is off, environment state
 * remains at its default (no presets registered, zero revision).
 *
 * @example
 * ```tsx
 * <SceneRoot>
 *   <EnvironmentRoot>
 *     <HeroEnvironment />
 *   </EnvironmentRoot>
 * </SceneRoot>
 * ```
 */
export function EnvironmentRoot({ children }: EnvironmentRootProps) {
  const { isEnabled, isReducedMotion, quality } = useThree();

  // ── Lifecycle: init / destroy ────────────────────────────

  useEffect(() => {
    if (!isEnabled) return;

    environmentManager.init();
    return () => {
      environmentManager.destroy();
    };
  }, [isEnabled]);

  // ── Forward upstream state changes ───────────────────────

  useEffect(() => {
    if (!isEnabled) return;
    environmentManager.setReducedMotion(isReducedMotion);
  }, [isEnabled, isReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    environmentManager.setQualityPreset(quality.preset);
  }, [isEnabled, quality.preset]);

  // ── Subscribe to snapshot ────────────────────────────────

  const snapshot = useSyncExternalStore(subscribeEnvironment, getEnvironmentSnapshot);

  // ── Derived state ────────────────────────────────────────

  const isEnabledEnvironment = useMemo(
    () => isEnabled && environmentManager.isInitialized(),
    [isEnabled],
  );

  // ── Context value (memoized) ─────────────────────────────

  const value = useMemo<EnvironmentContextValue>(
    () => ({
      environmentManager,
      snapshot,
      isEnabled: isEnabledEnvironment,
      isReducedMotion,
    }),
    [snapshot, isEnabledEnvironment, isReducedMotion],
  );

  // ── Gate ─────────────────────────────────────────────────

  if (!isEnabled) {
    return null;
  }

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}
