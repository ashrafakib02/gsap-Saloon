/**
 * useThreeViewport — Live Viewport Detection for 3D
 *
 * Detects viewport characteristics relevant to 3D rendering: classification
 * (mobile/tablet/desktop), dimensions, aspect ratio, and device pixel ratio.
 * Unlike the capability probe (which is a one-time snapshot), viewport data
 * is live and updates as the user resizes or rotates their device.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { useMemo } from 'react';

import { useBreakpoint } from '@/shared/hooks/ui/use-breakpoint';
import { useWindowSize } from '@/shared/hooks/ui/use-window-size';
import { BREAKPOINTS } from '@/shared/tokens/breakpoints';

// ── Return Type ──────────────────────────────────────────

/**
 * Live viewport information relevant to 3D rendering.
 */
export interface UseThreeViewportReturn {
  /** Whether the viewport width is below the tablet breakpoint (< 768px). */
  readonly isMobileViewport: boolean;
  /** Whether the viewport width is in the tablet range (768–1023px). */
  readonly isTabletViewport: boolean;
  /** Whether the viewport width is at or above the desktop breakpoint (≥ 1024px). */
  readonly isDesktopViewport: boolean;
  /** Current viewport width in CSS pixels. */
  readonly width: number;
  /** Current viewport height in CSS pixels. */
  readonly height: number;
  /** Width-to-height ratio (`width / height`). */
  readonly aspectRatio: number;
  /** Current device pixel ratio (`window.devicePixelRatio`). */
  readonly devicePixelRatio: number;
}

// ── Hook ─────────────────────────────────────────────────

/**
 * Detect live viewport characteristics for 3D rendering decisions.
 *
 * This hook is independent of the Three context — it can be used anywhere
 * in the tree. It reuses shared breakpoint and window-size hooks for
 * consistency with the rest of the application.
 *
 * `isMobileViewport` matches the probe in `three.config.ts` (viewport
 * width < `BREAKPOINTS.tablet`) so the initial capability classification
 * and the live viewport detection agree.
 *
 * @example
 * ```tsx
 * function ViewportInfo() {
 *   const { isMobileViewport, width, aspectRatio } = useThreeViewport();
 *   return <span>{width}px ({isMobileViewport ? 'mobile' : 'desktop'})</span>;
 * }
 * ```
 */
export function useThreeViewport(): UseThreeViewportReturn {
  const { breakpoint } = useBreakpoint();
  const { width, height } = useWindowSize();

  const isMobileViewport = useMemo(
    () => width < BREAKPOINTS.tablet,
    [width],
  );

  const isTabletViewport = useMemo(
    () => width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    [width],
  );

  const isDesktopViewport = useMemo(
    () => width >= BREAKPOINTS.desktop,
    [width],
  );

  const aspectRatio = useMemo(
    () => (height > 0 ? width / height : 1),
    [width, height],
  );

  const devicePixelRatio = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  }, []);

  /* Suppress unused breakpoint — the hook is included for future
     breakpoint-crossing logic (Phase 6.8 performance monitoring). */
  void breakpoint;

  return useMemo<UseThreeViewportReturn>(
    () => ({
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      width,
      height,
      aspectRatio,
      devicePixelRatio,
    }),
    [
      isMobileViewport,
      isTabletViewport,
      isDesktopViewport,
      width,
      height,
      aspectRatio,
      devicePixelRatio,
    ],
  );
}
