/**
 * Three Performance Manager — Single Source of Rendering Capability & Budgets
 *
 * From TECHNICAL_ARCHITECTURE §9.4:
 * "Quality scales with the device. Never ship a single fixed budget."
 *
 * This module is the single owner of the device-capability probe and the
 * derived performance budgets. Everything downstream (provider, hooks, future
 * scene / camera / asset systems) reads immutable snapshots from here rather
 * than probing `navigator`/WebGL independently.
 *
 * Architecture:
 *   - Module-level state — no React dependency (mirrors scroll-state-manager)
 *   - Immutable, frozen snapshots via getSnapshot()
 *   - Subscriber notifications on re-probe
 *   - SSR-safe: init() is a no-op-safe default until a browser probe runs
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only. Adaptive runtime
 * FPS monitoring (regression / recovery) is intentionally deferred to Phase
 * 6.8; this manager establishes the static budget layer it will build on.
 */

import {
  probeDeviceCapabilities,
  deriveQualityPreset,
  resolveAdaptiveDpr,
  canRender3D as computeCanRender3D,
} from './three.config';

import {
  DEFAULT_PERFORMANCE_SNAPSHOT,
  QUALITY_SETTINGS,
  RESOURCE_BUDGETS,
} from './three.constants';

import type {
  ThreePerformanceSnapshot,
  ThreePerformanceManager,
  ThreePerformanceCallback,
  ThreePerformanceUnsubscribe,
  DeviceCapabilities,
} from './three.types';

// ── Module State ───────────────────────────────────────────

let snapshot: ThreePerformanceSnapshot = DEFAULT_PERFORMANCE_SNAPSHOT;
let initialized = false;
let revision = 0;

/** Subscribers notified whenever the snapshot changes. */
const subscribers = new Set<ThreePerformanceCallback>();

// ── Helpers ────────────────────────────────────────────────

/** Current high-resolution timestamp (SSR-safe). */
function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

/**
 * Build a frozen performance snapshot from a capability probe.
 *
 * Derives the recommended quality preset, its budgets, and the adaptive DPR
 * range, then stamps the revision + timestamp. Pure — no side effects.
 */
function buildSnapshot(
  capabilities: DeviceCapabilities,
): ThreePerformanceSnapshot {
  const estimatedQuality = deriveQualityPreset(capabilities);
  const settings = QUALITY_SETTINGS[estimatedQuality];
  const adaptiveDpr = resolveAdaptiveDpr(
    estimatedQuality,
    capabilities.pixelRatio,
  );

  return Object.freeze({
    capabilities,
    deviceTier: capabilities.tier,
    gpu: capabilities.gpu,
    estimatedQuality,
    adaptiveDpr,
    frame: settings.frame,
    resources: RESOURCE_BUDGETS[estimatedQuality],
    canRender3D: computeCanRender3D(capabilities),
    revision: (revision += 1),
    timestamp: now(),
  });
}

/** Notify every subscriber that the snapshot changed. */
function notifySubscribers(): void {
  subscribers.forEach((callback) => {
    callback();
  });
}

// ── Public API ─────────────────────────────────────────────

/**
 * Get the current immutable performance snapshot.
 *
 * Returns {@link DEFAULT_PERFORMANCE_SNAPSHOT} before `init()` and after
 * `destroy()`. Safe to call at any time, including during SSR.
 */
function getSnapshot(): ThreePerformanceSnapshot {
  return snapshot;
}

/**
 * Subscribe to snapshot changes.
 *
 * @param callback - Invoked (with no arguments) after every re-probe.
 * @returns An unsubscribe function.
 */
function subscribe(
  callback: ThreePerformanceCallback,
): ThreePerformanceUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/** Whether the manager has probed capability at least once. */
function isInitialized(): boolean {
  return initialized;
}

/**
 * Probe capability and build the initial snapshot.
 *
 * Idempotent — subsequent calls are no-ops. Call `refresh()` to force a
 * re-probe. Safe to call during SSR (produces an all-unknown snapshot).
 */
function init(): void {
  if (initialized) return;
  snapshot = buildSnapshot(probeDeviceCapabilities());
  initialized = true;
  notifySubscribers();
}

/**
 * Re-probe capability and rebuild the snapshot.
 *
 * Used after events that can change capability signals (viewport resize
 * crossing the mobile breakpoint, reduced-motion toggle). Always notifies
 * subscribers, even if the derived values are unchanged — consumers compare
 * with their own equality functions.
 */
function refresh(): void {
  snapshot = buildSnapshot(probeDeviceCapabilities());
  initialized = true;
  notifySubscribers();
}

/**
 * Reset to the uninitialized default snapshot and drop all subscribers.
 *
 * Mirrors scroll-state-manager.destroy(): used on teardown / page transition.
 */
function destroy(): void {
  snapshot = DEFAULT_PERFORMANCE_SNAPSHOT;
  initialized = false;
  subscribers.clear();
}

/**
 * The Three performance manager singleton.
 *
 * Frozen to prevent accidental method reassignment. This is the single owner
 * of rendering capability and budgets across the application.
 */
export const threePerformanceManager: ThreePerformanceManager = Object.freeze({
  getSnapshot,
  subscribe,
  isInitialized,
  init,
  refresh,
  destroy,
});
