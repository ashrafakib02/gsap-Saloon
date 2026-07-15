/**
 * ThreeProvider — Lifecycle Owner and Context Source for the 3D Layer
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * Responsibilities:
 *   - Initialize + subscribe to the performance manager (capability + budgets)
 *   - Derive the active quality preset (persisted override → capability →
 *     reduced-motion downgrade)
 *   - Resolve the renderer config for the active quality
 *   - Mirror reduced motion from the theme layer (single upstream source)
 *   - Re-probe on viewport changes that cross the mobile breakpoint
 *   - Expose the memoized {@link ThreeContextValue} through context
 *   - Hold the empty future-registration slots (scenes/cameras/lights/assets)
 *
 * It renders NO canvas and NO scene — it is pure state infrastructure. The
 * {@link ThreeCanvas} consumes this context to configure R3F.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useReducedMotion } from '@/shared/hooks/ui/use-reduced-motion';
import { BREAKPOINTS } from '@/shared/tokens/breakpoints';
import { DEBOUNCE } from '@/shared/tokens/timing';

import { ThreeContext } from './three-context';
import { threePerformanceManager } from './three-performance';
import { threeEventManager } from './three-events';
import { createThreeRegistry } from './three-registry';

import {
  resolveQualitySettings,
  resolveRendererConfig,
  clampPresetDown,
  isThreeFlagEnabled,
  canRender3D as computeCanRender3D,
  readPersistedQuality,
  persistQuality,
} from './three.config';

import type {
  ThreeContextValue,
  ThreeRegistries,
  QualityPreset,
  QualitySettings,
} from './three.types';

// ── Props ──────────────────────────────────────────────────

interface ThreeProviderProps {
  readonly children: ReactNode;
}

// ── Helpers ────────────────────────────────────────────────

/**
 * Resolve the active quality settings.
 *
 * Precedence: an explicit/persisted override wins (marked `derived: false`),
 * otherwise the capability-derived preset is used. Reduced motion forces the
 * lowest preset in both cases — it is a hard floor, never overridden.
 */
function resolveActiveQuality(
  estimated: QualityPreset,
  override: QualityPreset | null,
  isReducedMotion: boolean,
): QualitySettings {
  const base = override ?? estimated;
  const preset = isReducedMotion ? clampPresetDown(base, 'minimal') : base;
  return resolveQualitySettings(preset, override === null);
}

// ── Provider ───────────────────────────────────────────────

/**
 * Provides Three infrastructure state to all descendants.
 *
 * Mount once, high in the tree (typically the app root or the section that
 * hosts 3D). Cheap when 3D is disabled — it still probes capability so
 * consumers can render an informed fallback, but mounts no WebGL context.
 */
export function ThreeProvider({ children }: ThreeProviderProps) {
  const isReducedMotion = useReducedMotion();

  // ── Performance snapshot subscription ──────────────────

  /* Initialize the manager once, synchronously, so the first snapshot is a
     real probe rather than the SSR default. */
  const [snapshot, setSnapshot] = useState(() => {
    threePerformanceManager.init();
    return threePerformanceManager.getSnapshot();
  });

  useEffect(() => {
    /* Guard against StrictMode double-invoke / prior destroy(). */
    threePerformanceManager.init();
    setSnapshot(threePerformanceManager.getSnapshot());

    const unsubscribe = threePerformanceManager.subscribe(() => {
      setSnapshot(threePerformanceManager.getSnapshot());
    });
    return unsubscribe;
  }, []);

  // ── Manual quality override ────────────────────────────

  const [override, setOverride] = useState<QualityPreset | null>(() =>
    readPersistedQuality(),
  );

  const setQualityPreset = useCallback((preset: QualityPreset | null) => {
    setOverride(preset);
    persistQuality(preset);
  }, []);

  const refreshCapabilities = useCallback(() => {
    threePerformanceManager.refresh();
  }, []);

  // ── Re-probe on breakpoint-crossing resize ─────────────

  /* Only re-probe when the viewport crosses the mobile/tablet boundary, since
     that is the signal that changes derived capability. A debounced check
     avoids re-probing on every resize frame. */
  const wasMobileRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    wasMobileRef.current = window.innerWidth < BREAKPOINTS.tablet;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleResize = (): void => {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const isMobile = window.innerWidth < BREAKPOINTS.tablet;
        if (isMobile !== wasMobileRef.current) {
          wasMobileRef.current = isMobile;
          threePerformanceManager.refresh();
        }
      }, DEBOUNCE.resize);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      if (timeout !== null) clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ── Future registration slots (stable across renders) ──

  const registries = useMemo<ThreeRegistries>(
    () => ({
      scenes: createThreeRegistry<unknown>(),
      cameras: createThreeRegistry<unknown>(),
      lights: createThreeRegistry<unknown>(),
      assets: createThreeRegistry<unknown>(),
    }),
    [],
  );

  // ── Derived state ──────────────────────────────────────

  const quality = useMemo(
    () =>
      resolveActiveQuality(
        snapshot.estimatedQuality,
        override,
        isReducedMotion,
      ),
    [snapshot.estimatedQuality, override, isReducedMotion],
  );

  const renderer = useMemo(
    () => resolveRendererConfig(quality),
    [quality],
  );

  const canRender3D = useMemo(
    () => computeCanRender3D(snapshot.capabilities),
    [snapshot.capabilities],
  );

  /* The layer is enabled when the flag is on AND the device can render.
     Reduced motion does NOT disable the layer — it downgrades quality to
     minimal — so a reduced-motion user still gets a low-cost static scene
     rather than an abrupt fallback. */
  const isEnabled = useMemo(
    () => isThreeFlagEnabled() && canRender3D,
    [canRender3D],
  );

  // ── Context value (memoized) ───────────────────────────

  const value = useMemo<ThreeContextValue>(
    () => ({
      isEnabled,
      canRender3D,
      isReducedMotion,
      quality,
      renderer,
      performance: snapshot,
      capabilities: snapshot.capabilities,
      events: threeEventManager,
      registries,
      setQualityPreset,
      refreshCapabilities,
    }),
    [
      isEnabled,
      canRender3D,
      isReducedMotion,
      quality,
      renderer,
      snapshot,
      registries,
      setQualityPreset,
      refreshCapabilities,
    ],
  );

  return <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>;
}
