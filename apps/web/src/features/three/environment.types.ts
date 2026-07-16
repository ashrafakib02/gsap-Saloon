/**
 * Environment Types — Core Type System for Environment Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module defines the complete type system for the environment layer —
 * the infrastructure that manages environment presets, categories, groups,
 * quality adaptation, and reduced-motion compatibility. It stores metadata
 * and orchestrates environment STATE only; it never loads HDRIs, renders
 * skies, generates fog, or creates any 3D environment objects.
 *
 * Architecture:
 *   EnvironmentPresetOptions (consumer input) → EnvironmentPresetDefinition (resolved)
 *   → EnvironmentPresetState (runtime) → EnvironmentSnapshot (immutable)
 *   → EnvironmentManager (registration + lifecycle)
 *   → EnvironmentRegistry (read-only queries)
 *
 * Consumers (future): Scene environments, HDRI loading, sky rendering,
 * fog generation, atmosphere, weather systems, cinematic sequences.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import type { QualityPreset } from './three.types';

// ── Environment Preset ─────────────────────────────────────

/**
 * Semantic presets that define environment configuration for specific use cases.
 *
 * Each preset bundles environment complexity, resolution budgets,
 * reflection settings, and quality adaptation. Presets are immutable
 * configuration objects — they never change at runtime.
 */
export const ENVIRONMENT_PRESETS = [
  /** Hero scene — premium environment, full feature set */
  'hero',
  /** Golden hour — warm directional atmosphere */
  'golden-hour',
  /** Interior — salon interior environment */
  'interior',
  /** Gallery — clean, neutral exhibition environment */
  'gallery',
  /** Spa — soft, diffused relaxation environment */
  'spa',
  /** Services showcase — product-focused environment */
  'services',
  /** Booking overlay — stable, accessible environment */
  'booking',
  /** Night — low-light, moody environment */
  'night',
  /** Neutral — minimal, default environment */
  'neutral',
  /** Performance preset — minimal environment complexity */
  'performance',
  /** Mobile-optimized — simplified environment */
  'mobile',
  /** Reduced motion preset — static environment */
  'reduced-motion',
  /** Debug preset — wireframe / helper environment */
  'debug',
] as const;

/** Type-safe union of environment presets. */
export type EnvironmentPreset = (typeof ENVIRONMENT_PRESETS)[number];

// ── Environment Preset ID ──────────────────────────────────

/**
 * Type-safe environment preset identifier.
 *
 * This is a distinct alias of {@link EnvironmentPreset} used for Map keys
 * in the environment registry. It ensures preset IDs are treated as keys,
 * not arbitrary strings.
 */
export type EnvironmentPresetId = EnvironmentPreset;

// ── Environment Category ───────────────────────────────────

/**
 * Environment categories define the broad class of an environment.
 *
 * Each category represents a type of 3D environment that may be loaded
 * in a future phase. Only metadata is stored here — no actual environment
 * maps, textures, or rendering objects are created.
 */
export const ENVIRONMENT_CATEGORIES = [
  /** Interior — salon interiors, rooms, spaces */
  'interior',
  /** Studio — controlled lighting environments */
  'studio',
  /** Architectural — building exteriors, architectural spaces */
  'architectural',
  /** Natural — outdoor, landscape, sky environments */
  'natural',
  /** Procedural — shader-generated environments */
  'procedural',
  /** Cinematic — dramatic, film-quality environments */
  'cinematic',
  /** Minimal — simple, clean environments */
  'minimal',
  /** Debug — wireframe, helper environments */
  'debug',
  /** Future custom — extensible for custom environments */
  'future-custom',
] as const;

/** Type-safe union of environment categories. */
export type EnvironmentCategory = (typeof ENVIRONMENT_CATEGORIES)[number];

// ── Environment Category ID ────────────────────────────────

/**
 * Type-safe environment category identifier for Map keys.
 */
export type EnvironmentCategoryId = EnvironmentCategory;

// ── Environment Group ──────────────────────────────────────

/**
 * Environment groups cluster categories for quality budgeting.
 *
 * Groups allow the quality system to allocate budgets across related
 * categories rather than managing each category individually.
 */
export const ENVIRONMENT_GROUPS = [
  /** Spatial — interior, architectural, studio */
  'spatial',
  /** Lighting — golden-hour, natural, cinematic */
  'lighting',
  /** Atmospheric — sky, fog, atmosphere */
  'atmospheric',
  /** Procedural — procedural, debug */
  'procedural',
  /** Utility — minimal, debug, future-custom */
  'utility',
] as const;

/** Type-safe union of environment groups. */
export type EnvironmentGroup = (typeof ENVIRONMENT_GROUPS)[number];

// ── Environment Group ID ───────────────────────────────────

/**
 * Type-safe environment group identifier for Map keys.
 */
export type EnvironmentGroupId = EnvironmentGroup;

// ── Environment Layer ──────────────────────────────────────

/**
 * Future environment layer types.
 *
 * Each layer represents a component of a complete environment (e.g.,
 * sky dome, reflection probe, fog volume, background plate).
 * Only metadata — no actual texture or uniform data.
 */
export const ENVIRONMENT_LAYERS = [
  /** Sky dome / skybox */
  'sky',
  /** Reflection probes */
  'reflections',
  /** Fog volume */
  'fog',
  /** Background plate / image */
  'background',
  /** Ambient lighting */
  'ambient-light',
  /** Directional lighting */
  'directional-light',
  /** IBL (image-based lighting) */
  'ibl',
  /** Atmosphere / haze */
  'atmosphere',
  /** Ground plane */
  'ground',
  /** Procedural noise */
  'procedural-noise',
  /** Post-processing */
  'post-processing',
] as const;

/** Type-safe union of environment layers. */
export type EnvironmentLayer = (typeof ENVIRONMENT_LAYERS)[number];

// ── Environment Layer ID ───────────────────────────────────

/**
 * Type-safe environment layer identifier for Map keys.
 */
export type EnvironmentLayerId = EnvironmentLayer;

// ── Environment Profile ────────────────────────────────────

/**
 * Quality-adapted environment settings.
 *
 * Derived from the active quality preset. Determines maximum environment
 * resolution, reflection quality, fog precision, and feature availability.
 */
export interface EnvironmentQualityProfile {
  /** Active quality preset ('ultra' | 'high' | 'medium' | 'low' | 'minimal'). */
  readonly preset: QualityPreset;
  /** Maximum HDR environment resolution in pixels. */
  readonly maxHDRResolution: number;
  /** Maximum reflection probe resolution in pixels. */
  readonly maxReflectionResolution: number;
  /** Whether reflection probes are enabled. */
  readonly reflectionsEnabled: boolean;
  /** Whether fog is enabled. */
  readonly fogEnabled: boolean;
  /** Fog precision (number of marching steps, 0 = disabled). */
  readonly fogPrecision: number;
  /** Whether sky dome is enabled. */
  readonly skyEnabled: boolean;
  /** Whether IBL (image-based lighting) is enabled. */
  readonly iblEnabled: boolean;
  /** Whether atmospheric effects are enabled. */
  readonly atmosphereEnabled: boolean;
  /** Procedural complexity level (0–100). */
  readonly proceduralComplexity: number;
  /** Maximum simultaneous environment transitions per frame. */
  readonly maxTransitionsPerFrame: number;
}

// ── Environment Constraints ────────────────────────────────

/**
 * Boundary constraints for environment configuration.
 *
 * Prevents environment property values from exceeding valid ranges.
 * Future phases will use these constraints to clamp environment animations.
 */
export interface EnvironmentConstraints {
  /** Maximum number of active environments simultaneously. */
  readonly maxActiveEnvironments: number;
  /** Maximum total texture memory for environment maps in megabytes. */
  readonly maxEnvironmentMemoryMB: number;
  /** Maximum environment texture resolution (longest edge in pixels). */
  readonly maxEnvironmentResolution: number;
  /** Maximum fog distance in world units. */
  readonly maxFogDistance: number;
}

// ── Environment Metadata ───────────────────────────────────

/**
 * Human-readable metadata for an environment definition.
 *
 * Used for debug output, documentation, and future environment UI overlays.
 */
export interface EnvironmentMetadata {
  /** Unique environment identifier. */
  readonly id: string;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description of this environment's purpose. */
  readonly description: string;
  /** Environment category. */
  readonly category: EnvironmentCategory;
}

// ── Options (Consumer Input) ───────────────────────────────

/**
 * Consumer-facing options for registering an environment preset.
 *
 * All fields except `id` are optional — sensible defaults come from
 * the environment constants and the active quality preset.
 */
export interface EnvironmentPresetOptions {
  /** Unique preset identifier. */
  readonly id: EnvironmentPreset;
  /** Human-readable label. */
  readonly label?: string;
  /** Brief description of this preset. */
  readonly description?: string;
  /** Environment category. */
  readonly category?: EnvironmentCategory;
  /** Environment priority level. */
  readonly priority?: EnvironmentPriority;
  /** Environment group. */
  readonly group?: EnvironmentGroup;
  /** Whether the preset is initially enabled. */
  readonly enabled?: boolean;
}

// ── Definition (Resolved) ──────────────────────────────────

/**
 * Complete internal definition of an environment preset.
 *
 * Derived from {@link EnvironmentPresetOptions} with all defaults resolved.
 * Immutable — the manager replaces this on re-registration.
 */
export interface EnvironmentPresetDefinition {
  /** Unique preset identifier. */
  readonly id: EnvironmentPresetId;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description. */
  readonly description: string;
  /** Environment category. */
  readonly category: EnvironmentCategory;
  /** Environment priority level. */
  readonly priority: EnvironmentPriority;
  /** Environment group. */
  readonly group: EnvironmentGroup;
  /** Whether the preset is enabled. */
  readonly enabled: boolean;
}

// ── State (Runtime) ────────────────────────────────────────

/**
 * Runtime state for a single environment preset.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface EnvironmentPresetState {
  /** Preset identifier. */
  readonly id: EnvironmentPresetId;
  /** Current active status. */
  readonly enabled: boolean;
  /** Whether this preset is the currently active one. */
  readonly isActive: boolean;
  /** Whether this preset has been registered. */
  readonly isRegistered: boolean;
  /** Current lifecycle state. */
  readonly lifecycle: EnvironmentLifecycleState;
}

// ── Category State ─────────────────────────────────────────

/**
 * Runtime state for a single environment category.
 *
 * Tracks the number of presets registered in each category.
 */
export interface EnvironmentCategoryState {
  /** Category identifier. */
  readonly id: EnvironmentCategoryId;
  /** Whether the category is enabled. */
  readonly enabled: boolean;
  /** Number of presets registered in this category. */
  readonly presetCount: number;
}

// ── Group State ────────────────────────────────────────────

/**
 * Runtime state for a single environment group.
 *
 * Tracks the number of presets registered in each group.
 */
export interface EnvironmentGroupState {
  /** Group identifier. */
  readonly id: EnvironmentGroupId;
  /** Whether the group is enabled. */
  readonly enabled: boolean;
  /** Number of presets registered in this group. */
  readonly presetCount: number;
}

// ── Environment Lifecycle ──────────────────────────────────

/**
 * Lifecycle states for an environment definition.
 *
 * Tracks registration through disposal. The manager validates transitions.
 */
export const ENVIRONMENT_LIFECYCLE_STATES = [
  /** Registered, awaiting initialization */
  'registered',
  /** Environment maps / textures being loaded (future) */
  'loading',
  /** Ready for use */
  'ready',
  /** Currently active in the scene */
  'active',
  /** Unloaded but still in registry */
  'idle',
  /** Marked for disposal */
  'disposing',
  /** Disposed, no longer in memory */
  'disposed',
] as const;

/** Type-safe union of environment lifecycle states. */
export type EnvironmentLifecycleState = (typeof ENVIRONMENT_LIFECYCLE_STATES)[number];

// ── Environment Priority ───────────────────────────────────

/**
 * Environment priority levels for resource allocation.
 *
 * Higher priority environments receive texture budgets and resolution
 * allocations first.
 */
export const ENVIRONMENT_PRIORITIES = [
  /** Critical — hero environment, must render at full quality */
  'critical',
  /** High — narrative section environments */
  'high',
  /** Normal — standard section environments */
  'normal',
  /** Low — ambient / background environments */
  'low',
] as const;

/** Type-safe union of environment priorities. */
export type EnvironmentPriority = (typeof ENVIRONMENT_PRIORITIES)[number];

// ── Snapshot ───────────────────────────────────────────────

/**
 * The complete immutable snapshot of environment state.
 *
 * This is the single source of truth consumed by all environment hooks.
 * The manager replaces this object wholesale on every change so that
 * `Object.is` reference checks detect updates cheaply.
 */
export interface EnvironmentSnapshot {
  /** Preset runtime state, keyed by preset ID. */
  readonly presets: ReadonlyMap<EnvironmentPresetId, EnvironmentPresetState>;
  /** Category runtime state, keyed by category ID. */
  readonly categories: ReadonlyMap<EnvironmentCategoryId, EnvironmentCategoryState>;
  /** Group runtime state, keyed by group ID. */
  readonly groups: ReadonlyMap<EnvironmentGroupId, EnvironmentGroupState>;
  /** The currently active preset ID. */
  readonly activePresetId: EnvironmentPresetId | null;
  /** Quality-adapted environment settings. */
  readonly qualityProfile: EnvironmentQualityProfile;
  /** Environment constraints. */
  readonly constraints: EnvironmentConstraints;
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
  /** Active quality preset (mirrors ThreeContext). */
  readonly qualityPreset: QualityPreset;
  /** Total registered preset count. */
  readonly presetCount: number;
  /** Total registered category count. */
  readonly categoryCount: number;
  /** Total registered group count. */
  readonly groupCount: number;
  /** Monotonic revision counter — increments on every change. */
  readonly revision: number;
  /** Timestamp of the last snapshot update. */
  readonly timestamp: number;
}

// ── Registry ───────────────────────────────────────────────

/**
 * Read-only query interface over the environment registries.
 *
 * Mirrors the scene/camera/lighting/materials registry pattern — pure lookups, no mutation.
 */
export interface EnvironmentRegistry {
  /** Get a preset's runtime state by ID. */
  readonly getPreset: (id: EnvironmentPresetId) => EnvironmentPresetState | undefined;
  /** Get a category's runtime state by ID. */
  readonly getCategory: (id: EnvironmentCategoryId) => EnvironmentCategoryState | undefined;
  /** Get a group's runtime state by ID. */
  readonly getGroup: (id: EnvironmentGroupId) => EnvironmentGroupState | undefined;
  /** All registered preset IDs. */
  readonly getPresetIds: () => readonly EnvironmentPresetId[];
  /** All registered category IDs. */
  readonly getCategoryIds: () => readonly EnvironmentCategoryId[];
  /** All registered group IDs. */
  readonly getGroupIds: () => readonly EnvironmentGroupId[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: EnvironmentPresetId) => boolean;
  /** Whether a category is registered. */
  readonly hasCategory: (id: EnvironmentCategoryId) => boolean;
  /** Whether a group is registered. */
  readonly hasGroup: (id: EnvironmentGroupId) => boolean;
  /** Total registered preset count. */
  readonly presetCount: () => number;
  /** Total registered category count. */
  readonly categoryCount: () => number;
  /** Total registered group count. */
  readonly groupCount: () => number;
  /** Get all enabled presets. */
  readonly getEnabledPresets: () => readonly EnvironmentPresetId[];
  /** Get all enabled categories. */
  readonly getEnabledCategories: () => readonly EnvironmentCategoryId[];
  /** Get all enabled groups. */
  readonly getEnabledGroups: () => readonly EnvironmentGroupId[];
}

// ── Subscription Types ─────────────────────────────────────

/** Selector that extracts a slice of the environment snapshot. */
export type EnvironmentSelector<T> = (snapshot: EnvironmentSnapshot) => T;

/** Equality comparator for a selected environment value. */
export type EnvironmentEquality<T> = (a: T, b: T) => boolean;

/** Subscriber callback fired on relevant environment state changes. */
export type EnvironmentCallback = () => void;

/** Unsubscribe handle returned by subscription methods. */
export type EnvironmentUnsubscribe = () => void;

// ── Manager ────────────────────────────────────────────────

/**
 * The singleton environment manager interface.
 *
 * This is the single owner of all environment state. All hooks and future
 * consumers read from this instance. It contains no React.
 */
export interface EnvironmentManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => EnvironmentSnapshot;
  /** Subscribe to all environment state changes. */
  readonly subscribe: (callback: EnvironmentCallback) => EnvironmentUnsubscribe;
  /** Subscribe to a specific slice of environment state. */
  readonly subscribeSelector: <T>(
    selector: EnvironmentSelector<T>,
    callback: EnvironmentCallback,
    equalityFn?: EnvironmentEquality<T>,
  ) => EnvironmentUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — registers default categories, groups, and presets. */
  readonly init: () => void;
  /** Destroy the manager — clears everything, resets state. */
  readonly destroy: () => void;

  /* ── Preset management ── */
  /** Register an environment preset (idempotent by ID). */
  readonly registerPreset: (options: EnvironmentPresetOptions) => void;
  /** Unregister an environment preset. */
  readonly unregisterPreset: (id: EnvironmentPresetId) => void;
  /** Get a preset definition by ID. */
  readonly getPresetDefinition: (id: EnvironmentPresetId) => EnvironmentPresetDefinition | undefined;
  /** Get all preset definitions. */
  readonly getAllPresetDefinitions: () => readonly EnvironmentPresetDefinition[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: EnvironmentPresetId) => boolean;
  /** Set the active preset. */
  readonly setActivePreset: (id: EnvironmentPresetId | null) => void;

  /* ── Category management ── */
  /** Register an environment category (idempotent by ID). */
  readonly registerCategory: (id: EnvironmentCategoryId, enabled?: boolean) => void;
  /** Unregister an environment category. */
  readonly unregisterCategory: (id: EnvironmentCategoryId) => void;
  /** Whether a category is registered. */
  readonly hasCategory: (id: EnvironmentCategoryId) => boolean;

  /* ── Group management ── */
  /** Register an environment group (idempotent by ID). */
  readonly registerGroup: (id: EnvironmentGroupId, enabled?: boolean) => void;
  /** Unregister an environment group. */
  readonly unregisterGroup: (id: EnvironmentGroupId) => void;
  /** Whether a group is registered. */
  readonly hasGroup: (id: EnvironmentGroupId) => boolean;

  /* ── Quality / Reduced Motion ── */
  /** Update the quality preset (called when ThreeContext quality changes). */
  readonly setQualityPreset: (preset: QualityPreset) => void;
  /** Update reduced-motion state (called when ThreeContext changes). */
  readonly setReducedMotion: (reduced: boolean) => void;

  /* ── Query ── */
  /** Get the read-only registry query interface. */
  readonly getRegistry: () => EnvironmentRegistry;
}
