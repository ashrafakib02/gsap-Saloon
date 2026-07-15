/**
 * Three Constants — Quality Presets, Device Tiers, and Budget Defaults
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 *
 * This module declares the static tables that the rendering engine derives
 * from: the five quality presets and their budgets, the device-tier → preset
 * mapping, the default renderer configuration, and the default performance
 * snapshot. All values are frozen — nothing here mutates at runtime.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import {
  ACESFilmicToneMapping,
  NoToneMapping,
  SRGBColorSpace,
  PCFSoftShadowMap,
  PCFShadowMap,
} from 'three';

import type {
  QualityPreset,
  DeviceTier,
  FrameBudget,
  ResourceBudget,
  PixelRatioStrategy,
  QualitySettings,
  RendererConfig,
  ShadowConfig,
  WebGPUCompatibilityMeta,
  DeviceCapabilities,
  ThreePerformanceSnapshot,
  FrameloopMode,
  ThreeEventType,
} from './three.types';

import { QUALITY_PRESETS, THREE_EVENT_TYPES } from './three.types';

/* -------------------------------------------------------------------------- */
/*                              Storage & Flags                               */
/* -------------------------------------------------------------------------- */

/** localStorage key used to persist a manual quality-preset override. */
export const THREE_QUALITY_STORAGE_KEY = 'sovereign-three-quality' as const;

/** The feature flag that gates the entire 3D layer. */
export const THREE_FEATURE_FLAG = 'hero_3d' as const;

/* -------------------------------------------------------------------------- */
/*                             Preset Descriptions                            */
/* -------------------------------------------------------------------------- */

/** Human-readable descriptions for each quality preset (debug / dev tools). */
export const QUALITY_PRESET_DESCRIPTIONS: Record<QualityPreset, string> = {
  ultra: 'Flagship desktop — full effect budget, all post-processing',
  high: 'High-end desktop / laptop — most effects, tuned shadows',
  medium: 'Mainstream desktop / high-end tablet — balanced budget',
  low: 'Low-power laptop / mainstream tablet — reduced effects',
  minimal: 'Mobile / incapable hardware — minimal geometry, no post',
};

/** Human-readable descriptions for each device tier. */
export const DEVICE_TIER_DESCRIPTIONS: Record<DeviceTier, string> = {
  'desktop-high': 'Desktop-class hardware with abundant resources',
  'desktop-standard': 'Standard desktop / laptop',
  tablet: 'Capable tablet or high-end mobile',
  mobile: 'Mainstream mobile',
  'low-end': 'Low-memory / low-core hardware',
  unknown: 'Capability could not be determined',
};

/* -------------------------------------------------------------------------- */
/*                             Frame Budgets                                  */
/* -------------------------------------------------------------------------- */

/**
 * Build a {@link FrameBudget} from a target FPS.
 *
 * `renderBudgetMs` reserves ~60% of the frame for GPU submission, leaving
 * headroom for scroll, layout, and application logic (DESIGN_SYSTEM §14:
 * "Motion serves content").
 */
function frameBudget(targetFps: number): FrameBudget {
  const frameBudgetMs = 1000 / targetFps;
  return Object.freeze({
    targetFps,
    frameBudgetMs,
    renderBudgetMs: Math.round(frameBudgetMs * 0.6 * 100) / 100,
  });
}

/* -------------------------------------------------------------------------- */
/*                          Per-Preset Resource Budgets                       */
/* -------------------------------------------------------------------------- */

/** GPU-resource ceilings per quality preset. */
export const RESOURCE_BUDGETS: Record<QualityPreset, ResourceBudget> = {
  ultra: Object.freeze({
    maxTextures: 64,
    maxTextureSize: 4096,
    maxTriangles: 2_000_000,
    maxDrawCalls: 300,
    maxShadowCasters: 4,
    maxPostProcessingPasses: 6,
    maxParticles: 20_000,
  }),
  high: Object.freeze({
    maxTextures: 48,
    maxTextureSize: 2048,
    maxTriangles: 1_000_000,
    maxDrawCalls: 200,
    maxShadowCasters: 3,
    maxPostProcessingPasses: 4,
    maxParticles: 10_000,
  }),
  medium: Object.freeze({
    maxTextures: 32,
    maxTextureSize: 2048,
    maxTriangles: 500_000,
    maxDrawCalls: 150,
    maxShadowCasters: 2,
    maxPostProcessingPasses: 2,
    maxParticles: 4_000,
  }),
  low: Object.freeze({
    maxTextures: 16,
    maxTextureSize: 1024,
    maxTriangles: 200_000,
    maxDrawCalls: 80,
    maxShadowCasters: 1,
    maxPostProcessingPasses: 1,
    maxParticles: 1_000,
  }),
  minimal: Object.freeze({
    maxTextures: 8,
    maxTextureSize: 512,
    maxTriangles: 50_000,
    maxDrawCalls: 40,
    maxShadowCasters: 0,
    maxPostProcessingPasses: 0,
    maxParticles: 200,
  }),
};

/* -------------------------------------------------------------------------- */
/*                         Per-Preset Pixel-Ratio Strategy                    */
/* -------------------------------------------------------------------------- */

/** Device-pixel-ratio strategy per quality preset. */
export const PIXEL_RATIO_STRATEGIES: Record<QualityPreset, PixelRatioStrategy> = {
  ultra: Object.freeze({ min: 1, max: 2, clampToDevice: true }),
  high: Object.freeze({ min: 1, max: 2, clampToDevice: true }),
  medium: Object.freeze({ min: 1, max: 1.5, clampToDevice: true }),
  low: Object.freeze({ min: 1, max: 1.25, clampToDevice: true }),
  minimal: Object.freeze({ min: 1, max: 1, clampToDevice: false }),
};

/* -------------------------------------------------------------------------- */
/*                            Quality Settings Table                          */
/* -------------------------------------------------------------------------- */

/**
 * The fully-resolved {@link QualitySettings} for each preset.
 *
 * `derived` is `true` here because the table represents the auto-derived
 * baseline; the config layer flips it to `false` when a preset is set
 * explicitly.
 */
export const QUALITY_SETTINGS: Record<QualityPreset, QualitySettings> = {
  ultra: Object.freeze({
    preset: 'ultra',
    derived: true,
    frame: frameBudget(60),
    resources: RESOURCE_BUDGETS.ultra,
    pixelRatio: PIXEL_RATIO_STRATEGIES.ultra,
    shadowsEnabled: true,
    antialiasEnabled: true,
    postProcessingEnabled: true,
    frameloop: 'demand',
  }),
  high: Object.freeze({
    preset: 'high',
    derived: true,
    frame: frameBudget(60),
    resources: RESOURCE_BUDGETS.high,
    pixelRatio: PIXEL_RATIO_STRATEGIES.high,
    shadowsEnabled: true,
    antialiasEnabled: true,
    postProcessingEnabled: true,
    frameloop: 'demand',
  }),
  medium: Object.freeze({
    preset: 'medium',
    derived: true,
    frame: frameBudget(60),
    resources: RESOURCE_BUDGETS.medium,
    pixelRatio: PIXEL_RATIO_STRATEGIES.medium,
    shadowsEnabled: true,
    antialiasEnabled: true,
    postProcessingEnabled: false,
    frameloop: 'demand',
  }),
  low: Object.freeze({
    preset: 'low',
    derived: true,
    frame: frameBudget(30),
    resources: RESOURCE_BUDGETS.low,
    pixelRatio: PIXEL_RATIO_STRATEGIES.low,
    shadowsEnabled: false,
    antialiasEnabled: false,
    postProcessingEnabled: false,
    frameloop: 'demand',
  }),
  minimal: Object.freeze({
    preset: 'minimal',
    derived: true,
    frame: frameBudget(30),
    resources: RESOURCE_BUDGETS.minimal,
    pixelRatio: PIXEL_RATIO_STRATEGIES.minimal,
    shadowsEnabled: false,
    antialiasEnabled: false,
    postProcessingEnabled: false,
    frameloop: 'demand',
  }),
};

/* -------------------------------------------------------------------------- */
/*                        Device Tier → Default Preset                        */
/* -------------------------------------------------------------------------- */

/** Default quality preset for each device tier. */
export const TIER_DEFAULT_QUALITY: Record<DeviceTier, QualityPreset> = {
  'desktop-high': 'ultra',
  'desktop-standard': 'high',
  tablet: 'medium',
  mobile: 'low',
  'low-end': 'minimal',
  unknown: 'medium',
};

/**
 * Ordinal ranking of quality presets, highest → lowest.
 * Lower index = higher fidelity. Used to clamp / compare presets.
 */
export const QUALITY_PRESET_ORDER: Record<QualityPreset, number> =
  QUALITY_PRESETS.reduce(
    (acc, preset, index) => {
      acc[preset] = index;
      return acc;
    },
    {} as Record<QualityPreset, number>,
  );

/* -------------------------------------------------------------------------- */
/*                             Shadow Defaults                                */
/* -------------------------------------------------------------------------- */

/** Default shadow configuration (used when a preset permits shadows). */
export const DEFAULT_SHADOW_CONFIG: ShadowConfig = Object.freeze({
  enabled: true,
  type: PCFSoftShadowMap,
  autoUpdate: true,
  mapSize: 1024,
});

/** Shadow configuration used when a preset disables shadows. */
export const DISABLED_SHADOW_CONFIG: ShadowConfig = Object.freeze({
  enabled: false,
  type: PCFShadowMap,
  autoUpdate: false,
  mapSize: 512,
});

/* -------------------------------------------------------------------------- */
/*                          WebGPU Compatibility Meta                         */
/* -------------------------------------------------------------------------- */

/**
 * Forward-looking WebGPU metadata. Phase 6.1 always renders via WebGL;
 * `available` is filled at probe time. `preferWhenAvailable` stays `false`
 * until a later phase opts in.
 */
export const DEFAULT_WEBGPU_META: WebGPUCompatibilityMeta = Object.freeze({
  available: false,
  preferWhenAvailable: false,
  activeBackend: 'webgl',
});

/* -------------------------------------------------------------------------- */
/*                          Default Renderer Config                           */
/* -------------------------------------------------------------------------- */

/**
 * The baseline renderer configuration.
 *
 * Warm, editorial color reproduction (DESIGN_SYSTEM §16): sRGB output with
 * ACES Filmic tone mapping and a neutral exposure. The renderer layer clones
 * and tunes this per quality preset — it is never mutated in place.
 */
export const DEFAULT_RENDERER_CONFIG: RendererConfig = Object.freeze({
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 1,
  powerPreference: 'high-performance',
  antialias: true,
  alpha: true,
  stencil: false,
  depth: true,
  logarithmicDepthBuffer: false,
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false,
  shadows: DEFAULT_SHADOW_CONFIG,
  pixelRatio: PIXEL_RATIO_STRATEGIES.high,
  webgpu: DEFAULT_WEBGPU_META,
});

/**
 * Renderer configuration used for the "flat" / no-tone-mapping fallback path
 * (minimal preset). Alpha channel on, tone mapping disabled to save cost.
 */
export const MINIMAL_RENDERER_CONFIG: RendererConfig = Object.freeze({
  ...DEFAULT_RENDERER_CONFIG,
  toneMapping: NoToneMapping,
  antialias: false,
  powerPreference: 'low-power',
  shadows: DISABLED_SHADOW_CONFIG,
  pixelRatio: PIXEL_RATIO_STRATEGIES.minimal,
});

/* -------------------------------------------------------------------------- */
/*                          Default Device Capabilities                       */
/* -------------------------------------------------------------------------- */

/**
 * SSR-safe default capability probe.
 *
 * Represents an environment where nothing could be measured (server render or
 * probe failure). `tier` / `gpu` are `'unknown'`; WebGL is assumed absent
 * until a real probe proves otherwise.
 */
export const DEFAULT_DEVICE_CAPABILITIES: DeviceCapabilities = Object.freeze({
  supportsWebGL: false,
  supportsWebGL2: false,
  gpu: 'unknown',
  tier: 'unknown',
  hardwareConcurrency: null,
  deviceMemory: null,
  pixelRatio: 1,
  isTouch: false,
  hasFinePointer: false,
  isMobileViewport: false,
  isSlowConnection: false,
  screenMaxEdge: null,
  maxTextureSize: null,
  rendererName: null,
});

/* -------------------------------------------------------------------------- */
/*                        Default Performance Snapshot                        */
/* -------------------------------------------------------------------------- */

/** The default frameloop mode before any quality is derived. */
export const DEFAULT_FRAMELOOP: FrameloopMode = 'demand';

/**
 * The uninitialized performance snapshot.
 *
 * Returned by the performance manager before `init()` and after `destroy()`.
 * `canRender3D` is `false` — 3D is opt-in only once capability is confirmed.
 */
export const DEFAULT_PERFORMANCE_SNAPSHOT: ThreePerformanceSnapshot = Object.freeze({
  capabilities: DEFAULT_DEVICE_CAPABILITIES,
  deviceTier: 'unknown',
  gpu: 'unknown',
  estimatedQuality: 'medium',
  adaptiveDpr: [1, 1] as const,
  frame: QUALITY_SETTINGS.medium.frame,
  resources: RESOURCE_BUDGETS.medium,
  canRender3D: false,
  revision: 0,
  timestamp: 0,
});

/* -------------------------------------------------------------------------- */
/*                           Event Type Descriptions                          */
/* -------------------------------------------------------------------------- */

/** Human-readable descriptions for each Three event category. */
export const THREE_EVENT_DESCRIPTIONS: Record<ThreeEventType, string> = {
  pointer: 'Pointer move / down / up over the canvas',
  wheel: 'Wheel / trackpad scroll delta',
  gesture: 'Multi-touch pinch / rotate gesture',
  keyboard: 'Keyboard input while the canvas is focused',
  touch: 'Raw touch points',
  raycast: 'Raycast query against scene objects',
  select: 'Object selection change',
  hover: 'Object hover change',
  focus: 'Object focus change',
};

/** Frozen tuple of every event type, re-exported for iteration. */
export const ALL_THREE_EVENT_TYPES: readonly ThreeEventType[] = THREE_EVENT_TYPES;
