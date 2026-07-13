import { useRef, useState, useEffect, useCallback } from 'react';

interface ResizeObserverSize {
  width: number;
  height: number;
}

interface UseResizeObserverOptions<T extends Element = Element> {
  /** Whether the observer is active. Default: true */
  enabled?: boolean;
  /** Ref to an existing element to observe. If not provided, use the returned ref. */
  ref?: React.RefObject<T | null>;
}

interface UseResizeObserverResult<T extends Element = Element> {
  /** Ref to attach to the target element (if no external ref provided) */
  ref: React.RefObject<T | null>;
  /** Observed element dimensions */
  size: ResizeObserverSize;
}

/**
 * Tracks an element's dimensions via ResizeObserver.
 *
 * SSR-safe. Useful for responsive layouts, animation calculations,
 * and performance-aware rendering.
 *
 * @example
 * ```tsx
 * const { ref, size } = useResizeObserver();
 * return <div ref={ref}>Width: {size.width}</div>;
 * ```
 */
export function useResizeObserver<T extends Element = Element>(
  options: UseResizeObserverOptions<T> = {},
): UseResizeObserverResult<T> {
  const { enabled = true, ref: externalRef } = options;
  const internalRef = useRef<T | null>(null);
  const [size, setSize] = useState<ResizeObserverSize>({ width: 0, height: 0 });

  const targetRef = externalRef || internalRef;

  const handleResize = useCallback((entries: ResizeObserverEntry[]): void => {
    const entry = entries[0];
    if (entry) {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!enabled) return;

    const node = targetRef.current;
    if (!node) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enabled, handleResize, targetRef]);

  return { ref: internalRef, size };
}
