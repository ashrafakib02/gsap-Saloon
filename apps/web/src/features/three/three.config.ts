/**
 * Three Config — Capability Probing and Quality Derivation
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Performance gate for 3D: check device memory, viewport, reduced motion,
 *  WebGL support, and connection speed before mounting a scene."
 *
 * This module contains the pure(ish) derivation logic that turns raw browser
 * signals into a {@link DeviceCapabilities} probe, a {@link DeviceTier}, a
 * {@link GpuCapability} estimate, and finally a recommended {@link QualityPreset}.
 * It performs no rendering and holds no state — the performance manager owns
 * state and calls into these functions.
 *
 * Every function is SSR-safe: with no `window`/`document`/`navigator`, it
 * returns the conservative default rather than throwing.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import {
  isTouchDevice,
  hasFinePointer,
  getPixelRatio,
  getDeviceMemory,
  isSlowConnection,
  prefersReducedMotion,
} from '@/shared/utils';

import { BREAKPOINTS } from '@/shared/tokens/breakpoints';
import { isFeatureEnabled } from '@/shared/config/feature-flags';

import {
  TIER_DEFAULT_QUALITY,
  QUALITY_SETTINGS,
  QUALITY_PRESET_ORDER,
  RESOURCE_BUDGETS,
  PIXEL_RATIO_STRATEGIES,
  DEFAULT_RENDERER_CONFIG,
  MINIMAL_RENDERER_CONFIG,
  DISABLED_SHADOW_CONFIG,
  DEFAULT_SHADOW_CONFIG,
  THREE_QUALITY_STORAGE_KEY,
  THREE_FEATURE_FLAG,
} from './three.constants';

import { QUALITY_PRESETS } from './three.types';

import type {
  DeviceCapabilities,
  DeviceTier,
  GpuCapability,
  QualityPreset,
  QualitySettings,
  RendererConfig,
} from './three.types';

/* -------------------------------------------------------------------------- */
/*                              WebGL Probing                                 */
/* -------------------------------------------------------------------------- */

/**
 * Result of a single WebGL context probe. Bundles the flags the tier / GPU
 * estimators need so the (relatively expensive) context creation happens once.
 */
interface WebGLProbe {
  readonly supportsWebGL: boolean;
  readonly supportsWebGL2: boolean;
  readonly maxTextureSize: number | null;
  readonly rendererName: string | null;
}

/**
 * Probe a WebGL context once and extract capability signals.
 *
 * Creates a throwaway canvas, reads `MAX_TEXTURE_SIZE`, and — when the
 * `WEBGL_debug_renderer_info` extension is present — the unmasked renderer
 * string. Always cleans up. Never throws.
 */
function probeWebGL(): WebGLProbe {
  if (typeof document === 'undefined') {
    return {
      supportsWebGL: false,
      supportsWebGL2: false,
      maxTextureSize: null,
      rendererName: null,
    };
  }

  try {
    const canvas = document.createElement('canvas');

    const gl2 = canvas.getContext('webgl2');
    const gl =
      gl2 ??
      ((canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null);

    if (!gl) {
      return {
        supportsWebGL: false,
        supportsWebGL2: false,
        maxTextureSize: null,
        rendererName: null,
      };
    }

    const maxTextureSize =
      (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number | undefined) ?? null;

    let rendererName: string | null = null;
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const raw = gl.getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL,
      ) as string | undefined;
      rendererName = raw ?? null;
    }

    /* Release the context promptly rather than waiting for GC. */
    const loseContext = gl.getExtension('WEBGL_lose_context');
    loseContext?.loseContext();

    return {
      supportsWebGL: true,
      supportsWebGL2: gl2 !== null,
      maxTextureSize,
      rendererName,
    };
  } catch {
    return {
      supportsWebGL: false,
      supportsWebGL2: false,
      maxTextureSize: null,
      rendererName: null,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                            GPU Classification                              */
/* -------------------------------------------------------------------------- */

/** Renderer-name substrings that reliably indicate a software / low GPU. */
const SOFTWARE_RENDERER_HINTS = [
  'swiftshader',
  'llvmpipe',
  'software',
  'microsoft basic render',
  'mesa offscreen',
] as const;

/** Renderer-name substrings that indicate integrated / mid-range GPUs. */
const INTEGRATED_RENDERER_HINTS = [
  'intel',
  'apple gpu',
  'mali',
  'adreno',
  'powervr',
  'videocore',
] as const;

/**
 * Estimate a {@link GpuCapability} class from the WebGL probe.
 *
 * Heuristic and intentionally conservative: an unknown renderer with a large
 * max-texture-size is treated as `medium`, never `high`, to avoid over-
 * committing on hardware we can't identify.
 */
function classifyGpu(probe: WebGLProbe): GpuCapability {
  if (!probe.supportsWebGL) return 'none';

  const name = probe.rendererName?.toLowerCase() ?? null;

  if (name) {
    if (SOFTWARE_RENDERER_HINTS.some((hint) => name.includes(hint))) {
      return 'low';
    }
    if (INTEGRATED_RENDERER_HINTS.some((hint) => name.includes(hint))) {
      return 'medium';
    }
    /* Known discrete-GPU vendors. */
    if (
      name.includes('nvidia') ||
      name.includes('geforce') ||
      name.includes('radeon') ||
      name.includes('amd') ||
      name.includes('rtx') ||
      name.includes('gtx')
    ) {
      return 'high';
    }
  }

  /* No renderer string — infer coarsely from WebGL2 + texture size. */
  if (probe.supportsWebGL2 && (probe.maxTextureSize ?? 0) >= 16384) {
    return 'medium';
  }
  if ((probe.maxTextureSize ?? 0) >= 8192) {
    return 'medium';
  }

  return 'unknown';
}

/* -------------------------------------------------------------------------- */
/*                            Device Tier Derivation                          */
/* -------------------------------------------------------------------------- */

/**
 * Derive a coarse {@link DeviceTier} from capability signals.
 *
 * Priority order: no WebGL / slow connection / tiny memory → `low-end`;
 * mobile viewport or touch-without-fine-pointer → `mobile`/`tablet`; then
 * desktop split by GPU class and core/memory count.
 */
function deriveTier(params: {
  readonly supportsWebGL: boolean;
  readonly gpu: GpuCapability;
  readonly hardwareConcurrency: number | null;
  readonly deviceMemory: number | null;
  readonly isMobileViewport: boolean;
  readonly isTouch: boolean;
  readonly hasFinePointer: boolean;
  readonly isSlowConnection: boolean;
}): DeviceTier {
  const {
    supportsWebGL: hasWebGL,
    gpu,
    hardwareConcurrency,
    deviceMemory,
    isMobileViewport,
    isTouch,
    hasFinePointer: finePointer,
    isSlowConnection: slow,
  } = params;

  if (!hasWebGL) return 'low-end';

  const cores = hardwareConcurrency ?? 0;
  const memory = deviceMemory ?? 0;

  /* Hard low-end gates: software GPU, tiny memory, or slow network. */
  if (gpu === 'low' || (memory > 0 && memory < 2) || slow) {
    return 'low-end';
  }

  /* Touch-first / small viewport → mobile or tablet class. */
  if (isMobileViewport) {
    return 'mobile';
  }
  if (isTouch && !finePointer) {
    /* Larger touch device with no mouse — treat as tablet. */
    return 'tablet';
  }

  /* Desktop-class. Split by GPU + resources. */
  if (gpu === 'high' && cores >= 8 && (memory === 0 || memory >= 8)) {
    return 'desktop-high';
  }
  if (gpu === 'high' || gpu === 'medium') {
    return 'desktop-standard';
  }

  /* WebGL present but GPU unknown and no strong signals. */
  if (cores >= 8 && memory >= 8) return 'desktop-standard';

  return 'unknown';
}

/* -------------------------------------------------------------------------- */
/*                          Capability Probe (public)                         */
/* -------------------------------------------------------------------------- */

/**
 * Probe the current device's rendering capabilities.
 *
 * Runs every browser signal once and returns a frozen
 * {@link DeviceCapabilities}. SSR-safe — returns an all-unknown probe when the
 * DOM is unavailable. This is the single source of capability truth; nothing
 * else calls `navigator`/WebGL directly.
 */
export function probeDeviceCapabilities(): DeviceCapabilities {
  const gl = probeWebGL();

  const hardwareConcurrency =
    typeof navigator !== 'undefined' &&
    typeof navigator.hardwareConcurrency === 'number'
      ? navigator.hardwareConcurrency
      : null;

  const deviceMemory = getDeviceMemory() ?? null;

  const isMobileViewport =
    typeof window !== 'undefined'
      ? window.innerWidth < BREAKPOINTS.tablet
      : false;

  const screenMaxEdge =
    typeof window !== 'undefined' && window.screen
      ? Math.max(window.screen.width, window.screen.height)
      : null;

  const gpu = classifyGpu(gl);
  const touch = isTouchDevice();
  const finePointer = hasFinePointer();
  const slow = isSlowConnection();

  const tier = deriveTier({
    supportsWebGL: gl.supportsWebGL,
    gpu,
    hardwareConcurrency,
    deviceMemory,
    isMobileViewport,
    isTouch: touch,
    hasFinePointer: finePointer,
    isSlowConnection: slow,
  });

  return Object.freeze({
    supportsWebGL: gl.supportsWebGL,
    supportsWebGL2: gl.supportsWebGL2,
    gpu,
    tier,
    hardwareConcurrency,
    deviceMemory,
    pixelRatio: Math.max(getPixelRatio(), 1),
    isTouch: touch,
    hasFinePointer: finePointer,
    isMobileViewport,
    isSlowConnection: slow,
    screenMaxEdge,
    maxTextureSize: gl.maxTextureSize,
    rendererName: gl.rendererName,
  });
}

/* -------------------------------------------------------------------------- */
/*                           WebGPU Availability                              */
/* -------------------------------------------------------------------------- */

/**
 * Whether `navigator.gpu` is present. Forward-looking only — Phase 6.1 always
 * renders via WebGL regardless of this value.
 */
export function isWebGPUAvailable(): boolean {
  if (typeof navigator === 'undefined') return false;
  return 'gpu' in navigator;
}

/* -------------------------------------------------------------------------- */
/*                            Quality Derivation                              */
/* -------------------------------------------------------------------------- */

/** Type guard: is a string a valid {@link QualityPreset}? */
export function isQualityPreset(value: unknown): value is QualityPreset {
  return (
    typeof value === 'string' &&
    (QUALITY_PRESETS as readonly string[]).includes(value)
  );
}

/**
 * Derive the recommended {@link QualityPreset} from a capability probe.
 *
 * Starts from the tier's default preset, then applies safety downgrades:
 * reduced-motion and no-WebGL both force `minimal`; a small texture ceiling
 * caps the preset. Never upgrades beyond the tier default.
 */
export function deriveQualityPreset(
  capabilities: DeviceCapabilities,
): QualityPreset {
  if (!capabilities.supportsWebGL) return 'minimal';
  if (prefersReducedMotion()) return 'minimal';

  let preset = TIER_DEFAULT_QUALITY[capabilities.tier];

  /* Cap by texture ceiling — a preset can't exceed what the GPU can store. */
  const maxTex = capabilities.maxTextureSize ?? 0;
  if (maxTex > 0 && maxTex < 2048) {
    preset = clampPresetDown(preset, 'low');
  }
  if (maxTex > 0 && maxTex < 1024) {
    preset = clampPresetDown(preset, 'minimal');
  }

  /* Slow connection is a hard cap regardless of GPU. */
  if (capabilities.isSlowConnection) {
    preset = clampPresetDown(preset, 'low');
  }

  return preset;
}

/**
 * Return whichever of two presets is *lower* fidelity.
 * (Higher {@link QUALITY_PRESET_ORDER} index = lower fidelity.)
 */
export function clampPresetDown(
  preset: QualityPreset,
  floor: QualityPreset,
): QualityPreset {
  return QUALITY_PRESET_ORDER[preset] >= QUALITY_PRESET_ORDER[floor]
    ? preset
    : floor;
}

/**
 * Resolve the fully-typed {@link QualitySettings} for a preset.
 *
 * @param preset  - The active preset.
 * @param derived - Whether this preset was auto-derived (`true`) or set
 *                  explicitly by the consumer (`false`).
 */
export function resolveQualitySettings(
  preset: QualityPreset,
  derived: boolean,
): QualitySettings {
  const base = QUALITY_SETTINGS[preset];
  /* `base` is frozen with `derived: true`; clone to reflect the real source. */
  return Object.freeze({ ...base, derived });
}

/* -------------------------------------------------------------------------- */
/*                          Renderer Config Resolution                        */
/* -------------------------------------------------------------------------- */

/**
 * Build the {@link RendererConfig} for a resolved quality.
 *
 * Derives from {@link DEFAULT_RENDERER_CONFIG} (or the minimal variant for the
 * lowest preset), then applies the preset's shadow, antialias, and pixel-ratio
 * decisions plus live WebGPU availability. Returns a frozen object — the
 * renderer layer never mutates it.
 */
export function resolveRendererConfig(
  quality: QualitySettings,
): RendererConfig {
  const base =
    quality.preset === 'minimal'
      ? MINIMAL_RENDERER_CONFIG
      : DEFAULT_RENDERER_CONFIG;

  return Object.freeze({
    ...base,
    antialias: quality.antialiasEnabled,
    shadows: quality.shadowsEnabled
      ? DEFAULT_SHADOW_CONFIG
      : DISABLED_SHADOW_CONFIG,
    pixelRatio: quality.pixelRatio,
    webgpu: Object.freeze({
      available: isWebGPUAvailable(),
      preferWhenAvailable: false,
      activeBackend: 'webgl' as const,
    }),
  });
}

/* -------------------------------------------------------------------------- */
/*                      Adaptive DPR Range Resolution                         */
/* -------------------------------------------------------------------------- */

/**
 * Resolve the concrete `[min, max]` DPR range for a preset against a device
 * pixel ratio.
 *
 * When the preset clamps to the device, the upper bound is the smaller of the
 * strategy max and the real DPR (never render sharper than the display).
 * Otherwise the strategy `max` is used as a fixed ratio.
 */
export function resolveAdaptiveDpr(
  preset: QualityPreset,
  devicePixelRatio: number,
): readonly [number, number] {
  const strategy = PIXEL_RATIO_STRATEGIES[preset];
  const safeDpr = Math.max(devicePixelRatio, 1);

  if (!strategy.clampToDevice) {
    return [strategy.max, strategy.max] as const;
  }

  const upper = Math.min(strategy.max, safeDpr);
  const lower = Math.min(strategy.min, upper);
  return [lower, upper] as const;
}

/* -------------------------------------------------------------------------- */
/*                        3D Enablement Decision                              */
/* -------------------------------------------------------------------------- */

/**
 * Whether a device *can* render 3D at all, independent of the feature flag.
 *
 * Requires WebGL, a non-slow connection, and a tier better than `low-end`.
 * Reduced motion does NOT gate rendering here — it downgrades quality (to
 * `minimal`) rather than disabling the canvas, so the enablement decision
 * stays orthogonal. The provider combines this with the flag and reduced
 * motion to decide what actually mounts.
 */
export function canRender3D(capabilities: DeviceCapabilities): boolean {
  if (!capabilities.supportsWebGL) return false;
  if (capabilities.isSlowConnection) return false;
  if (capabilities.tier === 'low-end') return false;
  return true;
}

/**
 * Whether the 3D feature flag is enabled.
 *
 * Thin wrapper over the shared feature-flag system so the Three layer has a
 * single, named gate ({@link THREE_FEATURE_FLAG}).
 */
export function isThreeFlagEnabled(): boolean {
  return isFeatureEnabled(THREE_FEATURE_FLAG);
}

/* -------------------------------------------------------------------------- */
/*                        Persisted Quality Override                          */
/* -------------------------------------------------------------------------- */

/**
 * Read a persisted manual quality override from localStorage.
 * Returns `null` when nothing is stored, the value is invalid, or storage is
 * unavailable (private browsing / SSR).
 */
export function readPersistedQuality(): QualityPreset | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(THREE_QUALITY_STORAGE_KEY);
    return isQualityPreset(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Persist (or clear, with `null`) a manual quality override to localStorage.
 * Silently no-ops when storage is unavailable.
 */
export function persistQuality(preset: QualityPreset | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (preset === null) {
      window.localStorage.removeItem(THREE_QUALITY_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THREE_QUALITY_STORAGE_KEY, preset);
    }
  } catch {
    /* Storage unavailable — override simply won't persist. */
  }
}

/* -------------------------------------------------------------------------- */
/*                        Resource Budget Accessor                            */
/* -------------------------------------------------------------------------- */

/** Look up the {@link RESOURCE_BUDGETS} entry for a preset. */
export function getResourceBudget(preset: QualityPreset) {
  return RESOURCE_BUDGETS[preset];
}
