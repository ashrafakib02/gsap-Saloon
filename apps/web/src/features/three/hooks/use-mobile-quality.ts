/**
 * useMobileQuality — Quality-Derived Mobile Fallback Information
 *
 * Provides quality-related information derived from the mobile fallback
 * snapshot, including feature flags, compatibility, and recommendations.
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useMobileFallbackContext } from '../mobile-fallback-provider';

import type {
  MobileFeatureFlag,
  MobileFallbackRecommendation,
  MobileCompatibilityEntry,
} from '../mobile-fallback.types';

/**
 * Return type — quality-derived mobile fallback information.
 */
export interface MobileQualityInfo {
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
  /** Whether 3D rendering is enabled. */
  readonly enables3D: boolean;
  /** Whether post-processing is enabled. */
  readonly enablesPostProcessing: boolean;
  /** Whether shadows are enabled. */
  readonly enablesShadows: boolean;
  /** Total number of registered feature flags. */
  readonly featureFlagCount: number;
  /** Total number of registered rules. */
  readonly ruleCount: number;
  /** Total number of compatibility entries. */
  readonly compatibilityCount: number;
  /** Get a feature flag by ID. */
  readonly getFeatureFlag: (id: string) => MobileFeatureFlag | undefined;
  /** Check if a feature is enabled for the active profile. */
  readonly isFeatureEnabled: (featureId: string) => boolean;
  /** Get all generated recommendations. */
  readonly recommendations: readonly MobileFallbackRecommendation[];
  /** Get all compatibility entries for the active tier. */
  readonly compatibilityEntries: readonly MobileCompatibilityEntry[];
  /** Whether there are any critical recommendations. */
  readonly hasCriticalRecommendations: boolean;
  /** Whether there are any warning recommendations. */
  readonly hasWarningRecommendations: boolean;
}

/**
 * Quality-derived mobile fallback information.
 *
 * @example
 * ```tsx
 * function QualityStatus() {
 *   const { isReducedMotion, enables3D, recommendations } = useMobileQuality();
 *
 *   return (
 *     <div>
 *       <span>Reduced Motion: {isReducedMotion ? 'Yes' : 'No'}</span>
 *       <span>3D Enabled: {enables3D ? 'Yes' : 'No'}</span>
 *       <span>Recommendations: {recommendations.length}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMobileQuality(): MobileQualityInfo {
  const { snapshot } = useMobileFallbackContext();

  return useMemo<MobileQualityInfo>(() => {
    const hasCriticalRecommendations = snapshot.recommendations.some(
      (rec) => rec.severity === 'critical',
    );
    const hasWarningRecommendations = snapshot.recommendations.some(
      (rec) => rec.severity === 'warning',
    );

    const compatibilityEntries = Array.from(snapshot.compatibilityMatrix.values());

    return {
      isReducedMotion: snapshot.isReducedMotion,
      enables3D: snapshot.enables3D,
      enablesPostProcessing: snapshot.enablesPostProcessing,
      enablesShadows: snapshot.enablesShadows,
      featureFlagCount: snapshot.featureFlagCount,
      ruleCount: snapshot.ruleCount,
      compatibilityCount: snapshot.compatibilityCount,
      getFeatureFlag: (id) => snapshot.featureFlags.get(id),
      isFeatureEnabled: (featureId) => {
        const flag = snapshot.featureFlags.get(featureId);
        if (!flag || !flag.enabled) return false;
        return flag.tiers.get(snapshot.activeProfile) ?? false;
      },
      recommendations: snapshot.recommendations,
      compatibilityEntries,
      hasCriticalRecommendations,
      hasWarningRecommendations,
    };
  }, [snapshot]);
}
