/**
 * useSceneSlot — Slot State for a Specific Slot
 *
 * Subscribes to a single slot's state from the scene-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { sceneManager } from '../scene-manager';
import { useSceneContext } from '../scene-provider';

import type {
  SceneSlotId,
  SceneSlotState,
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
 * Access the runtime state for a specific slot.
 *
 * Returns `undefined` when the slot is not registered (should not happen
 * after scene-manager init, which registers all 9 default slots).
 *
 * Must be used within a {@link SceneRoot}.
 *
 * @param slotId - The slot identifier.
 *
 * @example
 * ```tsx
 * function CameraSlotStatus() {
 *   const slot = useSceneSlot('camera');
 *   return <span>{slot?.enabled ? 'Ready' : 'Disabled'}</span>;
 * }
 * ```
 */
export function useSceneSlot(slotId: SceneSlotId): SceneSlotState | undefined {
  /* Confirm the provider is mounted. */
  useSceneContext();

  const snapshot = useSyncExternalStore(
    subscribeScene,
    getSceneSnapshot,
    getSceneSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ state: SceneSlotState | undefined; snapshot: SceneSnapshot } | null>(
    null,
  );

  const state = snapshot.slots.get(slotId);

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { state, snapshot };
  } else if (prevRef.current.state !== state) {
    prevRef.current = { state, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.state, [state]);
}
