/**
 * Accessibility Fallback Manager — Single Source of Truth for 3D Accessibility State
 *
 * From TECHNICAL_ARCHITECTURE §9:
 * "The 3D layer is progressive enhancement. It must degrade gracefully on
 *  every axis — WebGL support, device capability, reduced motion, and
 *  viewport — without ever blocking the core experience."
 *
 * This module is the single owner of all accessibility fallback state. It manages
 * accessibility profiles, preferences, capability rules, compatibility matrix
 * entries, recommendation generation, and snapshot generation. It stores metadata
 * and orchestrates accessibility STATE only — it never implements focus management,
 * never handles keyboard events, never adds ARIA attributes, and never modifies
 * runtime accessibility behavior.
 *
 * Responsibilities:
 *   - Registration of profiles, preferences, rules, compatibility entries
 *   - Active profile management
 *   - Capability derivation from profiles
 *   - Rule evaluation and recommendation generation
 *   - Preference resolution
 *   - Compatibility matrix evaluation
 *   - requestAnimationFrame batching — one rebuild per frame
 *   - Selector-based subscriptions
 *   - Immutable snapshots via getSnapshot()
 *   - Cleanup for page transitions
 *
 * Architecture:
 *   - Module-level mutable state — no React dependency
 *   - Consumes ThreePerformanceManager for quality integration
 *   - Consumes MobileFallbackManager for mobile compatibility
 *   - Reuses prefersReducedMotion for non-React reads
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import { threePerformanceManager } from './three-performance';
import { mobileFallbackManager } from './mobile-fallback-manager';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  AccessibilityProfile,
  AccessibilityCategory,
  AccessibilityCapabilityProfile,
  AccessibilityRule,
  AccessibilityPreference,
  AccessibilityCompatibilityEntry,
  AccessibilityCapabilityEntry,
  AccessibilitySnapshot,
  AccessibilityRegistry,
  AccessibilityFallbackManager,
  AccessibilitySelector,
  AccessibilityEquality,
  AccessibilityCallback,
  AccessibilityUnsubscribe,
} from './accessibility-fallback.types';

import {
  DEFAULT_ACCESSIBILITY_SNAPSHOT,
  ACCESSIBILITY_PROFILES_MAP,
  DEFAULT_ACCESSIBILITY_RULES,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  DEFAULT_ACCESSIBILITY_COMPATIBILITY,
} from './accessibility-fallback.constants';

import {
  getAccessibilityProfile,
  deriveAllAccessibilityCapabilities,
  evaluateAllAccessibilityRules,
  generateAccessibilityRecommendations,
  evaluateAccessibilityCompatibility,
  countAccessibilityCapabilitiesByStrategy,
} from './accessibility-fallback.config';

// ── Internal Types ───────────────────────────────────────────

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: AccessibilitySelector<unknown>;
  readonly callback: AccessibilityCallback;
  readonly equalityFn: AccessibilityEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ─────────────────────────────────────────────

let snapshot: AccessibilitySnapshot = DEFAULT_ACCESSIBILITY_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;
let highContrast = false;
let activeProfile: AccessibilityProfile = 'default';

/** Registered accessibility profiles (can be extended beyond defaults). */
const profiles = new Map<AccessibilityProfile, AccessibilityCapabilityProfile>();

/** Registered accessibility rules. */
const rules = new Map<string, AccessibilityRule>();

/** Registered accessibility preferences. */
const preferences = new Map<string, AccessibilityPreference>();

/** Registered compatibility entries. */
const compatibilityEntries = new Map<string, AccessibilityCompatibilityEntry>();

/** All-change subscribers. */
const subscribers = new Set<AccessibilityCallback>();

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
  const profile = profiles.get(activeProfile) ?? getAccessibilityProfile(activeProfile);

  /* Derive capabilities from the profile. */
  const capabilities = deriveAllAccessibilityCapabilities(profile);

  /* Apply reduced-motion and high-contrast overrides to capability strategies. */
  const adjustedCapabilities = new Map<AccessibilityCategory, AccessibilityCapabilityEntry>();

  for (const [category, entry] of capabilities) {
    let strategy = entry.strategy;

    /* High contrast mode enhances visual categories. */
    if (highContrast) {
      if (category === 'contrast' || category === 'text' || category === 'focus') {
        strategy = 'enhanced';
      } else if ((category === 'materials' || category === 'environment') && strategy === 'enabled') {
        strategy = 'simplified';
      }
    }

    /* Reduced motion tightens animation-related categories. */
    if (reducedMotion) {
      if (category === 'motion' || category === 'animation' || category === 'particles') {
        strategy = 'disabled';
      } else if (category === 'camera' && strategy === 'enabled') {
        strategy = 'simplified';
      }
    }

    const isEnabled = strategy !== 'disabled';
    const isAlternative = strategy === 'alternative';
    const isEnhanced = strategy === 'enhanced';
    const isSubstituted = strategy === 'substituted';

    adjustedCapabilities.set(category, Object.freeze({
      category,
      strategy,
      isEnabled,
      isAlternative,
      isEnhanced,
      isSubstituted,
      sourceProfile: profile.profile,
      lastChange: entry.lastChange || now(),
    }));
  }

  const frozenCapabilities = Object.freeze(adjustedCapabilities);

  /* Evaluate rules and generate recommendations. */
  const applicableRules = evaluateAllAccessibilityRules(rules, activeProfile, reducedMotion, highContrast);
  const recommendations = generateAccessibilityRecommendations(rules, activeProfile, reducedMotion, highContrast);

  /* Resolve preferences. */
  const resolvedPreferences = new Map<string, AccessibilityPreference>();
  for (const [id, preference] of preferences) {
    resolvedPreferences.set(id, preference);
  }

  /* Resolve compatibility entries. */
  const compatibility = evaluateAccessibilityCompatibility(compatibilityEntries, activeProfile);

  /* Count capabilities by strategy. */
  const counts = countAccessibilityCapabilitiesByStrategy(frozenCapabilities);

  /* Build compatibility map. */
  const compatibilityMap = new Map<string, AccessibilityCompatibilityEntry>();
  for (const entry of compatibility) {
    compatibilityMap.set(entry.id, entry);
  }

  revision += 1;

  snapshot = Object.freeze({
    activeProfile,
    profile,
    capabilities: frozenCapabilities,
    preferences: Object.freeze(resolvedPreferences),
    rules: Object.freeze(new Map(applicableRules.map((r) => [r.id, r]))),
    compatibilityMatrix: Object.freeze(compatibilityMap),
    recommendations: Object.freeze(recommendations),
    isReducedMotion: reducedMotion,
    isHighContrast: highContrast,
    isKeyboardOnly: activeProfile === 'keyboard',
    isScreenReader: activeProfile === 'screen-reader',
    isLowVision: activeProfile === 'low-vision',
    enables3D: profile.profile !== 'screen-reader',
    enablesAnimations: !reducedMotion && activeProfile !== 'reduced-motion',
    enablesAudio: activeProfile !== 'screen-reader',
    activeCapabilityCount: counts.active,
    disabledCapabilityCount: counts.disabled,
    alternativeCapabilityCount: counts.alternative,
    enhancedCapabilityCount: counts.enhanced,
    preferenceCount: preferences.size,
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

function subscribe(callback: AccessibilityCallback): AccessibilityUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: AccessibilitySelector<T>,
  callback: AccessibilityCallback,
  equalityFn: AccessibilityEquality<T> = Object.is as AccessibilityEquality<T>,
): AccessibilityUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as AccessibilityEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Profile Management ───────────────────────────────────────

function registerProfile(profile: AccessibilityCapabilityProfile): void {
  profiles.set(profile.profile, profile);
  scheduleUpdate();
}

function setActiveProfile(profile: AccessibilityProfile): void {
  if (profile === activeProfile) return;
  activeProfile = profile;
  scheduleUpdate();
}

function getActiveProfile(): AccessibilityProfile {
  return activeProfile;
}

// ── Rule Management ──────────────────────────────────────────

function registerRule(rule: AccessibilityRule): void {
  rules.set(rule.id, rule);
  scheduleUpdate();
}

function unregisterRule(id: string): void {
  rules.delete(id);
  scheduleUpdate();
}

// ── Preference Management ────────────────────────────────────

function registerPreference(preference: AccessibilityPreference): void {
  preferences.set(preference.id, preference);
  scheduleUpdate();
}

function unregisterPreference(id: string): void {
  preferences.delete(id);
  scheduleUpdate();
}

// ── Compatibility Management ─────────────────────────────────

function registerCompatibility(entry: AccessibilityCompatibilityEntry): void {
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

// ── Accessibility Settings ───────────────────────────────────

function setReducedMotion(reduced: boolean): void {
  if (reduced === reducedMotion) return;
  reducedMotion = reduced;
  scheduleUpdate();
}

function setHighContrast(contrast: boolean): void {
  if (contrast === highContrast) return;
  highContrast = contrast;
  scheduleUpdate();
}

// ── Registry ─────────────────────────────────────────────────

function getRegistry(): AccessibilityRegistry {
  return {
    getCapability: (category) => snapshot.capabilities.get(category),
    getStrategy: (category) => snapshot.capabilities.get(category)?.strategy ?? 'disabled',
    getPreference: (id) => preferences.get(id),
    getRule: (id) => rules.get(id),
    getCompatibility: (id) => compatibilityEntries.get(id),
    getCategories: () => Array.from(snapshot.capabilities.keys()),
    getActiveCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.isEnabled)
        .map(([category]) => category),
    getDisabledCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.strategy === 'disabled')
        .map(([category]) => category),
    getAlternativeCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.isAlternative)
        .map(([category]) => category),
    getEnhancedCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.isEnhanced)
        .map(([category]) => category),
    getSubstitutedCategories: () =>
      Array.from(snapshot.capabilities.entries())
        .filter(([, entry]) => entry.isSubstituted)
        .map(([category]) => category),
    getPreferences: () => Array.from(preferences.values()),
    getRules: () => Array.from(rules.values()),
    getCompatibilityEntries: () => Array.from(compatibilityEntries.values()),
    isPreferenceEnabled: (preferenceId) => {
      const pref = preferences.get(preferenceId);
      if (!pref || !pref.enabled) return false;
      return pref.profiles.get(activeProfile) ?? false;
    },
    hasStrategy: (category, strategy) =>
      snapshot.capabilities.get(category)?.strategy === strategy,
    isCategoryEnabled: (category) =>
      snapshot.capabilities.get(category)?.isEnabled ?? false,
    isCategoryAlternative: (category) =>
      snapshot.capabilities.get(category)?.isAlternative ?? false,
    capabilityCount: () => snapshot.capabilities.size,
    preferenceCount: () => preferences.size,
    ruleCount: () => rules.size,
  };
}

// ── Lifecycle ────────────────────────────────────────────────

function init(): void {
  if (initialized) return;

  /* Ensure upstream managers are running. */
  threePerformanceManager.init();
  mobileFallbackManager.init();

  /* Seed reduced-motion from the SSR-safe reader. */
  reducedMotion = prefersReducedMotion();

  /* Seed high-contrast from media query. */
  if (typeof window !== 'undefined' && window.matchMedia) {
    highContrast = window.matchMedia('(prefers-contrast: more)').matches;
  }

  /* Subscribe to performance manager for quality/tier changes. */
  const unsubscribePerformance = threePerformanceManager.subscribe(() => {
    /* Performance changes don't directly affect accessibility profile,
       but they may trigger re-evaluation in the future. */
  });
  cleanups.push(unsubscribePerformance);

  /* Subscribe to mobile fallback for mobile-specific adaptations. */
  const unsubscribeMobile = mobileFallbackManager.subscribe(() => {
    /* Mobile fallback changes may affect accessibility strategies. */
  });
  cleanups.push(unsubscribeMobile);

  /* Subscribe to high-contrast media query changes. */
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-contrast: more)');
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    mq.addEventListener('change', handleContrastChange);
    cleanups.push(() => {
      mq.removeEventListener('change', handleContrastChange);
    });
  }

  /* Register default profiles. */
  for (const [profile, capabilityProfile] of ACCESSIBILITY_PROFILES_MAP) {
    profiles.set(profile, capabilityProfile);
  }

  /* Load default rules from constants. */
  for (const rule of DEFAULT_ACCESSIBILITY_RULES) {
    rules.set(rule.id, rule);
  }

  for (const preference of DEFAULT_ACCESSIBILITY_PREFERENCES) {
    preferences.set(preference.id, preference);
  }

  for (const entry of DEFAULT_ACCESSIBILITY_COMPATIBILITY) {
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
  preferences.clear();
  compatibilityEntries.clear();

  snapshot = DEFAULT_ACCESSIBILITY_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  highContrast = false;
  activeProfile = 'default';
  updatePending = false;
  initialized = false;
}

function getSnapshot(): AccessibilitySnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

// ── Singleton Export ─────────────────────────────────────────

/**
 * The singleton accessibility fallback manager.
 *
 * This is the single owner of all accessibility fallback state. All hooks
 * and future consumers read from this instance.
 */
export const accessibilityFallbackManager: AccessibilityFallbackManager = Object.freeze({
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
  registerPreference,
  unregisterPreference,
  registerCompatibility,
  unregisterCompatibility,
  evaluate,
  getRegistry,
  setReducedMotion,
  setHighContrast,
});
