/**
 * Accessibility Fallback Config — Pure Derivation Functions
 *
 * Stateless, pure functions for deriving accessibility fallback state.
 * No React, no side effects, no module-level state. All functions
 * take inputs and return outputs — testable in isolation.
 *
 * Responsibilities:
 *   - Type guards for AccessibilityProfile, AccessibilityCategory, AccessibilityStrategy, AccessibilityLifecycle
 *   - Profile derivation from preferences
 *   - Capability derivation from profile
 *   - Strategy derivation with preference overrides
 *   - Rule evaluation and recommendation generation
 *   - Compatibility matrix evaluation
 *   - Preference resolution
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import {
  ACCESSIBILITY_PROFILES,
  ACCESSIBILITY_CATEGORIES,
  ACCESSIBILITY_STRATEGIES,
  ACCESSIBILITY_LIFECYCLE_STATES,
} from './accessibility-fallback.types';

import { ACCESSIBILITY_PROFILES_MAP } from './accessibility-fallback.constants';

import type {
  AccessibilityProfile,
  AccessibilityCategory,
  AccessibilityStrategy,
  AccessibilityLifecycle,
  AccessibilityCapabilityProfile,
  AccessibilityRule,
  AccessibilityPreference,
  AccessibilityCompatibilityEntry,
  AccessibilityCapabilityEntry,
  AccessibilityRecommendation,
} from './accessibility-fallback.types';

// ── Type Guards ──────────────────────────────────────────────

/**
 * Type guard for AccessibilityProfile.
 */
export function isAccessibilityProfile(value: string): value is AccessibilityProfile {
  return (ACCESSIBILITY_PROFILES as readonly string[]).includes(value);
}

/**
 * Type guard for AccessibilityCategory.
 */
export function isAccessibilityCategory(value: string): value is AccessibilityCategory {
  return (ACCESSIBILITY_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Type guard for AccessibilityStrategy.
 */
export function isAccessibilityStrategy(value: string): value is AccessibilityStrategy {
  return (ACCESSIBILITY_STRATEGIES as readonly string[]).includes(value);
}

/**
 * Type guard for AccessibilityLifecycle.
 */
export function isAccessibilityLifecycle(value: string): value is AccessibilityLifecycle {
  return (ACCESSIBILITY_LIFECYCLE_STATES as readonly string[]).includes(value);
}

// ── Profile Lookup ───────────────────────────────────────────

/**
 * Gets the capability profile for a given accessibility profile.
 * Returns the default profile if not found.
 */
export function getAccessibilityProfile(profile: AccessibilityProfile): AccessibilityCapabilityProfile {
  return ACCESSIBILITY_PROFILES_MAP.get(profile) ?? ACCESSIBILITY_PROFILES_MAP.get('default')!;
}

// ── Capability Derivation ────────────────────────────────────

/**
 * Derives a capability entry from a profile and category.
 */
export function deriveAccessibilityCapabilityEntry(
  profile: AccessibilityCapabilityProfile,
  category: AccessibilityCategory,
): AccessibilityCapabilityEntry {
  const strategy = profile.capabilities.get(category) ?? 'disabled';
  const isEnabled = strategy !== 'disabled';
  const isAlternative = strategy === 'alternative';
  const isEnhanced = strategy === 'enhanced';
  const isSubstituted = strategy === 'substituted';

  return Object.freeze({
    category,
    strategy,
    isEnabled,
    isAlternative,
    isEnhanced,
    isSubstituted,
    sourceProfile: profile.profile,
    lastChange: 0,
  });
}

/**
 * Derives all capability entries from a profile.
 */
export function deriveAllAccessibilityCapabilities(
  profile: AccessibilityCapabilityProfile,
): ReadonlyMap<AccessibilityCategory, AccessibilityCapabilityEntry> {
  const capabilities = new Map<AccessibilityCategory, AccessibilityCapabilityEntry>();

  for (const category of ACCESSIBILITY_CATEGORIES) {
    capabilities.set(category, deriveAccessibilityCapabilityEntry(profile, category));
  }

  return Object.freeze(capabilities);
}

/**
 * Derives the strategy for a specific category, optionally applying
 * preference overrides.
 */
export function deriveStrategyForAccessibilityCategory(
  profile: AccessibilityCapabilityProfile,
  category: AccessibilityCategory,
  isReducedMotion: boolean,
  isHighContrast: boolean,
): AccessibilityStrategy {
  const baseStrategy = profile.capabilities.get(category) ?? 'disabled';

  /* High contrast mode enhances visual categories. */
  if (isHighContrast) {
    if (category === 'contrast' || category === 'text' || category === 'focus') {
      return baseStrategy === 'disabled' ? 'enhanced' : 'enhanced';
    }
    if (category === 'materials' || category === 'environment') {
      return baseStrategy === 'enabled' ? 'simplified' : baseStrategy;
    }
  }

  /* Reduced motion tightens animation-related categories. */
  if (isReducedMotion) {
    if (category === 'motion' || category === 'animation' || category === 'particles') {
      return 'disabled';
    }
    if (category === 'camera') {
      return baseStrategy === 'enabled' ? 'simplified' : baseStrategy;
    }
  }

  return baseStrategy;
}

// ── Rule Evaluation ──────────────────────────────────────────

/**
 * Evaluates a single rule against the current profile.
 * Returns whether the rule applies.
 */
export function evaluateAccessibilityRule(
  rule: AccessibilityRule,
  activeProfile: AccessibilityProfile,
  _isReducedMotion: boolean,
  _isHighContrast: boolean,
): boolean {
  if (!rule.enabled) return false;
  if (rule.profile !== activeProfile) return false;

  return true;
}

/**
 * Evaluates all rules and returns those that apply.
 */
export function evaluateAllAccessibilityRules(
  rules: ReadonlyMap<string, AccessibilityRule>,
  activeProfile: AccessibilityProfile,
  isReducedMotion: boolean,
  isHighContrast: boolean,
): AccessibilityRule[] {
  const applicable: AccessibilityRule[] = [];

  for (const rule of rules.values()) {
    if (evaluateAccessibilityRule(rule, activeProfile, isReducedMotion, isHighContrast)) {
      applicable.push(rule);
    }
  }

  /* Sort by priority descending — higher priority rules first. */
  applicable.sort((a, b) => b.priority - a.priority);
  return applicable;
}

// ── Recommendation Generation ────────────────────────────────

let recommendationCounter = 0;

/**
 * Generates recommendations from applicable rules.
 *
 * Each applicable rule produces a recommendation. Recommendations
 * are advisory — future systems consume them to make runtime decisions.
 */
export function generateAccessibilityRecommendations(
  rules: ReadonlyMap<string, AccessibilityRule>,
  activeProfile: AccessibilityProfile,
  isReducedMotion: boolean,
  isHighContrast: boolean,
): AccessibilityRecommendation[] {
  const applicable = evaluateAllAccessibilityRules(rules, activeProfile, isReducedMotion, isHighContrast);
  const recommendations: AccessibilityRecommendation[] = [];

  for (const rule of applicable) {
    recommendationCounter += 1;
    const severity = deriveAccessibilitySeverity(rule.strategy, activeProfile);

    recommendations.push(Object.freeze({
      id: `a11y-rec-${recommendationCounter}`,
      category: rule.category,
      strategy: rule.strategy,
      severity,
      message: `${rule.description} [${activeProfile} profile]`,
      profile: activeProfile,
      wcagReference: rule.wcagReference,
    }));
  }

  return recommendations;
}

/**
 * Derives severity from strategy and profile.
 */
function deriveAccessibilitySeverity(
  strategy: AccessibilityStrategy,
  profile: AccessibilityProfile,
): 'info' | 'warning' | 'critical' {
  if (strategy === 'disabled' && (profile === 'screen-reader' || profile === 'keyboard')) {
    return 'critical';
  }
  if (strategy === 'disabled' || strategy === 'substituted') {
    return 'warning';
  }
  return 'info';
}

// ── Compatibility Evaluation ─────────────────────────────────

/**
 * Evaluates compatibility entries against the active profile.
 * Returns entries that are relevant to the current profile.
 */
export function evaluateAccessibilityCompatibility(
  entries: ReadonlyMap<string, AccessibilityCompatibilityEntry>,
  activeProfile: AccessibilityProfile,
): AccessibilityCompatibilityEntry[] {
  const relevant: AccessibilityCompatibilityEntry[] = [];

  for (const entry of entries.values()) {
    if (entry.profile === activeProfile) {
      relevant.push(entry);
    }
  }

  return relevant;
}

/**
 * Checks if two systems are compatible for a given profile.
 * Defaults to compatible if no entry exists.
 */
export function areAccessibilitySystemsCompatible(
  entries: ReadonlyMap<string, AccessibilityCompatibilityEntry>,
  systemA: string,
  systemB: string,
  profile: AccessibilityProfile,
): boolean {
  for (const entry of entries.values()) {
    if (entry.profile === profile) {
      if (
        (entry.systemA === systemA && entry.systemB === systemB) ||
        (entry.systemA === systemB && entry.systemB === systemA)
      ) {
        return entry.isCompatible;
      }
    }
  }

  return true;
}

// ── Preference Resolution ────────────────────────────────────

/**
 * Resolves whether a preference is enabled for the active profile.
 */
export function resolveAccessibilityPreference(
  preference: AccessibilityPreference,
  activeProfile: AccessibilityProfile,
): boolean {
  if (!preference.enabled) return false;
  return preference.profiles.get(activeProfile) ?? false;
}

/**
 * Resolves all preferences for the active profile.
 */
export function resolveAllAccessibilityPreferences(
  preferences: ReadonlyMap<string, AccessibilityPreference>,
  activeProfile: AccessibilityProfile,
): ReadonlyMap<string, boolean> {
  const resolved = new Map<string, boolean>();

  for (const [id, preference] of preferences) {
    resolved.set(id, resolveAccessibilityPreference(preference, activeProfile));
  }

  return Object.freeze(resolved);
}

// ── Snapshot Derivation Helpers ──────────────────────────────

/**
 * Counts capabilities by strategy in a capabilities map.
 */
export function countAccessibilityCapabilitiesByStrategy(
  capabilities: ReadonlyMap<AccessibilityCategory, AccessibilityCapabilityEntry>,
): {
  readonly active: number;
  readonly disabled: number;
  readonly alternative: number;
  readonly enhanced: number;
  readonly substituted: number;
} {
  let active = 0;
  let disabled = 0;
  let alternative = 0;
  let enhanced = 0;
  let substituted = 0;

  for (const entry of capabilities.values()) {
    if (entry.strategy === 'disabled') {
      disabled += 1;
    } else {
      active += 1;
      if (entry.isAlternative) alternative += 1;
      if (entry.isEnhanced) enhanced += 1;
      if (entry.isSubstituted) substituted += 1;
    }
  }

  return Object.freeze({ active, disabled, alternative, enhanced, substituted });
}
