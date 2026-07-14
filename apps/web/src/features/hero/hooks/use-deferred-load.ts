/**
 * useDeferredLoad — Deferred Component Loading Hook
 *
 * From DESIGN_SYSTEM §Performance:
 * "Load what the visitor needs, when they need it."
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Non-critical components load after the hero is revealed.
 *  requestIdleCallback with setTimeout fallback."
 *
 * This hook defers loading of non-critical components until:
 * 1. The browser is idle (requestIdleCallback), OR
 * 2. A timeout has elapsed (fallback for browsers without rIC)
 *
 * Use cases:
 * - 3D scene mounting (Hero3DMount) — only after hero revealed
 * - Below-fold section prefetching
 * - Non-critical script loading
 *
 * Architecture:
 * - Uses requestIdleCallback with setTimeout fallback
 * - AbortController for cleanup on unmount
 * - SSR-safe (no-op on server)
 * - Returns a boolean that transitions from false → true
 *
 * From ARCHITECTURE_DECISIONS:
 * "3D is lazy-loaded — only mount when conditions are met."
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_LAZY } from '../hero-perf.config';

// ── Types ──────────────────────────────────────────────────

interface UseDeferredLoadOptions {
  /** Whether to enable deferred loading (false = skip deferral) */
  enabled?: boolean;
  /** Delay before fallback loading (ms) — overrides rIC timeout */
  fallbackDelay?: number;
  /** Whether the element is in viewport (triggers immediate load) */
  inViewport?: boolean;
}

interface UseDeferredLoadReturn {
  /** Whether the deferred content should be loaded */
  shouldLoad: boolean;
  /** Manually trigger loading (bypass deferral) */
  triggerLoad: () => void;
}

// ── Hook ──────────────────────────────────────────────────

/**
 * Defers loading of non-critical components until browser is idle.
 *
 * The hook follows this priority:
 * 1. If `enabled` is false, never load (component is disabled)
 * 2. If `inViewport` is true, load immediately (no deferral)
 * 3. If requestIdleCallback is available, use it with fallback timeout
 * 4. If requestIdleCallback is not available, use setTimeout fallback
 *
 * From DESIGN_SYSTEM §Performance:
 * "The hero reveals instantly. Everything else can wait."
 *
 * @example
 * ```tsx
 * const { shouldLoad } = useDeferredLoad({
 *   enabled: is3DEnabled,
 *   inViewport: true, // Hero is always in viewport
 * });
 *
 * return shouldLoad ? <Heavy3DScene /> : null;
 * ```
 */
export function useDeferredLoad({
  enabled = true,
  fallbackDelay = HERO_LAZY.deferredScriptDelay,
  inViewport = false,
}: UseDeferredLoadOptions = {}): UseDeferredLoadReturn {
  const [shouldLoad, setShouldLoad] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const triggerLoad = useCallback(() => {
    setShouldLoad(true);
  }, []);

  useEffect(() => {
    /* If disabled, never load */
    if (!enabled) {
      setShouldLoad(false);
      return;
    }

    /* If already loading, don't re-trigger */
    if (shouldLoad) return;

    /* If in viewport, load immediately — no deferral needed */
    if (inViewport) {
      setShouldLoad(true);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const onLoad = () => {
      if (signal.aborted) return;
      setShouldLoad(true);
    };

    /* Use requestIdleCallback if available, with setTimeout fallback */
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const ricId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback(onLoad, {
        timeout: fallbackDelay,
      });

      /* Cleanup rIC if unmounted before it fires */
      signal.addEventListener('abort', () => {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(ricId);
      });
    } else {
      /* Fallback: setTimeout for browsers without rIC */
      fallbackTimer = setTimeout(onLoad, fallbackDelay);
    }

    return () => {
      controller.abort();
      if (fallbackTimer !== null) {
        clearTimeout(fallbackTimer);
      }
    };
  }, [enabled, inViewport, fallbackDelay, shouldLoad]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { shouldLoad, triggerLoad };
}
