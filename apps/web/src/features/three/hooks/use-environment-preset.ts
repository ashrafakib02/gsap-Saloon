/**
 * useEnvironmentPreset — Active Preset for the Environment System
 *
 * Subscribes to the active environment preset ID from the environment-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { environmentManager } from '../environment-manager';
import { useEnvironmentContext } from '../environment-provider';

import type { EnvironmentPresetId, EnvironmentSnapshot } from '../environment.types';

/**
 * Get the current environment snapshot (used by `useSyncExternalStore`).
 */
function getEnvironmentSnapshot(): EnvironmentSnapshot {
  return environmentManager.getSnapshot();
}

/**
 * Subscribe to environment snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeEnvironment(callback: () => void): () => void {
  return environmentManager.subscribe(callback);
}

/**
 * Access the currently active environment preset ID.
 *
 * Returns `null` when no preset is active (default state). When a preset
 * is activated via `setActivePreset`, this hook updates.
 *
 * Must be used within an {@link EnvironmentRoot}.
 *
 * @example
 * ```tsx
 * function ActivePresetBadge() {
 *   const preset = useEnvironmentPreset();
 *   return <span>Active: {preset ?? 'none'}</span>;
 * }
 * ```
 */
export function useEnvironmentPreset(): EnvironmentPresetId | null {
  /* Confirm the provider is mounted. */
  useEnvironmentContext();

  const snapshot = useSyncExternalStore(
    subscribeEnvironment,
    getEnvironmentSnapshot,
    getEnvironmentSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ presetId: EnvironmentPresetId | null; snapshot: EnvironmentSnapshot } | null>(
    null,
  );

  const presetId: EnvironmentPresetId | null = snapshot.activePresetId;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { presetId, snapshot };
  } else if (prevRef.current.presetId !== presetId) {
    prevRef.current = { presetId, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.presetId, [presetId]);
}
