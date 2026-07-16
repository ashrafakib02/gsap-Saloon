/**
 * Environment Constants — Default Configuration, Descriptions, and Ordering
 *
 * Provides default values, description records, ordering records,
 * preset defaults, and the initial snapshot for the environment system.
 *
 * Phase 6.6: Constants — no React, no 3D objects, no environments.
 */

import type {
  EnvironmentPreset,
  EnvironmentPresetId,
  EnvironmentCategory,
  EnvironmentGroupId,
  EnvironmentGroup,
  EnvironmentLayer,
  EnvironmentPriority,
  EnvironmentQualityProfile,
  EnvironmentConstraints,
  EnvironmentSnapshot,
} from './environment.types';

// ── Re-exports ─────────────────────────────────────────────

export {
  ENVIRONMENT_PRESETS,
  ENVIRONMENT_CATEGORIES,
  ENVIRONMENT_GROUPS,
  ENVIRONMENT_LAYERS,
  ENVIRONMENT_PRIORITIES,
  ENVIRONMENT_LIFECYCLE_STATES,
} from './environment.types';

// ── Preset Descriptions ────────────────────────────────────

/** Human-readable descriptions for each environment preset. */
export const ENVIRONMENT_PRESET_DESCRIPTIONS: Record<EnvironmentPreset, string> = {
  hero: 'Hero scene — premium environment, full feature set',
  'golden-hour': 'Golden hour — warm directional atmosphere',
  interior: 'Interior — salon interior environment',
  gallery: 'Gallery — clean, neutral exhibition environment',
  spa: 'Spa — soft, diffused relaxation environment',
  services: 'Services showcase — product-focused environment',
  booking: 'Booking overlay — stable, accessible environment',
  night: 'Night — low-light, moody environment',
  neutral: 'Neutral — minimal, default environment',
  performance: 'Performance preset — minimal environment complexity',
  mobile: 'Mobile-optimized — simplified environment',
  'reduced-motion': 'Reduced motion preset — static environment',
  debug: 'Debug preset — wireframe / helper environment',
};

// ── Category Descriptions ──────────────────────────────────

/** Human-readable descriptions for each environment category. */
export const ENVIRONMENT_CATEGORY_DESCRIPTIONS: Record<EnvironmentCategory, string> = {
  interior: 'Interior — salon interiors, rooms, spaces',
  studio: 'Studio — controlled lighting environments',
  architectural: 'Architectural — building exteriors, architectural spaces',
  natural: 'Natural — outdoor, landscape, sky environments',
  procedural: 'Procedural — shader-generated environments',
  cinematic: 'Cinematic — dramatic, film-quality environments',
  minimal: 'Minimal — simple, clean environments',
  debug: 'Debug — wireframe, helper environments',
  'future-custom': 'Future custom — extensible for custom environments',
};

// ── Group Descriptions ─────────────────────────────────────

/** Human-readable descriptions for each environment group. */
export const ENVIRONMENT_GROUP_DESCRIPTIONS: Record<EnvironmentGroup, string> = {
  spatial: 'Spatial — interior, architectural, studio',
  lighting: 'Lighting — golden-hour, natural, cinematic',
  atmospheric: 'Atmospheric — sky, fog, atmosphere',
  procedural: 'Procedural — procedural, debug',
  utility: 'Utility — minimal, debug, future-custom',
};

// ── Layer Descriptions ─────────────────────────────────────

/** Human-readable descriptions for each environment layer. */
export const ENVIRONMENT_LAYER_DESCRIPTIONS: Record<EnvironmentLayer, string> = {
  sky: 'Sky dome / skybox',
  reflections: 'Reflection probes',
  fog: 'Fog volume',
  background: 'Background plate / image',
  'ambient-light': 'Ambient lighting',
  'directional-light': 'Directional lighting',
  ibl: 'IBL (image-based lighting)',
  atmosphere: 'Atmosphere / haze',
  ground: 'Ground plane',
  'procedural-noise': 'Procedural noise',
  'post-processing': 'Post-processing',
};

// ── Priority Descriptions ──────────────────────────────────

/** Human-readable descriptions for each environment priority. */
export const ENVIRONMENT_PRIORITY_DESCRIPTIONS: Record<EnvironmentPriority, string> = {
  critical: 'Critical — hero environment, must render at full quality',
  high: 'High — narrative section environments',
  normal: 'Normal — standard section environments',
  low: 'Low — ambient / background environments',
};

// ── Preset Ordering ────────────────────────────────────────

/**
 * Ordinal ranking of environment presets, by importance.
 * Lower values receive priority when quality budgets are tight.
 */
export const ENVIRONMENT_PRESET_ORDER: Record<EnvironmentPreset, number> = {
  hero: 0,
  'golden-hour': 1,
  interior: 2,
  gallery: 3,
  spa: 4,
  services: 5,
  booking: 6,
  night: 7,
  neutral: 8,
  performance: 9,
  mobile: 10,
  'reduced-motion': 11,
  debug: 12,
};

// ── Category Ordering ──────────────────────────────────────

/**
 * Ordinal ranking of environment categories, by render priority.
 */
export const ENVIRONMENT_CATEGORY_ORDER: Record<EnvironmentCategory, number> = {
  interior: 0,
  studio: 1,
  architectural: 2,
  natural: 3,
  procedural: 4,
  cinematic: 5,
  minimal: 6,
  debug: 7,
  'future-custom': 8,
};

// ── Group Ordering ─────────────────────────────────────────

/**
 * Ordinal ranking of environment groups, by priority.
 */
export const ENVIRONMENT_GROUP_ORDER: Record<EnvironmentGroup, number> = {
  spatial: 0,
  lighting: 1,
  atmospheric: 2,
  procedural: 3,
  utility: 4,
};

// ── Layer Ordering ─────────────────────────────────────────

/**
 * Ordinal ranking of environment layers, by render order.
 */
export const ENVIRONMENT_LAYER_ORDER: Record<EnvironmentLayer, number> = {
  sky: 0,
  background: 1,
  'ambient-light': 2,
  'directional-light': 3,
  ibl: 4,
  reflections: 5,
  fog: 6,
  atmosphere: 7,
  ground: 8,
  'procedural-noise': 9,
  'post-processing': 10,
};

// ── Preset Defaults ────────────────────────────────────────

/**
 * Default category for each environment preset.
 */
export const ENVIRONMENT_PRESET_CATEGORY: Record<EnvironmentPreset, EnvironmentCategory> = {
  hero: 'cinematic',
  'golden-hour': 'natural',
  interior: 'interior',
  gallery: 'studio',
  spa: 'interior',
  services: 'studio',
  booking: 'minimal',
  night: 'cinematic',
  neutral: 'minimal',
  performance: 'procedural',
  mobile: 'minimal',
  'reduced-motion': 'minimal',
  debug: 'debug',
};

/**
 * Default priority for each environment preset.
 */
export const ENVIRONMENT_PRESET_PRIORITY: Record<EnvironmentPreset, EnvironmentPriority> = {
  hero: 'critical',
  'golden-hour': 'high',
  interior: 'high',
  gallery: 'normal',
  spa: 'normal',
  services: 'normal',
  booking: 'normal',
  night: 'high',
  neutral: 'low',
  performance: 'low',
  mobile: 'normal',
  'reduced-motion': 'low',
  debug: 'low',
};

/**
 * Default group for each environment preset.
 */
export const ENVIRONMENT_PRESET_GROUP: Record<EnvironmentPreset, EnvironmentGroupId> = {
  hero: 'lighting',
  'golden-hour': 'lighting',
  interior: 'spatial',
  gallery: 'spatial',
  spa: 'atmospheric',
  services: 'spatial',
  booking: 'utility',
  night: 'atmospheric',
  neutral: 'utility',
  performance: 'procedural',
  mobile: 'utility',
  'reduced-motion': 'utility',
  debug: 'utility',
};

// ── Category → Group Mapping ───────────────────────────────

/**
 * Maps each environment category to its parent group.
 */
export const ENVIRONMENT_CATEGORY_TO_GROUP: Record<EnvironmentCategory, EnvironmentGroupId> = {
  interior: 'spatial',
  studio: 'spatial',
  architectural: 'spatial',
  natural: 'lighting',
  procedural: 'procedural',
  cinematic: 'lighting',
  minimal: 'utility',
  debug: 'utility',
  'future-custom': 'utility',
};

// ── Default Values ─────────────────────────────────────────

/** Default active preset (none). */
export const DEFAULT_ACTIVE_ENVIRONMENT_PRESET: EnvironmentPresetId | null = null;

// ── Default Quality Profile ────────────────────────────────

/**
 * Default quality profile — medium preset with balanced settings.
 */
export const DEFAULT_ENVIRONMENT_QUALITY_PROFILE: EnvironmentQualityProfile = Object.freeze({
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
});

// ── Default Constraints ────────────────────────────────────

/**
 * Default environment constraints — balanced bounds suitable for all presets.
 */
export const DEFAULT_ENVIRONMENT_CONSTRAINTS: EnvironmentConstraints = Object.freeze({
  maxActiveEnvironments: 4,
  maxEnvironmentMemoryMB: 128,
  maxEnvironmentResolution: 2048,
  maxFogDistance: 500,
});

// ── Default Snapshot ───────────────────────────────────────

/**
 * The initial, empty environment snapshot.
 *
 * Represents a system with no active preset, no registered presets,
 * default quality profile, and default constraints. SSR-safe.
 */
export const DEFAULT_ENVIRONMENT_SNAPSHOT: EnvironmentSnapshot = Object.freeze({
  presets: new Map(),
  categories: new Map(),
  groups: new Map(),
  activePresetId: null,
  qualityProfile: DEFAULT_ENVIRONMENT_QUALITY_PROFILE,
  constraints: DEFAULT_ENVIRONMENT_CONSTRAINTS,
  isReducedMotion: false,
  qualityPreset: 'medium',
  presetCount: 0,
  categoryCount: 0,
  groupCount: 0,
  revision: 0,
  timestamp: 0,
});
