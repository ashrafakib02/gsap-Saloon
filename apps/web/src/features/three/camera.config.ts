/**
 * Camera Config — Pure Derivation Functions for Camera State
 *
 * Contains pure functions that derive camera quality profiles, viewport-aware
 * settings, and validate camera configurations. No React, no state, no side
 * effects.
 *
 * Phase 6.3: Config — pure derivation only.
 */

import type {
  CameraMode,
  CameraPreset,
  CameraTarget,
  CameraPresetId,
  CameraQualityProfile,
  CameraConstraints,
  CameraViewport,
} from './camera.types';

import {
  CAMERA_MODES,
  CAMERA_PRESETS,
  CAMERA_TARGETS,
} from './camera.types';

import type { QualityPreset } from './three.types';

import {
  CAMERA_PRESET_FOV,
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_NEAR,
  DEFAULT_CAMERA_FAR,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_QUALITY_PROFILE,
  DEFAULT_CAMERA_CONSTRAINTS,
} from './camera.constants';

// ── Type Guards ──────────────────────────────────────────

/** Type guard: is a string a valid {@link CameraMode}? */
export function isCameraMode(value: unknown): value is CameraMode {
  return (
    typeof value === 'string' &&
    (CAMERA_MODES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link CameraPreset}? */
export function isCameraPreset(value: unknown): value is CameraPreset {
  return (
    typeof value === 'string' &&
    (CAMERA_PRESETS as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link CameraTarget}? */
export function isCameraTarget(value: unknown): value is CameraTarget {
  return (
    typeof value === 'string' &&
    (CAMERA_TARGETS as readonly string[]).includes(value)
  );
}

// ── Quality Profile Derivation ───────────────────────────

/** Quality preset to quality profile mapping. */
const QUALITY_PROFILES: Record<QualityPreset, CameraQualityProfile> = Object.freeze({
  ultra: Object.freeze({
    preset: 'ultra',
    maxFov: 90,
    maxShadowDistance: 100,
    effectsEnabled: true,
    proceduralEnabled: true,
    orbitEnabled: true,
  }),
  high: Object.freeze({
    preset: 'high',
    maxFov: 80,
    maxShadowDistance: 75,
    effectsEnabled: true,
    proceduralEnabled: true,
    orbitEnabled: true,
  }),
  medium: Object.freeze({
    preset: 'medium',
    maxFov: 70,
    maxShadowDistance: 50,
    effectsEnabled: true,
    proceduralEnabled: true,
    orbitEnabled: true,
  }),
  low: Object.freeze({
    preset: 'low',
    maxFov: 60,
    maxShadowDistance: 25,
    effectsEnabled: false,
    proceduralEnabled: false,
    orbitEnabled: false,
  }),
  minimal: Object.freeze({
    preset: 'minimal',
    maxFov: 50,
    maxShadowDistance: 0,
    effectsEnabled: false,
    proceduralEnabled: false,
    orbitEnabled: false,
  }),
});

/**
 * Derive a quality profile from the active quality preset.
 *
 * Higher presets allow wider FOV, longer shadow distances, and more
 * camera effects. Lower presets disable procedural movement and orbit
 * controls to save GPU budget.
 *
 * @param qualityPreset - The active quality preset.
 * @returns The derived quality profile.
 */
export function deriveCameraQualityProfile(
  qualityPreset: QualityPreset,
): CameraQualityProfile {
  return QUALITY_PROFILES[qualityPreset] ?? DEFAULT_QUALITY_PROFILE;
}

// ── Viewport Derivation ──────────────────────────────────

/**
 * Derive camera viewport settings from the current viewport dimensions.
 *
 * Adapts FOV and position based on viewport breakpoint to maintain
 * consistent visual composition across devices.
 *
 * @param viewport - Current viewport dimensions.
 * @param baseFov - The base field of view from the active preset.
 * @returns Adjusted FOV and position offset.
 */
export function deriveCameraViewportSettings(
  viewport: CameraViewport,
  baseFov: number = DEFAULT_CAMERA_FOV,
): { readonly fov: number; readonly positionOffset: readonly [number, number, number] } {
  switch (viewport.breakpoint) {
    case 'wide':
      return {
        fov: Math.min(baseFov, 65),
        positionOffset: [0, 0, 0],
      };
    case 'desktop':
      return {
        fov: baseFov,
        positionOffset: [0, 0, 0],
      };
    case 'tablet':
      return {
        fov: baseFov * 1.1,
        positionOffset: [0, 0, 1],
      };
    case 'mobile':
      return {
        fov: baseFov * 1.2,
        positionOffset: [0, 0, 2],
      };
  }
}

// ── State Derivation ─────────────────────────────────────

/**
 * Derive the effective constraints from the active quality profile and
 * reduced motion state.
 *
 * Reduced motion tightens position bounds and disables procedural effects.
 * Quality profile determines the allowed FOV range and shadow distance.
 *
 * @param baseConstraints - Base camera constraints.
 * @param qualityProfile - Active quality profile.
 * @param isReducedMotion - Whether reduced motion is active.
 * @returns Effective constraints for the current context.
 */
export function deriveCameraConstraints(
  baseConstraints: CameraConstraints = DEFAULT_CAMERA_CONSTRAINTS,
  qualityProfile: CameraQualityProfile = DEFAULT_QUALITY_PROFILE,
  isReducedMotion: boolean = false,
): CameraConstraints {
  if (isReducedMotion) {
    return Object.freeze({
      ...baseConstraints,
      maxFov: Math.min(baseConstraints.maxFov, qualityProfile.maxFov),
      maxDistance: Math.min(baseConstraints.maxDistance, 50),
    });
  }
  return Object.freeze({
    ...baseConstraints,
    maxFov: Math.min(baseConstraints.maxFov, qualityProfile.maxFov),
  });
}

// ── Clamping ─────────────────────────────────────────────

/**
 * Clamp a field of view value to the valid range.
 *
 * @param fov - The desired FOV in degrees.
 * @param constraints - Camera constraints with min/max FOV.
 * @returns The clamped FOV value.
 */
export function clampFov(
  fov: number,
  constraints: CameraConstraints = DEFAULT_CAMERA_CONSTRAINTS,
): number {
  return Math.max(constraints.minFov, Math.min(constraints.maxFov, fov));
}

/**
 * Clamp a camera position to the valid bounds.
 *
 * @param position - The desired position [x, y, z].
 * @param constraints - Camera constraints with min/max position.
 * @returns The clamped position.
 */
export function clampPosition(
  position: readonly [number, number, number],
  constraints: CameraConstraints = DEFAULT_CAMERA_CONSTRAINTS,
): readonly [number, number, number] {
  return [
    Math.max(constraints.minPosition[0], Math.min(constraints.maxPosition[0], position[0])),
    Math.max(constraints.minPosition[1], Math.min(constraints.maxPosition[1], position[1])),
    Math.max(constraints.minPosition[2], Math.min(constraints.maxPosition[2], position[2])),
  ] as const;
}

// ── Preset Defaults ──────────────────────────────────────

/**
 * Resolve the default position for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default position [x, y, z].
 */
export function resolvePresetPosition(presetId: CameraPresetId): readonly [number, number, number] {
  switch (presetId) {
    case 'hero':
      return [0, 1, 6];
    case 'intro':
      return [0, 1, 5];
    case 'narrative':
      return [0, 1, 5];
    case 'services':
      return [0, 1.5, 4];
    case 'gallery':
      return [0, 1, 3];
    case 'transformation':
      return [0, 1, 5];
    case 'booking':
      return [0, 1, 5];
    case 'footer':
      return [0, 2, 8];
    case 'mobile':
      return [0, 1, 5];
    case 'reduced-motion':
      return DEFAULT_CAMERA_POSITION;
    case 'performance':
      return DEFAULT_CAMERA_POSITION;
  }
}

/**
 * Resolve the default lookAt target for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default lookAt target [x, y, z].
 */
export function resolvePresetLookAt(presetId: CameraPresetId): readonly [number, number, number] {
  switch (presetId) {
    case 'hero':
      return [0, 1.5, 0];
    case 'intro':
      return [0, 1.2, 0];
    case 'narrative':
      return [0, 1, 0];
    case 'services':
      return [0, 1.5, 0];
    case 'gallery':
      return [0, 1, 0];
    case 'transformation':
      return [0, 1.2, 0];
    case 'booking':
      return [0, 1, 0];
    case 'footer':
      return [0, 0.5, 0];
    case 'mobile':
      return DEFAULT_CAMERA_LOOK_AT;
    case 'reduced-motion':
      return DEFAULT_CAMERA_LOOK_AT;
    case 'performance':
      return DEFAULT_CAMERA_LOOK_AT;
  }
}

/**
 * Resolve the default FOV for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default field of view in degrees.
 */
export function resolvePresetFov(presetId: CameraPresetId): number {
  return CAMERA_PRESET_FOV[presetId] ?? DEFAULT_CAMERA_FOV;
}

/**
 * Resolve the default near clipping plane for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default near clipping plane.
 */
export function resolvePresetNear(presetId: CameraPresetId): number {
  switch (presetId) {
    case 'gallery':
      return 0.01;
    case 'hero':
    case 'transformation':
      return 0.05;
    default:
      return DEFAULT_CAMERA_NEAR;
  }
}

/**
 * Resolve the default far clipping plane for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default far clipping plane.
 */
export function resolvePresetFar(presetId: CameraPresetId): number {
  switch (presetId) {
    case 'footer':
      return 2000;
    case 'hero':
      return 1500;
    default:
      return DEFAULT_CAMERA_FAR;
  }
}
