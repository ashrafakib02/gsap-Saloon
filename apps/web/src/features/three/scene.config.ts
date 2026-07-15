/**
 * Scene Config — Pure Derivation Functions for Scene State
 *
 * Contains pure functions that derive scene visibility, validate stage
 * transitions, and resolve layer/slot hierarchies. No React, no state,
 * no side effects.
 *
 * Phase 6.2: Config — pure derivation only.
 */

import type {
  SceneStage,
  SceneVisibility,
  ScenePriority,
  SceneLayerId,
  SceneSlotId,
  SceneLayerDefinition,
  SceneSlotDefinition,
} from './scene.types';

import {
  SCENE_STAGES,
  SCENE_LAYERS,
  SCENE_SLOTS,
  SCENE_VISIBILITY_STATES,
  SCENE_PRIORITIES,
} from './scene.types';

import type { QualityPreset } from './three.types';

import {
  SCENE_STAGE_ORDER,
  SCENE_LAYER_ORDER,
} from './scene.constants';

// ── Type Guards ──────────────────────────────────────────

/** Type guard: is a string a valid {@link SceneStage}? */
export function isSceneStage(value: unknown): value is SceneStage {
  return (
    typeof value === 'string' &&
    (SCENE_STAGES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link SceneVisibility}? */
export function isSceneVisibility(value: unknown): value is SceneVisibility {
  return (
    typeof value === 'string' &&
    (SCENE_VISIBILITY_STATES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link ScenePriority}? */
export function isScenePriority(value: unknown): value is ScenePriority {
  return (
    typeof value === 'string' &&
    (SCENE_PRIORITIES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link SceneLayerId}? */
export function isSceneLayerId(value: unknown): value is SceneLayerId {
  return (
    typeof value === 'string' &&
    (SCENE_LAYERS as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link SceneSlotId}? */
export function isSceneSlotId(value: unknown): value is SceneSlotId {
  return (
    typeof value === 'string' &&
    (SCENE_SLOTS as readonly string[]).includes(value)
  );
}

// ── Visibility Derivation ────────────────────────────────

/**
 * Pure derivation of scene visibility from stage + context.
 *
 * Stage determines the base visibility; quality and reduced motion
 * can override it:
 *   - `boot` / `loading` → `hidden` (not ready to render)
 *   - `ready` / `active` → `visible` (render normally)
 *   - `paused` → `suspended` (temporarily paused)
 *   - `hidden` → `hidden`
 *   - `disposed` → `disabled` (fully cleaned up)
 *
 * Quality overrides:
 *   - `minimal` preset → all non-critical scenes get `disabled`
 *   - Reduced motion → suppress `effects` layer scenes
 */
export function deriveSceneVisibility(
  stage: SceneStage,
  isReducedMotion: boolean,
  qualityPreset: QualityPreset,
  _layerId?: SceneLayerId,
): SceneVisibility {
  /* Base visibility from stage. */
  switch (stage) {
    case 'boot':
    case 'loading':
      return 'hidden';
    case 'ready':
    case 'active':
      break; /* Fall through to quality check. */
    case 'paused':
      return 'suspended';
    case 'hidden':
      return 'hidden';
    case 'disposed':
      return 'disabled';
  }

  /* Quality gate: minimal preset disables most scenes. */
  if (qualityPreset === 'minimal') {
    return 'disabled';
  }

  /* Reduced motion: suppress particle/effects layers. */
  if (isReducedMotion && _layerId === 'effects') {
    return 'disabled';
  }

  return 'visible';
}

// ── Stage Derivation ─────────────────────────────────────

/**
 * Derive the effective stage for a scene from its definition + context.
 *
 * Currently a passthrough — the definition's stage is authoritative.
 * Future phases may add auto-progression (e.g. boot → loading when
 * assets are being loaded).
 */
export function deriveSceneStage(
  _definition: { readonly id: string; readonly stage: SceneStage; readonly enabled: boolean },
  _isReducedMotion: boolean,
): SceneStage {
  return _definition.stage;
}

// ── Stage Transition Validation ──────────────────────────

/**
 * Valid stage transitions. Maps each stage to the set of stages
 * it can transition to.
 */
const VALID_TRANSITIONS: Record<SceneStage, readonly SceneStage[]> = {
  boot: ['loading', 'disposed'],
  loading: ['ready', 'boot', 'disposed'],
  ready: ['active', 'paused', 'hidden', 'disposed'],
  active: ['paused', 'hidden', 'disposed'],
  paused: ['active', 'hidden', 'disposed'],
  hidden: ['ready', 'active', 'disposed'],
  disposed: [], /* Terminal state — no transitions out. */
};

/**
 * Check if a stage transition is valid.
 *
 * Returns `false` for self-transitions and invalid target stages.
 */
export function isValidStageTransition(
  from: SceneStage,
  to: SceneStage,
): boolean {
  if (from === to) return false;
  return VALID_TRANSITIONS[from].includes(to);
}

// ── Ordering Accessors ───────────────────────────────────

/** Get the ordinal for a stage (for ordering comparisons). */
export function getSceneStagePriority(stage: SceneStage): number {
  return SCENE_STAGE_ORDER[stage];
}

/** Get the z-order for a layer (for render ordering). */
export function getSceneLayerOrder(layer: SceneLayerId): number {
  return SCENE_LAYER_ORDER[layer];
}

// ── Layer Resolution ─────────────────────────────────────

/**
 * Resolve the default layer hierarchy as an array of definitions.
 *
 * Ordered by z-order (lowest first). All layers are enabled by default.
 */
export function resolveSceneLayers(): readonly SceneLayerDefinition[] {
  return SCENE_LAYERS.map((id) => ({
    id,
    order: SCENE_LAYER_ORDER[id],
    enabled: true,
  }));
}

// ── Slot Resolution ──────────────────────────────────────

/**
 * Resolve the default slot configuration as an array of definitions.
 *
 * All slots are enabled by default. Camera and lighting slots are
 * always active; other slots boot in 'boot' stage.
 */
export function resolveSceneSlots(): readonly SceneSlotDefinition[] {
  return SCENE_SLOTS.map((id) => ({
    id,
    enabled: true,
  }));
}
