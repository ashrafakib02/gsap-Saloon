/**
 * useScrollTriggerRegistry — Registry Access Hook
 *
 * Lightweight read-only hook for querying the ScrollTrigger
 * registry without importing the full management API.
 *
 * Use this hook when a component only needs to READ trigger
 * state — e.g., checking if a trigger is active, querying
 * triggers by group, or counting triggers.
 *
 * For creating/managing triggers, use {@link useScrollTriggers}.
 *
 * Phase 5.4: Infrastructure hook — no animation logic.
 *
 * @example
 * ```tsx
 * function DebugPanel() {
 *   const { active, count, hasActive } = useScrollTriggerRegistry();
 *
 *   return (
 *     <div>
 *       <p>{count()} triggers registered</p>
 *       <p>{active().length} currently active</p>
 *       <p>{hasActive() ? 'System active' : 'No active triggers'}</p>
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo, useCallback } from 'react';

import { getRegistry } from '../scrolltrigger-manager';

import type {
  TriggerGroup,
  TriggerPriority,
  TriggerBreakpoint,
  TriggerLifecycleState,
} from '../scrolltrigger.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollTriggerRegistry.
 */
export interface UseScrollTriggerRegistryReturn {
  /** Get a trigger state by ID */
  readonly get: (id: string) => ReturnType<ReturnType<typeof getRegistry>['get']>;
  /** Get all registered trigger IDs */
  readonly all: () => readonly string[];
  /** Get all active trigger IDs */
  readonly active: () => readonly string[];
  /** Get all destroyed trigger IDs */
  readonly destroyed: () => readonly string[];
  /** Get trigger IDs by group */
  readonly byGroup: (group: TriggerGroup) => readonly string[];
  /** Get trigger IDs by priority */
  readonly byPriority: (priority: TriggerPriority) => readonly string[];
  /** Get trigger IDs by state */
  readonly byState: (state: TriggerLifecycleState) => readonly string[];
  /** Get trigger IDs by breakpoint */
  readonly byBreakpoint: (breakpoint: TriggerBreakpoint) => readonly string[];
  /** Get count of triggers in a given state */
  readonly countByState: (state: TriggerLifecycleState) => number;
  /** Total registered trigger count */
  readonly count: () => number;
  /** Check if a trigger is registered */
  readonly has: (id: string) => boolean;
  /** Check if any triggers are active */
  readonly hasActive: () => boolean;
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Lightweight read-only hook for querying the ScrollTrigger registry.
 *
 * Returns stable function references via useCallback to prevent
 * unnecessary re-renders in consuming components.
 *
 * From DESIGN_SYSTEM §10:
 * "Context values memoized with useMemo to prevent
 *  unnecessary consumer re-renders."
 *
 * @returns Registry query API
 */
export function useScrollTriggerRegistry(): UseScrollTriggerRegistryReturn {
  const registry = useMemo(() => getRegistry(), []);

  const get = useCallback(
    (id: string) => registry.get(id),
    [registry],
  );

  const all = useCallback(
    () => registry.getAll(),
    [registry],
  );

  const active = useCallback(
    () => registry.getActive(),
    [registry],
  );

  const destroyed = useCallback(
    () => registry.getDestroyed(),
    [registry],
  );

  const byGroup = useCallback(
    (group: TriggerGroup) => registry.getByGroup(group),
    [registry],
  );

  const byPriority = useCallback(
    (priority: TriggerPriority) => registry.getByPriority(priority),
    [registry],
  );

  const byState = useCallback(
    (state: TriggerLifecycleState) => registry.getByState(state),
    [registry],
  );

  const byBreakpoint = useCallback(
    (breakpoint: TriggerBreakpoint) => registry.getByBreakpoint(breakpoint),
    [registry],
  );

  const countByState = useCallback(
    (state: TriggerLifecycleState) => registry.countByState(state),
    [registry],
  );

  const count = useCallback(
    () => registry.count(),
    [registry],
  );

  const has = useCallback(
    (id: string) => registry.has(id),
    [registry],
  );

  const hasActive = useCallback(
    () => registry.hasActive(),
    [registry],
  );

  return useMemo(
    () => ({
      get,
      all,
      active,
      destroyed,
      byGroup,
      byPriority,
      byState,
      byBreakpoint,
      countByState,
      count,
      has,
      hasActive,
    }),
    [
      get,
      all,
      active,
      destroyed,
      byGroup,
      byPriority,
      byState,
      byBreakpoint,
      countByState,
      count,
      has,
      hasActive,
    ],
  );
}
