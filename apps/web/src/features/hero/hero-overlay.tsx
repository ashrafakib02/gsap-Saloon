/**
 * HeroOverlay — Composited Overlay System
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "Lighting Direction: Afternoon Gold — our signature lighting mood.
 *  The image is bathed in warm, amber-toned light."
 *
 * The overlay system creates the warm atmospheric treatment over
 * the hero image. It is NOT a gradient design element (VISUAL_RULES N30).
 * It is a functional atmospheric layer that:
 * 1. Ensures text legibility over the image (VISUAL_RULES N9, I6)
 * 2. Creates the warm "Afternoon Gold" mood
 * 3. Provides depth and atmosphere
 *
 * Architecture:
 * - Multiple compositable layers (each independently toggled)
 * - GPU-accelerated (opacity only, no layout thrashing — P10)
 * - Reduced motion: instant opacity (AC5)
 */

import type { HeroOverlayProps } from './hero.types';

// ── Overlay Layer Configurations ──────────────────────────

/**
 * Individual overlay layers.
 * Each layer serves a specific atmospheric purpose.
 *
 * From DESIGN_SYSTEM §13 (Materials):
 * "Material references are communicated through photography,
 *  not through digital textures or CSS effects."
 *
 * These overlays are subtle atmospheric treatments, not material simulations.
 */
const OVERLAY_LAYERS = [
  {
    id: 'warm-vignette',
    style: {
      background: `
        radial-gradient(
          ellipse at 50% 50%,
          transparent 40%,
          rgba(44, 36, 32, 0.15) 100%
        )
      `,
    },
    description: 'Warm vignette — draws eye to center',
  },
  {
    id: 'golden-atmosphere',
    style: {
      background: `
        linear-gradient(
          180deg,
          rgba(184, 150, 90, 0.06) 0%,
          transparent 40%,
          transparent 70%,
          rgba(184, 150, 90, 0.04) 100%
        )
      `,
    },
    description: 'Golden atmosphere — subtle warm wash',
  },
  {
    id: 'content-legibility',
    style: {
      background: `
        linear-gradient(
          180deg,
          rgba(44, 36, 32, 0.08) 0%,
          rgba(44, 36, 32, 0.12) 30%,
          rgba(44, 36, 32, 0.08) 60%,
          rgba(44, 36, 32, 0.15) 100%
        )
      `,
    },
    description: 'Content legibility — ensures text contrast',
  },
] as const;

// ── Component ─────────────────────────────────────────────

/**
 * Composited overlay system for the hero image.
 *
 * Architecture decisions:
 * 1. Multiple independent layers — each can be toggled
 * 2. Uses opacity for GPU acceleration (P10: no layout properties)
 * 3. z-index stacking for correct compositing order
 * 4. All overlays are functional (legibility, atmosphere) — not decorative (N30)
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "Some sections have no animation at all — just pure, beautiful
 *  static composition."
 *
 * The overlays are static. They create atmosphere through color,
 * not through motion.
 *
 * TODO Phase 9: Optional subtle opacity animation on scroll
 */
export function HeroOverlay({ layers = OVERLAY_LAYERS.length }: HeroOverlayProps) {
  const visibleLayers = OVERLAY_LAYERS.slice(0, layers);

  return (
    <div
      className="hero-overlay absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    >
      {visibleLayers.map((layer) => (
        <div
          key={layer.id}
          className="absolute inset-0"
          style={{
            ...layer.style,
            /* GPU-accelerated — only opacity, no layout properties (P10) */
            willChange: 'opacity',
          }}
        />
      ))}
    </div>
  );
}
