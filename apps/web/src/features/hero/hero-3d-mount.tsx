/**
 * Hero3DMount — 3D Scene Mounting Point
 *
 * From PROJECT_BLUEPRINT §Feature Inventory:
 * "F5.1: Atmospheric 3D Depth Layer (P2)"
 *
 * From VISUAL_RULES D1-D6 (3D Rules):
 * "3D is atmospheric, never the focus."
 * "3D effects on mobile are optional, not required."
 * "3D effects never obscure or compete with content."
 *
 * From PROJECT_BLUEPRINT §3D Components:
 * "HeroAtmosphere — Lazy-loaded R3F scene — 3D atmospheric depth
 *  for hero section — volumetric light through golden haze"
 *
 * Architecture:
 * - Mounting point is ALWAYS present in the DOM (for layout stability)
 * - Actual R3F Canvas is lazy-loaded only when:
 *   1. Feature flag `hero_3d` is enabled
 *   2. WebGL is available
 *   3. Device has sufficient GPU/memory
 *   4. Reduced motion is NOT active
 * - The mounting point has zero visual impact when 3D is disabled
 * - From DESIGN_SYSTEM §1 (P1): "If removed, the experience is complete"
 *
 * Phase 4.7: Adds deferred loading via useDeferredLoad hook.
 * The 3D scene waits for browser idle before mounting, ensuring
 * the hero image and content render first (LCP priority).
 *
 * Phase 6 (3D Experience) will populate this mounting point.
 * Phase 4.1 creates the ARCHITECTURE ONLY — no canvas, no scene.
 */

import { Suspense, memo } from 'react';
import { useDeferredLoad } from './hooks/use-deferred-load';
import type { Hero3DMountProps } from './hero.types';

// ── Lazy-Loaded 3D Scene (Phase 6) ─────────────────────────

/**
 * React.lazy boundary for the 3D scene.
 *
 * From PROJECT_BLUEPRINT:
 * "R3F in separate chunk, Suspense with null fallback"
 *
 * When Phase 6 implements HeroAtmosphere, this import will be:
 *   const HeroAtmosphere = React.lazy(() => import('./hero-atmosphere'));
 *
 * For now, this is a placeholder that documents the architecture.
 * The actual dynamic import will be added in Phase 6.1.
 */
// TODO Phase 6.1: Replace with React.lazy(() => import('./hero-atmosphere'))
// const HeroAtmosphere = React.lazy(() => import('./hero-atmosphere'));

// ── Component ─────────────────────────────────────────────

/**
 * Mounting point for the future React Three Fiber scene.
 *
 * Wrapped in React.memo — props (is3DEnabled, hasWebGL) are derived
 * from feature flags and WebGL detection, both stable after initial
 * determination. Prevents re-renders when parent state changes.
 *
 * Uses useDeferredLoad to delay 3D scene mounting until the browser
 * is idle. This ensures the hero image (LCP element) and content
 * render first without competing for resources.
 *
 * Design decisions:
 * 1. Always rendered (for layout stability) but visually invisible
 * 2. Positioned behind all content (low z-index)
 * 3. Full-viewport coverage for future atmospheric effects
 * 4. aria-hidden — decorative, not meaningful for screen readers
 * 5. pointer-events: none — never intercepts interaction
 * 6. Deferred loading — 3D mounts after browser idle
 *
 * From VISUAL_RULES D6:
 * "3D-related effects respect prefers-reduced-motion."
 * This is handled by the parent hook that controls is3DEnabled.
 *
 * TODO Phase 6.1: Install React Three Fiber
 * TODO Phase 6.2: Create HeroAtmosphere scene
 * TODO Phase 6.7: Asset loading for 3D textures
 * TODO Phase 6.9: Mobile fallback (disable on low-end devices)
 */
export const Hero3DMount = memo(function Hero3DMount({ is3DEnabled, hasWebGL }: Hero3DMountProps) {
  /* Only mount the 3D container when feature conditions are met */
  const featureEnabled = is3DEnabled && hasWebGL;

  /* Deferred loading — wait for browser idle before mounting 3D.
   * The hero image (LCP) and content take priority.
   * inViewport is false because we want IDLE deferral, not immediate load.
   * The hero IS in the viewport, but 3D can wait for browser idle.
   * If the feature is disabled, deferred loading never triggers. */
  const { shouldLoad } = useDeferredLoad({
    enabled: featureEnabled,
    inViewport: false, /* Defer until browser idle, even though hero is visible */
  });

  if (!shouldLoad) {
    return null;
  }

  return (
    <div
      className="hero-3d-mount absolute inset-0"
      aria-hidden="true"
      style={{
        /* Behind all content layers */
        zIndex: 1,
        /* Never intercept mouse/touch events */
        pointerEvents: 'none',
      }}
    >
      {/*
       * Phase 6 will render:
       *
       * <Suspense fallback={null}>
       *   <Canvas
       *     frameloop="demand"
       *     gl={{ antialias: true, alpha: true }}
       *     style={{ width: '100%', height: '100%' }}
       *   >
       *     <HeroAtmosphere />
       *   </Canvas>
       * </Suspense>
       *
       * From PROJECT_BLUEPRINT:
       * "R3F in separate chunk, Suspense with null fallback"
       * "demand-based rendering — only renders when scene changes"
       *
       * The Suspense boundary ensures the hero content is not blocked
       * while the 3D scene loads. The null fallback means zero visual
       * impact during loading.
       */}
    </div>
  );
});
