import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux-store';
import { setReducedMotion } from '@/features/shared/store/ui-slice';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Detects and synchronizes the OS-level prefers-reduced-motion setting
 * with Redux state. Listens for real-time changes.
 *
 * Returns the current reduced motion state from Redux.
 */
export function useReducedMotion(): boolean {
  const dispatch = useDispatch();
  const isReducedMotion = useSelector((state: RootState) => state.ui.isReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(QUERY);

    // Sync initial value
    dispatch(setReducedMotion(mql.matches));

    // Listen for changes (user toggles OS setting while page is open)
    const handleChange = (e: MediaQueryListEvent): void => {
      dispatch(setReducedMotion(e.matches));
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [dispatch]);

  return isReducedMotion;
}
