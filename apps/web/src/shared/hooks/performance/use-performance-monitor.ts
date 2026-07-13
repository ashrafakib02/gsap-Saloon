import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Monitors long tasks (>50ms) and reports them to analytics.
 * Long tasks block the main thread and cause jank — tracking them
 * helps identify performance regressions early.
 *
 * Uses native PerformanceObserver — zero dependencies.
 */
export function usePerformanceMonitor(): void {
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Long Task observer
    try {
      observerRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            trackEvent('Long Task', {
              duration: String(Math.round(entry.duration)),
              start: String(Math.round(entry.startTime)),
            });
          }
        }
      });
      observerRef.current.observe({ type: 'longtask', buffered: false });
    } catch {
      // Long task observer not supported
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
}

/**
 * Tracks memory usage if the Memory API is available.
 * Reports periodically (every 30 seconds) to detect memory leaks.
 */
export function useMemoryMonitor(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (!memory) return;

    const interval = setInterval(() => {
      const used = memory.usedJSHeapSize;
      const limit = memory.jsHeapSizeLimit;
      const percentage = Math.round((used / limit) * 100);

      // Alert if memory usage exceeds 80% of the heap limit
      if (percentage > 80) {
        trackEvent('High Memory', {
          used_mb: String(Math.round(used / 1024 / 1024)),
          limit_mb: String(Math.round(limit / 1024 / 1024)),
          percentage: String(percentage),
        });
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, []);
}
