/**
 * Performance Infrastructure — Barrel Export
 *
 * Dynamic imports, lazy components, resource preloading,
 * measurement helpers, and budget constants.
 */

export {
  dynamicImport,
  dynamicImportNamed,
  preloadRoute,
  preloadRouteOnHover,
} from './dynamic-imports';

export {
  lazyComponent,
  lazySection,
  lazyFeature,
  preloadComponent,
} from './lazy-components';

export {
  preloadImage,
  preloadFont,
  preloadScript,
  preloadStylesheet,
  prefetchRoute,
  dnsPrefetch,
  preconnect,
  removePreload,
  getPreloadedResources,
} from './resource-preloading';

export {
  measure,
  measureAsync,
  measureSync,
  getPerformanceEntries,
  clearPerformanceMarks,
  clearPerformanceMeasurements,
  reportMetric,
} from './perf-measurement';

export {
  PERFORMANCE_BUDGET,
  checkBudget,
  getViolations,
  clearViolations,
} from './perf-budget';
export type { PerformanceBudget, BudgetViolation } from './perf-budget';
