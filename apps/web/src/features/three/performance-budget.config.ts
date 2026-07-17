/**
 * Performance Budget Config — Pure Derivation Functions
 *
 * This module contains pure derivation logic that turns quality presets
 * and reduced-motion state into performance budgets, thresholds, and
 * validation. It performs no state management and has no side effects.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import type {
  BudgetCategory,
  BudgetPriority,
  BudgetLifecycle,
  BudgetThresholdOperator,
  PerformanceBudgetQualityProfile,
  BudgetConstraints,
  BudgetDefinition,
} from './performance-budget.types';

import type { QualityPreset } from './three.types';

import {
  BUDGET_CATEGORIES,
  BUDGET_PRIORITIES,
  BUDGET_LIFECYCLE_STATES,
} from './performance-budget.types';

import {
  PERFORMANCE_BUDGET_QUALITY_PROFILES,
  DEFAULT_BUDGET_CONSTRAINTS,
  BUDGET_PRIORITY_ORDER,
} from './performance-budget.constants';

/* -------------------------------------------------------------------------- */
/*                              Type Guards                                    */
/* -------------------------------------------------------------------------- */

/** Type guard: is a string a valid {@link BudgetCategory}? */
export function isBudgetCategory(value: unknown): value is BudgetCategory {
  return (
    typeof value === 'string' &&
    (BUDGET_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link BudgetPriority}? */
export function isBudgetPriority(value: unknown): value is BudgetPriority {
  return (
    typeof value === 'string' &&
    (BUDGET_PRIORITIES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link BudgetLifecycle}? */
export function isBudgetLifecycle(value: unknown): value is BudgetLifecycle {
  return (
    typeof value === 'string' &&
    (BUDGET_LIFECYCLE_STATES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link BudgetThresholdOperator}? */
export function isBudgetThresholdOperator(
  value: unknown,
): value is BudgetThresholdOperator {
  return (
    typeof value === 'string'
    && ['lt', 'lte', 'eq', 'gte', 'gt'].includes(value)
  );
}

/* -------------------------------------------------------------------------- */
/*                         Quality Profile Derivation                         */
/* -------------------------------------------------------------------------- */

/**
 * Derive the quality-adapted performance budget profile for a quality preset.
 *
 * Returns a frozen {@link PerformanceBudgetQualityProfile} derived from the
 * active quality preset. Higher presets allow higher budgets.
 */
export function deriveBudgetQualityProfile(
  preset: QualityPreset,
): PerformanceBudgetQualityProfile {
  return PERFORMANCE_BUDGET_QUALITY_PROFILES[preset];
}

/* -------------------------------------------------------------------------- */
/*                          Constraint Derivation                             */
/* -------------------------------------------------------------------------- */

/**
 * Derive performance budget constraints for the current motion state.
 *
 * Reduced motion tightens constraints — fewer active budgets, lower limits
 * on concurrent evaluations.
 */
export function deriveBudgetConstraints(
  isReducedMotion: boolean,
): BudgetConstraints {
  if (isReducedMotion) {
    return Object.freeze({
      maxBudgets: 100,
      maxMetrics: 25,
      maxProfiles: 5,
      maxRecommendations: 20,
      maxEvaluationDepth: 5,
    });
  }
  return DEFAULT_BUDGET_CONSTRAINTS;
}

/* -------------------------------------------------------------------------- */
/*                        Threshold Evaluation                                */
/* -------------------------------------------------------------------------- */

/**
 * Evaluate a threshold condition.
 *
 * Returns `true` if the current value satisfies the threshold with the
 * given operator. Pure function — no side effects.
 */
export function evaluateThreshold(
  currentValue: number,
  threshold: number,
  operator: BudgetThresholdOperator,
): boolean {
  switch (operator) {
    case 'lt':  return currentValue < threshold;
    case 'lte': return currentValue <= threshold;
    case 'eq':  return currentValue === threshold;
    case 'gte': return currentValue >= threshold;
    case 'gt':  return currentValue > threshold;
    default:    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*                         Utilization Calculation                            */
/* -------------------------------------------------------------------------- */

/**
 * Calculate utilization ratio (currentValue / threshold).
 *
 * Returns 0 if threshold is 0 to avoid division by zero.
 * Values > 1.0 indicate the budget is exceeded.
 */
export function calculateUtilization(
  currentValue: number,
  threshold: number,
): number {
  if (threshold === 0) return 0;
  return currentValue / threshold;
}

/* -------------------------------------------------------------------------- */
/*                       Lifecycle Transition Validation                      */
/* -------------------------------------------------------------------------- */

/** Valid lifecycle transitions. */
const VALID_TRANSITIONS: ReadonlyMap<BudgetLifecycle, readonly BudgetLifecycle[]> = new Map([
  ['registered', ['active', 'disposed']],
  ['active', ['suspended', 'exceeded', 'disposed']],
  ['suspended', ['active', 'disposed']],
  ['exceeded', ['active', 'disposed']],
  ['disposed', []],
]);

/**
 * Validate that a lifecycle transition is allowed.
 *
 * Returns `true` if the transition from `from` to `to` is valid.
 */
export function isValidLifecycleTransition(
  from: BudgetLifecycle,
  to: BudgetLifecycle,
): boolean {
  const allowed = VALID_TRANSITIONS.get(from);
  if (!allowed) return false;
  return allowed.includes(to);
}

/* -------------------------------------------------------------------------- */
/*                       Priority Clamping                                    */
/* -------------------------------------------------------------------------- */

/**
 * Clamp a priority downward (toward lower priority).
 *
 * Returns whichever of two priorities is lower in the priority order.
 * Higher {@link BUDGET_PRIORITY_ORDER} index = lower priority.
 */
export function clampBudgetPriorityDown(
  priority: BudgetPriority,
  floor: BudgetPriority,
): BudgetPriority {
  return BUDGET_PRIORITY_ORDER[priority] >= BUDGET_PRIORITY_ORDER[floor]
    ? priority
    : floor;
}

/* -------------------------------------------------------------------------- */
/*                       Budget Validation                                    */
/* -------------------------------------------------------------------------- */

/**
 * Validate that no circular dependencies exist in a set of budget definitions.
 *
 * Budgets currently have no explicit dependencies, so this always returns
 * `true`. Included for forward compatibility with future dependency support.
 */
export function validateBudgetGraph(
  _definitions: readonly BudgetDefinition[],
): boolean {
  return true;
}
