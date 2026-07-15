/**
 * useSceneStage — Stage for a Specific Scene
 *
 * Subscribes to a single scene's stage from the scene-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { sceneManager } from '../scene-manager';
import { useSceneContext } from '../scene-provider';

import type { SceneStage, SceneSnapshot } from '../scene.types';

/**
 * Get the current scene snapshot (used by `useSyncExternalStore`).
 */
function getSceneSnapshot(): SceneSnapshot {
  return sceneManager.getSnapshot();
}

/**
 * Subscribe to scene snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeScene(callback: () => void): () => void {
  return sceneManager.subscribe(callback);
}

/**
 * Access the lifecycle stage for a specific scene.
 *
 * Returns the stage string ('boot' | 'loading' | 'ready' | 'active' |
 * 'paused' | 'hidden' | 'disposed'). When the scene is not registered,
 * returns `'boot'` as the default.
 *
 * Must be used within a {@link SceneRoot}.
 *
 * @param sceneId - The unique scene identifier.
 *
 * @example
 * ```tsx
 * function HeroSceneStatus() {
 *   const stage = useSceneStage('hero-atmosphere');
 *   return <span>Stage: {stage}</span>;
 * }
 * ```
 */
export function useSceneStage(sceneId: string): SceneStage {
  /* Confirm the provider is mounted. */
  useSceneContext();

  const snapshot = useSyncExternalStore(
    subscribeScene,
    getSceneSnapshot,
    getSceneSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ stage: SceneStage; snapshot: SceneSnapshot } | null>(
    null,
  );

  const stage: SceneStage = snapshot.stages.get(sceneId) ?? 'boot';

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { stage, snapshot };
  } else if (prevRef.current.stage !== stage) {
    prevRef.current = { stage, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.stage, [stage]);
}
