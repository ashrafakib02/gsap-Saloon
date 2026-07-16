/**
 * Environment Provider — Context Creation for Environment Architecture
 *
 * Fast Refresh compliant: no JSX in this file. The context object is created
 * here; the provider component lives in environment-root.tsx.
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { createContext, useContext } from 'react';

import type { EnvironmentManager, EnvironmentSnapshot } from './environment.types';

// ── Context Value ──────────────────────────────────────────

/**
 * The value provided by {@link EnvironmentRoot} to all environment-consuming descendants.
 *
 * All fields are readonly — consumers read, they never mutate.
 */
export interface EnvironmentContextValue {
  /** The singleton environment manager. */
  readonly environmentManager: EnvironmentManager;
  /** The current immutable environment snapshot. */
  readonly snapshot: EnvironmentSnapshot;
  /** Whether the environment layer is enabled (3D enabled + environment manager initialized). */
  readonly isEnabled: boolean;
  /** Whether reduced motion is active (mirrors ThreeContext). */
  readonly isReducedMotion: boolean;
}

// ── Context ────────────────────────────────────────────────

/** React context for environment architecture state. */
export const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

EnvironmentContext.displayName = 'EnvironmentContext';

// ── Hook ───────────────────────────────────────────────────

/**
 * Access the environment context value. Must be used within a {@link EnvironmentRoot}.
 *
 * @throws When used outside an `<EnvironmentRoot>`.
 */
export function useEnvironmentContext(): EnvironmentContextValue {
  const ctx = useContext(EnvironmentContext);
  if (ctx === null) {
    throw new Error(
      'useEnvironmentContext must be used within an <EnvironmentRoot>. ' +
        'Wrap the subtree in <EnvironmentRoot> (inside <SceneRoot>) before ' +
        'calling useEnvironmentContext.',
    );
  }
  return ctx;
}
