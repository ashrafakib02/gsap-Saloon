/**
 * Camera Types — Core Type System for Camera Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module defines the complete type system for the camera layer —
 * the infrastructure that manages perspective, presets, modes, targets,
 * constraints, and viewport adaptation. It stores metadata and orchestrates
 * camera STATE only; it never renders or moves the camera.
 *
 * Architecture:
 *   CameraOptions (consumer input) → CameraDefinition (resolved)
 *   → CameraState (runtime) → CameraSnapshot (immutable)
 *   → CameraManager (registration + lifecycle)
 *   → CameraRegistry (read-only queries)
 *
 * Consumers (future): Cinematic transitions (Phase 6.8+), Scroll camera,
 * Interactive controls, Post-processing.
 *
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import type { QualityPreset } from './three.types';

// ── Camera Mode ──────────────────────────────────────────

/**
 * Operational modes the camera can be in.
 *
 * Each mode determines how the camera position and orientation are controlled.
 * Only one mode is active at any time. Mode transitions are managed by the
 * camera manager — future animation systems (GSAP, scroll) will set modes.
 */
export const CAMERA_MODES = [
  /** Camera does not move — static composition */
  'static',
  /** Camera driven by narrative section transitions */
  'narrative',
  /** Camera position linked to scroll progress */
  'scroll',
  /** Camera follows cinematic keyframe sequences */
  'cinematic',
  /** Camera responds to pointer/touch input */
  'interactive',
  /** Camera position set directly by the consumer */
  'manual',
  /** Debug mode — shows camera helpers, axes, frustum */
  'debug',
] as const;

/** Type-safe union of camera modes. */
export type CameraMode = (typeof CAMERA_MODES)[number];

// ── Camera Preset ────────────────────────────────────────

/**
 * Semantic presets that define camera configuration for specific use cases.
 *
 * Each preset bundles viewport settings, FOV, clipping planes, controls,
 * and quality adaptation. Presets are immutable configuration objects —
 * they never change at runtime.
 */
export const CAMERA_PRESETS = [
  /** Hero scene — dramatic wide-angle composition */
  'hero',
  /** Intro / entrance — gentle welcoming perspective */
  'intro',
  /** Narrative sections — standard documentary-style camera */
  'narrative',
  /** Services showcase — medium shot, product-focused */
  'services',
  /** Gallery — close-up, detail-oriented framing */
  'gallery',
  /** Transformation before/after — dramatic reveal angle */
  'transformation',
  /** Booking overlay — stable, accessible perspective */
  'booking',
  /** Footer — distant, ambient wide shot */
  'footer',
  /** Mobile-optimized preset — reduced FOV, simplified settings */
  'mobile',
  /** Reduced motion preset — no camera movement allowed */
  'reduced-motion',
  /** Performance preset — minimum GPU budget, simplified rendering */
  'performance',
] as const;

/** Type-safe union of camera presets. */
export type CameraPreset = (typeof CAMERA_PRESETS)[number];

// ── Camera Preset ID ─────────────────────────────────────

/**
 * Type-safe camera preset identifier.
 *
 * This is a distinct alias of {@link CameraPreset} used for Map keys
 * in the camera registry. It ensures preset IDs are treated as keys,
 * not arbitrary strings.
 */
export type CameraPresetId = CameraPreset;

// ── Camera Target ────────────────────────────────────────

/**
 * Semantic target points that the camera can focus on.
 *
 * Targets represent focal points in the 3D scene. The camera's lookAt
 * direction is derived from the active target's position. Targets are
 * registered as placeholders — actual 3D coordinates are set in later phases.
 */
export const CAMERA_TARGETS = [
  /** Hero section focal point */
  'hero',
  /** Center of the 3D scene */
  'scene-center',
  /** Character / person in the scene */
  'character',
  /** Product / service display */
  'product',
  /** Booking interface overlay */
  'booking',
  /** UI element in 3D space */
  'ui',
  /** Development / debug target */
  'debug',
] as const;

/** Type-safe union of camera targets. */
export type CameraTarget = (typeof CAMERA_TARGETS)[number];

// ── Camera Viewport ──────────────────────────────────────

/**
 * Viewport dimensions for camera calculation.
 *
 * Used to derive viewport-aware camera settings (FOV, aspect ratio,
 * position offsets). Updated when the viewport changes.
 */
export interface CameraViewport {
  /** Viewport width in CSS pixels. */
  readonly width: number;
  /** Viewport height in CSS pixels. */
  readonly height: number;
  /** Device pixel ratio. */
  readonly pixelRatio: number;
  /** Viewport breakpoint ('wide' | 'desktop' | 'tablet' | 'mobile'). */
  readonly breakpoint: 'wide' | 'desktop' | 'tablet' | 'mobile';
}

// ── Camera Quality Profile ───────────────────────────────

/**
 * Quality-adapted camera settings.
 *
 * Derived from the active quality preset. Determines FOV limits,
 * clipping planes, shadow distance, and feature availability.
 */
export interface CameraQualityProfile {
  /** Active quality preset ('ultra' | 'high' | 'medium' | 'low' | 'minimal'). */
  readonly preset: QualityPreset;
  /** Maximum allowed field of view in degrees. */
  readonly maxFov: number;
  /** Maximum shadow rendering distance. */
  readonly maxShadowDistance: number;
  /** Whether camera effects (depth of field, bloom) are enabled. */
  readonly effectsEnabled: boolean;
  /** Whether camera shake / procedural movement is allowed. */
  readonly proceduralEnabled: boolean;
  /** Whether camera orbit / free-look is allowed. */
  readonly orbitEnabled: boolean;
}

// ── Camera Constraints ───────────────────────────────────

/**
 * Boundary constraints for camera position and orientation.
 *
 * Prevents the camera from moving beyond defined limits. Future phases
 * will use these constraints to clamp camera animations and interactions.
 */
export interface CameraConstraints {
  /** Minimum position bounds (x, y, z). */
  readonly minPosition: readonly [number, number, number];
  /** Maximum position bounds (x, y, z). */
  readonly maxPosition: readonly [number, number, number];
  /** Minimum field of view in degrees. */
  readonly minFov: number;
  /** Maximum field of view in degrees. */
  readonly maxFov: number;
  /** Minimum camera distance from lookAt target. */
  readonly minDistance: number;
  /** Maximum camera distance from lookAt target. */
  readonly maxDistance: number;
}

// ── Camera Metadata ──────────────────────────────────────

/**
 * Human-readable metadata for a camera definition.
 *
 * Used for debug output, documentation, and future camera UI overlays.
 */
export interface CameraMetadata {
  /** Unique camera identifier. */
  readonly id: string;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description of this camera's purpose. */
  readonly description: string;
}

// ── Future Camera Controller (Placeholder) ───────────────

/**
 * Future camera controller interface.
 *
 * Placeholder for Phase 6.8+ when actual camera controllers
 * (orbit, fly, cinematic, scroll-linked) are implemented.
 */
export interface CameraControllerConfig {
  /** Controller type identifier (reserved for future use). */
  readonly type: string;
  /** Whether the controller is enabled. */
  readonly enabled: boolean;
  /** Controller-specific settings (reserved). */
  readonly settings: Readonly<Record<string, unknown>>;
}

// ── Future Camera Timeline (Placeholder) ─────────────────

/**
 * Future camera timeline interface.
 *
 * Placeholder for Phase 6.8+ when camera keyframe sequences
 * are defined and executed.
 */
export interface CameraTimelineConfig {
  /** Timeline identifier (reserved for future use). */
  readonly id: string;
  /** Whether the timeline is enabled. */
  readonly enabled: boolean;
  /** Duration in seconds (reserved). */
  readonly duration: number;
}

// ── Options (Consumer Input) ─────────────────────────────

/**
 * Consumer-facing options for registering a camera preset.
 *
 * All fields except `id` are optional — sensible defaults come from
 * the camera constants and the active quality preset.
 */
export interface CameraPresetOptions {
  /** Unique preset identifier. */
  readonly id: CameraPreset;
  /** Human-readable label. */
  readonly label?: string;
  /** Brief description of this preset. */
  readonly description?: string;
  /** Default field of view in degrees. */
  readonly fov?: number;
  /** Near clipping plane distance. */
  readonly near?: number;
  /** Far clipping plane distance. */
  readonly far?: number;
  /** Default camera position [x, y, z]. */
  readonly position?: readonly [number, number, number];
  /** Default camera lookAt point [x, y, z]. */
  readonly target?: readonly [number, number, number];
  /** Initial camera mode. */
  readonly mode?: CameraMode;
  /** Whether orbit controls are allowed. */
  readonly orbitEnabled?: boolean;
  /** Whether procedural movement is allowed. */
  readonly proceduralEnabled?: boolean;
  /** Whether the preset is initially enabled. */
  readonly enabled?: boolean;
}

// ── Definition (Resolved) ────────────────────────────────

/**
 * Complete internal definition of a camera preset.
 *
 * Derived from {@link CameraPresetOptions} with all defaults resolved.
 * Immutable — the manager replaces this on re-registration.
 */
export interface CameraPresetDefinition {
  /** Unique preset identifier. */
  readonly id: CameraPresetId;
  /** Human-readable label. */
  readonly label: string;
  /** Brief description. */
  readonly description: string;
  /** Default field of view in degrees. */
  readonly fov: number;
  /** Near clipping plane distance. */
  readonly near: number;
  /** Far clipping plane distance. */
  readonly far: number;
  /** Default camera position [x, y, z]. */
  readonly position: readonly [number, number, number];
  /** Default camera lookAt point [x, y, z]. */
  readonly target: readonly [number, number, number];
  /** Initial camera mode. */
  readonly mode: CameraMode;
  /** Whether orbit controls are allowed. */
  readonly orbitEnabled: boolean;
  /** Whether procedural movement is allowed. */
  readonly proceduralEnabled: boolean;
  /** Whether the preset is enabled. */
  readonly enabled: boolean;
}

// ── State (Runtime) ─────────────────────────────────────

/**
 * Runtime state for a single camera preset.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface CameraPresetState {
  /** Preset identifier. */
  readonly id: CameraPresetId;
  /** Current active status. */
  readonly enabled: boolean;
  /** Whether this preset is the currently active one. */
  readonly isActive: boolean;
  /** Whether this preset has been registered. */
  readonly isRegistered: boolean;
}

// ── Target Options ───────────────────────────────────────

/**
 * Consumer-facing options for registering a camera target.
 */
export interface CameraTargetOptions {
  /** Unique target identifier. */
  readonly id: CameraTarget;
  /** Human-readable label. */
  readonly label?: string;
  /** 3D position [x, y, z]. */
  readonly position?: readonly [number, number, number];
  /** Target offset from position [x, y, z]. */
  readonly offset?: readonly [number, number, number];
  /** Whether the target is initially enabled. */
  readonly enabled?: boolean;
}

// ── Target Definition ────────────────────────────────────

/**
 * Complete internal definition of a camera target.
 */
export interface CameraTargetDefinition {
  /** Unique target identifier. */
  readonly id: CameraTarget;
  /** Human-readable label. */
  readonly label: string;
  /** 3D position [x, y, z]. */
  readonly position: readonly [number, number, number];
  /** Target offset from position [x, number, number]. */
  readonly offset: readonly [number, number, number];
  /** Whether the target is enabled. */
  readonly enabled: boolean;
}

// ── Target State ─────────────────────────────────────────

/**
 * Runtime state for a single camera target.
 */
export interface CameraTargetState {
  /** Target identifier. */
  readonly id: CameraTarget;
  /** Whether the target is enabled. */
  readonly enabled: boolean;
  /** Whether this target is the currently active one. */
  readonly isActive: boolean;
  /** Whether this target has been registered. */
  readonly isRegistered: boolean;
}

// ── Snapshot ─────────────────────────────────────────────

/**
 * The complete immutable snapshot of camera state.
 *
 * This is the single source of truth consumed by all camera hooks.
 * The manager replaces this object wholesale on every change so that
 * `Object.is` reference checks detect updates cheaply.
 */
export interface CameraSnapshot {
  /** Preset runtime state, keyed by preset ID. */
  readonly presets: ReadonlyMap<CameraPresetId, CameraPresetState>;
  /** Target runtime state, keyed by target ID. */
  readonly targets: ReadonlyMap<CameraTarget, CameraTargetState>;
  /** The currently active preset ID. */
  readonly activePresetId: CameraPresetId | null;
  /** The currently active target ID. */
  readonly activeTargetId: CameraTarget | null;
  /** The current camera mode. */
  readonly mode: CameraMode;
  /** Current camera position [x, y, z]. */
  readonly position: readonly [number, number, number];
  /** Current camera lookAt target [x, y, z]. */
  readonly lookAt: readonly [number, number, number];
  /** Current field of view in degrees. */
  readonly fov: number;
  /** Current near clipping plane. */
  readonly near: number;
  /** Current far clipping plane. */
  readonly far: number;
  /** Current viewport dimensions. */
  readonly viewport: CameraViewport;
  /** Quality-adapted camera settings. */
  readonly qualityProfile: CameraQualityProfile;
  /** Position and orientation constraints. */
  readonly constraints: CameraConstraints;
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
  /** Active quality preset (mirrors ThreeContext). */
  readonly qualityPreset: QualityPreset;
  /** Total registered preset count. */
  readonly presetCount: number;
  /** Total registered target count. */
  readonly targetCount: number;
  /** Monotonic revision counter — increments on every change. */
  readonly revision: number;
  /** Timestamp of the last snapshot update. */
  readonly timestamp: number;
}

// ── Registry ─────────────────────────────────────────────

/**
 * Read-only query interface over the camera registries.
 *
 * Mirrors the scene registry pattern — pure lookups, no mutation.
 */
export interface CameraRegistry {
  /** Get a preset's runtime state by ID. */
  readonly getPreset: (id: CameraPresetId) => CameraPresetState | undefined;
  /** Get a target's runtime state by ID. */
  readonly getTarget: (id: CameraTarget) => CameraTargetState | undefined;
  /** All registered preset IDs. */
  readonly getPresetIds: () => readonly CameraPresetId[];
  /** All registered target IDs. */
  readonly getTargetIds: () => readonly CameraTarget[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: CameraPresetId) => boolean;
  /** Whether a target is registered. */
  readonly hasTarget: (id: CameraTarget) => boolean;
  /** Total registered preset count. */
  readonly presetCount: () => number;
  /** Total registered target count. */
  readonly targetCount: () => number;
  /** Get all enabled presets. */
  readonly getEnabledPresets: () => readonly CameraPresetId[];
  /** Get all enabled targets. */
  readonly getEnabledTargets: () => readonly CameraTarget[];
}

// ── Subscription Types ───────────────────────────────────

/** Selector that extracts a slice of the camera snapshot. */
export type CameraSelector<T> = (snapshot: CameraSnapshot) => T;

/** Equality comparator for a selected camera value. */
export type CameraEquality<T> = (a: T, b: T) => boolean;

/** Subscriber callback fired on relevant camera state changes. */
export type CameraCallback = () => void;

/** Unsubscribe handle returned by subscription methods. */
export type CameraUnsubscribe = () => void;

// ── Manager ──────────────────────────────────────────────

/**
 * The singleton camera manager interface.
 *
 * This is the single owner of all camera state. All hooks and future
 * consumers read from this instance. It contains no React.
 */
export interface CameraManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => CameraSnapshot;
  /** Subscribe to all camera state changes. */
  readonly subscribe: (callback: CameraCallback) => CameraUnsubscribe;
  /** Subscribe to a specific slice of camera state. */
  readonly subscribeSelector: <T>(
    selector: CameraSelector<T>,
    callback: CameraCallback,
    equalityFn?: CameraEquality<T>,
  ) => CameraUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — registers all presets and targets. */
  readonly init: () => void;
  /** Destroy the manager — clears everything, resets state. */
  readonly destroy: () => void;

  /* ── Preset management ── */
  /** Register a camera preset (idempotent by ID). */
  readonly registerPreset: (options: CameraPresetOptions) => void;
  /** Unregister a camera preset. */
  readonly unregisterPreset: (id: CameraPresetId) => void;
  /** Get a preset definition by ID. */
  readonly getPresetDefinition: (id: CameraPresetId) => CameraPresetDefinition | undefined;
  /** Get all preset definitions. */
  readonly getAllPresetDefinitions: () => readonly CameraPresetDefinition[];
  /** Whether a preset is registered. */
  readonly hasPreset: (id: CameraPresetId) => boolean;
  /** Set the active preset. */
  readonly setActivePreset: (id: CameraPresetId | null) => void;

  /* ── Target management ── */
  /** Register a camera target (idempotent by ID). */
  readonly registerTarget: (options: CameraTargetOptions) => void;
  /** Unregister a camera target. */
  readonly unregisterTarget: (id: CameraTarget) => void;
  /** Get a target definition by ID. */
  readonly getTargetDefinition: (id: CameraTarget) => CameraTargetDefinition | undefined;
  /** Get all target definitions. */
  readonly getAllTargetDefinitions: () => readonly CameraTargetDefinition[];
  /** Whether a target is registered. */
  readonly hasTarget: (id: CameraTarget) => boolean;
  /** Set the active target. */
  readonly setActiveTarget: (id: CameraTarget | null) => void;

  /* ── State mutation ── */
  /** Set the camera mode. */
  readonly setMode: (mode: CameraMode) => void;
  /** Set the camera position [x, y, z]. */
  readonly setPosition: (position: readonly [number, number, number]) => void;
  /** Set the camera lookAt target [x, y, z]. */
  readonly setLookAt: (lookAt: readonly [number, number, number]) => void;
  /** Set the field of view in degrees. */
  readonly setFov: (fov: number) => void;
  /** Set the near clipping plane. */
  readonly setNear: (near: number) => void;
  /** Set the far clipping plane. */
  readonly setFar: (far: number) => void;

  /* ── Viewport / Quality ── */
  /** Update the viewport dimensions. */
  readonly setViewport: (viewport: CameraViewport) => void;
  /** Update the quality preset (called when ThreeContext quality changes). */
  readonly setQualityPreset: (preset: QualityPreset) => void;
  /** Update reduced-motion state (called when ThreeContext changes). */
  readonly setReducedMotion: (reduced: boolean) => void;

  /* ── Query ── */
  /** Get the read-only registry query interface. */
  readonly getRegistry: () => CameraRegistry;
}
