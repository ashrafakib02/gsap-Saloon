import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux-store';
import { toggleMobileMenu, closeMobileMenu } from '@/features/shared/store/ui-slice';

/**
 * Manages mobile menu state via Redux.
 *
 * From TECHNICAL_ARCHITECTURE §6.4:
 * "ui.mobileMenuOpen — boolean, default false"
 *
 * From TECHNICAL_ARCHITECTURE §8.4:
 * "useMobileMenu — Mobile menu transitions"
 *
 * Behavior:
 * - Toggle open/close via hamburger button
 * - Close on Escape key
 * - Close on route change
 * - Close on viewport resize to desktop
 * - Prevent body scroll when open
 */
export function useMobileMenu(): {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
} {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.mobileMenuOpen);

  const toggle = useCallback((): void => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const close = useCallback((): void => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Close on viewport resize to desktop (1024px+)
  useEffect(() => {
    if (!isOpen) return;

    const mql = window.matchMedia('(min-width: 1024px)');

    const handleChange = (e: MediaQueryListEvent): void => {
      if (e.matches) close();
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [isOpen, close]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return { isOpen, toggle, close };
}
