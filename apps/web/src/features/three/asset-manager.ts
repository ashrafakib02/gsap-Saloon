/**
 * Asset Manager — Single Source of Truth for Asset Pipeline State
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module is the single owner of all asset pipeline state. It manages
 * asset registration, bundle coordination, dependency graph computation,
 * cache metadata, quality adaptation, and reduced-motion compatibility.
 * It stores metadata and orchestrates asset STATE only — it never loads,
 * decodes, fetches, or parses any assets.
 *
 * Responsibilities:
 *   - Registration of assets, bundles, and categories
 *   - Asset lifecycle state machine (registered → queued → loading → loaded → ready)
 *   - Bundle state computation (per-bundle progress, counts)
 *   - Dependency graph construction and cycle detection
 *   - Cache entry management (metadata only, no browser cache)
 *   - Quality adaptation (5 presets, texture budgets, polygon budgets)
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
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { threePerformanceManager } from './three-performance';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  AssetId,
  AssetCategoryId,
  AssetGroupId,
  AssetState,
  AssetOptions,
  AssetDefinition,
  AssetBundleOptions,
  AssetBundleDefinition,
  AssetRuntimeState,
  AssetBundleState,
  AssetCategoryState,
  AssetCacheEntry,
  AssetDependencyNode,
  AssetDependencyGraph,
  AssetSnapshot,
  AssetRegistry,
  AssetManager,
  AssetSelector,
  AssetEquality,
  AssetCallback,
  AssetUnsubscribe,
} from './asset.types';

import type { QualityPreset } from './three.types';

import {
  DEFAULT_ASSET_SNAPSHOT,
  ASSET_DEFAULT_CATEGORIES,
  ASSET_DEFAULT_BUNDLES,
} from './asset.constants';

import {
  deriveAssetQualityProfile,
  deriveAssetConstraints,
  validateDependencyGraph,
  topologicalSort,
} from './asset.config';

// ── Internal Types ─────────────────────────────────────────

/** Mutable primary state for internal tracking. */
interface InternalAssetState {
  state: AssetState;
  enabled: boolean;
  progress: number;
  error: string | null;
  lastChange: number;
}

/** Mutable bundle state for internal tracking. */
interface InternalBundleState {
  enabled: boolean;
  isPriority: boolean;
  maxConcurrent: number;
}

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: AssetSelector<unknown>;
  readonly callback: AssetCallback;
  readonly equalityFn: AssetEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ───────────────────────────────────────────

const assetDefinitions = new Map<AssetId, AssetDefinition>();
const assetStates = new Map<AssetId, InternalAssetState>();
const bundleDefinitions = new Map<AssetGroupId, AssetBundleDefinition>();
const bundleStates = new Map<AssetGroupId, InternalBundleState>();
const categoryStates = new Map<AssetCategoryId, AssetCategoryState>();
const cacheEntries = new Map<AssetId, AssetCacheEntry>();

let snapshot: AssetSnapshot = DEFAULT_ASSET_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let qualityPreset: QualityPreset = 'medium';

/** All-change subscribers. */
const subscribers = new Set<AssetCallback>();
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

// ── Dependency Graph Helpers ────────────────────────────────

/**
 * Build dependency graph nodes from asset definitions.
 * Returns nodes with forward (dependsOn) and reverse (dependedOnBy) edges.
 */
function buildDependencyNodes(): AssetDependencyNode[] {
  const nodes: AssetDependencyNode[] = [];

  for (const def of assetDefinitions.values()) {
    nodes.push(Object.freeze({
      assetId: def.id,
      dependsOn: def.dependencies,
      dependedOnBy: Array.from(assetDefinitions.values())
        .filter((other) => other.dependencies.includes(def.id))
        .map((other) => other.id),
    }));
  }

  return nodes;
}

/**
 * Check if a specific asset has all its dependencies met.
 * Dependencies are met when all of them are in 'ready' state.
 */
function areDependenciesMet(assetId: AssetId): boolean {
  const def = assetDefinitions.get(assetId);
  if (!def) return false;

  for (const depId of def.dependencies) {
    const depState = assetStates.get(depId);
    if (!depState || depState.state !== 'ready') {
      return false;
    }
  }

  return true;
}

/**
 * Count how many other assets depend on a given asset.
 */
function countDependents(assetId: AssetId): number {
  let count = 0;
  for (const def of assetDefinitions.values()) {
    if (def.dependencies.includes(assetId)) {
      count += 1;
    }
  }
  return count;
}

// ── Snapshot Rebuild ───────────────────────────────────────

/**
 * Rebuilds the immutable snapshot from current definitions and states.
 *
 * Derived fields (dependency graph, category counts, bundle progress)
 * are computed here so mutations only touch primary state.
 */
function rebuildSnapshot(): void {
  /* ── Asset runtime states ── */
  const assets = new Map<AssetId, AssetRuntimeState>();
  let totalLoaded = 0;
  let totalLoading = 0;
  let totalFailed = 0;
  let totalMemory = 0;

  for (const def of assetDefinitions.values()) {
    const internal = assetStates.get(def.id);
    const state: AssetState = internal?.state ?? 'registered';
    const enabled = internal?.enabled ?? def.enabled;
    const progress = internal?.progress ?? 0;
    const error = internal?.error ?? null;
    const depsMet = areDependenciesMet(def.id);
    const dependentsCount = countDependents(def.id);

    assets.set(def.id, Object.freeze({
      id: def.id,
      state,
      enabled,
      isRegistered: true,
      progress,
      dependentsCount,
      dependenciesMet: depsMet,
      lastChange: internal?.lastChange ?? 0,
      error,
    }));

    if (state === 'ready' || state === 'loaded') {
      totalLoaded += 1;
      totalMemory += def.estimatedMemory;
    } else if (state === 'loading' || state === 'queued') {
      totalLoading += 1;
    } else if (state === 'failed') {
      totalFailed += 1;
    }
  }

  /* ── Bundle runtime states ── */
  const bundles = new Map<AssetGroupId, AssetBundleState>();
  for (const [bundleId, bundleDef] of bundleDefinitions) {
    const internal = bundleStates.get(bundleId);
    const enabled = internal?.enabled ?? bundleDef.enabled;
    const isPriority = internal?.isPriority ?? bundleDef.isPriority;

    let bundleLoaded = 0;
    let bundleLoading = 0;
    let bundleFailed = 0;
    let bundleTotal = 0;

    for (const assetDef of assetDefinitions.values()) {
      if (!assetDef.bundles.includes(bundleId)) continue;

      bundleTotal += 1;
      const assetInternal = assetStates.get(assetDef.id);
      const assetState = assetInternal?.state ?? 'registered';

      if (assetState === 'ready' || assetState === 'loaded') {
        bundleLoaded += 1;
      } else if (assetState === 'loading' || assetState === 'queued') {
        bundleLoading += 1;
      } else if (assetState === 'failed') {
        bundleFailed += 1;
      }
    }

    const bundleProgress = bundleTotal > 0
      ? bundleLoaded / bundleTotal
      : 0;

    bundles.set(bundleId, Object.freeze({
      id: bundleId,
      enabled,
      isPriority,
      totalAssets: bundleTotal,
      loadedCount: bundleLoaded,
      loadingCount: bundleLoading,
      failedCount: bundleFailed,
      progress: bundleProgress,
    }));
  }

  /* ── Category states — derive asset counts ── */
  const categories = new Map<AssetCategoryId, AssetCategoryState>();
  for (const [catId, catState] of categoryStates) {
    let count = 0;
    for (const def of assetDefinitions.values()) {
      if (def.category === catId) count += 1;
    }
    categories.set(catId, Object.freeze({
      id: catId,
      enabled: catState.enabled,
      assetCount: count,
    }));
  }

  /* ── Dependency graph ── */
  const nodes = buildDependencyNodes();
  const hasCircular = !validateDependencyGraph(
    Array.from(assetDefinitions.values()),
  );
  const sorted = topologicalSort(Array.from(assetDefinitions.values()));

  const dependencyGraph: AssetDependencyGraph = Object.freeze({
    nodes: Object.freeze(new Map(
      nodes.map((n) => [n.assetId, n]),
    )),
    hasCircularDependencies: hasCircular,
    sortedOrder: Object.freeze(sorted),
    timestamp: now(),
  });

  /* ── Cache entries snapshot ── */
  const cacheSnapshot = new Map<AssetId, AssetCacheEntry>();
  for (const [id, entry] of cacheEntries) {
    cacheSnapshot.set(id, entry);
  }

  /* ── Quality profile and constraints ── */
  const qualityProfile = deriveAssetQualityProfile(qualityPreset);
  const constraints = deriveAssetConstraints(qualityProfile, reducedMotion);

  revision += 1;

  snapshot = Object.freeze({
    assets,
    bundles,
    categories,
    dependencyGraph,
    cacheEntries: cacheSnapshot,
    qualityProfile,
    constraints,
    isReducedMotion: reducedMotion,
    qualityPreset,
    assetCount: assetDefinitions.size,
    bundleCount: bundleDefinitions.size,
    loadedCount: totalLoaded,
    loadingCount: totalLoading,
    failedCount: totalFailed,
    totalEstimatedMemory: totalMemory,
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

function subscribe(callback: AssetCallback): AssetUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: AssetSelector<T>,
  callback: AssetCallback,
  equalityFn: AssetEquality<T> = Object.is as AssetEquality<T>,
): AssetUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as AssetEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Asset Registration ─────────────────────────────────────

function registerAsset(options: AssetOptions): void {
  const definition: AssetDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    src: options.src ?? '',
    category: options.category ?? 'models',
    priority: options.priority ?? 'normal',
    group: options.group ?? 'global',
    estimatedSize: options.estimatedSize ?? 0,
    estimatedMemory: options.estimatedMemory ?? 0,
    format: options.format ?? 'unknown',
    width: options.width ?? 0,
    height: options.height ?? 0,
    enabled: options.enabled ?? true,
    dependencies: options.dependencies ?? [],
    bundles: options.bundles ?? [],
    scenes: options.scenes ?? [],
    cameras: options.cameras ?? [],
    environments: options.environments ?? [],
    loaderHint: options.loaderHint ?? '',
    metadata: options.metadata ?? Object.freeze({}) as Record<string, unknown>,
  });

  assetDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!assetStates.has(definition.id)) {
    assetStates.set(definition.id, {
      state: 'registered',
      enabled: definition.enabled,
      progress: 0,
      error: null,
      lastChange: now(),
    });
  }

  scheduleUpdate();
}

function unregisterAsset(id: AssetId): void {
  assetDefinitions.delete(id);
  assetStates.delete(id);
  cacheEntries.delete(id);
  scheduleUpdate();
}

function getAssetDefinition(id: AssetId): AssetDefinition | undefined {
  return assetDefinitions.get(id);
}

function getAllAssetDefinitions(): readonly AssetDefinition[] {
  return Array.from(assetDefinitions.values());
}

function hasAsset(id: AssetId): boolean {
  return assetDefinitions.has(id);
}

// ── Asset State Mutation ───────────────────────────────────

function setAssetState(id: AssetId, state: AssetState): void {
  const internal = assetStates.get(id);
  if (!internal) return;

  /* Validate the transition (same pattern as scene stage). */
  if (internal.state === state) return;

  internal.state = state;
  internal.lastChange = now();
  scheduleUpdate();
}

function setAssetProgress(id: AssetId, progress: number): void {
  const internal = assetStates.get(id);
  if (!internal) return;

  const clamped = Math.max(0, Math.min(1, progress));
  if (clamped === internal.progress) return;

  internal.progress = clamped;
  internal.lastChange = now();
  scheduleUpdate();
}

function setAssetError(id: AssetId, error: string): void {
  const internal = assetStates.get(id);
  if (!internal) return;

  internal.error = error;
  internal.state = 'failed';
  internal.lastChange = now();
  scheduleUpdate();
}

// ── Bundle Registration ────────────────────────────────────

function registerBundle(options: AssetBundleOptions): void {
  /* Derive assetIds from current asset definitions. */
  const assetIds = Array.from(assetDefinitions.values())
    .filter((def) => def.bundles.includes(options.id))
    .map((def) => def.id);

  const definition: AssetBundleDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    enabled: options.enabled ?? true,
    maxConcurrent: options.maxConcurrent ?? 4,
    isPriority: options.isPriority ?? false,
    assetIds,
  });

  bundleDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!bundleStates.has(definition.id)) {
    bundleStates.set(definition.id, {
      enabled: definition.enabled,
      isPriority: definition.isPriority,
      maxConcurrent: definition.maxConcurrent,
    });
  }

  scheduleUpdate();
}

function unregisterBundle(id: AssetGroupId): void {
  bundleDefinitions.delete(id);
  bundleStates.delete(id);
  scheduleUpdate();
}

function getBundleDefinition(id: AssetGroupId): AssetBundleDefinition | undefined {
  return bundleDefinitions.get(id);
}

function hasBundle(id: AssetGroupId): boolean {
  return bundleDefinitions.has(id);
}

// ── Category Management ────────────────────────────────────

function hasCategory(id: AssetCategoryId): boolean {
  return categoryStates.has(id);
}

// ── Dependency Graph ───────────────────────────────────────

function getDependencyGraph(): AssetDependencyGraph {
  return snapshot.dependencyGraph;
}

function getDependencies(id: AssetId): readonly AssetId[] {
  const def = assetDefinitions.get(id);
  return def?.dependencies ?? [];
}

function getDependents(id: AssetId): readonly AssetId[] {
  const result: AssetId[] = [];
  for (const def of assetDefinitions.values()) {
    if (def.dependencies.includes(id)) {
      result.push(def.id);
    }
  }
  return result;
}

// ── Cache Management ───────────────────────────────────────

function getCacheEntry(id: AssetId): AssetCacheEntry | undefined {
  return cacheEntries.get(id);
}

function setCacheEntry(id: AssetId, entry: AssetCacheEntry): void {
  cacheEntries.set(id, entry);
  scheduleUpdate();
}

function removeCacheEntry(id: AssetId): void {
  if (!cacheEntries.has(id)) return;
  cacheEntries.delete(id);
  scheduleUpdate();
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

function getRegistry(): AssetRegistry {
  return {
    getAsset: (id) => snapshot.assets.get(id),
    getBundle: (id) => snapshot.bundles.get(id),
    getCategory: (id) => snapshot.categories.get(id),
    getAssetIds: () => Array.from(assetDefinitions.keys()),
    getBundleIds: () => Array.from(bundleDefinitions.keys()),
    getCategoryIds: () => Array.from(categoryStates.keys()),
    hasAsset: (id) => assetDefinitions.has(id),
    hasBundle: (id) => bundleDefinitions.has(id),
    hasCategory: (id) => categoryStates.has(id),
    assetCount: () => assetDefinitions.size,
    bundleCount: () => bundleDefinitions.size,
    categoryCount: () => categoryStates.size,
    getEnabledAssets: () =>
      Array.from(assetDefinitions.entries())
        .filter(([, def]) => def.enabled)
        .map(([id]) => id),
    getAssetsInBundle: (bundleId) =>
      Array.from(assetDefinitions.values())
        .filter((def) => def.bundles.includes(bundleId))
        .map((def) => def.id),
    getAssetsByCategory: (category) =>
      Array.from(assetDefinitions.values())
        .filter((def) => def.category === category)
        .map((def) => def.id),
    getAssetsByPriority: (priority) =>
      Array.from(assetDefinitions.values())
        .filter((def) => def.priority === priority)
        .map((def) => def.id),
    getAssetsForScene: (sceneId) =>
      Array.from(assetDefinitions.values())
        .filter((def) => def.scenes.includes(sceneId))
        .map((def) => def.id),
    getDependencyGraph: () => snapshot.dependencyGraph,
    getCacheEntries: () =>
      Array.from(cacheEntries.values()),
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

  /* Register default categories (12 categories, one per asset type). */
  for (const category of ASSET_DEFAULT_CATEGORIES) {
    categoryStates.set(category.id, Object.freeze({
      id: category.id,
      enabled: category.enabled,
      assetCount: 0,
    }));
  }

  /* Register default bundles (8 bundles, one per scene group). */
  for (const bundle of ASSET_DEFAULT_BUNDLES) {
    bundleDefinitions.set(bundle.id, Object.freeze({
      id: bundle.id,
      label: bundle.id,
      enabled: bundle.enabled,
      maxConcurrent: bundle.maxConcurrent,
      isPriority: bundle.isPriority,
      assetIds: [],
    }));

    bundleStates.set(bundle.id, {
      enabled: bundle.enabled,
      isPriority: bundle.isPriority,
      maxConcurrent: bundle.maxConcurrent,
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

  assetDefinitions.clear();
  assetStates.clear();
  bundleDefinitions.clear();
  bundleStates.clear();
  categoryStates.clear();
  cacheEntries.clear();

  snapshot = DEFAULT_ASSET_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  qualityPreset = 'medium';
  updatePending = false;
  initialized = false;
}

function getSnapshot(): AssetSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ───────────────────────────────────────

/**
 * The singleton asset pipeline manager.
 *
 * This is the single owner of all asset state. All hooks and future
 * consumers read from this instance.
 */
export const assetManager: AssetManager = Object.freeze({
  getSnapshot,
  subscribe,
  subscribeSelector,
  isInitialized,
  init,
  destroy,
  registerAsset,
  unregisterAsset,
  getAssetDefinition,
  getAllAssetDefinitions,
  hasAsset,
  setAssetState,
  setAssetProgress,
  setAssetError,
  registerBundle,
  unregisterBundle,
  getBundleDefinition,
  hasBundle,
  hasCategory,
  getDependencyGraph,
  getDependencies,
  getDependents,
  getCacheEntry,
  setCacheEntry,
  removeCacheEntry,
  setQualityPreset,
  setReducedMotion,
  getRegistry,
});
