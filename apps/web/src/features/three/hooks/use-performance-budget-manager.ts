/**
 * usePerformanceBudgetManager — Direct Access to Budget Manager Methods
 *
 * Provides a stable, memoized reference to the budget-manager's mutation
 * methods. All returned functions are bound to the singleton and never
 * change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { useMemo } from 'react';

import { performanceBudgetManager } from '../performance-budget-manager';
import { usePerformanceBudgetContext } from '../performance-budget-provider';

/**
 * Return type — all readonly mutation methods on the budget manager.
 */
export interface UsePerformanceBudgetManagerReturn {
  readonly registerBudget: typeof performanceBudgetManager.registerBudget;
  readonly unregisterBudget: typeof performanceBudgetManager.unregisterBudget;
  readonly recordMetric: typeof performanceBudgetManager.recordMetric;
  readonly registerMetric: typeof performanceBudgetManager.registerMetric;
  readonly unregisterMetric: typeof performanceBudgetManager.unregisterMetric;
  readonly registerProfile: typeof performanceBudgetManager.registerProfile;
  readonly unregisterProfile: typeof performanceBudgetManager.unregisterProfile;
  readonly evaluate: typeof performanceBudgetManager.evaluate;
  readonly setQualityPreset: typeof performanceBudgetManager.setQualityPreset;
  readonly setReducedMotion: typeof performanceBudgetManager.setReducedMotion;
  readonly getRegistry: typeof performanceBudgetManager.getRegistry;
  readonly getBudgetDefinition: typeof performanceBudgetManager.getBudgetDefinition;
  readonly getAllBudgetDefinitions: typeof performanceBudgetManager.getAllBudgetDefinitions;
  readonly hasBudget: typeof performanceBudgetManager.hasBudget;
  readonly hasMetric: typeof performanceBudgetManager.hasMetric;
  readonly hasProfile: typeof performanceBudgetManager.hasProfile;
  readonly getRecommendations: typeof performanceBudgetManager.getRecommendations;
}

/**
 * Access memoized budget-manager methods.
 *
 * Must be used within a {@link PerformanceBudgetRoot}. Returns a stable
 * object whose methods never change identity.
 *
 * @example
 * ```tsx
 * function BudgetControls() {
 *   const { registerBudget, recordMetric } = usePerformanceBudgetManager();
 *
 *   const handleRecord = useCallback(() => {
 *     recordMetric('drawCalls', 150);
 *   }, [recordMetric]);
 *
 *   return <button onClick={handleRecord}>Record</button>;
 * }
 * ```
 */
export function usePerformanceBudgetManager(): UsePerformanceBudgetManagerReturn {
  /* Confirm the provider is mounted. */
  usePerformanceBudgetContext();

  return useMemo<UsePerformanceBudgetManagerReturn>(
    () => ({
      registerBudget: performanceBudgetManager.registerBudget,
      unregisterBudget: performanceBudgetManager.unregisterBudget,
      recordMetric: performanceBudgetManager.recordMetric,
      registerMetric: performanceBudgetManager.registerMetric,
      unregisterMetric: performanceBudgetManager.unregisterMetric,
      registerProfile: performanceBudgetManager.registerProfile,
      unregisterProfile: performanceBudgetManager.unregisterProfile,
      evaluate: performanceBudgetManager.evaluate,
      setQualityPreset: performanceBudgetManager.setQualityPreset,
      setReducedMotion: performanceBudgetManager.setReducedMotion,
      getRegistry: performanceBudgetManager.getRegistry,
      getBudgetDefinition: performanceBudgetManager.getBudgetDefinition,
      getAllBudgetDefinitions: performanceBudgetManager.getAllBudgetDefinitions,
      hasBudget: performanceBudgetManager.hasBudget,
      hasMetric: performanceBudgetManager.hasMetric,
      hasProfile: performanceBudgetManager.hasProfile,
      getRecommendations: performanceBudgetManager.getRecommendations,
    }),
    [],
  );
}
