import Lenis from 'lenis';

// ── Module State ──────────────────────────────────────────

let lenis: Lenis | null = null;
let rafId: number | null = null;

// ── Configuration ─────────────────────────────────────────

/**
 * Lenis configuration.
 *
 * From TECHNICAL_ARCHITECTURE §8:
 * "Lenis provides smooth scroll behavior, replacing native scroll
 *  with smooth interpolation."
 *
 * Duration: 1.2s — smooth but not sluggish.
 * Easing: exponential decay — feels natural, decelerates like a physical scroll.
 * TouchMultiplier: 2 — enhanced touch responsiveness on mobile.
 */
const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
} as const;

// ── Public API ────────────────────────────────────────────

/**
 * Initialize Lenis smooth scroll and connect it to GSAP ScrollTrigger.
 *
 * Returns the Lenis instance. Idempotent — multiple calls return the same instance.
 * The requestAnimationFrame loop keeps Lenis synchronized with the browser frame.
 */
export function initLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis(LENIS_OPTIONS);

  // Connect Lenis to GSAP ScrollTrigger via requestAnimationFrame
  // From TECHNICAL_ARCHITECTURE §8.2: "Lenis integrates natively with GSAP ScrollTrigger"
  function raf(time: number): void {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return lenis;
}

/**
 * Get the current Lenis instance (or null if not initialized).
 */
export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Destroy the Lenis instance and stop the animation loop.
 * Called when reduced motion is enabled or the component unmounts.
 */
export function destroyLenis(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}
