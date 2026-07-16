/**
 * Lighting Provider — Context Creation for Lighting Architecture
 *
 * Fast Refresh compliant: no JSX in this file. The context object is created
 * here; the provider component lives in lighting-root.tsx.
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { createContext, useContext } from 'react';

import type { LightingManager, LightingSnapshot } from './lighting.types';

// ── Context Value ─────────────────────────────────────────

/**
 * The value provided by {@link LightingRoot} to all lighting-consuming descendants.
 *
 * All fields are readonly — consumers read, they never mutate.
 */
export interface LightingContextValue {
  /** The singleton lighting manager. */
  readonly lightingManager: LightingManager;
  /** The current immutable lighting snapshot. */
  readonly snapshot: LightingSnapshot;
  /** Whether the lighting layer is enabled (3D enabled + lighting manager initialized). */
  readonly isEnabled: boolean;
  /** Whether reduced motion is active (mirrors ThreeContext). */
  readonly isReducedMotion: boolean;
}

// ── Context ───────────────────────────────────────────────

/** React context for lighting architecture state. */
export const LightingContext = createContext<LightingContextValue | null>(null);

LightingContext.displayName = 'LightingContext';

// ── Hook ──────────────────────────────────────────────────

/**
 * Access the lighting context value. Must be used within a {@link LightingRoot}.
 *
 * @throws When used outside a `<LightingRoot>`.
 */
export function useLightingContext(): LightingContextValue {
  const ctx = useContext(LightingContext);
  if (ctx === null) {
    throw new Error(
      'useLightingContext must be used within a <LightingRoot>. ' +
        'Wrap the subtree in <LightingRoot> (inside <SceneRoot>) before ' +
        'calling useLightingContext.',
    );
  }
  return ctx;
}
