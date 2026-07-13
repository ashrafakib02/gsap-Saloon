/**
 * Simple function memoization cache.
 *
 * Caches the result of a function based on its arguments.
 * Useful for expensive computations that are called frequently
 * with the same inputs.
 *
 * @example
 * ```ts
 * const expensiveCalculation = memoize((n: number) => {
 *   console.log('Computing...');
 *   return Array.from({ length: n }, (_, i) => i ** 2);
 * });
 *
 * expensiveCalculation(1000); // "Computing..." → array
 * expensiveCalculation(1000); // Returns cached result (no log)
 * ```
 */
export function memoize<TArgs extends readonly unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult {
  const cache = new Map<string, TResult>();

  return (...args: TArgs): TResult => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Creates a memoized getter that caches its result after first call.
 * Useful for lazy initialization of expensive objects.
 *
 * @example
 * ```ts
 * const expensiveObject = createMemoizedGetter(() => {
 *   return computeHeavyThing();
 * });
 *
 * // First call computes and caches
 * expensiveObject();
 * // Second call returns cached
 * expensiveObject();
 * ```
 */
export function createMemoizedGetter<T>(factory: () => T): () => T {
  let cached: T | undefined;
  let initialized = false;

  return (): T => {
    if (!initialized) {
      cached = factory();
      initialized = true;
    }
    return cached!;
  };
}
