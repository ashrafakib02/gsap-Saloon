/**
 * Environment Config — Pure Derivation Functions for Environment State
 *
 * Contains pure functions that derive environment quality profiles, constraints,
 * and validate environment configurations. No React, no state, no side effects.
 *
 * Phase 6.6: Config — pure derivation only, no rendering.
 */

import type {
  EnvironmentPreset,
  EnvironmentPresetId,
  EnvironmentCategory,
  EnvironmentGroupId,
  EnvironmentGroup,
  EnvironmentPriority,
  EnvironmentQualityProfile,
  EnvironmentConstraints,
} from './environment.types';

import {
  ENVIRONMENT_PRESETS,
  ENVIRONMENT_CATEGORIES,
  ENVIRONMENT_GROUPS,
} from './environment.types';

import type { QualityPreset } from './three.types';

import {
  ENVIRONMENT_PRESET_CATEGORY,
  ENVIRONMENT_PRESET_PRIORITY,
  ENVIRONMENT_PRESET_GROUP,
  DEFAULT_ENVIRONMENT_QUALITY_PROFILE,
  DEFAULT_ENVIRONMENT_CONSTRAINTS,
} from './environment.constants';

// ── Type Guards ────────────────────────────────────────────

/** Type guard: is a string a valid {@link EnvironmentPreset}? */
export function isEnvironmentPreset(value: unknown): value is EnvironmentPreset {
  return (
    typeof value === 'string' &&
    (ENVIRONMENT_PRESETS as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link EnvironmentCategory}? */
export function isEnvironmentCategory(value: unknown): value is EnvironmentCategory {
  return (
    typeof value === 'string' &&
    (ENVIRONMENT_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link EnvironmentGroup}? */
export function isEnvironmentGroup(value: unknown): value is EnvironmentGroup {
  return (
    typeof value === 'string' &&
    (ENVIRONMENT_GROUPS as readonly string[]).includes(value)
  );
}

// ── Quality Profile Derivation ─────────────────────────────

/** Quality preset to quality profile mapping. */
const QUALITY_PROFILES: Record<QualityPreset, EnvironmentQualityProfile> = Object.freeze({
  ultra: Object.freeze({
    preset: 'ultra',
    maxHDRResolution: 4096,
    maxReflectionResolution: 1024,
    reflectionsEnabled: true,
    fogEnabled: true,
    fogPrecision: 64,
    skyEnabled: true,
    iblEnabled: true,
    atmosphereEnabled: true,
    proceduralComplexity: 100,
    maxTransitionsPerFrame: 4,
  }),
  high: Object.freeze({
    preset: 'high',
    maxHDRResolution: 2048,
    maxReflectionResolution: 512,
    reflectionsEnabled: true,
    fogEnabled: true,
    fogPrecision: 48,
    skyEnabled: true,
    iblEnabled: true,
    atmosphereEnabled: true,
    proceduralComplexity: 75,
    maxTransitionsPerFrame: 3,
  }),
  medium: Object.freeze({
    preset: 'medium',
    maxHDRResolution: 1024,
    maxReflectionResolution: 256,
    reflectionsEnabled: true,
    fogEnabled: true,
    fogPrecision: 32,
    skyEnabled: true,
    iblEnabled: true,
    atmosphereEnabled: false,
    proceduralComplexity: 40,
    maxTransitionsPerFrame: 2,
  }),
  low: Object.freeze({
    preset: 'low',
    maxHDRResolution: 512,
    maxReflectionResolution: 128,
    reflectionsEnabled: false,
    fogEnabled: true,
    fogPrecision: 16,
    skyEnabled: true,
    iblEnabled: false,
    atmosphereEnabled: false,
    proceduralComplexity: 20,
    maxTransitionsPerFrame: 1,
  }),
  minimal: Object.freeze({
    preset: 'minimal',
    maxHDRResolution: 256,
    maxReflectionResolution: 0,
    reflectionsEnabled: false,
    fogEnabled: false,
    fogPrecision: 0,
    skyEnabled: false,
    iblEnabled: false,
    atmosphereEnabled: false,
    proceduralComplexity: 0,
    maxTransitionsPerFrame: 0,
  }),
});

/**
 * Derive a quality profile from the active quality preset.
 *
 * Higher presets allow larger HDR resolutions, more reflection probes,
 * higher fog precision, and more procedural complexity. Lower presets
 * disable advanced features to save GPU budget and memory.
 *
 * @param qualityPreset - The active quality preset.
 * @returns The derived quality profile.
 */
export function deriveEnvironmentQualityProfile(
  qualityPreset: QualityPreset,
): EnvironmentQualityProfile {
  return QUALITY_PROFILES[qualityPreset] ?? DEFAULT_ENVIRONMENT_QUALITY_PROFILE;
}

// ── Constraint Derivation ──────────────────────────────────

/**
 * Derive the effective constraints from the active quality profile and
 * reduced motion state.
 *
 * Reduced motion tightens environment and fog budgets.
 * Quality profile determines feature availability and memory limits.
 *
 * @param baseConstraints - Base environment constraints.
 * @param qualityProfile - Active quality profile.
 * @param isReducedMotion - Whether reduced motion is active.
 * @returns Effective constraints for the current context.
 */
export function deriveEnvironmentConstraints(
  baseConstraints: EnvironmentConstraints = DEFAULT_ENVIRONMENT_CONSTRAINTS,
  qualityProfile: EnvironmentQualityProfile = DEFAULT_ENVIRONMENT_QUALITY_PROFILE,
  isReducedMotion: boolean = false,
): EnvironmentConstraints {
  if (isReducedMotion) {
    return Object.freeze({
      ...baseConstraints,
      maxActiveEnvironments: Math.min(baseConstraints.maxActiveEnvironments, 2),
      maxFogDistance: Math.min(baseConstraints.maxFogDistance, 100),
    });
  }

  if (!qualityProfile.iblEnabled) {
    return Object.freeze({
      ...baseConstraints,
      maxEnvironmentResolution: Math.min(baseConstraints.maxEnvironmentResolution, 512),
    });
  }

  return baseConstraints;
}

// ── Preset Defaults ────────────────────────────────────────

/**
 * Resolve the default category for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default environment category.
 */
export function resolvePresetCategory(presetId: EnvironmentPresetId): EnvironmentCategory {
  return ENVIRONMENT_PRESET_CATEGORY[presetId] ?? 'minimal';
}

/**
 * Resolve the default priority for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default environment priority.
 */
export function resolvePresetPriority(presetId: EnvironmentPresetId): EnvironmentPriority {
  return ENVIRONMENT_PRESET_PRIORITY[presetId] ?? 'normal';
}

/**
 * Resolve the default group for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default environment group.
 */
export function resolvePresetGroup(presetId: EnvironmentPresetId): EnvironmentGroupId {
  return ENVIRONMENT_PRESET_GROUP[presetId] ?? 'utility';
}
