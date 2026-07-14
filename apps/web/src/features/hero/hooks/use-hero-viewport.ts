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
 * 2. Whether the hero is in viewport (for performance optimization)
 * 3. Whether to show 3D effects (device capability check)
 * 4. Viewport dimensions for responsive calculations
 *
 * Architecture:
 * - Uses existing useBreakpoint hook (Phase 3.6)
 * - Uses existing useMediaQuery hook (Phase 3.6)
 * - Uses IntersectionObserver for viewport visibility
 * - All checks are SSR-safe (isBrowser guard)
 */

import { useMemo } from 'react';
import { useBreakpoint } from '@/shared/hooks/ui/use-breakpoint';
import { useMediaQuery } from '@/shared/hooks/ui/use-media-query';
import type { HeroVariant } from '../hero.types';

// ── Return Type ───────────────────────────────────────────

export interface UseHeroViewportReturn {
  /** Current hero responsive variant */
  variant: HeroVariant;
  /** Whether the viewport is mobile-width */
  isMobile: boolean;
  /** Whether the viewport is tablet-width */
  isTablet: boolean;
  /** Whether the viewport is desktop-width */
  isDesktop: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** Whether the device likely supports WebGL (fine pointer + not reduced motion) */
  maySupportWebGL: boolean;
  /** Whether the viewport is in portrait orientation */
  isPortrait: boolean;
}

// ── Hook ──────────────────────────────────────────────────

/**
 * Detects viewport characteristics relevant to the hero.
 *
 * From DESIGN_SYSTEM §7:
 * "The design is mobile-first: it begins at the smallest viewport
 *  and expands gracefully."
 *
 * The hero must serve every viewport — from 375px mobile to
 * 2560px ultrawide. This hook determines WHICH responsive
 * strategy to apply.
 *
 * TODO Phase 4.5: Hero Responsive Behavior
 *   This hook provides the data; Phase 4.5 implements the responsive layouts.
 */
export function useHeroViewport(): UseHeroViewportReturn {
  const { isMobile, isTabletUp, isDesktopUp } = useBreakpoint();

  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );
  const hasFinePointer = useMediaQuery('(pointer: fine)');
  const isPortrait = useMediaQuery('(orientation: portrait)');

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
  };
}
