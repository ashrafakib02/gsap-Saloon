/**
 * Scene Constants — Default Configuration, Descriptions, and Ordering
 *
 * Provides default values, description records, stage transition rules,
 * layer z-order, slot defaults, and the initial snapshot for the scene
 * system.
 *
 * Phase 6.2: Constants — no React, no 3D objects.
 */

import type {
  SceneStage,
  SceneVisibility,
  ScenePriority,
  SceneGroup,
  SceneLayerId,
  SceneSlotId,
  SceneSnapshot,
} from './scene.types';

// ── Re-exports ───────────────────────────────────────────

export {
  SCENE_LAYERS,
  SCENE_SLOTS,
  SCENE_STAGES,
  SCENE_VISIBILITY_STATES,
  SCENE_PRIORITIES,
  SCENE_GROUPS,
} from './scene.types';

// ── Stage Descriptions ───────────────────────────────────

/** Human-readable descriptions for each scene lifecycle stage. */
export const SCENE_STAGE_DESCRIPTIONS: Record<SceneStage, string> = {
  boot: 'Initial state — not yet loaded',
  loading: 'Assets loading — scene exists but not ready',
  ready: 'Assets loaded — ready to become active',
  active: 'Actively rendering — full resource consumption',
  paused: 'Paused — loaded but not rendering',
  hidden: 'Hidden — not rendered, resources released',
  disposed: 'Disposed — fully cleaned up, removed from scene tree',
};

// ── Visibility Descriptions ──────────────────────────────

/** Human-readable descriptions for each visibility state. */
export const SCENE_VISIBILITY_DESCRIPTIONS: Record<SceneVisibility, string> = {
  visible: 'Scene is visible and rendering',
  hidden: 'Scene is hidden — not rendered',
  suspended: 'Scene is suspended — temporarily paused',
  disabled: 'Scene is disabled — quality/capability cannot support it',
  offscreen: 'Scene is offscreen — not in viewport',
};

// ── Priority Descriptions ────────────────────────────────

/** Human-readable descriptions for each scene priority. */
export const SCENE_PRIORITY_DESCRIPTIONS: Record<ScenePriority, string> = {
  critical: 'Must render — hero scene, critical atmosphere',
  high: 'Should render — primary section scenes',
  normal: 'Standard render order — default priority',
  low: 'Render last — decorative, ambient scenes',
};

// ── Layer Descriptions ───────────────────────────────────

/** Human-readable descriptions for each scene layer. */
export const SCENE_LAYER_DESCRIPTIONS: Record<SceneLayerId, string> = {
  environment: 'Deepest background — skybox, gradient environments',
  background: 'Background geometry — distant mountains, architecture',
  world: 'Primary world geometry — surfaces, ground planes',
  character: 'Character / subject geometry — the focal content',
  effects: 'Particle effects, volumetric rays, atmospheric effects',
  ui: 'UI overlays in 3D space — labels, indicators',
  debug: 'Development helpers — grid, axes, debug info',
};

// ── Slot Descriptions ────────────────────────────────────

/** Human-readable descriptions for each scene slot. */
export const SCENE_SLOT_DESCRIPTIONS: Record<SceneSlotId, string> = {
  camera: 'Camera system — perspective, orthographic, transitions',
  lighting: 'Lighting rig — ambient, directional, point, spot',
  environment: 'Environment — skybox, background gradients, fog',
  models: '3D models — GLTF/GLB loaded geometry',
  particles: 'Particle systems — ambient atmosphere, effects',
  postprocessing: 'Post-processing — bloom, vignette, color grading',
  helpers: 'Development helpers — grid, axes, stats',
  audio: 'Audio — spatial audio, ambient soundscapes',
  debug: 'Debug overlay — FPS, memory, scene stats',
};

// ── Group Descriptions ───────────────────────────────────

/** Human-readable descriptions for each scene group. */
export const SCENE_GROUP_DESCRIPTIONS: Record<SceneGroup, string> = {
  hero: 'Hero scenes — persistent, high quality',
  section: 'Section scenes — tied to scroll sections',
  ambient: 'Ambient scenes — always present, low resource',
  utility: 'Utility scenes — on-demand, debugging',
};

// ── Stage Ordering ───────────────────────────────────────

/**
 * Ordinal ranking of scene stages, earliest → latest.
 * Used for stage comparison (e.g. "is this scene ready?").
 */
export const SCENE_STAGE_ORDER: Record<SceneStage, number> = {
  boot: 0,
  loading: 1,
  ready: 2,
  active: 3,
  paused: 4,
  hidden: 5,
  disposed: 6,
};

// ── Layer Z-Order ────────────────────────────────────────

/**
 * Z-order for render layering. Lower values render behind higher values.
 */
export const SCENE_LAYER_ORDER: Record<SceneLayerId, number> = {
  environment: 0,
  background: 1,
  world: 2,
  character: 3,
  effects: 4,
  ui: 5,
  debug: 6,
};

// ── Priority Ordering ────────────────────────────────────

/**
 * Numeric weight for each priority — higher receives resources first.
 */
export const SCENE_PRIORITY_ORDER: Record<ScenePriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

// ── Slot Defaults ────────────────────────────────────────

/**
 * Default stage, visibility, and priority for each slot type.
 * Used when initializing slots during manager init().
 */
export const SCENE_SLOT_DEFAULTS: Record<
  SceneSlotId,
  { readonly stage: SceneStage; readonly visibility: SceneVisibility; readonly priority: ScenePriority }
> = {
  camera: { stage: 'ready', visibility: 'visible', priority: 'critical' },
  lighting: { stage: 'ready', visibility: 'visible', priority: 'critical' },
  environment: { stage: 'ready', visibility: 'visible', priority: 'high' },
  models: { stage: 'boot', visibility: 'hidden', priority: 'normal' },
  particles: { stage: 'boot', visibility: 'hidden', priority: 'low' },
  postprocessing: { stage: 'boot', visibility: 'hidden', priority: 'low' },
  helpers: { stage: 'boot', visibility: 'hidden', priority: 'low' },
  audio: { stage: 'boot', visibility: 'hidden', priority: 'low' },
  debug: { stage: 'boot', visibility: 'hidden', priority: 'low' },
};

// ── Default Values ───────────────────────────────────────

/** Default stage for new scenes. */
export const DEFAULT_SCENE_STAGE: SceneStage = 'boot';

/** Default visibility for new scenes. */
export const DEFAULT_SCENE_VISIBILITY: SceneVisibility = 'hidden';

/** Default priority for new scenes. */
export const DEFAULT_SCENE_PRIORITY: ScenePriority = 'normal';

/** Default group for new scenes. */
export const DEFAULT_SCENE_GROUP: SceneGroup = 'ambient';

// ── Default Snapshot ─────────────────────────────────────

/**
 * The initial, empty scene snapshot.
 *
 * Represents a system with no registered scenes, default layers/slots,
 * and zeroed counters. SSR-safe.
 */
export const DEFAULT_SCENE_SNAPSHOT: SceneSnapshot = Object.freeze({
  scenes: new Map(),
  layers: new Map(),
  slots: new Map(),
  stages: new Map(),
  visibleSceneIds: [],
  activeSceneIds: [],
  overallProgress: 0,
  isReducedMotion: false,
  qualityPreset: 'medium',
  revision: 0,
  timestamp: 0,
});
