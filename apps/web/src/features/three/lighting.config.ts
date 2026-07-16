/**
 * Lighting Config — Pure Derivation Functions for Lighting State
 *
 * Contains pure functions that derive lighting quality profiles, constraints,
 * and validate lighting configurations. No React, no state, no side effects.
 *
 * Phase 6.4: Config — pure derivation only, no lights.
 */

import type {
  LightingPreset,
  LightingPresetId,
  LightingLayer,
  LightingEnvironment,
  LightingQualityProfile,
  LightingConstraints,
} from './lighting.types';

import {
  LIGHTING_PRESETS,
  LIGHTING_LAYERS,
  LIGHTING_ENVIRONMENTS,
} from './lighting.types';

import type { QualityPreset } from './three.types';

import {
  LIGHTING_PRESET_INTENSITY,
  LIGHTING_PRESET_COLOR_TEMPERATURE,
  LIGHTING_PRESET_AMBIENT_INTENSITY,
  LIGHTING_PRESET_DIRECTIONAL_INTENSITY,
  LIGHTING_PRESET_ENVIRONMENT,
  LIGHTING_PRESET_SHADOWS,
  DEFAULT_LIGHTING_QUALITY_PROFILE,
  DEFAULT_LIGHTING_CONSTRAINTS,
} from './lighting.constants';

// ── Type Guards ──────────────────────────────────────────

/** Type guard: is a string a valid {@link LightingPreset}? */
export function isLightingPreset(value: unknown): value is LightingPreset {
  return (
    typeof value === 'string' &&
    (LIGHTING_PRESETS as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link LightingLayer}? */
export function isLightingLayer(value: unknown): value is LightingLayer {
  return (
    typeof value === 'string' &&
    (LIGHTING_LAYERS as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link LightingEnvironment}? */
export function isLightingEnvironment(value: unknown): value is LightingEnvironment {
  return (
    typeof value === 'string' &&
    (LIGHTING_ENVIRONMENTS as readonly string[]).includes(value)
  );
}

// ── Quality Profile Derivation ───────────────────────────

/** Quality preset to quality profile mapping. */
const QUALITY_PROFILES: Record<QualityPreset, LightingQualityProfile> = Object.freeze({
  ultra: Object.freeze({
    preset: 'ultra',
    maxLights: 16,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    environmentEnabled: true,
    dynamicEnabled: true,
    effectsEnabled: true,
  }),
  high: Object.freeze({
    preset: 'high',
    maxLights: 12,
    shadowsEnabled: true,
    shadowMapSize: 1024,
    environmentEnabled: true,
    dynamicEnabled: true,
    effectsEnabled: true,
  }),
  medium: Object.freeze({
    preset: 'medium',
    maxLights: 8,
    shadowsEnabled: true,
    shadowMapSize: 512,
    environmentEnabled: true,
    dynamicEnabled: true,
    effectsEnabled: true,
  }),
  low: Object.freeze({
    preset: 'low',
    maxLights: 4,
    shadowsEnabled: false,
    shadowMapSize: 0,
    environmentEnabled: false,
    dynamicEnabled: false,
    effectsEnabled: false,
  }),
  minimal: Object.freeze({
    preset: 'minimal',
    maxLights: 1,
    shadowsEnabled: false,
    shadowMapSize: 0,
    environmentEnabled: false,
    dynamicEnabled: false,
    effectsEnabled: false,
  }),
});

/**
 * Derive a quality profile from the active quality preset.
 *
 * Higher presets allow more lights, shadow maps, and dynamic effects.
 * Lower presets disable shadows and environment maps to save GPU budget.
 *
 * @param qualityPreset - The active quality preset.
 * @returns The derived quality profile.
 */
export function deriveLightingQualityProfile(
  qualityPreset: QualityPreset,
): LightingQualityProfile {
  return QUALITY_PROFILES[qualityPreset] ?? DEFAULT_LIGHTING_QUALITY_PROFILE;
}

// ── Constraint Derivation ────────────────────────────────

/**
 * Derive the effective constraints from the active quality profile and
 * reduced motion state.
 *
 * Reduced motion tightens intensity bounds and disables dynamic changes.
 * Quality profile determines shadow map size and light count limits.
 *
 * @param baseConstraints - Base lighting constraints.
 * @param qualityProfile - Active quality profile.
 * @param isReducedMotion - Whether reduced motion is active.
 * @returns Effective constraints for the current context.
 */
export function deriveLightingConstraints(
  baseConstraints: LightingConstraints = DEFAULT_LIGHTING_CONSTRAINTS,
  qualityProfile: LightingQualityProfile = DEFAULT_LIGHTING_QUALITY_PROFILE,
  isReducedMotion: boolean = false,
): LightingConstraints {
  if (isReducedMotion) {
    return Object.freeze({
      ...baseConstraints,
      maxIntensity: Math.min(baseConstraints.maxIntensity, 1.0),
      maxDirectionalIntensity: Math.min(baseConstraints.maxDirectionalIntensity, 1.0),
    });
  }

  if (!qualityProfile.effectsEnabled) {
    return Object.freeze({
      ...baseConstraints,
      maxIntensity: Math.min(baseConstraints.maxIntensity, 1.0),
    });
  }

  return baseConstraints;
}

// ── Clamping ─────────────────────────────────────────────

/**
 * Clamp an intensity value to the valid range.
 *
 * @param intensity - The desired intensity (0–2).
 * @param constraints - Lighting constraints with min/max intensity.
 * @returns The clamped intensity value.
 */
export function clampIntensity(
  intensity: number,
  constraints: LightingConstraints = DEFAULT_LIGHTING_CONSTRAINTS,
): number {
  return Math.max(constraints.minIntensity, Math.min(constraints.maxIntensity, intensity));
}

/**
 * Clamp a color temperature to the valid Kelvin range.
 *
 * @param temperature - The desired temperature in Kelvin.
 * @param constraints - Lighting constraints with min/max temperature.
 * @returns The clamped temperature value.
 */
export function clampColorTemperature(
  temperature: number,
  constraints: LightingConstraints = DEFAULT_LIGHTING_CONSTRAINTS,
): number {
  return Math.max(
    constraints.minColorTemperature,
    Math.min(constraints.maxColorTemperature, temperature),
  );
}

// ── Preset Defaults ──────────────────────────────────────

/**
 * Resolve the default intensity for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default global intensity multiplier.
 */
export function resolvePresetIntensity(presetId: LightingPresetId): number {
  return LIGHTING_PRESET_INTENSITY[presetId] ?? 1.0;
}

/**
 * Resolve the default color temperature for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default color temperature in Kelvin.
 */
export function resolvePresetColorTemperature(presetId: LightingPresetId): number {
  return LIGHTING_PRESET_COLOR_TEMPERATURE[presetId] ?? 5000;
}

/**
 * Resolve the default ambient intensity for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default ambient light intensity.
 */
export function resolvePresetAmbientIntensity(presetId: LightingPresetId): number {
  return LIGHTING_PRESET_AMBIENT_INTENSITY[presetId] ?? 0.5;
}

/**
 * Resolve the default directional intensity for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default directional light intensity.
 */
export function resolvePresetDirectionalIntensity(presetId: LightingPresetId): number {
  return LIGHTING_PRESET_DIRECTIONAL_INTENSITY[presetId] ?? 1.0;
}

/**
 * Resolve the default environment for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns The default lighting environment.
 */
export function resolvePresetEnvironment(presetId: LightingPresetId): LightingEnvironment {
  return LIGHTING_PRESET_ENVIRONMENT[presetId] ?? 'neutral';
}

/**
 * Resolve the default shadow state for a preset.
 *
 * @param presetId - The preset identifier.
 * @returns Whether shadows are enabled by default.
 */
export function resolvePresetShadows(presetId: LightingPresetId): boolean {
  return LIGHTING_PRESET_SHADOWS[presetId] ?? true;
}
