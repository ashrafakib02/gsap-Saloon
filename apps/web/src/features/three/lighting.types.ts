/**
 * Lighting Types — Core Type System for Lighting Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module defines the complete type system for the lighting layer —
 * the infrastructure that manages light presets, environments, quality
 * adaptation, and reduced-motion adaptation. It stores metadata and
 * orchestrates lighting STATE only; it never instantiates lights.
 *
 * Architecture:
 *   LightingPresetOptions (consumer input) → LightingPresetDefinition (resolved)
 *   → LightingPresetState (runtime) → LightingSnapshot (immutable)
 *   → LightingManager (registration + lifecycle)
 *   → LightingRegistry (read-only queries)
 *
 * Consumers (future): Scene materials, environment maps, post-processing,
 * cinematic sequences, scroll-linked lighting.
 *
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import type { QualityPreset } from './three.types';

// ── Lighting Preset ──────────────────────────────────────

/**
 * Semantic presets that define lighting configuration for specific use cases.
 *
 * Each preset bundles intensity, color temperature, ambient levels, shadow
 * settings, and quality adaptation. Presets are immutable configuration
 * objects — they never change at runtime.
 */
export const LIGHTING_PRESETS = [
  /** Hero scene — dramatic warm key light, strong shadows */
  'hero',
  /** Intro / entrance — soft ambient fill */
  'intro',
  /** Narrative sections — balanced documentary lighting */
  'narrative',
  /** Services showcase — clean, focused product lighting */
  'services',
  /** Gallery — gallery-style track lighting simulation */
  'gallery',
  /** Transformation before/after — dramatic reveal lighting */
  'transformation',
  /** Booking overlay — stable, accessible ambient */
  'booking',
  /** Footer — distant ambient wash */
  'footer',
  /** Night mode — low-key, cool-toned ambient */
  'night',
  /** Mobile-optimized — simplified, low-cost lighting */
  'mobile',
  /** Reduced motion preset — minimal, static lighting */
  'reduced-motion',
  /** Performance preset — single ambient, no shadows */
  'performance',
] as const;

/** Type-safe union of lighting presets. */
export type LightingPreset = (typeof LIGHTING_PRESETS)[number];

// ── Lighting Preset ID ───────────────────────────────────

/**
 * Type-safe lighting preset identifier.
 *
 * This is a distinct alias of {@link LightingPreset} used for Map keys
 * in the lighting registry. It ensures preset IDs are treated as keys,
 * not arbitrary strings.
 */
export type LightingPresetId = LightingPreset;

// ── Lighting Layer ───────────────────────────────────────

/**
 * Future light type categories.
 *
 * Each layer represents a category of light that may be instantiated
 * in a future phase. Only metadata is stored here — no Three.js light
 * objects are created.
 */
export const LIGHTING_LAYERS = [
  /** Ambient light — global base illumination */
  'ambient',
  /** Directional light — sun-like parallel rays */
  'directional',
  /** Hemisphere light — sky/ground color blend */
  'hemisphere',
  /** Spot light — cone-shaped focused beam */
  'spot',
  /** Point light — omnidirectional radial */
  'point',
  /** Rect-area light — soft rectangular emission */
  'rect-area',
  /** Environment light — IBL / HDRI based */
  'environment',
  /** Rim light — edge highlight for separation */
  'rim',
  /** Fill light — secondary illumination for shadows */
  'fill',
  /** Key light — primary subject illumination */
  'key',
  /** Back light — silhouette / halo definition */
  'back',
] as const;

/** Type-safe union of lighting layers. */
export type LightingLayer = (typeof LIGHTING_LAYERS)[number];

// ── Lighting Layer ID ────────────────────────────────────

/**
 * Type-safe lighting layer identifier for Map keys.
 */
export type LightingLayerId = LightingLayer;

// ── Lighting Environment ─────────────────────────────────

/**
 * Semantic lighting environments.
 *
 * Each environment defines a complete ambient configuration — color
 * temperature, intensity balance, mood, and atmospheric qualities.
 * Environments are the "mood" of the lighting; presets control the
 * "configuration."
 */
export const LIGHTING_ENVIRONMENTS = [
  /** Studio — clean, neutral, balanced */
  'studio',
  /** Golden hour — warm directional, long shadows */
  'golden-hour',
  /** Interior — warm ambient, soft directional */
  'interior',
  /** Gallery — track lighting, high contrast */
  'gallery',
  /** Spa — cool ambient, soft fill, calming */
  'spa',
  /** Night — low-key, cool tones, minimal */
  'night',
  /** Neutral — flat, no mood, debug baseline */
  'neutral',
  /** Debug — visualization helpers enabled */
  'debug',
] as const;

/** Type-safe union of lighting environments. */
export type LightingEnvironment = (typeof LIGHTING_ENVIRONMENTS)[number];

// ── Lighting Profile ─────────────────────────────────────

/**
 * Quality-adapted lighting settings.
 *
 * Derived from the active quality preset. Determines maximum light
 * count, shadow quality, shadow map size, and feature availability.
 */
export interface LightingQualityProfile {
  /** Active quality preset ('ultra' | 'high' | 'medium' | 'low' | 'minimal'). */
  readonly preset: QualityPreset;
  /** Maximum number of lights allowed simultaneously. */
  readonly maxLights: number;
  /** Whether shadow rendering is enabled. */
  readonly shadowsEnabled: boolean;
  /** Shadow map resolution (0 = disabled). */
  readonly shadowMapSize: number;
  /** Whether environment maps / IBL are enabled. */
  readonly environmentEnabled: boolean;
  /** Whether dynamic lighting changes are allowed. */
  readonly dynamicEnabled: boolean;
  /** Whether bloom / post-lighting effects are allowed. */
  readonly effectsEnabled: boolean;
}

// ── Lighting Constraints ─────────────────────────────────

/**
 * Boundary constraints for lighting configuration.
 *
 * Prevents light intensity and color values from exceeding valid ranges.
 * Future phases will use these constraints to clamp lighting animations.
 */
export interface LightingConstraints {
  /** Minimum global light intensity multiplier. */
  readonly minIntensity: number;
  /** Maximum global light intensity multiplier. */
  readonly maxIntensity: number;
  /** Minimum color temperature in Kelvin. */
  readonly minColorTemperature: number;
  /** Maximum color temperature in Kelvin. */
  readonly maxColorTemperature: number;
  /** Maximum ambient light intensity. */
  readonly maxAmbientIntensity: number;
  /** Maximum directional light intensity. */
  readonly maxDirectionalIntensity: number;
}

// ── Lighting Metadata ────────────────────────────────────

/**
 * Human-readable metadata for a lighting definition.
 *
 * Used for debug output, documentation, and future lighting UI overlays.
 */
export interface LightingMetadata {
  /** Unique lighting identifier. */
  readonly id: string;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description of this lighting configuration's purpose. */
  readonly description: string;
}

// ── Future Lighting Controller (Placeholder) ─────────────

/**
 * Future lighting controller interface.
 *
 * Placeholder for Phase 6.8+ when actual lighting controllers
 * (scroll-linked, time-of-day, cinematic) are implemented.
 */
export interface LightingControllerConfig {
  /** Controller type identifier (reserved for future use). */
  readonly type: string;
  /** Whether the controller is enabled. */
  readonly enabled: boolean;
  /** Controller-specific settings (reserved). */
  readonly settings: Readonly<Record<string, unknown>>;
}

// ── Future Lighting Timeline (Placeholder) ───────────────

/**
 * Future lighting timeline interface.
 *
 * Placeholder for Phase 6.8+ when lighting keyframe sequences
 * are defined and executed.
 */
export interface LightingTimelineConfig {
  /** Timeline identifier (reserved for future use). */
  readonly id: string;
  /** Whether the timeline is enabled. */
  readonly enabled: boolean;
  /** Duration in seconds (reserved). */
  readonly duration: number;
}

// ── Options (Consumer Input) ─────────────────────────────

/**
 * Consumer-facing options for registering a lighting preset.
 *
 * All fields except `id` are optional — sensible defaults come from
 * the lighting constants and the active quality preset.
 */
export interface LightingPresetOptions {
  /** Unique preset identifier. */
  readonly id: LightingPreset;
  /** Human-readable label. */
  readonly label?: string;
  /** Brief description of this preset. */
  readonly description?: string;
  /** Default global intensity multiplier (0–2). */
  readonly intensity?: number;
  /** Default color temperature in Kelvin. */
  readonly colorTemperature?: number;
  /** Default ambient light intensity. */
  readonly ambientIntensity?: number;
  /** Default directional light intensity. */
  readonly directionalIntensity?: number;
  /** Default environment ID to associate. */
  readonly environment?: LightingEnvironment;
  /** Whether shadow casting is enabled for this preset. */
  readonly shadowsEnabled?: boolean;
  /** Whether the preset is initially enabled. */
  readonly enabled?: boolean;
}

// ── Definition (Resolved) ────────────────────────────────

/**
 * Complete internal definition of a lighting preset.
 *
 * Derived from {@link LightingPresetOptions} with all defaults resolved.
 * Immutable — the manager replaces this on re-registration.
 */
export interface LightingPresetDefinition {
  /** Unique preset identifier. */
  readonly id: LightingPresetId;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description. */
  readonly description: string;
  /** Default global intensity multiplier (0–2). */
  readonly intensity: number;
  /** Default color temperature in Kelvin. */
  readonly colorTemperature: number;
  /** Default ambient light intensity. */
  readonly ambientIntensity: number;
  /** Default directional light intensity. */
  readonly directionalIntensity: number;
  /** Default environment ID. */
  readonly environment: LightingEnvironment;
  /** Whether shadow casting is enabled. */
  readonly shadowsEnabled: boolean;
  /** Whether the preset is enabled. */
  readonly enabled: boolean;
}

// ── State (Runtime) ─────────────────────────────────────

/**
 * Runtime state for a single lighting preset.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface LightingPresetState {
  /** Preset identifier. */
  readonly id: LightingPresetId;
  /** Current active status. */
  readonly enabled: boolean;
  /** Whether this preset is the currently active one. */
  readonly isActive: boolean;
  /** Whether this preset has been registered. */
  readonly isRegistered: boolean;
}

// ── Layer State ──────────────────────────────────────────

/**
 * Runtime state for a single lighting layer.
 *
 * Tracks the number of lights registered in each layer.
 */
export interface LightingLayerState {
  /** Layer identifier. */
  readonly id: LightingLayerId;
  /** Whether the layer is enabled. */
  readonly enabled: boolean;
  /** Number of lights registered in this layer. */
  readonly lightCount: number;
}

// ── Snapshot ─────────────────────────────────────────────

/**
 * The complete immutable snapshot of lighting state.
 *
 * This is the single source of truth consumed by all lighting hooks.
 * The manager replaces this object wholesale on every change so that
 * `Object.is` reference checks detect updates cheaply.
 */
export interface LightingSnapshot {
  /** Preset runtime state, keyed by preset ID. */
  readonly presets: ReadonlyMap<LightingPresetId, LightingPresetState>;
  /** Layer runtime state, keyed by layer ID. */
  readonly layers: ReadonlyMap<LightingLayerId, LightingLayerState>;
  /** The currently active preset ID. */
  readonly activePresetId: LightingPresetId | null;
  /** The currently active environment. */
  readonly activeEnvironment: LightingEnvironment | null;
  /** Current global intensity multiplier. */
  readonly intensity: number;
  /** Current color temperature in Kelvin. */
  readonly colorTemperature: number;
  /** Current ambient light intensity. */
  readonly ambientIntensity: number;
  /** Current directional light intensity. */
  readonly directionalIntensity: number;
  /** Whether shadows are enabled. */
  readonly shadowsEnabled: boolean;
  /** Quality-adapted lighting settings. */
  readonly qualityProfile: LightingQualityProfile;
  /** Lighting constraints. */
  readonly constraints: LightingConstraints;
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
  /** Active quality preset (mirrors ThreeContext). */
  readonly qualityPreset: QualityPreset;
  /** Total registered preset count. */
  readonly presetCount: number;
  /** Total registered layer count. */
  readonly layerCount: number;
  /** Monotonic revision counter — increments on every change. */
  readonly revision: number;
  /** Timestamp of the last snapshot update. */
  readonly timestamp: number;
}

// ── Registry ─────────────────────────────────────────────

/**
 * Read-only query interface over the lighting registries.
 *
 * Mirrors the scene registry pattern — pure lookups, no mutation.
 */
export interface LightingRegistry {
  /** Get a preset's runtime state by ID. */
  readonly getPreset: (id: LightingPresetId) => LightingPresetState | undefined;
  /** Get a layer's runtime state by ID. */
  readonly getLayer: (id: LightingLayerId) => LightingLayerState | undefined;
  /** All registered preset IDs. */
  readonly getPresetIds: () => readonly LightingPresetId[];
  /** All registered layer IDs. */
  readonly getLayerIds: () => readonly LightingLayerId[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: LightingPresetId) => boolean;
  /** Whether a layer is registered. */
  readonly hasLayer: (id: LightingLayerId) => boolean;
  /** Total registered preset count. */
  readonly presetCount: () => number;
  /** Total registered layer count. */
  readonly layerCount: () => number;
  /** Get all enabled presets. */
  readonly getEnabledPresets: () => readonly LightingPresetId[];
  /** Get all enabled layers. */
  readonly getEnabledLayers: () => readonly LightingLayerId[];
}

// ── Subscription Types ───────────────────────────────────

/** Selector that extracts a slice of the lighting snapshot. */
export type LightingSelector<T> = (snapshot: LightingSnapshot) => T;

/** Equality comparator for a selected lighting value. */
export type LightingEquality<T> = (a: T, b: T) => boolean;

/** Subscriber callback fired on relevant lighting state changes. */
export type LightingCallback = () => void;

/** Unsubscribe handle returned by subscription methods. */
export type LightingUnsubscribe = () => void;

// ── Manager ──────────────────────────────────────────────

/**
 * The singleton lighting manager interface.
 *
 * This is the single owner of all lighting state. All hooks and future
 * consumers read from this instance. It contains no React.
 */
export interface LightingManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => LightingSnapshot;
  /** Subscribe to all lighting state changes. */
  readonly subscribe: (callback: LightingCallback) => LightingUnsubscribe;
  /** Subscribe to a specific slice of lighting state. */
  readonly subscribeSelector: <T>(
    selector: LightingSelector<T>,
    callback: LightingCallback,
    equalityFn?: LightingEquality<T>,
  ) => LightingUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — registers default layers and presets. */
  readonly init: () => void;
  /** Destroy the manager — clears everything, resets state. */
  readonly destroy: () => void;

  /* ── Preset management ── */
  /** Register a lighting preset (idempotent by ID). */
  readonly registerPreset: (options: LightingPresetOptions) => void;
  /** Unregister a lighting preset. */
  readonly unregisterPreset: (id: LightingPresetId) => void;
  /** Get a preset definition by ID. */
  readonly getPresetDefinition: (id: LightingPresetId) => LightingPresetDefinition | undefined;
  /** Get all preset definitions. */
  readonly getAllPresetDefinitions: () => readonly LightingPresetDefinition[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: LightingPresetId) => boolean;
  /** Set the active preset. */
  readonly setActivePreset: (id: LightingPresetId | null) => void;

  /* ── Environment ── */
  /** Set the active lighting environment. */
  readonly setEnvironment: (environment: LightingEnvironment | null) => void;

  /* ── State mutation ── */
  /** Set the global intensity multiplier. */
  readonly setIntensity: (intensity: number) => void;
  /** Set the color temperature in Kelvin. */
  readonly setColorTemperature: (temperature: number) => void;
  /** Set the ambient light intensity. */
  readonly setAmbientIntensity: (intensity: number) => void;
  /** Set the directional light intensity. */
  readonly setDirectionalIntensity: (intensity: number) => void;
  /** Enable or disable shadow casting. */
  readonly setShadowsEnabled: (enabled: boolean) => void;

  /* ── Quality / Reduced Motion ── */
  /** Update the quality preset (called when ThreeContext quality changes). */
  readonly setQualityPreset: (preset: QualityPreset) => void;
  /** Update reduced-motion state (called when ThreeContext changes). */
  readonly setReducedMotion: (reduced: boolean) => void;

  /* ── Query ── */
  /** Get the read-only registry query interface. */
  readonly getRegistry: () => LightingRegistry;
}
