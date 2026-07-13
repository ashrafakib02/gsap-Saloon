import { useRef, useEffect } from 'react';

/**
 * Returns the previous value of the provided value.
 * Useful for comparing current vs. previous props or state.
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 *
 * return (
 *   <p>
 *     Now: {count}, Before: {prevCount}
 *   </p>
 * );
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
