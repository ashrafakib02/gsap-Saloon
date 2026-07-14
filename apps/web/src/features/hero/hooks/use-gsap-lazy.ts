/**
 * GSAP Lazy Initialization Utility
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "The only time-linked animation is the hero reveal on initial page load."
 *
 * From DESIGN_SYSTEM §Performance:
 * "GSAP should NOT block initial render. It should be loaded
 *  asynchronously after the hero content is visible."
 *
 * From TECHNICAL_ARCHITECTURE §8:
 * "GSAP loaded via dynamic import (code-split)"
 * "ScrollTrigger loaded only when scroll animations are needed"
 *
 * This module provides lazy loading of GSAP and its plugins:
 * - GSAP core: loaded on first animation request or during idle
 * - ScrollTrigger: loaded only when scroll-linked animations are needed
 * - Both use singleton pattern — loaded once, reused across the app
 *
 * Architecture:
 * - Dynamic import() for code-splitting (GSAP is ~30KB gzipped)
 * - Singleton pattern prevents duplicate loading
 * - Preload during browser idle for faster first-use
 * - AbortController support for cleanup on unmount
 * - SSR-safe (dynamic import is no-op on server)
 *
 * From ARCHITECTURE_DECISIONS:
 * "GSAP is the animation engine. All complex animations use GSAP."
 * "Only animate transform and opacity — GPU-accelerated properties."
 *
 * Phase 4.7: Defines the lazy loading architecture.
 * Phase 9: Consumes this utility for the Warm Unveiling timeline.
 */

import { HERO_GSAP_CONFIG } from '../hero-perf.config';

// ── Types ──────────────────────────────────────────────────

/**
 * GSAP module type — the core GSAP API.
 * Using `any` here because the actual types come from the dynamic import.
 * In Phase 9, these will be properly typed when GSAP is installed.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
type GSAPModule = any;
type ScrollTriggerModule = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Singleton State ────────────────────────────────────────

/**
 * Module-level singleton state.
 * Once GSAP is loaded, it stays loaded for the lifetime of the page.
 * This is intentional — GSAP is a core dependency, not a one-use import.
 */
let gsapInstance: GSAPModule | null = null;
let scrollTriggerInstance: ScrollTriggerModule | null = null;
let gsapLoadPromise: Promise<GSAPModule> | null = null;
let scrollTriggerLoadPromise: Promise<ScrollTriggerModule> | null = null;

// ── GSAP Core Loading ─────────────────────────────────────

/**
 * Lazily load GSAP core via dynamic import().
 *
 * Returns a singleton — subsequent calls return the cached instance.
 * The dynamic import creates a separate chunk in the bundle,
 * keeping the initial payload small.
 *
 * From TECHNICAL_ARCHITECTURE §8:
 * "GSAP loaded via dynamic import (code-split)"
 *
 * @returns Promise resolving to the GSAP module
 *
 * @example
 * ```tsx
 * const gsap = await loadGSAP();
 * gsap.to(element, { opacity: 1, duration: 1.2 });
 * ```
 */
export async function loadGSAP(): Promise<GSAPModule> {
  /* Return cached instance if already loaded */
  if (gsapInstance) return gsapInstance;

  /* Return in-flight promise if currently loading */
  if (gsapLoadPromise) return gsapLoadPromise;

  /* Start loading */
  gsapLoadPromise = (async () => {
    try {
      const module = await import(HERO_GSAP_CONFIG.gsapModulePath);
      gsapInstance = module.default || module;
      return gsapInstance;
    } catch (error) {
      /* Reset promise so retry is possible */
      gsapLoadPromise = null;
      console.error('[Hero] Failed to load GSAP:', error);
      throw error;
    }
  })();

  return gsapLoadPromise;
}

// ── ScrollTrigger Loading ──────────────────────────────────

/**
 * Lazily load GSAP ScrollTrigger plugin via dynamic import().
 *
 * ScrollTrigger is loaded separately from GSAP core because:
 * 1. It's only needed for scroll-linked animations (Phase 5+)
 * 2. It adds ~15KB gzipped to the bundle
 * 3. Loading it separately keeps the initial payload smaller
 *
 * From TECHNICAL_ARCHITECTURE §8:
 * "ScrollTrigger loaded only when scroll animations are needed"
 *
 * @returns Promise resolving to the ScrollTrigger module
 *
 * @example
 * ```tsx
 * const ScrollTrigger = await loadScrollTrigger();
 * gsap.registerPlugin(ScrollTrigger);
 * ```
 */
export async function loadScrollTrigger(): Promise<ScrollTriggerModule> {
  /* Return cached instance if already loaded */
  if (scrollTriggerInstance) return scrollTriggerInstance;

  /* Return in-flight promise if currently loading */
  if (scrollTriggerLoadPromise) return scrollTriggerLoadPromise;

  /* Ensure GSAP core is loaded first */
  const gsap = await loadGSAP();

  /* Start loading ScrollTrigger */
  scrollTriggerLoadPromise = (async () => {
    try {
      const module = await import(HERO_GSAP_CONFIG.scrollTriggerModulePath);
      scrollTriggerInstance = module.default || module;

      /* Register ScrollTrigger with GSAP */
      gsap.registerPlugin(scrollTriggerInstance);

      return scrollTriggerInstance;
    } catch (error) {
      /* Reset promise so retry is possible */
      scrollTriggerLoadPromise = null;
      console.error('[Hero] Failed to load ScrollTrigger:', error);
      throw error;
    }
  })();

  return scrollTriggerLoadPromise;
}

// ── Idle Preloading ────────────────────────────────────────

/**
 * Preload GSAP during browser idle time.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Preload what the visitor will need, during idle time."
 *
 * This function uses requestIdleCallback to start loading GSAP
 * when the browser is not busy. This means GSAP is likely loaded
 * by the time the user scrolls or interacts.
 *
 * The preload is non-blocking — if it fails, the error is silently
 * caught. The actual loadGSAP() call will retry.
 *
 * @param delay - Delay before starting preload (ms)
 * @returns Cleanup function to cancel preload
 */
export function preloadGSAPDuringIdle(
  delay: number = HERO_GSAP_CONFIG.idlePreloadDelay,
): () => void {
  if (typeof window === 'undefined') return () => {};

  let cancelled = false;
  let ricId: number | null = null;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const doPreload = () => {
    if (cancelled) return;
    loadGSAP().catch(() => {
      /* Silent catch — actual loadGSAP() will handle errors */
    });
  };

  if ('requestIdleCallback' in window) {
    ricId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback(doPreload, {
      timeout: delay + 1_000,
    });
  } else {
    timerId = setTimeout(doPreload, delay);
  }

  return () => {
    cancelled = true;
    if (ricId !== null && 'cancelIdleCallback' in window) {
      (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(ricId);
    }
    if (timerId !== null) {
      clearTimeout(timerId);
    }
  };
}

// ── Status Check ───────────────────────────────────────────

/**
 * Check if GSAP is currently loaded (synchronous).
 *
 * Useful for conditional rendering or feature detection
 * without triggering a load.
 *
 * @returns Whether GSAP has been loaded
 */
export function isGSAPLoaded(): boolean {
  return gsapInstance !== null;
}

/**
 * Check if ScrollTrigger is currently loaded (synchronous).
 *
 * @returns Whether ScrollTrigger has been loaded
 */
export function isScrollTriggerLoaded(): boolean {
  return scrollTriggerInstance !== null;
}
