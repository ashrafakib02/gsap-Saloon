/**
 * GSAP Registration Layer
 *
 * Wraps the existing `@/lib/gsap-config.ts` registration with additional
 * infrastructure utilities. This is the SINGLE entry point for all GSAP
 * access across the application — never import `gsap` or `ScrollTrigger`
 * directly from their packages.
 *
 * @example
 * ```ts
 * import { getGSAP, getScrollTrigger } from '@/shared/animation/gsap-registration';
 *
 * const gsap = getGSAP();
 * const st = getScrollTrigger();
 * ```
 */

import { gsap, ScrollTrigger } from '@/lib/gsap-config';

import { DEBOUNCE } from '@/shared/tokens/timing';

// ── Module State ───────────────────────────────────────────

let initialized = false;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

// ── Public API ─────────────────────────────────────────────

/**
 * Idempotent GSAP initialization.
 *
 * Ensures plugins are registered and configures GSAP defaults:
 * - `ease: 'power2.out'` (DESIGN_SYSTEM §14: ease-out for entry)
 * - `duration: 0.6` (DESIGN_SYSTEM §14: max 600ms for reveals)
 * - `overwrite: 'auto'` (prevents animation conflicts)
 *
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function initGSAP(): void {
  if (initialized) return;

  // Plugins are already registered in @/lib/gsap-config via import side-effect.
  // Apply additional infrastructure-level defaults that go beyond the base config.
  gsap.defaults({
    ease: 'power2.out',
    duration: 0.6,
    overwrite: 'auto',
  });

  initialized = true;
}

/**
 * Returns the GSAP instance from the centralized registration point.
 *
 * @returns The GSAP core instance
 */
export function getGSAP(): typeof gsap {
  return gsap;
}

/**
 * Returns the ScrollTrigger plugin instance from the centralized
 * registration point.
 *
 * @returns The ScrollTrigger plugin
 */
export function getScrollTrigger(): typeof ScrollTrigger {
  return ScrollTrigger;
}

/**
 * Debounced ScrollTrigger.refresh() call.
 *
 * Recalculates ScrollTrigger positions after DOM changes (images loading,
 * dynamic content, etc.). Debounced to prevent excessive recalculations
 * during rapid DOM mutations.
 *
 * @see DEBOUNCE.resize — uses the resize debounce interval (150ms)
 */
export function refreshScrollTrigger(): void {
  if (refreshTimeout !== null) {
    clearTimeout(refreshTimeout);
  }

  refreshTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
    refreshTimeout = null;
  }, DEBOUNCE.resize);
}

/**
 * Kills all GSAP animations and ScrollTrigger instances.
 *
 * Used for cleanup during page transitions, reduced-motion activation,
 * or component unmount sequences. Resets the initialized flag so
 * {@link initGSAP} can be called again if needed.
 *
 * @warning This is destructive — all running animations will be killed immediately.
 */
export function killAllAnimations(): void {
  // Kill all GSAP tweens and timelines
  gsap.killTweensOf('*');

  // Kill all ScrollTrigger instances and reset
  ScrollTrigger.getAll().forEach((st) => st.kill());

  // Reset initialization so initGSAP() can be called again
  initialized = false;
}
