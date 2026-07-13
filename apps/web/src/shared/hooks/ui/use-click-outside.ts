import { useEffect, useRef } from 'react';

type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

interface UseClickOutsideOptions {
  /** Whether the handler is active. Default: true */
  enabled?: boolean;
  /** Event types to listen for. Default: ['mousedown', 'touchstart'] */
  events?: string[];
}

/**
 * Calls a handler when a click/touch occurs outside the referenced element.
 *
 * Common use cases: closing dropdowns, dismissing overlays, dismissing
 * mobile menus.
 *
 * @example
 * ```tsx
 * const dropdownRef = useRef(null);
 * useClickOutside(dropdownRef, () => setIsOpen(false));
 *
 * return <div ref={dropdownRef}>...</div>;
 * ```
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: ClickOutsideHandler,
  options: UseClickOutsideOptions = {},
): void {
  const { enabled = true, events = ['mousedown', 'touchstart'] } = options;
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;

    const listener = (event: Event): void => {
      const node = ref.current;
      if (!node) return;

      // Do nothing if clicking inside the element
      const target = event.target as Node;
      if (node.contains(target)) return;

      handlerRef.current(event as MouseEvent | TouchEvent);
    };

    events.forEach((eventType) => {
      document.addEventListener(eventType, listener);
    });

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, listener);
      });
    };
  }, [ref, enabled, events]);
}
