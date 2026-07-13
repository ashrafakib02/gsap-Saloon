import { useCallback, useMemo } from 'react';
import { useTheme } from './theme-context';
import type { ThemeMode, ResolvedTheme } from './theme-context';

// ── Core Hook ─────────────────────────────────────────────

export { useTheme } from './theme-context';

// ── Convenience Hooks ─────────────────────────────────────

/**
 * Returns only the resolved theme (light/dark).
 * Use when you only need to know which theme is active,
 * not the full theme context.
 *
 * @example
 * ```tsx
 * const theme = useResolvedTheme();
 * const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
 * ```
 */
export function useResolvedTheme(): ResolvedTheme {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}

/**
 * Returns whether the current theme is dark mode.
 * Use for simple conditional logic.
 *
 * @example
 * ```tsx
 * const isDark = useIsDark();
 * ```
 */
export function useIsDark(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
}

/**
 * Returns the theme mode setter.
 * Use when you only need to change the theme, not read it.
 *
 * @example
 * ```tsx
 * const setMode = useThemeMode();
 * setMode('dark');
 * ```
 */
export function useThemeMode(): (mode: ThemeMode) => void {
  const { setMode } = useTheme();
  return useCallback((mode: ThemeMode) => setMode(mode), [setMode]);
}

/**
 * Returns computed theme-aware values for common UI patterns.
 * Provides CSS custom property names and token values for the current theme.
 *
 * @example
 * ```tsx
 * const tokens = useThemeTokens();
 * // tokens.colors.surface → '#F5F0EB' (light) or '#1C1816' (dark)
 * // tokens.cssVar('color-surface') → 'var(--color-surface)'
 * ```
 */
export function useThemeTokens() {
  const { resolvedTheme } = useTheme();

  const tokens = useMemo(() => ({
    /** Current resolved theme */
    theme: resolvedTheme,

    /** Whether in dark mode */
    isDark: resolvedTheme === 'dark',

    /**
     * Get a CSS custom property reference.
     * Returns `var(--name)` for use in inline styles or CSS-in-JS.
     */
    cssVar: (name: string) => `var(--${name})`,

    /**
     * Theme-aware class name selector.
     * Returns 'dark' or 'light' for use with Tailwind's dark: variant.
     */
    darkClass: resolvedTheme === 'dark' ? 'dark' : 'light',
  }), [resolvedTheme]);

  return tokens;
}

/**
 * Returns reduced-motion state and toggle.
 * Convenience hook for components that need to disable animations.
 *
 * @example
 * ```tsx
 * const { isReducedMotion } = useReducedMotionTheme();
 * ```
 */
export function useReducedMotionTheme(): { isReducedMotion: boolean } {
  const { isReducedMotion } = useTheme();
  return useMemo(() => ({ isReducedMotion }), [isReducedMotion]);
}
