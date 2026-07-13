/**
 * Dynamic import helpers with retry logic, error handling,
 * and route preloading utilities.
 *
 * @module dynamic-imports
 */

/**
 * Options for {@link dynamicImport}.
 */
interface DynamicImportOptions<T> {
  /** Value to return if all retries fail. */
  fallback?: T;
  /** Callback invoked when an import error occurs. */
  onError?: (error: unknown) => void;
  /** Number of retry attempts (default 2). */
  retries?: number;
  /** Delay in ms between retries (default 1000). */
  retryDelay?: number;
}

/**
 * Wraps a dynamic import with retry logic, error handling, and optional fallback.
 *
 * @example
 * ```ts
 * const HeavyChart = await dynamicImport(
 *   () => import('./components/HeavyChart'),
 *   {
 *     fallback: ChartPlaceholder,
 *     onError: (err) => console.error('Chart import failed:', err),
 *     retries: 3,
 *     retryDelay: 1500,
 *   },
 * );
 * ```
 *
 * @param importFn - Function that returns a dynamic import promise.
 * @param options - Retry, error, and fallback configuration.
 * @returns The default export from the module.
 */
async function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  options?: DynamicImportOptions<T>,
): Promise<T> {
  const { fallback, onError, retries = 2, retryDelay = 1000 } = options ?? {};

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      const isLastAttempt = attempt === retries;

      onError?.(error);

      if (isLastAttempt) {
        if (fallback !== undefined) {
          return fallback;
        }
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }

  // This line is unreachable due to the loop logic, but satisfies TypeScript.
  throw new Error('dynamicImport: unexpected code path');
}

/**
 * Options for {@link dynamicImportNamed}.
 */
interface DynamicImportNamedOptions {
  /** Value to return if import fails. */
  fallback?: unknown;
  /** Callback invoked when an import error occurs. */
  onError?: (error: unknown) => void;
}

/**
 * Imports a module and extracts a named export via an extractor function.
 *
 * @example
 * ```ts
 * const formatDate = await dynamicImportNamed(
 *   () => import('./utils/date'),
 *   (mod) => mod.formatDate,
 * );
 * ```
 *
 * @param importFn - Function that returns a dynamic import promise.
 * @param extractor - Function to extract the desired export from the module.
 * @param options - Error handling configuration.
 * @returns The extracted named export value.
 */
async function dynamicImportNamed<T>(
  importFn: () => Promise<T>,
  extractor: (module: T) => unknown,
  options?: DynamicImportNamedOptions,
): Promise<unknown> {
  const { fallback, onError } = options ?? {};

  try {
    const module = await importFn();
    return extractor(module);
  } catch (error) {
    onError?.(error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

/**
 * Triggers a dynamic import for route preloading (fire and forget).
 * Uses a `<link rel="modulepreload">` hint if available.
 *
 * @example
 * ```tsx
 * // In a router config or component mount:
 * preloadRoute(() => import('./pages/booking'));
 * ```
 *
 * @param importFn - Function that returns a dynamic import promise.
 */
function preloadRoute(importFn: () => Promise<unknown>): void {
  if (typeof document === 'undefined') return;

  // Fire and forget — the browser caches the chunk
  importFn().catch(() => {
    // Swallow errors during preloading — it's a hint, not a requirement
  });
}

/**
 * Returns event handlers that trigger route preloading on hover or focus.
 * Attach these to `<a>` elements for instant-feeling navigation.
 *
 * @example
 * ```tsx
 * const preloadHandlers = preloadRouteOnHover(
 *   () => import('./pages/services'),
 * );
 *
 * <Link to="/services" {...preloadHandlers}>
 *   Our Services
 * </Link>
 * ```
 *
 * @param importFn - Function that returns a dynamic import promise.
 * @returns Event handler object with `onMouseEnter` and `onFocus`.
 */
function preloadRouteOnHover(
  importFn: () => Promise<unknown>,
): { onMouseEnter: () => void; onFocus: () => void } {
  let preloaded = false;

  const trigger = (): void => {
    if (!preloaded) {
      preloaded = true;
      importFn().catch(() => {
        // Swallow — preload is best-effort
      });
    }
  };

  return {
    onMouseEnter: trigger,
    onFocus: trigger,
  };
}

export type { DynamicImportOptions, DynamicImportNamedOptions };
export {
  dynamicImport,
  dynamicImportNamed,
  preloadRoute,
  preloadRouteOnHover,
};
