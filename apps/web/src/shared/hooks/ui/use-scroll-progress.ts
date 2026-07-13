import { useState, useEffect, useRef } from 'react';

interface UseScrollProgressOptions {
  /** If provided, tracks scroll progress within this element instead of the page. */
  targetRef?: React.RefObject<HTMLElement | null>;
}

interface ScrollProgressResult {
  /** Progress value between 0 and 1 */
  progress: number;
  /** Whether currently scrolling (hasn't settled) */
  isScrolling: boolean;
}

/**
 * Tracks scroll progress as a normalized 0–1 value.
 *
 * For the page: 0 at top, 1 at bottom.
 * For an element: 0 when element top enters viewport, 1 when element bottom leaves.
 *
 * @example
 * ```tsx
 * const sectionRef = useRef(null);
 * const { progress } = useScrollProgress({ targetRef: sectionRef });
 * // progress: 0 → 1 as the user scrolls through the section
 * ```
 */
export function useScrollProgress(
  options: UseScrollProgressOptions = {},
): ScrollProgressResult {
  const { targetRef } = options;
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const ticking = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = (): void => {
      let newProgress: number;

      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const total = rect.height + windowHeight;
        const current = windowHeight - rect.top;
        newProgress = Math.min(Math.max(current / total, 0), 1);
      } else {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        newProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      }

      setProgress(newProgress);
      setIsScrolling(true);

      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setIsScrolling(false), 150);

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
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [targetRef]);

  return { progress, isScrolling };
}
