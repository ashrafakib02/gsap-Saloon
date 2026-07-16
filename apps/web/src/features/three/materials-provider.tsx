/**
 * Materials Provider — Context Creation for Materials Architecture
 *
 * Fast Refresh compliant: no JSX in this file. The context object is created
 * here; the provider component lives in materials-root.tsx.
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import { createContext, useContext } from 'react';

import type { MaterialsManager, MaterialSnapshot } from './materials.types';

// ── Context Value ─────────────────────────────────────────

/**
 * The value provided by {@link MaterialsRoot} to all material-consuming descendants.
 *
 * All fields are readonly — consumers read, they never mutate.
 */
export interface MaterialsContextValue {
  /** The singleton materials manager. */
  readonly materialsManager: MaterialsManager;
  /** The current immutable material snapshot. */
  readonly snapshot: MaterialSnapshot;
  /** Whether the materials layer is enabled (3D enabled + materials manager initialized). */
  readonly isEnabled: boolean;
  /** Whether reduced motion is active (mirrors ThreeContext). */
  readonly isReducedMotion: boolean;
}

// ── Context ───────────────────────────────────────────────

/** React context for materials architecture state. */
export const MaterialsContext = createContext<MaterialsContextValue | null>(null);

MaterialsContext.displayName = 'MaterialsContext';

// ── Hook ──────────────────────────────────────────────────

/**
 * Access the materials context value. Must be used within a {@link MaterialsRoot}.
 *
 * @throws When used outside a `<MaterialsRoot>`.
 */
export function useMaterialsContext(): MaterialsContextValue {
  const ctx = useContext(MaterialsContext);
  if (ctx === null) {
    throw new Error(
      'useMaterialsContext must be used within a <MaterialsRoot>. ' +
        'Wrap the subtree in <MaterialsRoot> (inside <SceneRoot>) before ' +
        'calling useMaterialsContext.',
    );
  }
  return ctx;
}
