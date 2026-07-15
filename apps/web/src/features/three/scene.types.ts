/**
 * Scene Types — Core Type System for Scene Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module defines the complete type system for the scene layer —
 * the infrastructure that organizes 3D content into layers, stages,
 * and slots. It stores metadata and orchestrates scene STATE only;
 * it never renders.
 *
 * Architecture:
 *   SceneOptions (consumer input) → SceneDefinition (resolved)
 *   → SceneState (runtime) → SceneSnapshot (immutable)
 *   → SceneManager (registration + lifecycle)
 *   → SceneRegistry (read-only queries)
 *
 * Consumers (future): Camera (6.3), Lighting (6.4), Materials (6.5),
 * Environment (6.6), Assets (6.7), Particles, Post Processing.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import type { QualityPreset } from './three.types';

// ── Scene Layer ──────────────────────────────────────────

/**
 * The render-order layers that scenes can occupy.
 *
 * Layers determine the z-order of scene content. Content in lower layers
 * renders behind content in higher layers. The ordering is architectural —
 * it controls which 3D elements appear in front of others.
 *
 * From TECHNICAL_ARCHITECTURE §9.3:
 * "Scene content is organized into layers that determine render order."
 */
export const SCENE_LAYERS = [
  /** Deepest background — skybox, gradient environments */
  'environment',
  /** Background geometry — distant mountains, architecture */
  'background',
  /** Primary world geometry — surfaces, ground planes */
  'world',
  /** Character / subject geometry — the focal content */
  'character',
  /** Particle effects, volumetric rays, atmospheric effects */
  'effects',
  /** UI overlays in 3D space — labels, indicators */
  'ui',
  /** Development helpers — grid, axes, debug info */
  'debug',
] as const;

/** Type-safe union of scene layer IDs. */
export type SceneLayerId = (typeof SCENE_LAYERS)[number];

// ── Scene Slot ──────────────────────────────────────────

/**
 * Mounting slots for future 3D subsystems.
 *
 * Slots are fixed positions in the scene tree where specific subsystems
 * will mount. They provide a typed registration surface so the engine
 * can coordinate lifecycle, disposal, and quality scaling centrally.
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "The 3D root owns capability detection, quality selection, and the shared
 *  registries. Components read this state; they never probe the device
 *  themselves."
 */
export const SCENE_SLOTS = [
  /** Camera system — perspective, orthographic, transitions (Phase 6.3) */
  'camera',
  /** Lighting rig — ambient, directional, point, spot (Phase 6.4) */
  'lighting',
  /** Environment — skybox, background gradients, fog (Phase 6.6) */
  'environment',
  /** 3D models — GLTF/GLB loaded geometry */
  'models',
  /** Particle systems — ambient atmosphere, effects */
  'particles',
  /** Post-processing — bloom, vignette, color grading */
  'postprocessing',
  /** Development helpers — grid, axes, stats */
  'helpers',
  /** Audio — spatial audio, ambient soundscapes */
  'audio',
  /** Debug overlay — FPS, memory, scene stats */
  'debug',
] as const;

/** Type-safe union of scene slot IDs. */
export type SceneSlotId = (typeof SCENE_SLOTS)[number];

// ── Scene Stage ──────────────────────────────────────────

/**
 * Lifecycle stage of a scene.
 *
 * Stages progress linearly: boot → loading → ready → active → paused →
 * hidden → disposed. The stage determines whether a scene is rendered
 * and how much resource it consumes.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Scenes consume resources proportional to their stage."
 */
export const SCENE_STAGES = [
  /** Initial state — not yet loaded */
  'boot',
  /** Assets loading — scene exists but not ready */
  'loading',
  /** Assets loaded — ready to become active */
  'ready',
  /** Actively rendering — full resource consumption */
  'active',
  /** Paused — loaded but not rendering */
  'paused',
  /** Hidden — not rendered, resources released */
  'hidden',
  /** Disposed — fully cleaned up, removed from scene tree */
  'disposed',
] as const;

/** Type-safe union of scene lifecycle stages. */
export type SceneStage = (typeof SCENE_STAGES)[number];

// ── Scene Visibility ─────────────────────────────────────

/**
 * Derived visibility of a scene.
 *
 * Distinct from stage: visibility is computed from stage + quality +
 * reduced-motion context. A scene may be 'active' but 'disabled' if
 * the quality preset cannot support it.
 */
export const SCENE_VISIBILITY_STATES = [
  /** Scene is visible and rendering */
  'visible',
  /** Scene is hidden — not rendered */
  'hidden',
  /** Scene is suspended — temporarily paused */
  'suspended',
  /** Scene is disabled — quality/capability cannot support it */
  'disabled',
  /** Scene is offscreen — not in viewport */
  'offscreen',
] as const;

/** Type-safe union of scene visibility states. */
export type SceneVisibility = (typeof SCENE_VISIBILITY_STATES)[number];

// ── Scene Priority ───────────────────────────────────────

/**
 * Resource allocation priority for scenes.
 *
 * When GPU budgets are tight, higher-priority scenes receive resources
 * first. From DESIGN_SYSTEM §Performance:
 * "Above-fold content receives critical priority."
 */
export const SCENE_PRIORITIES = [
  /** Must render — hero scene, critical atmosphere */
  'critical',
  /** Should render — primary section scenes */
  'high',
  /** Standard render order — default */
  'normal',
  /** Render last — decorative, ambient scenes */
  'low',
] as const;

/** Type-safe union of scene priorities. */
export type ScenePriority = (typeof SCENE_PRIORITIES)[number];

// ── Scene Group ──────────────────────────────────────────

/**
 * Logical grouping of scenes for lifecycle coordination.
 *
 * Groups determine how scenes are managed during scroll transitions:
 * hero scenes persist, section scenes load/unload with scroll,
 * ambient scenes run continuously, utility scenes are on-demand.
 */
export const SCENE_GROUPS = [
  /** Hero scenes — persistent, high quality */
  'hero',
  /** Section scenes — tied to scroll sections */
  'section',
  /** Ambient scenes — always present, low resource */
  'ambient',
  /** Utility scenes — on-demand, debugging */
  'utility',
] as const;

/** Type-safe union of scene groups. */
export type SceneGroup = (typeof SCENE_GROUPS)[number];

// ── Options (Consumer Input) ─────────────────────────────

/**
 * Consumer-facing options for registering a scene.
 *
 * All fields except `id` are optional — sensible defaults come from
 * the scene constants and the active quality preset.
 */
export interface SceneOptions {
  /** Unique scene identifier. */
  readonly id: string;
  /** Render-order layer this scene occupies. */
  readonly layer?: SceneLayerId;
  /** Lifecycle stage — initial stage for the scene. */
  readonly stage?: SceneStage;
  /** Resource allocation priority. */
  readonly priority?: ScenePriority;
  /** Logical group for lifecycle coordination. */
  readonly group?: SceneGroup;
  /** Whether the scene is initially enabled. */
  readonly enabled?: boolean;
  /** Human-readable name for debug output. */
  readonly label?: string;
}

// ── Definition (Resolved) ────────────────────────────────

/**
 * Complete internal definition of a scene.
 *
 * Derived from {@link SceneOptions} with all defaults resolved.
 * Immutable — the manager replaces this on re-registration.
 */
export interface SceneDefinition {
  readonly id: string;
  readonly layer: SceneLayerId;
  readonly stage: SceneStage;
  readonly priority: ScenePriority;
  readonly group: SceneGroup;
  readonly enabled: boolean;
  readonly label: string;
}

// ── State (Runtime) ─────────────────────────────────────

/**
 * Runtime state for a single scene.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface SceneState {
  readonly id: string;
  readonly stage: SceneStage;
  readonly visibility: SceneVisibility;
  readonly progress: number;
  readonly lastChange: number;
}

// ── Layer ─────────────────────────────────────────────────

/**
 * Consumer-facing options for registering a scene layer.
 */
export interface SceneLayerOptions {
  /** Layer identifier — must match a SceneLayerId. */
  readonly id: SceneLayerId;
  /** Z-order for render ordering (lower = behind). */
  readonly order?: number;
  /** Whether the layer is initially enabled. */
  readonly enabled?: boolean;
}

/**
 * Complete internal definition of a scene layer.
 */
export interface SceneLayerDefinition {
  readonly id: SceneLayerId;
  readonly order: number;
  readonly enabled: boolean;
}

/**
 * Runtime state for a scene layer.
 */
export interface SceneLayerState {
  readonly id: SceneLayerId;
  readonly enabled: boolean;
  readonly sceneCount: number;
}

// ── Slot ──────────────────────────────────────────────────

/**
 * Consumer-facing options for registering a scene slot.
 */
export interface SceneSlotOptions {
  /** Slot identifier — must match a SceneSlotId. */
  readonly id: SceneSlotId;
  /** Whether the slot is initially enabled. */
  readonly enabled?: boolean;
}

/**
 * Complete internal definition of a scene slot.
 */
export interface SceneSlotDefinition {
  readonly id: SceneSlotId;
  readonly enabled: boolean;
}

/**
 * Runtime state for a scene slot.
 */
export interface SceneSlotState {
  readonly id: SceneSlotId;
  readonly enabled: boolean;
  readonly isRegistered: boolean;
}

// ── Snapshot ─────────────────────────────────────────────

/**
 * The complete immutable snapshot of scene state.
 *
 * This is the single source of truth consumed by all scene hooks.
 * The manager replaces this object wholesale on every change so that
 * `Object.is` reference checks detect updates cheaply.
 */
export interface SceneSnapshot {
  /** Scene runtime state, keyed by scene ID. */
  readonly scenes: ReadonlyMap<string, SceneState>;
  /** Layer runtime state, keyed by layer ID. */
  readonly layers: ReadonlyMap<SceneLayerId, SceneLayerState>;
  /** Slot runtime state, keyed by slot ID. */
  readonly slots: ReadonlyMap<SceneSlotId, SceneSlotState>;
  /** Stage ordinal map for all scenes (for ordering). */
  readonly stages: ReadonlyMap<string, SceneStage>;
  /** IDs of all currently visible scenes. */
  readonly visibleSceneIds: readonly string[];
  /** IDs of all active-stage scenes. */
  readonly activeSceneIds: readonly string[];
  /** Overall scene loading progress (0→1). */
  readonly overallProgress: number;
  /** Whether reduced motion is active (mirrors ThreeContext). */
  readonly isReducedMotion: boolean;
  /** Active quality preset (mirrors ThreeContext). */
  readonly qualityPreset: QualityPreset;
  /** Monotonic revision counter — increments on every change. */
  readonly revision: number;
  /** Timestamp of the last snapshot update. */
  readonly timestamp: number;
}

// ── Registry ─────────────────────────────────────────────

/**
 * Read-only query interface over the scene registries.
 *
 * Mirrors the progressive-reveal registry pattern — pure lookups,
 * no mutation.
 */
export interface SceneRegistry {
  /** Get a scene's runtime state by ID. */
  readonly getScene: (id: string) => SceneState | undefined;
  /** Get a layer's runtime state by ID. */
  readonly getLayer: (id: SceneLayerId) => SceneLayerState | undefined;
  /** Get a slot's runtime state by ID. */
  readonly getSlot: (id: SceneSlotId) => SceneSlotState | undefined;
  /** All registered scene IDs. */
  readonly getSceneIds: () => readonly string[];
  /** Scene IDs in a given stage. */
  readonly getScenesByStage: (stage: SceneStage) => readonly string[];
  /** Scene IDs in a given layer. */
  readonly getScenesByLayer: (layer: SceneLayerId) => readonly string[];
  /** Scene IDs in a given group. */
  readonly getScenesByGroup: (group: SceneGroup) => readonly string[];
  /** Whether a scene is registered. */
  readonly hasScene: (id: string) => boolean;
  /** Total registered scene count. */
  readonly sceneCount: () => number;
}

// ── Subscription Types ───────────────────────────────────

/** Selector that extracts a slice of the scene snapshot. */
export type SceneSelector<T> = (snapshot: SceneSnapshot) => T;

/** Equality comparator for a selected scene value. */
export type SceneEquality<T> = (a: T, b: T) => boolean;

/** Subscriber callback fired on relevant scene state changes. */
export type SceneCallback = () => void;

/** Unsubscribe handle returned by subscription methods. */
export type SceneUnsubscribe = () => void;

// ── Manager ──────────────────────────────────────────────

/**
 * The singleton scene manager interface.
 *
 * This is the single owner of all scene state. All hooks and future
 * consumers read from this instance. It contains no React.
 */
export interface SceneManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => SceneSnapshot;
  /** Subscribe to all scene state changes. */
  readonly subscribe: (callback: SceneCallback) => SceneUnsubscribe;
  /** Subscribe to a specific slice of scene state. */
  readonly subscribeSelector: <T>(
    selector: SceneSelector<T>,
    callback: SceneCallback,
    equalityFn?: SceneEquality<T>,
  ) => SceneUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — registers default layers and slots. */
  readonly init: () => void;
  /** Destroy the manager — clears everything, resets state. */
  readonly destroy: () => void;
  /** Register a scene (idempotent by ID). */
  readonly registerScene: (options: SceneOptions) => void;
  /** Unregister a scene. */
  readonly unregisterScene: (id: string) => void;
  /** Get a scene definition by ID. */
  readonly getSceneDefinition: (id: string) => SceneDefinition | undefined;
  /** Get all scene definitions. */
  readonly getAllSceneDefinitions: () => readonly SceneDefinition[];
  /** Whether a scene is registered. */
  readonly hasScene: (id: string) => boolean;
  /** Transition a scene to a new stage. */
  readonly setSceneStage: (id: string, stage: SceneStage) => void;
  /** Override a scene's visibility (bypasses derivation). */
  readonly setSceneVisibility: (id: string, visibility: SceneVisibility) => void;
  /** Get a layer definition by ID. */
  readonly getLayer: (id: SceneLayerId) => SceneLayerDefinition | undefined;
  /** Get all layer definitions. */
  readonly getAllLayers: () => readonly SceneLayerDefinition[];
  /** Whether a layer is registered. */
  readonly hasLayer: (id: SceneLayerId) => boolean;
  /** Get a slot definition by ID. */
  readonly getSlot: (id: SceneSlotId) => SceneSlotDefinition | undefined;
  /** Get all slot definitions. */
  readonly getAllSlots: () => readonly SceneSlotDefinition[];
  /** Whether a slot is registered. */
  readonly hasSlot: (id: SceneSlotId) => boolean;
  /** Register a slot (idempotent by ID). */
  readonly registerSlot: (options: SceneSlotOptions) => void;
  /** Unregister a slot. */
  readonly unregisterSlot: (id: SceneSlotId) => void;
  /** Get the read-only registry query interface. */
  readonly getRegistry: () => SceneRegistry;
  /** Update the quality preset (called when ThreeContext quality changes). */
  readonly setQualityPreset: (preset: QualityPreset) => void;
  /** Update reduced-motion state (called when ThreeContext changes). */
  readonly setReducedMotion: (reduced: boolean) => void;
}
