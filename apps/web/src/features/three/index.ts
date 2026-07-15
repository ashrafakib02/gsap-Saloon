/**
 * Three Feature — Public API
 *
 * From PROJECT_BLUEPRINT §Feature Architecture:
 * "Each feature exports a clean public API from its index.
 *  Import from '@/features/three', never from individual files."
 *
 * Exports the complete React Three Fiber infrastructure: Canvas wrapper,
 * Provider, Error Boundary, six typed hooks, types, and constants.
 *
 * Internal singletons (`threePerformanceManager`, `threeEventManager`,
 * `ThreeContext`, `useThreeContext`) are NOT exported — consumers access
 * them through hooks and the provider.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 * Phase 6.2: Scene architecture — scene components, hooks, types, constants.
 */

// ── Canvas ──────────────────────────────────────────────

export { ThreeCanvas } from './three-canvas';

// ── Provider ────────────────────────────────────────────

export { ThreeProvider } from './three-provider';

// ── Error Boundary ──────────────────────────────────────

export { ThreeErrorBoundary } from './three-error-boundary';

// ── Hooks ───────────────────────────────────────────────

export { useThree } from './hooks/use-three';
export { useThreePerformance } from './hooks/use-three-performance';
export { useThreeRenderer } from './hooks/use-three-renderer';
export { useThreeQuality } from './hooks/use-three-quality';
export { useThreeViewport } from './hooks/use-three-viewport';
export { useThreeDevice } from './hooks/use-three-device';

// ── Hook Return Types ───────────────────────────────────

export type { UseThreeRendererReturn } from './hooks/use-three-renderer';
export type { UseThreeQualityReturn } from './hooks/use-three-quality';
export type { UseThreeViewportReturn } from './hooks/use-three-viewport';
export type { UseThreeDeviceReturn } from './hooks/use-three-device';

// ── Types ───────────────────────────────────────────────

export type {
  ThreeCanvasProps,
  ThreeContextValue,
  QualityPreset,
  QualitySettings,
  DeviceCapabilities,
  DeviceTier,
  GpuCapability,
  FrameloopMode,
  RendererConfig,
  ThreePerformanceSnapshot,
  ThreePerformanceSelector,
  ThreePerformanceEquality,
  ThreePerformanceManager,
  ThreeEventManager,
  ThreeEventType,
  ThreeEvent,
  ThreeEventListener,
  ThreeRegistries,
  ThreeRegistry,
  ThreeRegistryEntry,
  PixelRatioStrategy,
  ShadowConfig,
  WebGPUCompatibilityMeta,
  FrameBudget,
  ResourceBudget,
  ThreePowerPreference,
} from './three.types';

// ── Constants ───────────────────────────────────────────

export {
  QUALITY_PRESETS,
  DEVICE_TIERS,
  GPU_CAPABILITIES,
  THREE_EVENT_TYPES,
} from './three.types';

export {
  QUALITY_PRESET_DESCRIPTIONS,
  DEVICE_TIER_DESCRIPTIONS,
  THREE_EVENT_DESCRIPTIONS,
  ALL_THREE_EVENT_TYPES,
  RESOURCE_BUDGETS,
  PIXEL_RATIO_STRATEGIES,
  QUALITY_SETTINGS,
  TIER_DEFAULT_QUALITY,
  QUALITY_PRESET_ORDER,
  DEFAULT_SHADOW_CONFIG,
  DISABLED_SHADOW_CONFIG,
  DEFAULT_RENDERER_CONFIG,
  MINIMAL_RENDERER_CONFIG,
  DEFAULT_PERFORMANCE_SNAPSHOT,
  DEFAULT_FRAMELOOP,
  THREE_QUALITY_STORAGE_KEY,
  THREE_FEATURE_FLAG,
} from './three.constants';

// ── Scene Components ─────────────────────────────────────

export { SceneRoot } from './scene-root';
export { SceneContext, useSceneContext } from './scene-provider';
export { SceneStage as SceneStageComponent } from './scene-stage';
export { SceneSlot } from './scene-slot';
export { SceneBoundary } from './scene-boundary';

// ── Scene Hooks ──────────────────────────────────────────

export { useScene } from './hooks/use-scene';
export { useSceneManager } from './hooks/use-scene-manager';
export { useSceneStage } from './hooks/use-scene-stage';
export { useSceneSlot } from './hooks/use-scene-slot';
export { useSceneVisibility } from './hooks/use-scene-visibility';

// ── Scene Hook Return Types ──────────────────────────────

export type { UseSceneManagerReturn } from './hooks/use-scene-manager';

// ── Scene Types ──────────────────────────────────────────

export type {
  SceneLayerId,
  SceneSlotId,
  SceneStage,
  SceneVisibility,
  ScenePriority,
  SceneGroup,
  SceneOptions,
  SceneDefinition,
  SceneState,
  SceneLayerOptions,
  SceneLayerDefinition,
  SceneLayerState,
  SceneSlotOptions,
  SceneSlotDefinition,
  SceneSlotState,
  SceneSnapshot,
  SceneRegistry,
  SceneManager,
  SceneSelector,
  SceneEquality,
  SceneCallback,
  SceneUnsubscribe,
} from './scene.types';

export type { SceneContextValue } from './scene-provider';

// ── Scene Constants ──────────────────────────────────────

export {
  SCENE_LAYERS,
  SCENE_SLOTS,
  SCENE_STAGES,
  SCENE_VISIBILITY_STATES,
  SCENE_PRIORITIES,
  SCENE_GROUPS,
  SCENE_STAGE_DESCRIPTIONS,
  SCENE_VISIBILITY_DESCRIPTIONS,
  SCENE_PRIORITY_DESCRIPTIONS,
  SCENE_LAYER_DESCRIPTIONS,
  SCENE_SLOT_DESCRIPTIONS,
  SCENE_GROUP_DESCRIPTIONS,
  SCENE_STAGE_ORDER,
  SCENE_LAYER_ORDER,
  SCENE_PRIORITY_ORDER,
  SCENE_SLOT_DEFAULTS,
  DEFAULT_SCENE_STAGE,
  DEFAULT_SCENE_VISIBILITY,
  DEFAULT_SCENE_PRIORITY,
  DEFAULT_SCENE_GROUP,
  DEFAULT_SCENE_SNAPSHOT,
} from './scene.constants';
