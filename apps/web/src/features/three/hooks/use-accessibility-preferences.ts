/**
 * useAccessibilityPreferences — Accessibility Preference Resolution
 *
 * Provides resolved preference information from the accessibility fallback
 * snapshot, including per-preference enablement and aggregate counts.
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useAccessibilityFallbackContext } from '../accessibility-fallback-provider';

import type { AccessibilityPreference } from '../accessibility-fallback.types';

/**
 * Return type — resolved accessibility preference information.
 */
export interface AccessibilityPreferencesInfo {
  /** Total number of registered preferences. */
  readonly totalCount: number;
  /** Number of enabled preferences for the active profile. */
  readonly enabledCount: number;
  /** Whether reduced-motion preference is active. */
  readonly isReduceMotionEnabled: boolean;
  /** Whether high-contrast preference is active. */
  readonly isHighContrastEnabled: boolean;
  /** Whether keyboard-navigation preference is active. */
  readonly isKeyboardNavigationEnabled: boolean;
  /** Whether screen-reader-support preference is active. */
  readonly isScreenReaderSupportEnabled: boolean;
  /** Whether enlarge-text preference is active. */
  readonly isEnlargeTextEnabled: boolean;
  /** Whether simplify-interactions preference is active. */
  readonly isSimplifyInteractionsEnabled: boolean;
  /** Whether audio-descriptions preference is active. */
  readonly isAudioDescriptionsEnabled: boolean;
  /** Get a preference by ID. */
  readonly getPreference: (id: string) => AccessibilityPreference | undefined;
  /** Check if a preference is enabled for the active profile. */
  readonly isPreferenceEnabled: (preferenceId: string) => boolean;
  /** All preferences. */
  readonly allPreferences: readonly AccessibilityPreference[];
}

/**
 * Resolved accessibility preference information.
 *
 * @example
 * ```tsx
 * function PreferenceStatus() {
 *   const { enabledCount, isReduceMotionEnabled, isHighContrastEnabled } = useAccessibilityPreferences();
 *
 *   return (
 *     <div>
 *       <span>Enabled: {enabledCount}</span>
 *       <span>Reduce Motion: {isReduceMotionEnabled ? 'Yes' : 'No'}</span>
 *       <span>High Contrast: {isHighContrastEnabled ? 'Yes' : 'No'}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccessibilityPreferences(): AccessibilityPreferencesInfo {
  const { snapshot, manager } = useAccessibilityFallbackContext();

  return useMemo<AccessibilityPreferencesInfo>(() => {
    const { preferences: prefsMap } = snapshot;
    const registry = manager.getRegistry();
    const allPrefs = Array.from(prefsMap.values());

    let enabledCount = 0;
    for (const pref of allPrefs) {
      if (registry.isPreferenceEnabled(pref.id)) {
        enabledCount += 1;
      }
    }

    return {
      totalCount: prefsMap.size,
      enabledCount,
      isReduceMotionEnabled: registry.isPreferenceEnabled('reduce-motion'),
      isHighContrastEnabled: registry.isPreferenceEnabled('high-contrast-mode'),
      isKeyboardNavigationEnabled: registry.isPreferenceEnabled('keyboard-navigation'),
      isScreenReaderSupportEnabled: registry.isPreferenceEnabled('screen-reader-support'),
      isEnlargeTextEnabled: registry.isPreferenceEnabled('enlarge-text'),
      isSimplifyInteractionsEnabled: registry.isPreferenceEnabled('simplify-interactions'),
      isAudioDescriptionsEnabled: registry.isPreferenceEnabled('audio-descriptions'),
      getPreference: (id) => prefsMap.get(id),
      isPreferenceEnabled: (preferenceId) => registry.isPreferenceEnabled(preferenceId),
      allPreferences: allPrefs,
    };
  }, [snapshot, manager]);
}
