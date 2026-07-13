import { useMediaQuery } from './use-media-query';

/**
 * Breakpoint definitions from DESIGN_SYSTEM §7:
 * - mobile: 0–767px
 * - tablet: 768–1023px
 * - desktop: 1024–1439px
 * - wide: 1440px+
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface UseBreakpointResult {
  /** Current active breakpoint */
  breakpoint: Breakpoint;
  /** Whether viewport is at least tablet (768px+) */
  isTabletUp: boolean;
  /** Whether viewport is at least desktop (1024px+) */
  isDesktopUp: boolean;
  /** Whether viewport is at least wide (1440px+) */
  isWideUp: boolean;
  /** Whether viewport is below tablet (< 768px) */
  isMobile: boolean;
}

/**
 * Returns the current responsive breakpoint and convenience booleans.
 *
 * Mobile-first: starts at mobile and expands.
 * From DESIGN_SYSTEM §7:
 * "Mobile is not a smaller version of desktop. Mobile is a different context."
 *
 * @example
 * ```tsx
 * const { breakpoint, isDesktopUp } = useBreakpoint();
 * if (isDesktopUp) {
 *   // Show multi-column layout
 * }
 * ```
 */
export function useBreakpoint(): UseBreakpointResult {
  const isTabletUp = useMediaQuery('(min-width: 768px)');
  const isDesktopUp = useMediaQuery('(min-width: 1024px)');
  const isWideUp = useMediaQuery('(min-width: 1440px)');

  let breakpoint: Breakpoint = 'mobile';
  if (isWideUp) {
    breakpoint = 'wide';
  } else if (isDesktopUp) {
    breakpoint = 'desktop';
  } else if (isTabletUp) {
    breakpoint = 'tablet';
  }

  return {
    breakpoint,
    isTabletUp,
    isDesktopUp,
    isWideUp,
    isMobile: !isTabletUp,
  };
}
