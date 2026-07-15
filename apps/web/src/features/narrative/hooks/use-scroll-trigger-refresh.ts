/**
 * useScrollTriggerRefresh — Refresh Batching Hook
 *
 * Provides refresh batching capabilities for ScrollTrigger
 * instances. Coalesces multiple refresh requests into a
 * single debounced refresh call.
 *
 * Useful for components that trigger DOM changes (image loads,
 * dynamic content) and need to notify ScrollTrigger about
 * updated positions.
 *
 * Phase 5.4: Infrastructure hook — no animation logic.
 *
 * @example
 * ```tsx
 * function LazyImage({ src, alt }) {
 *   const { refresh } = useScrollTriggerRefresh();
 *
 *   return (
 *     <img
 *       src={src}
 *       alt={alt}
 *       onLoad={() => refresh()}
 *     />
 *   );
 * }
 * ```
 */

import { useCallback, useEffect, useRef } from 'react';

import { refresh, refreshBatched } from '../scrolltrigger-manager';

import type { TriggerPriority } from '../scrolltrigger.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Options for useScrollTriggerRefresh.
 */
export interface ScrollTriggerRefreshOptions {
  /** Debounce interval in ms (default: 150) */
  readonly debounceMs?: number;
  /** Priority filter for batched refresh */
  readonly priority?: TriggerPriority;
  /** Whether to auto-refresh on mount */
  readonly refreshOnMount?: boolean;
}

/**
 * Return type for useScrollTriggerRefresh.
 */
export interface UseScrollTriggerRefreshReturn {
  /** Trigger a debounced refresh */
  readonly refresh: () => void;
  /** Trigger an immediate refresh (no debounce) */
  readonly refreshImmediate: () => void;
  /** Trigger a batched refresh filtered by priority */
  readonly refreshBatched: (priority?: TriggerPriority) => void;
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Provides debounced and batched ScrollTrigger refresh capabilities.
 *
 * Coalesces rapid refresh requests (e.g., multiple images loading
 * simultaneously) into a single debounced refresh call. This prevents
 * ScrollTrigger from recalculating positions on every individual
 * DOM mutation.
 *
 * The hook cleans up the debounce timer on unmount to prevent
 * memory leaks.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Debounced scroll handlers at 16ms (one frame)."
 *   → We use a longer debounce (150ms) for refresh to batch
 *     multiple DOM changes.
 *
 * @param options - Refresh configuration
 * @returns Refresh API
 */
export function useScrollTriggerRefresh(
  options?: ScrollTriggerRefreshOptions,
): UseScrollTriggerRefreshReturn {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const debounceMs = options?.debounceMs ?? 150;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Clean up debounce timer on unmount */
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const refreshFn = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      refresh();
      timerRef.current = null;
    }, debounceMs);
  }, [debounceMs]);

  const refreshImmediate = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    refresh(true);
  }, []);

  const refreshBatchedFn = useCallback(
    (priority?: TriggerPriority) => {
      refreshBatched(priority ?? optionsRef.current?.priority);
    },
    [],
  );

  /* Optional refresh on mount */
  useEffect(() => {
    if (options?.refreshOnMount) {
      refresh(true);
    }
  }, [options?.refreshOnMount]);

  return {
    refresh: refreshFn,
    refreshImmediate,
    refreshBatched: refreshBatchedFn,
  };
}
