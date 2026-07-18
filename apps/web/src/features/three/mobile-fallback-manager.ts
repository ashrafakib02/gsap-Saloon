/**
 * Mobile Fallback Manager — Single Source of Truth for Mobile Capability & Fallback State
 *
 * From TECHNICAL_ARCHITECTURE §9:
 * "The 3D layer is progressive enhancement. It must degrade gracefully on
 *  every axis — WebGL support, device capability, reduced motion, and
 *  viewport — without ever blocking the core experience."
 *
 * This module is the single owner of all mobile fallback state. It manages
 * device tier profiles, capability rules, fallback strategies, feature flags,
 * compatibility matrix entries, recommendation generation, and snapshot
 * generation. It stores metadata and orchestrates fallback STATE only — it
 * never disables rendering, never switches strategies at runtime, and never
 * adapts the renderer.
 *
 * Responsibilities:
 *   - Registration of profiles, rules, feature flags, compatibility entries
 *   - Mobile profile management (active tier)
 *   - Capability derivation from profiles
 *   - Rule evaluation and recommendation generation
 *   - Feature flag resolution
 *   - Compatibility matrix evaluation
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
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { threePerformanceManager } from './three-performance';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  MobileProfile,
  MobileCapabilityCategory,
  MobileCapabilityProfile,
  MobileFallbackRule,
  MobileFeatureFlag,
  MobileCompatibilityEntry,
  MobileCapabilityEntry,
  MobileFallbackSnapshot,
  MobileFallbackRegistry,
  MobileFallbackManager,
  MobileFallbackSelector,
  MobileFallbackEquality,
  MobileFallbackCallback,
  MobileFallbackUnsubscribe,
} from './mobile-fallback.types';

import {
  DEFAULT_MOBILE_FALLBACK_SNAPSHOT,
  MOBILE_TIER_PROFILES,
  DEFAULT_FALLBACK_RULES,
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_COMPATIBILITY_MATRIX,
} from './mobile-fallback.constants';

import {
  deriveMobileProfile,
  getTierProfile,
  deriveAllCapabilities,
  evaluateAllRules,
  generateRecommendations,
  evaluateCompatibility,
  countCapabilitiesByStrategy,
} from './mobile-fallback.config';

// ── Internal Types ───────────────────────────────────────────

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: MobileFallbackSelector<unknown>;
  readonly callback: MobileFallbackCallback;
  readonly equalityFn: MobileFallbackEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ─────────────────────────────────────────────

let snapshot: MobileFallbackSnapshot = DEFAULT_MOBILE_FALLBACK_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let activeProfile: MobileProfile = 'unknown';

/** Registered tier profiles (can be extended beyond defaults). */
const profiles = new Map<MobileProfile, MobileCapabilityProfile>();

/** Registered fallback rules. */
const rules = new Map<string, MobileFallbackRule>();

/** Registered feature flags. */
const featureFlags = new Map<string, MobileFeatureFlag>();

/** Registered compatibility entries. */
const compatibilityEntries = new Map<string, MobileCompatibilityEntry>();

/** All-change subscribers. */
const subscribers = new Set<MobileFallbackCallback>();

/** Selector subscribers — notified only when the selected value changes. */
const selectorSubscribers = new Set<SelectorEntry>();

/** Cleanup handles for integrations. */
const cleanups: Array<() => void> = [];

/** requestAnimationFrame handle for batching. */
let rafId: number | null = null;

/** Whether a rebuild is pending this frame. */
let updatePending = false;

// ── Time Helper ──────────────────────────────────────────────

/** Monotonic-ish timestamp, SSR-safe. */
function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

// ── Snapshot Scheduling ──────────────────────────────────────

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

// ── Snapshot Rebuild ─────────────────────────────────────────

/**
 * Rebuilds the immutable snapshot from current definitions and state.
 *
 * Derives capabilities from the active profile, evaluates rules,
 * generates recommendations, and computes aggregate counts.
 */
function rebuildSnapshot(): void {
  const profile = profiles.get(activeProfile) ?? getTierProfile(activeProfile);

  /* Derive capabilities from the profile. */
  const capabilities = deriveAllCapabilities(profile);

  /* Apply reduced-motion overrides to capability strategies. */
  const adjustedCapabilities = new Map<MobileCapabilityCategory, MobileCapabilityEntry>();

  for (const [category, entry] of capabilities) {
    if (!reducedMotion) {
      adjustedCapabilities.set(category, entry);
      continue;
    }

    /* Reduced motion tightens strategies. */
    let strategy = entry.strategy;
    if (strategy === 'enabled') strategy = 'simplified';
    else if (strategy === 'simplified') strategy = 'reduced';
    else if (strategy === 'reduced') strategy = 'minimal';

    const isEnabled = strategy !== 'disabled';
    const isSimplified = strategy === 'simplified';
    const isDeferred = strategy === 'deferred';
    const isPlaceholder = strategy === 'placeholder';

    adjustedCapabilities.set(category, Object.freeze({
      category,
      strategy,
      isEnabled,
      isSimplified,
      isDeferred,
      isPlaceholder,
      sourceTier: profile.tier,
      lastChange: entry.lastChange || now(),
    }));
  }

  const frozenCapabilities = Object.freeze(adjustedCapabilities);

  /* Evaluate rules and generate recommendations. */
  const applicableRules = evaluateAllRules(rules, activeProfile, reducedMotion);
  const recommendations = generateRecommendations(rules, activeProfile, reducedMotion);

  /* Resolve feature flags. */
  const resolvedFlags = new Map<string, MobileFeatureFlag>();
  for (const [id, flag] of featureFlags) {
    resolvedFlags.set(id, flag);
  }

  /* Resolve compatibility entries. */
  const compatibility = evaluateCompatibility(compatibilityEntries, activeProfile);

  /* Count capabilities by strategy. */
  const counts = countCapabilitiesByStrategy(frozenCapabilities);

  /* Build compatibility map. */
  const compatibilityMap = new Map<string, MobileCompatibilityEntry>();
  for (const entry of compatibility) {
    compatibilityMap.set(entry.id, entry);
  }

  revision += 1;

  snapshot = Object.freeze({
    activeProfile,
    profile,
    capabilities: frozenCapabilities,
    featureFlags: Object.freeze(resolvedFlags),
    rules: Object.freeze(new Map(applicableRules.map((r) => [r.id, r]))),
    compatibilityMatrix: Object.freeze(compatibilityMap),
    recommendations: Object.freeze(recommendations),
    isReducedMotion: reducedMotion,
    enables3D: profile.enables3D,
    enablesPostProcessing: profile.enablesPostProcessing,
    enablesShadows: profile.enablesShadows,
    activeCapabilityCount: counts.active,
    disabledCapabilityCount: counts.disabled,
    simplifiedCapabilityCount: counts.simplified,
    deferredCapabilityCount: counts.deferred,
    featureFlagCount: featureFlags.size,
    ruleCount: rules.size,
    compatibilityCount: compatibilityEntries.size,
    revision,
    timestamp: now(),
  });
}

// ── Subscriptions ────────────────────────────────────────────

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

function subscribe(callback: MobileFallbackCallback): MobileFallbackUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: MobileFallbackSelector<T>,
  callback: MobileFallbackCallback,
  equalityFn: MobileFallbackEquality<T> = Object.is as MobileFallbackEquality<T>,
): MobileFallbackUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as MobileFallbackEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Profile Management ───────────────────────────────────────

function registerProfile(profile: MobileCapabilityProfile): void {
  profiles.set(profile.tier, profile);
  scheduleUpdate();
}

function setActiveProfile(profile: MobileProfile): void {
  if (profile === activeProfile) return;
  activeProfile = profile;
  scheduleUpdate();
}

function getActiveProfile(): MobileProfile {
  return activeProfile;
}

// ── Rule Management ──────────────────────────────────────────

function registerRule(rule: MobileFallbackRule): void {
  rules.set(rule.id, rule);
  scheduleUpdate();
}

function unregisterRule(id: string): void {
  rules.delete(id);
  scheduleUpdate();
}

// ── Feature Flag Management ──────────────────────────────────

function registerFeatureFlag(flag: MobileFeatureFlag): void {
  featureFlags.set(flag.id, flag);
  scheduleUpdate();
}

function unregisterFeatureFlag(id: string): void {
  featureFlags.delete(id);
  scheduleUpdate();
}

// ── Compatibility Management ─────────────────────────────────

function registerCompatibility(entry: MobileCompatibilityEntry): void {
  compatibilityEntries.set(entry.id, entry);
  scheduleUpdate();
}

function unregisterCompatibility(id: string): void {
  compatibilityEntries.delete(id);
  scheduleUpdate();
}

// ── Evaluation ───────────────────────────────────────────────

function evaluate(): void {
  scheduleUpdate();
}

// ── Quality / Reduced Motion ─────────────────────────────────

function setReducedMotion(reduced: boolean): void {
  if (reduced === reducedMotion) return;
  reducedMotion = reduced;
  scheduleUpdate();
}

// ── Registry ─────────────────────────────────────────────────

function getRegistry(): MobileFallbackRegistry {
  return {
    getCapability: (category) => snapshot.capabilities.get(category),
    getStrategy: (category) => snapshot.capabilities.get(category)?.strategy ?? 'disabled',
    getFeatureFlag: (id) => featureFlags.get(id),
    getRule: (id) => rules.get(id),
    getCompatibility: (id) => compatibilityEntries.get(id),
    getCapabilityCategories: () => Array.from(snapshot.capabilities.keys()),
    getActiveCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.isEnabled)
        .map(([category]) => category),
    getDisabledCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.strategy === 'disabled')
        .map(([category]) => category),
    getSimplifiedCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.isSimplified)
        .map(([category]) => category),
    getDeferredCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.isDeferred)
        .map(([category]) => category),
    getFeatureFlags: () => Array.from(featureFlags.values()),
    getRules: () => Array.from(rules.values()),
    getCompatibilityEntries: () => Array.from(compatibilityEntries.values()),
    isFeatureEnabled: (featureId) => {
      const flag = featureFlags.get(featureId);
      if (!flag || !flag.enabled) return false;
      return flag.tiers.get(activeProfile) ?? false;
    },
    hasStrategy: (category, strategy) =>
      snapshot.capabilities.get(category)?.strategy === strategy,
    isCategoryEnabled: (category) =>
      snapshot.capabilities.get(category)?.isEnabled ?? false,
    isCategorySimplified: (category) =>
      snapshot.capabilities.get(category)?.isSimplified ?? false,
    capabilityCount: () => snapshot.capabilities.size,
    featureFlagCount: () => featureFlags.size,
    ruleCount: () => rules.size,
  };
}

// ── Lifecycle ────────────────────────────────────────────────

function init(): void {
  if (initialized) return;

  /* Ensure the performance manager is running. */
  threePerformanceManager.init();

  /* Seed reduced-motion from the SSR-safe reader. */
  reducedMotion = prefersReducedMotion();

  /* Derive active profile from the performance manager snapshot. */
  const perfSnapshot = threePerformanceManager.getSnapshot();
  activeProfile = deriveMobileProfile(
    perfSnapshot.deviceTier,
    perfSnapshot.estimatedQuality,
  );

  /* Subscribe to performance manager for quality/tier changes. */
  const unsubscribeQuality = threePerformanceManager.subscribe(() => {
    const next = threePerformanceManager.getSnapshot();
    const nextProfile = deriveMobileProfile(
      next.deviceTier,
      next.estimatedQuality,
    );
    if (nextProfile !== activeProfile) {
      activeProfile = nextProfile;
      scheduleUpdate();
    }
  });
  cleanups.push(unsubscribeQuality);

  /* Register default profiles. */
  for (const [tier, profile] of MOBILE_TIER_PROFILES) {
    profiles.set(tier, profile);
  }

  /* Load default rules from constants. */
  for (const rule of DEFAULT_FALLBACK_RULES) {
    rules.set(rule.id, rule);
  }

  for (const flag of DEFAULT_FEATURE_FLAGS) {
    featureFlags.set(flag.id, flag);
  }

  for (const entry of DEFAULT_COMPATIBILITY_MATRIX) {
    compatibilityEntries.set(entry.id, entry);
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

  profiles.clear();
  rules.clear();
  featureFlags.clear();
  compatibilityEntries.clear();

  snapshot = DEFAULT_MOBILE_FALLBACK_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  activeProfile = 'unknown';
  updatePending = false;
  initialized = false;
}

function getSnapshot(): MobileFallbackSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ─────────────────────────────────────────

/**
 * The singleton mobile fallback manager.
 *
 * This is the single owner of all mobile fallback state. All hooks
 * and future consumers read from this instance.
 */
export const mobileFallbackManager: MobileFallbackManager = Object.freeze({
  getSnapshot,
  subscribe,
  subscribeSelector,
  isInitialized,
  init,
  destroy,
  setActiveProfile,
  getActiveProfile,
  registerProfile,
  registerRule,
  unregisterRule,
  registerFeatureFlag,
  unregisterFeatureFlag,
  registerCompatibility,
  unregisterCompatibility,
  evaluate,
  getRegistry,
  setReducedMotion,
});
