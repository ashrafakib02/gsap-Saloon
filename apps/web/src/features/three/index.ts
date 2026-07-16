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
 * Phase 6.3: Camera system — camera components, hooks, types, constants.
 * Phase 6.4: Lighting system — lighting components, hooks, types, constants.
 * Phase 6.5: Materials system — materials components, hooks, types, constants.
 * Phase 6.6: Environment system — environment components, hooks, types, constants.
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

// ── Camera Components ────────────────────────────────────

export { CameraRoot } from './camera-root';
export { CameraContext, useCameraContext } from './camera-provider';

// ── Camera Hooks ─────────────────────────────────────────

export { useCamera } from './hooks/use-camera';
export { useCameraManager } from './hooks/use-camera-manager';
export { useCameraPreset } from './hooks/use-camera-preset';
export { useCameraTarget } from './hooks/use-camera-target';
export { useCameraState } from './hooks/use-camera-state';
export { useCameraControls } from './hooks/use-camera-controls';

// ── Camera Hook Return Types ─────────────────────────────

export type { UseCameraManagerReturn } from './hooks/use-camera-manager';
export type { UseCameraControlsReturn } from './hooks/use-camera-controls';
export type { CameraStateReturn } from './hooks/use-camera-state';

// ── Camera Types ─────────────────────────────────────────

export type {
  CameraMode,
  CameraPreset,
  CameraPresetId,
  CameraTarget,
  CameraViewport,
  CameraQualityProfile,
  CameraConstraints,
  CameraMetadata,
  CameraControllerConfig,
  CameraTimelineConfig,
  CameraPresetOptions,
  CameraPresetDefinition,
  CameraPresetState,
  CameraTargetOptions,
  CameraTargetDefinition,
  CameraTargetState,
  CameraSnapshot,
  CameraRegistry,
  CameraManager,
  CameraSelector,
  CameraEquality,
  CameraCallback,
  CameraUnsubscribe,
} from './camera.types';

export type { CameraContextValue } from './camera-provider';

// ── Camera Constants ─────────────────────────────────────

export {
  CAMERA_MODES,
  CAMERA_PRESETS,
  CAMERA_TARGETS,
  CAMERA_PRESET_DESCRIPTIONS,
  CAMERA_MODE_DESCRIPTIONS,
  CAMERA_TARGET_DESCRIPTIONS,
  CAMERA_PRESET_ORDER,
  CAMERA_MODE_ORDER,
  CAMERA_TARGET_ORDER,
  CAMERA_PRESET_FOV,
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_NEAR,
  DEFAULT_CAMERA_FAR,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_MODE,
  DEFAULT_ACTIVE_PRESET,
  DEFAULT_ACTIVE_TARGET,
  DEFAULT_CAMERA_VIEWPORT,
  DEFAULT_QUALITY_PROFILE,
  DEFAULT_CAMERA_CONSTRAINTS,
  DEFAULT_CAMERA_SNAPSHOT,
} from './camera.constants';

// ── Lighting Components ──────────────────────────────────

export { LightingRoot } from './lighting-root';
export { LightingContext, useLightingContext } from './lighting-provider';

// ── Lighting Hooks ───────────────────────────────────────

export { useLighting } from './hooks/use-lighting';
export { useLightingManager } from './hooks/use-lighting-manager';
export { useLightingPreset } from './hooks/use-lighting-preset';
export { useLightingState } from './hooks/use-lighting-state';
export { useLightingQuality } from './hooks/use-lighting-quality';
export { useLightingEnvironment } from './hooks/use-lighting-environment';

// ── Lighting Hook Return Types ───────────────────────────

export type { UseLightingManagerReturn } from './hooks/use-lighting-manager';
export type { LightingStateReturn } from './hooks/use-lighting-state';
export type { UseLightingQualityReturn } from './hooks/use-lighting-quality';

// ── Lighting Types ───────────────────────────────────────

export type {
  LightingPreset,
  LightingPresetId,
  LightingLayer,
  LightingLayerId,
  LightingEnvironment,
  LightingQualityProfile,
  LightingConstraints,
  LightingMetadata,
  LightingControllerConfig,
  LightingTimelineConfig,
  LightingPresetOptions,
  LightingPresetDefinition,
  LightingPresetState,
  LightingLayerState,
  LightingSnapshot,
  LightingRegistry,
  LightingManager,
  LightingSelector,
  LightingEquality,
  LightingCallback,
  LightingUnsubscribe,
} from './lighting.types';

export type { LightingContextValue } from './lighting-provider';

// ── Lighting Constants ───────────────────────────────────

export {
  LIGHTING_PRESETS,
  LIGHTING_LAYERS,
  LIGHTING_ENVIRONMENTS,
  LIGHTING_PRESET_DESCRIPTIONS,
  LIGHTING_LAYER_DESCRIPTIONS,
  LIGHTING_ENVIRONMENT_DESCRIPTIONS,
  LIGHTING_PRESET_ORDER,
  LIGHTING_LAYER_ORDER,
  LIGHTING_ENVIRONMENT_ORDER,
  LIGHTING_PRESET_INTENSITY,
  LIGHTING_PRESET_COLOR_TEMPERATURE,
  LIGHTING_PRESET_AMBIENT_INTENSITY,
  LIGHTING_PRESET_DIRECTIONAL_INTENSITY,
  LIGHTING_PRESET_ENVIRONMENT,
  LIGHTING_PRESET_SHADOWS,
  DEFAULT_LIGHTING_INTENSITY,
  DEFAULT_LIGHTING_COLOR_TEMPERATURE,
  DEFAULT_LIGHTING_AMBIENT_INTENSITY,
  DEFAULT_LIGHTING_DIRECTIONAL_INTENSITY,
  DEFAULT_LIGHTING_SHADOWS_ENABLED,
  DEFAULT_ACTIVE_LIGHTING_PRESET,
  DEFAULT_ACTIVE_LIGHTING_ENVIRONMENT,
  DEFAULT_LIGHTING_QUALITY_PROFILE,
  DEFAULT_LIGHTING_CONSTRAINTS,
  DEFAULT_LIGHTING_SNAPSHOT,
} from './lighting.constants';

// ── Materials Components ──────────────────────────────────

export { MaterialsRoot } from './materials-root';
export { MaterialsContext, useMaterialsContext } from './materials-provider';

// ── Materials Hooks ───────────────────────────────────────

export { useMaterials } from './hooks/use-materials';
export { useMaterialsManager } from './hooks/use-materials-manager';
export { useMaterialPreset } from './hooks/use-material-preset';
export { useMaterialState } from './hooks/use-material-state';
export { useMaterialQuality } from './hooks/use-material-quality';
export { useMaterialRegistry } from './hooks/use-material-registry';

// ── Materials Hook Return Types ───────────────────────────

export type { UseMaterialsManagerReturn } from './hooks/use-materials-manager';
export type { MaterialStateReturn } from './hooks/use-material-state';
export type { UseMaterialQualityReturn } from './hooks/use-material-quality';
export type { UseMaterialRegistryReturn } from './hooks/use-material-registry';

// ── Materials Types ───────────────────────────────────────

export type {
  MaterialPreset,
  MaterialPresetId,
  MaterialCategory,
  MaterialCategoryId,
  MaterialGroup,
  MaterialGroupId,
  MaterialLayer,
  MaterialLayerId,
  MaterialSurface,
  MaterialSurfaceId,
  MaterialVariant,
  MaterialLifecycleState,
  MaterialPriority,
  MaterialQualityProfile,
  MaterialConstraints,
  MaterialMetadata,
  MaterialShaderModuleConfig,
  MaterialPresetOptions,
  MaterialPresetDefinition,
  MaterialPresetState,
  MaterialCategoryState,
  MaterialGroupState,
  MaterialSnapshot,
  MaterialRegistry,
  MaterialsManager,
  MaterialSelector,
  MaterialEquality,
  MaterialCallback,
  MaterialUnsubscribe,
} from './materials.types';

export type { MaterialsContextValue } from './materials-provider';

// ── Materials Constants ───────────────────────────────────

export {
  MATERIAL_PRESETS,
  MATERIAL_CATEGORIES,
  MATERIAL_GROUPS,
  MATERIAL_LAYERS,
  MATERIAL_SURFACES,
  MATERIAL_PRIORITIES,
  MATERIAL_LIFECYCLE_STATES,
  MATERIAL_PRESET_DESCRIPTIONS,
  MATERIAL_CATEGORY_DESCRIPTIONS,
  MATERIAL_GROUP_DESCRIPTIONS,
  MATERIAL_LAYER_DESCRIPTIONS,
  MATERIAL_SURFACE_DESCRIPTIONS,
  MATERIAL_PRIORITY_DESCRIPTIONS,
  MATERIAL_PRESET_ORDER,
  MATERIAL_CATEGORY_ORDER,
  MATERIAL_GROUP_ORDER,
  MATERIAL_LAYER_ORDER,
  MATERIAL_SURFACE_ORDER,
  MATERIAL_PRESET_CATEGORY,
  MATERIAL_PRESET_SURFACE,
  MATERIAL_PRESET_PRIORITY,
  MATERIAL_PRESET_GROUP,
  MATERIAL_CATEGORY_TO_GROUP,
  DEFAULT_ACTIVE_MATERIAL_PRESET,
  DEFAULT_MATERIAL_QUALITY_PROFILE,
  DEFAULT_MATERIAL_CONSTRAINTS,
  DEFAULT_MATERIAL_SNAPSHOT,
} from './materials.constants';

// ── Environment Components ──────────────────────────────────

export { EnvironmentRoot } from './environment-root';
export { EnvironmentContext, useEnvironmentContext } from './environment-provider';

// ── Environment Hooks ───────────────────────────────────────

export { useEnvironment } from './hooks/use-environment';
export { useEnvironmentManager } from './hooks/use-environment-manager';
export { useEnvironmentPreset } from './hooks/use-environment-preset';
export { useEnvironmentState } from './hooks/use-environment-state';
export { useEnvironmentQuality } from './hooks/use-environment-quality';
export { useEnvironmentRegistry } from './hooks/use-environment-registry';

// ── Environment Hook Return Types ───────────────────────────

export type { UseEnvironmentManagerReturn } from './hooks/use-environment-manager';
export type { EnvironmentStateReturn } from './hooks/use-environment-state';
export type { UseEnvironmentQualityReturn } from './hooks/use-environment-quality';

// ── Environment Types ───────────────────────────────────────

export type {
  EnvironmentPreset,
  EnvironmentPresetId,
  EnvironmentCategory,
  EnvironmentCategoryId,
  EnvironmentGroup,
  EnvironmentGroupId,
  EnvironmentLayer,
  EnvironmentLayerId,
  EnvironmentQualityProfile,
  EnvironmentConstraints,
  EnvironmentMetadata,
  EnvironmentPresetOptions,
  EnvironmentPresetDefinition,
  EnvironmentPresetState,
  EnvironmentCategoryState,
  EnvironmentGroupState,
  EnvironmentLifecycleState,
  EnvironmentPriority,
  EnvironmentSnapshot,
  EnvironmentRegistry,
  EnvironmentManager,
  EnvironmentSelector,
  EnvironmentEquality,
  EnvironmentCallback,
  EnvironmentUnsubscribe,
} from './environment.types';

export type { EnvironmentContextValue } from './environment-provider';

// ── Environment Constants ───────────────────────────────────

export {
  ENVIRONMENT_PRESETS,
  ENVIRONMENT_CATEGORIES,
  ENVIRONMENT_GROUPS,
  ENVIRONMENT_LAYERS,
  ENVIRONMENT_PRIORITIES,
  ENVIRONMENT_LIFECYCLE_STATES,
  ENVIRONMENT_PRESET_DESCRIPTIONS,
  ENVIRONMENT_CATEGORY_DESCRIPTIONS,
  ENVIRONMENT_GROUP_DESCRIPTIONS,
  ENVIRONMENT_LAYER_DESCRIPTIONS,
  ENVIRONMENT_PRIORITY_DESCRIPTIONS,
  ENVIRONMENT_PRESET_ORDER,
  ENVIRONMENT_CATEGORY_ORDER,
  ENVIRONMENT_GROUP_ORDER,
  ENVIRONMENT_LAYER_ORDER,
  ENVIRONMENT_PRESET_CATEGORY,
  ENVIRONMENT_PRESET_PRIORITY,
  ENVIRONMENT_PRESET_GROUP,
  ENVIRONMENT_CATEGORY_TO_GROUP,
  DEFAULT_ACTIVE_ENVIRONMENT_PRESET,
  DEFAULT_ENVIRONMENT_QUALITY_PROFILE,
  DEFAULT_ENVIRONMENT_CONSTRAINTS,
  DEFAULT_ENVIRONMENT_SNAPSHOT,
} from './environment.constants';
