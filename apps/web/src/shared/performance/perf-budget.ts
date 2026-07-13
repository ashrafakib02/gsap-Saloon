/**
 * Performance budget constants and violation tracking.
 * Values derived from project technical architecture and visual rules.
 *
 * @module perf-budget
 */

/**
 * A single budget threshold with target, warning, and critical levels.
 */
interface BudgetThreshold {
  /** Ideal target value. */
  target: number;
  /** Warning threshold — triggers monitoring alerts. */
  warning: number;
  /** Critical threshold — blocks or degrades experience. */
  critical: number;
}

/**
 * Complete performance budget for the salon website.
 * Values sourced from TECHNICAL_ARCHITECTURE §15 and VISUAL_RULES P1–P10.
 */
interface PerformanceBudget {
  /** Largest Contentful Paint in milliseconds. */
  lcp: BudgetThreshold;
  /** Interaction to Next Paint in milliseconds. */
  inp: BudgetThreshold;
  /** Cumulative Layout Shift (unitless). */
  cls: BudgetThreshold;
  /** Time to First Byte in milliseconds. */
  ttfb: { target: number; warning: number; critical: number };
  /** Bundle size limits in bytes (gzipped). */
  bundleSize: { initial: number; total: number; chunk: number };
  /** Maximum image sizes in bytes. */
  imageWeight: { hero: number; section: number; thumbnail: number };
  /** Maximum total web font weight in bytes. */
  fontWeight: { total: number };
  /** JavaScript heap memory limits in megabytes. */
  memory: { warning: number; critical: number };
}

/**
 * A recorded performance budget violation.
 */
interface BudgetViolation {
  /** The metric that violated its budget. */
  metric: string;
  /** The measured value. */
  value: number;
  /** The budget threshold that was exceeded. */
  budget: number;
  /** Severity level of the violation. */
  level: 'warning' | 'critical';
  /** Timestamp when the violation was recorded (ms since epoch). */
  timestamp: number;
}

/**
 * Result of a budget check.
 */
interface BudgetCheckResult {
  /** Whether the value passes the budget. */
  pass: boolean;
  /** Severity level of the check. */
  level: 'ok' | 'warning' | 'critical';
  /** The relevant budget threshold value. */
  budget: number;
}

/**
 * Performance budget for the salon website.
 * All values in bytes unless otherwise noted.
 */
const PERFORMANCE_BUDGET: Readonly<PerformanceBudget> = Object.freeze({
  lcp: Object.freeze({
    target: 2500,    // 2.5s — Good
    warning: 2000,   // 2s — Needs improvement starts here
    critical: 4000,  // 4s — Poor
  }),
  inp: Object.freeze({
    target: 200,     // 200ms — Good
    warning: 150,    // 150ms — Tight budget for salon site
    critical: 500,   // 500ms — Poor
  }),
  cls: Object.freeze({
    target: 0.1,     // Good
    warning: 0.05,   // Tight budget
    critical: 0.25,  // Poor
  }),
  ttfb: Object.freeze({
    target: 800,     // 800ms — acceptable for VPS hosting
    warning: 600,
    critical: 1800,
  }),
  bundleSize: Object.freeze({
    initial: 300_000,  // 300KB gzipped initial bundle
    total: 1_000_000,  // 1MB total gzipped
    chunk: 100_000,    // 100KB per chunk
  }),
  imageWeight: Object.freeze({
    hero: 400_000,       // 400KB hero images
    section: 200_000,    // 200KB section images
    thumbnail: 50_000,   // 50KB thumbnails
  }),
  fontWeight: Object.freeze({
    total: 100_000,  // 100KB total font weight
  }),
  memory: Object.freeze({
    warning: 50,   // 50MB heap
    critical: 100, // 100MB heap
  }),
});

/**
 * Tracked budget violations.
 */
let violations: BudgetViolation[] = [];

/**
 * Checks a metric value against its performance budget.
 *
 * @example
 * ```ts
 * const result = checkBudget('lcp', 3200);
 * // result.pass === false
 * // result.level === 'warning'
 * // result.budget === 4000
 * ```
 *
 * @param metric - The metric name (e.g., 'lcp', 'inp', 'cls', 'ttfb').
 * @param value - The measured value.
 * @returns Check result with pass/fail and severity level.
 */
function checkBudget(metric: string, value: number): BudgetCheckResult {
  const budget = PERFORMANCE_BUDGET[metric as keyof PerformanceBudget] as
    | BudgetThreshold
    | { target: number; warning: number; critical: number }
    | undefined;

  if (!budget || !('warning' in budget) || !('critical' in budget)) {
    return { pass: true, level: 'ok', budget: 0 };
  }

  if (value >= budget.critical) {
    const violation: BudgetViolation = {
      metric,
      value,
      budget: budget.critical,
      level: 'critical',
      timestamp: Date.now(),
    };
    violations.push(violation);

    if (!import.meta.env.PROD) {
      console.error(
        `%c[Budget:CRITICAL] ${metric}: ${value} >= ${budget.critical}`,
        'color: #ef4444; font-weight: bold;',
      );
    }

    return { pass: false, level: 'critical', budget: budget.critical };
  }

  if (value >= budget.warning) {
    const violation: BudgetViolation = {
      metric,
      value,
      budget: budget.warning,
      level: 'warning',
      timestamp: Date.now(),
    };
    violations.push(violation);

    if (!import.meta.env.PROD) {
      console.warn(
        `%c[Budget:WARNING] ${metric}: ${value} >= ${budget.warning}`,
        'color: #f59e0b; font-weight: bold;',
      );
    }

    return { pass: false, level: 'warning', budget: budget.warning };
  }

  return { pass: true, level: 'ok', budget: budget.target };
}

/**
 * Returns all recorded budget violations.
 *
 * @returns Array of budget violations.
 */
function getViolations(): BudgetViolation[] {
  return [...violations];
}

/**
 * Clears all tracked violations.
 */
function clearViolations(): void {
  violations = [];
}

export type {
  BudgetThreshold,
  PerformanceBudget,
  BudgetViolation,
  BudgetCheckResult,
};
export {
  PERFORMANCE_BUDGET,
  checkBudget,
  getViolations,
  clearViolations,
};
