/**
 * usePerformanceBudgetQuality — Quality Profile Queries
 *
 * Subscribes to the budget-manager snapshot and provides access to
 * the active quality profile and per-category budget limits. Useful
 * for UI that adapts to quality settings.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import { performanceBudgetManager } from '../performance-budget-manager';
import { usePerformanceBudgetContext } from '../performance-budget-provider';

import type {
  BudgetSnapshot,
  PerformanceBudgetQualityProfile,
} from '../performance-budget.types';

/**
 * Get the current budget snapshot (used by `useSyncExternalStore`).
 */
function getBudgetSnapshot(): BudgetSnapshot {
  return performanceBudgetManager.getSnapshot();
}

/**
 * Subscribe to budget snapshot changes (used by `useSyncExternalStore`).
 */
function subscribeBudget(callback: () => void): () => void {
  return performanceBudgetManager.subscribe(callback);
}

/**
 * Derived quality information for the performance budget system.
 */
export interface BudgetQualityInfo {
  /** The active quality profile. */
  readonly qualityProfile: PerformanceBudgetQualityProfile;
  /** The active quality preset. */
  readonly qualityPreset: BudgetSnapshot['qualityPreset'];
  /** Maximum frame time for the active profile. */
  readonly maxFrameTime: number;
  /** Maximum draw calls for the active profile. */
  readonly maxDrawCalls: number;
  /** Maximum triangles for the active profile. */
  readonly maxTriangles: number;
  /** Maximum texture memory for the active profile. */
  readonly maxTextureMemory: number;
  /** Maximum geometry memory for the active profile. */
  readonly maxGeometryMemory: number;
  /** Maximum lights for the active profile. */
  readonly maxLights: number;
  /** Maximum particles for the active profile. */
  readonly maxParticles: number;
  /** Maximum asset memory for the active profile. */
  readonly maxAssetMemory: number;
}

/**
 * Access derived quality profile information.
 *
 * Must be used within a {@link PerformanceBudgetRoot}. Re-renders only
 * when the quality profile changes.
 *
 * @example
 * ```tsx
 * function QualityInfo() {
 *   const { qualityPreset, maxFrameTime } = usePerformanceBudgetQuality();
 *   return <span>{qualityPreset}: {maxFrameTime}ms budget</span>;
 * }
 * ```
 */
export function usePerformanceBudgetQuality(): BudgetQualityInfo {
  /* Confirm the provider is mounted. */
  usePerformanceBudgetContext();

  const snapshot = useSyncExternalStore(
    subscribeBudget,
    getBudgetSnapshot,
    getBudgetSnapshot,
  );

  return useMemo<BudgetQualityInfo>(
    () => ({
      qualityProfile: snapshot.qualityProfile,
      qualityPreset: snapshot.qualityPreset,
      maxFrameTime: snapshot.qualityProfile.maxFrameTime,
      maxDrawCalls: snapshot.qualityProfile.maxDrawCalls,
      maxTriangles: snapshot.qualityProfile.maxTriangles,
      maxTextureMemory: snapshot.qualityProfile.maxTextureMemory,
      maxGeometryMemory: snapshot.qualityProfile.maxGeometryMemory,
      maxLights: snapshot.qualityProfile.maxLights,
      maxParticles: snapshot.qualityProfile.maxParticles,
      maxAssetMemory: snapshot.qualityProfile.maxAssetMemory,
    }),
    [
      snapshot.qualityProfile,
      snapshot.qualityPreset,
    ],
  );
}
