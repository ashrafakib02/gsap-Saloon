/**
 * useAccessibilityProfile — Active Accessibility Profile Information
 *
 * Provides information about the currently active accessibility profile,
 * including profile metadata, convenience booleans, and WCAG requirements.
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useAccessibilityFallbackContext } from '../accessibility-fallback-provider';

/**
 * Return type — active accessibility profile information.
 */
export interface AccessibilityProfileInfo {
  /** The active accessibility profile. */
  readonly activeProfile: import('../accessibility-fallback.types').AccessibilityProfile;
  /** The complete capability profile for the active profile. */
  readonly profile: import('../accessibility-fallback.types').AccessibilityCapabilityProfile;
  /** Whether this is the default profile. */
  readonly isDefault: boolean;
  /** Whether this is the reduced-motion profile. */
  readonly isReducedMotionProfile: boolean;
  /** Whether this is the high-contrast profile. */
  readonly isHighContrastProfile: boolean;
  /** Whether this is the keyboard profile. */
  readonly isKeyboardProfile: boolean;
  /** Whether this is the screen-reader profile. */
  readonly isScreenReaderProfile: boolean;
  /** Whether this is the low-vision profile. */
  readonly isLowVisionProfile: boolean;
  /** Whether this is a custom profile. */
  readonly isCustom: boolean;
  /** Whether the profile requires reduced motion. */
  readonly requiresReducedMotion: boolean;
  /** Whether the profile requires high contrast. */
  readonly requiresHighContrast: boolean;
  /** Whether the profile requires keyboard navigation. */
  readonly requiresKeyboard: boolean;
  /** Whether the profile requires screen reader support. */
  readonly requiresScreenReader: boolean;
  /** Whether 3D rendering is enabled for this profile. */
  readonly enables3D: boolean;
  /** Whether animations are enabled for this profile. */
  readonly enablesAnimations: boolean;
  /** Whether audio is enabled for this profile. */
  readonly enablesAudio: boolean;
  /** Minimum contrast ratio (WCAG AA = 4.5, AAA = 7). */
  readonly minContrastRatio: number;
  /** Minimum touch target size in pixels. */
  readonly minTouchTargetSize: number;
  /** Maximum animation duration in ms (0 = no animation). */
  readonly maxAnimationDuration: number;
  /** Maximum concurrent animations. */
  readonly maxConcurrentAnimations: number;
}

/**
 * Active accessibility profile information.
 *
 * @example
 * ```tsx
 * function ProfileStatus() {
 *   const { activeProfile, requiresReducedMotion, minContrastRatio } = useAccessibilityProfile();
 *
 *   return (
 *     <div>
 *       <span>Profile: {activeProfile}</span>
 *       <span>Reduced Motion: {requiresReducedMotion ? 'Yes' : 'No'}</span>
 *       <span>Min Contrast: {minContrastRatio}:1</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccessibilityProfile(): AccessibilityProfileInfo {
  const { snapshot } = useAccessibilityFallbackContext();

  return useMemo<AccessibilityProfileInfo>(() => {
    const { profile } = snapshot;

    return {
      activeProfile: snapshot.activeProfile,
      profile,
      isDefault: snapshot.activeProfile === 'default',
      isReducedMotionProfile: snapshot.activeProfile === 'reduced-motion',
      isHighContrastProfile: snapshot.activeProfile === 'high-contrast',
      isKeyboardProfile: snapshot.activeProfile === 'keyboard',
      isScreenReaderProfile: snapshot.activeProfile === 'screen-reader',
      isLowVisionProfile: snapshot.activeProfile === 'low-vision',
      isCustom: snapshot.activeProfile === 'custom',
      requiresReducedMotion: profile.requiresReducedMotion,
      requiresHighContrast: profile.requiresHighContrast,
      requiresKeyboard: profile.requiresKeyboard,
      requiresScreenReader: profile.requiresScreenReader,
      enables3D: snapshot.enables3D,
      enablesAnimations: snapshot.enablesAnimations,
      enablesAudio: snapshot.enablesAudio,
      minContrastRatio: profile.minContrastRatio,
      minTouchTargetSize: profile.minTouchTargetSize,
      maxAnimationDuration: profile.maxAnimationDuration,
      maxConcurrentAnimations: profile.maxConcurrentAnimations,
    };
  }, [snapshot]);
}
