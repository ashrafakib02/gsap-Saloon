/**
 * useMaterialState — Full Material State Snapshot
 *
 * Provides access to the complete material state including quality profile,
 * constraints, active preset, and reduced-motion state.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { materialsManager } from '../materials-manager';
import { useMaterialsContext } from '../materials-provider';

import type { MaterialSnapshot } from '../materials.types';

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
 * The complete material state for rendering and debugging.
 */
export interface MaterialStateReturn {
  /** The currently active preset ID. */
  readonly activePresetId: MaterialSnapshot['activePresetId'];
  /** Quality-adapted material settings. */
  readonly qualityProfile: MaterialSnapshot['qualityProfile'];
  /** Material constraints. */
  readonly constraints: MaterialSnapshot['constraints'];
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
 * Access the complete material state.
 *
 * Returns a derived object with active preset, quality profile, constraints,
 * reduced-motion state, and registry counts. Useful for components that need
 * to configure materials or debug overlays.
 *
 * Must be used within a {@link MaterialsRoot}.
 *
 * @example
 * ```tsx
 * function MaterialDebug() {
 *   const state = useMaterialState();
 *   return (
 *     <div>
 *       <p>Active: {state.activePresetId ?? 'none'}</p>
 *       <p>Presets: {state.presetCount}</p>
 *       <p>Max Texture: {state.qualityProfile.maxTextureSize}px</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMaterialState(): MaterialStateReturn {
  /* Confirm the provider is mounted. */
  useMaterialsContext();

  const snapshot = useSyncExternalStore(
    subscribeMaterials,
    getMaterialsSnapshot,
    getMaterialsSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ state: MaterialStateReturn; snapshot: MaterialSnapshot } | null>(
    null,
  );

  const state: MaterialStateReturn = {
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
