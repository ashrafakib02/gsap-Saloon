/**
 * useAccessibilityRegistry — Read-Only Registry Queries for Accessibility Fallback
 *
 * Provides read-only access to the accessibility fallback registry for querying
 * capabilities, preferences, rules, and compatibility entries.
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useAccessibilityFallbackContext } from '../accessibility-fallback-provider';

import type {
  AccessibilityCategory,
  AccessibilityCapabilityEntry,
  AccessibilityStrategy,
  AccessibilityPreference,
  AccessibilityRule,
  AccessibilityCompatibilityEntry,
} from '../accessibility-fallback.types';

/**
 * Return type — registry query methods.
 */
export interface AccessibilityRegistryInfo {
  /** Get the capability entry for a category. */
  readonly getCapability: (category: AccessibilityCategory) => AccessibilityCapabilityEntry | undefined;
  /** Get the strategy for a category. */
  readonly getStrategy: (category: AccessibilityCategory) => AccessibilityStrategy;
  /** Get a preference by ID. */
  readonly getPreference: (id: string) => AccessibilityPreference | undefined;
  /** Get a rule by ID. */
  readonly getRule: (id: string) => AccessibilityRule | undefined;
  /** Get a compatibility entry by ID. */
  readonly getCompatibility: (id: string) => AccessibilityCompatibilityEntry | undefined;
  /** Get all accessibility categories. */
  readonly getCategories: () => readonly AccessibilityCategory[];
  /** Get all active capability categories. */
  readonly getActiveCategories: () => readonly AccessibilityCategory[];
  /** Get all disabled capability categories. */
  readonly getDisabledCategories: () => readonly AccessibilityCategory[];
  /** Get all alternative capability categories. */
  readonly getAlternativeCategories: () => readonly AccessibilityCategory[];
  /** Get all enhanced capability categories. */
  readonly getEnhancedCategories: () => readonly AccessibilityCategory[];
  /** Get all substituted capability categories. */
  readonly getSubstitutedCategories: () => readonly AccessibilityCategory[];
  /** Get all preferences. */
  readonly getPreferences: () => readonly AccessibilityPreference[];
  /** Get all rules. */
  readonly getRules: () => readonly AccessibilityRule[];
  /** Get all compatibility entries. */
  readonly getCompatibilityEntries: () => readonly AccessibilityCompatibilityEntry[];
  /** Check if a preference is enabled. */
  readonly isPreferenceEnabled: (preferenceId: string) => boolean;
  /** Check if a category has a specific strategy. */
  readonly hasStrategy: (category: AccessibilityCategory, strategy: AccessibilityStrategy) => boolean;
  /** Check if a category is enabled. */
  readonly isCategoryEnabled: (category: AccessibilityCategory) => boolean;
  /** Check if a category uses an alternative. */
  readonly isCategoryAlternative: (category: AccessibilityCategory) => boolean;
  /** Total number of capabilities. */
  readonly capabilityCount: () => number;
  /** Total number of preferences. */
  readonly preferenceCount: () => number;
  /** Total number of rules. */
  readonly ruleCount: () => number;
}

/**
 * Read-only registry queries for accessibility fallback state.
 *
 * @example
 * ```tsx
 * function RegistryStatus() {
 *   const { capabilityCount, getStrategy, isCategoryEnabled } = useAccessibilityRegistry();
 *
 *   return (
 *     <div>
 *       <span>Capabilities: {capabilityCount()}</span>
 *       <span>Motion: {getStrategy('motion')}</span>
 *       <span>Keyboard Enabled: {isCategoryEnabled('keyboard') ? 'Yes' : 'No'}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccessibilityRegistry(): AccessibilityRegistryInfo {
  const { manager } = useAccessibilityFallbackContext();

  return useMemo<AccessibilityRegistryInfo>(() => {
    const registry = manager.getRegistry();

    return {
      getCapability: registry.getCapability,
      getStrategy: registry.getStrategy,
      getPreference: registry.getPreference,
      getRule: registry.getRule,
      getCompatibility: registry.getCompatibility,
      getCategories: registry.getCategories,
      getActiveCategories: registry.getActiveCategories,
      getDisabledCategories: registry.getDisabledCategories,
      getAlternativeCategories: registry.getAlternativeCategories,
      getEnhancedCategories: registry.getEnhancedCategories,
      getSubstitutedCategories: registry.getSubstitutedCategories,
      getPreferences: registry.getPreferences,
      getRules: registry.getRules,
      getCompatibilityEntries: registry.getCompatibilityEntries,
      isPreferenceEnabled: registry.isPreferenceEnabled,
      hasStrategy: registry.hasStrategy,
      isCategoryEnabled: registry.isCategoryEnabled,
      isCategoryAlternative: registry.isCategoryAlternative,
      capabilityCount: registry.capabilityCount,
      preferenceCount: registry.preferenceCount,
      ruleCount: registry.ruleCount,
    };
  }, [manager]);
}
