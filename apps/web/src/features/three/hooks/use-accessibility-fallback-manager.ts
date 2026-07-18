/**
 * useAccessibilityFallbackManager — Memoized Bound Manager Methods
 *
 * Provides stable, memoized references to the accessibility fallback manager's
 * mutation methods. Safe for use in dependency arrays.
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useAccessibilityFallbackContext } from '../accessibility-fallback-provider';

import type { AccessibilityProfile } from '../accessibility-fallback.types';
import type { AccessibilityRule } from '../accessibility-fallback.types';
import type { AccessibilityPreference } from '../accessibility-fallback.types';
import type { AccessibilityCompatibilityEntry } from '../accessibility-fallback.types';

/**
 * Return type — memoized manager methods.
 */
export interface UseAccessibilityFallbackManagerReturn {
  /** Set the active accessibility profile. */
  readonly setActiveProfile: (profile: AccessibilityProfile) => void;
  /** Get the active accessibility profile. */
  readonly getActiveProfile: () => AccessibilityProfile;
  /** Register a capability profile. */
  readonly registerProfile: (profile: import('../accessibility-fallback.types').AccessibilityCapabilityProfile) => void;
  /** Register an accessibility rule. */
  readonly registerRule: (rule: AccessibilityRule) => void;
  /** Unregister an accessibility rule. */
  readonly unregisterRule: (id: string) => void;
  /** Register an accessibility preference. */
  readonly registerPreference: (preference: AccessibilityPreference) => void;
  /** Unregister an accessibility preference. */
  readonly unregisterPreference: (id: string) => void;
  /** Register a compatibility entry. */
  readonly registerCompatibility: (entry: AccessibilityCompatibilityEntry) => void;
  /** Unregister a compatibility entry. */
  readonly unregisterCompatibility: (id: string) => void;
  /** Evaluate all rules and generate recommendations. */
  readonly evaluate: () => void;
  /** Set reduced-motion state. */
  readonly setReducedMotion: (reduced: boolean) => void;
  /** Set high-contrast state. */
  readonly setHighContrast: (highContrast: boolean) => void;
}

/**
 * Memoized bound manager methods for the accessibility fallback system.
 *
 * @example
 * ```tsx
 * function ProfileSwitcher() {
 *   const { setActiveProfile, setReducedMotion } = useAccessibilityFallbackManager();
 *
 *   return (
 *     <button onClick={() => setActiveProfile('high-contrast')}>
 *       Enable High Contrast
 *     </button>
 *   );
 * }
 * ```
 */
export function useAccessibilityFallbackManager(): UseAccessibilityFallbackManagerReturn {
  const { manager } = useAccessibilityFallbackContext();

  return useMemo<UseAccessibilityFallbackManagerReturn>(
    () => ({
      setActiveProfile: manager.setActiveProfile,
      getActiveProfile: manager.getActiveProfile,
      registerProfile: manager.registerProfile,
      registerRule: manager.registerRule,
      unregisterRule: manager.unregisterRule,
      registerPreference: manager.registerPreference,
      unregisterPreference: manager.unregisterPreference,
      registerCompatibility: manager.registerCompatibility,
      unregisterCompatibility: manager.unregisterCompatibility,
      evaluate: manager.evaluate,
      setReducedMotion: manager.setReducedMotion,
      setHighContrast: manager.setHighContrast,
    }),
    [manager],
  );
}
