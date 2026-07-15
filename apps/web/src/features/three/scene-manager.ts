/**
 * Scene Manager — Single Source of Truth for Scene State
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module is the single owner of all scene state. It manages scene
 * registration, stage transitions, visibility derivation, and layer/slot
 * coordination. Future systems (Camera, Lighting, Materials, Particles,
 * Post Processing) consume this state to drive their own visual effects.
 *
 * Responsibilities:
 *   - Registration of scenes, layers, and slots
 *   - Stage transitions with validation
 *   - Visibility derivation from stage + quality + reduced motion
 *   - Layer z-order coordination
 *   - Slot lifecycle management
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
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { threePerformanceManager } from './three-performance';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  SceneStage,
  SceneVisibility,
  SceneLayerId,
  SceneSlotId,
  SceneOptions,
  SceneDefinition,
  SceneState,
  SceneLayerDefinition,
  SceneLayerState,
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

import type { QualityPreset } from './three.types';

import {
  DEFAULT_SCENE_SNAPSHOT,
  DEFAULT_SCENE_STAGE,
  DEFAULT_SCENE_PRIORITY,
  DEFAULT_SCENE_GROUP,
} from './scene.constants';

import {
  resolveSceneLayers,
  resolveSceneSlots,
  deriveSceneVisibility,
  isValidStageTransition,
} from './scene.config';

// ── Internal Types ───────────────────────────────────────

/** Mutable primary state for internal tracking. */
interface InternalSceneState {
  stage: SceneStage;
  visibilityOverride: SceneVisibility | null;
  progress: number;
  lastChange: number;
}

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: SceneSelector<unknown>;
  readonly callback: SceneCallback;
  readonly equalityFn: SceneEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ─────────────────────────────────────────

const sceneDefinitions = new Map<string, SceneDefinition>();
const sceneStates = new Map<string, InternalSceneState>();
const layerDefinitions = new Map<SceneLayerId, SceneLayerDefinition>();
const layerStates = new Map<SceneLayerId, SceneLayerState>();
const slotDefinitions = new Map<SceneSlotId, SceneSlotDefinition>();
const slotStates = new Map<SceneSlotId, SceneSlotState>();

let snapshot: SceneSnapshot = DEFAULT_SCENE_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let qualityPreset: QualityPreset = 'medium';

/** All-change subscribers. */
const subscribers = new Set<SceneCallback>();
/** Selector subscribers — notified only when the selected value changes. */
const selectorSubscribers = new Set<SelectorEntry>();

/** Cleanup handles for integrations. */
const cleanups: Array<() => void> = [];

/** requestAnimationFrame handle for batching. */
let rafId: number | null = null;
/** Whether a rebuild is pending this frame. */
let updatePending = false;

// ── Time Helper ──────────────────────────────────────────

/** Monotonic-ish timestamp, SSR-safe. */
function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

// ── Snapshot Scheduling ──────────────────────────────────

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

// ── Snapshot Rebuild ─────────────────────────────────────

/**
 * Rebuilds the immutable snapshot from current definitions and states.
 *
 * Derived fields (visibility, aggregates) are computed here so
 * mutations only touch primary state.
 */
function rebuildSnapshot(): void {
  const scenes = new Map<string, SceneState>();
  const visibleSceneIds: string[] = [];
  const activeSceneIds: string[] = [];
  let totalProgress = 0;
  let sceneCount = 0;

  for (const def of sceneDefinitions.values()) {
    const internal = sceneStates.get(def.id);
    const stage: SceneStage = internal?.stage ?? def.stage;

    /* Derive visibility unless overridden. */
    const visibility: SceneVisibility =
      internal?.visibilityOverride ??
      deriveSceneVisibility(stage, reducedMotion, qualityPreset, def.layer);

    const progress = internal?.progress ?? (stage === 'active' ? 1 : 0);

    scenes.set(def.id, Object.freeze({
      id: def.id,
      stage,
      visibility,
      progress,
      lastChange: internal?.lastChange ?? 0,
    }));

    if (visibility === 'visible') visibleSceneIds.push(def.id);
    if (stage === 'active') activeSceneIds.push(def.id);
    totalProgress += progress;
    sceneCount += 1;
  }

  /* Layer states — derive sceneCount from definitions. */
  const layers = new Map<SceneLayerId, SceneLayerState>();
  for (const def of layerDefinitions.values()) {
    let count = 0;
    for (const s of sceneDefinitions.values()) {
      if (s.layer === def.id) count += 1;
    }

    layers.set(def.id, Object.freeze({
      id: def.id,
      enabled: def.enabled,
      sceneCount: count,
    }));
  }

  /* Slot states — derive from definitions. */
  const slots = new Map<SceneSlotId, SceneSlotState>();
  for (const def of slotDefinitions.values()) {
    slots.set(def.id, Object.freeze({
      id: def.id,
      enabled: def.enabled,
      isRegistered: true,
    }));
  }

  /* Stage map for all scenes. */
  const stages = new Map<string, SceneStage>();
  for (const [id, internal] of sceneStates) {
    stages.set(id, internal.stage);
  }

  const overallProgress = sceneCount > 0 ? totalProgress / sceneCount : 0;

  revision += 1;

  snapshot = Object.freeze({
    scenes,
    layers,
    slots,
    stages,
    visibleSceneIds: Object.freeze(visibleSceneIds),
    activeSceneIds: Object.freeze(activeSceneIds),
    overallProgress,
    isReducedMotion: reducedMotion,
    qualityPreset,
    revision,
    timestamp: now(),
  });
}

// ── Subscriptions ────────────────────────────────────────

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

function subscribe(callback: SceneCallback): SceneUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: SceneSelector<T>,
  callback: SceneCallback,
  equalityFn: SceneEquality<T> = Object.is as SceneEquality<T>,
): SceneUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as SceneEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Scene Registration ───────────────────────────────────

function registerScene(options: SceneOptions): void {
  const definition: SceneDefinition = Object.freeze({
    id: options.id,
    layer: options.layer ?? 'world',
    stage: options.stage ?? DEFAULT_SCENE_STAGE,
    priority: options.priority ?? DEFAULT_SCENE_PRIORITY,
    group: options.group ?? DEFAULT_SCENE_GROUP,
    enabled: options.enabled ?? true,
    label: options.label ?? options.id,
  });

  sceneDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!sceneStates.has(definition.id)) {
    sceneStates.set(definition.id, {
      stage: definition.stage,
      visibilityOverride: null,
      progress: 0,
      lastChange: now(),
    });
  }

  scheduleUpdate();
}

function unregisterScene(id: string): void {
  sceneDefinitions.delete(id);
  sceneStates.delete(id);
  scheduleUpdate();
}

function getSceneDefinition(id: string): SceneDefinition | undefined {
  return sceneDefinitions.get(id);
}

function getAllSceneDefinitions(): readonly SceneDefinition[] {
  return Array.from(sceneDefinitions.values());
}

function hasScene(id: string): boolean {
  return sceneDefinitions.has(id);
}

// ── Scene State Mutation ─────────────────────────────────

function setSceneStage(id: string, stage: SceneStage): void {
  const internal = sceneStates.get(id);
  if (!internal) return;

  /* Validate the transition. */
  if (!isValidStageTransition(internal.stage, stage)) return;

  internal.stage = stage;
  internal.visibilityOverride = null; /* Clear override on stage change. */
  internal.lastChange = now();
  scheduleUpdate();
}

function setSceneVisibility(id: string, visibility: SceneVisibility): void {
  const internal = sceneStates.get(id);
  if (!internal) return;

  internal.visibilityOverride = visibility;
  internal.lastChange = now();
  scheduleUpdate();
}

// ── Layer Queries ────────────────────────────────────────

function getLayer(id: SceneLayerId): SceneLayerDefinition | undefined {
  return layerDefinitions.get(id);
}

function getAllLayers(): readonly SceneLayerDefinition[] {
  return Array.from(layerDefinitions.values()).sort(
    (a, b) => a.order - b.order,
  );
}

function hasLayer(id: SceneLayerId): boolean {
  return layerDefinitions.has(id);
}

// ── Slot Queries ─────────────────────────────────────────

function getSlot(id: SceneSlotId): SceneSlotDefinition | undefined {
  return slotDefinitions.get(id);
}

function getAllSlots(): readonly SceneSlotDefinition[] {
  return Array.from(slotDefinitions.values());
}

function hasSlot(id: SceneSlotId): boolean {
  return slotDefinitions.has(id);
}

function registerSlot(options: { readonly id: SceneSlotId; readonly enabled?: boolean }): void {
  const definition: SceneSlotDefinition = Object.freeze({
    id: options.id,
    enabled: options.enabled ?? true,
  });

  slotDefinitions.set(definition.id, definition);

  if (!slotStates.has(definition.id)) {
    slotStates.set(definition.id, Object.freeze({
      id: definition.id,
      enabled: definition.enabled,
      isRegistered: true,
    }));
  }

  scheduleUpdate();
}

function unregisterSlot(id: SceneSlotId): void {
  slotDefinitions.delete(id);
  slotStates.delete(id);
  scheduleUpdate();
}

// ── Quality / Reduced Motion ─────────────────────────────

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

// ── Registry ─────────────────────────────────────────────

function getRegistry(): SceneRegistry {
  return {
    getScene: (id) => snapshot.scenes.get(id),
    getLayer: (id) => snapshot.layers.get(id),
    getSlot: (id) => snapshot.slots.get(id),
    getSceneIds: () => Array.from(sceneDefinitions.keys()),
    getScenesByStage: (stage) =>
      Array.from(sceneDefinitions.values())
        .filter((d) => (sceneStates.get(d.id)?.stage ?? d.stage) === stage)
        .map((d) => d.id),
    getScenesByLayer: (layer) =>
      Array.from(sceneDefinitions.values())
        .filter((d) => d.layer === layer)
        .map((d) => d.id),
    getScenesByGroup: (group) =>
      Array.from(sceneDefinitions.values())
        .filter((d) => d.group === group)
        .map((d) => d.id),
    hasScene: (id) => sceneDefinitions.has(id),
    sceneCount: () => sceneDefinitions.size,
  };
}

// ── Lifecycle ────────────────────────────────────────────

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

  /* Register default layers (7 layers, ordered by z-order). */
  for (const layer of resolveSceneLayers()) {
    layerDefinitions.set(layer.id, Object.freeze(layer));
    layerStates.set(layer.id, Object.freeze({
      id: layer.id,
      enabled: layer.enabled,
      sceneCount: 0,
    }));
  }

  /* Register default slots (9 slots). */
  for (const slot of resolveSceneSlots()) {
    slotDefinitions.set(slot.id, Object.freeze(slot));
    slotStates.set(slot.id, Object.freeze({
      id: slot.id,
      enabled: slot.enabled,
      isRegistered: true,
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

  sceneDefinitions.clear();
  sceneStates.clear();
  layerDefinitions.clear();
  layerStates.clear();
  slotDefinitions.clear();
  slotStates.clear();

  snapshot = DEFAULT_SCENE_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  qualityPreset = 'medium';
  updatePending = false;
  initialized = false;
}

function getSnapshot(): SceneSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ─────────────────────────────────────

/**
 * The singleton scene manager.
 *
 * This is the single owner of all scene state. All hooks and future
 * consumers read from this instance.
 */
export const sceneManager: SceneManager = Object.freeze({
  getSnapshot,
  subscribe,
  subscribeSelector,
  isInitialized,
  init,
  destroy,
  registerScene,
  unregisterScene,
  getSceneDefinition,
  getAllSceneDefinitions,
  hasScene,
  setSceneStage,
  setSceneVisibility,
  getLayer,
  getAllLayers,
  hasLayer,
  getSlot,
  getAllSlots,
  hasSlot,
  registerSlot,
  unregisterSlot,
  getRegistry,
  setQualityPreset,
  setReducedMotion,
});
