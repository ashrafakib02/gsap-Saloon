/**
 * useScrollTriggers — Main ScrollTrigger Hook
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "Scroll-Linked, Not Time-Linked. The visitor controls the speed."
 *
 * Primary hook for the ScrollTrigger management system.
 * Provides access to the registry, lifecycle management,
 * refresh batching, and debug information.
 *
 * Integrates with the existing GSAP infrastructure —
 * no duplicate initialization or plugin registration.
 *
 * Phase 5.4: Infrastructure hook — no animation logic.
 *
 * @example
 * ```tsx
 * function MySection() {
 *   const { register, kill, refresh, isDebugMode } = useScrollTriggers();
 *
 *   useEffect(() => {
 *     const trigger = register({
 *       id: 'my-section-reveal',
 *       group: 'section-reveal',
 *       trigger: '.my-section',
 *       start: 'top 80%',
 *       onEnter: () => console.log('section visible'),
 *     });
 *
 *     return () => trigger?.kill();
 *   }, [register]);
 *
 *   return <section className="my-section">...</section>;
 * }
 * ```
 */

import { useCallback, useMemo } from 'react';

import {
  registerScrollTrigger,
  killTrigger,
  disableTrigger,
  enableTrigger,
  pauseTrigger,
  resumeTrigger,
  killAll,
  refresh,
  refreshBatched,
  getRefreshCount,
  getLastRefreshAt,
  updateBreakpoint,
  getCurrentBreakpoint,
  handleReducedMotionChange,
  isReducedMotionActive,
  getRegistry,
  getDebugInfo,
  setDebugMode,
  logDebugInfo,
  isInitialized,
  getConfig,
  getAllTriggerIds,
  getActiveTriggerIds,
  getTriggerCount,
  getActiveCount,
  isTriggerActive,
} from '../scrolltrigger-manager';

import type { TriggerOptions } from '../scrolltrigger.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollTriggers.
 *
 * Provides the complete ScrollTrigger management API.
 */
export interface UseScrollTriggersReturn {
  /** Register a new ScrollTrigger */
  readonly register: (options: TriggerOptions) => ReturnType<typeof registerScrollTrigger>;
  /** Kill a specific trigger by ID */
  readonly kill: (id: string) => void;
  /** Kill all registered triggers */
  readonly killAll: () => void;
  /** Disable a trigger (retains definition for re-enable) */
  readonly disable: (id: string) => void;
  /** Re-enable a disabled trigger */
  readonly enable: (id: string) => ReturnType<typeof enableTrigger>;
  /** Pause a trigger (stops responding to scroll) */
  readonly pause: (id: string) => void;
  /** Resume a paused trigger */
  readonly resume: (id: string) => void;
  /** Refresh all triggers (debounced) */
  readonly refresh: (immediate?: boolean) => void;
  /** Batched refresh — coalesces refresh requests */
  readonly refreshBatched: (priority?: TriggerOptions['priority']) => void;
  /** Update the current breakpoint */
  readonly updateBreakpoint: (breakpoint: TriggerOptions['breakpoint']) => void;
  /** Handle reduced-motion preference changes */
  readonly handleReducedMotionChange: (isActive: boolean) => void;
  /** The complete trigger registry */
  readonly registry: ReturnType<typeof getRegistry>;
  /** Debug information (null when debug mode is off) */
  readonly debugInfo: ReturnType<typeof getDebugInfo> | null;
  /** Whether debug mode is enabled */
  readonly isDebugMode: boolean;
  /** Toggle debug mode */
  readonly setDebugMode: (enabled: boolean) => void;
  /** Log debug information to console */
  readonly logDebug: () => void;
  /** Whether the manager is initialized */
  readonly isInitialized: boolean;
  /** All registered trigger IDs */
  readonly triggerIds: readonly string[];
  /** All active trigger IDs */
  readonly activeTriggerIds: readonly string[];
  /** Total registered trigger count */
  readonly triggerCount: number;
  /** Active trigger count */
  readonly activeCount: number;
  /** Whether a specific trigger is active */
  readonly isActive: (id: string) => boolean;
  /** Current refresh count */
  readonly refreshCount: number;
  /** Timestamp of last refresh */
  readonly lastRefreshAt: number;
  /** Current breakpoint */
  readonly currentBreakpoint: string;
  /** Whether reduced motion is active */
  readonly reducedMotionActive: boolean;
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Main hook for the ScrollTrigger management system.
 *
 * Provides the complete API for creating, managing, and
 * querying ScrollTrigger instances. Integrates with the
 * existing GSAP infrastructure without duplicating any
 * initialization or plugin registration.
 *
 * This hook is pure state access — no side effects on mount.
 * Components are responsible for registering their own triggers
 * via the returned `register` function.
 *
 * From DESIGN_SYSTEM §10:
 * "A new developer must understand why every folder exists."
 *   → Every method is documented and typed.
 *
 * @returns Complete ScrollTrigger management API
 */
export function useScrollTriggers(): UseScrollTriggersReturn {
  const registry = useMemo(() => getRegistry(), []);

  const debugInfo = useMemo(() => {
    if (!getConfig().debugEnabled) return null;
    return getDebugInfo();
  }, []);

  const register = useCallback(
    (options: TriggerOptions) => registerScrollTrigger(options),
    [],
  );

  const kill = useCallback((id: string) => {
    killTrigger(id);
  }, []);

  const killAllFn = useCallback(() => {
    killAll();
  }, []);

  const disable = useCallback((id: string) => {
    disableTrigger(id);
  }, []);

  const enable = useCallback((id: string) => {
    return enableTrigger(id);
  }, []);

  const pause = useCallback((id: string) => {
    pauseTrigger(id);
  }, []);

  const resume = useCallback((id: string) => {
    resumeTrigger(id);
  }, []);

  const refreshFn = useCallback((immediate?: boolean) => {
    refresh(immediate);
  }, []);

  const refreshBatchedFn = useCallback(
    (priority?: TriggerOptions['priority']) => {
      refreshBatched(priority);
    },
    [],
  );

  const updateBreakpointFn = useCallback(
    (breakpoint: TriggerOptions['breakpoint']) => {
      if (breakpoint) {
        updateBreakpoint(breakpoint);
      }
    },
    [],
  );

  const handleReducedMotionChangeFn = useCallback((isActive: boolean) => {
    handleReducedMotionChange(isActive);
  }, []);

  const setDebugModeFn = useCallback((enabled: boolean) => {
    setDebugMode(enabled);
  }, []);

  const logDebugFn = useCallback(() => {
    logDebugInfo();
  }, []);

  const isActive = useCallback((id: string) => {
    return isTriggerActive(id);
  }, []);

  return useMemo(
    () => ({
      register,
      kill,
      killAll: killAllFn,
      disable,
      enable,
      pause,
      resume,
      refresh: refreshFn,
      refreshBatched: refreshBatchedFn,
      updateBreakpoint: updateBreakpointFn,
      handleReducedMotionChange: handleReducedMotionChangeFn,
      registry,
      debugInfo,
      isDebugMode: getConfig().debugEnabled,
      setDebugMode: setDebugModeFn,
      logDebug: logDebugFn,
      isInitialized: isInitialized(),
      triggerIds: getAllTriggerIds(),
      activeTriggerIds: getActiveTriggerIds(),
      triggerCount: getTriggerCount(),
      activeCount: getActiveCount(),
      isActive,
      refreshCount: getRefreshCount(),
      lastRefreshAt: getLastRefreshAt(),
      currentBreakpoint: getCurrentBreakpoint(),
      reducedMotionActive: isReducedMotionActive(),
    }),
    [
      register,
      kill,
      killAllFn,
      disable,
      enable,
      pause,
      resume,
      refreshFn,
      refreshBatchedFn,
      updateBreakpointFn,
      handleReducedMotionChangeFn,
      registry,
      debugInfo,
      setDebugModeFn,
      logDebugFn,
      isActive,
    ],
  );
}
