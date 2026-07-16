/**
 * Materials Config — Pure Derivation Functions for Material State
 *
 * Contains pure functions that derive material quality profiles, constraints,
 * and validate material configurations. No React, no state, no side effects.
 *
 * Phase 6.5: Config — pure derivation only, no materials.
 */

import type {
  MaterialPreset,
  MaterialPresetId,
  MaterialCategory,
  MaterialGroupId,
  MaterialGroup,
  MaterialSurface,
  MaterialPriority,
  MaterialQualityProfile,
  MaterialConstraints,
} from './materials.types';

import {
  MATERIAL_PRESETS,
  MATERIAL_CATEGORIES,
  MATERIAL_GROUPS,
  MATERIAL_SURFACES,
} from './materials.types';

import type { QualityPreset } from './three.types';

import {
  MATERIAL_PRESET_CATEGORY,
  MATERIAL_PRESET_SURFACE,
  MATERIAL_PRESET_PRIORITY,
  MATERIAL_PRESET_GROUP,
  DEFAULT_MATERIAL_QUALITY_PROFILE,
  DEFAULT_MATERIAL_CONSTRAINTS,
} from './materials.constants';

// ── Type Guards ───────────────────────────────────────────

/** Type guard: is a string a valid {@link MaterialPreset}? */
export function isMaterialPreset(value: unknown): value is MaterialPreset {
  return (
    typeof value === 'string' &&
    (MATERIAL_PRESETS as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link MaterialCategory}? */
export function isMaterialCategory(value: unknown): value is MaterialCategory {
  return (
    typeof value === 'string' &&
    (MATERIAL_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link MaterialGroup}? */
export function isMaterialGroup(value: unknown): value is MaterialGroup {
  return (
    typeof value === 'string' &&
    (MATERIAL_GROUPS as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link MaterialSurface}? */
export function isMaterialSurface(value: unknown): value is MaterialSurface {
  return (
    typeof value === 'string' &&
    (MATERIAL_SURFACES as readonly string[]).includes(value)
  );
}

// ── Quality Profile Derivation ────────────────────────────

/** Quality preset to quality profile mapping. */
const QUALITY_PROFILES: Record<QualityPreset, MaterialQualityProfile> = Object.freeze({
  ultra: Object.freeze({
    preset: 'ultra',
    maxTextureSize: 4096,
    normalMapsEnabled: true,
    pbrEnabled: true,
    clearcoatEnabled: true,
    transmissionEnabled: true,
    subsurfaceEnabled: true,
    anisotropyEnabled: true,
    maxSwapsPerFrame: 8,
    compressionEnabled: true,
  }),
  high: Object.freeze({
    preset: 'high',
    maxTextureSize: 2048,
    normalMapsEnabled: true,
    pbrEnabled: true,
    clearcoatEnabled: true,
    transmissionEnabled: true,
    subsurfaceEnabled: false,
    anisotropyEnabled: true,
    maxSwapsPerFrame: 6,
    compressionEnabled: true,
  }),
  medium: Object.freeze({
    preset: 'medium',
    maxTextureSize: 1024,
    normalMapsEnabled: true,
    pbrEnabled: true,
    clearcoatEnabled: false,
    transmissionEnabled: false,
    subsurfaceEnabled: false,
    anisotropyEnabled: false,
    maxSwapsPerFrame: 4,
    compressionEnabled: true,
  }),
  low: Object.freeze({
    preset: 'low',
    maxTextureSize: 512,
    normalMapsEnabled: false,
    pbrEnabled: true,
    clearcoatEnabled: false,
    transmissionEnabled: false,
    subsurfaceEnabled: false,
    anisotropyEnabled: false,
    maxSwapsPerFrame: 2,
    compressionEnabled: true,
  }),
  minimal: Object.freeze({
    preset: 'minimal',
    maxTextureSize: 256,
    normalMapsEnabled: false,
    pbrEnabled: false,
    clearcoatEnabled: false,
    transmissionEnabled: false,
    subsurfaceEnabled: false,
    anisotropyEnabled: false,
    maxSwapsPerFrame: 1,
    compressionEnabled: false,
  }),
});

/**
 * Derive a quality profile from the active quality preset.
 *
 * Higher presets allow larger textures, more material features, and higher
 * shader complexity. Lower presets disable advanced features to save GPU
 * budget and memory.
 *
 * @param qualityPreset - The active quality preset.
 * @returns The derived quality profile.
 */
export function deriveMaterialQualityProfile(
  qualityPreset: QualityPreset,
): MaterialQualityProfile {
  return QUALITY_PROFILES[qualityPreset] ?? DEFAULT_MATERIAL_QUALITY_PROFILE;
}

// ── Constraint Derivation ─────────────────────────────────

/**
 * Derive the effective constraints from the active quality profile and
 * reduced motion state.
 *
 * Reduced motion tightens texture and shader budgets.
 * Quality profile determines feature availability and memory limits.
 *
 * @param baseConstraints - Base material constraints.
 * @param qualityProfile - Active quality profile.
 * @param isReducedMotion - Whether reduced motion is active.
 * @returns Effective constraints for the current context.
 */
export function deriveMaterialConstraints(
  baseConstraints: MaterialConstraints = DEFAULT_MATERIAL_CONSTRAINTS,
  qualityProfile: MaterialQualityProfile = DEFAULT_MATERIAL_QUALITY_PROFILE,
  isReducedMotion: boolean = false,
): MaterialConstraints {
  if (isReducedMotion) {
    return Object.freeze({
      ...baseConstraints,
      maxActiveMaterials: Math.min(baseConstraints.maxActiveMaterials, 16),
      maxShaderComplexity: Math.min(baseConstraints.maxShaderComplexity, 40),
    });
  }

  if (!qualityProfile.pbrEnabled) {
    return Object.freeze({
      ...baseConstraints,
      maxTextureResolution: Math.min(baseConstraints.maxTextureResolution, 512),
      maxShaderComplexity: Math.min(baseConstraints.maxShaderComplexity, 30),
    });
  }

  return baseConstraints;
}

// ── Preset Defaults ───────────────────────────────────────

/**
 * Resolve the default category for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default material category.
 */
export function resolvePresetCategory(presetId: MaterialPresetId): MaterialCategory {
  return MATERIAL_PRESET_CATEGORY[presetId] ?? 'fabric';
}

/**
 * Resolve the default surface finish for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default material surface.
 */
export function resolvePresetSurface(presetId: MaterialPresetId): MaterialSurface {
  return MATERIAL_PRESET_SURFACE[presetId] ?? 'matte';
}

/**
 * Resolve the default priority for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default material priority.
 */
export function resolvePresetPriority(presetId: MaterialPresetId): MaterialPriority {
  return MATERIAL_PRESET_PRIORITY[presetId] ?? 'normal';
}

/**
 * Resolve the default group for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default material group.
 */
export function resolvePresetGroup(presetId: MaterialPresetId): MaterialGroupId {
  return MATERIAL_PRESET_GROUP[presetId] ?? 'surface';
}
