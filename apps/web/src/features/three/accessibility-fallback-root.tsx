/**
 * Accessibility Fallback Root — Lifecycle Owner for Accessibility Fallback State
 *
 * This component initializes the accessibility-fallback-manager singleton on mount,
 * subscribes to its snapshot via useSyncExternalStore, forwards reduced-motion and
 * high-contrast changes, and provides the AccessibilityFallbackContext to children.
 *
 * Architecture:
 *   - Reads ThreeContext for isEnabled, qualityPreset, isReducedMotion
 *   - Initializes accessibility-fallback-manager on mount, destroys on unmount
 *   - Subscribes to snapshot changes via useSyncExternalStore
 *   - Provides AccessibilityFallbackContextValue to children
 *
 * Provider Hierarchy:
 *   ThreeProvider → ThreeCanvas → SceneRoot → ... → AssetRoot →
 *   PerformanceBudgetRoot → MobileFallbackRoot → AccessibilityFallbackRoot
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useSyncExternalStore } from 'react';

import { useThree } from './hooks/use-three';
import { accessibilityFallbackManager } from './accessibility-fallback-manager';
import { AccessibilityFallbackContext } from './accessibility-fallback-provider';

import type { AccessibilityFallbackContextValue } from './accessibility-fallback-provider';

// ── Component ────────────────────────────────────────────────

/**
 * Lifecycle owner for the accessibility fallback subsystem.
 *
 * Renders inside ThreeCanvas (via SceneRoot provider chain).
 * Initializes the singleton manager and provides context.
 *
 * @example
 * ```tsx
 * <ThreeCanvas>
 *   <SceneRoot>
 *     <AccessibilityFallbackRoot>
 *       {/* future 3D content *\/}
 *     </AccessibilityFallbackRoot>
 *   </SceneRoot>
 * </ThreeCanvas>
 * ```
 */
export function AccessibilityFallbackRoot({
  children,
}: {
  readonly children?: React.ReactNode;
}): React.JSX.Element | null {
  /* Read 3D context for integration signals. */
  const threeCtx = useThree();

  /* Subscribe to the accessibility fallback snapshot. */
  const getSnapshot = useCallback(
    () => accessibilityFallbackManager.getSnapshot(),
    [],
  );

  const subscribe = useCallback(
    (callback: () => void) => accessibilityFallbackManager.subscribe(callback),
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
      accessibilityFallbackManager.init();
      initializedRef.current = true;
    }

    return () => {
      accessibilityFallbackManager.destroy();
      initializedRef.current = false;
    };
  }, []);

  /* Forward reduced-motion changes. */
  useEffect(() => {
    accessibilityFallbackManager.setReducedMotion(threeCtx.isReducedMotion);
  }, [threeCtx.isReducedMotion]);

  /* Memoize context value to prevent unnecessary consumer re-renders. */
  const contextValue = useMemo<AccessibilityFallbackContextValue>(
    () => ({
      manager: accessibilityFallbackManager,
      snapshot,
      isEnabled: threeCtx.isEnabled,
      isReducedMotion: threeCtx.isReducedMotion,
      isHighContrast: snapshot.isHighContrast,
    }),
    [snapshot, threeCtx.isEnabled, threeCtx.isReducedMotion],
  );

  return (
    <AccessibilityFallbackContext.Provider value={contextValue}>
      {children}
    </AccessibilityFallbackContext.Provider>
  );
}
