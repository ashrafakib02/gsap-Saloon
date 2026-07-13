/**
 * Breakpoint Tokens
 *
 * From DESIGN_SYSTEM §7 (Breakpoints):
 * "Breakpoints define the viewport widths at which the layout adapts.
 *  They exist because the design must serve every device — from a 375px
 *  mobile phone to a 2560px ultrawide monitor — without compromising
 *  the brand experience."
 *
 * Breakpoint definitions:
 *   mobile:  0–767px   (single-column, touch-first)
 *   tablet:  768–1023px (transitional layout)
 *   desktop: 1024–1439px (full editorial layout)
 *   wide:    1440px+    (expanded desktop)
 *
 * These tokens mirror the Tailwind responsive prefixes:
 *   mobile = (no prefix)
 *   tablet = md:
 *   desktop = lg:
 *   wide = xl:
 */

// ── Breakpoint Widths ────────────────────────────────────

/**
 * Raw breakpoint pixel values.
 * Use for programmatic comparisons (e.g., `window.innerWidth >= BREAKPOINTS.tablet`).
 *
 * @example
 * ```ts
 * import { BREAKPOINTS } from '@/shared/tokens/breakpoints';
 *
 * if (window.innerWidth >= BREAKPOINTS.tablet) {
 *   // Tablet or larger
 * }
 * ```
 */
export const BREAKPOINTS = {
  /** 0–767px: Single-column, touch-first */
  mobile: 0,

  /** 768–1023px: Transitional layout */
  tablet: 768,

  /** 1024–1439px: Full editorial layout */
  desktop: 1024,

  /** 1440px+: Expanded desktop */
  wide: 1440,
} as const;

// ── Max-Width Values ─────────────────────────────────────

/**
 * Content width constraints per breakpoint.
 * From DESIGN_SYSTEM §6:
 * "Desktop (1440px+): 60–65% of viewport. Tablet: proportional.
 *  Mobile: near-full viewport with margins."
 */
export const MAX_WIDTHS = {
  /** Narrow content — prose, single-column text */
  narrow: '65ch',

  /** Content width — 60–65% on desktop, full on mobile */
  content: '60%',

  /** Wide content — galleries, multi-column */
  wide: '90%',

  /** Full viewport width */
  full: '100%',
} as const;

// ── Media Query Strings ──────────────────────────────────

/**
 * Ready-to-use media query strings for use with
 * `window.matchMedia()` or `useMediaQuery()`.
 *
 * Mobile-first: these represent minimum widths (min-width).
 *
 * @example
 * ```ts
 * import { MEDIA_QUERIES } from '@/shared/tokens/breakpoints';
 *
 * const mql = window.matchMedia(MEDIA_QUERIES.tabletUp);
 * ```
 */
export const MEDIA_QUERIES = {
  /** min-width: 768px */
  tabletUp: '(min-width: 768px)',

  /** min-width: 1024px */
  desktopUp: '(min-width: 1024px)',

  /** min-width: 1440px */
  wideUp: '(min-width: 1440px)',

  /** max-width: 767px */
  mobileOnly: '(max-width: 767px)',

  /** max-width: 1023px */
  tabletAndBelow: '(max-width: 1023px)',
} as const;

// ── Types ────────────────────────────────────────────────

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type MaxWidthKey = keyof typeof MAX_WIDTHS;
