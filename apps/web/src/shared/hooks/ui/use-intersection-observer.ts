import { useRef, useState, useEffect, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  /** Intersection threshold (0–1). Default: 0 */
  threshold?: number | number[];
  /** Root margin. Default: undefined (viewport) */
  rootMargin?: string;
  /** Whether to observe only once (stops after first intersection). Default: false */
  once?: boolean;
  /** Whether the observer is active. Default: true */
  enabled?: boolean;
}

interface UseIntersectionObserverResult<T extends Element = Element> {
  /** Ref to attach to the target element */
  ref: React.RefObject<T | null>;
  /** Whether the element is currently intersecting */
  isIntersecting: boolean;
  /** The raw IntersectionObserverEntry (null before first observation) */
  entry: IntersectionObserverEntry | null;
}

/**
 * Tracks element visibility via IntersectionObserver.
 *
 * SSR-safe: observer is created only in the browser.
 * From TECHNICAL_ARCHITECTURE §11.4:
 * "useScrollReveal — Fade-in elements on scroll entry"
 * This is the low-level observer that scroll-reveal hooks build upon.
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
 * return <div ref={ref}>...</div>;
 * ```
 */
export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverResult<T> {
  const { threshold = 0, rootMargin, once = false, enabled = true } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const hasTriggered = useRef(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]): void => {
      const e = entries[0];
      setEntry(e);
      setIsIntersecting(e.isIntersecting);

      if (once && e.isIntersecting) {
        hasTriggered.current = true;
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!enabled || hasTriggered.current) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, enabled, handleIntersect]);

  return { ref, isIntersecting, entry };
}
