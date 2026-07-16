/**
 * Lighting Constants — Default Configuration, Descriptions, and Ordering
 *
 * Provides default values, description records, ordering records,
 * preset defaults, and the initial snapshot for the lighting system.
 *
 * Phase 6.4: Constants — no React, no 3D objects, no lights.
 */

import type {
  LightingPreset,
  LightingPresetId,
  LightingLayer,
  LightingEnvironment,
  LightingQualityProfile,
  LightingConstraints,
  LightingSnapshot,
} from './lighting.types';

// ── Re-exports ───────────────────────────────────────────

export {
  LIGHTING_PRESETS,
  LIGHTING_LAYERS,
  LIGHTING_ENVIRONMENTS,
} from './lighting.types';

// ── Preset Descriptions ──────────────────────────────────

/** Human-readable descriptions for each lighting preset. */
export const LIGHTING_PRESET_DESCRIPTIONS: Record<LightingPreset, string> = {
  hero: 'Hero scene — dramatic warm key light, strong shadows',
  intro: 'Intro / entrance — soft ambient fill',
  narrative: 'Narrative sections — balanced documentary lighting',
  services: 'Services showcase — clean, focused product lighting',
  gallery: 'Gallery — gallery-style track lighting simulation',
  transformation: 'Transformation before/after — dramatic reveal lighting',
  booking: 'Booking overlay — stable, accessible ambient',
  footer: 'Footer — distant ambient wash',
  night: 'Night mode — low-key, cool-toned ambient',
  mobile: 'Mobile-optimized — simplified, low-cost lighting',
  'reduced-motion': 'Reduced motion preset — minimal, static lighting',
  performance: 'Performance preset — single ambient, no shadows',
};

// ── Layer Descriptions ───────────────────────────────────

/** Human-readable descriptions for each lighting layer. */
export const LIGHTING_LAYER_DESCRIPTIONS: Record<LightingLayer, string> = {
  ambient: 'Ambient light — global base illumination',
  directional: 'Directional light — sun-like parallel rays',
  hemisphere: 'Hemisphere light — sky/ground color blend',
  spot: 'Spot light — cone-shaped focused beam',
  point: 'Point light — omnidirectional radial',
  'rect-area': 'Rect-area light — soft rectangular emission',
  environment: 'Environment light — IBL / HDRI based',
  rim: 'Rim light — edge highlight for separation',
  fill: 'Fill light — secondary illumination for shadows',
  key: 'Key light — primary subject illumination',
  back: 'Back light — silhouette / halo definition',
};

// ── Environment Descriptions ─────────────────────────────

/** Human-readable descriptions for each lighting environment. */
export const LIGHTING_ENVIRONMENT_DESCRIPTIONS: Record<LightingEnvironment, string> = {
  studio: 'Studio — clean, neutral, balanced',
  'golden-hour': 'Golden hour — warm directional, long shadows',
  interior: 'Interior — warm ambient, soft directional',
  gallery: 'Gallery — track lighting, high contrast',
  spa: 'Spa — cool ambient, soft fill, calming',
  night: 'Night — low-key, cool tones, minimal',
  neutral: 'Neutral — flat, no mood, debug baseline',
  debug: 'Debug — visualization helpers enabled',
};

// ── Preset Ordering ──────────────────────────────────────

/**
 * Ordinal ranking of lighting presets, by importance.
 * Lower values receive priority when quality budgets are tight.
 */
export const LIGHTING_PRESET_ORDER: Record<LightingPreset, number> = {
  hero: 0,
  intro: 1,
  narrative: 2,
  services: 3,
  gallery: 4,
  transformation: 5,
  booking: 6,
  footer: 7,
  night: 8,
  mobile: 9,
  'reduced-motion': 10,
  performance: 11,
};

// ── Layer Ordering ───────────────────────────────────────

/**
 * Ordinal ranking of lighting layers, by render priority.
 * Lower values render first (behind higher values).
 */
export const LIGHTING_LAYER_ORDER: Record<LightingLayer, number> = {
  ambient: 0,
  hemisphere: 1,
  environment: 2,
  directional: 3,
  fill: 4,
  key: 5,
  spot: 6,
  point: 7,
  'rect-area': 8,
  rim: 9,
  back: 10,
};

// ── Environment Ordering ─────────────────────────────────

/**
 * Ordinal ranking of lighting environments, by priority.
 */
export const LIGHTING_ENVIRONMENT_ORDER: Record<LightingEnvironment, number> = {
  studio: 0,
  'golden-hour': 1,
  interior: 2,
  gallery: 3,
  spa: 4,
  night: 5,
  neutral: 6,
  debug: 7,
};

// ── Preset Defaults ──────────────────────────────────────

/**
 * Default global intensity for each lighting preset.
 */
export const LIGHTING_PRESET_INTENSITY: Record<LightingPreset, number> = {
  hero: 1.2,
  intro: 0.9,
  narrative: 1.0,
  services: 1.0,
  gallery: 1.1,
  transformation: 1.3,
  booking: 0.8,
  footer: 0.6,
  night: 0.4,
  mobile: 0.8,
  'reduced-motion': 0.7,
  performance: 0.5,
};

/**
 * Default color temperature (Kelvin) for each lighting preset.
 */
export const LIGHTING_PRESET_COLOR_TEMPERATURE: Record<LightingPreset, number> = {
  hero: 3200,
  intro: 4000,
  narrative: 5000,
  services: 5500,
  gallery: 4500,
  transformation: 3000,
  booking: 4200,
  footer: 3500,
  night: 7000,
  mobile: 4500,
  'reduced-motion': 4000,
  performance: 5000,
};

/**
 * Default ambient light intensity for each lighting preset.
 */
export const LIGHTING_PRESET_AMBIENT_INTENSITY: Record<LightingPreset, number> = {
  hero: 0.4,
  intro: 0.6,
  narrative: 0.5,
  services: 0.5,
  gallery: 0.3,
  transformation: 0.3,
  booking: 0.7,
  footer: 0.8,
  night: 0.15,
  mobile: 0.6,
  'reduced-motion': 0.5,
  performance: 0.8,
};

/**
 * Default directional light intensity for each lighting preset.
 */
export const LIGHTING_PRESET_DIRECTIONAL_INTENSITY: Record<LightingPreset, number> = {
  hero: 1.5,
  intro: 0.8,
  narrative: 1.0,
  services: 1.2,
  gallery: 1.4,
  transformation: 1.8,
  booking: 0.6,
  footer: 0.4,
  night: 0.2,
  mobile: 0.7,
  'reduced-motion': 0.5,
  performance: 0.3,
};

/**
 * Default environment for each lighting preset.
 */
export const LIGHTING_PRESET_ENVIRONMENT: Record<LightingPreset, LightingEnvironment> = {
  hero: 'golden-hour',
  intro: 'studio',
  narrative: 'interior',
  services: 'studio',
  gallery: 'gallery',
  transformation: 'studio',
  booking: 'interior',
  footer: 'night',
  night: 'night',
  mobile: 'studio',
  'reduced-motion': 'neutral',
  performance: 'neutral',
};

/**
 * Default shadow state for each lighting preset.
 */
export const LIGHTING_PRESET_SHADOWS: Record<LightingPreset, boolean> = {
  hero: true,
  intro: true,
  narrative: true,
  services: true,
  gallery: true,
  transformation: true,
  booking: false,
  footer: false,
  night: false,
  mobile: false,
  'reduced-motion': false,
  performance: false,
};

// ── Default Values ───────────────────────────────────────

/** Default global intensity multiplier. */
export const DEFAULT_LIGHTING_INTENSITY = 1.0;

/** Default color temperature in Kelvin (neutral daylight). */
export const DEFAULT_LIGHTING_COLOR_TEMPERATURE = 5000;

/** Default ambient light intensity. */
export const DEFAULT_LIGHTING_AMBIENT_INTENSITY = 0.5;

/** Default directional light intensity. */
export const DEFAULT_LIGHTING_DIRECTIONAL_INTENSITY = 1.0;

/** Default shadow state. */
export const DEFAULT_LIGHTING_SHADOWS_ENABLED = true;

/** Default active preset (none). */
export const DEFAULT_ACTIVE_LIGHTING_PRESET: LightingPresetId | null = null;

/** Default active environment (none). */
export const DEFAULT_ACTIVE_LIGHTING_ENVIRONMENT: LightingEnvironment | null = null;

// ── Default Quality Profile ──────────────────────────────

/**
 * Default quality profile — medium preset with balanced settings.
 */
export const DEFAULT_LIGHTING_QUALITY_PROFILE: LightingQualityProfile = Object.freeze({
  preset: 'medium',
  maxLights: 8,
  shadowsEnabled: true,
  shadowMapSize: 1024,
  environmentEnabled: true,
  dynamicEnabled: true,
  effectsEnabled: true,
});

// ── Default Constraints ──────────────────────────────────

/**
 * Default lighting constraints — wide bounds suitable for all presets.
 */
export const DEFAULT_LIGHTING_CONSTRAINTS: LightingConstraints = Object.freeze({
  minIntensity: 0.0,
  maxIntensity: 2.0,
  minColorTemperature: 2000,
  maxColorTemperature: 10000,
  maxAmbientIntensity: 1.0,
  maxDirectionalIntensity: 2.0,
});

// ── Default Snapshot ─────────────────────────────────────

/**
 * The initial, empty lighting snapshot.
 *
 * Represents a system with no active preset, no active environment,
 * default intensity, and default quality profile. SSR-safe.
 */
export const DEFAULT_LIGHTING_SNAPSHOT: LightingSnapshot = Object.freeze({
  presets: new Map(),
  layers: new Map(),
  activePresetId: null,
  activeEnvironment: null,
  intensity: DEFAULT_LIGHTING_INTENSITY,
  colorTemperature: DEFAULT_LIGHTING_COLOR_TEMPERATURE,
  ambientIntensity: DEFAULT_LIGHTING_AMBIENT_INTENSITY,
  directionalIntensity: DEFAULT_LIGHTING_DIRECTIONAL_INTENSITY,
  shadowsEnabled: DEFAULT_LIGHTING_SHADOWS_ENABLED,
  qualityProfile: DEFAULT_LIGHTING_QUALITY_PROFILE,
  constraints: DEFAULT_LIGHTING_CONSTRAINTS,
  isReducedMotion: false,
  qualityPreset: 'medium',
  presetCount: 0,
  layerCount: 0,
  revision: 0,
  timestamp: 0,
});
