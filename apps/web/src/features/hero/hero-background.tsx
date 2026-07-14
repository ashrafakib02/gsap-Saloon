/**
 * HeroBackground — Ambient Background Layers
 *
 * From EXPERIENCE_STORYBOARD SCENE 0 (Loading Moment):
 * "From darkness to golden warmth. The image starts at 0% opacity
 *  and warms as it reveals."
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "Lighting Direction: Afternoon Gold — our signature lighting mood."
 *
 * The background system provides the ambient canvas for the hero.
 * It is the "air" behind the image — the warm atmosphere that exists
 * before and during the image reveal.
 *
 * Architecture:
 * - Warm surface color as the base canvas
 * - Subtle radial gradient for depth and focus
 * - Supports reduced motion (instant appearance, no transition)
 * - GPU-accelerated where animation is applied (Phase 9)
 *
 * From VISUAL_RULES N4:
 * "Never use pure white (#FFFFFF) for backgrounds."
 * Our surface IS the background — warm off-white (#F5F0EB).
 */

import type { HeroBackgroundProps } from './hero.types';

// ── Component ─────────────────────────────────────────────

/**
 * The hero's ambient background layer.
 *
 * This is the canvas upon which the hero image is composited.
 * It is always visible — even before the image loads, even if
 * the image fails. The background IS the hero's safety net.
 *
 * Design decisions:
 * 1. Uses CSS custom properties — respects light/dark mode automatically
 * 2. Subtle radial gradient creates depth without being a "gradient design element" (N30)
 *    This gradient is functional: it draws the eye to center where content lives
 * 3. The gradient is subtle enough to be "felt, not seen" (DESIGN_SYSTEM §14 Law 3)
 * 4. Full-viewport coverage — no gaps at any viewport size
 *
 * TODO Phase 9: Optional warm color shift animation during load threshold
 */
export function HeroBackground({ prefersReducedMotion }: HeroBackgroundProps) {
  return (
    <div
      className="hero-background absolute inset-0"
      aria-hidden="true"
      style={{
        /* Base: warm surface color — the brand's canvas */
        backgroundColor: 'var(--color-surface)',

        /* Subtle depth through radial gradient.
         * Functional, not decorative — draws focus to center content area.
         * Opacity is low enough to be subliminal (DESIGN_SYSTEM §14 Law 3). */
        background: `
          radial-gradient(
            ellipse 80% 60% at 50% 45%,
            color-mix(in srgb, var(--color-accent) 5%, var(--color-surface)) 0%,
            var(--color-surface) 70%
          )
        `,

        /* Phase 9 will animate this:
         * - opacity transition during load threshold
         * - warm color shift during Warm Unveiling
         * Reduced motion: no transition, instant appearance */
        transition: prefersReducedMotion
          ? 'none'
          : 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',

        zIndex: 0,
      }}
    />
  );
}
