import { useState, useEffect } from 'react';

/**
 * Returns whether the component is currently mounted.
 *
 * Useful for preventing state updates on unmounted components,
 * especially in async callbacks (fetch, setTimeout).
 *
 * @example
 * ```tsx
 * const isMounted = useIsMounted();
 *
 * useEffect(() => {
 *   fetchData().then((data) => {
 *     if (isMounted()) {
 *       setState(data);
 *     }
 *   });
 * }, []);
 * ```
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useState({ current: true })[0];

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, [isMountedRef]);

  return () => isMountedRef.current;
}
