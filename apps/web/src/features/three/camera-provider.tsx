/**
 * Camera Provider — Context Creation for Camera Architecture
 *
 * Fast Refresh compliant: no JSX in this file. The context object is created
 * here; the provider component lives in camera-root.tsx.
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { createContext, useContext } from 'react';

import type { CameraManager, CameraSnapshot } from './camera.types';

// ── Context Value ─────────────────────────────────────────

/**
 * The value provided by {@link CameraRoot} to all camera-consuming descendants.
 *
 * All fields are readonly — consumers read, they never mutate.
 */
export interface CameraContextValue {
  /** The singleton camera manager. */
  readonly cameraManager: CameraManager;
  /** The current immutable camera snapshot. */
  readonly snapshot: CameraSnapshot;
  /** Whether the camera layer is enabled (3D enabled + camera manager initialized). */
  readonly isEnabled: boolean;
  /** Whether reduced motion is active (mirrors ThreeContext). */
  readonly isReducedMotion: boolean;
}

// ── Context ───────────────────────────────────────────────

/** React context for camera architecture state. */
export const CameraContext = createContext<CameraContextValue | null>(null);

CameraContext.displayName = 'CameraContext';

// ── Hook ──────────────────────────────────────────────────

/**
 * Access the camera context value. Must be used within a {@link CameraRoot}.
 *
 * @throws When used outside a `<CameraRoot>`.
 */
export function useCameraContext(): CameraContextValue {
  const ctx = useContext(CameraContext);
  if (ctx === null) {
    throw new Error(
      'useCameraContext must be used within a <CameraRoot>. ' +
        'Wrap the subtree in <CameraRoot> (inside <SceneRoot>) before ' +
        'calling useCameraContext.',
    );
  }
  return ctx;
}
