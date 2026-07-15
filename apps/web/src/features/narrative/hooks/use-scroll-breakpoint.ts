/**
 * useScrollBreakpoint — Viewport Breakpoint Hook
 *
 * Returns the current viewport breakpoint and related
 * dimension information. Integrates with the existing
 * breakpoint system from shared/tokens/breakpoints.
 *
 * From DESIGN_SYSTEM §7:
 * "Breakpoints define the viewport widths at which the layout adapts."
 *
 * Phase 5.5: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { isMobile, isDesktop, breakpoint, viewportWidth } = useScrollBreakpoint();
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileLayout /> : <DesktopLayout />}
 *       <span>Viewport: {viewportWidth}px ({breakpoint})</span>
 *     </div>
 *   );
 * }
 * ```
 */

import { useScrollState } from './use-scroll-state';

import type { ScrollState, ScrollBreakpoint } from '../scroll-state.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollBreakpoint.
 */
export interface UseScrollBreakpointReturn {
  /** Current breakpoint */
  readonly breakpoint: ScrollBreakpoint;
  /** Viewport width */
  readonly viewportWidth: number;
  /** Viewport height */
  readonly viewportHeight: number;
  /** Whether viewport is at least desktop width */
  readonly isDesktop: boolean;
  /** Whether viewport is tablet width */
  readonly isTablet: boolean;
  /** Whether viewport is mobile width */
  readonly isMobile: boolean;
  /** Whether viewport is wide width */
  readonly isWide: boolean;
  /** Whether the device is touch-capable */
  readonly isTouchDevice: boolean;
  /** Current primary pointer type */
  readonly pointerType: 'mouse' | 'touch' | 'pen' | 'none';
  /** Whether prefers-reduced-motion is active */
  readonly isReducedMotion: boolean;
}

// ── Selector ───────────────────────────────────────────────

/**
 * Extracts breakpoint-relevant fields from the scroll state.
 */
function breakpointSelector(state: ScrollState): UseScrollBreakpointReturn {
  return {
    breakpoint: state.breakpoint,
    viewportWidth: state.viewportWidth,
    viewportHeight: state.viewportHeight,
    isDesktop: state.breakpoint === 'desktop' || state.breakpoint === 'wide',
    isTablet: state.breakpoint === 'tablet',
    isMobile: state.breakpoint === 'mobile',
    isWide: state.breakpoint === 'wide',
    isTouchDevice: state.isTouchDevice,
    pointerType: state.pointerType,
    isReducedMotion: state.isReducedMotion,
  };
}

/**
 * Equality function for the breakpoint selector.
 */
function breakpointEquality(
  prev: UseScrollBreakpointReturn,
  next: UseScrollBreakpointReturn,
): boolean {
  return (
    prev.breakpoint === next.breakpoint &&
    prev.viewportWidth === next.viewportWidth &&
    prev.viewportHeight === next.viewportHeight &&
    prev.isTouchDevice === next.isTouchDevice &&
    prev.pointerType === next.pointerType &&
    prev.isReducedMotion === next.isReducedMotion
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns the current viewport breakpoint and responsive state.
 *
 * Breakpoint changes are detected via the scroll state manager's
 * resize handler (debounced at 150ms, matching DEBOUNCE.resize).
 *
 * @returns Breakpoint and viewport information
 */
export function useScrollBreakpoint(): UseScrollBreakpointReturn {
  return useScrollState(breakpointSelector, breakpointEquality);
}
