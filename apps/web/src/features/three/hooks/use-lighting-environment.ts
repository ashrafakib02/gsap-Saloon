/**
 * useLightingEnvironment — Active Lighting Environment
 *
 * Subscribes to the active lighting environment from the lighting-manager snapshot.
 * Uses a selector with equality comparison to minimize re-renders.
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'react';

import { lightingManager } from '../lighting-manager';
import { useLightingContext } from '../lighting-provider';

import type { LightingEnvironment, LightingSnapshot } from '../lighting.types';

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
 * Access the currently active lighting environment.
 *
 * Returns `null` when no environment is active (default state). When an
 * environment is set via `setEnvironment` or `setActivePreset`, this hook
 * updates.
 *
 * Must be used within a {@link LightingRoot}.
 *
 * @example
 * ```tsx
 * function ActiveEnvironmentBadge() {
 *   const env = useLightingEnvironment();
 *   return <span>Environment: {env ?? 'none'}</span>;
 * }
 * ```
 */
export function useLightingEnvironment(): LightingEnvironment | null {
  /* Confirm the provider is mounted. */
  useLightingContext();

  const snapshot = useSyncExternalStore(
    subscribeLighting,
    getLightingSnapshot,
    getLightingSnapshot,
  );

  /* All hooks must be called unconditionally — no early returns between them. */
  const prevRef = useRef<{ environment: LightingEnvironment | null; snapshot: LightingSnapshot } | null>(
    null,
  );

  const environment: LightingEnvironment | null = snapshot.activeEnvironment;

  if (prevRef.current === null || prevRef.current.snapshot !== snapshot) {
    prevRef.current = { environment, snapshot };
  } else if (prevRef.current.environment !== environment) {
    prevRef.current = { environment, snapshot };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => prevRef.current!.environment, [environment]);
}
