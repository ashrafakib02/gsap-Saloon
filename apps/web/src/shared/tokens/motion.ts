/**
 * Motion Tokens
 *
 * From DESIGN_SYSTEM §14 (Motion Principles):
 * "Motion serves content, never decorates it."
 *
 * From DESIGN_SYSTEM_DECISIONS §MOTION:
 * - Scroll-linked, not time-linked (except hero reveal)
 * - Ease-out for entry, ease-in for exit, ease-in-out for state changes
 * - Maximum reveal duration: 600ms
 * - Maximum hover scale: 1.03
 * - No bouncing, no spring physics, no overshooting
 *
 * These tokens define the CSS-level motion vocabulary.
 * Animation parameters (thresholds, scroll-linked values) live in
 * packages/shared/src/constants/animation-timing.ts.
 */

// ── Durations ────────────────────────────────────────────

/**
 * Named duration tokens.
 * All values in milliseconds. Never exceed 600ms for content reveals.
 *
 * From DESIGN_SYSTEM §14 Motion Constraints:
 * "Maximum duration for content reveals: 600ms"
 */
export const DURATION = {
  /** Instant — state changes that must feel immediate */
  instant: 0,

  /** Fast — hover states, focus rings, micro-interactions (100-200ms) */
  fast: 200,

  /** Normal — content reveals, section transitions (400-600ms) */
  normal: 500,

  /** Slow — page transitions, hero reveal (1200-1500ms) */
  slow: 1200,

  /** Confirmation — warm confirmation animation (800-1200ms) */
  confirmation: 1000,
} as const;

// ── Easings ──────────────────────────────────────────────

/**
 * Named easing tokens.
 *
 * From DESIGN_SYSTEM §14 Law 2:
 * "Entry motions use ease-out (decelerate to rest).
 *  Exit motions use ease-in (accelerate away).
 *  State changes use ease-in-out (symmetric transition).
 *  Nothing bounces. No spring physics. No overshooting."
 */
export const EASING = {
  /** Entry — elements decelerating to rest */
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',

  /** Exit — elements accelerating away */
  in: 'cubic-bezier(0.7, 0, 0.84, 0)',

  /** State changes — symmetric transition */
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',

  /** Standard — general purpose, subtle ease */
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ── Transform Constraints ────────────────────────────────

/**
 * Maximum transform values per DESIGN_SYSTEM §14 Motion Constraints.
 */
export const MOTION_LIMITS = {
  /** Maximum opacity change: 0 to 1 (never starting at less than 0.8) */
  minRevealOpacity: 0,

  /** Maximum translation distance: 30px vertical */
  maxTranslationY: 30,

  /** Maximum scale change on hover: 1.03 */
  maxHoverScale: 1.03,

  /** Active press scale: 0.97 */
  activePressScale: 0.97,

  /** Active press duration: 100ms */
  activePressDuration: 100,

  /** Parallax maximum differential: 15-20% */
  maxParallaxDifferential: 0.2,
} as const;

// ── Composite Motion Tokens ──────────────────────────────

/**
 * Pre-composed motion tokens for common patterns.
 * Use these instead of combining duration + easing manually.
 */
export const MOTION = {
  /** Hover state — luminosity shift, 200-300ms ease-in-out */
  hover: {
    duration: DURATION.fast,
    easing: EASING.inOut,
  },

  /** Focus state — same timing as hover for consistency */
  focus: {
    duration: DURATION.fast,
    easing: EASING.inOut,
  },

  /** Active/press state — subtle inward press, 100ms */
  active: {
    duration: MOTION_LIMITS.activePressDuration,
    easing: EASING.out,
    scale: MOTION_LIMITS.activePressScale,
  },

  /** Content reveal — fade + slight rise, 500ms ease-out */
  reveal: {
    duration: DURATION.normal,
    easing: EASING.out,
    maxTranslationY: MOTION_LIMITS.maxTranslationY,
  },

  /** Section transition — dissolve between sections */
  sectionTransition: {
    duration: DURATION.normal,
    easing: EASING.inOut,
  },

  /** Modal/dialog entrance */
  modalEnter: {
    duration: DURATION.normal,
    easing: EASING.out,
  },

  /** Modal/dialog exit */
  modalExit: {
    duration: DURATION.fast,
    easing: EASING.in,
  },

  /** Toast notification entrance */
  toastEnter: {
    duration: DURATION.normal,
    easing: EASING.out,
  },

  /** Page transition — slowest, most considered */
  pageTransition: {
    duration: DURATION.slow,
    easing: EASING.inOut,
  },
} as const;

// ── Types ────────────────────────────────────────────────

export type DurationToken = typeof DURATION[keyof typeof DURATION];
export type EasingToken = typeof EASING[keyof typeof EASING];
