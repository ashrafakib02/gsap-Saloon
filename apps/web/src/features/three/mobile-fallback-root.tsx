/**
 * Mobile Fallback Root — Lifecycle Owner for Mobile Fallback State
 *
 * This component initializes the mobile-fallback-manager singleton on mount,
 * subscribes to its snapshot via useSyncExternalStore, forwards quality and
 * reduced-motion changes, and provides the MobileFallbackContext to children.
 *
 * Architecture:
 *   - Reads ThreeContext for isEnabled, qualityPreset, isReducedMotion
 *   - Initializes mobile-fallback-manager on mount, destroys on unmount
 *   - Subscribes to snapshot changes via useSyncExternalStore
 *   - Provides MobileFallbackContextValue to children
 *
 * Provider Hierarchy:
 *   ThreeProvider → ThreeCanvas → SceneRoot → ... → AssetRoot →
 *   PerformanceBudgetRoot → MobileFallbackRoot
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useSyncExternalStore } from 'react';

import { useThree } from './hooks/use-three';
import { mobileFallbackManager } from './mobile-fallback-manager';
import { MobileFallbackContext } from './mobile-fallback-provider';

import type { MobileFallbackContextValue } from './mobile-fallback-provider';

// ── Component ────────────────────────────────────────────────

/**
 * Lifecycle owner for the mobile fallback subsystem.
 *
 * Renders inside ThreeCanvas (via SceneRoot provider chain).
 * Initializes the singleton manager and provides context.
 *
 * @example
 * ```tsx
 * <ThreeCanvas>
 *   <SceneRoot>
 *     <MobileFallbackRoot>
 *       {/* future 3D content *\/}
 *     </MobileFallbackRoot>
 *   </SceneRoot>
 * </ThreeCanvas>
 * ```
 */
export function MobileFallbackRoot({
  children,
}: {
  readonly children?: React.ReactNode;
}): React.JSX.Element | null {
  /* Read 3D context for integration signals. */
  const threeCtx = useThree();

  /* Subscribe to the mobile fallback snapshot. */
  const getSnapshot = useCallback(
    () => mobileFallbackManager.getSnapshot(),
    [],
  );

  const subscribe = useCallback(
    (callback: () => void) => mobileFallbackManager.subscribe(callback),
    [],
  );

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  /* Initialize manager on mount, destroy on unmount. */
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      mobileFallbackManager.init();
      initializedRef.current = true;
    }

    return () => {
      mobileFallbackManager.destroy();
      initializedRef.current = false;
    };
  }, []);

  /* Forward reduced-motion changes. */
  useEffect(() => {
    mobileFallbackManager.setReducedMotion(threeCtx.isReducedMotion);
  }, [threeCtx.isReducedMotion]);

  /* Memoize context value to prevent unnecessary consumer re-renders. */
  const contextValue = useMemo<MobileFallbackContextValue>(
    () => ({
      manager: mobileFallbackManager,
      snapshot,
      isEnabled: threeCtx.isEnabled,
      isReducedMotion: threeCtx.isReducedMotion,
    }),
    [snapshot, threeCtx.isEnabled, threeCtx.isReducedMotion],
  );

  return (
    <MobileFallbackContext.Provider value={contextValue}>
      {children}
    </MobileFallbackContext.Provider>
  );
}
