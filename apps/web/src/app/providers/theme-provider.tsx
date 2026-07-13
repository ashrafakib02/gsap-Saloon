import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux-store';
import { setReducedMotion } from '@/features/shared/store/ui-slice';
import { ThemeContext } from '@/shared/hooks/ui/theme-context';
import type { ThemeMode, ResolvedTheme } from '@/shared/hooks/ui/theme-context';

// ── Constants ─────────────────────────────────────────────

const STORAGE_KEY = 'sovereign-theme-preference';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

// ── Props ─────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode;
}

// ── Helpers ───────────────────────────────────────────────

/**
 * Read persisted theme preference from localStorage.
 * Returns 'system' if no preference is stored or if localStorage is unavailable.
 */
function getPersistedMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (private browsing, SSR)
  }

  return 'system';
}

/**
 * Persist theme preference to localStorage.
 */
function persistMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Resolve the user's mode preference to a concrete theme.
 * 'system' mode checks the OS prefers-color-scheme preference.
 */
function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): ResolvedTheme {
  if (mode === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return mode;
}

// ── Provider ──────────────────────────────────────────────

/**
 * Global theme provider that synchronizes OS-level preferences
 * with application state and provides theme controls.
 *
 * Handles:
 * - prefers-color-scheme detection → theme mode resolution
 * - prefers-reduced-motion detection → Redux sync
 * - localStorage persistence for theme preference
 * - data-theme attribute on <html> for CSS variable switching
 * - color-scheme CSS property for native form styling
 * - Tailwind dark class management
 *
 * From TECHNICAL_ARCHITECTURE §16.6:
 * "When prefers-reduced-motion: reduce is active, all GSAP animations
 *  set to duration: 0, Lenis smooth scroll is disabled."
 *
 * From DESIGN_SYSTEM §16 (Dark Mode, DM6):
 * "Dark mode respects prefers-color-scheme: dark as the trigger,
 *  supplemented by a manual toggle."
 *
 * From DESIGN_SYSTEM §16 (Dark Mode, DM7):
 * "The transition between light and dark mode is animated with a
 *  smooth, warm-toned cross-fade (300–400ms)."
 *
 * Provider hierarchy (from root-provider.tsx):
 *   ReduxProvider → QueryProvider → ThemeProvider → AnimationProvider → ...
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useDispatch();

  // ── Theme Mode State ──────────────────────────────────

  const [mode, setModeState] = useState<ThemeMode>(() => getPersistedMode());
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(COLOR_SCHEME_QUERY).matches;
  });

  // ── Reduced Motion (via Redux, existing pattern) ──────

  const isReducedMotion = useSelector((state: RootState) => state.ui.isReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(REDUCED_MOTION_QUERY);

    // Sync initial value
    dispatch(setReducedMotion(mql.matches));

    // Listen for changes (user toggles OS setting while page is open)
    const handleChange = (e: MediaQueryListEvent): void => {
      dispatch(setReducedMotion(e.matches));
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [dispatch]);

  // ── Color Scheme Detection ────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(COLOR_SCHEME_QUERY);

    // Listen for OS color scheme changes
    const handleChange = (e: MediaQueryListEvent): void => {
      setSystemPrefersDark(e.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // ── Resolved Theme ────────────────────────────────────

  const resolvedTheme = useMemo(
    () => resolveTheme(mode, systemPrefersDark),
    [mode, systemPrefersDark],
  );

  // ── DOM Side Effects ──────────────────────────────────

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Set data-theme attribute for CSS variable switching
    root.setAttribute('data-theme', resolvedTheme);

    // Set color-scheme for native form styling (scrollbars, form controls)
    root.style.colorScheme = resolvedTheme;

    // Set Tailwind dark class for dark: variant support
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    return () => {
      root.removeAttribute('data-theme');
      root.style.colorScheme = '';
      root.classList.remove('dark');
    };
  }, [resolvedTheme]);

  // ── Theme Mode Setter ─────────────────────────────────

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    persistMode(newMode);
  }, []);

  // ── Context Value ─────────────────────────────────────

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      isReducedMotion,
    }),
    [mode, resolvedTheme, setMode, isReducedMotion],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
