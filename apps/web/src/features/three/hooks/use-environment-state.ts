/**
 * useEnvironmentState — Full Environment State Snapshot
 *
 * Provides access to the complete environment state including quality profile,
 * constraints, active preset, and reduced-motion state.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { environmentManager } from '../environment-manager';
import { useEnvironmentContext } from '../environment-provider';

import type { EnvironmentSnapshot } from '../environment.types';

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
 * The complete environment state for rendering and debugging.
 */
export interface EnvironmentStateReturn {
  /** The currently active preset ID. */
  readonly activePresetId: EnvironmentSnapshot['activePresetId'];
  /** Quality-adapted environment settings. */
  readonly qualityProfile: EnvironmentSnapshot['qualityProfile'];
  /** Environment constraints. */
  readonly constraints: EnvironmentSnapshot['constraints'];
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
  /** Total registered preset count. */
  readonly presetCount: number;
  /** Total registered category count. */
  readonly categoryCount: number;
  /** Total registered group count. */
  readonly groupCount: number;
}

/**
 * Access the complete environment state.
 *
 * Returns a derived object with active preset, quality profile, constraints,
 * reduced-motion state, and registry counts. Useful for components that need
 * to configure environments or debug overlays.
 *
 * Must be used within an {@link EnvironmentRoot}.
 *
 * @example
 * ```tsx
 * function EnvironmentDebug() {
 *   const state = useEnvironmentState();
 *   return (
 *     <div>
 *       <p>Active: {state.activePresetId ?? 'none'}</p>
 *       <p>Presets: {state.presetCount}</p>
 *       <p>HDR Resolution: {state.qualityProfile.maxHDRResolution}px</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useEnvironmentState(): EnvironmentStateReturn {
  /* Confirm the provider is mounted. */
  useEnvironmentContext();

  const snapshot = useSyncExternalStore(
    subscribeEnvironment,
    getEnvironmentSnapshot,
    getEnvironmentSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ state: EnvironmentStateReturn; snapshot: EnvironmentSnapshot } | null>(
    null,
  );

  const state: EnvironmentStateReturn = {
    activePresetId: snapshot.activePresetId,
    qualityProfile: snapshot.qualityProfile,
    constraints: snapshot.constraints,
    isReducedMotion: snapshot.isReducedMotion,
    presetCount: snapshot.presetCount,
    categoryCount: snapshot.categoryCount,
    groupCount: snapshot.groupCount,
  };

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { state, snapshot };
  } else if (
    prevRef.current.state.activePresetId !== state.activePresetId ||
    prevRef.current.state.presetCount !== state.presetCount ||
    prevRef.current.state.isReducedMotion !== state.isReducedMotion
  ) {
    prevRef.current = { state, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.state, [state]);
}
