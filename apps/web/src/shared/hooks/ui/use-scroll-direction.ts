import { useState, useEffect, useRef } from 'react';

interface UseScrollDirectionOptions {
  /** Pixel threshold before the direction change is registered (default: 10) */
  threshold?: number;
  /** Delay in ms before the header hides after scrolling starts (default: 0) */
  delay?: number;
}

/**
 * Detects scroll direction (up/down) with a threshold.
 *
 * Used by the Navigation component to implement scroll-aware header:
 * - Scroll down → header hides (reveals more content)
 * - Scroll up → header appears (navigation is available)
 *
 * From TECHNICAL_ARCHITECTURE §11.4:
 * "useScrollDirection — Detect scroll up/down → Sticky navigation"
 *
 * From PROJECT_BLUEPRINT:
 * "Navigation — scroll-aware (appears/disappears on scroll direction)"
 *
 * Uses passive scroll listener for performance (VISUAL_RULES P10).
 * Debounces at requestAnimationFrame level to avoid layout thrashing.
 */
export function useScrollDirection({
  threshold = 10,
  delay = 0,
}: UseScrollDirectionOptions = {}): 'up' | 'down' {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = (): void => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) < threshold) {
        ticking.current = false;
        return;
      }

      const newDirection = diff > 0 ? 'down' : 'up';

      if (newDirection !== direction) {
        if (delay > 0 && newDirection === 'down') {
          // Delay hiding the header — gives user a moment to realize they're scrolling
          delayTimer.current = setTimeout(() => {
            setDirection(newDirection);
          }, delay);
        } else {
          // Show header immediately on scroll up
          if (delayTimer.current) {
            clearTimeout(delayTimer.current);
            delayTimer.current = null;
          }
          setDirection(newDirection);
        }
      }

      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
      ticking.current = false;
    };

    const onScroll = (): void => {
      if (!ticking.current) {
        requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (delayTimer.current) {
        clearTimeout(delayTimer.current);
      }
    };
  }, [threshold, delay, direction]);

  return direction;
}
