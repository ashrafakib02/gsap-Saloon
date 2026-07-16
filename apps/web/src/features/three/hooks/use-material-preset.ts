/**
 * useMaterialPreset — Active Preset for the Materials System
 *
 * Subscribes to the active material preset ID from the materials-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { materialsManager } from '../materials-manager';
import { useMaterialsContext } from '../materials-provider';

import type { MaterialPresetId, MaterialSnapshot } from '../materials.types';

/**
 * Get the current material snapshot (used by `useSyncExternalStore`).
 */
function getMaterialsSnapshot(): MaterialSnapshot {
  return materialsManager.getSnapshot();
}

/**
 * Subscribe to material snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeMaterials(callback: () => void): () => void {
  return materialsManager.subscribe(callback);
}

/**
 * Access the currently active material preset ID.
 *
 * Returns `null` when no preset is active (default state). When a preset
 * is activated via `setActivePreset`, this hook updates.
 *
 * Must be used within a {@link MaterialsRoot}.
 *
 * @example
 * ```tsx
 * function ActivePresetBadge() {
 *   const preset = useMaterialPreset();
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useMaterialPreset(): MaterialPresetId | null {
  /* Confirm the provider is mounted. */
  useMaterialsContext();

  const snapshot = useSyncExternalStore(
    subscribeMaterials,
    getMaterialsSnapshot,
    getMaterialsSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ presetId: MaterialPresetId | null; snapshot: MaterialSnapshot } | null>(
    null,
  );

  const presetId: MaterialPresetId | null = snapshot.activePresetId;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { presetId, snapshot };
  } else if (prevRef.current.presetId !== presetId) {
    prevRef.current = { presetId, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.presetId, [presetId]);
}
