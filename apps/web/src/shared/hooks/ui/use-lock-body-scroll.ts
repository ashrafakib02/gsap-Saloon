import { useEffect } from 'react';

/**
 * Locks the body scroll when active.
 *
 * Prevents background scrolling while a modal, overlay, or mobile menu
 * is open. Restores scroll position on unlock.
 *
 * From DESIGN_SYSTEM §15 (AC5):
 * Interactive overlays must prevent interaction with content beneath.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * useLockBodyScroll(isOpen);
 * ```
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    if (typeof document === 'undefined') return;

    const scrollY = window.scrollY;
    const body = document.body;

    // Prevent scroll
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      // Restore scroll
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
