/**
 * React Three Fiber bootstrap helpers — configuration, capability detection,
 * and infrastructure. No actual R3F components.
 *
 * This module provides the foundation for Phase 7 (3D scenes) by
 * establishing R3F configuration, device capability checks, and
 * mount configurations.
 *
 * @deprecated Superseded by `@/features/three` (Phase 6.1+).
 * This module is retained for backward compatibility only.
 * New code should import from `@/features/three` instead.
 * This file will be removed in a future cleanup pass.
 *
 * @module r3f-bootstrap
 */

import { isMobileDevice as isMobile, supportsWebGL, prefersReducedMotion } from '@/shared/utils';

/**
 * Standard R3F configuration for the salon website.
 * Frozen to prevent accidental mutation.
 */
const R3F_CONFIG = Object.freeze({
  performance: Object.freeze({
    /** Minimum acceptable FPS before degrading quality. */
    minFPS: 30,
    /** Device pixel ratio range [min, max]. */
    pixelRatio: [1, 2] as const,
    /** Frame loop mode — 'demand' only renders when needed. */
    frameloop: 'demand' as const,
  }),
  mobile: Object.freeze({
    /** Whether to enable R3F on mobile devices. */
    enabled: false,
    /** Maximum particle count on mobile. */
    maxParticles: 50,
  }),
  fallback: Object.freeze({
    /** Whether to show a fallback for unsupported devices. */
    enabled: true,
    /** Type of fallback visual. */
    type: 'gradient' as const,
  }),
} as const);

/**
 * Configuration for mounting an R3F Canvas.
 */
interface R3FMountConfig {
  /** Frame loop mode. */
  frameloop: 'always' | 'demand' | 'never';
  /** Device pixel ratio — fixed number or [min, max] range. */
  dpr?: number | [number, number];
  /** Performance monitoring settings. */
  performance?: {
    /** Minimum FPS threshold. */
    min?: number;
    /** Maximum FPS target. */
    max?: number;
    /** Debounce time in ms for performance adjustments. */
    debounce?: number;
  };
}

/**
 * Checks whether the current device can safely render with React Three Fiber.
 *
 * Returns `false` if any of the following are true:
 * - WebGL is not supported
 * - The device is mobile (R3F is disabled on mobile by default)
 * - The user prefers reduced motion
 *
 * @example
 * ```ts
 * if (canUseR3F()) {
 *   // Mount 3D scene
 * }
 * ```
 *
 * @returns Whether R3F can be used on this device.
 */
function canUseR3F(): boolean {
  if (!supportsWebGL()) return false;
  if (isMobile() && !R3F_CONFIG.mobile.enabled) return false;
  if (prefersReducedMotion()) return false;
  return true;
}

/**
 * Returns an appropriate device pixel ratio for R3F rendering,
 * clamped to the configured range.
 *
 * @example
 * ```ts
 * const dpr = getR3FPixelRatio();
 * // On mobile: 1
 * // On desktop with Retina: 2
 * ```
 *
 * @returns Clamped device pixel ratio.
 */
function getR3FPixelRatio(): number {
  if (typeof window === 'undefined') return 1;

  if (isMobile()) {
    return 1;
  }

  const [min, max] = R3F_CONFIG.performance.pixelRatio;
  const deviceDpr = window.devicePixelRatio || 1;
  return Math.min(Math.max(deviceDpr, min), max);
}

/**
 * Returns the standard R3F Canvas mount configuration for the salon website.
 *
 * @example
 * ```tsx
 * const config = getDefaultMountConfig();
 * <Canvas frameloop={config.frameloop} dpr={config.dpr} />
 * ```
 *
 * @returns Default R3F mount configuration.
 */
function getDefaultMountConfig(): R3FMountConfig {
  return {
    frameloop: R3F_CONFIG.performance.frameloop,
    dpr: getR3FPixelRatio(),
    performance: {
      min: R3F_CONFIG.performance.minFPS / 60,
      max: 1,
      debounce: 200,
    },
  };
}

export type { R3FMountConfig };
export { R3F_CONFIG, canUseR3F, getR3FPixelRatio, getDefaultMountConfig };
