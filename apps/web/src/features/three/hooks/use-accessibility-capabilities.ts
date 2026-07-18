/**
 * useAccessibilityCapabilities — Derived Accessibility Capability State
 *
 * Provides derived capability information from the accessibility fallback
 * snapshot, including counts, category queries, and convenience booleans.
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useAccessibilityFallbackContext } from '../accessibility-fallback-provider';

import type {
  AccessibilityCategory,
  AccessibilityCapabilityEntry,
  AccessibilityStrategy,
} from '../accessibility-fallback.types';

/**
 * Return type — derived accessibility capability information.
 */
export interface AccessibilityCapabilitiesInfo {
  /** Total number of capability categories. */
  readonly totalCount: number;
  /** Number of active capabilities (strategy !== 'disabled'). */
  readonly activeCount: number;
  /** Number of disabled capabilities. */
  readonly disabledCount: number;
  /** Number of alternative capabilities. */
  readonly alternativeCount: number;
  /** Number of enhanced capabilities. */
  readonly enhancedCount: number;
  /** Number of substituted capabilities. */
  readonly substitutedCount: number;
  /** Whether 3D rendering is enabled. */
  readonly enables3D: boolean;
  /** Whether animations are enabled. */
  readonly enablesAnimations: boolean;
  /** Whether audio is enabled. */
  readonly enablesAudio: boolean;
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
  /** Whether high-contrast is active. */
  readonly isHighContrast: boolean;
  /** Get the capability entry for a category. */
  readonly getCategory: (category: AccessibilityCategory) => AccessibilityCapabilityEntry | undefined;
  /** Get the strategy for a category. */
  readonly getStrategy: (category: AccessibilityCategory) => AccessibilityStrategy;
  /** Check if a category is enabled. */
  readonly isCategoryEnabled: (category: AccessibilityCategory) => boolean;
  /** Check if a category uses an alternative. */
  readonly isCategoryAlternative: (category: AccessibilityCategory) => boolean;
  /** Check if a category is enhanced. */
  readonly isCategoryEnhanced: (category: AccessibilityCategory) => boolean;
  /** Check if a category is substituted. */
  readonly isCategorySubstituted: (category: AccessibilityCategory) => boolean;
  /** Check if a category has a specific strategy. */
  readonly hasStrategy: (category: AccessibilityCategory, strategy: AccessibilityStrategy) => boolean;
  /** All active category IDs. */
  readonly activeCategories: readonly AccessibilityCategory[];
  /** All disabled category IDs. */
  readonly disabledCategories: readonly AccessibilityCategory[];
  /** All alternative category IDs. */
  readonly alternativeCategories: readonly AccessibilityCategory[];
  /** All enhanced category IDs. */
  readonly enhancedCategories: readonly AccessibilityCategory[];
}

/**
 * Derived accessibility capability information.
 *
 * @example
 * ```tsx
 * function CapabilityStatus() {
 *   const { activeCount, disabledCount, isReducedMotion, getCategory } = useAccessibilityCapabilities();
 *
 *   return (
 *     <div>
 *       <span>Active: {activeCount}</span>
 *       <span>Disabled: {disabledCount}</span>
 *       <span>Motion: {getCategory('motion')?.strategy}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccessibilityCapabilities(): AccessibilityCapabilitiesInfo {
  const { snapshot } = useAccessibilityFallbackContext();

  return useMemo<AccessibilityCapabilitiesInfo>(() => {
    const { capabilities } = snapshot;
    const activeCategories: AccessibilityCategory[] = [];
    const disabledCategories: AccessibilityCategory[] = [];
    const alternativeCategories: AccessibilityCategory[] = [];
    const enhancedCategories: AccessibilityCategory[] = [];

    for (const [category, entry] of capabilities) {
      if (entry.isEnabled) {
        activeCategories.push(category);
      } else {
        disabledCategories.push(category);
      }
      if (entry.isAlternative) alternativeCategories.push(category);
      if (entry.isEnhanced) enhancedCategories.push(category);
    }

    return {
      totalCount: capabilities.size,
      activeCount: snapshot.activeCapabilityCount,
      disabledCount: snapshot.disabledCapabilityCount,
      alternativeCount: snapshot.alternativeCapabilityCount,
      enhancedCount: snapshot.enhancedCapabilityCount,
      substitutedCount: 0,
      enables3D: snapshot.enables3D,
      enablesAnimations: snapshot.enablesAnimations,
      enablesAudio: snapshot.enablesAudio,
      isReducedMotion: snapshot.isReducedMotion,
      isHighContrast: snapshot.isHighContrast,
      getCategory: (category) => capabilities.get(category),
      getStrategy: (category) => capabilities.get(category)?.strategy ?? 'disabled',
      isCategoryEnabled: (category) => capabilities.get(category)?.isEnabled ?? false,
      isCategoryAlternative: (category) => capabilities.get(category)?.isAlternative ?? false,
      isCategoryEnhanced: (category) => capabilities.get(category)?.isEnhanced ?? false,
      isCategorySubstituted: (category) => capabilities.get(category)?.isSubstituted ?? false,
      hasStrategy: (category, strategy) => capabilities.get(category)?.strategy === strategy,
      activeCategories,
      disabledCategories,
      alternativeCategories,
      enhancedCategories,
    };
  }, [snapshot]);
}
