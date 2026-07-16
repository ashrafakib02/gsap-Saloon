/**
 * Environment Manager — Single Source of Truth for Environment State
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module is the single owner of all environment state. It manages environment
 * preset registration, category management, group management, quality adaptation,
 * and reduced-motion compatibility. Future systems (HDRI loading, sky rendering,
 * fog generation, atmosphere, weather) consume this state.
 *
 * Responsibilities:
 *   - Registration of environment presets, categories, and groups
 *   - Active preset management
 *   - Quality adaptation
 *   - Reduced-motion adaptation
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
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { threePerformanceManager } from './three-performance';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  EnvironmentPresetId,
  EnvironmentPresetOptions,
  EnvironmentPresetDefinition,
  EnvironmentPresetState,
  EnvironmentCategoryId,
  EnvironmentCategoryState,
  EnvironmentGroupId,
  EnvironmentGroupState,
  EnvironmentLifecycleState,
  EnvironmentSnapshot,
  EnvironmentRegistry,
  EnvironmentManager,
  EnvironmentSelector,
  EnvironmentEquality,
  EnvironmentCallback,
  EnvironmentUnsubscribe,
} from './environment.types';

import type { QualityPreset } from './three.types';

import {
  DEFAULT_ENVIRONMENT_SNAPSHOT,
  DEFAULT_ACTIVE_ENVIRONMENT_PRESET,
} from './environment.constants';

import {
  deriveEnvironmentQualityProfile,
  deriveEnvironmentConstraints,
  resolvePresetCategory,
  resolvePresetPriority,
  resolvePresetGroup,
} from './environment.config';

// ── Internal Types ─────────────────────────────────────────

/** Mutable primary state for internal tracking. */
interface InternalPresetState {
  enabled: boolean;
  lifecycle: EnvironmentLifecycleState;
  lastChange: number;
}

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: EnvironmentSelector<unknown>;
  readonly callback: EnvironmentCallback;
  readonly equalityFn: EnvironmentEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ───────────────────────────────────────────

const presetDefinitions = new Map<EnvironmentPresetId, EnvironmentPresetDefinition>();
const presetStates = new Map<EnvironmentPresetId, InternalPresetState>();
const categoryStates = new Map<EnvironmentCategoryId, EnvironmentCategoryState>();
const groupStates = new Map<EnvironmentGroupId, EnvironmentGroupState>();

let snapshot: EnvironmentSnapshot = DEFAULT_ENVIRONMENT_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let qualityPreset: QualityPreset = 'medium';
let activePresetId: EnvironmentPresetId | null = DEFAULT_ACTIVE_ENVIRONMENT_PRESET;

/** All-change subscribers. */
const subscribers = new Set<EnvironmentCallback>();
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
 * Derived fields (quality profile, constraints) are computed here so
 * mutations only touch primary state.
 */
function rebuildSnapshot(): void {
  const presets = new Map<EnvironmentPresetId, EnvironmentPresetState>();
  for (const [id] of presetDefinitions) {
    const internal = presetStates.get(id);
    presets.set(id, Object.freeze({
      id,
      enabled: internal?.enabled ?? true,
      isActive: id === activePresetId,
      isRegistered: true,
      lifecycle: internal?.lifecycle ?? 'registered',
    }));
  }

  const categories = new Map<EnvironmentCategoryId, EnvironmentCategoryState>();
  for (const [id, state] of categoryStates) {
    categories.set(id, state);
  }

  const groups = new Map<EnvironmentGroupId, EnvironmentGroupState>();
  for (const [id, state] of groupStates) {
    groups.set(id, state);
  }

  const qualityProfile = deriveEnvironmentQualityProfile(qualityPreset);
  const constraints = deriveEnvironmentConstraints(
    undefined,
    qualityProfile,
    reducedMotion,
  );

  revision += 1;

  snapshot = Object.freeze({
    presets,
    categories,
    groups,
    activePresetId,
    qualityProfile,
    constraints,
    isReducedMotion: reducedMotion,
    qualityPreset,
    presetCount: presetDefinitions.size,
    categoryCount: categoryStates.size,
    groupCount: groupStates.size,
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

function subscribe(callback: EnvironmentCallback): EnvironmentUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: EnvironmentSelector<T>,
  callback: EnvironmentCallback,
  equalityFn: EnvironmentEquality<T> = Object.is as EnvironmentEquality<T>,
): EnvironmentUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as EnvironmentEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Preset Registration ────────────────────────────────────

function registerPreset(options: EnvironmentPresetOptions): void {
  const definition: EnvironmentPresetDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    description: options.description ?? `${options.id} environment preset`,
    category: options.category ?? resolvePresetCategory(options.id),
    priority: options.priority ?? resolvePresetPriority(options.id),
    group: options.group ?? resolvePresetGroup(options.id),
    enabled: options.enabled ?? true,
  });

  presetDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!presetStates.has(definition.id)) {
    presetStates.set(definition.id, {
      enabled: definition.enabled,
      lifecycle: 'registered',
      lastChange: now(),
    });
  }

  scheduleUpdate();
}

function unregisterPreset(id: EnvironmentPresetId): void {
  presetDefinitions.delete(id);
  presetStates.delete(id);

  if (activePresetId === id) {
    activePresetId = null;
  }

  scheduleUpdate();
}

function getPresetDefinition(id: EnvironmentPresetId): EnvironmentPresetDefinition | undefined {
  return presetDefinitions.get(id);
}

function getAllPresetDefinitions(): readonly EnvironmentPresetDefinition[] {
  return Array.from(presetDefinitions.values());
}

function hasPreset(id: EnvironmentPresetId): boolean {
  return presetDefinitions.has(id);
}

// ── Active State Mutation ──────────────────────────────────

function setActivePreset(id: EnvironmentPresetId | null): void {
  if (id !== null && !presetDefinitions.has(id)) return;
  if (id === activePresetId) return;
  activePresetId = id;
  scheduleUpdate();
}

// ── Category Management ────────────────────────────────────

function registerCategory(id: EnvironmentCategoryId, enabled: boolean = true): void {
  if (categoryStates.has(id)) return;

  categoryStates.set(id, Object.freeze({
    id,
    enabled,
    presetCount: 0,
  }));

  scheduleUpdate();
}

function unregisterCategory(id: EnvironmentCategoryId): void {
  if (!categoryStates.has(id)) return;
  categoryStates.delete(id);
  scheduleUpdate();
}

function hasCategory(id: EnvironmentCategoryId): boolean {
  return categoryStates.has(id);
}

// ── Group Management ───────────────────────────────────────

function registerGroup(id: EnvironmentGroupId, enabled: boolean = true): void {
  if (groupStates.has(id)) return;

  groupStates.set(id, Object.freeze({
    id,
    enabled,
    presetCount: 0,
  }));

  scheduleUpdate();
}

function unregisterGroup(id: EnvironmentGroupId): void {
  if (!groupStates.has(id)) return;
  groupStates.delete(id);
  scheduleUpdate();
}

function hasGroup(id: EnvironmentGroupId): boolean {
  return groupStates.has(id);
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

function getRegistry(): EnvironmentRegistry {
  return {
    getPreset: (id) => snapshot.presets.get(id),
    getCategory: (id) => snapshot.categories.get(id),
    getGroup: (id) => snapshot.groups.get(id),
    getPresetIds: () => Array.from(presetDefinitions.keys()),
    getCategoryIds: () => Array.from(categoryStates.keys()),
    getGroupIds: () => Array.from(groupStates.keys()),
    hasPreset: (id) => presetDefinitions.has(id),
    hasCategory: (id) => categoryStates.has(id),
    hasGroup: (id) => groupStates.has(id),
    presetCount: () => presetDefinitions.size,
    categoryCount: () => categoryStates.size,
    groupCount: () => groupStates.size,
    getEnabledPresets: () =>
      Array.from(presetDefinitions.entries())
        .filter(([, def]) => def.enabled)
        .map(([id]) => id),
    getEnabledCategories: () =>
      Array.from(categoryStates.entries())
        .filter(([, state]) => state.enabled)
        .map(([id]) => id),
    getEnabledGroups: () =>
      Array.from(groupStates.entries())
        .filter(([, state]) => state.enabled)
        .map(([id]) => id),
  };
}

// ── Lifecycle ──────────────────────────────────────────────

/** Default environment category definitions — one per {@link ENVIRONMENT_CATEGORIES}. */
const DEFAULT_CATEGORIES: ReadonlyArray<{ readonly id: EnvironmentCategoryId; readonly enabled: boolean }> = [
  { id: 'interior', enabled: true },
  { id: 'studio', enabled: true },
  { id: 'architectural', enabled: true },
  { id: 'natural', enabled: true },
  { id: 'procedural', enabled: true },
  { id: 'cinematic', enabled: true },
  { id: 'minimal', enabled: true },
  { id: 'debug', enabled: true },
  { id: 'future-custom', enabled: true },
];

/** Default environment group definitions — one per {@link ENVIRONMENT_GROUPS}. */
const DEFAULT_GROUPS: ReadonlyArray<{ readonly id: EnvironmentGroupId; readonly enabled: boolean }> = [
  { id: 'spatial', enabled: true },
  { id: 'lighting', enabled: true },
  { id: 'atmospheric', enabled: true },
  { id: 'procedural', enabled: true },
  { id: 'utility', enabled: true },
];

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

  /* Register default categories (9 categories, one per environment type). */
  for (const category of DEFAULT_CATEGORIES) {
    categoryStates.set(category.id, Object.freeze({
      id: category.id,
      enabled: category.enabled,
      presetCount: 0,
    }));
  }

  /* Register default groups (5 groups, one per environment cluster). */
  for (const group of DEFAULT_GROUPS) {
    groupStates.set(group.id, Object.freeze({
      id: group.id,
      enabled: group.enabled,
      presetCount: 0,
    }));
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

  presetDefinitions.clear();
  presetStates.clear();
  categoryStates.clear();
  groupStates.clear();

  snapshot = DEFAULT_ENVIRONMENT_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  qualityPreset = 'medium';
  activePresetId = DEFAULT_ACTIVE_ENVIRONMENT_PRESET;
  updatePending = false;
  initialized = false;
}

function getSnapshot(): EnvironmentSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ───────────────────────────────────────

/**
 * The singleton environment manager.
 *
 * This is the single owner of all environment state. All hooks and future
 * consumers read from this instance.
 */
export const environmentManager: EnvironmentManager = Object.freeze({
  getSnapshot,
  subscribe,
  subscribeSelector,
  isInitialized,
  init,
  destroy,
  registerPreset,
  unregisterPreset,
  getPresetDefinition,
  getAllPresetDefinitions,
  hasPreset,
  setActivePreset,
  registerCategory,
  unregisterCategory,
  hasCategory,
  registerGroup,
  unregisterGroup,
  hasGroup,
  setQualityPreset,
  setReducedMotion,
  getRegistry,
});
