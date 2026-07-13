import { createContext, useContext } from 'react';

// ── Types ─────────────────────────────────────────────────

/**
 * User's preferred theme mode.
 * - 'light': Always light mode
 * - 'dark': Always dark mode
 * - 'system': Follow OS preference (prefers-color-scheme)
 *
 * From DESIGN_SYSTEM §16 (Dark Mode, DM6):
 * "Dark mode respects prefers-color-scheme: dark as the trigger,
 *  supplemented by a manual toggle."
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * The resolved theme after checking system preference.
 * Never 'system' — always 'light' or 'dark'.
 */
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  /** User's preferred mode (light/dark/system) */
  mode: ThemeMode;

  /** The resolved mode after checking system preference */
  resolvedTheme: ResolvedTheme;

  /** Set the theme mode — persists to localStorage */
  setMode: (mode: ThemeMode) => void;

  /** Whether prefers-reduced-motion is active */
  isReducedMotion: boolean;
}

// ── Context ───────────────────────────────────────────────

/**
 * Theme context providing access to theme state and controls.
 *
 * From TECHNICAL_ARCHITECTURE §16.6:
 * "ThemeProvider sits in the provider hierarchy between QueryProvider
 *  and AnimationProvider, synchronizing OS preferences with app state."
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── Hook ──────────────────────────────────────────────────

/**
 * Access theme state and controls from any descendant component.
 * Must be used within a ThemeProvider.
 *
 * @example
 * ```tsx
 * const { resolvedTheme, setMode, isReducedMotion } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
