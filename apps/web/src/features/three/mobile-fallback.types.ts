/**
 * Mobile Fallback Types — Complete Type System for Mobile Capability & Fallback Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9:
 * "The 3D layer is progressive enhancement. It must degrade gracefully on
 *  every axis — WebGL support, device capability, reduced motion, and
 *  viewport — without ever blocking the core experience."
 *
 * This module defines the complete type system for the mobile fallback
 * infrastructure. It models device tiers, capability categories, fallback
 * strategies, feature flags, compatibility rules, and recommendation
 * generation. It stores metadata and orchestrates fallback STATE only — it
 * never disables rendering, never switches strategies at runtime, and never
 * adapts the renderer.
 *
 * Architecture:
 *   MobileProfile (immutable tier) + MobileCapabilityCategory (19 domains)
 *   → MobileCapabilityProfile (per-tier feature availability)
 *   → MobileFallbackRule (strategy selection logic)
 *   → MobileFallbackSnapshot (immutable registry state)
 *   → MobileFallbackManager (singleton, no React)
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

// ── Mobile Profile (Device Tiers) ────────────────────────────

/**
 * Immutable device performance tiers.
 *
 * Ordered from highest capability to lowest. Each tier maps to a
 * complete set of capability profiles and fallback rules.
 *
 * Distinct from `DeviceTier` in `three.types.ts`:
 * - `DeviceTier` is a coarse runtime probe (desktop-high, tablet, mobile, etc.)
 * - `MobileProfile` is an immutable architectural tier (ultra, high, medium, low, minimal, unknown)
 *   that future systems consume to decide feature availability.
 */
export const MOBILE_PROFILES = [
  /** Flagship devices — full feature set, all effects, no compromise */
  'ultra',
  /** High-end devices — most features enabled, slight optimization */
  'high',
  /** Mainstream devices — balanced feature set, selective simplification */
  'medium',
  /** Low-power devices — reduced feature set, significant simplification */
  'low',
  /** Minimum viable devices — essential features only, maximum fallback */
  'minimal',
  /** Unknown capability — conservative defaults, safe degradation */
  'unknown',
] as const;

/** Type-safe union of mobile profiles. */
export type MobileProfile = (typeof MOBILE_PROFILES)[number];

// ── Mobile Capability Category ───────────────────────────────

/**
 * All capability domains the mobile fallback system models.
 *
 * Each category represents a distinct subsystem or resource domain
 * that may need fallback behavior on constrained devices.
 */
export const MOBILE_CAPABILITY_CATEGORIES = [
  /** Camera presets, movement, viewport adaptation */
  'camera',
  /** Light count, shadow resolution, environment maps */
  'lighting',
  /** Texture size, shader complexity, material layers */
  'materials',
  /** HDR resolution, fog, sky, IBL, atmosphere */
  'environment',
  /** Asset loading, compression, concurrency */
  'assets',
  /** Particle count, spawn rate, lifetime */
  'particles',
  /** Scroll-linked animations, GSAP timelines, stagger */
  'animations',
  /** Bloom, SSAO, tone mapping, anti-aliasing */
  'postprocessing',
  /** Shadow map resolution, shadow count, shadow type */
  'shadows',
  /** Spatial audio, ambient sound, music layers */
  'audio',
  /** Physics simulation, collision detection */
  'physics',
  /** Pointer, touch, scroll, gesture interactions */
  'interactions',
  /** Debug overlays, axes helpers, wireframe */
  'helpers',
  /** Debug mode, verbose logging, performance stats */
  'debug',
  /** Texture memory, geometry memory, disposal */
  'memory',
  /** GPU render budget, draw calls, triangles */
  'gpu',
  /** CPU compute budget, main thread work */
  'cpu',
  /** Network request budget, prefetch limits */
  'network',
  /** Battery impact classification */
  'battery',
] as const;

/** Type-safe union of mobile capability categories. */
export type MobileCapabilityCategory = (typeof MOBILE_CAPABILITY_CATEGORIES)[number];

// ── Mobile Fallback Strategy ─────────────────────────────────

/**
 * Metadata-only fallback strategies.
 *
 * Each strategy describes WHAT should happen to a capability on a
 * given tier. These are advisory — future implementation phases
 * consume these recommendations to make actual runtime decisions.
 */
export const MOBILE_FALLBACK_STRATEGIES = [
  /** Feature operates at full fidelity — no degradation */
  'enabled',
  /** Feature is completely disabled on this tier */
  'disabled',
  /** Feature operates with reduced complexity */
  'simplified',
  /** Feature operates with reduced resource budget */
  'reduced',
  /** Feature is deferred until idle / after critical path */
  'deferred',
  /** Feature is replaced with a static or non-3D alternative */
  'placeholder',
  /** Feature operates at absolute minimum viable level */
  'minimal',
] as const;

/** Type-safe union of mobile fallback strategies. */
export type MobileFallbackStrategy = (typeof MOBILE_FALLBACK_STRATEGIES)[number];

// ── Mobile Capability Profile ─────────────────────────────────

/**
 * A complete capability profile for a specific mobile tier.
 *
 * Maps every capability category to a fallback strategy and optional
 * metadata for that tier. Immutable — profiles are defined at module
 * load time and never mutated.
 */
export interface MobileCapabilityProfile {
  /** The tier this profile applies to. */
  readonly tier: MobileProfile;
  /** Human-readable label for this tier. */
  readonly label: string;
  /** Whether this tier is considered "constrained". */
  readonly isConstrained: boolean;
  /** Whether this tier enables 3D rendering at all. */
  readonly enables3D: boolean;
  /** Whether this tier enables post-processing. */
  readonly enablesPostProcessing: boolean;
  /** Whether this tier enables shadow rendering. */
  readonly enablesShadows: boolean;
  /** Maximum number of concurrent particles. */
  readonly maxParticles: number;
  /** Maximum number of concurrent lights. */
  readonly maxLights: number;
  /** Maximum texture resolution in pixels. */
  readonly maxTextureResolution: number;
  /** Maximum polygon budget (triangle count). */
  readonly maxPolygons: number;
  /** Maximum draw calls per frame. */
  readonly maxDrawCalls: number;
  /** Maximum concurrent animations. */
  readonly maxAnimations: number;
  /** Maximum concurrent audio channels. */
  readonly maxAudioChannels: number;
  /** Maximum physics bodies. */
  readonly maxPhysicsBodies: number;
  /** Maximum prefetch requests. */
  readonly maxPrefetchRequests: number;
  /** Per-category fallback strategies. */
  readonly capabilities: ReadonlyMap<MobileCapabilityCategory, MobileFallbackStrategy>;
}

// ── Mobile Fallback Rule ─────────────────────────────────────

/**
 * A single fallback rule mapping a capability + strategy combination
 * to metadata about what that decision implies.
 */
export interface MobileFallbackRule {
  /** Unique rule identifier. */
  readonly id: string;
  /** The capability category this rule applies to. */
  readonly category: MobileCapabilityCategory;
  /** The tier this rule applies to. */
  readonly tier: MobileProfile;
  /** The recommended strategy. */
  readonly strategy: MobileFallbackStrategy;
  /** Human-readable description of the rule. */
  readonly description: string;
  /** Priority — higher rules take precedence when multiple match. */
  readonly priority: number;
  /** Whether this rule is active. */
  readonly enabled: boolean;
  /** Optional: the specific quality preset this rule overrides for. */
  readonly qualityPreset?: string;
  /** Optional: conditions under which this rule applies. */
  readonly conditions?: ReadonlyArray<string>;
}

// ── Mobile Feature Flag ──────────────────────────────────────

/**
 * A feature flag that gates a capability based on mobile profile.
 *
 * Feature flags are the bridge between the mobile fallback system
 * and the features it controls. Each flag maps a feature name to
 * a per-tier enablement map.
 */
export interface MobileFeatureFlag {
  /** Unique feature identifier. */
  readonly id: string;
  /** Human-readable feature name. */
  readonly label: string;
  /** The capability category this flag controls. */
  readonly category: MobileCapabilityCategory;
  /** Per-tier enablement. */
  readonly tiers: ReadonlyMap<MobileProfile, boolean>;
  /** Whether this flag is globally active. */
  readonly enabled: boolean;
}

// ── Mobile Compatibility Entry ────────────────────────────────

/**
 * A compatibility matrix entry describing how two systems interact
 * on a given mobile tier.
 */
export interface MobileCompatibilityEntry {
  /** Unique entry identifier. */
  readonly id: string;
  /** The first system (e.g., 'postprocessing' + 'shadows'). */
  readonly systemA: string;
  /** The second system. */
  readonly systemB: string;
  /** The tier this compatibility applies to. */
  readonly tier: MobileProfile;
  /** Whether both systems can coexist on this tier. */
  readonly isCompatible: boolean;
  /** Optional: if incompatible, which system takes precedence. */
  readonly precedence?: MobileCapabilityCategory;
  /** Human-readable description. */
  readonly description: string;
}

// ── Mobile Capability Entry (Runtime State) ──────────────────

/**
 * Runtime state for a single capability within the snapshot.
 */
export interface MobileCapabilityEntry {
  /** The capability category. */
  readonly category: MobileCapabilityCategory;
  /** The current fallback strategy for this capability. */
  readonly strategy: MobileFallbackStrategy;
  /** Whether this capability is currently enabled. */
  readonly isEnabled: boolean;
  /** Whether this capability is simplified. */
  readonly isSimplified: boolean;
  /** Whether this capability is deferred. */
  readonly isDeferred: boolean;
  /** Whether this capability uses a placeholder. */
  readonly isPlaceholder: boolean;
  /** The tier from which this strategy was derived. */
  readonly sourceTier: MobileProfile;
  /** Timestamp of the last strategy change. */
  readonly lastChange: number;
}

// ── Mobile Fallback Recommendation ───────────────────────────

/**
 * A generated recommendation for capability adjustment.
 *
 * Future systems consume these recommendations to make actual
 * runtime decisions. Recommendations are advisory — they describe
 * what SHOULD happen, not what IS happening.
 */
export interface MobileFallbackRecommendation {
  /** Unique recommendation identifier. */
  readonly id: string;
  /** The capability this recommendation targets. */
  readonly category: MobileCapabilityCategory;
  /** The recommended strategy. */
  readonly strategy: MobileFallbackStrategy;
  /** Severity of the recommendation. */
  readonly severity: 'info' | 'warning' | 'critical';
  /** Human-readable recommendation message. */
  readonly message: string;
  /** The tier that triggered this recommendation. */
  readonly tier: MobileProfile;
  /** Optional: estimated performance improvement. */
  readonly estimatedImpact?: string;
}

// ── Mobile Fallback Snapshot ──────────────────────────────────

/**
 * Immutable snapshot of the complete mobile fallback state.
 *
 * Revision-counted and timestamped. Consumers compare revisions to
 * detect changes. Frozen via Object.freeze().
 */
export interface MobileFallbackSnapshot {
  /** The active mobile profile. */
  readonly activeProfile: MobileProfile;
  /** The complete capability profile for the active tier. */
  readonly profile: MobileCapabilityProfile;
  /** Per-category capability entries. */
  readonly capabilities: ReadonlyMap<MobileCapabilityCategory, MobileCapabilityEntry>;
  /** Active feature flags. */
  readonly featureFlags: ReadonlyMap<string, MobileFeatureFlag>;
  /** Active fallback rules. */
  readonly rules: ReadonlyMap<string, MobileFallbackRule>;
  /** Compatibility matrix entries. */
  readonly compatibilityMatrix: ReadonlyMap<string, MobileCompatibilityEntry>;
  /** Generated recommendations. */
  readonly recommendations: ReadonlyArray<MobileFallbackRecommendation>;
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
  /** Whether 3D rendering is enabled for this profile. */
  readonly enables3D: boolean;
  /** Whether post-processing is enabled for this profile. */
  readonly enablesPostProcessing: boolean;
  /** Whether shadows are enabled for this profile. */
  readonly enablesShadows: boolean;
  /** Total number of active capabilities (strategy !== 'disabled'). */
  readonly activeCapabilityCount: number;
  /** Total number of disabled capabilities. */
  readonly disabledCapabilityCount: number;
  /** Total number of simplified capabilities. */
  readonly simplifiedCapabilityCount: number;
  /** Total number of deferred capabilities. */
  readonly deferredCapabilityCount: number;
  /** Total number of registered feature flags. */
  readonly featureFlagCount: number;
  /** Total number of registered rules. */
  readonly ruleCount: number;
  /** Total number of compatibility entries. */
  readonly compatibilityCount: number;
  /** Monotonic revision counter — incremented on each snapshot rebuild. */
  readonly revision: number;
  /** High-resolution timestamp of the last snapshot rebuild. */
  readonly timestamp: number;
}

// ── Mobile Fallback Registry ──────────────────────────────────

/**
 * Read-only registry for querying mobile fallback state.
 *
 * All methods return data from the current immutable snapshot.
 */
export interface MobileFallbackRegistry {
  /** Get the capability entry for a category. */
  readonly getCapability: (category: MobileCapabilityCategory) => MobileCapabilityEntry | undefined;
  /** Get the fallback strategy for a category. */
  readonly getStrategy: (category: MobileCapabilityCategory) => MobileFallbackStrategy;
  /** Get a feature flag by ID. */
  readonly getFeatureFlag: (id: string) => MobileFeatureFlag | undefined;
  /** Get a rule by ID. */
  readonly getRule: (id: string) => MobileFallbackRule | undefined;
  /** Get a compatibility entry by ID. */
  readonly getCompatibility: (id: string) => MobileCompatibilityEntry | undefined;
  /** Get all capability categories. */
  readonly getCapabilityCategories: () => readonly MobileCapabilityCategory[];
  /** Get all active capability categories (strategy !== 'disabled'). */
  readonly getActiveCategories: () => readonly MobileCapabilityCategory[];
  /** Get all disabled capability categories. */
  readonly getDisabledCategories: () => readonly MobileCapabilityCategory[];
  /** Get all simplified capability categories. */
  readonly getSimplifiedCategories: () => readonly MobileCapabilityCategory[];
  /** Get all deferred capability categories. */
  readonly getDeferredCategories: () => readonly MobileCapabilityCategory[];
  /** Get all feature flags. */
  readonly getFeatureFlags: () => readonly MobileFeatureFlag[];
  /** Get all rules. */
  readonly getRules: () => readonly MobileFallbackRule[];
  /** Get all compatibility entries. */
  readonly getCompatibilityEntries: () => readonly MobileCompatibilityEntry[];
  /** Check if a feature is enabled for the active profile. */
  readonly isFeatureEnabled: (featureId: string) => boolean;
  /** Check if a category has a specific strategy. */
  readonly hasStrategy: (category: MobileCapabilityCategory, strategy: MobileFallbackStrategy) => boolean;
  /** Check if a category is enabled. */
  readonly isCategoryEnabled: (category: MobileCapabilityCategory) => boolean;
  /** Check if a category is simplified. */
  readonly isCategorySimplified: (category: MobileCapabilityCategory) => boolean;
  /** Get the total number of capabilities. */
  readonly capabilityCount: () => number;
  /** Get the total number of feature flags. */
  readonly featureFlagCount: () => number;
  /** Get the total number of rules. */
  readonly ruleCount: () => number;
}

// ── Mobile Fallback Manager ───────────────────────────────────

/**
 * The singleton mobile fallback manager interface.
 *
 * Manages profiles, capability rules, fallback strategies, feature flags,
 * compatibility matrix entries, recommendations, and snapshot generation.
 * No React dependency. All mutations schedule RAF-batched updates.
 */
export interface MobileFallbackManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => MobileFallbackSnapshot;
  /** Subscribe to all snapshot changes. */
  readonly subscribe: (callback: MobileFallbackCallback) => MobileFallbackUnsubscribe;
  /** Subscribe to a specific selector with equality check. */
  readonly subscribeSelector: <T>(
    selector: MobileFallbackSelector<T>,
    callback: MobileFallbackCallback,
    equalityFn?: MobileFallbackEquality<T>,
  ) => MobileFallbackUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — seeds from ThreePerformanceManager and prefersReducedMotion. */
  readonly init: () => void;
  /** Destroy the manager — cleans up subscriptions and resets state. */
  readonly destroy: () => void;
  /** Set the active mobile profile. */
  readonly setActiveProfile: (profile: MobileProfile) => void;
  /** Get the active mobile profile. */
  readonly getActiveProfile: () => MobileProfile;
  /** Register a capability profile for a tier. */
  readonly registerProfile: (profile: MobileCapabilityProfile) => void;
  /** Register a fallback rule. */
  readonly registerRule: (rule: MobileFallbackRule) => void;
  /** Unregister a fallback rule. */
  readonly unregisterRule: (id: string) => void;
  /** Register a feature flag. */
  readonly registerFeatureFlag: (flag: MobileFeatureFlag) => void;
  /** Unregister a feature flag. */
  readonly unregisterFeatureFlag: (id: string) => void;
  /** Register a compatibility entry. */
  readonly registerCompatibility: (entry: MobileCompatibilityEntry) => void;
  /** Unregister a compatibility entry. */
  readonly unregisterCompatibility: (id: string) => void;
  /** Evaluate all rules and generate recommendations. */
  readonly evaluate: () => void;
  /** Get the registry for read-only queries. */
  readonly getRegistry: () => MobileFallbackRegistry;
  /** Set reduced-motion state. */
  readonly setReducedMotion: (reduced: boolean) => void;
}

// ── Subscription Types ────────────────────────────────────────

/** Selector function — extracts a slice from the snapshot. */
export type MobileFallbackSelector<T> = (snapshot: MobileFallbackSnapshot) => T;

/** Equality function — compares selected values. */
export type MobileFallbackEquality<T> = (prev: T, next: T) => boolean;

/** Callback for all-change subscriptions. */
export type MobileFallbackCallback = () => void;

/** Unsubscribe function. */
export type MobileFallbackUnsubscribe = () => void;
