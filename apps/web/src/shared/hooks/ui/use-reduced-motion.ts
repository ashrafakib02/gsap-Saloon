import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux-store';

/**
 * Reads the current reduced-motion state from Redux.
 *
 * ThemeProvider is the sole subscriber to the
 * prefers-reduced-motion media query and the sole writer of
 * state.ui.isReducedMotion. This hook is a thin, read-only accessor.
 *
 * Returns the current reduced motion state from Redux.
 */
export function useReducedMotion(): boolean {
  return useSelector((state: RootState) => state.ui.isReducedMotion);
}
