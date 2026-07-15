/**
 * ThreeCanvas — Reusable R3F Canvas Wrapper
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The Canvas resolves renderer config, DPR, frameloop, and event source
 *  from context and props — callers never pass raw GL parameters."
 *
 * This is the single mounting point for any React Three Fiber scene. It:
 *   - Reads renderer config from the Three context (via hooks)
 *   - Applies GL attributes, adaptive DPR, and frameloop declaratively
 *   - Wraps the Canvas in an error boundary and a Suspense boundary
 *   - Gates rendering behind feature flag, WebGL capability, and reduced
 *     motion — falling back to the provided fallback content
 *   - Marks the wrapper as aria-hidden (decorative) with pointer-events: none
 *   - Prevents R3F from listening to scroll for resize (Lenis handles scroll)
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only. Renders an empty
 * scene. Later phases add children (scenes, cameras, lights).
 *
 * @module features/three/three-canvas
 */

import { Suspense, memo, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';

import { useThree } from './hooks/use-three';
import { useThreeRenderer } from './hooks/use-three-renderer';
import { useThreeQuality } from './hooks/use-three-quality';
import { ThreeErrorBoundary } from './three-error-boundary';

import type { ThreeCanvasProps } from './three.types';

// ── Component ────────────────────────────────────────────

/**
 * Reusable R3F Canvas wrapper with context-driven configuration.
 *
 * All rendering parameters come from the Three context (resolved by the
 * active quality preset). Callers can override `frameloop` and `dpr` via
 * props for per-instance tuning.
 *
 * When 3D is disabled (feature flag off, no WebGL, reduced motion, or
 * `forceFallback`), the Canvas is not mounted at all — only the fallback
 * renders. This saves GPU resources and avoids creating a WebGL context
 * that will never be used.
 *
 * @example
 * ```tsx
 * <ThreeCanvas
 *   ariaLabel="Atmospheric 3D scene"
 *   fallback={<div className="warm-gradient" />}
 * >
 *   <HeroAtmosphere />
 * </ThreeCanvas>
 * ```
 */
export const ThreeCanvas = memo(function ThreeCanvas({
  children,
  className,
  frameloop,
  dpr,
  ariaLabel,
  fallback,
  forceFallback = false,
}: ThreeCanvasProps) {
  const { isEnabled, isReducedMotion } = useThree();
  const { canvasSettings } = useThreeRenderer();
  const { settings } = useThreeQuality();

  // ── Feature gate ─────────────────────────────────────

  const shouldRender3D = useMemo(
    () => isEnabled && !isReducedMotion && !forceFallback,
    [isEnabled, isReducedMotion, forceFallback],
  );

  // ── Effective settings with prop overrides ────────────

  const effectiveFrameloop = frameloop ?? settings.frameloop;
  const effectiveDpr = dpr ?? canvasSettings.dpr;

  // ── Fallback path ────────────────────────────────────

  if (!shouldRender3D) {
    if (!fallback) return null;
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%' }}
      >
        {fallback}
      </div>
    );
  }

  // ── 3D path ──────────────────────────────────────────

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        /* Decorative layer — never intercept interaction. */
        pointerEvents: 'none',
      }}
    >
      <ThreeErrorBoundary fallback={fallback ?? null}>
        <Suspense fallback={null}>
          <Canvas
            frameloop={effectiveFrameloop}
            dpr={effectiveDpr}
            gl={canvasSettings.gl}
            shadows={canvasSettings.shadows}
            flat={canvasSettings.flat}
            onCreated={canvasSettings.onCreated}
            /* Prevent R3F from listening to scroll for resize —
               Lenis handles scroll, and we don't want competing
               scroll listeners. */
            resize={{ scroll: false }}
            aria-label={ariaLabel}
            style={{ width: '100%', height: '100%' }}
          >
            {children}
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
});
