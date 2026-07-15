/**
 * Camera Constants — Default Configuration, Descriptions, and Ordering
 *
 * Provides default values, description records, ordering records,
 * preset defaults, and the initial snapshot for the camera system.
 *
 * Phase 6.3: Constants — no React, no 3D objects.
 */

import type {
  CameraMode,
  CameraPreset,
  CameraTarget,
  CameraPresetId,
  CameraViewport,
  CameraQualityProfile,
  CameraConstraints,
  CameraSnapshot,
} from './camera.types';

// ── Re-exports ───────────────────────────────────────────

export {
  CAMERA_MODES,
  CAMERA_PRESETS,
  CAMERA_TARGETS,
} from './camera.types';

// ── Preset Descriptions ──────────────────────────────────

/** Human-readable descriptions for each camera preset. */
export const CAMERA_PRESET_DESCRIPTIONS: Record<CameraPreset, string> = {
  hero: 'Hero scene — dramatic wide-angle composition',
  intro: 'Intro / entrance — gentle welcoming perspective',
  narrative: 'Narrative sections — standard documentary-style camera',
  services: 'Services showcase — medium shot, product-focused',
  gallery: 'Gallery — close-up, detail-oriented framing',
  transformation: 'Transformation before/after — dramatic reveal angle',
  booking: 'Booking overlay — stable, accessible perspective',
  footer: 'Footer — distant, ambient wide shot',
  mobile: 'Mobile-optimized preset — reduced FOV, simplified settings',
  'reduced-motion': 'Reduced motion preset — no camera movement allowed',
  performance: 'Performance preset — minimum GPU budget, simplified rendering',
};

// ── Mode Descriptions ────────────────────────────────────

/** Human-readable descriptions for each camera mode. */
export const CAMERA_MODE_DESCRIPTIONS: Record<CameraMode, string> = {
  static: 'Camera does not move — static composition',
  narrative: 'Camera driven by narrative section transitions',
  scroll: 'Camera position linked to scroll progress',
  cinematic: 'Camera follows cinematic keyframe sequences',
  interactive: 'Camera responds to pointer/touch input',
  manual: 'Camera position set directly by the consumer',
  debug: 'Debug mode — shows camera helpers, axes, frustum',
};

// ── Target Descriptions ──────────────────────────────────

/** Human-readable descriptions for each camera target. */
export const CAMERA_TARGET_DESCRIPTIONS: Record<CameraTarget, string> = {
  hero: 'Hero section focal point',
  'scene-center': 'Center of the 3D scene',
  character: 'Character / person in the scene',
  product: 'Product / service display',
  booking: 'Booking interface overlay',
  ui: 'UI element in 3D space',
  debug: 'Development / debug target',
};

// ── Preset Ordering ──────────────────────────────────────

/**
 * Ordinal ranking of camera presets, by importance.
 * Lower values receive priority when quality budgets are tight.
 */
export const CAMERA_PRESET_ORDER: Record<CameraPreset, number> = {
  hero: 0,
  intro: 1,
  narrative: 2,
  services: 3,
  gallery: 4,
  transformation: 5,
  booking: 6,
  footer: 7,
  mobile: 8,
  'reduced-motion': 9,
  performance: 10,
};

// ── Mode Ordering ────────────────────────────────────────

/**
 * Ordinal ranking of camera modes, by control priority.
 * Higher-priority modes take precedence when multiple systems
 * attempt to control the camera simultaneously.
 */
export const CAMERA_MODE_ORDER: Record<CameraMode, number> = {
  manual: 0,
  cinematic: 1,
  interactive: 2,
  scroll: 3,
  narrative: 4,
  static: 5,
  debug: 6,
};

// ── Target Ordering ──────────────────────────────────────

/**
 * Ordinal ranking of camera targets, by semantic priority.
 */
export const CAMERA_TARGET_ORDER: Record<CameraTarget, number> = {
  hero: 0,
  character: 1,
  product: 2,
  'scene-center': 3,
  booking: 4,
  ui: 5,
  debug: 6,
};

// ── Preset Defaults ──────────────────────────────────────

/**
 * Default field of view for each camera preset.
 */
export const CAMERA_PRESET_FOV: Record<CameraPreset, number> = {
  hero: 50,
  intro: 45,
  narrative: 40,
  services: 35,
  gallery: 25,
  transformation: 50,
  booking: 40,
  footer: 60,
  mobile: 50,
  'reduced-motion': 40,
  performance: 35,
};

// ── Default Values ───────────────────────────────────────

/** Default field of view in degrees. */
export const DEFAULT_CAMERA_FOV = 40;

/** Default near clipping plane distance. */
export const DEFAULT_CAMERA_NEAR = 0.1;

/** Default far clipping plane distance. */
export const DEFAULT_CAMERA_FAR = 1000;

/** Default camera position. */
export const DEFAULT_CAMERA_POSITION: readonly [number, number, number] = [0, 1, 5];

/** Default camera lookAt target. */
export const DEFAULT_CAMERA_LOOK_AT: readonly [number, number, number] = [0, 1, 0];

/** Default camera mode. */
export const DEFAULT_CAMERA_MODE: CameraMode = 'static';

/** Default active preset (none). */
export const DEFAULT_ACTIVE_PRESET: CameraPresetId | null = null;

/** Default active target (none). */
export const DEFAULT_ACTIVE_TARGET: CameraTarget | null = null;

// ── Default Viewport ─────────────────────────────────────

/**
 * Default viewport — assumes desktop-class device.
 * SSR-safe: uses reasonable defaults when window is unavailable.
 */
export const DEFAULT_CAMERA_VIEWPORT: CameraViewport = Object.freeze({
  width: 1920,
  height: 1080,
  pixelRatio: 1,
  breakpoint: 'desktop',
});

// ── Default Quality Profile ──────────────────────────────

/**
 * Default quality profile — medium preset with balanced settings.
 */
export const DEFAULT_QUALITY_PROFILE: CameraQualityProfile = Object.freeze({
  preset: 'medium',
  maxFov: 70,
  maxShadowDistance: 50,
  effectsEnabled: true,
  proceduralEnabled: true,
  orbitEnabled: true,
});

// ── Default Constraints ──────────────────────────────────

/**
 * Default camera constraints — wide bounds suitable for all presets.
 */
export const DEFAULT_CAMERA_CONSTRAINTS: CameraConstraints = Object.freeze({
  minPosition: [-100, -100, -100] as const,
  maxPosition: [100, 100, 100] as const,
  minFov: 10,
  maxFov: 120,
  minDistance: 0.1,
  maxDistance: 500,
});

// ── Default Snapshot ─────────────────────────────────────

/**
 * The initial, empty camera snapshot.
 *
 * Represents a system with no active preset, no active target,
 * static mode, and default viewport. SSR-safe.
 */
export const DEFAULT_CAMERA_SNAPSHOT: CameraSnapshot = Object.freeze({
  presets: new Map(),
  targets: new Map(),
  activePresetId: null,
  activeTargetId: null,
  mode: 'static',
  position: DEFAULT_CAMERA_POSITION,
  lookAt: DEFAULT_CAMERA_LOOK_AT,
  fov: DEFAULT_CAMERA_FOV,
  near: DEFAULT_CAMERA_NEAR,
  far: DEFAULT_CAMERA_FAR,
  viewport: DEFAULT_CAMERA_VIEWPORT,
  qualityProfile: DEFAULT_QUALITY_PROFILE,
  constraints: DEFAULT_CAMERA_CONSTRAINTS,
  isReducedMotion: false,
  qualityPreset: 'medium',
  presetCount: 0,
  targetCount: 0,
  revision: 0,
  timestamp: 0,
});
