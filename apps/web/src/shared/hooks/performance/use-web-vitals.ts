import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

// ── Types ─────────────────────────────────────────────────

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// ── Thresholds (from TECHNICAL_ARCHITECTURE §15.2) ────────

const LCP_GOOD = 2500;
const LCP_POOR = 4000;
const INP_GOOD = 200;
const INP_POOR = 500;
const CLS_GOOD = 0.1;
const CLS_POOR = 0.25;
const TTFB_GOOD = 800;
const TTFB_POOR = 1800;

function rate(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'LCP':
      return value <= LCP_GOOD ? 'good' : value <= LCP_POOR ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= INP_GOOD ? 'good' : value <= INP_POOR ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= CLS_GOOD ? 'good' : value <= CLS_POOR ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= TTFB_GOOD ? 'good' : value <= TTFB_POOR ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}

// ── Hook ──────────────────────────────────────────────────

/**
 * Tracks Core Web Vitals (LCP, INP, CLS, TTFB) via PerformanceObserver.
 * Reports metrics to the analytics system for monitoring.
 *
 * No external dependencies — uses native browser APIs only.
 */
export function useWebVitals(): void {
  const reportedRef = useRef(new Set<string>());

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const report = (metric: WebVitalsMetric): void => {
      // Deduplicate by metric id
      if (reportedRef.current.has(metric.id)) return;
      reportedRef.current.add(metric.id);

      trackEvent('Web Vital', {
        metric_name: metric.name,
        metric_value: String(Math.round(metric.value)),
        metric_rating: metric.rating,
      });
    };

    const observers: PerformanceObserver[] = [];

    // LCP — Largest Contentful Paint
    try {
      const lcp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          report({
            name: 'LCP',
            value: last.startTime,
            rating: rate('LCP', last.startTime),
            delta: last.startTime,
            id: `lcp-${Math.round(last.startTime)}`,
          });
        }
      });
      lcp.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcp);
    } catch {
      // LCP not supported
    }

    // INP — Interaction to Next Paint (uses event entries)
    try {
      const inp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          const eventEntry = entry as PerformanceEventTiming;
          const duration = eventEntry.duration;
          report({
            name: 'INP',
            value: duration,
            rating: rate('INP', duration),
            delta: duration,
            id: `inp-${eventEntry.startTime}`,
          });
        }
      });
      inp.observe({ type: 'event', buffered: true });
      observers.push(inp);
    } catch {
      // Event timing not supported
    }

    // CLS — Cumulative Layout Shift
    try {
      let clsValue = 0;
      let clsId = 0;
      const cls = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutEntry = entry as unknown as { hadRecentInput: boolean; value: number };
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value;
          }
        }
        report({
          name: 'CLS',
          value: clsValue,
          rating: rate('CLS', clsValue),
          delta: clsValue,
          id: `cls-${++clsId}`,
        });
      });
      cls.observe({ type: 'layout-shift', buffered: true });
      observers.push(cls);
    } catch {
      // Layout shift not supported
    }

    // TTFB — Time to First Byte
    try {
      const ttfb = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const nav = entries[0] as PerformanceNavigationTiming;
        if (nav) {
          const value = nav.responseStart - nav.requestStart;
          report({
            name: 'TTFB',
            value,
            rating: rate('TTFB', value),
            delta: value,
            id: `ttfb-${Math.round(value)}`,
          });
        }
      });
      ttfb.observe({ type: 'navigation', buffered: true });
      observers.push(ttfb);
    } catch {
      // Navigation timing not supported
    }

    return () => {
      for (const obs of observers) {
        obs.disconnect();
      }
    };
  }, []);
}
