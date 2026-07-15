/**
 * Three Types — Core Type System for the React Three Fiber Infrastructure
 *
 * From TECHNICAL_ARCHITECTURE §9 (3D Experience):
 * "The 3D layer is progressive enhancement. It must degrade gracefully on
 *  every axis — WebGL support, device capability, reduced motion, and
 *  viewport — without ever blocking the core experience."
 *
 * This module defines the complete, strict type system for the rendering
 * engine established in Phase 6.1. It is infrastructure only — it describes
 * renderer configuration, device capability, performance budgets, quality
 * presets, the event architecture, and the future registration surface that
 * Phases 6.2–6.10 build on.
 *
 * Architecture:
 *   DeviceCapabilities (immutable probe) → QualityPreset (derived tier)
 *   → RendererConfig (centralized GL config) → ThreePerformanceSnapshot
 *   (immutable budgets) → ThreeContextValue (React surface)
 *
 * Consumers (future): Scene, Camera, Lighting, Materials, Environment,
 * Asset Loading, Particles, Post Processing, Interactions.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only, no scene objects.
 */

import type { ReactNode } from 'react';
import type { ColorSpace, ToneMapping, ShadowMapType } from 'three';
import type { Dpr } from '@react-three/fiber';

/**
 * GPU power-preference hint. Mirrors the DOM `WebGLContextAttributes`
 * `powerPreference` union — declared locally because three types
 * `powerPreference` as a loose `string` and the global lib type is not
 * re-exported from the `three` package.
 */
export type ThreePowerPreference = 'default' | 'high-performance' | 'low-power';

// ── Quality Presets ─────────────────────────────────────────

/**
 * The five discrete quality presets.
 *
 * Presets are derived automatically from device capability but may be
 * overridden by the consumer. Ordered highest → lowest fidelity.
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 */
export const QUALITY_PRESETS = [
  /** Flagship desktop — full effect budget, all post-processing */
  'ultra',
  /** High-end desktop / laptop — most effects, tuned shadows */
  'high',
  /** Mainstream desktop / high-end tablet — balanced budget */
  'medium',
  /** Low-power laptop / mainstream tablet — reduced effects */
  'low',
  /** Mobile / incapable hardware — minimal geometry, no post */
  'minimal',
] as const;

/** Type-safe union of quality presets. */
export type QualityPreset = (typeof QUALITY_PRESETS)[number];

// ── Device Tier ─────────────────────────────────────────────

/**
 * Coarse device performance classification.
 *
 * Derived from hardware concurrency, device memory, touch capability,
 * viewport, and pixel ratio. Maps loosely to a default {@link QualityPreset}.
 */
export const DEVICE_TIERS = [
  /** Desktop-class hardware with abundant resources */
  'desktop-high',
  /** Standard desktop / laptop */
  'desktop-standard',
  /** Capable tablet or high-end mobile */
  'tablet',
  /** Mainstream mobile */
  'mobile',
  /** Low-memory / low-core hardware */
  'low-end',
  /** Capability could not be determined (SSR or probe failure) */
  'unknown',
] as const;

/** Type-safe union of device tiers. */
export type DeviceTier = (typeof DEVICE_TIERS)[number];

// ── GPU Capability ──────────────────────────────────────────

/**
 * Estimated GPU capability class.
 *
 * Derived from WebGL support, the WebGL context's `MAX_TEXTURE_SIZE`, and
 * the unmasked renderer string when the `WEBGL_debug_renderer_info`
 * extension is available. Never blocks — falls back to `'unknown'`.
 */
export const GPU_CAPABILITIES = [
  /** Discrete / high-throughput GPU */
  'high',
  /** Integrated / mid-range GPU */
  'medium',
  /** Low-throughput / software GPU */
  'low',
  /** No WebGL context available */
  'none',
  /** Capability could not be determined */
  'unknown',
] as const;

/** Type-safe union of GPU capability classes. */
export type GpuCapability = (typeof GPU_CAPABILITIES)[number];

// ── Frameloop Mode ──────────────────────────────────────────

/**
 * R3F render-loop mode.
 *
 * - `always`  — render every animation frame (continuous scenes)
 * - `demand`  — render only on state change or explicit invalidate
 * - `never`   — the consumer drives rendering manually
 *
 * From TECHNICAL_ARCHITECTURE §9.5:
 * "Prefer on-demand rendering. Continuous rendering is reserved for scenes
 *  that are genuinely always in motion."
 */
export type FrameloopMode = 'always' | 'demand' | 'never';

// ── Device Capabilities ─────────────────────────────────────

/**
 * An immutable snapshot of the device's rendering capabilities.
 *
 * Probed once (SSR-safe) and treated as a frozen value. Every quality and
 * performance decision derives from this — nothing recomputes capability
 * independently.
 */
export interface DeviceCapabilities {
  /** Whether a WebGL context can be created at all. */
  readonly supportsWebGL: boolean;
  /** Whether a WebGL2 context can be created. */
  readonly supportsWebGL2: boolean;
  /** Estimated GPU capability class. */
  readonly gpu: GpuCapability;
  /** Coarse device performance tier. */
  readonly tier: DeviceTier;
  /** Reported logical CPU cores (`navigator.hardwareConcurrency`), or `null`. */
  readonly hardwareConcurrency: number | null;
  /** Reported device memory in GB (`navigator.deviceMemory`), or `null`. */
  readonly deviceMemory: number | null;
  /** Device pixel ratio (`window.devicePixelRatio`), clamped to ≥ 1. */
  readonly pixelRatio: number;
  /** Whether the device exposes touch input. */
  readonly isTouch: boolean;
  /** Whether the device has a fine pointer (mouse / trackpad). */
  readonly hasFinePointer: boolean;
  /** Whether the viewport width is below the tablet breakpoint. */
  readonly isMobileViewport: boolean;
  /** Whether the network connection is classified as slow (2G/slow-2G). */
  readonly isSlowConnection: boolean;
  /** Longest edge of the physical screen in CSS pixels, or `null`. */
  readonly screenMaxEdge: number | null;
  /** Maximum WebGL texture size reported by the context, or `null`. */
  readonly maxTextureSize: number | null;
  /** Unmasked GPU renderer string when available, else `null`. */
  readonly rendererName: string | null;
}

// ── Pixel Ratio Strategy ────────────────────────────────────

/**
 * Declarative device-pixel-ratio strategy.
 *
 * The renderer never reads `window.devicePixelRatio` inline. It resolves a
 * clamped `[min, max]` range from this strategy so quality presets can tune
 * sharpness against fill-rate cost.
 */
export interface PixelRatioStrategy {
  /** Lower DPR bound — never render below this. */
  readonly min: number;
  /** Upper DPR bound — never render above this, regardless of the display. */
  readonly max: number;
  /**
   * When `true`, clamp the device's real DPR into `[min, max]`.
   * When `false`, use `max` as a fixed ratio (cheaper, less sharp).
   */
  readonly clampToDevice: boolean;
}

// ── Shadow Configuration ────────────────────────────────────

/**
 * Centralized shadow-map defaults.
 *
 * No scene creates shadows inline — lighting choreography (Phase 6.4)
 * consumes these defaults.
 */
export interface ShadowConfig {
  /** Whether the shadow map is enabled at the renderer level. */
  readonly enabled: boolean;
  /** three.js shadow-map algorithm. */
  readonly type: ShadowMapType;
  /** Whether the shadow map auto-updates every frame. */
  readonly autoUpdate: boolean;
  /** Default shadow-map resolution (square, in texels) for future lights. */
  readonly mapSize: number;
}

// ── WebGPU Compatibility Metadata ───────────────────────────

/**
 * Forward-looking WebGPU compatibility metadata.
 *
 * Phase 6.1 renders exclusively via WebGL. This metadata records whether the
 * environment *could* target WebGPU later, so the renderer layer can migrate
 * without a rewrite. It never changes runtime behaviour today.
 */
export interface WebGPUCompatibilityMeta {
  /** Whether `navigator.gpu` is present in this environment. */
  readonly available: boolean;
  /** Whether the infrastructure is allowed to prefer WebGPU when available. */
  readonly preferWhenAvailable: boolean;
  /** The backend actually in use for this phase. */
  readonly activeBackend: 'webgl';
}

// ── Renderer Configuration ──────────────────────────────────

/**
 * The complete, centralized renderer configuration.
 *
 * This is the single source of truth for WebGL renderer setup. The Canvas
 * never configures the renderer inline — it consumes a resolved
 * {@link RendererConfig} derived from the active quality preset.
 */
export interface RendererConfig {
  /** Output color space (sRGB for correct display gamma). */
  readonly outputColorSpace: ColorSpace;
  /** Tone-mapping operator applied to HDR output. */
  readonly toneMapping: ToneMapping;
  /** Tone-mapping exposure multiplier. */
  readonly toneMappingExposure: number;
  /** GPU power-preference hint passed to `getContext`. */
  readonly powerPreference: ThreePowerPreference;
  /** Whether MSAA antialiasing is requested at context creation. */
  readonly antialias: boolean;
  /** Whether the drawing buffer has an alpha channel (transparent canvas). */
  readonly alpha: boolean;
  /** Whether a stencil buffer is allocated. */
  readonly stencil: boolean;
  /** Whether a depth buffer is allocated. */
  readonly depth: boolean;
  /** Whether a logarithmic depth buffer is used (large depth ranges). */
  readonly logarithmicDepthBuffer: boolean;
  /** Whether the drawing buffer is preserved between frames (screenshots). */
  readonly preserveDrawingBuffer: boolean;
  /** Whether to fail context creation on low-performance adapters. */
  readonly failIfMajorPerformanceCaveat: boolean;
  /** Shadow-map defaults. */
  readonly shadows: ShadowConfig;
  /** Device-pixel-ratio strategy. */
  readonly pixelRatio: PixelRatioStrategy;
  /** Forward-looking WebGPU metadata. */
  readonly webgpu: WebGPUCompatibilityMeta;
}

// ── Performance Budgets ─────────────────────────────────────

/**
 * Per-frame timing budget in milliseconds.
 *
 * `frameBudgetMs` is the target frame time (e.g. 16.67 for 60fps);
 * `renderBudgetMs` is the slice of that frame reserved for GPU submission,
 * leaving headroom for scroll, layout, and application logic.
 */
export interface FrameBudget {
  /** Target FPS the budget is derived from. */
  readonly targetFps: number;
  /** Total frame budget in milliseconds (1000 / targetFps). */
  readonly frameBudgetMs: number;
  /** Milliseconds within the frame reserved for rendering. */
  readonly renderBudgetMs: number;
}

/**
 * GPU-resource budgets for a quality preset.
 *
 * These are ceilings the future scene / asset / post-processing systems must
 * respect. Phase 6.1 only declares them — it enforces nothing yet.
 */
export interface ResourceBudget {
  /** Maximum simultaneous textures. */
  readonly maxTextures: number;
  /** Maximum texture edge size in texels. */
  readonly maxTextureSize: number;
  /** Maximum total scene triangle count. */
  readonly maxTriangles: number;
  /** Maximum simultaneous draw calls per frame. */
  readonly maxDrawCalls: number;
  /** Maximum shadow-casting lights. */
  readonly maxShadowCasters: number;
  /** Maximum active post-processing passes. */
  readonly maxPostProcessingPasses: number;
  /** Maximum particle count. */
  readonly maxParticles: number;
}

// ── Quality Settings ────────────────────────────────────────

/**
 * The fully-resolved quality configuration for the active preset.
 *
 * Bundles the preset label with the budgets and toggles derived from it.
 * Immutable — a change of preset produces a new object.
 */
export interface QualitySettings {
  /** The active preset. */
  readonly preset: QualityPreset;
  /** Whether the preset was auto-derived (`true`) or explicitly set (`false`). */
  readonly derived: boolean;
  /** Per-frame timing budget. */
  readonly frame: FrameBudget;
  /** GPU-resource budgets. */
  readonly resources: ResourceBudget;
  /** Device-pixel-ratio strategy for this preset. */
  readonly pixelRatio: PixelRatioStrategy;
  /** Whether shadows are permitted at this preset. */
  readonly shadowsEnabled: boolean;
  /** Whether antialiasing is permitted at this preset. */
  readonly antialiasEnabled: boolean;
  /** Whether post-processing is permitted at this preset. */
  readonly postProcessingEnabled: boolean;
  /** The frameloop mode recommended for this preset. */
  readonly frameloop: FrameloopMode;
}

// ── Performance Snapshot ────────────────────────────────────

/**
 * An immutable snapshot of the performance layer.
 *
 * Produced by the performance manager and consumed via hooks. Bundles the
 * probed capability, derived tier / GPU class, the estimated quality preset,
 * and the resolved budgets. Frozen — never mutated in place.
 */
export interface ThreePerformanceSnapshot {
  /** Probed device capability. */
  readonly capabilities: DeviceCapabilities;
  /** Coarse device tier (mirrors `capabilities.tier`). */
  readonly deviceTier: DeviceTier;
  /** Estimated GPU class (mirrors `capabilities.gpu`). */
  readonly gpu: GpuCapability;
  /** The quality preset estimated from capability. */
  readonly estimatedQuality: QualityPreset;
  /** Resolved DPR range `[min, max]` for the estimated quality. */
  readonly adaptiveDpr: readonly [number, number];
  /** Per-frame timing budget for the estimated quality. */
  readonly frame: FrameBudget;
  /** GPU-resource budgets for the estimated quality. */
  readonly resources: ResourceBudget;
  /** Whether the device can render 3D at all (WebGL + not slow + capable). */
  readonly canRender3D: boolean;
  /** Monotonic revision counter — increments on every rebuild. */
  readonly revision: number;
  /** `performance.now()` timestamp of this snapshot. */
  readonly timestamp: number;
}

/** Read-only selector over a performance snapshot. */
export type ThreePerformanceSelector<T> = (
  snapshot: ThreePerformanceSnapshot,
) => T;

/** Equality comparator for selected performance slices. */
export type ThreePerformanceEquality<T> = (a: T, b: T) => boolean;

/** Callback invoked when the performance snapshot changes. */
export type ThreePerformanceCallback = () => void;

/** Unsubscribe function returned by performance subscriptions. */
export type ThreePerformanceUnsubscribe = () => void;

/**
 * The performance manager singleton contract.
 *
 * Owns the probed capability and derived budgets, exposes immutable
 * snapshots, and notifies subscribers when a re-probe changes the snapshot.
 */
export interface ThreePerformanceManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => ThreePerformanceSnapshot;
  /** Subscribe to all snapshot changes. */
  readonly subscribe: (
    callback: ThreePerformanceCallback,
  ) => ThreePerformanceUnsubscribe;
  /** Whether the manager has probed capability. */
  readonly isInitialized: () => boolean;
  /** Probe capability and build the initial snapshot (idempotent). */
  readonly init: () => void;
  /** Re-probe capability (e.g. after a viewport change) and rebuild. */
  readonly refresh: () => void;
  /** Reset to the uninitialized default snapshot and drop subscribers. */
  readonly destroy: () => void;
}

// ── Event Architecture ──────────────────────────────────────

/**
 * The categories of interaction the event layer will route.
 *
 * Phase 6.1 establishes the architecture only — no handlers fire yet. Later
 * phases register listeners keyed by these categories.
 */
export const THREE_EVENT_TYPES = [
  'pointer',
  'wheel',
  'gesture',
  'keyboard',
  'touch',
  'raycast',
  'select',
  'hover',
  'focus',
] as const;

/** Type-safe union of Three event categories. */
export type ThreeEventType = (typeof THREE_EVENT_TYPES)[number];

/**
 * A normalized 2D coordinate used by pointer / touch / raycast payloads.
 *
 * `x`/`y` are in normalized device coordinates (-1 → 1); `clientX`/`clientY`
 * are raw CSS pixels relative to the event source element.
 */
export interface ThreePointerCoords {
  /** Normalized device X (-1 → 1). */
  readonly x: number;
  /** Normalized device Y (-1 → 1). */
  readonly y: number;
  /** Raw client X in CSS pixels. */
  readonly clientX: number;
  /** Raw client Y in CSS pixels. */
  readonly clientY: number;
}

/**
 * Payload shape for each event category.
 *
 * A discriminated map: each key resolves to the immutable payload the
 * corresponding listeners receive. Payloads are metadata-only in Phase 6.1.
 */
export interface ThreeEventPayloadMap {
  readonly pointer: { readonly coords: ThreePointerCoords; readonly buttons: number };
  readonly wheel: { readonly deltaX: number; readonly deltaY: number };
  readonly gesture: { readonly scale: number; readonly rotation: number };
  readonly keyboard: { readonly key: string; readonly code: string };
  readonly touch: { readonly coords: readonly ThreePointerCoords[] };
  readonly raycast: { readonly coords: ThreePointerCoords };
  readonly select: { readonly id: string | null };
  readonly hover: { readonly id: string | null };
  readonly focus: { readonly id: string | null };
}

/**
 * A dispatched Three event.
 *
 * @typeParam K - The event category, which narrows the payload type.
 */
export interface ThreeEvent<K extends ThreeEventType = ThreeEventType> {
  /** The event category. */
  readonly type: K;
  /** The immutable payload for this category. */
  readonly payload: ThreeEventPayloadMap[K];
  /** `performance.now()` timestamp at dispatch. */
  readonly timestamp: number;
}

/** A listener for a specific event category. */
export type ThreeEventListener<K extends ThreeEventType = ThreeEventType> = (
  event: ThreeEvent<K>,
) => void;

/** Unsubscribe function returned by event registration. */
export type ThreeEventUnsubscribe = () => void;

/**
 * The centralized event manager contract.
 *
 * A single dispatch hub for all Three interaction categories. Established in
 * Phase 6.1 with no active listeners — later phases register via `on`.
 */
export interface ThreeEventManager {
  /** Register a listener for a category. Returns an unsubscribe function. */
  readonly on: <K extends ThreeEventType>(
    type: K,
    listener: ThreeEventListener<K>,
  ) => ThreeEventUnsubscribe;
  /** Remove a previously-registered listener. */
  readonly off: <K extends ThreeEventType>(
    type: K,
    listener: ThreeEventListener<K>,
  ) => void;
  /** Dispatch an event to all listeners of its category. */
  readonly emit: <K extends ThreeEventType>(event: ThreeEvent<K>) => void;
  /** Whether any listener is registered for a category. */
  readonly hasListeners: (type: ThreeEventType) => boolean;
  /** Count of listeners registered for a category. */
  readonly listenerCount: (type: ThreeEventType) => number;
  /** Remove every listener across all categories. */
  readonly clear: () => void;
}

// ── Future Registration Surface ─────────────────────────────

/**
 * A generic registry entry for future 3D subsystems.
 *
 * Scenes, cameras, lights, and assets register here in later phases. Phase
 * 6.1 defines the shape and an empty registry so the provider exposes a
 * stable API surface today.
 *
 * @typeParam T - The registered value type.
 */
export interface ThreeRegistryEntry<T> {
  /** Stable identifier. */
  readonly id: string;
  /** The registered value. */
  readonly value: T;
}

/**
 * A minimal immutable registry contract for future subsystem registration.
 *
 * @typeParam T - The registered value type.
 */
export interface ThreeRegistry<T> {
  /** Register (or replace) an entry by id. */
  readonly register: (id: string, value: T) => void;
  /** Remove an entry by id. */
  readonly unregister: (id: string) => void;
  /** Look up an entry by id. */
  readonly get: (id: string) => T | undefined;
  /** All registered entries (snapshot array). */
  readonly getAll: () => readonly ThreeRegistryEntry<T>[];
  /** Whether an id is registered. */
  readonly has: (id: string) => boolean;
  /** Number of registered entries. */
  readonly size: () => number;
}

/**
 * The future registration slots exposed by the provider.
 *
 * All registries are empty in Phase 6.1. They give later phases a place to
 * register without changing the provider's public shape. Values are typed as
 * `unknown` deliberately — the concrete Scene / Camera / Light / Asset types
 * arrive in Phases 6.2–6.7, and narrowing happens at those call sites.
 */
export interface ThreeRegistries {
  /** Scene registration (Phase 6.2). */
  readonly scenes: ThreeRegistry<unknown>;
  /** Camera registration (Phase 6.3). */
  readonly cameras: ThreeRegistry<unknown>;
  /** Lighting registration (Phase 6.4). */
  readonly lights: ThreeRegistry<unknown>;
  /** Asset registration (Phase 6.7). */
  readonly assets: ThreeRegistry<unknown>;
}

// ── Context Value ───────────────────────────────────────────

/**
 * The value supplied by {@link ThreeProvider} through React context.
 *
 * Read-mostly and memoized: the provider only produces a new value when the
 * quality preset, enablement, or performance snapshot changes.
 */
export interface ThreeContextValue {
  /** Whether the 3D layer is enabled (flag × capability × reduced motion). */
  readonly isEnabled: boolean;
  /** Whether the current device can render 3D at all. */
  readonly canRender3D: boolean;
  /** Whether reduced motion is active (mirrored from the theme layer). */
  readonly isReducedMotion: boolean;
  /** The active, fully-resolved quality settings. */
  readonly quality: QualitySettings;
  /** The resolved renderer configuration for the active quality. */
  readonly renderer: RendererConfig;
  /** The latest immutable performance snapshot. */
  readonly performance: ThreePerformanceSnapshot;
  /** The probed device capabilities. */
  readonly capabilities: DeviceCapabilities;
  /** The centralized event manager. */
  readonly events: ThreeEventManager;
  /** Future subsystem registration slots (empty in Phase 6.1). */
  readonly registries: ThreeRegistries;
  /** Explicitly override the active quality preset (or `null` to re-derive). */
  readonly setQualityPreset: (preset: QualityPreset | null) => void;
  /** Re-probe device capability and rebuild derived state. */
  readonly refreshCapabilities: () => void;
}

// ── Canvas Props ────────────────────────────────────────────

/**
 * Props for the reusable {@link ThreeCanvas} wrapper.
 *
 * Deliberately narrow: the Canvas resolves renderer config, DPR, frameloop,
 * and event source from context and props — callers never pass raw GL
 * parameters. Additional low-level control arrives in later phases.
 */
export interface ThreeCanvasProps {
  /** Scene content. Empty in Phase 6.1. */
  readonly children?: ReactNode;
  /** Optional className applied to the canvas wrapper element. */
  readonly className?: string;
  /**
   * Frameloop override. When omitted, the active quality preset's
   * recommended mode is used.
   */
  readonly frameloop?: FrameloopMode;
  /**
   * Device-pixel-ratio override as an R3F {@link Dpr}. When omitted, the
   * active quality preset's DPR range is used.
   */
  readonly dpr?: Dpr;
  /** Accessible label for the canvas region. */
  readonly ariaLabel?: string;
  /**
   * Fallback content rendered when 3D is unavailable (no WebGL, reduced
   * motion, incapable device, or the layer is disabled).
   */
  readonly fallback?: ReactNode;
  /**
   * When `true`, render the fallback even if 3D is otherwise available.
   * Used by parents that gate 3D behind their own conditions.
   */
  readonly forceFallback?: boolean;
}
