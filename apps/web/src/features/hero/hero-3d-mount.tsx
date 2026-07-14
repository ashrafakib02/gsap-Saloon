/**
 * Hero3DMount — 3D Scene Mounting Point Placeholder
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
 * Phase 6 (3D Experience) will populate this mounting point.
 * Phase 4.1 creates the ARCHITECTURE ONLY — no canvas, no scene.
 */

import type { Hero3DMountProps } from './hero.types';

// ── Component ─────────────────────────────────────────────

/**
 * Placeholder mounting point for the future React Three Fiber scene.
 *
 * Design decisions:
 * 1. Always rendered (for layout stability) but visually invisible
 * 2. Positioned behind all content (low z-index)
 * 3. Full-viewport coverage for future atmospheric effects
 * 4. aria-hidden — decorative, not meaningful for screen readers
 * 5. pointer-events: none — never intercepts interaction
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
export function Hero3DMount({ is3DEnabled, hasWebGL }: Hero3DMountProps) {
  /* Only mount the 3D container when conditions are met */
  const shouldMount = is3DEnabled && hasWebGL;

  if (!shouldMount) {
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
       * <Canvas
       *   frameloop="demand"
       *   gl={{ antialias: true, alpha: true }}
       *   style={{ width: '100%', height: '100%' }}
       * >
       *   <HeroAtmosphere />
       * </Canvas>
       *
       * Wrapped in:
       * <Suspense fallback={null}>
       *   <HeroAtmosphere />
       * </Suspense>
       *
       * From PROJECT_BLUEPRINT:
       * "R3F in separate chunk, Suspense with null fallback"
       * "demand-based rendering — only renders when scene changes"
       */}
    </div>
  );
}
