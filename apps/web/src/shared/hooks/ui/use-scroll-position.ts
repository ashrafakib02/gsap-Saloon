import { useState, useEffect, useRef } from 'react';

interface ScrollPosition {
  /** Current scroll X offset */
  x: number;
  /** Current scroll Y offset */
  y: number;
}

/**
 * Tracks the current scroll position, throttled via requestAnimationFrame.
 *
 * Uses passive scroll listener to avoid layout thrashing.
 * From TECHNICAL_ARCHITECTURE §15.6:
 * "Passive event listeners: Scroll and touch events use { passive: true }"
 *
 * @example
 * ```tsx
 * const { y } = useScrollPosition();
 * const showNav = y > 100;
 * ```
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = (): void => {
      setPosition({ x: window.scrollX, y: window.scrollY });
      ticking.current = false;
    };

    const onScroll = (): void => {
      if (!ticking.current) {
        requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return position;
}
