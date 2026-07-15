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
