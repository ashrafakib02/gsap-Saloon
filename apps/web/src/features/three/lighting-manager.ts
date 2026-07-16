/**
 * Lighting Manager — Single Source of Truth for Lighting State
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module is the single owner of all lighting state. It manages lighting
 * preset registration, environment management, quality adaptation, and
 * reduced-motion adaptation. Future systems (Scene materials, Environment maps,
 * Post-processing, Cinematic sequences) consume this state.
 *
 * Responsibilities:
 *   - Registration of lighting presets and layers
 *   - Active preset / environment management
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
 * Phase 6.4: Lighting architecture — infrastructure only, no lights.
 */

import { threePerformanceManager } from './three-performance';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  LightingPresetId,
  LightingPresetOptions,
  LightingPresetDefinition,
  LightingPresetState,
  LightingLayerId,
  LightingLayerState,
  LightingEnvironment,
  LightingSnapshot,
  LightingRegistry,
  LightingManager,
  LightingSelector,
  LightingEquality,
  LightingCallback,
  LightingUnsubscribe,
} from './lighting.types';

import type { QualityPreset } from './three.types';

import {
  DEFAULT_LIGHTING_SNAPSHOT,
  DEFAULT_LIGHTING_INTENSITY,
  DEFAULT_LIGHTING_COLOR_TEMPERATURE,
  DEFAULT_LIGHTING_AMBIENT_INTENSITY,
  DEFAULT_LIGHTING_DIRECTIONAL_INTENSITY,
  DEFAULT_LIGHTING_SHADOWS_ENABLED,
  DEFAULT_ACTIVE_LIGHTING_PRESET,
  DEFAULT_ACTIVE_LIGHTING_ENVIRONMENT,
} from './lighting.constants';

import {
  deriveLightingQualityProfile,
  deriveLightingConstraints,
  clampIntensity,
  clampColorTemperature,
  resolvePresetIntensity,
  resolvePresetColorTemperature,
  resolvePresetAmbientIntensity,
  resolvePresetDirectionalIntensity,
  resolvePresetEnvironment,
  resolvePresetShadows,
} from './lighting.config';

// ── Internal Types ───────────────────────────────────────

/** Mutable primary state for internal tracking. */
interface InternalPresetState {
  enabled: boolean;
  lastChange: number;
}

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: LightingSelector<unknown>;
  readonly callback: LightingCallback;
  readonly equalityFn: LightingEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ─────────────────────────────────────────

const presetDefinitions = new Map<LightingPresetId, LightingPresetDefinition>();
const presetStates = new Map<LightingPresetId, InternalPresetState>();
const layerStates = new Map<LightingLayerId, LightingLayerState>();

let snapshot: LightingSnapshot = DEFAULT_LIGHTING_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let qualityPreset: QualityPreset = 'medium';
let activePresetId: LightingPresetId | null = DEFAULT_ACTIVE_LIGHTING_PRESET;
let activeEnvironment: LightingEnvironment | null = DEFAULT_ACTIVE_LIGHTING_ENVIRONMENT;
let lightingIntensity = DEFAULT_LIGHTING_INTENSITY;
let lightingColorTemperature = DEFAULT_LIGHTING_COLOR_TEMPERATURE;
let lightingAmbientIntensity = DEFAULT_LIGHTING_AMBIENT_INTENSITY;
let lightingDirectionalIntensity = DEFAULT_LIGHTING_DIRECTIONAL_INTENSITY;
let lightingShadowsEnabled = DEFAULT_LIGHTING_SHADOWS_ENABLED;

/** All-change subscribers. */
const subscribers = new Set<LightingCallback>();
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
 * Derived fields (quality profile, constraints) are computed here so
 * mutations only touch primary state.
 */
function rebuildSnapshot(): void {
  const presets = new Map<LightingPresetId, LightingPresetState>();
  for (const [id] of presetDefinitions) {
    const internal = presetStates.get(id);
    presets.set(id, Object.freeze({
      id,
      enabled: internal?.enabled ?? true,
      isActive: id === activePresetId,
      isRegistered: true,
    }));
  }

  const layers = new Map<LightingLayerId, LightingLayerState>();
  for (const [id, state] of layerStates) {
    layers.set(id, state);
  }

  const qualityProfile = deriveLightingQualityProfile(qualityPreset);
  const constraints = deriveLightingConstraints(
    undefined,
    qualityProfile,
    reducedMotion,
  );

  revision += 1;

  snapshot = Object.freeze({
    presets,
    layers,
    activePresetId,
    activeEnvironment,
    intensity: lightingIntensity,
    colorTemperature: lightingColorTemperature,
    ambientIntensity: lightingAmbientIntensity,
    directionalIntensity: lightingDirectionalIntensity,
    shadowsEnabled: lightingShadowsEnabled,
    qualityProfile,
    constraints,
    isReducedMotion: reducedMotion,
    qualityPreset,
    presetCount: presetDefinitions.size,
    layerCount: layerStates.size,
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

function subscribe(callback: LightingCallback): LightingUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: LightingSelector<T>,
  callback: LightingCallback,
  equalityFn: LightingEquality<T> = Object.is as LightingEquality<T>,
): LightingUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as LightingEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Preset Registration ──────────────────────────────────

function registerPreset(options: LightingPresetOptions): void {
  const definition: LightingPresetDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    description: options.description ?? `${options.id} lighting preset`,
    intensity: options.intensity ?? resolvePresetIntensity(options.id),
    colorTemperature: options.colorTemperature ?? resolvePresetColorTemperature(options.id),
    ambientIntensity: options.ambientIntensity ?? resolvePresetAmbientIntensity(options.id),
    directionalIntensity: options.directionalIntensity ?? resolvePresetDirectionalIntensity(options.id),
    environment: options.environment ?? resolvePresetEnvironment(options.id),
    shadowsEnabled: options.shadowsEnabled ?? resolvePresetShadows(options.id),
    enabled: options.enabled ?? true,
  });

  presetDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!presetStates.has(definition.id)) {
    presetStates.set(definition.id, {
      enabled: definition.enabled,
      lastChange: now(),
    });
  }

  scheduleUpdate();
}

function unregisterPreset(id: LightingPresetId): void {
  presetDefinitions.delete(id);
  presetStates.delete(id);

  if (activePresetId === id) {
    activePresetId = null;
  }

  scheduleUpdate();
}

function getPresetDefinition(id: LightingPresetId): LightingPresetDefinition | undefined {
  return presetDefinitions.get(id);
}

function getAllPresetDefinitions(): readonly LightingPresetDefinition[] {
  return Array.from(presetDefinitions.values());
}

function hasPreset(id: LightingPresetId): boolean {
  return presetDefinitions.has(id);
}

// ── Active State Mutation ────────────────────────────────

function setActivePreset(id: LightingPresetId | null): void {
  if (id !== null && !presetDefinitions.has(id)) return;
  if (id === activePresetId) return;
  activePresetId = id;

  /* When a preset is activated, apply its default lighting settings. */
  if (id !== null) {
    const def = presetDefinitions.get(id);
    if (def) {
      lightingIntensity = clampIntensity(def.intensity);
      lightingColorTemperature = clampColorTemperature(def.colorTemperature);
      lightingAmbientIntensity = clampIntensity(def.ambientIntensity);
      lightingDirectionalIntensity = clampIntensity(def.directionalIntensity);
      activeEnvironment = def.environment;
      lightingShadowsEnabled = def.shadowsEnabled;
    }
  }

  scheduleUpdate();
}

function setEnvironment(environment: LightingEnvironment | null): void {
  if (environment === activeEnvironment) return;
  activeEnvironment = environment;
  scheduleUpdate();
}

function setIntensity(intensity: number): void {
  const clamped = clampIntensity(intensity);
  if (clamped === lightingIntensity) return;
  lightingIntensity = clamped;
  scheduleUpdate();
}

function setColorTemperature(temperature: number): void {
  const clamped = clampColorTemperature(temperature);
  if (clamped === lightingColorTemperature) return;
  lightingColorTemperature = clamped;
  scheduleUpdate();
}

function setAmbientIntensity(intensity: number): void {
  const clamped = clampIntensity(intensity);
  if (clamped === lightingAmbientIntensity) return;
  lightingAmbientIntensity = clamped;
  scheduleUpdate();
}

function setDirectionalIntensity(intensity: number): void {
  const clamped = clampIntensity(intensity);
  if (clamped === lightingDirectionalIntensity) return;
  lightingDirectionalIntensity = clamped;
  scheduleUpdate();
}

function setShadowsEnabled(enabled: boolean): void {
  if (enabled === lightingShadowsEnabled) return;
  lightingShadowsEnabled = enabled;
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

  /* Reduced motion disables shadows and reduces intensity. */
  if (reduced) {
    lightingShadowsEnabled = false;
    lightingIntensity = Math.min(lightingIntensity, 0.8);
  }

  scheduleUpdate();
}

// ── Registry ─────────────────────────────────────────────

function getRegistry(): LightingRegistry {
  return {
    getPreset: (id) => snapshot.presets.get(id),
    getLayer: (id) => snapshot.layers.get(id),
    getPresetIds: () => Array.from(presetDefinitions.keys()),
    getLayerIds: () => Array.from(layerStates.keys()),
    hasPreset: (id) => presetDefinitions.has(id),
    hasLayer: (id) => layerStates.has(id),
    presetCount: () => presetDefinitions.size,
    layerCount: () => layerStates.size,
    getEnabledPresets: () =>
      Array.from(presetDefinitions.entries())
        .filter(([, def]) => def.enabled)
        .map(([id]) => id),
    getEnabledLayers: () =>
      Array.from(layerStates.entries())
        .filter(([, state]) => state.enabled)
        .map(([id]) => id),
  };
}

// ── Lifecycle ────────────────────────────────────────────

/** Default lighting layer definitions — one per {@link LIGHTING_LAYERS}. */
const DEFAULT_LAYERS: ReadonlyArray<{ readonly id: LightingLayerId; readonly enabled: boolean }> = [
  { id: 'ambient', enabled: true },
  { id: 'directional', enabled: true },
  { id: 'hemisphere', enabled: true },
  { id: 'spot', enabled: true },
  { id: 'point', enabled: true },
  { id: 'rect-area', enabled: true },
  { id: 'environment', enabled: true },
  { id: 'rim', enabled: true },
  { id: 'fill', enabled: true },
  { id: 'key', enabled: true },
  { id: 'back', enabled: true },
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

  /* Register default layers (11 layers, one per light type). */
  for (const layer of DEFAULT_LAYERS) {
    layerStates.set(layer.id, Object.freeze({
      id: layer.id,
      enabled: layer.enabled,
      lightCount: 0,
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
  layerStates.clear();

  snapshot = DEFAULT_LIGHTING_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  qualityPreset = 'medium';
  activePresetId = DEFAULT_ACTIVE_LIGHTING_PRESET;
  activeEnvironment = DEFAULT_ACTIVE_LIGHTING_ENVIRONMENT;
  lightingIntensity = DEFAULT_LIGHTING_INTENSITY;
  lightingColorTemperature = DEFAULT_LIGHTING_COLOR_TEMPERATURE;
  lightingAmbientIntensity = DEFAULT_LIGHTING_AMBIENT_INTENSITY;
  lightingDirectionalIntensity = DEFAULT_LIGHTING_DIRECTIONAL_INTENSITY;
  lightingShadowsEnabled = DEFAULT_LIGHTING_SHADOWS_ENABLED;
  updatePending = false;
  initialized = false;
}

function getSnapshot(): LightingSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ─────────────────────────────────────

/**
 * The singleton lighting manager.
 *
 * This is the single owner of all lighting state. All hooks and future
 * consumers read from this instance.
 */
export const lightingManager: LightingManager = Object.freeze({
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
  setEnvironment,
  setIntensity,
  setColorTemperature,
  setAmbientIntensity,
  setDirectionalIntensity,
  setShadowsEnabled,
  setQualityPreset,
  setReducedMotion,
  getRegistry,
});
