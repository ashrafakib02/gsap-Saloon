import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Returns a throttled version of the provided value.
 * Only updates at most once per `limit` milliseconds.
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 * ```
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= limit) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, limit - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}

/**
 * Returns a throttled version of a callback function.
 * The returned callback fires at most once per `limit` milliseconds.
 *
 * @example
 * ```tsx
 * const handleScroll = useThrottledCallback((e) => {
 *   console.log(e.target.scrollTop);
 * }, 100);
 *
 * <div onScroll={handleScroll}>...</div>
 * ```
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number,
): T {
  const callbackRef = useRef(callback);
  const lastCalled = useRef<number>(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: unknown[]) => {
      const now = Date.now();
      if (now - lastCalled.current >= limit) {
        lastCalled.current = now;
        return callbackRef.current(...args);
      }
    }) as T,
    [limit],
  );
}
