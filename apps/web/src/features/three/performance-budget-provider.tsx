/**
 * Performance Budget Provider — Context for Budget Access
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 *
 * This module creates the PerformanceBudgetContext and provides the
 * usePerformanceBudgetContext accessor. It follows the Fast Refresh
 * compliant pattern — context creation is split from provider JSX
 * so Fast Refresh works.
 *
 * Architecture:
 *   - createContext + usePerformanceBudgetContext accessor (no JSX here)
 *   - PerformanceBudgetContextValue with manager, snapshot, isEnabled
 *   - Provider component lives in performance-budget-root.tsx
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { createContext, useContext } from 'react';

import type { BudgetManager, BudgetSnapshot } from './performance-budget.types';

// ── Context Value ──────────────────────────────────────────

/**
 * The shape of the performance budget context value.
 *
 * Exposes the singleton manager, the current snapshot, and
 * whether the budget system is enabled.
 */
export interface PerformanceBudgetContextValue {
  /** The singleton performance budget manager. */
  readonly manager: BudgetManager;
  /** The current immutable budget snapshot. */
  readonly snapshot: BudgetSnapshot;
  /** Whether the budget system is enabled. */
  readonly isEnabled: boolean;
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
}

// ── Context Creation ───────────────────────────────────────

/**
 * The raw React context for performance budget state.
 *
 * Defaults to undefined — the provider in performance-budget-root.tsx
 * supplies the real value. Consumer hooks use usePerformanceBudgetContext()
 * to access it.
 */
export const PerformanceBudgetContext = createContext<
  PerformanceBudgetContextValue | undefined
>(undefined);

/**
 * Accessor for the performance budget context value.
 *
 * Throws if called outside the PerformanceBudgetRoot provider.
 */
export function usePerformanceBudgetContext(): PerformanceBudgetContextValue {
  const context = useContext(PerformanceBudgetContext);
  if (context === undefined) {
    throw new Error(
      'usePerformanceBudgetContext must be used within a PerformanceBudgetRoot provider. '
      + 'Ensure PerformanceBudgetRoot is mounted in the component tree.',
    );
  }
  return context;
}
