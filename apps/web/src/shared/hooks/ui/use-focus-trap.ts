import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseFocusTrapOptions {
  /** Whether the trap is active */
  active: boolean;
  /** Element to restore focus to when trap is deactivated */
  restoreFocus?: HTMLElement | null;
  /** Initial element to focus when trap activates */
  initialFocus?: HTMLElement | null;
}

/**
 * Traps keyboard focus within a container element.
 * Used for modals, overlays, and mobile menus to meet WCAG 2.1 requirements.
 *
 * - Cycles Tab/Shift+Tab within the container
 * - Restores focus to the previously focused element on deactivation
 * - Handles Escape key for dismissal
 */
export function useFocusTrap({ active, restoreFocus = null, initialFocus = null }: UseFocusTrapOptions): {
  containerRef: React.RefObject<HTMLDivElement>;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
  }, []);

  useEffect(() => {
    if (!active) return;

    // Remember what was focused before the trap
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable element
    const timer = requestAnimationFrame(() => {
      const target = initialFocus ?? getFocusableElements()[0];
      target?.focus();
    });

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [active, initialFocus, getFocusableElements]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, getFocusableElements]);

  // Restore focus when trap deactivates
  useEffect(() => {
    if (active) return;

    return () => {
      const restoreTarget = restoreFocus ?? previousFocusRef.current;
      restoreTarget?.focus();
    };
  }, [active, restoreFocus]);

  return { containerRef };
}
