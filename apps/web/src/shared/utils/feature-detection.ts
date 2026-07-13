/**
 * Browser Feature Detection Utilities
 *
 * Detects browser capabilities rather than checking user agents.
 * From TECHNICAL_ARCHITECTURE §15.6:
 * "Passive event listeners, requestAnimationFrame for visual updates"
 *
 * @example
 * ```ts
 * if (supportsWebGL()) {
 *   // Enable 3D effects
 * }
 * ```
 */

/**
 * Check if the browser supports IntersectionObserver.
 */
export function supportsIntersectionObserver(): boolean {
  if (typeof window === 'undefined') return false;
  return 'IntersectionObserver' in window;
}

/**
 * Check if the browser supports ResizeObserver.
 */
export function supportsResizeObserver(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ResizeObserver' in window;
}

/**
 * Check if the browser supports WebGL (for React Three Fiber).
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "3D is disabled on mobile if it impacts performance."
 */
export function supportsWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Check if the browser supports the Font Loading API.
 */
export function supportsFontLoadingAPI(): boolean {
  if (typeof document === 'undefined') return false;
  return 'fonts' in document;
}

/**
 * Check if the browser supports the CSS `scroll-behavior: smooth` property.
 */
export function supportsSmoothScroll(): boolean {
  if (typeof document === 'undefined') return false;
  return 'scrollBehavior' in document.documentElement.style;
}

/**
 * Check if the browser supports CSS `clip-path`.
 * From TECHNICAL_ARCHITECTURE §8.6:
 * "Transformation Dissolve uses clip-path animated by GSAP ScrollTrigger."
 */
export function supportsClipPath(): boolean {
  if (typeof document === 'undefined') return false;
  return CSS.supports('clip-path', 'inset(0 0 0 0)');
}

/**
 * Check if the browser supports CSS custom properties (variables).
 */
export function supportsCSSCustomProperties(): boolean {
  if (typeof window === 'undefined') return false;
  return window.CSS?.supports?.('color', 'var(--test)') ?? false;
}

/**
 * Get the device memory in GB (if available via the Memory API).
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Check device memory: if navigator.deviceMemory < 4, disable 3D."
 */
export function getDeviceMemory(): number | undefined {
  if (typeof navigator === 'undefined') return undefined;
  // navigator.deviceMemory is a Chrome-only API
  return (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
}

/**
 * Check if the network connection is slow (2G/slow-2G).
 * From TECHNICAL_ARCHITECTURE §15.10:
 * "3D disabled on slow connections (detected via navigator.connection)."
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string };
  }).connection;
  if (!conn) return false;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
}
