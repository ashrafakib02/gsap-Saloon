/**
 * Performance Budget Constants — Defaults, Descriptions, and Quality Profiles
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 *
 * This module declares the static tables that the performance budget
 * system derives from: default snapshots, quality profiles, constraints,
 * and human-readable descriptions. All values are frozen — nothing
 * here mutates at runtime.
 *
 * Phase 6.8: Performance Budget — infrastructure only.
 */

import type {
  BudgetCategory,
  BudgetPriority,
  BudgetLifecycle,
  BudgetMetricId,
  BudgetConstraints,
  BudgetSnapshot,
  PerformanceBudgetQualityProfile,
} from './performance-budget.types';

import {
  BUDGET_CATEGORIES,
  BUDGET_PRIORITIES,
  BUDGET_LIFECYCLE_STATES,
} from './performance-budget.types';

import type { QualityPreset } from './three.types';

/* -------------------------------------------------------------------------- */
/*                            Description Records                             */
/* -------------------------------------------------------------------------- */

/** Human-readable descriptions for each budget category. */
export const BUDGET_CATEGORY_DESCRIPTIONS: Record<BudgetCategory, string> = {
  geometry: 'Geometry resource budget (vertices, indices)',
  materials: 'Material resource budget (shader complexity)',
  textures: 'Texture resource budget (VRAM, decode time)',
  environment: 'Environment map budget (HDR, cubemaps)',
  lighting: 'Lighting resource budget (lights, shadows)',
  shadows: 'Shadow resource budget (shadow maps, cascades)',
  particles: 'Particle system budget (count, overdraw)',
  postprocessing: 'Post-processing budget (passes, resolution)',
  animation: 'Animation budget (tracks, blending)',
  physics: 'Physics simulation budget (bodies, collisions)',
  audio: 'Audio resource budget (sources, buffers)',
  network: 'Network transfer budget (bandwidth, latency)',
  memory: 'System memory budget (RAM usage)',
  gpu: 'GPU memory budget (VRAM usage)',
  cpu: 'CPU time budget (computation time)',
  'draw-calls': 'Draw-call budget (per-frame draw calls)',
  triangles: 'Triangle count budget (per-frame primitives)',
  'shader-complexity': 'Shader complexity budget (instruction count)',
};

/** Human-readable descriptions for each budget priority. */
export const BUDGET_PRIORITY_DESCRIPTIONS: Record<BudgetPriority, string> = {
  critical: 'Must not be exceeded under any circumstances',
  high: 'Should not be exceeded, degrade other systems first',
  normal: 'Standard enforcement priority',
  low: 'Can be relaxed if higher-priority budgets are tight',
  advisory: 'Informational only, never enforced',
};

/** Human-readable descriptions for each lifecycle state. */
export const BUDGET_LIFECYCLE_DESCRIPTIONS: Record<BudgetLifecycle, string> = {
  registered: 'Registered, not yet active',
  active: 'Active and being evaluated',
  suspended: 'Suspended — not evaluated but still tracked',
  exceeded: 'Budget limit has been breached',
  disposed: 'Disposed, no longer tracked',
};

/** Human-readable descriptions for each metric. */
export const BUDGET_METRIC_DESCRIPTIONS: Record<BudgetMetricId, string> = {
  frameTime: 'Frame time in milliseconds',
  fps: 'Frames per second',
  drawCalls: 'Number of draw calls per frame',
  triangleCount: 'Total triangle count per frame',
  textureMemory: 'Texture memory in bytes',
  geometryMemory: 'Geometry memory in bytes',
  shaderCount: 'Number of compiled shaders',
  materialCount: 'Number of active materials',
  lightCount: 'Number of active lights',
  particleCount: 'Number of active particles',
  gpuTime: 'GPU execution time in milliseconds',
  cpuTime: 'CPU execution time in milliseconds',
  assetMemory: 'Total asset memory in bytes',
};

/* -------------------------------------------------------------------------- */
/*                              Ordering Records                              */
/* -------------------------------------------------------------------------- */

/** Ordinal ranking of budget categories. */
export const BUDGET_CATEGORY_ORDER: Record<BudgetCategory, number> =
  BUDGET_CATEGORIES.reduce(
    (acc, category, index) => {
      acc[category] = index;
      return acc;
    },
    {} as Record<BudgetCategory, number>,
  );

/** Ordinal ranking of budget priorities. */
export const BUDGET_PRIORITY_ORDER: Record<BudgetPriority, number> =
  BUDGET_PRIORITIES.reduce(
    (acc, priority, index) => {
      acc[priority] = index;
      return acc;
    },
    {} as Record<BudgetPriority, number>,
  );

/** Ordinal ranking of lifecycle states. */
export const BUDGET_LIFECYCLE_ORDER: Record<BudgetLifecycle, number> =
  BUDGET_LIFECYCLE_STATES.reduce(
    (acc, state, index) => {
      acc[state] = index;
      return acc;
    },
    {} as Record<BudgetLifecycle, number>,
  );

/* -------------------------------------------------------------------------- */
/*                        Per-Preset Quality Profiles                         */
/* -------------------------------------------------------------------------- */

/** Quality-adapted performance budget profiles per quality preset. */
export const PERFORMANCE_BUDGET_QUALITY_PROFILES: Record<QualityPreset, PerformanceBudgetQualityProfile> = {
  ultra: Object.freeze({
    preset: 'ultra',
    maxFrameTime: 16.67,
    maxDrawCalls: 500,
    maxTriangles: 2_000_000,
    maxTextureMemory: 512 * 1024 * 1024,
    maxGeometryMemory: 256 * 1024 * 1024,
    maxShaders: 200,
    maxMaterials: 100,
    maxLights: 32,
    maxParticles: 50_000,
    maxGpuTime: 12,
    maxCpuTime: 10,
    maxAssetMemory: 512 * 1024 * 1024,
  }),
  high: Object.freeze({
    preset: 'high',
    maxFrameTime: 16.67,
    maxDrawCalls: 300,
    maxTriangles: 1_000_000,
    maxTextureMemory: 256 * 1024 * 1024,
    maxGeometryMemory: 128 * 1024 * 1024,
    maxShaders: 150,
    maxMaterials: 75,
    maxLights: 24,
    maxParticles: 25_000,
    maxGpuTime: 10,
    maxCpuTime: 8,
    maxAssetMemory: 256 * 1024 * 1024,
  }),
  medium: Object.freeze({
    preset: 'medium',
    maxFrameTime: 16.67,
    maxDrawCalls: 200,
    maxTriangles: 500_000,
    maxTextureMemory: 128 * 1024 * 1024,
    maxGeometryMemory: 64 * 1024 * 1024,
    maxShaders: 100,
    maxMaterials: 50,
    maxLights: 16,
    maxParticles: 10_000,
    maxGpuTime: 8,
    maxCpuTime: 6,
    maxAssetMemory: 128 * 1024 * 1024,
  }),
  low: Object.freeze({
    preset: 'low',
    maxFrameTime: 33.33,
    maxDrawCalls: 100,
    maxTriangles: 200_000,
    maxTextureMemory: 64 * 1024 * 1024,
    maxGeometryMemory: 32 * 1024 * 1024,
    maxShaders: 50,
    maxMaterials: 25,
    maxLights: 8,
    maxParticles: 5_000,
    maxGpuTime: 6,
    maxCpuTime: 4,
    maxAssetMemory: 64 * 1024 * 1024,
  }),
  minimal: Object.freeze({
    preset: 'minimal',
    maxFrameTime: 50,
    maxDrawCalls: 50,
    maxTriangles: 50_000,
    maxTextureMemory: 32 * 1024 * 1024,
    maxGeometryMemory: 16 * 1024 * 1024,
    maxShaders: 25,
    maxMaterials: 10,
    maxLights: 4,
    maxParticles: 1_000,
    maxGpuTime: 4,
    maxCpuTime: 3,
    maxAssetMemory: 32 * 1024 * 1024,
  }),
};

/* -------------------------------------------------------------------------- */
/*                            Default Constraints                             */
/* -------------------------------------------------------------------------- */

/** Default performance budget constraints. */
export const DEFAULT_BUDGET_CONSTRAINTS: BudgetConstraints = Object.freeze({
  maxBudgets: 200,
  maxMetrics: 50,
  maxProfiles: 10,
  maxRecommendations: 50,
  maxEvaluationDepth: 10,
});

/* -------------------------------------------------------------------------- */
/*                          Default Categories                                */
/* -------------------------------------------------------------------------- */

/** Default budget categories — one per {@link BUDGET_CATEGORIES}. */
const DEFAULT_CATEGORIES: ReadonlyArray<{
  readonly id: BudgetCategory;
  readonly enabled: boolean;
}> = [
  { id: 'geometry', enabled: true },
  { id: 'materials', enabled: true },
  { id: 'textures', enabled: true },
  { id: 'environment', enabled: true },
  { id: 'lighting', enabled: true },
  { id: 'shadows', enabled: true },
  { id: 'particles', enabled: true },
  { id: 'postprocessing', enabled: true },
  { id: 'animation', enabled: true },
  { id: 'physics', enabled: true },
  { id: 'audio', enabled: true },
  { id: 'network', enabled: true },
  { id: 'memory', enabled: true },
  { id: 'gpu', enabled: true },
  { id: 'cpu', enabled: true },
  { id: 'draw-calls', enabled: true },
  { id: 'triangles', enabled: true },
  { id: 'shader-complexity', enabled: true },
];

export { DEFAULT_CATEGORIES as BUDGET_DEFAULT_CATEGORIES };

/* -------------------------------------------------------------------------- */
/*                           Default Metrics                                  */
/* -------------------------------------------------------------------------- */

/** Default metric definitions — one per {@link BUDGET_METRICS}. */
const DEFAULT_METRICS: ReadonlyArray<{
  readonly id: BudgetMetricId;
  readonly category: BudgetCategory;
  readonly unit: string;
  readonly enabled: boolean;
}> = [
  { id: 'frameTime', category: 'cpu', unit: 'ms', enabled: true },
  { id: 'fps', category: 'cpu', unit: 'fps', enabled: true },
  { id: 'drawCalls', category: 'draw-calls', unit: 'count', enabled: true },
  { id: 'triangleCount', category: 'triangles', unit: 'count', enabled: true },
  { id: 'textureMemory', category: 'textures', unit: 'bytes', enabled: true },
  { id: 'geometryMemory', category: 'geometry', unit: 'bytes', enabled: true },
  { id: 'shaderCount', category: 'shader-complexity', unit: 'count', enabled: true },
  { id: 'materialCount', category: 'materials', unit: 'count', enabled: true },
  { id: 'lightCount', category: 'lighting', unit: 'count', enabled: true },
  { id: 'particleCount', category: 'particles', unit: 'count', enabled: true },
  { id: 'gpuTime', category: 'gpu', unit: 'ms', enabled: true },
  { id: 'cpuTime', category: 'cpu', unit: 'ms', enabled: true },
  { id: 'assetMemory', category: 'memory', unit: 'bytes', enabled: true },
];

export { DEFAULT_METRICS as BUDGET_DEFAULT_METRICS };

/* -------------------------------------------------------------------------- */
/*                       Default Quality Profile                              */
/* -------------------------------------------------------------------------- */

/** Default quality profile (medium preset). */
export const DEFAULT_BUDGET_QUALITY_PROFILE: PerformanceBudgetQualityProfile =
  PERFORMANCE_BUDGET_QUALITY_PROFILES.medium;

/* -------------------------------------------------------------------------- */
/*                         Default Snapshot                                   */
/* -------------------------------------------------------------------------- */

/**
 * The uninitialized performance budget snapshot.
 *
 * Returned by the budget manager before `init()` and after `destroy()`.
 */
export const DEFAULT_BUDGET_SNAPSHOT: BudgetSnapshot = Object.freeze({
  budgets: new Map(),
  metrics: new Map(),
  profiles: new Map(),
  qualityProfile: DEFAULT_BUDGET_QUALITY_PROFILE,
  constraints: DEFAULT_BUDGET_CONSTRAINTS,
  recommendations: Object.freeze([]),
  isReducedMotion: false,
  qualityPreset: 'medium',
  budgetCount: 0,
  metricCount: 0,
  profileCount: 0,
  exceededCount: 0,
  recommendationCount: 0,
  revision: 0,
  timestamp: 0,
});
