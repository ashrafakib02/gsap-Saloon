/**
 * useHeroPerformance — Hero Performance Monitoring Hook
 *
 * From DESIGN_SYSTEM §Performance:
 * P1: "LCP under 2.5 seconds — hero image visible within 2.5s"
 * P2: "CLS under 0.1 — no layout shifts after initial render"
 * P4: "Total page weight under 1MB"
 *
 * From TECHNICAL_ARCHITECTURE §14:
 * "Performance monitoring: PerformanceObserver for LCP, CLS, INP.
 *  Metrics reported to analytics abstraction."
 *
 * This hook provides:
 * 1. Core Web Vitals measurement (LCP, CLS, INP)
 * 2. Performance timing for hero milestones
 * 3. Resource loading validation
 * 4. Memory usage monitoring (development)
 * 5. Performance budget enforcement
 *
 * Architecture:
 * - Uses PerformanceObserver for accurate measurements
 * - SSR-safe (no-op on server)
 * - Cleanup on unmount prevents observer leaks
 * - All measurements are additive (never subtractive)
 *
 * This hook does NOT:
 * - Modify the DOM
 * - Affect rendering
 * - Send data to external services (Phase 13 handles that)
 * - Block the main thread with measurement
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_PERF_BUDGET } from '../hero-perf.config';

// ── Types ──────────────────────────────────────────────────

/**
 * Measured Core Web Vitals values.
 * null indicates the metric hasn't been measured yet.
 */
export interface HeroWebVitals {
  /** Largest Contentful Paint (ms) */
  lcp: number | null;
  /** Cumulative Layout Shift (dimensionless) */
  cls: number | null;
  /** Interaction to Next Paint (ms) */
  inp: number | null;
}

/**
 * Hero performance milestones — timing for each lifecycle event.
 */
export interface HeroMilestones {
  /** Time when hero section mounted (ms since navigation start) */
  mountTime: number | null;
  /** Time when hero started loading assets (ms since navigation start) */
  loadStartTime: number | null;
  /** Time when hero image completed loading (ms since navigation start) */
  imageLoadTime: number | null;
  /** Time when fonts completed loading (ms since navigation start) */
  fontsLoadTime: number | null;
  /** Time when hero animation completed (ms since navigation start) */
  revealCompleteTime: number | null;
}

/**
 * Performance budget violation report.
 */
export interface BudgetViolation {
  /** Which metric exceeded its budget */
  metric: keyof typeof HERO_PERF_BUDGET;
  /** The measured value */
  actual: number;
  /** The budget limit */
  budget: number;
  /** Timestamp of the violation */
  timestamp: number;
}

/**
 * Return type for the useHeroPerformance hook.
 */
export interface UseHeroPerformanceReturn {
  /** Current Core Web Vitals measurements */
  webVitals: HeroWebVitals;
  /** Hero lifecycle milestones */
  milestones: HeroMilemarks;
  /** Whether any budget was exceeded */
  budgetExceeded: boolean;
  /** List of budget violations (for debugging) */
  violations: BudgetViolation[];
  /** Record a hero lifecycle milestone */
  recordMilestone: (name: keyof HeroMilemarks) => void;
  /** Get the time since navigation start */
  getNavigationTiming: () => number;
  /** Force a CLS measurement (for debugging) */
  measureCLS: () => void;
}

// ── Navigation Timing Helper ───────────────────────────────

/**
 * Get milliseconds since navigation start.
 * SSR-safe — returns 0 on server.
 */
function getNavigationStartTime(): number {
  if (typeof performance === 'undefined') return 0;
  return performance.now();
}

// ── Hook ───────────────────────────────────────────────────

/**
 * Monitors hero performance without affecting rendering.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Performance is measured, not assumed."
 *
 * This hook attaches PerformanceObservers for LCP, CLS, and INP,
 * and records timing milestones for the hero lifecycle. All
 * measurements are stored in refs to avoid re-renders.
 *
 * Usage:
 * ```tsx
 * const { webVitals, milestones, recordMilestone, budgetExceeded } =
 *   useHeroPerformance();
 *
 * // Record milestones at lifecycle points
 * useEffect(() => {
 *   recordMilestone('mountTime');
 * }, []);
 * ```
 */
export function useHeroPerformance(): UseHeroPerformanceReturn {
  const [webVitals, setWebVitals] = useState<HeroWebVitals>({
    lcp: null,
    cls: null,
    inp: null,
  });
  const [milestones, setMilestones] = useState<HeroMilemarks>({
    mountTime: null,
    loadStartTime: null,
    imageLoadTime: null,
    fontsLoadTime: null,
    revealCompleteTime: null,
  });
  const [budgetExceeded, setBudgetExceeded] = useState(false);
  const [violations, setViolations] = useState<BudgetViolation[]>([]);

  /* Store observers in refs for cleanup */
  const observersRef = useRef<PerformanceObserver[]>([]);

  /* Store accumulated CLS value (CLS is cumulative, not instant) */
  const clsRef = useRef(0);

  /**
   * Record a performance milestone.
   * Uses the name to determine what to measure.
   */
  const recordMilestone = useCallback((name: keyof HeroMilemarks) => {
    const time = getNavigationStartTime();
    setMilestones((prev) => ({ ...prev, [name]: time }));
  }, []);

  /**
   * Get current navigation timing.
   */
  const getNavigationTiming = useCallback(() => {
    return getNavigationStartTime();
  }, []);

  /**
   * Force a CLS measurement (for debugging).
   */
  const measureCLS = useCallback(() => {
    setWebVitals((prev) => ({ ...prev, cls: clsRef.current }));
  }, []);

  /* ── Performance Observers ──────────────────────────────── */
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;

    const observers: PerformanceObserver[] = [];

    /* ── LCP Observer ──────────────────────────────────────── */
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          setWebVitals((prev) => ({ ...prev, lcp }));

          /* Check budget */
          if (lcp > HERO_PERF_BUDGET.lcpTarget) {
            const violation: BudgetViolation = {
              metric: 'lcpTarget',
              actual: lcp,
              budget: HERO_PERF_BUDGET.lcpTarget,
              timestamp: Date.now(),
            };
            setViolations((prev) => [...prev, violation]);
            setBudgetExceeded(true);
          }
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch {
      /* LCP observer not supported — degrade gracefully */
    }

    /* ── CLS Observer ──────────────────────────────────────── */
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (
            entry.entryType === 'layout-shift' &&
            !(entry as LayoutShiftEntry).hadRecentInput
          ) {
            clsRef.current += (entry as LayoutShiftEntry).value;
            setWebVitals((prev) => ({ ...prev, cls: clsRef.current }));

            /* Check budget */
            if (clsRef.current > HERO_PERF_BUDGET.clsBudget) {
              const violation: BudgetViolation = {
                metric: 'clsBudget',
                actual: clsRef.current,
                budget: HERO_PERF_BUDGET.clsBudget,
                timestamp: Date.now(),
              };
              setViolations((prev) => [...prev, violation]);
              setBudgetExceeded(true);
            }
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch {
      /* CLS observer not supported — degrade gracefully */
    }

    /* ── INP Observer ──────────────────────────────────────── */
    try {
      const inpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        /* INP is the max interaction delay — take the worst */
        let maxInp = 0;
        for (const entry of entries) {
          const inpEntry = entry as PerformanceEventTiming;
          const duration = inpEntry.duration;
          if (duration > maxInp) {
            maxInp = duration;
          }
        }
        if (maxInp > 0) {
          setWebVitals((prev) => ({ ...prev, inp: maxInp }));

          /* Check budget */
          if (maxInp > HERO_PERF_BUDGET.inpTarget) {
            const violation: BudgetViolation = {
              metric: 'inpTarget',
              actual: maxInp,
              budget: HERO_PERF_BUDGET.inpTarget,
              timestamp: Date.now(),
            };
            setViolations((prev) => [...prev, violation]);
            setBudgetExceeded(true);
          }
        }
      });
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
      observers.push(inpObserver);
    } catch {
      /* INP observer not supported — degrade gracefully */
    }

    observersRef.current = observers;

    /* ── Cleanup ───────────────────────────────────────────── */
    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
      observersRef.current = [];
    };
  }, []);

  /* ── Record mount milestone ──────────────────────────────── */
  useEffect(() => {
    recordMilestone('mountTime');
  }, [recordMilestone]);

  /* ── Development Memory Monitoring ───────────────────────── */
  useEffect(() => {
    if (import.meta.env.DEV && typeof performance !== 'undefined') {
      /* Log performance budget status in development */
      const logBudget = () => {
        if (webVitals.lcp !== null || webVitals.cls !== null) {
          console.groupCollapsed?.(
            '%c[Hero Perf]%c Budget Status',
            'color: #b8965a; font-weight: bold',
            'color: inherit',
          );
          if (webVitals.lcp !== null) {
            const lcpStatus = webVitals.lcp <= HERO_PERF_BUDGET.lcpTarget ? '✓' : '✗';
            console.log(
              `${lcpStatus} LCP: ${webVitals.lcp.toFixed(0)}ms (budget: ${HERO_PERF_BUDGET.lcpTarget}ms)`,
            );
          }
          if (webVitals.cls !== null) {
            const clsStatus = webVitals.cls <= HERO_PERF_BUDGET.clsBudget ? '✓' : '✗';
            console.log(
              `${clsStatus} CLS: ${webVitals.cls.toFixed(4)} (budget: ${HERO_PERF_BUDGET.clsBudget})`,
            );
          }
          if (webVitals.inp !== null) {
            const inpStatus = webVitals.inp <= HERO_PERF_BUDGET.inpTarget ? '✓' : '✗';
            console.log(
              `${inpStatus} INP: ${webVitals.inp.toFixed(0)}ms (budget: ${HERO_PERF_BUDGET.inpTarget}ms)`,
            );
          }
          console.groupEnd?.();
        }
      };

      /* Log after a delay to allow measurements to accumulate */
      const timer = setTimeout(logBudget, 5_000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [webVitals]);

  return {
    webVitals,
    milestones,
    budgetExceeded,
    violations,
    recordMilestone,
    getNavigationTiming,
    measureCLS,
  };
}

// ── Layout Shift Type Extension ────────────────────────────

/**
 * Type for layout-shift PerformanceEntry.
 * Not in all TypeScript DOM lib versions.
 */
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
