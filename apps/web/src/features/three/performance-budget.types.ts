/**
 * Performance Budget Types — Core Type System for Performance Budget Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 *
 * This module defines the complete type system for the performance budget
 * architecture — the infrastructure that measures rendering cost, defines
 * budgets per category, evaluates thresholds, and generates recommendations.
 * It stores metadata and orchestrates budget STATE only; it never performs
 * actual measurements, FPS monitoring, or dynamic quality switching.
 *
 * Architecture:
 *   BudgetOptions (consumer input) → BudgetDefinition (resolved)
 *   → BudgetRuntimeState (runtime) → BudgetSnapshot (immutable)
 *   → BudgetManager (registration + lifecycle)
 *   → BudgetRegistry (read-only queries)
 *
 * Consumers (future): Camera budgets, Lighting budgets, Particle budgets,
 * Post-processing budgets, Material budgets, Animation budgets.
 *
 * Phase 6.8: Performance Budget — infrastructure only, no measurement.
 */

import type { QualityPreset } from './three.types';

// ── Budget Category ────────────────────────────────────────

/**
 * Budget categories define the rendering subsystem being budgeted.
 *
 * Each category represents a domain of rendering cost that may be
 * measured in a future phase. Only metadata and budgets are stored here —
 * no actual measurements are taken.
 */
export const BUDGET_CATEGORIES = [
  /** Geometry resource budget */
  'geometry',
  /** Material resource budget */
  'materials',
  /** Texture resource budget */
  'textures',
  /** Environment map budget */
  'environment',
  /** Lighting resource budget */
  'lighting',
  /** Shadow resource budget */
  'shadows',
  /** Particle system budget */
  'particles',
  /** Post-processing budget */
  'postprocessing',
  /** Animation budget */
  'animation',
  /** Physics simulation budget */
  'physics',
  /** Audio resource budget */
  'audio',
  /** Network transfer budget */
  'network',
  /** System memory budget */
  'memory',
  /** GPU memory budget */
  'gpu',
  /** CPU time budget */
  'cpu',
  /** Draw-call budget */
  'draw-calls',
  /** Triangle count budget */
  'triangles',
  /** Shader complexity budget */
  'shader-complexity',
] as const;

/** Type-safe union of budget categories. */
export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];

// ── Budget Category ID ─────────────────────────────────────

/** Type-safe budget category identifier for Map keys. */
export type BudgetCategoryId = BudgetCategory;

// ── Budget Priority ────────────────────────────────────────

/**
 * Budget priority levels for resource allocation.
 *
 * Higher priority budgets are enforced first when resources are scarce.
 */
export const BUDGET_PRIORITIES = [
  /** Critical — must not be exceeded under any circumstances */
  'critical',
  /** High — should not be exceeded, degrade other systems first */
  'high',
  /** Normal — standard enforcement priority */
  'normal',
  /** Low — can be relaxed if higher-priority budgets are tight */
  'low',
  /** Advisory — informational only, never enforced */
  'advisory',
] as const;

/** Type-safe union of budget priorities. */
export type BudgetPriority = (typeof BUDGET_PRIORITIES)[number];

// ── Budget Lifecycle ───────────────────────────────────────

/**
 * Lifecycle states for a budget definition.
 *
 * Tracks registration through disposal. The manager validates transitions.
 */
export const BUDGET_LIFECYCLE_STATES = [
  /** Registered, not yet active */
  'registered',
  /** Active and being evaluated */
  'active',
  /** Suspended — not evaluated but still tracked */
  'suspended',
  /** Exceeded — budget limit has been breached */
  'exceeded',
  /** Disposed, no longer tracked */
  'disposed',
] as const;

/** Type-safe union of budget lifecycle states. */
export type BudgetLifecycle = (typeof BUDGET_LIFECYCLE_STATES)[number];

// ── Budget Metric ──────────────────────────────────────────

/**
 * Metric identifiers for performance measurement metadata.
 *
 * Each metric represents a measurable quantity. Only the identifier
 * and metadata are stored — no actual measurement is taken.
 */
export const BUDGET_METRICS = [
  /** Frame time in milliseconds */
  'frameTime',
  /** Frames per second */
  'fps',
  /** Number of draw calls per frame */
  'drawCalls',
  /** Total triangle count per frame */
  'triangleCount',
  /** Texture memory in bytes */
  'textureMemory',
  /** Geometry memory in bytes */
  'geometryMemory',
  /** Number of compiled shaders */
  'shaderCount',
  /** Number of active materials */
  'materialCount',
  /** Number of active lights */
  'lightCount',
  /** Number of active particles */
  'particleCount',
  /** GPU execution time in milliseconds */
  'gpuTime',
  /** CPU execution time in milliseconds */
  'cpuTime',
  /** Total asset memory in bytes */
  'assetMemory',
] as const;

/** Type-safe union of budget metric identifiers. */
export type BudgetMetricId = (typeof BUDGET_METRICS)[number];

// ── Budget Threshold ───────────────────────────────────────

/**
 * Threshold comparison operators for budget evaluation.
 */
export const BUDGET_THRESHOLD_OPERATORS = [
  /** Value must be less than threshold */
  'lt',
  /** Value must be less than or equal to threshold */
  'lte',
  /** Value must be equal to threshold */
  'eq',
  /** Value must be greater than or equal to threshold */
  'gte',
  /** Value must be greater than threshold */
  'gt',
] as const;

/** Type-safe union of threshold operators. */
export type BudgetThresholdOperator = (typeof BUDGET_THRESHOLD_OPERATORS)[number];

// ── IDs ────────────────────────────────────────────────────

/** Unique identifier for a budget definition. */
export type BudgetId = string;

/** Unique identifier for a metric definition. */
export type MetricId = string;

/** Unique identifier for a budget profile. */
export type BudgetProfileId = string;

// ── Options (Consumer Input) ───────────────────────────────

/**
 * Consumer input for registering a budget.
 *
 * All fields except `id` are optional — the manager resolves defaults.
 */
export interface BudgetOptions {
  /** Unique budget identifier. */
  readonly id: BudgetId;
  /** Human-readable label. */
  readonly label?: string;
  /** Budget category. */
  readonly category?: BudgetCategory;
  /** Budget priority level. */
  readonly priority?: BudgetPriority;
  /** Threshold value (numeric limit). */
  readonly threshold?: number;
  /** Threshold comparison operator. */
  readonly operator?: BudgetThresholdOperator;
  /** Metric this budget evaluates against. */
  readonly metricId?: BudgetMetricId;
  /** Whether the budget is initially enabled. */
  readonly enabled?: boolean;
  /** Custom metadata for future systems. */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Consumer input for registering a metric.
 */
export interface MetricOptions {
  /** Unique metric identifier. */
  readonly id: MetricId;
  /** Human-readable label. */
  readonly label?: string;
  /** Budget category this metric belongs to. */
  readonly category?: BudgetCategory;
  /** Unit of measurement (e.g., 'ms', 'bytes', 'count'). */
  readonly unit?: string;
  /** Whether the metric is initially enabled. */
  readonly enabled?: boolean;
}

/**
 * Consumer input for registering a budget profile.
 */
export interface BudgetProfileOptions {
  /** Unique profile identifier. */
  readonly id: BudgetProfileId;
  /** Human-readable label. */
  readonly label?: string;
  /** Quality preset this profile targets. */
  readonly qualityPreset?: QualityPreset;
  /** Per-category budget limits for this profile. */
  readonly categoryLimits?: Readonly<Partial<Record<BudgetCategory, number>>>;
  /** Whether the profile is initially enabled. */
  readonly enabled?: boolean;
}

// ── Definition (Resolved) ──────────────────────────────────

/**
 * Complete internal definition of a budget.
 *
 * Derived from {@link BudgetOptions} with all defaults resolved.
 * Immutable — the manager replaces this on re-registration.
 */
export interface BudgetDefinition {
  /** Unique budget identifier. */
  readonly id: BudgetId;
  /** Human-readable label. */
  readonly label: string;
  /** Budget category. */
  readonly category: BudgetCategory;
  /** Budget priority level. */
  readonly priority: BudgetPriority;
  /** Threshold value (numeric limit). */
  readonly threshold: number;
  /** Threshold comparison operator. */
  readonly operator: BudgetThresholdOperator;
  /** Metric this budget evaluates against. */
  readonly metricId: string;
  /** Whether the budget is enabled. */
  readonly enabled: boolean;
  /** Custom metadata. */
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * Complete internal definition of a metric.
 */
export interface MetricDefinition {
  /** Unique metric identifier. */
  readonly id: MetricId;
  /** Human-readable label. */
  readonly label: string;
  /** Budget category this metric belongs to. */
  readonly category: BudgetCategory;
  /** Unit of measurement. */
  readonly unit: string;
  /** Whether the metric is enabled. */
  readonly enabled: boolean;
}

/**
 * Complete internal definition of a budget profile.
 */
export interface BudgetProfileDefinition {
  /** Unique profile identifier. */
  readonly id: BudgetProfileId;
  /** Human-readable label. */
  readonly label: string;
  /** Quality preset this profile targets. */
  readonly qualityPreset: QualityPreset;
  /** Per-category budget limits. */
  readonly categoryLimits: Readonly<Partial<Record<BudgetCategory, number>>>;
  /** Whether the profile is enabled. */
  readonly enabled: boolean;
}

// ── Runtime State ──────────────────────────────────────────

/**
 * Runtime state for a single budget definition.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface BudgetRuntimeState {
  /** Budget identifier. */
  readonly id: BudgetId;
  /** Current lifecycle state. */
  readonly lifecycle: BudgetLifecycle;
  /** Whether this budget is enabled. */
  readonly enabled: boolean;
  /** Whether this budget has been registered. */
  readonly isRegistered: boolean;
  /** Current measured value (0 if not yet measured). */
  readonly currentValue: number;
  /** Whether the budget is currently exceeded. */
  readonly isExceeded: boolean;
  /** Utilization ratio (currentValue / threshold, 0-1+). */
  readonly utilization: number;
  /** Timestamp of last evaluation. */
  readonly lastEvaluation: number;
  /** Timestamp of last state change. */
  readonly lastChange: number;
}

/**
 * Runtime state for a single metric definition.
 */
export interface MetricRuntimeState {
  /** Metric identifier. */
  readonly id: MetricId;
  /** Whether this metric is enabled. */
  readonly enabled: boolean;
  /** Whether this metric has been registered. */
  readonly isRegistered: boolean;
  /** Latest recorded value (0 if not yet measured). */
  readonly latestValue: number;
  /** Timestamp of last recording. */
  readonly lastRecorded: number;
}

/**
 * Runtime state for a single budget profile.
 */
export interface BudgetProfileRuntimeState {
  /** Profile identifier. */
  readonly id: BudgetProfileId;
  /** Whether this profile is enabled. */
  readonly enabled: boolean;
  /** Whether this profile is currently active. */
  readonly isActive: boolean;
  /** Whether this profile has been registered. */
  readonly isRegistered: boolean;
}

// ── Recommendation ─────────────────────────────────────────

/**
 * A recommendation generated by the budget system.
 *
 * Recommendations are advisory — they suggest actions but do not
 * perform them. Future phases consume recommendations to make
 * decisions about quality, LOD, or feature disabling.
 */
export interface BudgetRecommendation {
  /** The budget that triggered this recommendation. */
  readonly budgetId: BudgetId;
  /** The budget category. */
  readonly category: BudgetCategory;
  /** The budget priority. */
  readonly priority: BudgetPriority;
  /** Human-readable recommendation message. */
  readonly message: string;
  /** Suggested action category (for programmatic consumption). */
  readonly action: 'reduce-quality' | 'reduce-complexity' | 'disable-feature' | 'monitor' | 'none';
  /** Severity of the recommendation. */
  readonly severity: 'info' | 'warning' | 'critical';
  /** Timestamp when this recommendation was generated. */
  readonly timestamp: number;
}

// ── Quality Profile ────────────────────────────────────────

/**
 * Immutable per-preset performance budget profile.
 *
 * Defines target budgets for each quality preset. Higher presets
 * allow higher budgets. No automatic switching — consumers read
 * and apply manually.
 */
export interface PerformanceBudgetQualityProfile {
  /** Quality preset this profile targets. */
  readonly preset: QualityPreset;
  /** Maximum frame time in milliseconds. */
  readonly maxFrameTime: number;
  /** Maximum draw calls per frame. */
  readonly maxDrawCalls: number;
  /** Maximum triangle count per frame. */
  readonly maxTriangles: number;
  /** Maximum texture memory in bytes. */
  readonly maxTextureMemory: number;
  /** Maximum geometry memory in bytes. */
  readonly maxGeometryMemory: number;
  /** Maximum number of compiled shaders. */
  readonly maxShaders: number;
  /** Maximum number of active materials. */
  readonly maxMaterials: number;
  /** Maximum number of active lights. */
  readonly maxLights: number;
  /** Maximum number of active particles. */
  readonly maxParticles: number;
  /** Maximum GPU time in milliseconds. */
  readonly maxGpuTime: number;
  /** Maximum CPU time in milliseconds. */
  readonly maxCpuTime: number;
  /** Maximum total asset memory in bytes. */
  readonly maxAssetMemory: number;
}

// ── Constraints ────────────────────────────────────────────

/**
 * Global performance budget constraints.
 *
 * Hard limits that the budget system enforces regardless of quality profile.
 */
export interface BudgetConstraints {
  /** Maximum total budgets that can be registered. */
  readonly maxBudgets: number;
  /** Maximum total metrics that can be registered. */
  readonly maxMetrics: number;
  /** Maximum total profiles that can be registered. */
  readonly maxProfiles: number;
  /** Maximum total recommendations that can be active. */
  readonly maxRecommendations: number;
  /** Maximum dependency depth for budget evaluation order. */
  readonly maxEvaluationDepth: number;
}

// ── Snapshot ───────────────────────────────────────────────

/**
 * Immutable snapshot of all performance budget state.
 *
 * Rebuilt on every mutation via RAF batching. Consumers read this
 * via `getSnapshot()` or the `usePerformanceBudget` hook.
 */
export interface BudgetSnapshot {
  /** Budget runtime states, keyed by budget ID. */
  readonly budgets: ReadonlyMap<BudgetId, BudgetRuntimeState>;
  /** Metric runtime states, keyed by metric ID. */
  readonly metrics: ReadonlyMap<MetricId, MetricRuntimeState>;
  /** Budget profile runtime states, keyed by profile ID. */
  readonly profiles: ReadonlyMap<BudgetProfileId, BudgetProfileRuntimeState>;
  /** Active quality profile (derived from quality preset). */
  readonly qualityProfile: PerformanceBudgetQualityProfile;
  /** Global constraints. */
  readonly constraints: BudgetConstraints;
  /** Active recommendations (most recent first). */
  readonly recommendations: readonly BudgetRecommendation[];
  /** Whether reduced motion is active. */
  readonly isReducedMotion: boolean;
  /** Active quality preset. */
  readonly qualityPreset: QualityPreset;
  /** Total registered budget count. */
  readonly budgetCount: number;
  /** Total registered metric count. */
  readonly metricCount: number;
  /** Total registered profile count. */
  readonly profileCount: number;
  /** Number of budgets currently exceeded. */
  readonly exceededCount: number;
  /** Number of active recommendations. */
  readonly recommendationCount: number;
  /** Monotonic revision counter — increments on every change. */
  readonly revision: number;
  /** Timestamp of the last snapshot update. */
  readonly timestamp: number;
}

// ── Registry ───────────────────────────────────────────────

/**
 * Read-only registry query interface for the performance budget system.
 *
 * Exposes computed queries over the current snapshot — budget counts,
 * filtered lists, threshold checks — without exposing mutation methods.
 */
export interface BudgetRegistry {
  /** Get a budget's runtime state by ID. */
  readonly getBudget: (id: BudgetId) => BudgetRuntimeState | undefined;
  /** Get a metric's runtime state by ID. */
  readonly getMetric: (id: MetricId) => MetricRuntimeState | undefined;
  /** Get a profile's runtime state by ID. */
  readonly getProfile: (id: BudgetProfileId) => BudgetProfileRuntimeState | undefined;
  /** All registered budget IDs. */
  readonly getBudgetIds: () => readonly BudgetId[];
  /** All registered metric IDs. */
  readonly getMetricIds: () => readonly MetricId[];
  /** All registered profile IDs. */
  readonly getProfileIds: () => readonly BudgetProfileId[];
  /** Whether a budget is registered. */
  readonly hasBudget: (id: BudgetId) => boolean;
  /** Whether a metric is registered. */
  readonly hasMetric: (id: MetricId) => boolean;
  /** Whether a profile is registered. */
  readonly hasProfile: (id: BudgetProfileId) => boolean;
  /** Total registered budget count. */
  readonly budgetCount: () => number;
  /** Total registered metric count. */
  readonly metricCount: () => number;
  /** Total registered profile count. */
  readonly profileCount: () => number;
  /** Get all enabled budgets. */
  readonly getEnabledBudgets: () => readonly BudgetId[];
  /** Get all exceeded budgets. */
  readonly getExceededBudgets: () => readonly BudgetId[];
  /** Get all budgets in a category. */
  readonly getBudgetsByCategory: (category: BudgetCategory) => readonly BudgetId[];
  /** Get all budgets by priority. */
  readonly getBudgetsByPriority: (priority: BudgetPriority) => readonly BudgetId[];
  /** Get all active recommendations. */
  readonly getRecommendations: () => readonly BudgetRecommendation[];
  /** Get the active quality profile. */
  readonly getQualityProfile: () => PerformanceBudgetQualityProfile;
}

// ── Subscription Types ─────────────────────────────────────

/** Selector function for budget snapshot slices. */
export type BudgetSelector<T> = (snapshot: BudgetSnapshot) => T;

/** Equality comparator for selector results. */
export type BudgetEquality<T> = (prev: T, next: T) => boolean;

/** Callback for budget state changes. */
export type BudgetCallback = () => void;

/** Unsubscribe function for budget subscriptions. */
export type BudgetUnsubscribe = () => void;

// ── Manager ────────────────────────────────────────────────

/**
 * The singleton performance budget manager interface.
 *
 * This is the single owner of all performance budget state. All hooks and
 * future consumers read from this instance. It contains no React.
 */
export interface BudgetManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => BudgetSnapshot;
  /** Subscribe to all budget state changes. */
  readonly subscribe: (callback: BudgetCallback) => BudgetUnsubscribe;
  /** Subscribe to a specific slice of budget state. */
  readonly subscribeSelector: <T>(
    selector: BudgetSelector<T>,
    callback: BudgetCallback,
    equalityFn?: BudgetEquality<T>,
  ) => BudgetUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — registers default categories and metrics. */
  readonly init: () => void;
  /** Destroy the manager — clears everything, resets state. */
  readonly destroy: () => void;

  /* ── Budget management ── */
  /** Register a budget (idempotent by ID). */
  readonly registerBudget: (options: BudgetOptions) => void;
  /** Unregister a budget. */
  readonly unregisterBudget: (id: BudgetId) => void;
  /** Get a budget definition by ID. */
  readonly getBudgetDefinition: (id: BudgetId) => BudgetDefinition | undefined;
  /** Get all budget definitions. */
  readonly getAllBudgetDefinitions: () => readonly BudgetDefinition[];
  /** Whether a budget is registered. */
  readonly hasBudget: (id: BudgetId) => boolean;
  /** Record a metric value. */
  readonly recordMetric: (id: MetricId, value: number) => void;

  /* ── Metric management ── */
  /** Register a metric (idempotent by ID). */
  readonly registerMetric: (options: MetricOptions) => void;
  /** Unregister a metric. */
  readonly unregisterMetric: (id: MetricId) => void;
  /** Whether a metric is registered. */
  readonly hasMetric: (id: MetricId) => boolean;

  /* ── Profile management ── */
  /** Register a budget profile (idempotent by ID). */
  readonly registerProfile: (options: BudgetProfileOptions) => void;
  /** Unregister a budget profile. */
  readonly unregisterProfile: (id: BudgetProfileId) => void;
  /** Whether a profile is registered. */
  readonly hasProfile: (id: BudgetProfileId) => boolean;

  /* ── Evaluation ── */
  /** Evaluate all budgets against current metrics. */
  readonly evaluate: () => void;
  /** Get all active recommendations. */
  readonly getRecommendations: () => readonly BudgetRecommendation[];

  /* ── Quality / Reduced Motion ── */
  /** Update the quality preset. */
  readonly setQualityPreset: (preset: QualityPreset) => void;
  /** Update reduced-motion state. */
  readonly setReducedMotion: (reduced: boolean) => void;

  /* ── Query ── */
  /** Get the read-only registry query interface. */
  readonly getRegistry: () => BudgetRegistry;
}
