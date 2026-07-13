/**
 * Device Detection Utilities
 *
 * SSR-safe: all functions return `false` when `window` is unavailable.
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Performance gate for 3D: check device memory, viewport, reduced motion"
 *
 * @example
 * ```ts
 * if (isMobile()) {
 *   // Simplify animations for mobile
 * }
 * ```
 */

/**
 * Check if the current device is a mobile device
 * (viewport width < 768px).
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if the current device is a tablet
 * (viewport width 768–1023px).
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if the current device is desktop
 * (viewport width >= 1024px).
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

/**
 * Check if the device has a touch screen.
 * Uses both `ontouchstart` and `maxTouchPoints` for accuracy.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

/**
 * Check if the device has a fine pointer (mouse/cursor).
 * From DESIGN_SYSTEM §7: "Mobile is touch-first, Desktop is hover-first"
 */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

/**
 * Get device pixel ratio.
 * Useful for determining if a display is Retina/HiDPI.
 */
export function getPixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}
