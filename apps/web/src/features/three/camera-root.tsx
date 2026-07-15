/**
 * Camera Root — Lifecycle Owner for Camera Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * This component:
 *   - Reads ThreeContext to determine if 3D is enabled
 *   - Initializes the camera-manager singleton on mount
 *   - Subscribes to camera-manager state changes via useSyncExternalStore
 *   - Forwards quality and reduced-motion changes to camera-manager
 *   - Provides CameraContext to all camera-consuming descendants
 *
 * Renders INSIDE SceneRoot — as children, not wrapping it.
 * Gates rendering behind threeCtx.isEnabled.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { useThree } from './hooks/use-three';
import { cameraManager } from './camera-manager';
import { CameraContext, type CameraContextValue } from './camera-provider';

import type { CameraSnapshot } from './camera.types';

// ── Props ──────────────────────────────────────────────────

interface CameraRootProps {
  /** The camera-consuming subtree. */
  readonly children: ReactNode;
}

// ── useSyncExternalStore source ───────────────────────────

/** Subscribe to camera-manager state changes. */
function subscribeCamera(callback: () => void): () => void {
  return cameraManager.subscribe(callback);
}

/** Get the current snapshot (for useSyncExternalStore). */
function getCameraSnapshot(): CameraSnapshot {
  return cameraManager.getSnapshot();
}

// ── Component ──────────────────────────────────────────────

/**
 * Lifecycle owner for camera architecture.
 *
 * Initializes the camera-manager singleton and provides camera state to
 * descendants. Renders inside SceneRoot as children. Gates behind
 * the Three context's isEnabled flag — when 3D is off, camera state
 * remains at its default (no presets registered, zero revision).
 *
 * @example
 * ```tsx
 * <SceneRoot>
 *   <CameraRoot>
 *     <HeroScene />
 *   </CameraRoot>
 * </SceneRoot>
 * ```
 */
export function CameraRoot({ children }: CameraRootProps) {
  const { isEnabled, isReducedMotion, quality } = useThree();

  // ── Lifecycle: init / destroy ──────────────────────────

  useEffect(() => {
    if (!isEnabled) return;

    cameraManager.init();
    return () => {
      cameraManager.destroy();
    };
  }, [isEnabled]);

  // ── Forward upstream state changes ─────────────────────

  useEffect(() => {
    if (!isEnabled) return;
    cameraManager.setReducedMotion(isReducedMotion);
  }, [isEnabled, isReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    cameraManager.setQualityPreset(quality.preset);
  }, [isEnabled, quality.preset]);

  // ── Subscribe to snapshot ──────────────────────────────

  const snapshot = useSyncExternalStore(subscribeCamera, getCameraSnapshot);

  // ── Derived state ──────────────────────────────────────

  const isEnabledCamera = useMemo(
    () => isEnabled && cameraManager.isInitialized(),
    [isEnabled],
  );

  // ── Context value (memoized) ───────────────────────────

  const value = useMemo<CameraContextValue>(
    () => ({
      cameraManager,
      snapshot,
      isEnabled: isEnabledCamera,
      isReducedMotion,
    }),
    [snapshot, isEnabledCamera, isReducedMotion],
  );

  // ── Gate ──────────────────────────────────────────────

  if (!isEnabled) {
    return null;
  }

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
}
