/**
 * Performance Budget Manager — Single Source of Truth for Budget State
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 *
 * This module is the single owner of all performance budget state. It manages
 * budget registration, metric recording, profile management, threshold
 * evaluation, and recommendation generation. It stores metadata and
 * orchestrates budget STATE only — it never performs actual measurements,
 * FPS monitoring, or dynamic quality switching.
 *
 * Responsibilities:
 *   - Registration of budgets, metrics, and profiles
 *   - Metric value recording (metadata only, no measurement)
 *   - Threshold evaluation against recorded metrics
 *   - Recommendation generation from exceeded budgets
 *   - Quality adaptation (5 presets, per-preset budgets)
 *   - Reduced-motion adaptation (tightened constraints)
 *   - requestAnimationFrame batching — one rebuild per frame
 *   - Selector-based subscriptions
 *   - Immutable snapshots via getSnapshot()
 *   - Cleanup for page transitions
 *
 * Architecture:
 *   - Module-level mutable state — no React dependency
 *   - Consumes ThreePerformanceManager for quality integration
 *   - Reuses prefersReducedMotion for non-React reads
 *
 * Phase 6.8: Performance Budget — infrastructure only, no measurement.
 */

import { threePerformanceManager } from './three-performance';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  BudgetId,
  MetricId,
  BudgetProfileId,
  BudgetCategory,
  BudgetPriority,
  BudgetLifecycle,
  BudgetOptions,
  BudgetDefinition,
  MetricOptions,
  MetricDefinition,
  BudgetProfileOptions,
  BudgetProfileDefinition,
  BudgetRuntimeState,
  MetricRuntimeState,
  BudgetProfileRuntimeState,
  BudgetRecommendation,
  BudgetSnapshot,
  BudgetRegistry,
  BudgetManager,
  BudgetSelector,
  BudgetEquality,
  BudgetCallback,
  BudgetUnsubscribe,
} from './performance-budget.types';

import type { QualityPreset } from './three.types';

import {
  DEFAULT_BUDGET_SNAPSHOT,
  BUDGET_DEFAULT_CATEGORIES,
  BUDGET_DEFAULT_METRICS,
} from './performance-budget.constants';

import {
  deriveBudgetQualityProfile,
  deriveBudgetConstraints,
  evaluateThreshold,
  calculateUtilization,
} from './performance-budget.config';

// ── Internal Types ─────────────────────────────────────────

/** Mutable primary state for internal tracking. */
interface InternalBudgetState {
  lifecycle: BudgetLifecycle;
  enabled: boolean;
  currentValue: number;
  lastChange: number;
}

/** Mutable metric state for internal tracking. */
interface InternalMetricState {
  enabled: boolean;
  latestValue: number;
  lastRecorded: number;
}

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: BudgetSelector<unknown>;
  readonly callback: BudgetCallback;
  readonly equalityFn: BudgetEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ───────────────────────────────────────────

const budgetDefinitions = new Map<BudgetId, BudgetDefinition>();
const budgetStates = new Map<BudgetId, InternalBudgetState>();
const metricDefinitions = new Map<MetricId, MetricDefinition>();
const metricStates = new Map<MetricId, InternalMetricState>();
const profileDefinitions = new Map<BudgetProfileId, BudgetProfileDefinition>();
const profileStates = new Map<BudgetProfileId, { enabled: boolean; isActive: boolean }>();

let snapshot: BudgetSnapshot = DEFAULT_BUDGET_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let qualityPreset: QualityPreset = 'medium';
let activeProfileId: BudgetProfileId | null = null;
let recommendations: BudgetRecommendation[] = [];

/** All-change subscribers. */
const subscribers = new Set<BudgetCallback>();
/** Selector subscribers — notified only when the selected value changes. */
const selectorSubscribers = new Set<SelectorEntry>();

/** Cleanup handles for integrations. */
const cleanups: Array<() => void> = [];

/** requestAnimationFrame handle for batching. */
let rafId: number | null = null;
/** Whether a rebuild is pending this frame. */
let updatePending = false;

// ── Time Helper ────────────────────────────────────────────

/** Monotonic-ish timestamp, SSR-safe. */
function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

// ── Snapshot Scheduling ────────────────────────────────────

/**
 * Schedules a snapshot rebuild on the next animation frame.
 * Coalesces multiple mutations within a frame into a single update.
 */
function scheduleUpdate(): void {
  if (updatePending) return;
  updatePending = true;

  if (typeof requestAnimationFrame === 'undefined') {
    /* SSR / non-browser — rebuild synchronously */
    updatePending = false;
    rebuildSnapshot();
    notifySubscribers();
    return;
  }

  rafId = requestAnimationFrame(() => {
    rafId = null;
    updatePending = false;
    rebuildSnapshot();
    notifySubscribers();
  });
}

// ── Snapshot Rebuild ───────────────────────────────────────

/**
 * Rebuilds the immutable snapshot from current definitions and states.
 *
 * Derived fields (threshold evaluations, recommendations) are computed
 * here so mutations only touch primary state.
 */
function rebuildSnapshot(): void {
  /* ── Budget runtime states ── */
  const budgets = new Map<BudgetId, BudgetRuntimeState>();
  let exceededCount = 0;

  for (const def of budgetDefinitions.values()) {
    const internal = budgetStates.get(def.id);
    const lifecycle: BudgetLifecycle = internal?.lifecycle ?? 'registered';
    const enabled = internal?.enabled ?? def.enabled;
    const currentValue = internal?.currentValue ?? 0;
    const isExceeded = evaluateThreshold(currentValue, def.threshold, def.operator);
    const utilization = calculateUtilization(currentValue, def.threshold);

    budgets.set(def.id, Object.freeze({
      id: def.id,
      lifecycle,
      enabled,
      isRegistered: true,
      currentValue,
      isExceeded,
      utilization,
      lastEvaluation: now(),
      lastChange: internal?.lastChange ?? 0,
    }));

    if (isExceeded) exceededCount += 1;
  }

  /* ── Metric runtime states ── */
  const metrics = new Map<MetricId, MetricRuntimeState>();
  for (const def of metricDefinitions.values()) {
    const internal = metricStates.get(def.id);
    metrics.set(def.id, Object.freeze({
      id: def.id,
      enabled: internal?.enabled ?? def.enabled,
      isRegistered: true,
      latestValue: internal?.latestValue ?? 0,
      lastRecorded: internal?.lastRecorded ?? 0,
    }));
  }

  /* ── Profile runtime states ── */
  const profiles = new Map<BudgetProfileId, BudgetProfileRuntimeState>();
  for (const def of profileDefinitions.values()) {
    const internal = profileStates.get(def.id);
    profiles.set(def.id, Object.freeze({
      id: def.id,
      enabled: internal?.enabled ?? def.enabled,
      isActive: def.id === activeProfileId,
      isRegistered: true,
    }));
  }

  /* ── Quality profile and constraints ── */
  const qualityProfile = deriveBudgetQualityProfile(qualityPreset);
  const constraints = deriveBudgetConstraints(reducedMotion);

  /* ── Freeze recommendations ── */
  const frozenRecommendations = Object.freeze([...recommendations]);

  revision += 1;

  snapshot = Object.freeze({
    budgets,
    metrics,
    profiles,
    qualityProfile,
    constraints,
    recommendations: frozenRecommendations,
    isReducedMotion: reducedMotion,
    qualityPreset,
    budgetCount: budgetDefinitions.size,
    metricCount: metricDefinitions.size,
    profileCount: profileDefinitions.size,
    exceededCount,
    recommendationCount: recommendations.length,
    revision,
    timestamp: now(),
  });
}

// ── Subscriptions ──────────────────────────────────────────

/**
 * Notifies all-change subscribers, then selector subscribers whose
 * selected value changed.
 */
function notifySubscribers(): void {
  for (const subscriber of subscribers) {
    subscriber();
  }

  for (const entry of selectorSubscribers) {
    const newValue = entry.selector(snapshot);
    if (!entry.equalityFn(entry.lastValue, newValue)) {
      entry.lastValue = newValue;
      entry.callback();
    }
  }
}

function subscribe(callback: BudgetCallback): BudgetUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: BudgetSelector<T>,
  callback: BudgetCallback,
  equalityFn: BudgetEquality<T> = Object.is as BudgetEquality<T>,
): BudgetUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as BudgetEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Budget Registration ────────────────────────────────────

function registerBudget(options: BudgetOptions): void {
  const definition: BudgetDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    category: options.category ?? 'memory',
    priority: options.priority ?? 'normal',
    threshold: options.threshold ?? 0,
    operator: options.operator ?? 'lte',
    metricId: options.metricId ?? '',
    enabled: options.enabled ?? true,
    metadata: options.metadata ?? (Object.freeze({}) as Readonly<Record<string, unknown>>),
  });

  budgetDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!budgetStates.has(definition.id)) {
    budgetStates.set(definition.id, {
      lifecycle: 'registered',
      enabled: definition.enabled,
      currentValue: 0,
      lastChange: now(),
    });
  }

  scheduleUpdate();
}

function unregisterBudget(id: BudgetId): void {
  budgetDefinitions.delete(id);
  budgetStates.delete(id);
  scheduleUpdate();
}

function getBudgetDefinition(id: BudgetId): BudgetDefinition | undefined {
  return budgetDefinitions.get(id);
}

function getAllBudgetDefinitions(): readonly BudgetDefinition[] {
  return Array.from(budgetDefinitions.values());
}

function hasBudget(id: BudgetId): boolean {
  return budgetDefinitions.has(id);
}

// ── Metric Recording ───────────────────────────────────────

function recordMetric(id: MetricId, value: number): void {
  const internal = metricStates.get(id);
  if (!internal) return;

  internal.latestValue = value;
  internal.lastRecorded = now();

  /* Update any budgets linked to this metric. */
  for (const def of budgetDefinitions.values()) {
    if (def.metricId === id) {
      const budgetInternal = budgetStates.get(def.id);
      if (budgetInternal) {
        budgetInternal.currentValue = value;
        budgetInternal.lastChange = now();

        /* Transition lifecycle based on threshold. */
        const isExceeded = evaluateThreshold(value, def.threshold, def.operator);
        if (isExceeded && budgetInternal.lifecycle === 'active') {
          budgetInternal.lifecycle = 'exceeded';
        } else if (!isExceeded && budgetInternal.lifecycle === 'exceeded') {
          budgetInternal.lifecycle = 'active';
        }
      }
    }
  }

  scheduleUpdate();
}

// ── Metric Registration ────────────────────────────────────

function registerMetric(options: MetricOptions): void {
  const definition: MetricDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    category: options.category ?? 'memory',
    unit: options.unit ?? 'count',
    enabled: options.enabled ?? true,
  });

  metricDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!metricStates.has(definition.id)) {
    metricStates.set(definition.id, {
      enabled: definition.enabled,
      latestValue: 0,
      lastRecorded: 0,
    });
  }

  scheduleUpdate();
}

function unregisterMetric(id: MetricId): void {
  metricDefinitions.delete(id);
  metricStates.delete(id);
  scheduleUpdate();
}

function hasMetric(id: MetricId): boolean {
  return metricDefinitions.has(id);
}

// ── Profile Registration ───────────────────────────────────

function registerProfile(options: BudgetProfileOptions): void {
  const definition: BudgetProfileDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    qualityPreset: options.qualityPreset ?? 'medium',
    categoryLimits: options.categoryLimits ?? Object.freeze({}) as Partial<Record<BudgetCategory, number>>,
    enabled: options.enabled ?? true,
  });

  profileDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!profileStates.has(definition.id)) {
    profileStates.set(definition.id, {
      enabled: definition.enabled,
      isActive: false,
    });
  }

  scheduleUpdate();
}

function unregisterProfile(id: BudgetProfileId): void {
  profileDefinitions.delete(id);
  profileStates.delete(id);

  if (activeProfileId === id) {
    activeProfileId = null;
  }

  scheduleUpdate();
}

function hasProfile(id: BudgetProfileId): boolean {
  return profileDefinitions.has(id);
}

// ── Evaluation ─────────────────────────────────────────────

function evaluate(): void {
  const newRecommendations: BudgetRecommendation[] = [];

  for (const def of budgetDefinitions.values()) {
    const internal = budgetStates.get(def.id);
    if (!internal || !def.enabled) continue;

    const isExceeded = evaluateThreshold(
      internal.currentValue,
      def.threshold,
      def.operator,
    );

    if (isExceeded) {
      const severity = def.priority === 'critical' || def.priority === 'high'
        ? 'critical'
        : def.priority === 'normal'
          ? 'warning'
          : 'info';

      const action = def.priority === 'critical'
        ? 'reduce-quality'
        : def.priority === 'high'
          ? 'reduce-complexity'
          : def.priority === 'normal'
            ? 'disable-feature'
            : 'monitor';

      newRecommendations.push(Object.freeze({
        budgetId: def.id,
        category: def.category,
        priority: def.priority,
        message: `Budget "${def.label}" exceeded: ${internal.currentValue} ${def.operator} ${def.threshold}`,
        action,
        severity,
        timestamp: now(),
      }));
    }
  }

  recommendations = newRecommendations;
  scheduleUpdate();
}

function getRecommendations(): readonly BudgetRecommendation[] {
  return snapshot.recommendations;
}

// ── Quality / Reduced Motion ───────────────────────────────

function setQualityPreset(preset: QualityPreset): void {
  if (preset === qualityPreset) return;
  qualityPreset = preset;
  scheduleUpdate();
}

function setReducedMotion(reduced: boolean): void {
  if (reduced === reducedMotion) return;
  reducedMotion = reduced;
  scheduleUpdate();
}

// ── Registry ───────────────────────────────────────────────

function getRegistry(): BudgetRegistry {
  return {
    getBudget: (id) => snapshot.budgets.get(id),
    getMetric: (id) => snapshot.metrics.get(id),
    getProfile: (id) => snapshot.profiles.get(id),
    getBudgetIds: () => Array.from(budgetDefinitions.keys()),
    getMetricIds: () => Array.from(metricDefinitions.keys()),
    getProfileIds: () => Array.from(profileDefinitions.keys()),
    hasBudget: (id) => budgetDefinitions.has(id),
    hasMetric: (id) => metricDefinitions.has(id),
    hasProfile: (id) => profileDefinitions.has(id),
    budgetCount: () => budgetDefinitions.size,
    metricCount: () => metricDefinitions.size,
    profileCount: () => profileDefinitions.size,
    getEnabledBudgets: () =>
      Array.from(budgetDefinitions.entries())
        .filter(([, def]) => def.enabled)
        .map(([id]) => id),
    getExceededBudgets: () =>
      Array.from(budgetDefinitions.entries())
        .filter(([, def]) => {
          const internal = budgetStates.get(def.id);
          if (!internal) return false;
          return evaluateThreshold(internal.currentValue, def.threshold, def.operator);
        })
        .map(([id]) => id),
    getBudgetsByCategory: (category: BudgetCategory) =>
      Array.from(budgetDefinitions.values())
        .filter((def) => def.category === category)
        .map((def) => def.id),
    getBudgetsByPriority: (priority: BudgetPriority) =>
      Array.from(budgetDefinitions.values())
        .filter((def) => def.priority === priority)
        .map((def) => def.id),
    getRecommendations: () => snapshot.recommendations,
    getQualityProfile: () => snapshot.qualityProfile,
  };
}

// ── Lifecycle ──────────────────────────────────────────────

function init(): void {
  if (initialized) return;

  /* Ensure the performance manager is running. */
  threePerformanceManager.init();

  /* Seed reduced-motion from the SSR-safe reader. */
  reducedMotion = prefersReducedMotion();

  /* Seed quality from the performance manager snapshot. */
  qualityPreset = threePerformanceManager.getSnapshot().estimatedQuality;

  /* Subscribe to performance manager for quality changes. */
  const unsubscribeQuality = threePerformanceManager.subscribe(() => {
    const next = threePerformanceManager.getSnapshot().estimatedQuality;
    if (next !== qualityPreset) {
      qualityPreset = next;
      scheduleUpdate();
    }
  });
  cleanups.push(unsubscribeQuality);

  /* Register default categories (18 categories). */
  for (const category of BUDGET_DEFAULT_CATEGORIES) {
    /* Categories are tracked via budget definitions, not separate state. */
    void category;
  }

  /* Register default metrics (13 metrics). */
  for (const metric of BUDGET_DEFAULT_METRICS) {
    metricDefinitions.set(metric.id, Object.freeze({
      id: metric.id,
      label: metric.id,
      category: metric.category,
      unit: metric.unit,
      enabled: metric.enabled,
    }));

    metricStates.set(metric.id, {
      enabled: metric.enabled,
      latestValue: 0,
      lastRecorded: 0,
    });
  }

  initialized = true;
  scheduleUpdate();
}

function destroy(): void {
  if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  for (const cleanup of cleanups) {
    cleanup();
  }
  cleanups.length = 0;

  subscribers.clear();
  selectorSubscribers.clear();

  budgetDefinitions.clear();
  budgetStates.clear();
  metricDefinitions.clear();
  metricStates.clear();
  profileDefinitions.clear();
  profileStates.clear();

  recommendations = [];

  snapshot = DEFAULT_BUDGET_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  qualityPreset = 'medium';
  activeProfileId = null;
  updatePending = false;
  initialized = false;
}

function getSnapshot(): BudgetSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ───────────────────────────────────────

/**
 * The singleton performance budget manager.
 *
 * This is the single owner of all performance budget state. All hooks and
 * future consumers read from this instance.
 */
export const performanceBudgetManager: BudgetManager = Object.freeze({
  getSnapshot,
  subscribe,
  subscribeSelector,
  isInitialized,
  init,
  destroy,
  registerBudget,
  unregisterBudget,
  getBudgetDefinition,
  getAllBudgetDefinitions,
  hasBudget,
  recordMetric,
  registerMetric,
  unregisterMetric,
  hasMetric,
  registerProfile,
  unregisterProfile,
  hasProfile,
  evaluate,
  getRecommendations,
  setQualityPreset,
  setReducedMotion,
  getRegistry,
});
