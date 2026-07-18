/**
 * useMobileRegistry — Read-Only Registry Queries for Mobile Fallback
 *
 * Provides read-only access to the mobile fallback registry for querying
 * capabilities, feature flags, rules, and compatibility entries.
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useMobileFallbackContext } from '../mobile-fallback-provider';

import type {
  MobileCapabilityCategory,
  MobileCapabilityEntry,
  MobileFallbackStrategy,
  MobileFeatureFlag,
  MobileFallbackRule,
  MobileCompatibilityEntry,
} from '../mobile-fallback.types';

/**
 * Return type — registry query methods.
 */
export interface MobileRegistryInfo {
  /** Get the capability entry for a category. */
  readonly getCapability: (category: MobileCapabilityCategory) => MobileCapabilityEntry | undefined;
  /** Get the strategy for a category. */
  readonly getStrategy: (category: MobileCapabilityCategory) => MobileFallbackStrategy;
  /** Get a feature flag by ID. */
  readonly getFeatureFlag: (id: string) => MobileFeatureFlag | undefined;
  /** Get a rule by ID. */
  readonly getRule: (id: string) => MobileFallbackRule | undefined;
  /** Get a compatibility entry by ID. */
  readonly getCompatibility: (id: string) => MobileCompatibilityEntry | undefined;
  /** Get all capability categories. */
  readonly getCapabilityCategories: () => readonly MobileCapabilityCategory[];
  /** Get all active capability categories. */
  readonly getActiveCategories: () => readonly MobileCapabilityCategory[];
  /** Get all disabled capability categories. */
  readonly getDisabledCategories: () => readonly MobileCapabilityCategory[];
  /** Get all simplified capability categories. */
  readonly getSimplifiedCategories: () => readonly MobileCapabilityCategory[];
  /** Get all deferred capability categories. */
  readonly getDeferredCategories: () => readonly MobileCapabilityCategory[];
  /** Get all feature flags. */
  readonly getFeatureFlags: () => readonly MobileFeatureFlag[];
  /** Get all rules. */
  readonly getRules: () => readonly MobileFallbackRule[];
  /** Get all compatibility entries. */
  readonly getCompatibilityEntries: () => readonly MobileCompatibilityEntry[];
  /** Check if a feature is enabled. */
  readonly isFeatureEnabled: (featureId: string) => boolean;
  /** Check if a category has a specific strategy. */
  readonly hasStrategy: (category: MobileCapabilityCategory, strategy: MobileFallbackStrategy) => boolean;
  /** Check if a category is enabled. */
  readonly isCategoryEnabled: (category: MobileCapabilityCategory) => boolean;
  /** Check if a category is simplified. */
  readonly isCategorySimplified: (category: MobileCapabilityCategory) => boolean;
  /** Total number of capabilities. */
  readonly capabilityCount: () => number;
  /** Total number of feature flags. */
  readonly featureFlagCount: () => number;
  /** Total number of rules. */
  readonly ruleCount: () => number;
}

/**
 * Read-only registry queries for mobile fallback state.
 *
 * @example
 * ```tsx
 * function RegistryStatus() {
 *   const { capabilityCount, getStrategy, isCategoryEnabled } = useMobileRegistry();
 *
 *   return (
 *     <div>
 *       <span>Capabilities: {capabilityCount()}</span>
 *       <span>Camera: {getStrategy('camera')}</span>
 *       <span>Shadows Enabled: {isCategoryEnabled('shadows') ? 'Yes' : 'No'}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMobileRegistry(): MobileRegistryInfo {
  const { manager } = useMobileFallbackContext();

  return useMemo<MobileRegistryInfo>(() => {
    const registry = manager.getRegistry();

    return {
      getCapability: registry.getCapability,
      getStrategy: registry.getStrategy,
      getFeatureFlag: registry.getFeatureFlag,
      getRule: registry.getRule,
      getCompatibility: registry.getCompatibility,
      getCapabilityCategories: registry.getCapabilityCategories,
      getActiveCategories: registry.getActiveCategories,
      getDisabledCategories: registry.getDisabledCategories,
      getSimplifiedCategories: registry.getSimplifiedCategories,
      getDeferredCategories: registry.getDeferredCategories,
      getFeatureFlags: registry.getFeatureFlags,
      getRules: registry.getRules,
      getCompatibilityEntries: registry.getCompatibilityEntries,
      isFeatureEnabled: registry.isFeatureEnabled,
      hasStrategy: registry.hasStrategy,
      isCategoryEnabled: registry.isCategoryEnabled,
      isCategorySimplified: registry.isCategorySimplified,
      capabilityCount: registry.capabilityCount,
      featureFlagCount: registry.featureFlagCount,
      ruleCount: registry.ruleCount,
    };
  }, [manager]);
}
