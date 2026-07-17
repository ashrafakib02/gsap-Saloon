/**
 * Performance Budget Root — Lifecycle Owner for Budget Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 *
 * This component:
 *   - Reads ThreeContext to determine if 3D is enabled
 *   - Initializes the performance-budget-manager singleton on mount
 *   - Subscribes to manager state changes via useSyncExternalStore
 *   - Forwards quality and reduced-motion changes to the manager
 *   - Provides PerformanceBudgetContext to all budget-consuming descendants
 *
 * Renders INSIDE AssetRoot — as children, not wrapping it.
 * Gates rendering behind threeCtx.isEnabled.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { useThree } from './hooks/use-three';
import { performanceBudgetManager } from './performance-budget-manager';
import {
  PerformanceBudgetContext,
  type PerformanceBudgetContextValue,
} from './performance-budget-provider';

import type { BudgetSnapshot } from './performance-budget.types';

// ── Props ──────────────────────────────────────────────────

interface PerformanceBudgetRootProps {
  /** The budget-consuming subtree. */
  readonly children: ReactNode;
}

// ── useSyncExternalStore source ────────────────────────────

/** Subscribe to budget-manager state changes. */
function subscribeBudget(callback: () => void): () => void {
  return performanceBudgetManager.subscribe(callback);
}

/** Get the current snapshot (for useSyncExternalStore). */
function getBudgetSnapshot(): BudgetSnapshot {
  return performanceBudgetManager.getSnapshot();
}

// ── Component ──────────────────────────────────────────────

/**
 * Lifecycle owner for performance budget architecture.
 *
 * Initializes the budget-manager singleton and provides budget state to
 * descendants. Renders inside AssetRoot as children. Gates behind
 * the Three context's isEnabled flag — when 3D is off, budget state
 * remains at its default (no budgets registered, zero revision).
 *
 * @example
 * ```tsx
 * <AssetRoot>
 *   <PerformanceBudgetRoot>
 *     <BudgetOverlays />
 *   </PerformanceBudgetRoot>
 * </AssetRoot>
 * ```
 */
export function PerformanceBudgetRoot({ children }: PerformanceBudgetRootProps) {
  const { isEnabled, isReducedMotion, quality } = useThree();

  // ── Lifecycle: init / destroy ────────────────────────────

  useEffect(() => {
    if (!isEnabled) return;

    performanceBudgetManager.init();
    return () => {
      performanceBudgetManager.destroy();
    };
  }, [isEnabled]);

  // ── Forward upstream state changes ───────────────────────

  useEffect(() => {
    if (!isEnabled) return;
    performanceBudgetManager.setReducedMotion(isReducedMotion);
  }, [isEnabled, isReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    performanceBudgetManager.setQualityPreset(quality.preset);
  }, [isEnabled, quality.preset]);

  // ── Subscribe to snapshot ────────────────────────────────

  const snapshot = useSyncExternalStore(subscribeBudget, getBudgetSnapshot);

  // ── Derived state ────────────────────────────────────────

  const isEnabledBudget = useMemo(
    () => isEnabled && performanceBudgetManager.isInitialized(),
    [isEnabled],
  );

  // ── Context value (memoized) ─────────────────────────────

  const value = useMemo<PerformanceBudgetContextValue>(
    () => ({
      manager: performanceBudgetManager,
      snapshot,
      isEnabled: isEnabledBudget,
      isReducedMotion,
    }),
    [snapshot, isEnabledBudget, isReducedMotion],
  );

  // ── Gate ─────────────────────────────────────────────────

  if (!isEnabled) {
    return null;
  }

  return (
    <PerformanceBudgetContext.Provider value={value}>
      {children}
    </PerformanceBudgetContext.Provider>
  );
}
