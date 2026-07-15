/**
 * Camera Manager — Single Source of Truth for Camera State
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module is the single owner of all camera state. It manages camera
 * preset registration, target registration, viewport adaptation, quality
 * adaptation, and reduced-motion adaptation. Future systems (Cinematic
 * transitions, Scroll camera, Interactive controls) consume this state.
 *
 * Responsibilities:
 *   - Registration of camera presets and targets
 *   - Active preset / target / mode management
 *   - Viewport adaptation
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
 * Phase 6.3: Camera architecture — infrastructure only, no camera movement.
 */

import { threePerformanceManager } from './three-performance';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  CameraPresetId,
  CameraPresetOptions,
  CameraPresetDefinition,
  CameraPresetState,
  CameraTarget,
  CameraTargetOptions,
  CameraTargetDefinition,
  CameraTargetState,
  CameraMode,
  CameraViewport,
  CameraSnapshot,
  CameraRegistry,
  CameraManager,
  CameraSelector,
  CameraEquality,
  CameraCallback,
  CameraUnsubscribe,
} from './camera.types';

import type { QualityPreset } from './three.types';

import {
  DEFAULT_CAMERA_SNAPSHOT,
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_NEAR,
  DEFAULT_CAMERA_FAR,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_MODE,
  DEFAULT_CAMERA_VIEWPORT,
  DEFAULT_CAMERA_CONSTRAINTS,
  DEFAULT_ACTIVE_PRESET,
  DEFAULT_ACTIVE_TARGET,
} from './camera.constants';

import {
  deriveCameraQualityProfile,
  deriveCameraConstraints,
  clampFov,
  resolvePresetPosition,
  resolvePresetLookAt,
  resolvePresetFov,
  resolvePresetNear,
  resolvePresetFar,
} from './camera.config';

// ── Internal Types ───────────────────────────────────────

/** Mutable primary state for internal tracking. */
interface InternalCameraState {
  enabled: boolean;
  lastChange: number;
}

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: CameraSelector<unknown>;
  readonly callback: CameraCallback;
  readonly equalityFn: CameraEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ─────────────────────────────────────────

const presetDefinitions = new Map<CameraPresetId, CameraPresetDefinition>();
const presetStates = new Map<CameraPresetId, InternalCameraState>();
const targetDefinitions = new Map<CameraTarget, CameraTargetDefinition>();
const targetStates = new Map<CameraTarget, InternalCameraState>();

let snapshot: CameraSnapshot = DEFAULT_CAMERA_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let qualityPreset: QualityPreset = 'medium';
let activePresetId: CameraPresetId | null = DEFAULT_ACTIVE_PRESET;
let activeTargetId: CameraTarget | null = DEFAULT_ACTIVE_TARGET;
let cameraMode: CameraMode = DEFAULT_CAMERA_MODE;
let cameraPosition: readonly [number, number, number] = DEFAULT_CAMERA_POSITION;
let cameraLookAt: readonly [number, number, number] = DEFAULT_CAMERA_LOOK_AT;
let cameraFov = DEFAULT_CAMERA_FOV;
let cameraNear = DEFAULT_CAMERA_NEAR;
let cameraFar = DEFAULT_CAMERA_FAR;
let cameraViewport: CameraViewport = DEFAULT_CAMERA_VIEWPORT;

/** All-change subscribers. */
const subscribers = new Set<CameraCallback>();
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
 * Derived fields (quality profile, constraints, viewport settings) are
 * computed here so mutations only touch primary state.
 */
function rebuildSnapshot(): void {
  const presets = new Map<CameraPresetId, CameraPresetState>();
  for (const [id, _def] of presetDefinitions) {
    const internal = presetStates.get(id);
    presets.set(id, Object.freeze({
      id,
      enabled: internal?.enabled ?? true,
      isActive: id === activePresetId,
      isRegistered: true,
    }));
  }

  const targets = new Map<CameraTarget, CameraTargetState>();
  for (const [id, _def] of targetDefinitions) {
    const internal = targetStates.get(id);
    targets.set(id, Object.freeze({
      id,
      enabled: internal?.enabled ?? true,
      isActive: id === activeTargetId,
      isRegistered: true,
    }));
  }

  const qualityProfile = deriveCameraQualityProfile(qualityPreset);
  const constraints = deriveCameraConstraints(DEFAULT_CAMERA_CONSTRAINTS, qualityProfile, reducedMotion);

  revision += 1;

  snapshot = Object.freeze({
    presets,
    targets,
    activePresetId,
    activeTargetId,
    mode: cameraMode,
    position: cameraPosition,
    lookAt: cameraLookAt,
    fov: cameraFov,
    near: cameraNear,
    far: cameraFar,
    viewport: cameraViewport,
    qualityProfile,
    constraints,
    isReducedMotion: reducedMotion,
    qualityPreset,
    presetCount: presetDefinitions.size,
    targetCount: targetDefinitions.size,
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

function subscribe(callback: CameraCallback): CameraUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: CameraSelector<T>,
  callback: CameraCallback,
  equalityFn: CameraEquality<T> = Object.is as CameraEquality<T>,
): CameraUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as CameraEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Preset Registration ──────────────────────────────────

function registerPreset(options: CameraPresetOptions): void {
  const definition: CameraPresetDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    description: options.description ?? `${options.id} camera preset`,
    fov: options.fov ?? resolvePresetFov(options.id),
    near: options.near ?? resolvePresetNear(options.id),
    far: options.far ?? resolvePresetFar(options.id),
    position: options.position ?? resolvePresetPosition(options.id),
    target: options.target ?? resolvePresetLookAt(options.id),
    mode: options.mode ?? DEFAULT_CAMERA_MODE,
    orbitEnabled: options.orbitEnabled ?? true,
    proceduralEnabled: options.proceduralEnabled ?? true,
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

function unregisterPreset(id: CameraPresetId): void {
  presetDefinitions.delete(id);
  presetStates.delete(id);

  if (activePresetId === id) {
    activePresetId = null;
  }

  scheduleUpdate();
}

function getPresetDefinition(id: CameraPresetId): CameraPresetDefinition | undefined {
  return presetDefinitions.get(id);
}

function getAllPresetDefinitions(): readonly CameraPresetDefinition[] {
  return Array.from(presetDefinitions.values());
}

function hasPreset(id: CameraPresetId): boolean {
  return presetDefinitions.has(id);
}

// ── Target Registration ──────────────────────────────────

function registerTarget(options: CameraTargetOptions): void {
  const definition: CameraTargetDefinition = Object.freeze({
    id: options.id,
    label: options.label ?? options.id,
    position: options.position ?? [0, 1, 0] as const,
    offset: options.offset ?? [0, 0, 0] as const,
    enabled: options.enabled ?? true,
  });

  targetDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent). */
  if (!targetStates.has(definition.id)) {
    targetStates.set(definition.id, {
      enabled: definition.enabled,
      lastChange: now(),
    });
  }

  scheduleUpdate();
}

function unregisterTarget(id: CameraTarget): void {
  targetDefinitions.delete(id);
  targetStates.delete(id);

  if (activeTargetId === id) {
    activeTargetId = null;
  }

  scheduleUpdate();
}

function getTargetDefinition(id: CameraTarget): CameraTargetDefinition | undefined {
  return targetDefinitions.get(id);
}

function getAllTargetDefinitions(): readonly CameraTargetDefinition[] {
  return Array.from(targetDefinitions.values());
}

function hasTarget(id: CameraTarget): boolean {
  return targetDefinitions.has(id);
}

// ── Active State Mutation ────────────────────────────────

function setActivePreset(id: CameraPresetId | null): void {
  if (id !== null && !presetDefinitions.has(id)) return;
  if (id === activePresetId) return;
  activePresetId = id;

  /* When a preset is activated, apply its default camera settings. */
  if (id !== null) {
    const def = presetDefinitions.get(id);
    if (def) {
      cameraFov = clampFov(def.fov, DEFAULT_CAMERA_CONSTRAINTS);
      cameraNear = def.near;
      cameraFar = def.far;
      cameraPosition = def.position;
      cameraLookAt = def.target;
      cameraMode = def.mode;
    }
  }

  scheduleUpdate();
}

function setActiveTarget(id: CameraTarget | null): void {
  if (id !== null && !targetDefinitions.has(id)) return;
  if (id === activeTargetId) return;
  activeTargetId = id;

  /* When a target is activated, update the lookAt to its position. */
  if (id !== null) {
    const def = targetDefinitions.get(id);
    if (def) {
      cameraLookAt = [
        def.position[0] + def.offset[0],
        def.position[1] + def.offset[1],
        def.position[2] + def.offset[2],
      ] as const;
    }
  }

  scheduleUpdate();
}

function setMode(mode: CameraMode): void {
  if (mode === cameraMode) return;
  cameraMode = mode;
  scheduleUpdate();
}

function setPosition(position: readonly [number, number, number]): void {
  cameraPosition = position;
  scheduleUpdate();
}

function setLookAt(lookAt: readonly [number, number, number]): void {
  cameraLookAt = lookAt;
  scheduleUpdate();
}

function setFov(fov: number): void {
  const clamped = clampFov(fov);
  if (clamped === cameraFov) return;
  cameraFov = clamped;
  scheduleUpdate();
}

function setNear(near: number): void {
  if (near === cameraNear) return;
  cameraNear = near;
  scheduleUpdate();
}

function setFar(far: number): void {
  if (far === cameraFar) return;
  cameraFar = far;
  scheduleUpdate();
}

// ── Viewport / Quality ───────────────────────────────────

function setViewport(viewport: CameraViewport): void {
  cameraViewport = viewport;
  scheduleUpdate();
}

function setQualityPreset(preset: QualityPreset): void {
  if (preset === qualityPreset) return;
  qualityPreset = preset;
  scheduleUpdate();
}

function setReducedMotion(reduced: boolean): void {
  if (reduced === reducedMotion) return;
  reducedMotion = reduced;

  /* Reduced motion locks the camera to static mode. */
  if (reduced) {
    cameraMode = 'static';
  }

  scheduleUpdate();
}

// ── Registry ─────────────────────────────────────────────

function getRegistry(): CameraRegistry {
  return {
    getPreset: (id) => snapshot.presets.get(id),
    getTarget: (id) => snapshot.targets.get(id),
    getPresetIds: () => Array.from(presetDefinitions.keys()),
    getTargetIds: () => Array.from(targetDefinitions.keys()),
    hasPreset: (id) => presetDefinitions.has(id),
    hasTarget: (id) => targetDefinitions.has(id),
    presetCount: () => presetDefinitions.size,
    targetCount: () => targetDefinitions.size,
    getEnabledPresets: () =>
      Array.from(presetDefinitions.entries())
        .filter(([, def]) => def.enabled)
        .map(([id]) => id),
    getEnabledTargets: () =>
      Array.from(targetDefinitions.entries())
        .filter(([, def]) => def.enabled)
        .map(([id]) => id),
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
  targetDefinitions.clear();
  targetStates.clear();

  snapshot = DEFAULT_CAMERA_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  qualityPreset = 'medium';
  activePresetId = DEFAULT_ACTIVE_PRESET;
  activeTargetId = DEFAULT_ACTIVE_TARGET;
  cameraMode = DEFAULT_CAMERA_MODE;
  cameraPosition = DEFAULT_CAMERA_POSITION;
  cameraLookAt = DEFAULT_CAMERA_LOOK_AT;
  cameraFov = DEFAULT_CAMERA_FOV;
  cameraNear = DEFAULT_CAMERA_NEAR;
  cameraFar = DEFAULT_CAMERA_FAR;
  cameraViewport = DEFAULT_CAMERA_VIEWPORT;
  updatePending = false;
  initialized = false;
}

function getSnapshot(): CameraSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ─────────────────────────────────────

/**
 * The singleton camera manager.
 *
 * This is the single owner of all camera state. All hooks and future
 * consumers read from this instance.
 */
export const cameraManager: CameraManager = Object.freeze({
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
  registerTarget,
  unregisterTarget,
  getTargetDefinition,
  getAllTargetDefinitions,
  hasTarget,
  setActiveTarget,
  setMode,
  setPosition,
  setLookAt,
  setFov,
  setNear,
  setFar,
  setViewport,
  setQualityPreset,
  setReducedMotion,
  getRegistry,
});
