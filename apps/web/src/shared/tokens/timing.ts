/**
 * Timing Constants
 *
 * From DESIGN_SYSTEM §14 (Motion Principles):
 * "Motion serves content, never decorates it."
 *
 * These are timing values used for animation durations, delays,
 * and animation-related configuration across the application.
 *
 * Distinction from motion.ts:
 *   - motion.ts: CSS-level tokens (DURATION, EASING) for component transitions
 *   - timing.ts: Animation system constants (thresholds, scroll ranges, delays)
 */

// ── Animation Delays ─────────────────────────────────────

/**
 * Stagger delays for sequential reveals.
 * From TECHNICAL_ARCHITECTURE §8.7:
 * "Staggered reveal: Background → text → CTA, each with 200ms offset."
 */
export const STAGGER = {
  /** Delay between staggered elements */
  elementOffset: 200,

  /** Fast stagger for closely grouped items */
  fastOffset: 100,

  /** Slow stagger for deliberate, editorial reveals */
  slowOffset: 400,
} as const;

// ── Scroll Thresholds ────────────────────────────────────

/**
 * Scroll-related thresholds for triggering animations.
 * From DESIGN_SYSTEM §14 Law 1:
 * "Scroll-Linked, Not Time-Linked. The visitor controls the speed."
 */
export const SCROLL_THRESHOLDS = {
  /** Scroll direction threshold (pixels) before direction change registers */
  directionPixel: 10,

  /** IntersectionObserver threshold for scroll-reveal */
  revealThreshold: 0.15,

  /** IntersectionObserver threshold for section tracking */
  sectionTracking: 0.3,

  /** Scroll offset for sticky navigation compensation (px) */
  stickyNavHeight: 64,
} as const;

// ── Debounce/Throttle Delays ─────────────────────────────

/**
 * Debounce and throttle timing values.
 * From TECHNICAL_ARCHITECTURE §15.6:
 * "Debounced scroll handlers at 16ms (one frame)."
 */
export const DEBOUNCE = {
  /** Scroll handler throttle — one frame (16ms) */
  scroll: 16,

  /** Search input debounce */
  search: 300,

  /** Resize handler debounce */
  resize: 150,

  /** General purpose debounce */
  default: 300,

  /** Long debounce for infrequent updates */
  long: 500,
} as const;

// ── Transition Delays ────────────────────────────────────

/**
 * Delays for UI state transitions.
 * From DESIGN_SYSTEM §18 (State Philosophy):
 * "State transitions are animated with consistent timing."
 */
export const TRANSITIONS = {
  /** Delay before hiding nav after scroll starts (ms) */
  navHideDelay: 0,

  /** Delay before showing error messages (ms) */
  errorShow: 100,

  /** Delay before removing elements from DOM (ms) */
  unmountDelay: 0,

  /** Toast notification display duration (ms) */
  toastDuration: 4000,
} as const;

// ── Types ────────────────────────────────────────────────

export type StaggerKey = keyof typeof STAGGER;
export type ScrollThresholdKey = keyof typeof SCROLL_THRESHOLDS;
export type DebounceKey = keyof typeof DEBOUNCE;
