import { useState, useCallback, useEffect } from 'react';
import type { CursorVariant, CursorContextValue } from '@/shared/hooks/ui/use-cursor';

/**
 * Provides cursor state management for the custom cursor system.
 * Tracks mouse position, active variant, and whether the cursor is enabled.
 *
 * Desktop-only: disabled on touch devices via matchMedia.
 */
export function useCursorState(): CursorContextValue {
  const [variant, setVariantState] = useState<CursorVariant>('default');
  const [enabled, setEnabled] = useState(false);

  // Enable custom cursor only on non-touch devices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(pointer: fine)');
    setEnabled(mql.matches);

    const handleChange = (e: MediaQueryListEvent): void => {
      setEnabled(e.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const setVariant = useCallback((v: CursorVariant): void => {
    setVariantState(v);
  }, []);

  return { variant, enabled, setVariant, setEnabled };
}
