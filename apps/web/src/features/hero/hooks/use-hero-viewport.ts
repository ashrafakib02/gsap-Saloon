/**
 * useHeroViewport — Hero Viewport Behavior Hook
 *
 * From DESIGN_SYSTEM §7 (Breakpoints):
 * "Breakpoints define the viewport widths at which the layout adapts."
 *
 * From DESIGN_SYSTEM §7 (Mobile-First Philosophy):
 * "Mobile is not a smaller version of desktop. Mobile is a different
 *  context — a different physical relationship between the user
 *  and the screen."
 *
 * This hook detects viewport changes and provides:
 * 1. Current hero variant (mobile/tablet/desktop)
 * 2. Orientation (portrait/landscape)
 * 3. Height awareness (small-height viewports)
 * 4. Width awareness (ultra-wide viewports)
 * 5. Whether reduced motion is preferred
 * 6. Device capability detection (WebGL, fine pointer)
 *
 * From PRODUCT_VISION §7 P7:
 * "Mobile is Not a Compromise — It Is the Primary Canvas"
 *
 * Phase 4.5: Extended viewport detection for responsive behavior.
 * The hero must feel intentionally designed on every device —
 * not simply making things smaller.
 *
 * Architecture:
 * - Uses existing useBreakpoint hook (Phase 3.6)
 * - Uses existing useMediaQuery hook (Phase 3.6)
 * - All checks are SSR-safe (isBrowser guard)
 * - Responsive values are consumed by hero.config.ts and hero-responsive.css
 */

import { useMemo } from 'react';
import { useBreakpoint } from '@/shared/hooks/ui/use-breakpoint';
import { useMediaQuery } from '@/shared/hooks/ui/use-media-query';
import type { HeroVariant } from '../hero.types';

// ── Return Type ───────────────────────────────────────────

export interface UseHeroViewportReturn {
  /** Current hero responsive variant (mobile/tablet/desktop) */
  variant: HeroVariant;
  /** Whether the viewport is mobile-width (< 768px) */
  isMobile: boolean;
  /** Whether the viewport is tablet-width (768–1023px) */
  isTablet: boolean;
  /** Whether the viewport is desktop-width (1024px+) */
  isDesktop: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** Whether the device likely supports WebGL (fine pointer + not reduced motion) */
  maySupportWebGL: boolean;
  /** Whether the viewport is in portrait orientation */
  isPortrait: boolean;

  /* ── Phase 4.5: Extended Responsive Data ──────────────── */

  /** Whether the viewport is in landscape orientation */
  isLandscape: boolean;
  /** Whether the viewport height is small (< 600px) — content must fit without scrolling */
  isSmallHeight: boolean;
  /** Whether the viewport is very short (< 420px) — minimal hero, scroll indicator hidden */
  isVerySmallHeight: boolean;
  /** Whether the viewport is ultra-wide (> 2560px) — content must be constrained */
  isUltraWide: boolean;
}

// ── Hook ──────────────────────────────────────────────────

/**
 * Detects viewport characteristics relevant to the hero.
 *
 * From DESIGN_SYSTEM §7:
 * "The design is mobile-first: it begins at the smallest viewport
 *  and expands gracefully."
 *
 * From DESIGN_SYSTEM §7:
 * "The design must serve every device — from a 375px mobile
 *  phone to a 2560px ultrawide monitor — without compromising
 *  the brand experience."
 *
 * The hero must serve every viewport. This hook determines
 * WHICH responsive strategy to apply by detecting:
 * - Width category (mobile/tablet/desktop) → variant
 * - Orientation (portrait/landscape) → composition adjustments
 * - Height (normal/small/very-small) → spacing adjustments
 * - Width extremes (ultra-wide) → content constraints
 *
 * These data points drive:
 * - hero.config.ts values (spatial composition)
 * - hero-responsive.css media queries (CSS overrides)
 * - Component-level conditional behavior
 */
export function useHeroViewport(): UseHeroViewportReturn {
  const { isMobile, isTabletUp, isDesktopUp } = useBreakpoint();

  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );
  const hasFinePointer = useMediaQuery('(pointer: fine)');
  const isPortrait = useMediaQuery('(orientation: portrait)');

  /* ── Extended Responsive Detection (Phase 4.5) ────────── */

  /** Orientation: landscape vs portrait */
  const isLandscape = !isPortrait;

  /**
   * Height awareness — critical for mobile landscape and
   * short desktop viewports (e.g., split-screen).
   *
   * From DESIGN_SYSTEM §7:
   * "The design must serve every device."
   *
   * Small height (< 600px): reduce vertical spacing,
   * ensure content fits without scrolling.
   * Very small height (< 420px): minimal hero,
   * hide scroll indicator, compress typography.
   */
  const isSmallHeight = useMediaQuery('(max-height: 599px)');
  const isVerySmallHeight = useMediaQuery('(max-height: 419px)');

  /**
   * Ultra-wide detection — for screens wider than 2560px.
   *
   * From DESIGN_SYSTEM §7:
   * "Content width scales proportionally; margins grow."
   *
   * Ultra-wide: constrain content to prevent uncomfortable
   * reading widths. Content does not stretch to fill.
   */
  const isUltraWide = useMediaQuery('(min-width: 2560px)');

  const variant: HeroVariant = useMemo(() => {
    if (isMobile) return 'mobile';
    if (!isDesktopUp) return 'tablet';
    return 'desktop';
  }, [isMobile, isDesktopUp]);

  return {
    variant,
    isMobile,
    isTablet: isTabletUp && !isDesktopUp,
    isDesktop: isDesktopUp,
    prefersReducedMotion,
    /* WebGL requires fine pointer (mouse) and no reduced-motion preference.
     * From VISUAL_RULES D6: "3D effects respect prefers-reduced-motion" */
    maySupportWebGL: hasFinePointer && !prefersReducedMotion,
    isPortrait,
    isLandscape,
    isSmallHeight,
    isVerySmallHeight,
    isUltraWide,
  };
}
