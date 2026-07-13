/**
 * Responsive Helpers
 *
 * Utility functions for responsive layout calculations.
 * These bridge the gap between breakpoint tokens and runtime logic.
 *
 * From DESIGN_SYSTEM §7:
 * "Mobile is not a smaller version of desktop.
 *  Desktop is the enhancement, not the other way around."
 */

import { BREAKPOINTS } from './breakpoints';

// ── Viewport Detection ───────────────────────────────────

/**
 * Get the current viewport width.
 * SSR-safe: returns 0 when window is unavailable.
 */
export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth;
}

/**
 * Get the current viewport height.
 * SSR-safe: returns 0 when window is unavailable.
 */
export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight;
}

/**
 * Get the current active breakpoint key.
 * SSR-safe: returns 'mobile' when window is unavailable.
 */
export function getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'wide' {
  const width = getViewportWidth();

  if (width >= BREAKPOINTS.wide) return 'wide';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

// ── Proportional Calculations ────────────────────────────

/**
 * Calculate a value as a percentage of the viewport width.
 *
 * From DESIGN_SYSTEM §6:
 * "Desktop: 60–65% of viewport."
 *
 * @param percent - The percentage (0–100)
 * @returns The pixel value
 *
 * @example
 * ```ts
 * // Get 60% of viewport width (content width)
 * const contentWidth = vw(60);
 * ```
 */
export function vw(percent: number): number {
  return (getViewportWidth() * percent) / 100;
}

/**
 * Calculate a value as a percentage of the viewport height.
 *
 * @param percent - The percentage (0–100)
 * @returns The pixel value
 *
 * @example
 * ```ts
 * // Get 100% viewport height (full screen section)
 * const fullHeight = vh(100);
 * ```
 */
export function vh(percent: number): number {
  return (getViewportHeight() * percent) / 100;
}

// ── Responsive Value Resolution ──────────────────────────

/**
 * Configuration for responsive values at each breakpoint.
 */
interface ResponsiveConfig<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

/**
 * Resolve a responsive value based on the current breakpoint.
 *
 * Falls back to the nearest smaller breakpoint if the current
 * one is not defined.
 *
 * @param config - The responsive configuration object
 * @returns The value for the current breakpoint
 *
 * @example
 * ```ts
 * const columns = resolveResponsive({
 *   mobile: 1,
 *   tablet: 2,
 *   desktop: 3,
 *   wide: 4,
 * });
 * // Returns: 1 on mobile, 2 on tablet, 3 on desktop, 4 on wide
 * ```
 */
export function resolveResponsive<T>(config: ResponsiveConfig<T>): T {
  const breakpoint = getCurrentBreakpoint();

  const order: Array<keyof ResponsiveConfig<T>> = ['mobile', 'tablet', 'desktop', 'wide'];
  const currentIndex = order.indexOf(breakpoint);

  // Walk backwards from current breakpoint to find the nearest defined value
  for (let i = currentIndex; i >= 0; i--) {
    const key = order[i];
    const value = config[key];
    if (value !== undefined) return value;
  }

  // Walk forwards if nothing found below
  for (let i = currentIndex; i < order.length; i++) {
    const key = order[i];
    const value = config[key];
    if (value !== undefined) return value;
  }

  throw new Error('[resolveResponsive] No breakpoint value defined');
}

// ── Grid Helpers ─────────────────────────────────────────

/**
 * Calculate the width of a grid column at the current viewport.
 *
 * From DESIGN_SYSTEM §6:
 * "Desktop: Generous column system. Tablet: Adapted column system.
 *  Mobile: Single column."
 *
 * @param columns - Number of columns in the grid
 * @param gap - Gap between columns in pixels
 * @param margins - Total horizontal margins in pixels
 * @returns The width of a single column in pixels
 */
export function getGridColumnWidth(
  columns: number,
  gap: number = 24,
  margins: number = 0,
): number {
  const viewportWidth = getViewportWidth();
  const availableWidth = viewportWidth - margins - gap * (columns - 1);
  return Math.max(0, availableWidth / columns);
}

/**
 * Check if a minimum viewport width is met.
 * Useful for conditional logic based on breakpoints.
 *
 * @param minWidth - Minimum viewport width in pixels
 * @returns Whether the viewport meets the minimum width
 *
 * @example
 * ```ts
 * if (meetsMinWidth(1024)) {
 *   // Desktop or wider
 * }
 * ```
 */
export function meetsMinWidth(minWidth: number): boolean {
  return getViewportWidth() >= minWidth;
}

// ── Types ────────────────────────────────────────────────

export type ResponsiveValue<T> = T | ResponsiveConfig<T>;
