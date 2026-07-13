/**
 * Theme Utility Functions
 *
 * Provides programmatic access to theme values for use in:
 * - GSAP animations (inline style values)
 * - Dynamic class generation
 * - Runtime theme validation
 * - CSS custom property access
 *
 * From DESIGN_SYSTEM §2 (Design Tokens):
 * "Tokens are the bridge between design intent and implementation reality."
 */

import type { ResolvedTheme } from '@/shared/hooks/ui/theme-context';

// ── CSS Custom Property Access ────────────────────────────

/**
 * Read a CSS custom property value from the document root.
 *
 * @param name - The CSS variable name without the `--` prefix
 * @param theme - Optional theme to read from (defaults to current)
 * @returns The computed value string, or null if not found
 *
 * @example
 * ```ts
 * const surface = getCssVar('color-surface');
 * // → '#F5F0EB' (light) or '#1C1816' (dark)
 * ```
 */
export function getCssVar(name: string): string | null {
  if (typeof document === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

/**
 * Set a CSS custom property on the document root.
 * Use sparingly — prefer static tokens over runtime overrides.
 *
 * @param name - The CSS variable name without the `--` prefix
 * @param value - The value to set
 */
export function setCssVar(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty(`--${name}`, value);
}

// ── Theme-Aware Color Utilities ───────────────────────────

/**
 * Get the resolved background color for the current theme.
 * Useful for GSAP animations that need explicit color values.
 */
export function getBackgroundColor(theme: ResolvedTheme): string {
  return theme === 'dark' ? '#1C1816' : '#F5F0EB';
}

/**
 * Get the resolved text color for the current theme.
 */
export function getTextColor(theme: ResolvedTheme): string {
  return theme === 'dark' ? '#EDE6DD' : '#2C2420';
}

/**
 * Get the resolved accent color for the current theme.
 * Dark mode uses a brighter gold for contrast (DM3).
 */
export function getAccentColor(theme: ResolvedTheme): string {
  return theme === 'dark' ? '#D4AF6A' : '#B8965A';
}

// ── Theme Attribute Utilities ─────────────────────────────

/**
 * Check if the document is currently in dark mode.
 * Reads the data-theme attribute set by ThemeProvider.
 */
export function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

/**
 * Get the current resolved theme from the DOM.
 * Falls back to 'light' if the attribute is not set.
 */
export function getResolvedThemeFromDOM(): ResolvedTheme {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.getAttribute('data-theme') as ResolvedTheme) || 'light';
}

// ── Theme Transition Utilities ────────────────────────────

/**
 * Enable the theme transition class on <html>.
 * This adds the 350ms cross-fade transition defined in tailwind.css.
 *
 * From DESIGN_SYSTEM §16 (DM7):
 * "The transition between light and dark mode is animated with a
 *  smooth, warm-toned cross-fade (300–400ms)."
 *
 * @param duration - Duration in ms to keep the transition class active (default: 400)
 */
export function enableThemeTransition(duration = 400): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.add('theme-transition');

  // Remove the class after the transition completes
  setTimeout(() => {
    root.classList.remove('theme-transition');
  }, duration);
}

// ── Reduced Motion Utilities ──────────────────────────────

/**
 * Check if prefers-reduced-motion is currently active.
 * Reads from the OS media query directly (not from Redux state).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get the appropriate duration for animations based on reduced motion preference.
 * Returns 0 when reduced motion is active, otherwise returns the given duration.
 *
 * From DESIGN_SYSTEM §15 (AC5):
 * "When prefers-reduced-motion: reduce is active, all scroll-linked reveals
 *  become instant, all hover transitions become instant, all page transitions
 *  become instant."
 */
export function getAnimationDuration(durationMs: number): number {
  return prefersReducedMotion() ? 0 : durationMs;
}

// ── Validation Utilities ──────────────────────────────────

/**
 * Required CSS custom properties that must exist for the theme to function.
 * Organized by category for systematic validation.
 */
const REQUIRED_CSS_VARS = [
  // Colors
  'color-surface',
  'color-surface-secondary',
  'color-surface-elevated',
  'color-text',
  'color-text-secondary',
  'color-text-muted',
  'color-accent',
  'color-accent-hover',
  'color-accent-active',
  'color-error',
  'color-success',
  'color-border',

  // Typography
  'font-serif',
  'font-sans',
  'text-display',
  'leading-display',
  'text-body',
  'leading-body',

  // Spacing
  'spacing-intimate',
  'spacing-personal',
  'spacing-social',
  'spacing-formal',
  'spacing-public',

  // Radius
  'radius-none',
  'radius-small',
  'radius-medium',
  'radius-large',
  'radius-full',

  // Shadows
  'shadow-none',
  'shadow-subtle',
  'shadow-medium',
  'shadow-elevated',

  // Z-index
  'z-base',
  'z-sticky',
  'z-modal',
  'z-toast',

  // Motion
  'duration-fast',
  'duration-normal',
  'easing-out',
  'easing-in',
  'easing-in-out',
] as const;

export interface ValidationResult {
  /** Whether all required variables are present */
  valid: boolean;

  /** Missing CSS variable names */
  missing: string[];

  /** Total variables checked */
  checked: number;

  /** Number of variables found */
  found: number;
}

/**
 * Validate that all required CSS custom properties are defined.
 * Run in development to catch missing tokens early.
 *
 * @example
 * ```ts
 * const result = validateThemeTokens();
 * if (!result.valid) {
 *   console.warn('Missing CSS variables:', result.missing);
 * }
 * ```
 */
export function validateThemeTokens(): ValidationResult {
  if (typeof document === 'undefined') {
    return { valid: false, missing: [...REQUIRED_CSS_VARS], checked: REQUIRED_CSS_VARS.length, found: 0 };
  }

  const style = getComputedStyle(document.documentElement);
  const missing: string[] = [];
  let found = 0;

  for (const varName of REQUIRED_CSS_VARS) {
    const value = style.getPropertyValue(`--${varName}`).trim();
    if (value) {
      found++;
    } else {
      missing.push(varName);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    checked: REQUIRED_CSS_VARS.length,
    found,
  };
}
