/**
 * useScene — Primary Public API for Scene State
 *
 * Subscribes to the {@link sceneManager} singleton via `useSyncExternalStore`
 * for the most efficient React 18 integration. Consumers re-render only when
 * the snapshot changes.
 *
 * Supports a selector overload identical to {@link useThreePerformance} for
 * derived slice access with equality comparison.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { sceneManager } from '../scene-manager';
import { useSceneContext } from '../scene-provider';

import type {
  SceneSnapshot,
  SceneSelector,
  SceneEquality,
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
 * Access the full scene snapshot.
 *
 * Must be used within a {@link SceneRoot}. The root confirms the
 * manager is initialized; this hook subscribes directly for efficiency.
 *
 * @example
 * ```tsx
 * function SceneOverview() {
 *   const snapshot = useScene();
 *   return <span>Scenes: {snapshot.scenes.size}</span>;
 * }
 * ```
 */
export function useScene(): SceneSnapshot;

/**
 * Access a derived slice of the scene snapshot.
 *
 * @param selector  - A pure function that extracts a slice from the snapshot.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function ActiveScenes() {
 *   const ids = useScene((s) => s.activeSceneIds);
 *   return <span>{ids.length} active</span>;
 * }
 * ```
 */
export function useScene<T>(
  selector: SceneSelector<T>,
  equalityFn?: SceneEquality<T>,
): T;

export function useScene<T>(
  selector?: SceneSelector<T>,
  equalityFn?: SceneEquality<T>,
): SceneSnapshot | T {
  /* Confirm the provider is mounted (throws outside it). */
  useSceneContext();

  const snapshot = useSyncExternalStore(
    subscribeScene,
    getSceneSnapshot,
    getSceneSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ selected: T; snapshot: SceneSnapshot } | null>(
    null,
  );

  const selected = selector
    ? selector(snapshot)
    : (snapshot as T);

  const eq = equalityFn ?? (Object as { is: (a: unknown, b: unknown) => boolean }).is;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { selected, snapshot };
  } else if (!eq(prevRef.current.selected, selected)) {
    prevRef.current = { selected, snapshot };
  }

  /* Memoize to avoid returning a new object reference when the selected
     value is structurally equal. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.selected, [selected]);
}
