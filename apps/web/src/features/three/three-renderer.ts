/**
 * Three Renderer — Centralized WebGL Renderer Configuration
 *
 * From DESIGN_SYSTEM §16 (Color & Light):
 * "Warm, editorial color reproduction. Highlights bloom softly; shadows keep
 *  their depth. Never clinical, never flat."
 *
 * This module is the single place that translates a resolved
 * {@link QualitySettings} into the concrete parameters an R3F `<Canvas gl=…>`
 * and its `onCreated` callback need. No component configures the renderer
 * inline — they consume the outputs here.
 *
 * It exposes three things:
 *   1. `buildGlAttributes` — the `WebGLContextAttributes` for context creation.
 *   2. `applyRendererConfig` — an `onCreated` side-effect that sets color
 *      space, tone mapping, and shadow-map state on the live renderer.
 *   3. `resolveCanvasSettings` — the frameloop + DPR + shadows props the
 *      Canvas wrapper passes declaratively.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import type { WebGLRenderer } from 'three';
import type { RootState, Dpr } from '@react-three/fiber';

import {
  resolveRendererConfig,
  resolveAdaptiveDpr,
} from './three.config';

import type {
  QualitySettings,
  RendererConfig,
  ThreePowerPreference,
  FrameloopMode,
} from './three.types';

/* -------------------------------------------------------------------------- */
/*                          GL Context Attributes                             */
/* -------------------------------------------------------------------------- */

/**
 * The subset of `WebGLContextAttributes` (plus R3F extras) that R3F accepts on
 * the `gl` prop. Declared explicitly so the Canvas wrapper stays typed without
 * leaking three-internal renderer parameter types.
 */
export interface ThreeGlAttributes {
  readonly antialias: boolean;
  readonly alpha: boolean;
  readonly stencil: boolean;
  readonly depth: boolean;
  readonly powerPreference: ThreePowerPreference;
  readonly logarithmicDepthBuffer: boolean;
  readonly preserveDrawingBuffer: boolean;
  readonly failIfMajorPerformanceCaveat: boolean;
}

/**
 * Build the WebGL context attributes for a renderer configuration.
 *
 * These flow into the R3F `<Canvas gl={…}>` prop, which forwards them to
 * `new THREE.WebGLRenderer(params)`.
 */
export function buildGlAttributes(config: RendererConfig): ThreeGlAttributes {
  return {
    antialias: config.antialias,
    alpha: config.alpha,
    stencil: config.stencil,
    depth: config.depth,
    powerPreference: config.powerPreference,
    logarithmicDepthBuffer: config.logarithmicDepthBuffer,
    preserveDrawingBuffer: config.preserveDrawingBuffer,
    failIfMajorPerformanceCaveat: config.failIfMajorPerformanceCaveat,
  };
}

/* -------------------------------------------------------------------------- */
/*                        Post-Creation Renderer Setup                        */
/* -------------------------------------------------------------------------- */

/**
 * Apply color, tone-mapping, and shadow configuration to a live renderer.
 *
 * Called from the Canvas `onCreated` callback. Settings like
 * `outputColorSpace` and `toneMapping` cannot be passed as context attributes;
 * they are assigned on the constructed {@link WebGLRenderer} instance.
 *
 * @param renderer - The live three.js renderer.
 * @param config   - The resolved renderer configuration to apply.
 */
export function applyRendererConfig(
  renderer: WebGLRenderer,
  config: RendererConfig,
): void {
  renderer.outputColorSpace = config.outputColorSpace;
  renderer.toneMapping = config.toneMapping;
  renderer.toneMappingExposure = config.toneMappingExposure;

  renderer.shadowMap.enabled = config.shadows.enabled;
  renderer.shadowMap.type = config.shadows.type;
  renderer.shadowMap.autoUpdate = config.shadows.autoUpdate;
}

/**
 * Build an `onCreated` handler bound to a renderer configuration.
 *
 * Convenience wrapper so the Canvas can pass `onCreated={createOnCreated(cfg)}`
 * without inlining the renderer-setup logic.
 */
export function createOnCreated(
  config: RendererConfig,
): (state: RootState) => void {
  return (state: RootState) => {
    applyRendererConfig(state.gl, config);
  };
}

/* -------------------------------------------------------------------------- */
/*                         Declarative Canvas Settings                        */
/* -------------------------------------------------------------------------- */

/**
 * The declarative rendering props the Canvas wrapper passes to `<Canvas>`.
 *
 * `shadows` here is the boolean/`ShadowMapType` R3F accepts on the Canvas prop;
 * the finer shadow-map details are applied via {@link applyRendererConfig}.
 */
export interface ThreeCanvasSettings {
  readonly gl: ThreeGlAttributes;
  readonly dpr: Dpr;
  readonly frameloop: FrameloopMode;
  readonly shadows: boolean;
  readonly flat: boolean;
  readonly config: RendererConfig;
  readonly onCreated: (state: RootState) => void;
}

/**
 * Resolve every Canvas-level rendering setting from a quality configuration.
 *
 * Single entry point for the Canvas wrapper: derives the renderer config, GL
 * attributes, adaptive DPR range, frameloop, and `onCreated` handler in one
 * call so the component stays declarative.
 *
 * @param quality           - The active resolved quality settings.
 * @param devicePixelRatio  - The device's real pixel ratio (for DPR clamping).
 */
export function resolveCanvasSettings(
  quality: QualitySettings,
  devicePixelRatio: number,
): ThreeCanvasSettings {
  const config = resolveRendererConfig(quality);
  const dpr = resolveAdaptiveDpr(quality.preset, devicePixelRatio);

  return {
    gl: buildGlAttributes(config),
    dpr: dpr as Dpr,
    frameloop: quality.frameloop,
    shadows: quality.shadowsEnabled,
    /* `flat` disables R3F's default ACES tone mapping so our explicit
       `toneMapping` assignment in applyRendererConfig is authoritative. */
    flat: true,
    config,
    onCreated: createOnCreated(config),
  };
}
