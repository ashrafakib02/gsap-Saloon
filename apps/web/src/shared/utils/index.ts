/**
 * Shared Utilities — Barrel Export
 */

// ── Theme Utilities ──────────────────────────────────────
export {
  getCssVar,
  setCssVar,
  getBackgroundColor,
  getTextColor,
  getAccentColor,
  isDarkMode,
  getResolvedThemeFromDOM,
  enableThemeTransition,
  prefersReducedMotion,
  getAnimationDuration,
  validateThemeTokens,
} from './theme';
export type { ValidationResult } from './theme';

// ── Class Name Utility ───────────────────────────────────
export { cn } from './class-name';

// ── Math Utilities ───────────────────────────────────────
export { clamp, lerp, mapRange } from './math';

// ── Async Utilities ──────────────────────────────────────
export { sleep } from './async';

// ── Assertion Utilities ──────────────────────────────────
export { invariant, assertNever, safeParse } from './assertions';

// ── Memoization Utilities ────────────────────────────────
export { memoize, createMemoizedGetter } from './memoize';

// ── Device Detection ─────────────────────────────────────
export {
  isMobile as isMobileDevice,
  isTablet as isTabletDevice,
  isDesktop as isDesktopDevice,
  isTouchDevice,
  hasFinePointer,
  getPixelRatio,
} from './device-detection';

// ── Feature Detection ────────────────────────────────────
export {
  supportsIntersectionObserver,
  supportsResizeObserver,
  supportsWebGL,
  supportsFontLoadingAPI,
  supportsSmoothScroll,
  supportsClipPath,
  supportsCSSCustomProperties,
  getDeviceMemory,
  isSlowConnection,
} from './feature-detection';

// ── Passive Event Helpers ────────────────────────────────
export {
  passiveScrollOptions,
  passiveTouchOptions,
  nonPassiveOptions,
  addScrollListener,
} from './passive-events';
