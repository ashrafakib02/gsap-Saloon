/**
 * Accessibility Fallback Types — Complete Type System for 3D Accessibility Architecture
 *
 * From TECHNICAL_ARCHITECTURE §9:
 * "The 3D layer is progressive enhancement. It must degrade gracefully on
 *  every axis — WebGL support, device capability, reduced motion, and
 *  viewport — without ever blocking the core experience."
 *
 * This module defines the complete type system for the accessibility
 * fallback infrastructure. It models accessibility profiles, preference
 * categories, capability rules, fallback strategies, compatibility rules,
 * and recommendation generation. It stores metadata and orchestrates
 * accessibility STATE only — it never implements focus management, never
 * handles keyboard events, never adds ARIA attributes, and never modifies
 * runtime accessibility behavior.
 *
 * Architecture:
 *   AccessibilityProfile (immutable profile) + AccessibilityCategory (22 domains)
 *   → AccessibilityCapabilityProfile (per-profile feature availability)
 *   → AccessibilityRule (strategy selection logic)
 *   → AccessibilitySnapshot (immutable registry state)
 *   → AccessibilityFallbackManager (singleton, no React)
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

// ── Accessibility Profile ─────────────────────────────────────

/**
 * Immutable accessibility user profiles.
 *
 * Each profile represents a distinct set of accessibility requirements
 * that the 3D experience must accommodate. Profiles are determined by
 * user preferences, browser settings, or assistive technology presence.
 */
export const ACCESSIBILITY_PROFILES = [
  /** No specific accessibility requirements — default experience */
  'default',
  /** User prefers reduced motion — minimize animations, transitions, parallax */
  'reduced-motion',
  /** User needs high contrast — maximize visual distinction between elements */
  'high-contrast',
  /** User navigates primarily via keyboard — ensure full keyboard operability */
  'keyboard',
  /** User relies on screen readers — ensure all content is perceivable */
  'screen-reader',
  /** User has low vision — enlarge text, increase contrast, simplify layout */
  'low-vision',
  /** Custom accessibility configuration — user-defined overrides */
  'custom',
] as const;

/** Type-safe union of accessibility profiles. */
export type AccessibilityProfile = (typeof ACCESSIBILITY_PROFILES)[number];

// ── Accessibility Category ────────────────────────────────────

/**
 * All accessibility domains the fallback system models.
 *
 * Each category represents a distinct aspect of the 3D experience
 * that may require accessibility adaptation.
 */
export const ACCESSIBILITY_CATEGORIES = [
  /** Reduce or eliminate motion and animations */
  'motion',
  /** Animation-specific: timelines, scroll-linked, stagger */
  'animation',
  /** Camera movement and viewport transitions */
  'camera',
  /** Lighting changes, flicker avoidance, color temperature */
  'lighting',
  /** Material rendering: shaders, textures, visual effects */
  'materials',
  /** Environment: sky, fog, background, atmosphere */
  'environment',
  /** Particle effects: spawn rate, density, motion */
  'particles',
  /** Audio: spatial audio, ambient sound, music */
  'audio',
  /** Captions for audio content */
  'captions',
  /** Transcripts for audio/video content */
  'transcripts',
  /** Keyboard operability and tab order */
  'keyboard',
  /** Focus management and focus indicators */
  'focus',
  /** Navigation: landmarks, headings, skip links */
  'navigation',
  /** Screen reader compatibility and ARIA semantics */
  'screen-reader',
  /** Color contrast: minimum ratios, text/background distinction */
  'contrast',
  /** Text: sizing, spacing, readability */
  'text',
  /** Touch target sizing and spacing */
  'touch',
  /** Gesture alternatives and simplified interactions */
  'gesture',
  /** Pointer input: mouse, trackpad, stylus */
  'pointer',
  /** Timing: auto-play, duration, pauses */
  'timing',
  /** User feedback: status messages, loading states, errors */
  'feedback',
  /** Debug information: screen reader only, verbose descriptions */
  'debug',
] as const;

/** Type-safe union of accessibility categories. */
export type AccessibilityCategory = (typeof ACCESSIBILITY_CATEGORIES)[number];

// ── Accessibility Strategy ────────────────────────────────────

/**
 * Metadata-only accessibility strategies.
 *
 * Each strategy describes WHAT should happen to a capability when
 * a specific accessibility profile is active. These are advisory —
 * future implementation phases consume these recommendations to
 * make actual runtime decisions.
 */
export const ACCESSIBILITY_STRATEGIES = [
  /** Feature operates at full fidelity — no adaptation needed */
  'enabled',
  /** Feature is completely disabled for this profile */
  'disabled',
  /** Feature operates with reduced complexity for clarity */
  'simplified',
  /** Feature is replaced with an accessible alternative */
  'alternative',
  /** Feature operates with reduced intensity or frequency */
  'reduced',
  /** Feature is replaced with a non-interactive substitute */
  'substituted',
  /** Feature is enhanced for better accessibility */
  'enhanced',
] as const;

/** Type-safe union of accessibility strategies. */
export type AccessibilityStrategy = (typeof ACCESSIBILITY_STRATEGIES)[number];

// ── Accessibility Lifecycle ───────────────────────────────────

/**
 * Lifecycle states for accessibility adaptations.
 *
 * Tracks whether an adaptation is active, being evaluated, or disposed.
 */
export const ACCESSIBILITY_LIFECYCLE_STATES = [
  /** Adaptation is active and being applied */
  'active',
  /** Adaptation is inactive — not currently needed */
  'inactive',
  /** Adaptation is pending evaluation */
  'pending',
  /** Adaptation is being evaluated for applicability */
  'evaluating',
  /** Adaptation has been disposed */
  'disposed',
] as const;

/** Type-safe union of accessibility lifecycle states. */
export type AccessibilityLifecycle = (typeof ACCESSIBILITY_LIFECYCLE_STATES)[number];

// ── Accessibility Capability Profile ──────────────────────────

/**
 * A complete accessibility capability profile for a specific profile.
 *
 * Maps every accessibility category to a strategy and optional
 * metadata. Immutable — profiles are defined at module load time
 * and never mutated.
 */
export interface AccessibilityCapabilityProfile {
  /** The accessibility profile this applies to. */
  readonly profile: AccessibilityProfile;
  /** Human-readable label for this profile. */
  readonly label: string;
  /** Whether this profile requires reduced motion. */
  readonly requiresReducedMotion: boolean;
  /** Whether this profile requires high contrast. */
  readonly requiresHighContrast: boolean;
  /** Whether this profile requires keyboard navigation. */
  readonly requiresKeyboard: boolean;
  /** Whether this profile requires screen reader support. */
  readonly requiresScreenReader: boolean;
  /** Whether this profile requires text enlargement. */
  readonly requiresTextEnlargement: boolean;
  /** Whether this profile requires simplified interactions. */
  readonly requiresSimplifiedInteractions: boolean;
  /** Minimum contrast ratio for text (WCAG AA = 4.5, AAA = 7). */
  readonly minContrastRatio: number;
  /** Minimum touch target size in pixels (WCAG 2.5.5 = 44). */
  readonly minTouchTargetSize: number;
  /** Maximum animation duration in milliseconds (0 = no animation). */
  readonly maxAnimationDuration: number;
  /** Maximum number of concurrent animations. */
  readonly maxConcurrentAnimations: number;
  /** Per-category accessibility strategies. */
  readonly capabilities: ReadonlyMap<AccessibilityCategory, AccessibilityStrategy>;
}

// ── Accessibility Preference ──────────────────────────────────

/**
 * An accessibility preference that maps user settings to adaptations.
 *
 * Preferences represent the bridge between user-specified requirements
 * and the accessibility strategies the 3D system should apply.
 */
export interface AccessibilityPreference {
  /** Unique preference identifier. */
  readonly id: string;
  /** Human-readable preference name. */
  readonly label: string;
  /** The accessibility category this preference targets. */
  readonly category: AccessibilityCategory;
  /** Per-profile enablement. */
  readonly profiles: ReadonlyMap<AccessibilityProfile, boolean>;
  /** Whether this preference is globally active. */
  readonly enabled: boolean;
}

// ── Accessibility Rule ────────────────────────────────────────

/**
 * A single accessibility rule mapping a category + strategy combination
 * to metadata about what that adaptation implies.
 */
export interface AccessibilityRule {
  /** Unique rule identifier. */
  readonly id: string;
  /** The accessibility category this rule applies to. */
  readonly category: AccessibilityCategory;
  /** The profile this rule applies to. */
  readonly profile: AccessibilityProfile;
  /** The recommended strategy. */
  readonly strategy: AccessibilityStrategy;
  /** Human-readable description of the rule. */
  readonly description: string;
  /** WCAG success criterion reference (e.g., '2.3.1', '1.1.1'). */
  readonly wcagReference?: string;
  /** Priority — higher rules take precedence when multiple match. */
  readonly priority: number;
  /** Whether this rule is active. */
  readonly enabled: boolean;
  /** Optional: conditions under which this rule applies. */
  readonly conditions?: ReadonlyArray<string>;
}

// ── Accessibility Compatibility Entry ─────────────────────────

/**
 * A compatibility matrix entry describing how two accessibility
 * adaptations interact on a given profile.
 */
export interface AccessibilityCompatibilityEntry {
  /** Unique entry identifier. */
  readonly id: string;
  /** The first system (e.g., 'animation' + 'motion'). */
  readonly systemA: string;
  /** The second system. */
  readonly systemB: string;
  /** The profile this compatibility applies to. */
  readonly profile: AccessibilityProfile;
  /** Whether both adaptations can coexist for this profile. */
  readonly isCompatible: boolean;
  /** Optional: if incompatible, which adaptation takes precedence. */
  readonly precedence?: AccessibilityCategory;
  /** Human-readable description. */
  readonly description: string;
}

// ── Accessibility Capability Entry (Runtime State) ────────────

/**
 * Runtime state for a single accessibility capability within the snapshot.
 */
export interface AccessibilityCapabilityEntry {
  /** The accessibility category. */
  readonly category: AccessibilityCategory;
  /** The current accessibility strategy. */
  readonly strategy: AccessibilityStrategy;
  /** Whether this capability is currently active. */
  readonly isEnabled: boolean;
  /** Whether this capability uses an alternative. */
  readonly isAlternative: boolean;
  /** Whether this capability is enhanced. */
  readonly isEnhanced: boolean;
  /** Whether this capability is substituted. */
  readonly isSubstituted: boolean;
  /** The profile from which this strategy was derived. */
  readonly sourceProfile: AccessibilityProfile;
  /** Timestamp of the last strategy change. */
  readonly lastChange: number;
}

// ── Accessibility Recommendation ──────────────────────────────

/**
 * A generated recommendation for accessibility adaptation.
 *
 * Future systems consume these recommendations to make actual
 * runtime decisions. Recommendations are advisory — they describe
 * what SHOULD happen, not what IS happening.
 */
export interface AccessibilityRecommendation {
  /** Unique recommendation identifier. */
  readonly id: string;
  /** The category this recommendation targets. */
  readonly category: AccessibilityCategory;
  /** The recommended strategy. */
  readonly strategy: AccessibilityStrategy;
  /** Severity of the recommendation. */
  readonly severity: 'info' | 'warning' | 'critical';
  /** Human-readable recommendation message. */
  readonly message: string;
  /** The profile that triggered this recommendation. */
  readonly profile: AccessibilityProfile;
  /** WCAG success criterion reference. */
  readonly wcagReference?: string;
}

// ── Accessibility Snapshot ────────────────────────────────────

/**
 * Immutable snapshot of the complete accessibility fallback state.
 *
 * Revision-counted and timestamped. Consumers compare revisions to
 * detect changes. Frozen via Object.freeze().
 */
export interface AccessibilitySnapshot {
  /** The active accessibility profile. */
  readonly activeProfile: AccessibilityProfile;
  /** The complete capability profile for the active profile. */
  readonly profile: AccessibilityCapabilityProfile;
  /** Per-category capability entries. */
  readonly capabilities: ReadonlyMap<AccessibilityCategory, AccessibilityCapabilityEntry>;
  /** Active accessibility preferences. */
  readonly preferences: ReadonlyMap<string, AccessibilityPreference>;
  /** Active accessibility rules. */
  readonly rules: ReadonlyMap<string, AccessibilityRule>;
  /** Compatibility matrix entries. */
  readonly compatibilityMatrix: ReadonlyMap<string, AccessibilityCompatibilityEntry>;
  /** Generated recommendations. */
  readonly recommendations: ReadonlyArray<AccessibilityRecommendation>;
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
  /** Whether high-contrast mode is active. */
  readonly isHighContrast: boolean;
  /** Whether keyboard-only navigation is active. */
  readonly isKeyboardOnly: boolean;
  /** Whether screen reader is active. */
  readonly isScreenReader: boolean;
  /** Whether low-vision adaptations are active. */
  readonly isLowVision: boolean;
  /** Whether 3D rendering is enabled for this profile. */
  readonly enables3D: boolean;
  /** Whether animations are enabled for this profile. */
  readonly enablesAnimations: boolean;
  /** Whether audio is enabled for this profile. */
  readonly enablesAudio: boolean;
  /** Total number of active capabilities (strategy !== 'disabled'). */
  readonly activeCapabilityCount: number;
  /** Total number of disabled capabilities. */
  readonly disabledCapabilityCount: number;
  /** Total number of alternative capabilities. */
  readonly alternativeCapabilityCount: number;
  /** Total number of enhanced capabilities. */
  readonly enhancedCapabilityCount: number;
  /** Total number of registered preferences. */
  readonly preferenceCount: number;
  /** Total number of registered rules. */
  readonly ruleCount: number;
  /** Total number of compatibility entries. */
  readonly compatibilityCount: number;
  /** Monotonic revision counter — incremented on each snapshot rebuild. */
  readonly revision: number;
  /** High-resolution timestamp of the last snapshot rebuild. */
  readonly timestamp: number;
}

// ── Accessibility Registry ────────────────────────────────────

/**
 * Read-only registry for querying accessibility fallback state.
 *
 * All methods return data from the current immutable snapshot.
 */
export interface AccessibilityRegistry {
  /** Get the capability entry for a category. */
  readonly getCapability: (category: AccessibilityCategory) => AccessibilityCapabilityEntry | undefined;
  /** Get the strategy for a category. */
  readonly getStrategy: (category: AccessibilityCategory) => AccessibilityStrategy;
  /** Get a preference by ID. */
  readonly getPreference: (id: string) => AccessibilityPreference | undefined;
  /** Get a rule by ID. */
  readonly getRule: (id: string) => AccessibilityRule | undefined;
  /** Get a compatibility entry by ID. */
  readonly getCompatibility: (id: string) => AccessibilityCompatibilityEntry | undefined;
  /** Get all accessibility categories. */
  readonly getCategories: () => readonly AccessibilityCategory[];
  /** Get all active categories (strategy !== 'disabled'). */
  readonly getActiveCategories: () => readonly AccessibilityCategory[];
  /** Get all disabled categories. */
  readonly getDisabledCategories: () => readonly AccessibilityCategory[];
  /** Get all alternative categories. */
  readonly getAlternativeCategories: () => readonly AccessibilityCategory[];
  /** Get all enhanced categories. */
  readonly getEnhancedCategories: () => readonly AccessibilityCategory[];
  /** Get all substituted categories. */
  readonly getSubstitutedCategories: () => readonly AccessibilityCategory[];
  /** Get all preferences. */
  readonly getPreferences: () => readonly AccessibilityPreference[];
  /** Get all rules. */
  readonly getRules: () => readonly AccessibilityRule[];
  /** Get all compatibility entries. */
  readonly getCompatibilityEntries: () => readonly AccessibilityCompatibilityEntry[];
  /** Check if a preference is enabled for the active profile. */
  readonly isPreferenceEnabled: (preferenceId: string) => boolean;
  /** Check if a category has a specific strategy. */
  readonly hasStrategy: (category: AccessibilityCategory, strategy: AccessibilityStrategy) => boolean;
  /** Check if a category is enabled. */
  readonly isCategoryEnabled: (category: AccessibilityCategory) => boolean;
  /** Check if a category uses an alternative. */
  readonly isCategoryAlternative: (category: AccessibilityCategory) => boolean;
  /** Get the total number of capabilities. */
  readonly capabilityCount: () => number;
  /** Get the total number of preferences. */
  readonly preferenceCount: () => number;
  /** Get the total number of rules. */
  readonly ruleCount: () => number;
}

// ── Accessibility Fallback Manager ────────────────────────────

/**
 * The singleton accessibility fallback manager interface.
 *
 * Manages profiles, preferences, capability rules, compatibility matrix
 * entries, recommendations, and snapshot generation. No React dependency.
 * All mutations schedule RAF-batched updates.
 */
export interface AccessibilityFallbackManager {
  /** Get the current immutable snapshot. */
  readonly getSnapshot: () => AccessibilitySnapshot;
  /** Subscribe to all snapshot changes. */
  readonly subscribe: (callback: AccessibilityCallback) => AccessibilityUnsubscribe;
  /** Subscribe to a specific selector with equality check. */
  readonly subscribeSelector: <T>(
    selector: AccessibilitySelector<T>,
    callback: AccessibilityCallback,
    equalityFn?: AccessibilityEquality<T>,
  ) => AccessibilityUnsubscribe;
  /** Whether the manager has been initialized. */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — seeds from ThreePerformanceManager, MobileFallbackManager, and prefersReducedMotion. */
  readonly init: () => void;
  /** Destroy the manager — cleans up subscriptions and resets state. */
  readonly destroy: () => void;
  /** Set the active accessibility profile. */
  readonly setActiveProfile: (profile: AccessibilityProfile) => void;
  /** Get the active accessibility profile. */
  readonly getActiveProfile: () => AccessibilityProfile;
  /** Register a capability profile. */
  readonly registerProfile: (profile: AccessibilityCapabilityProfile) => void;
  /** Register an accessibility rule. */
  readonly registerRule: (rule: AccessibilityRule) => void;
  /** Unregister an accessibility rule. */
  readonly unregisterRule: (id: string) => void;
  /** Register an accessibility preference. */
  readonly registerPreference: (preference: AccessibilityPreference) => void;
  /** Unregister an accessibility preference. */
  readonly unregisterPreference: (id: string) => void;
  /** Register a compatibility entry. */
  readonly registerCompatibility: (entry: AccessibilityCompatibilityEntry) => void;
  /** Unregister a compatibility entry. */
  readonly unregisterCompatibility: (id: string) => void;
  /** Evaluate all rules and generate recommendations. */
  readonly evaluate: () => void;
  /** Get the registry for read-only queries. */
  readonly getRegistry: () => AccessibilityRegistry;
  /** Set reduced-motion state. */
  readonly setReducedMotion: (reduced: boolean) => void;
  /** Set high-contrast state. */
  readonly setHighContrast: (highContrast: boolean) => void;
}

// ── Subscription Types ────────────────────────────────────────

/** Selector function — extracts a slice from the snapshot. */
export type AccessibilitySelector<T> = (snapshot: AccessibilitySnapshot) => T;

/** Equality function — compares selected values. */
export type AccessibilityEquality<T> = (prev: T, next: T) => boolean;

/** Callback for all-change subscriptions. */
export type AccessibilityCallback = () => void;

/** Unsubscribe function. */
export type AccessibilityUnsubscribe = () => void;
