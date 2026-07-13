/**
 * Animation Presets
 *
 * Reusable, pre-configured animation configurations that enforce VISUAL_RULES
 * constraints by design. Every preset uses safe values — you cannot accidentally
 * create a non-compliant animation by using these presets.
 *
 * From DESIGN_SYSTEM §14:
 * - M1: Scroll-linked, not time-linked (except hero reveal)
 * - M2: Only hero reveal is time-linked (initial page load)
 * - M3: Ease-out entry, ease-in exit, ease-in-out state changes
 * - M4: Max 600ms duration for content reveals
 * - M5: Max 30px vertical translation
 * - M6: Max scale 1.03 on hover
 *
 * @example
 * ```ts
 * import { SCROLL_REVEAL_UP } from '@/shared/animation/animation-presets';
 *
 * gsap.from(element, SCROLL_REVEAL_UP.from);
 * gsap.to(element, { ...SCROLL_REVEAL_UP.to, duration: SCROLL_REVEAL_UP.duration });
 * ```
 */

import { MOTION_LIMITS } from '@/shared/tokens/motion';
import { STAGGER } from '@/shared/tokens/timing';

// ── Types ──────────────────────────────────────────────────

/**
 * Compatible tween variable type.
 * Mirrors GSAP's TweenVars interface without importing the gsap package,
 * keeping this file free of runtime dependencies.
 */
interface AnimationVars {
  [key: string]: string | number | boolean | undefined;
}

/** A pre-configured animation preset. */
export interface AnimationPreset {
  /** Human-readable name for debugging. */
  name: string;
  /** Duration in seconds. */
  duration: number;
  /** GSAP ease string. */
  ease: string;
  /** Delay in seconds before the animation starts. */
  delay: number;
  /** Starting state (GSAP `from` vars). */
  from: AnimationVars;
  /** Ending state (GSAP `to` vars). */
  to: AnimationVars;
}

// ── Presets ────────────────────────────────────────────────

/**
 * Scroll-reveal with upward translation.
 *
 * Fades in and rises from 30px below (M5: max 30px).
 * Duration: 600ms (M4: max for content reveals).
 * Ease: power2.out (M3: ease-out for entry).
 */
export const SCROLL_REVEAL_UP = {
  name: 'scroll-reveal-up',
  duration: 0.6,
  ease: 'power2.out',
  delay: 0,
  from: {
    y: MOTION_LIMITS.maxTranslationY,
    opacity: MOTION_LIMITS.minRevealOpacity,
  },
  to: {
    y: 0,
    opacity: 1,
  },
} as const satisfies AnimationPreset;

/**
 * Scroll-reveal with fade only (no translation).
 *
 * For elements where translation would be distracting.
 * Duration: 500ms. Ease: power2.out.
 */
export const SCROLL_REVEAL_FADE = {
  name: 'scroll-reveal-fade',
  duration: 0.5,
  ease: 'power2.out',
  delay: 0,
  from: {
    opacity: MOTION_LIMITS.minRevealOpacity,
  },
  to: {
    opacity: 1,
  },
} as const satisfies AnimationPreset;

/**
 * Scroll-reveal with subtle scale-in.
 *
 * For cards, images, or feature blocks that benefit from depth cues.
 * Scale: 0.97→1 (subtle, well within M6 limits).
 * Duration: 500ms. Ease: power2.out.
 */
export const SCROLL_REVEAL_SCALE = {
  name: 'scroll-reveal-scale',
  duration: 0.5,
  ease: 'power2.out',
  delay: 0,
  from: {
    scale: 0.97,
    opacity: MOTION_LIMITS.minRevealOpacity,
  },
  to: {
    scale: 1,
    opacity: 1,
  },
} as const satisfies AnimationPreset;

/**
 * Warm hover reveal for interactive elements.
 *
 * CR6 per VISUAL_RULES: "Interactive elements respond with a warm reveal."
 * Scale: 1→1.03 (M6: max hover scale).
 * Duration: 300ms. Ease: power1.out (gentle deceleration).
 */
export const HOVER_WARM_REVEAL = {
  name: 'hover-warm-reveal',
  duration: 0.3,
  ease: 'power1.out',
  delay: 0,
  from: {
    scale: 1,
  },
  to: {
    scale: MOTION_LIMITS.maxHoverScale,
  },
} as const satisfies AnimationPreset;

/**
 * Hero section reveal — initial page load animation.
 *
 * M2: The ONLY time-linked animation in the system.
 * All other animations are scroll-linked per M1.
 * Duration: 1200ms (longer than content reveals, but acceptable for hero).
 * Ease: power3.out (strong deceleration for dramatic entrance).
 * Delay: 300ms (brief pause before hero appears).
 */
export const HERO_REVEAL = {
  name: 'hero-reveal',
  duration: 1.2,
  ease: 'power3.out',
  delay: 0.3,
  from: {
    y: 0,
    opacity: 0,
  },
  to: {
    y: 0,
    opacity: 1,
  },
} as const satisfies AnimationPreset;

/**
 * Section stagger base preset.
 *
 * Used as the base for staggered group reveals.
 * Individual element delays are calculated via {@link getStaggerDelay}.
 * Duration: 500ms. Ease: power2.out.
 */
export const SECTION_STAGGER = {
  name: 'section-stagger',
  duration: 0.5,
  ease: 'power2.out',
  delay: 0,
  from: {
    y: 20,
    opacity: MOTION_LIMITS.minRevealOpacity,
  },
  to: {
    y: 0,
    opacity: 1,
  },
} as const satisfies AnimationPreset;

/**
 * Instant (zero-duration) preset for reduced-motion fallback.
 *
 * When reduced motion is active, all animated properties jump to their
 * final state with no interpolation.
 */
export const INSTANT = {
  name: 'instant',
  duration: 0,
  ease: 'none',
  delay: 0,
  from: {},
  to: {},
} as const satisfies AnimationPreset;

// ── Utility Functions ──────────────────────────────────────

/**
 * Returns the reduced-motion fallback preset.
 *
 * Equivalent to the INSTANT preset — zero-duration, no easing,
 * immediate state change.
 *
 * @returns The INSTANT preset
 */
export function getReducedMotionPreset(): AnimationPreset {
  return INSTANT;
}

/**
 * Calculates a stagger delay for the given element index.
 *
 * Uses the STAGGER.token values from `@/shared/tokens/timing.ts` to
 * determine spacing between sequential reveals.
 *
 * @param index - Zero-based index of the element in the stagger group
 * @param stagger - Custom stagger interval in ms (defaults to STAGGER.elementOffset)
 * @returns Delay in seconds (for GSAP `delay` property)
 *
 * @example
 * ```ts
 * elements.forEach((el, i) => {
 *   gsap.to(el, {
 *     ...SECTION_STAGGER.to,
 *     duration: SECTION_STAGGER.duration,
 *     delay: getStaggerDelay(i),
 *   });
 * });
 * ```
 */
export function getStaggerDelay(index: number, stagger?: number): number {
  const intervalMs = stagger ?? STAGGER.elementOffset;
  return (index * intervalMs) / 1000;
}
