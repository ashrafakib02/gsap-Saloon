/**
 * Materials Types — Core Type System for Material Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module defines the complete type system for the materials layer —
 * the infrastructure that manages material presets, categories, groups,
 * quality adaptation, and reduced-motion compatibility. It stores metadata
 * and orchestrates material STATE only; it never instantiates materials.
 *
 * Architecture:
 *   MaterialPresetOptions (consumer input) → MaterialPresetDefinition (resolved)
 *   → MaterialPresetState (runtime) → MaterialSnapshot (immutable)
 *   → MaterialsManager (registration + lifecycle)
 *   → MaterialRegistry (read-only queries)
 *
 * Consumers (future): Scene materials, environment maps, post-processing,
 * cinematic sequences, scroll-linked material transitions.
 *
 * Phase 6.5: Materials architecture — infrastructure only, no materials.
 */

import type { QualityPreset } from './three.types';

// ── Material Preset ───────────────────────────────────────

/**
 * Semantic presets that define material configuration for specific use cases.
 *
 * Each preset bundles material complexity, texture budgets, shader settings,
 * and quality adaptation. Presets are immutable configuration objects —
 * they never change at runtime.
 */
export const MATERIAL_PRESETS = [
  /** Hero scene — premium materials, full feature set */
  'hero',
  /** Narrative sections — balanced documentary materials */
  'narrative',
  /** Services showcase — product-focused material quality */
  'services',
  /** Gallery — high-fidelity detail materials */
  'gallery',
  /** Transformation before/after — dramatic material transitions */
  'transformation',
  /** Booking overlay — stable, accessible materials */
  'booking',
  /** Footer — distant, low-detail materials */
  'footer',
  /** Mobile-optimized — simplified, low-cost materials */
  'mobile',
  /** Performance preset — minimal shader complexity */
  'performance',
  /** Reduced motion preset — static, simple materials */
  'reduced-motion',
  /** Debug preset — wireframe / flat-color helpers */
  'debug',
] as const;

/** Type-safe union of material presets. */
export type MaterialPreset = (typeof MATERIAL_PRESETS)[number];

// ── Material Preset ID ────────────────────────────────────

/**
 * Type-safe material preset identifier.
 *
 * This is a distinct alias of {@link MaterialPreset} used for Map keys
 * in the materials registry. It ensures preset IDs are treated as keys,
 * not arbitrary strings.
 */
export type MaterialPresetId = MaterialPreset;

// ── Material Category ─────────────────────────────────────

/**
 * Material categories define the broad class of a material.
 *
 * Each category represents a type of surface that may be rendered
 * in a future phase. Only metadata is stored here — no Three.js material
 * objects are created.
 */
export const MATERIAL_CATEGORIES = [
  /** Fabric — cloth, textile, upholstery */
  'fabric',
  /** Wood — timber, lacquer, veneer */
  'wood',
  /** Stone — granite, sandstone, slate */
  'stone',
  /** Marble — polished, veined, Carrara */
  'marble',
  /** Metal — brushed, polished, anodized */
  'metal',
  /** Glass — clear, frosted, tinted */
  'glass',
  /** Ceramic — porcelain, glazed, matte */
  'ceramic',
  /** Leather — genuine, synthetic, suede */
  'leather',
  /** Skin — human skin subsurface */
  'skin',
  /** Hair — strand-based, anisotropic */
  'hair',
  /** Liquid — water, oil, cream */
  'liquid',
  /** Procedural — shader-generated, no texture */
  'procedural',
  /** UI — interface overlays, HTML3D */
  'ui',
  /** Debug — wireframe, flat-color, helpers */
  'debug',
] as const;

/** Type-safe union of material categories. */
export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];

// ── Material Category ID ──────────────────────────────────

/**
 * Type-safe material category identifier for Map keys.
 */
export type MaterialCategoryId = MaterialCategory;

// ── Material Group ────────────────────────────────────────

/**
 * Material groups cluster categories for quality budgeting.
 *
 * Groups allow the quality system to allocate budgets across related
 * categories rather than managing each category individually.
 */
export const MATERIAL_GROUPS = [
  /** Architectural — stone, marble, wood, ceramic */
  'architectural',
  /** Surface — fabric, leather, skin */
  'surface',
  /** Reflective — glass, metal, liquid */
  'reflective',
  /** Organic — hair, skin, liquid */
  'organic',
  /** Technical — procedural, ui, debug */
  'technical',
] as const;

/** Type-safe union of material groups. */
export type MaterialGroup = (typeof MATERIAL_GROUPS)[number];

// ── Material Group ID ─────────────────────────────────────

/**
 * Type-safe material group identifier for Map keys.
 */
export type MaterialGroupId = MaterialGroup;

// ── Material Layer ────────────────────────────────────────

/**
 * Future material layer types.
 *
 * Each layer represents a component of a complete material (e.g.,
 * base color, roughness, normal, displacement). Only metadata —
 * no actual texture or uniform data.
 */
export const MATERIAL_LAYERS = [
  /** Base color / albedo */
  'base-color',
  /** Normal map */
  'normal',
  /** Roughness / glossiness */
  'roughness',
  /** Metallic */
  'metallic',
  /** Ambient occlusion */
  'ambient-occlusion',
  /** Emissive */
  'emissive',
  /** Displacement / height */
  'displacement',
  /** Clearcoat */
  'clearcoat',
  /** Transmission */
  'transmission',
  /** Subsurface scattering */
  'subsurface',
  /** Anisotropy */
  'anisotropy',
] as const;

/** Type-safe union of material layers. */
export type MaterialLayer = (typeof MATERIAL_LAYERS)[number];

// ── Material Layer ID ─────────────────────────────────────

/**
 * Type-safe material layer identifier for Map keys.
 */
export type MaterialLayerId = MaterialLayer;

// ── Material Surface ──────────────────────────────────────

/**
 * Surface finish types that modify how a material category is rendered.
 */
export const MATERIAL_SURFACES = [
  /** Matte — no specular highlight */
  'matte',
  /** Satin — subtle sheen */
  'satin',
  /** Glossy — sharp specular */
  'glossy',
  /** Polished — mirror-like reflection */
  'polished',
  /** Rough — diffuse micro-detail */
  'rough',
  /** Brushed — directional anisotropy */
  'brushed',
  /** Frosted — scattered reflection */
  'frosted',
  /** Transparent — full light transmission */
  'transparent',
  /** Translucent — partial light transmission */
  'translucent',
  /** Metallic — conductive reflection */
  'metallic',
] as const;

/** Type-safe union of material surfaces. */
export type MaterialSurface = (typeof MATERIAL_SURFACES)[number];

// ── Material Surface ID ───────────────────────────────────

/**
 * Type-safe material surface identifier for Map keys.
 */
export type MaterialSurfaceId = MaterialSurface;

// ── Material Variant ──────────────────────────────────────

/**
 * Material variant types for category-specific variations.
 *
 * Each variant is a named configuration within a category — e.g.,
 * marble has 'carrara', 'nero', 'emperador'. Only metadata.
 */
export type MaterialVariant = string;

// ── Material Lifecycle ────────────────────────────────────

/**
 * Lifecycle states for a material definition.
 *
 * Tracks registration through disposal. The manager validates transitions.
 */
export const MATERIAL_LIFECYCLE_STATES = [
  /** Registered, awaiting initialization */
  'registered',
  /** Textures / shaders being loaded (future) */
  'loading',
  /** Ready for use */
  'ready',
  /** Currently bound to a mesh */
  'active',
  /** Unbound but still in memory */
  'idle',
  /** Marked for disposal */
  'disposing',
  /** Disposed, no longer in memory */
  'disposed',
] as const;

/** Type-safe union of material lifecycle states. */
export type MaterialLifecycleState = (typeof MATERIAL_LIFECYCLE_STATES)[number];

// ── Material Priority ─────────────────────────────────────

/**
 * Material priority levels for resource allocation.
 *
 * Higher priority materials receive texture budgets and shader
 * complexity allocations first.
 */
export const MATERIAL_PRIORITIES = [
  /** Critical — hero materials, must render at full quality */
  'critical',
  /** High — narrative section materials */
  'high',
  /** Normal — standard section materials */
  'normal',
  /** Low — ambient / background materials */
  'low',
] as const;

/** Type-safe union of material priorities. */
export type MaterialPriority = (typeof MATERIAL_PRIORITIES)[number];

// ── Material Profile ──────────────────────────────────────

/**
 * Quality-adapted material settings.
 *
 * Derived from the active quality preset. Determines maximum texture
 * resolution, shader complexity, feature availability, and memory budget.
 */
export interface MaterialQualityProfile {
  /** Active quality preset ('ultra' | 'high' | 'medium' | 'low' | 'minimal'). */
  readonly preset: QualityPreset;
  /** Maximum texture resolution in pixels (longest edge). */
  readonly maxTextureSize: number;
  /** Whether normal maps are enabled. */
  readonly normalMapsEnabled: boolean;
  /** Whether roughness / PBR metallic-roughness workflow is enabled. */
  readonly pbrEnabled: boolean;
  /** Whether clearcoat is enabled. */
  readonly clearcoatEnabled: boolean;
  /** Whether transmission / glass is enabled. */
  readonly transmissionEnabled: boolean;
  /** Whether subsurface scattering is enabled. */
  readonly subsurfaceEnabled: boolean;
  /** Whether anisotropy is enabled. */
  readonly anisotropyEnabled: boolean;
  /** Maximum simultaneous material swaps per frame. */
  readonly maxSwapsPerFrame: number;
  /** Whether texture compression is used. */
  readonly compressionEnabled: boolean;
}

// ── Material Constraints ──────────────────────────────────

/**
 * Boundary constraints for material configuration.
 *
 * Prevents material property values from exceeding valid ranges.
 * Future phases will use these constraints to clamp material animations.
 */
export interface MaterialConstraints {
  /** Maximum number of active materials simultaneously. */
  readonly maxActiveMaterials: number;
  /** Maximum total texture memory in megabytes. */
  readonly maxTextureMemoryMB: number;
  /** Maximum texture resolution (longest edge in pixels). */
  readonly maxTextureResolution: number;
  /** Maximum shader complexity level (0–100). */
  readonly maxShaderComplexity: number;
}

// ── Material Metadata ─────────────────────────────────────

/**
 * Human-readable metadata for a material definition.
 *
 * Used for debug output, documentation, and future material UI overlays.
 */
export interface MaterialMetadata {
  /** Unique material identifier. */
  readonly id: string;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description of this material's purpose. */
  readonly description: string;
  /** Material category. */
  readonly category: MaterialCategory;
  /** Material surface finish. */
  readonly surface: MaterialSurface;
}

// ── Future Shader Module (Placeholder) ────────────────────

/**
 * Future shader module interface.
 *
 * Placeholder for Phase 6.7+ when actual shader modules
 * (vertex, fragment, compute) are defined.
 */
export interface MaterialShaderModuleConfig {
  /** Module type identifier (reserved for future use). */
  readonly type: string;
  /** Whether the module is enabled. */
  readonly enabled: boolean;
  /** Module-specific settings (reserved). */
  readonly settings: Readonly<Record<string, unknown>>;
}

// ── Options (Consumer Input) ──────────────────────────────

/**
 * Consumer-facing options for registering a material preset.
 *
 * All fields except `id` are optional — sensible defaults come from
 * the material constants and the active quality preset.
 */
export interface MaterialPresetOptions {
  /** Unique preset identifier. */
  readonly id: MaterialPreset;
  /** Human-readable label. */
  readonly label?: string;
  /** Brief description of this preset. */
  readonly description?: string;
  /** Material category. */
  readonly category?: MaterialCategory;
  /** Material surface finish. */
  readonly surface?: MaterialSurface;
  /** Material priority level. */
  readonly priority?: MaterialPriority;
  /** Material group. */
  readonly group?: MaterialGroup;
  /** Whether the preset is initially enabled. */
  readonly enabled?: boolean;
}

// ── Definition (Resolved) ─────────────────────────────────

/**
 * Complete internal definition of a material preset.
 *
 * Derived from {@link MaterialPresetOptions} with all defaults resolved.
 * Immutable — the manager replaces this on re-registration.
 */
export interface MaterialPresetDefinition {
  /** Unique preset identifier. */
  readonly id: MaterialPresetId;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description. */
  readonly description: string;
  /** Material category. */
  readonly category: MaterialCategory;
  /** Material surface finish. */
  readonly surface: MaterialSurface;
  /** Material priority level. */
  readonly priority: MaterialPriority;
  /** Material group. */
  readonly group: MaterialGroup;
  /** Whether the preset is enabled. */
  readonly enabled: boolean;
}

// ── State (Runtime) ───────────────────────────────────────

/**
 * Runtime state for a single material preset.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface MaterialPresetState {
  /** Preset identifier. */
  readonly id: MaterialPresetId;
  /** Current active status. */
  readonly enabled: boolean;
  /** Whether this preset is the currently active one. */
  readonly isActive: boolean;
  /** Whether this preset has been registered. */
  readonly isRegistered: boolean;
  /** Current lifecycle state. */
  readonly lifecycle: MaterialLifecycleState;
}

// ── Category State ────────────────────────────────────────

/**
 * Runtime state for a single material category.
 *
 * Tracks the number of presets registered in each category.
 */
export interface MaterialCategoryState {
  /** Category identifier. */
  readonly id: MaterialCategoryId;
  /** Whether the category is enabled. */
  readonly enabled: boolean;
  /** Number of presets registered in this category. */
  readonly presetCount: number;
}

// ── Group State ───────────────────────────────────────────

/**
 * Runtime state for a single material group.
 *
 * Tracks the number of presets registered in each group.
 */
export interface MaterialGroupState {
  /** Group identifier. */
  readonly id: MaterialGroupId;
  /** Whether the group is enabled. */
  readonly enabled: boolean;
  /** Number of presets registered in this group. */
  readonly presetCount: number;
}

// ── Snapshot ──────────────────────────────────────────────

/**
 * The complete immutable snapshot of material state.
 *
 * This is the single source of truth consumed by all material hooks.
 * The manager replaces this object wholesale on every change so that
 * `Object.is` reference checks detect updates cheaply.
 */
export interface MaterialSnapshot {
  /** Preset runtime state, keyed by preset ID. */
  readonly presets: ReadonlyMap<MaterialPresetId, MaterialPresetState>;
  /** Category runtime state, keyed by category ID. */
  readonly categories: ReadonlyMap<MaterialCategoryId, MaterialCategoryState>;
  /** Group runtime state, keyed by group ID. */
  readonly groups: ReadonlyMap<MaterialGroupId, MaterialGroupState>;
  /** The currently active preset ID. */
  readonly activePresetId: MaterialPresetId | null;
  /** Quality-adapted material settings. */
  readonly qualityProfile: MaterialQualityProfile;
  /** Material constraints. */
  readonly constraints: MaterialConstraints;
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

// ── Registry ──────────────────────────────────────────────

/**
 * Read-only query interface over the materials registries.
 *
 * Mirrors the scene/camera/lighting registry pattern — pure lookups, no mutation.
 */
export interface MaterialRegistry {
  /** Get a preset's runtime state by ID. */
  readonly getPreset: (id: MaterialPresetId) => MaterialPresetState | undefined;
  /** Get a category's runtime state by ID. */
  readonly getCategory: (id: MaterialCategoryId) => MaterialCategoryState | undefined;
  /** Get a group's runtime state by ID. */
  readonly getGroup: (id: MaterialGroupId) => MaterialGroupState | undefined;
  /** All registered preset IDs. */
  readonly getPresetIds: () => readonly MaterialPresetId[];
  /** All registered category IDs. */
  readonly getCategoryIds: () => readonly MaterialCategoryId[];
  /** All registered group IDs. */
  readonly getGroupIds: () => readonly MaterialGroupId[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: MaterialPresetId) => boolean;
  /** Whether a category is registered. */
  readonly hasCategory: (id: MaterialCategoryId) => boolean;
  /** Whether a group is registered. */
  readonly hasGroup: (id: MaterialGroupId) => boolean;
  /** Total registered preset count. */
  readonly presetCount: () => number;
  /** Total registered category count. */
  readonly categoryCount: () => number;
  /** Total registered group count. */
  readonly groupCount: () => number;
  /** Get all enabled presets. */
  readonly getEnabledPresets: () => readonly MaterialPresetId[];
  /** Get all enabled categories. */
  readonly getEnabledCategories: () => readonly MaterialCategoryId[];
  /** Get all enabled groups. */
  readonly getEnabledGroups: () => readonly MaterialGroupId[];
}

// ── Subscription Types ────────────────────────────────────

/** Selector that extracts a slice of the material snapshot. */
export type MaterialSelector<T> = (snapshot: MaterialSnapshot) => T;

/** Equality comparator for a selected material value. */
export type MaterialEquality<T> = (a: T, b: T) => boolean;

/** Subscriber callback fired on relevant material state changes. */
export type MaterialCallback = () => void;

/** Unsubscribe handle returned by subscription methods. */
export type MaterialUnsubscribe = () => void;

// ── Manager ───────────────────────────────────────────────

/**
 * The singleton materials manager interface.
 *
 * This is the single owner of all material state. All hooks and future
 * consumers read from this instance. It contains no React.
 */
export interface MaterialsManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => MaterialSnapshot;
  /** Subscribe to all material state changes. */
  readonly subscribe: (callback: MaterialCallback) => MaterialUnsubscribe;
  /** Subscribe to a specific slice of material state. */
  readonly subscribeSelector: <T>(
    selector: MaterialSelector<T>,
    callback: MaterialCallback,
    equalityFn?: MaterialEquality<T>,
  ) => MaterialUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — registers default categories, groups, and presets. */
  readonly init: () => void;
  /** Destroy the manager — clears everything, resets state. */
  readonly destroy: () => void;

  /* ── Preset management ── */
  /** Register a material preset (idempotent by ID). */
  readonly registerPreset: (options: MaterialPresetOptions) => void;
  /** Unregister a material preset. */
  readonly unregisterPreset: (id: MaterialPresetId) => void;
  /** Get a preset definition by ID. */
  readonly getPresetDefinition: (id: MaterialPresetId) => MaterialPresetDefinition | undefined;
  /** Get all preset definitions. */
  readonly getAllPresetDefinitions: () => readonly MaterialPresetDefinition[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: MaterialPresetId) => boolean;
  /** Set the active preset. */
  readonly setActivePreset: (id: MaterialPresetId | null) => void;

  /* ── Category management ── */
  /** Register a material category (idempotent by ID). */
  readonly registerCategory: (id: MaterialCategoryId, enabled?: boolean) => void;
  /** Unregister a material category. */
  readonly unregisterCategory: (id: MaterialCategoryId) => void;
  /** Whether a category is registered. */
  readonly hasCategory: (id: MaterialCategoryId) => boolean;

  /* ── Group management ── */
  /** Register a material group (idempotent by ID). */
  readonly registerGroup: (id: MaterialGroupId, enabled?: boolean) => void;
  /** Unregister a material group. */
  readonly unregisterGroup: (id: MaterialGroupId) => void;
  /** Whether a group is registered. */
  readonly hasGroup: (id: MaterialGroupId) => boolean;

  /* ── Quality / Reduced Motion ── */
  /** Update the quality preset (called when ThreeContext quality changes). */
  readonly setQualityPreset: (preset: QualityPreset) => void;
  /** Update reduced-motion state (called when ThreeContext changes). */
  readonly setReducedMotion: (reduced: boolean) => void;

  /* ── Query ── */
  /** Get the read-only registry query interface. */
  readonly getRegistry: () => MaterialRegistry;
}
