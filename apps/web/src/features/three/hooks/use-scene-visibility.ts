/**
 * useSceneVisibility — Visibility for a Specific Scene
 *
 * Subscribes to a single scene's visibility from the scene-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { sceneManager } from '../scene-manager';
import { useSceneContext } from '../scene-provider';

import type {
  SceneVisibility,
  SceneSnapshot,
} from '../scene.types';

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
 * Access the derived visibility for a specific scene.
 *
 * Returns the visibility string ('visible' | 'hidden' | 'suspended' |
 * 'disabled' | 'offscreen'). When the scene is not registered, returns
 * `'hidden'` as the default.
 *
 * Must be used within a {@link SceneRoot}.
 *
 * @param sceneId - The unique scene identifier.
 *
 * @example
 * ```tsx
 * function HeroVisibility() {
 *   const visibility = useSceneVisibility('hero-atmosphere');
 *   return <span>{visibility === 'visible' ? 'Visible' : 'Hidden'}</span>;
 * }
 * ```
 */
export function useSceneVisibility(sceneId: string): SceneVisibility {
  /* Confirm the provider is mounted. */
  useSceneContext();

  const snapshot = useSyncExternalStore(
    subscribeScene,
    getSceneSnapshot,
    getSceneSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ visibility: SceneVisibility; snapshot: SceneSnapshot } | null>(
    null,
  );

  const visibility: SceneVisibility =
    snapshot.scenes.get(sceneId)?.visibility ?? 'hidden';

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { visibility, snapshot };
  } else if (prevRef.current.visibility !== visibility) {
    prevRef.current = { visibility, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.visibility, [visibility]);
}
