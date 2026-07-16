/**
 * useLightingPreset — Active Preset for the Lighting System
 *
 * Subscribes to the active lighting preset ID from the lighting-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { lightingManager } from '../lighting-manager';
import { useLightingContext } from '../lighting-provider';

import type { LightingPresetId, LightingSnapshot } from '../lighting.types';

/**
 * Get the current lighting snapshot (used by `useSyncExternalStore`).
 */
function getLightingSnapshot(): LightingSnapshot {
  return lightingManager.getSnapshot();
}

/**
 * Subscribe to lighting snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeLighting(callback: () => void): () => void {
  return lightingManager.subscribe(callback);
}

/**
 * Access the currently active lighting preset ID.
 *
 * Returns `null` when no preset is active (default state). When a preset
 * is activated via `setActivePreset`, this hook updates.
 *
 * Must be used within a {@link LightingRoot}.
 *
 * @example
 * ```tsx
 * function ActivePresetBadge() {
 *   const preset = useLightingPreset();
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useLightingPreset(): LightingPresetId | null {
  /* Confirm the provider is mounted. */
  useLightingContext();

  const snapshot = useSyncExternalStore(
    subscribeLighting,
    getLightingSnapshot,
    getLightingSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ presetId: LightingPresetId | null; snapshot: LightingSnapshot } | null>(
    null,
  );

  const presetId: LightingPresetId | null = snapshot.activePresetId;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { presetId, snapshot };
  } else if (prevRef.current.presetId !== presetId) {
    prevRef.current = { presetId, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.presetId, [presetId]);
}
