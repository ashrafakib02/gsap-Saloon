/**
 * Scene Provider — Context Creation for Scene Architecture
 *
 * Fast Refresh compliant: no JSX in this file. The context object is created
 * here; the provider component lives in scene-root.tsx.
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes register with the 3D root so the engine can coordinate lifecycle,
 *  disposal, and quality scaling centrally."
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { createContext, useContext } from 'react';

import type { SceneManager, SceneSnapshot } from './scene.types';

// ── Context Value ─────────────────────────────────────────

/**
 * The value provided by {@link SceneRoot} to all scene-consuming descendants.
 *
 * All fields are readonly — consumers read, they never mutate.
 */
export interface SceneContextValue {
  /** The singleton scene manager. */
  readonly sceneManager: SceneManager;
  /** The current immutable scene snapshot. */
  readonly snapshot: SceneSnapshot;
  /** Whether the scene layer is enabled (3D enabled + scene manager initialized). */
  readonly isEnabled: boolean;
  /** Whether reduced motion is active (mirrors ThreeContext). */
  readonly isReducedMotion: boolean;
}

// ── Context ───────────────────────────────────────────────

/** React context for scene architecture state. */
export const SceneContext = createContext<SceneContextValue | null>(null);

SceneContext.displayName = 'SceneContext';

// ── Hook ──────────────────────────────────────────────────

/**
 * Access the scene context value. Must be used within a {@link SceneRoot}.
 *
 * @throws When used outside a `<SceneRoot>`.
 */
export function useSceneContext(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (ctx === null) {
    throw new Error(
      'useSceneContext must be used within a <SceneRoot>. ' +
        'Wrap the subtree in <SceneRoot> (inside <ThreeCanvas>) before ' +
        'calling useSceneContext.',
    );
  }
  return ctx;
}
