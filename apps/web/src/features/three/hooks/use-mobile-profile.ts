/**
 * useMobileProfile — Active Mobile Profile and Tier Information
 *
 * Provides the active mobile profile, its capability profile, and
 * convenience booleans for common tier checks.
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { useMobileFallbackContext } from '../mobile-fallback-provider';

import type {
  MobileProfile,
  MobileCapabilityProfile,
} from '../mobile-fallback.types';

/**
 * Return type — active profile information.
 */
export interface MobileProfileInfo {
  /** The active mobile profile tier. */
  readonly activeProfile: MobileProfile;
  /** The complete capability profile for the active tier. */
  readonly profile: MobileCapabilityProfile;
  /** Whether the active tier is considered constrained. */
  readonly isConstrained: boolean;
  /** Whether the active tier enables 3D rendering. */
  readonly enables3D: boolean;
  /** Whether the active tier enables post-processing. */
  readonly enablesPostProcessing: boolean;
  /** Whether the active tier enables shadows. */
  readonly enablesShadows: boolean;
  /** Maximum particles for the active tier. */
  readonly maxParticles: number;
  /** Maximum lights for the active tier. */
  readonly maxLights: number;
  /** Maximum texture resolution for the active tier. */
  readonly maxTextureResolution: number;
  /** Maximum polygon budget for the active tier. */
  readonly maxPolygons: number;
  /** Maximum draw calls for the active tier. */
  readonly maxDrawCalls: number;
  /** Maximum concurrent animations for the active tier. */
  readonly maxAnimations: number;
  /** Whether the active profile is 'ultra'. */
  readonly isUltra: boolean;
  /** Whether the active profile is 'high'. */
  readonly isHigh: boolean;
  /** Whether the active profile is 'medium'. */
  readonly isMedium: boolean;
  /** Whether the active profile is 'low'. */
  readonly isLow: boolean;
  /** Whether the active profile is 'minimal'. */
  readonly isMinimal: boolean;
  /** Whether the active profile is 'unknown'. */
  readonly isUnknown: boolean;
}

/**
 * Active mobile profile and tier information.
 *
 * @example
 * ```tsx
 * function ProfileStatus() {
 *   const { activeProfile, isConstrained, maxParticles } = useMobileProfile();
 *
 *   return (
 *     <div>
 *       <span>Profile: {activeProfile}</span>
 *       <span>Constrained: {isConstrained ? 'Yes' : 'No'}</span>
 *       <span>Max Particles: {maxParticles}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMobileProfile(): MobileProfileInfo {
  const { snapshot } = useMobileFallbackContext();

  return useMemo<MobileProfileInfo>(() => ({
    activeProfile: snapshot.activeProfile,
    profile: snapshot.profile,
    isConstrained: snapshot.profile.isConstrained,
    enables3D: snapshot.profile.enables3D,
    enablesPostProcessing: snapshot.profile.enablesPostProcessing,
    enablesShadows: snapshot.profile.enablesShadows,
    maxParticles: snapshot.profile.maxParticles,
    maxLights: snapshot.profile.maxLights,
    maxTextureResolution: snapshot.profile.maxTextureResolution,
    maxPolygons: snapshot.profile.maxPolygons,
    maxDrawCalls: snapshot.profile.maxDrawCalls,
    maxAnimations: snapshot.profile.maxAnimations,
    isUltra: snapshot.activeProfile === 'ultra',
    isHigh: snapshot.activeProfile === 'high',
    isMedium: snapshot.activeProfile === 'medium',
    isLow: snapshot.activeProfile === 'low',
    isMinimal: snapshot.activeProfile === 'minimal',
    isUnknown: snapshot.activeProfile === 'unknown',
  }), [snapshot]);
}
