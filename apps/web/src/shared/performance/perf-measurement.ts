/**
 * Performance measurement helpers wrapping the browser's Performance API.
 * All functions are SSR-safe and no-op when `performance` is unavailable.
 *
 * @module perf-measurement
 */

const isBrowser = typeof performance !== 'undefined';

/**
 * A handle returned by {@link measure} to end or cancel a measurement.
 */
interface MeasurementHandle {
  /**
   * Completes the measurement and returns the duration in milliseconds.
   */
  end: () => number;
  /**
   * Removes the performance mark without completing the measurement.
   */
  cancel: () => void;
}

/**
 * Result of {@link measureAsync}.
 */
interface AsyncMeasurementResult<T> {
  /** The return value of the measured function. */
  result: T;
  /** Duration in milliseconds. */
  duration: number;
}

/**
 * Result of {@link measureSync}.
 */
interface SyncMeasurementResult<T> {
  /** The return value of the measured function. */
  result: T;
  /** Duration in milliseconds. */
  duration: number;
}

/**
 * Starts a named performance measurement using `performance.mark()`.
 * Call `end()` to complete the measurement, or `cancel()` to discard it.
 *
 * @example
 * ```ts
 * const timer = measure('hero-animation');
 * // ... do work ...
 * const duration = timer.end(); // logs: [perf] hero-animation: 42ms
 * ```
 *
 * @param name - Unique name for this measurement.
 * @returns A handle with `end()` and `cancel()` methods.
 */
function measure(name: string): MeasurementHandle {
  const markStart = `${name}:start`;
  const markEnd = `${name}:end`;
  const measureName = `[perf] ${name}`;

  if (isBrowser) {
    performance.mark(markStart);
  }

  return {
    end: (): number => {
      if (!isBrowser) return 0;

      performance.mark(markEnd);
      performance.measure(measureName, markStart, markEnd);

      const entries = performance.getEntriesByName(measureName, 'measure');
      const duration = entries.length > 0 ? entries[entries.length - 1].duration : 0;

      // Clean up marks
      performance.clearMarks(markStart);
      performance.clearMarks(markEnd);

      if (!import.meta.env.PROD) {
        console.log(`${measureName}: ${duration.toFixed(2)}ms`);
      }

      return duration;
    },
    cancel: (): void => {
      if (!isBrowser) return;
      performance.clearMarks(markStart);
    },
  };
}

/**
 * Wraps an async function with performance measurement.
 *
 * @example
 * ```ts
 * const { result, duration } = await measureAsync('fetch-services', async () => {
 *   return await fetch('/api/services').then(r => r.json());
 * });
 * console.log(`Fetched in ${duration}ms`);
 * ```
 *
 * @param name - Name for the measurement.
 * @param fn - Async function to measure.
 * @returns The function's result and the measurement duration.
 */
async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<AsyncMeasurementResult<T>> {
  const timer = measure(name);

  try {
    const result = await fn();
    const duration = timer.end();
    return { result, duration };
  } catch (error) {
    timer.cancel();
    throw error;
  }
}

/**
 * Wraps a synchronous function with performance measurement.
 *
 * @example
 * ```ts
 * const { result, duration } = measureSync('compute-layout', () => {
 *   return computeExpensiveLayout(data);
 * });
 * ```
 *
 * @param name - Name for the measurement.
 * @param fn - Synchronous function to measure.
 * @returns The function's result and the measurement duration.
 */
function measureSync<T>(
  name: string,
  fn: () => T,
): SyncMeasurementResult<T> {
  const timer = measure(name);

  try {
    const result = fn();
    const duration = timer.end();
    return { result, duration };
  } catch (error) {
    timer.cancel();
    throw error;
  }
}

/**
 * Returns performance entries, optionally filtered by name.
 *
 * @example
 * ```ts
 * const entries = getPerformanceEntries('[perf]');
 * entries.forEach(e => console.log(e.name, e.duration));
 * ```
 *
 * @param name - Optional name filter (entries whose name contains this string).
 * @returns Matching performance entries.
 */
function getPerformanceEntries(name?: string): PerformanceEntry[] {
  if (!isBrowser) return [];

  if (name) {
    return performance.getEntriesByName(name);
  }

  return performance.getEntries();
}

/**
 * Clears performance marks, optionally filtered by name.
 *
 * @param name - Optional name to filter which marks to clear.
 *                If omitted, all marks are cleared.
 */
function clearPerformanceMarks(name?: string): void {
  if (!isBrowser) return;

  if (name) {
    performance.clearMarks(name);
  } else {
    performance.clearMarks();
  }
}

/**
 * Clears performance measurements, optionally filtered by name.
 *
 * @param name - Optional name to filter which measurements to clear.
 *                If omitted, all measurements are cleared.
 */
function clearPerformanceMeasurements(name?: string): void {
  if (!isBrowser) return;

  if (name) {
    performance.clearMeasures(name);
  } else {
    performance.clearMeasures();
  }
}

/**
 * Logs a performance metric to the console in development.
 * In production, this would forward to a monitoring service.
 *
 * @example
 * ```ts
 * reportMetric('lcp', 1800, 'ms');
 * reportMetric('initial-bundle-size', 245000, 'bytes');
 * ```
 *
 * @param name - Metric name.
 * @param value - Metric value.
 * @param unit - Unit of measurement (default 'ms').
 */
function reportMetric(name: string, value: number, unit = 'ms'): void {
  if (!import.meta.env.PROD) {
    console.log(
      `%c[metric] ${name}: ${value}${unit}`,
      'color: #c9a96e; font-weight: bold;',
    );
  }

  // Production: forward to monitoring provider (Phase 10)
  // monitoring.captureMessage(`metric:${name}=${value}${unit}`, 'info');
}

export type { MeasurementHandle, AsyncMeasurementResult, SyncMeasurementResult };
export {
  measure,
  measureAsync,
  measureSync,
  getPerformanceEntries,
  clearPerformanceMarks,
  clearPerformanceMeasurements,
  reportMetric,
};
