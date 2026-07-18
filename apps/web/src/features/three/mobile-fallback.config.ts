/**
 * Mobile Fallback Config — Pure Derivation Functions
 *
 * Stateless, pure functions for deriving mobile fallback state.
 * No React, no side effects, no module-level state. All functions
 * take inputs and return outputs — testable in isolation.
 *
 * Responsibilities:
 *   - Type guards for MobileProfile, MobileCapabilityCategory, MobileFallbackStrategy
 *   - Profile derivation from DeviceTier and quality preset
 *   - Capability derivation from profile + reduced motion
 *   - Strategy derivation from rules + profile
 *   - Rule evaluation and recommendation generation
 *   - Compatibility matrix evaluation
 *   - Feature flag resolution
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import {
  MOBILE_PROFILES,
  MOBILE_CAPABILITY_CATEGORIES,
  MOBILE_FALLBACK_STRATEGIES,
} from './mobile-fallback.types';

import { MOBILE_TIER_PROFILES } from './mobile-fallback.constants';

import type {
  MobileProfile,
  MobileCapabilityCategory,
  MobileFallbackStrategy,
  MobileCapabilityProfile,
  MobileFallbackRule,
  MobileFeatureFlag,
  MobileCompatibilityEntry,
  MobileCapabilityEntry,
  MobileFallbackRecommendation,
} from './mobile-fallback.types';

import type { QualityPreset, DeviceTier } from './three.types';

// ── Type Guards ──────────────────────────────────────────────

/**
 * Type guard for MobileProfile.
 */
export function isMobileProfile(value: string): value is MobileProfile {
  return (MOBILE_PROFILES as readonly string[]).includes(value);
}

/**
 * Type guard for MobileCapabilityCategory.
 */
export function isMobileCapabilityCategory(value: string): value is MobileCapabilityCategory {
  return (MOBILE_CAPABILITY_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Type guard for MobileFallbackStrategy.
 */
export function isMobileFallbackStrategy(value: string): value is MobileFallbackStrategy {
  return (MOBILE_FALLBACK_STRATEGIES as readonly string[]).includes(value);
}

// ── Profile Derivation ───────────────────────────────────────

/**
 * Derives a MobileProfile from a DeviceTier.
 *
 * Maps the runtime device tier to an architectural mobile profile.
 * This is a one-way mapping — multiple DeviceTiers may map to
 * the same MobileProfile.
 */
export function deriveMobileProfileFromDeviceTier(
  deviceTier: DeviceTier,
): MobileProfile {
  switch (deviceTier) {
    case 'desktop-high':
    case 'desktop-standard':
      return 'ultra';
    case 'tablet':
      return 'high';
    case 'mobile':
      return 'medium';
    case 'low-end':
      return 'low';
    case 'unknown':
    default:
      return 'unknown';
  }
}

/**
 * Derives a MobileProfile from a QualityPreset.
 *
 * Maps the quality preset to a mobile profile. Lower quality
 * presets map to more constrained mobile profiles.
 */
export function deriveMobileProfileFromQuality(
  qualityPreset: QualityPreset,
): MobileProfile {
  switch (qualityPreset) {
    case 'ultra':
      return 'ultra';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    case 'minimal':
      return 'minimal';
    default:
      return 'unknown';
  }
}

/**
 * Derives a MobileProfile from both DeviceTier and QualityPreset.
 *
 * Uses the more conservative of the two inputs — if the device is
 * capable but quality is low, use the low profile. If quality is
 * high but the device is constrained, use the constrained profile.
 */
export function deriveMobileProfile(
  deviceTier: DeviceTier,
  qualityPreset: QualityPreset,
): MobileProfile {
  const fromDevice = deriveMobileProfileFromDeviceTier(deviceTier);
  const fromQuality = deriveMobileProfileFromQuality(qualityPreset);

  /* Take the more constrained (lower in the profile order). */
  const profileOrder: readonly MobileProfile[] = [
    'ultra', 'high', 'medium', 'low', 'minimal', 'unknown',
  ];

  const deviceIndex = profileOrder.indexOf(fromDevice);
  const qualityIndex = profileOrder.indexOf(fromQuality);

  /* Unknown is treated as most constrained. */
  const effectiveDeviceIndex = deviceIndex === -1 ? profileOrder.length - 1 : deviceIndex;
  const effectiveQualityIndex = qualityIndex === -1 ? profileOrder.length - 1 : qualityIndex;

  return profileOrder[Math.max(effectiveDeviceIndex, effectiveQualityIndex)];
}

// ── Profile Lookup ───────────────────────────────────────────

/**
 * Gets the capability profile for a given tier.
 * Returns the unknown profile if the tier is not found.
 */
export function getTierProfile(tier: MobileProfile): MobileCapabilityProfile {
  return MOBILE_TIER_PROFILES.get(tier) ?? MOBILE_TIER_PROFILES.get('unknown')!;
}

// ── Capability Derivation ────────────────────────────────────

/**
 * Derives a capability entry from a profile and category.
 */
export function deriveCapabilityEntry(
  profile: MobileCapabilityProfile,
  category: MobileCapabilityCategory,
): MobileCapabilityEntry {
  const strategy = profile.capabilities.get(category) ?? 'disabled';
  const isEnabled = strategy !== 'disabled';
  const isSimplified = strategy === 'simplified';
  const isDeferred = strategy === 'deferred';
  const isPlaceholder = strategy === 'placeholder';

  return Object.freeze({
    category,
    strategy,
    isEnabled,
    isSimplified,
    isDeferred,
    isPlaceholder,
    sourceTier: profile.tier,
    lastChange: 0,
  });
}

/**
 * Derives all capability entries from a profile.
 */
export function deriveAllCapabilities(
  profile: MobileCapabilityProfile,
): ReadonlyMap<MobileCapabilityCategory, MobileCapabilityEntry> {
  const capabilities = new Map<MobileCapabilityCategory, MobileCapabilityEntry>();

  for (const category of MOBILE_CAPABILITY_CATEGORIES) {
    capabilities.set(category, deriveCapabilityEntry(profile, category));
  }

  return Object.freeze(capabilities);
}

/**
 * Derives the strategy for a specific category, optionally applying
 * reduced-motion overrides.
 */
export function deriveStrategyForCategory(
  profile: MobileCapabilityProfile,
  category: MobileCapabilityCategory,
  isReducedMotion: boolean,
): MobileFallbackStrategy {
  const baseStrategy = profile.capabilities.get(category) ?? 'disabled';

  if (!isReducedMotion) {
    return baseStrategy;
  }

  /* Reduced motion tightens: enabled → simplified, simplified → reduced, etc. */
  if (baseStrategy === 'enabled') return 'simplified';
  if (baseStrategy === 'simplified') return 'reduced';
  if (baseStrategy === 'reduced') return 'minimal';
  return baseStrategy;
}

// ── Rule Evaluation ──────────────────────────────────────────

/**
 * Evaluates a single rule against the current profile and reduced-motion state.
 * Returns whether the rule applies.
 */
export function evaluateRule(
  rule: MobileFallbackRule,
  activeProfile: MobileProfile,
  _isReducedMotion: boolean,
): boolean {
  if (!rule.enabled) return false;
  if (rule.tier !== activeProfile) return false;

  /* Rules with qualityPreset condition are evaluated elsewhere. */
  if (rule.qualityPreset) return false;

  return true;
}

/**
 * Evaluates all rules and returns those that apply.
 */
export function evaluateAllRules(
  rules: ReadonlyMap<string, MobileFallbackRule>,
  activeProfile: MobileProfile,
  isReducedMotion: boolean,
): MobileFallbackRule[] {
  const applicable: MobileFallbackRule[] = [];

  for (const rule of rules.values()) {
    if (evaluateRule(rule, activeProfile, isReducedMotion)) {
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
export function generateRecommendations(
  rules: ReadonlyMap<string, MobileFallbackRule>,
  activeProfile: MobileProfile,
  isReducedMotion: boolean,
): MobileFallbackRecommendation[] {
  const applicable = evaluateAllRules(rules, activeProfile, isReducedMotion);
  const recommendations: MobileFallbackRecommendation[] = [];

  for (const rule of applicable) {
    recommendationCounter += 1;
    const severity = deriveSeverity(rule.strategy, activeProfile);

    recommendations.push(Object.freeze({
      id: `rec-${recommendationCounter}`,
      category: rule.category,
      strategy: rule.strategy,
      severity,
      message: `${rule.description} [${activeProfile} tier]`,
      tier: activeProfile,
    }));
  }

  return recommendations;
}

/**
 * Derives severity from strategy and tier.
 */
function deriveSeverity(
  strategy: MobileFallbackStrategy,
  tier: MobileProfile,
): 'info' | 'warning' | 'critical' {
  if (strategy === 'disabled' && (tier === 'minimal' || tier === 'unknown')) {
    return 'critical';
  }
  if (strategy === 'disabled' || strategy === 'placeholder') {
    return 'warning';
  }
  return 'info';
}

// ── Compatibility Evaluation ─────────────────────────────────

/**
 * Evaluates compatibility entries against the active profile.
 * Returns entries that are relevant to the current tier.
 */
export function evaluateCompatibility(
  entries: ReadonlyMap<string, MobileCompatibilityEntry>,
  activeProfile: MobileProfile,
): MobileCompatibilityEntry[] {
  const relevant: MobileCompatibilityEntry[] = [];

  for (const entry of entries.values()) {
    if (entry.tier === activeProfile) {
      relevant.push(entry);
    }
  }

  return relevant;
}

/**
 * Checks if two systems are compatible on a given tier.
 * Defaults to compatible if no entry exists.
 */
export function areSystemsCompatible(
  entries: ReadonlyMap<string, MobileCompatibilityEntry>,
  systemA: string,
  systemB: string,
  tier: MobileProfile,
): boolean {
  for (const entry of entries.values()) {
    if (entry.tier === tier) {
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

// ── Feature Flag Resolution ──────────────────────────────────

/**
 * Resolves whether a feature flag is enabled for the active profile.
 */
export function resolveFeatureFlag(
  flag: MobileFeatureFlag,
  activeProfile: MobileProfile,
): boolean {
  if (!flag.enabled) return false;
  return flag.tiers.get(activeProfile) ?? false;
}

/**
 * Resolves all feature flags for the active profile.
 */
export function resolveAllFeatureFlags(
  flags: ReadonlyMap<string, MobileFeatureFlag>,
  activeProfile: MobileProfile,
): ReadonlyMap<string, boolean> {
  const resolved = new Map<string, boolean>();

  for (const [id, flag] of flags) {
    resolved.set(id, resolveFeatureFlag(flag, activeProfile));
  }

  return Object.freeze(resolved);
}

// ── Snapshot Derivation Helpers ──────────────────────────────

/**
 * Counts capabilities by strategy in a capabilities map.
 */
export function countCapabilitiesByStrategy(
  capabilities: ReadonlyMap<MobileCapabilityCategory, MobileCapabilityEntry>,
): {
  readonly active: number;
  readonly disabled: number;
  readonly simplified: number;
  readonly deferred: number;
} {
  let active = 0;
  let disabled = 0;
  let simplified = 0;
  let deferred = 0;

  for (const entry of capabilities.values()) {
    if (entry.strategy === 'disabled') {
      disabled += 1;
    } else {
      active += 1;
      if (entry.isSimplified) simplified += 1;
      if (entry.isDeferred) deferred += 1;
    }
  }

  return Object.freeze({ active, disabled, simplified, deferred });
}
