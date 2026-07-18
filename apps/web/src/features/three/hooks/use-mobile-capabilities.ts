/**
 * useMobileCapabilities — Derived Capability State for Mobile Fallback
 *
 * Provides derived capability information from the mobile fallback snapshot.
 * Returns counts, category queries, and convenience booleans for common
 * capability checks.
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useMobileFallbackContext } from '../mobile-fallback-provider';

import type {
  MobileCapabilityCategory,
  MobileCapabilityEntry,
  MobileFallbackStrategy,
} from '../mobile-fallback.types';

/**
 * Return type — derived capability state.
 */
export interface MobileCapabilitiesInfo {
  /** Total number of registered capability categories. */
  readonly totalCount: number;
  /** Number of active capabilities (strategy !== 'disabled'). */
  readonly activeCount: number;
  /** Number of disabled capabilities. */
  readonly disabledCount: number;
  /** Number of simplified capabilities. */
  readonly simplifiedCount: number;
  /** Number of deferred capabilities. */
  readonly deferredCount: number;
  /** Whether 3D rendering is enabled for the active profile. */
  readonly enables3D: boolean;
  /** Whether post-processing is enabled. */
  readonly enablesPostProcessing: boolean;
  /** Whether shadows are enabled. */
  readonly enablesShadows: boolean;
  /** Get the capability entry for a specific category. */
  readonly getCategory: (category: MobileCapabilityCategory) => MobileCapabilityEntry | undefined;
  /** Get the strategy for a specific category. */
  readonly getStrategy: (category: MobileCapabilityCategory) => MobileFallbackStrategy;
  /** Check if a specific category is enabled. */
  readonly isCategoryEnabled: (category: MobileCapabilityCategory) => boolean;
  /** Check if a specific category is simplified. */
  readonly isCategorySimplified: (category: MobileCapabilityCategory) => boolean;
  /** Check if a specific category is deferred. */
  readonly isCategoryDeferred: (category: MobileCapabilityCategory) => boolean;
  /** Get all enabled categories. */
  readonly enabledCategories: readonly MobileCapabilityCategory[];
  /** Get all disabled categories. */
  readonly disabledCategories: readonly MobileCapabilityCategory[];
}

/**
 * Derived capability state from the mobile fallback snapshot.
 *
 * @example
 * ```tsx
 * function CapabilityStatus() {
 *   const { enables3D, enablesShadows, activeCount, totalCount } = useMobileCapabilities();
 *
 *   return (
 *     <div>
 *       <span>3D: {enables3D ? 'ON' : 'OFF'}</span>
 *       <span>Shadows: {enablesShadows ? 'ON' : 'OFF'}</span>
 *       <span>Active: {activeCount}/{totalCount}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMobileCapabilities(): MobileCapabilitiesInfo {
  const { snapshot } = useMobileFallbackContext();

  return useMemo<MobileCapabilitiesInfo>(() => {
    const enabledCategories: MobileCapabilityCategory[] = [];
    const disabledCategories: MobileCapabilityCategory[] = [];

    for (const [category, entry] of snapshot.capabilities) {
      if (entry.isEnabled) {
        enabledCategories.push(category);
      } else {
        disabledCategories.push(category);
      }
    }

    return {
      totalCount: snapshot.capabilities.size,
      activeCount: snapshot.activeCapabilityCount,
      disabledCount: snapshot.disabledCapabilityCount,
      simplifiedCount: snapshot.simplifiedCapabilityCount,
      deferredCount: snapshot.deferredCapabilityCount,
      enables3D: snapshot.enables3D,
      enablesPostProcessing: snapshot.enablesPostProcessing,
      enablesShadows: snapshot.enablesShadows,
      getCategory: (category) => snapshot.capabilities.get(category),
      getStrategy: (category) => snapshot.capabilities.get(category)?.strategy ?? 'disabled',
      isCategoryEnabled: (category) => snapshot.capabilities.get(category)?.isEnabled ?? false,
      isCategorySimplified: (category) => snapshot.capabilities.get(category)?.isSimplified ?? false,
      isCategoryDeferred: (category) => snapshot.capabilities.get(category)?.isDeferred ?? false,
      enabledCategories,
      disabledCategories,
    };
  }, [snapshot]);
}
