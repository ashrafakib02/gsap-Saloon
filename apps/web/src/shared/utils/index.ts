/**
 * Shared Utilities — Barrel Export
 */

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
