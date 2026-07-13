/**
 * Reduced Motion Integration
 *
 * Bridges the animation system with the user's reduced-motion preference.
 * Provides both a plain function (`prefersReducedMotion()`) for non-React
 * contexts (GSAP, ScrollTrigger, utility functions) and integration with
 * the existing React hooks for component-level decisions.
 *
 * From DESIGN_SYSTEM §14:
 * - M11: "Always respect prefers-reduced-motion."
 *
 * This module is SSR-safe — all window/document access is guarded.
 *
 * @example
 * ```ts
 * import {
 *   prefersReducedMotion,
 *   getAnimationDuration,
 *   shouldAnimate,
 * } from '@/shared/animation/reduced-motion';
 *
 * // In GSAP animation code
 * if (!prefersReducedMotion()) {
 *   gsap.to(el, { opacity: 1, duration: getAnimationDuration(0.6) });
 * }
 *
 * // Or using shouldAnimate for category-level decisions
 * if (shouldAnimate('scroll')) {
 *   createScrollTrigger({ ... });
 * }
 * ```
 */

// ── Module State ───────────────────────────────────────────

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Cached matchMedia result. Updated via event listener.
 * `null` indicates SSR or not-yet-initialized.
 */
let cachedResult: boolean | null = null;

/**
 * The MediaQueryList instance. Stored to allow cleanup.
 * `null` in SSR environments.
 */
let mediaQuery: MediaQueryList | null = null;

/**
 * Event listener for real-time OS preference changes.
 */
const handleChange = (event: MediaQueryListEvent): void => {
  cachedResult = event.matches;
};

// ── Initialization ─────────────────────────────────────────

/**
 * Initializes the matchMedia listener (SSR-safe).
 * Called lazily on first access — no import-time side effects.
 */
function ensureInitialized(): void {
  if (cachedResult !== null) return;
  if (typeof window === 'undefined') {
    cachedResult = false;
    return;
  }

  mediaQuery = window.matchMedia(QUERY);
  cachedResult = mediaQuery.matches;
  mediaQuery.addEventListener('change', handleChange);
}

// ── Public API ─────────────────────────────────────────────

/**
 * SSR-safe check for prefers-reduced-motion media query.
 *
 * Unlike the React hook (`usePrefersReducedMotion`), this is a plain
 * function suitable for use in GSAP timelines, ScrollTrigger callbacks,
 * and other non-React contexts.
 *
 * @returns `true` if the user prefers reduced motion, `false` otherwise
 */
export function prefersReducedMotion(): boolean {
  ensureInitialized();
  return cachedResult ?? false;
}

/**
 * Returns the appropriate animation duration based on motion preference.
 *
 * When reduced motion is active, returns `0` (instant).
 * Otherwise, returns the normal duration unchanged.
 *
 * @param normalDuration - The duration in milliseconds to use when motion is allowed
 * @returns `0` if reduced motion is active, otherwise `normalDuration`
 *
 * @example
 * ```ts
 * const duration = getAnimationDuration(600); // 0 or 600
 * ```
 */
export function getAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration;
}

/**
 * Returns the appropriate animation delay based on motion preference.
 *
 * When reduced motion is active, returns `0` (no delay).
 * Otherwise, returns the normal delay unchanged.
 *
 * @param normalDelay - The delay in milliseconds to use when motion is allowed
 * @returns `0` if reduced motion is active, otherwise `normalDelay`
 */
export function getAnimationDelay(normalDelay: number): number {
  return prefersReducedMotion() ? 0 : normalDelay;
}

/**
 * Determines whether an animation of the given type should play.
 *
 * When reduced motion is active, most animations are disabled.
 * The exception is `'hero'` (M2: "Only hero reveal is time-linked")
 * which still plays to ensure the page doesn't load as a blank slate.
 *
 * @param animationType - The category of animation to check
 * @returns `true` if the animation should play, `false` otherwise
 *
 * @example
 * ```ts
 * if (shouldAnimate('scroll')) {
 *   initScrollReveals();
 * }
 * if (shouldAnimate('hero')) {
 *   playHeroReveal(); // Always plays, even with reduced motion
 * }
 * ```
 */
export function shouldAnimate(
  animationType: 'scroll' | 'hover' | 'page' | 'hero' | 'micro',
): boolean {
  // M2: Hero reveal is the only time-linked animation — always plays
  if (animationType === 'hero') return true;

  // M11: All other animations respect prefers-reduced-motion
  return !prefersReducedMotion();
}

/**
 * Generates a CSS transition string, or an empty string if reduced motion is active.
 *
 * Useful for CSS-in-JS or inline styles where a transition property needs
 * to be conditionally applied.
 *
 * @param property - The CSS property to transition (e.g., `'opacity'`, `'transform'`)
 * @param duration - Transition duration in milliseconds
 * @param easing - Optional CSS easing function (default: `'ease-out'`)
 * @returns A CSS `transition` property value, or empty string if no animation
 *
 * @example
 * ```ts
 * const style = {
 *   transition: getTransitionCSS('opacity', 500),
 *   // "opacity 500ms ease-out" or ""
 * };
 * ```
 */
export function getTransitionCSS(
  property: string,
  duration: number,
  easing?: string,
): string {
  if (prefersReducedMotion()) return '';

  const effectiveDuration = getAnimationDuration(duration);
  if (effectiveDuration === 0) return '';

  return `${property} ${effectiveDuration}ms ${easing ?? 'ease-out'}`;
}

/**
 * Returns either the animated or fallback value based on motion preference.
 *
 * A convenience helper for toggling between animated and static states.
 *
 * @typeParam T - The type of the values
 * @param animated - Value to use when motion is allowed
 * @param fallback - Value to use when reduced motion is active
 * @returns `fallback` if reduced motion is active, otherwise `animated`
 *
 * @example
 * ```ts
 * const duration = getReducedMotionFallback(0.6, 0); // 0.6 or 0
 * const scale = getReducedMotionFallback(1.03, 1);   // 1.03 or 1
 * ```
 */
export function getReducedMotionFallback<T>(animated: T, fallback: T): T {
  return prefersReducedMotion() ? fallback : animated;
}
