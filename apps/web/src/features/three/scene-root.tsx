/**
 * Scene Root — Lifecycle Owner for Scene Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * This component:
 *   - Reads ThreeContext to determine if 3D is enabled
 *   - Initializes the scene-manager singleton on mount
 *   - Subscribes to scene-manager state changes via useSyncExternalStore
 *   - Forwards quality and reduced-motion changes to scene-manager
 *   - Provides SceneContext to all scene-consuming descendants
 *
 * Renders INSIDE ThreeCanvas — as children, not wrapping it.
 * Gates rendering behind threeCtx.isEnabled.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { useThree } from './hooks/use-three';
import { sceneManager } from './scene-manager';
import { SceneContext, type SceneContextValue } from './scene-provider';

import type { SceneSnapshot } from './scene.types';

// ── Props ──────────────────────────────────────────────────

interface SceneRootProps {
  /** The scene-consuming subtree. */
  readonly children: ReactNode;
}

// ── useSyncExternalStore source ───────────────────────────

/** Subscribe to scene-manager state changes. */
function subscribeScene(callback: () => void): () => void {
  return sceneManager.subscribe(callback);
}

/** Get the current snapshot (for useSyncExternalStore). */
function getSceneSnapshot(): SceneSnapshot {
  return sceneManager.getSnapshot();
}

// ── Component ──────────────────────────────────────────────

/**
 * Lifecycle owner for scene architecture.
 *
 * Initializes the scene-manager singleton and provides scene state to
 * descendants. Renders inside ThreeCanvas as children. Gates behind
 * the Three context's isEnabled flag — when 3D is off, scene state
 * remains at its default (no scenes registered, zero revision).
 *
 * @example
 * ```tsx
 * <ThreeCanvas>
 *   <SceneRoot>
 *     <HeroScene />
 *     <AmbientParticles />
 *   </SceneRoot>
 * </ThreeCanvas>
 * ```
 */
export function SceneRoot({ children }: SceneRootProps) {
  const { isEnabled, isReducedMotion, quality } = useThree();

  // ── Lifecycle: init / destroy ──────────────────────────

  useEffect(() => {
    if (!isEnabled) return;

    sceneManager.init();
    return () => {
      sceneManager.destroy();
    };
  }, [isEnabled]);

  // ── Forward upstream state changes ─────────────────────

  useEffect(() => {
    if (!isEnabled) return;
    sceneManager.setReducedMotion(isReducedMotion);
  }, [isEnabled, isReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    sceneManager.setQualityPreset(quality.preset);
  }, [isEnabled, quality.preset]);

  // ── Subscribe to snapshot ──────────────────────────────

  const snapshot = useSyncExternalStore(subscribeScene, getSceneSnapshot);

  // ── Derived state ──────────────────────────────────────

  const isEnabledScene = useMemo(
    () => isEnabled && sceneManager.isInitialized(),
    [isEnabled],
  );

  // ── Context value (memoized) ───────────────────────────

  const value = useMemo<SceneContextValue>(
    () => ({
      sceneManager,
      snapshot,
      isEnabled: isEnabledScene,
      isReducedMotion,
    }),
    [snapshot, isEnabledScene, isReducedMotion],
  );

  // ── Gate ──────────────────────────────────────────────

  if (!isEnabled) {
    return null;
  }

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}
