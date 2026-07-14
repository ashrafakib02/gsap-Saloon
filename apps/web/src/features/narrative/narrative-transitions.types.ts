/**
 * Narrative Transition Types — Section-to-Section Relationship Architecture
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Vertical scrolling is not a content delivery mechanism.
 *  It is a storytelling device."
 *
 * From PRODUCT_VISION §Breathing Pattern:
 * "Between any two content-dense elements, there must be spatial
 *  breathing room proportionally larger than the internal spacing."
 *
 * From PRODUCT_VISION §Motion Philosophy:
 * "Progressive Revelation — Content emerges gradually. Nothing
 *  appears all at once. Nothing disappears abruptly."
 *
 * This module defines the complete type system for how sections
 * relate to each other — their boundaries, emotional transitions,
 * pacing, and future animation/preload/sound hooks.
 *
 * Architecture:
 *   TransitionMetadata (per-pair) → TransitionDefinition (full record)
 *   → TransitionRegistry (all transitions) → hooks consume
 *
 * Phase 5.2: Transition structure — types only, no animation.
 */

import type { SectionId } from './narrative.types';

// ── Transition Type ────────────────────────────────────────

/**
 * The visual nature of a transition between two sections.
 *
 * From DESIGN_SYSTEM §14:
 * "Entry motions use ease-out. Exit motions use ease-in."
 *
 * Each type corresponds to a future GSAP timeline category
 * in Phase 9.
 */
export const TRANSITION_TYPES = [
  /** Gentle fade — most common, standard content sections */
  'fade',
  /** Slow cross-dissolve — signature moments (transformation, closing) */
  'dissolve',
  /** Standard content reveal — fade + slight rise */
  'reveal',
  /** Parallax + reveal — atmospheric depth sections */
  'parallax-reveal',
  /** Word-by-word typography — whisper emotional thesis */
  'word-reveal',
  /** Staggered portrait gallery — artisan reveal */
  'portrait-stagger',
  /** Staggered text cascade — testimonial cascade */
  'text-cascade',
  /** Hero warm reveal — the only time-linked animation */
  'warm-reveal',
  /** No visual transition — immediate, structural */
  'instant',
  /** No transition at all — fixed or structural sections */
  'none',
] as const;

/** Type-safe union of transition types. */
export type TransitionType = (typeof TRANSITION_TYPES)[number];

// ── Transition Direction ───────────────────────────────────

/**
 * Scroll direction that triggers the transition.
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "When the visitor scrolls backward, previously-revealed content
 *  remains revealed. Animations do not reverse."
 *
 * Direction matters for future animation asymmetry — forward
 * transitions may differ from backward transitions.
 */
export const TRANSITION_DIRECTIONS = [
  /** Scrolling down — normal forward narrative progression */
  'forward',
  /** Scrolling up — backward, content stays revealed */
  'backward',
  /** Not scroll-dependent — load-triggered or programmatic */
  'none',
] as const;

/** Type-safe union of transition directions. */
export type TransitionDirection = (typeof TRANSITION_DIRECTIONS)[number];

// ── Transition Speed ───────────────────────────────────────

/**
 * Pacing category for transitions.
 *
 * From PRODUCT_VISION §Scroll Pacing Rhythm:
 * "Slow opening. Gradual build. Peak density. Decisive close."
 *
 * From DESIGN_SYSTEM §14 Motion Constraints:
 * "Maximum reveal duration: 600ms (except hero and confirmation)"
 */
export const TRANSITION_SPEEDS = [
  /** Slow — hero reveal (1200-1500ms), closing dissolve (2000-2500ms) */
  'slow',
  /** Normal — standard content reveals (400-600ms) */
  'normal',
  /** Fast — quick transitions, breathing spaces (200-400ms) */
  'fast',
  /** Instant — zero duration, reduced motion fallback */
  'instant',
] as const;

/** Type-safe union of transition speeds. */
export type TransitionSpeed = (typeof TRANSITION_SPEEDS)[number];

// ── Transition Mood ────────────────────────────────────────

/**
 * Emotional quality of a transition.
 *
 * From PRODUCT_VISION §Emotional Architecture:
 * "The emotional goal — from the first pixel to the last —
 *  this brand earns trust, delivers beauty, and leaves the
 *  visitor longing for the experience."
 *
 * Each section pair has a mood that describes the emotional
 * shift as the visitor moves from one section to the next.
 */
export const TRANSITION_MOODS = [
  /** Inviting, gentle — most section transitions */
  'warm',
  /** Serene, peaceful — spa, closing */
  'calm',
  /** Close, personal — bridal, artisan portraits */
  'intimate',
  /** Lively, dynamic — transformation before/after */
  'energetic',
  /** Pause, breath — breathing spaces between acts */
  'still',
  /** Dramatic, peak — hero opening, closing moment */
  'grand',
  /** Decisive, clear — booking invitation */
  'confident',
] as const;

/** Type-safe union of transition moods. */
export type TransitionMood = (typeof TRANSITION_MOODS)[number];

// ── Transition Priority ────────────────────────────────────

/**
 * Execution priority for transitions.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Above-fold content receives critical priority.
 *  Below-fold content loads during idle."
 */
export const TRANSITION_PRIORITIES = [
  /** Must execute — hero reveal, critical path */
  'critical',
  /** Should execute — signature moments, above-fold */
  'high',
  /** Execute when possible — standard reveals */
  'normal',
  /** Execute if resources permit — below-fold, decorative */
  'low',
] as const;

/** Type-safe union of transition priorities. */
export type TransitionPriority = (typeof TRANSITION_PRIORITIES)[number];

// ── Transition Trigger ─────────────────────────────────────

/**
 * What initiates a transition.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is the conductor; the content is the orchestra."
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "The only time-linked animation is the hero Warm Unveiling."
 */
export const TRANSITION_TRIGGERS = [
  /** Scroll position crosses a threshold */
  'scroll',
  /** Triggered programmatically by code */
  'programmatic',
  /** User interaction (click, hover, keyboard) */
  'interaction',
  /** Page load / component mount */
  'load',
  /** Browser idle time — preload, deferred work */
  'idle',
] as const;

/** Type-safe union of transition triggers. */
export type TransitionTrigger = (typeof TRANSITION_TRIGGERS)[number];

// ── Section Boundary ───────────────────────────────────────

/**
 * Spatial boundary types within and between sections.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Every scroll position should correspond to exactly one idea."
 *
 * Boundaries define the spatial zones where transitions activate.
 * They are not calculated in this phase — only defined.
 */
export const SECTION_BOUNDARIES = [
  /** Top edge of section enters viewport */
  'section-start',
  /** Section center aligns with viewport center */
  'section-center',
  /** Bottom edge of section reaches viewport top */
  'section-end',
  /** Entering section from the section above (entry zone) */
  'entry-boundary',
  /** Leaving section toward the section below (exit zone) */
  'exit-boundary',
  /** Inside a breathing space section */
  'breathing',
  /** Crossing between acts (prologue→act-one, act-one→act-two, etc.) */
  'act-boundary',
  /** Crossing between chapters within an act (service to service) */
  'chapter-boundary',
] as const;

/** Type-safe union of section boundaries. */
export type SectionBoundary = (typeof SECTION_BOUNDARIES)[number];

// ── Transition State ───────────────────────────────────────

/**
 * Current lifecycle state of a transition.
 *
 * Models the enter → stay → exit lifecycle that every section
 * undergoes as the visitor scrolls through the narrative.
 */
export const TRANSITION_STATES = [
  /** Section not yet reached — transition not triggered */
  'idle',
  /** Section entering viewport — transition in progress */
  'entering',
  /** Section is the current focus — transition complete */
  'active',
  /** Section leaving viewport — exit transition in progress */
  'exiting',
  /** Section fully revealed — content visible, transition done */
  'completed',
] as const;

/** Type-safe union of transition states. */
export type TransitionState = (typeof TRANSITION_STATES)[number];

// ── Breathing Space Purpose ────────────────────────────────

/**
 * Why a breathing space exists at a specific position.
 *
 * From PRODUCT_VISION §Breathing Pattern:
 * "The rhythm of the page should feel like breathing —
 *  inhale (absorb visual), exhale (read text)."
 *
 * From PRODUCT_VISION §P6: Pacing as Rhythm:
 * "Alternate between dense and sparse, fast and slow,
 *  visual and textual."
 */
export const BREATHING_PURPOSES = [
  /** Transition between acts — emotional palette cleanse */
  'act-transition',
  /** Rest between dense service sections */
  'density-rest',
  /** Rhythm break — visual palate cleanser */
  'rhythm-break',
  /** Emotional reset before a peak moment */
  'emotional-reset',
  /** Preparation for a change in narrative tempo */
  'tempo-shift',
] as const;

/** Type-safe union of breathing space purposes. */
export type BreathingPurpose = (typeof BREATHING_PURPOSES)[number];

// ── Reduced Motion Strategy ────────────────────────────────

/**
 * How a transition behaves under prefers-reduced-motion.
 *
 * From DESIGN_SYSTEM §Accessibility:
 * "When prefers-reduced-motion is active — all scroll
 *  animations instant. The experience is complete and
 *  satisfying without any motion."
 */
export const REDUCED_MOTION_STRATEGIES = [
  /** Complete removal — no animation, content appears instantly */
  'none',
  /** Simplified — reduce duration but keep gentle motion */
  'simplified',
  /** Instant — content appears immediately, no transition */
  'instant',
] as const;

/** Type-safe union of reduced motion strategies. */
export type ReducedMotionStrategy = (typeof REDUCED_MOTION_STRATEGIES)[number];

// ── Transition Metadata ────────────────────────────────────

/**
 * Complete metadata for a single transition between two sections.
 *
 * This is the core data type of the transition system.
 * Each consecutive section pair has exactly one TransitionMetadata
 * entry that defines their relationship.
 */
export interface TransitionMetadata {
  /** Unique transition identifier: "fromId→toId" */
  readonly id: string;
  /** Source section ID */
  readonly from: SectionId;
  /** Destination section ID */
  readonly to: SectionId;
  /** The visual transition type */
  readonly type: TransitionType;
  /** Primary scroll direction for this transition */
  readonly direction: TransitionDirection;
  /** Transition pacing category */
  readonly speed: TransitionSpeed;
  /** Emotional quality of the transition */
  readonly mood: TransitionMood;
  /** Execution priority */
  readonly priority: TransitionPriority;
  /** What triggers this transition */
  readonly trigger: TransitionTrigger;
  /** Whether this transition is currently enabled */
  readonly enabled: boolean;

  // ── Boundary Information ──

  /** Where in the source section the transition begins */
  readonly exitBoundary: SectionBoundary;
  /** Where in the destination section the transition ends */
  readonly entryBoundary: SectionBoundary;

  // ── Narrative Context ──

  /** Whether this transition crosses an act boundary */
  readonly isActTransition: boolean;
  /** Whether this transition crosses a chapter boundary */
  readonly isChapterTransition: boolean;
  /** Whether the destination section is a breathing space */
  readonly isToBreathingSpace: boolean;
  /** Whether the source section is a breathing space */
  readonly isFromBreathingSpace: boolean;

  // ── Future Phase Hooks (populated in later phases) ──

  /** GSAP animation key for this transition (Phase 9) */
  readonly animationKey: string | null;
  /** Future camera transition key (Phase 6) */
  readonly cameraKey: string | null;
  /** Preload trigger key — when to preload destination assets (Phase 11) */
  readonly preloadKey: string | null;
  /** Future audio/sound cue key */
  readonly soundKey: string | null;
  /** Analytics event key for this transition */
  readonly analyticsKey: string | null;

  // ── Accessibility ──

  /** Accessibility notes for this transition */
  readonly accessibilityNotes: string;
  /** How this transition behaves under prefers-reduced-motion */
  readonly reducedMotionStrategy: ReducedMotionStrategy;
}

// ── Breathing Space Configuration ──────────────────────────

/**
 * First-class configuration for a breathing space section.
 *
 * Breathing spaces are not empty gaps — they are intentional
 * architectural pauses with defined purpose, behavior, and
 * future visual treatment.
 *
 * From PRODUCT_VISION §Breathing Pattern:
 * "The visitor should never experience sustained density
 *  or sustained emptiness."
 */
export interface BreathingSpaceConfig {
  /** The breathing space section ID */
  readonly sectionId: SectionId;
  /** Why this breathing space exists */
  readonly purpose: BreathingPurpose;
  /** Pacing category — how long the pause feels */
  readonly durationCategory: TransitionSpeed;
  /** The section before this breathing space */
  readonly precedingSection: SectionId;
  /** The section after this breathing space */
  readonly followingSection: SectionId;
  /** How the preceding section exits into this pause */
  readonly entryStrategy: TransitionType;
  /** How this pause exits into the following section */
  readonly exitStrategy: TransitionType;
  /** Mood during the breathing space */
  readonly mood: TransitionMood;
  /** Reduced motion behavior */
  readonly reducedMotionStrategy: ReducedMotionStrategy;
  /** Future visual treatment description (Phase 9) */
  readonly futureVisualTreatment: string;
}

// ── Section Boundary Configuration ─────────────────────────

/**
 * Describes the spatial boundaries of a section for transition purposes.
 *
 * Boundaries define WHERE transitions activate. They are not
 * calculated yet — only defined architecturally.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Every scroll position should correspond to exactly one idea."
 */
export interface SectionBoundaryConfig {
  /** The section these boundaries belong to */
  readonly sectionId: SectionId;
  /** Boundary type where this section's entry transition activates */
  readonly entryZone: SectionBoundary;
  /** Boundary type where this section is fully active */
  readonly activeZone: SectionBoundary;
  /** Boundary type where this section's exit transition activates */
  readonly exitZone: SectionBoundary;
  /** Whether this section has a breathing entry */
  readonly hasBreathingEntry: boolean;
  /** Whether this section has a breathing exit */
  readonly hasBreathingExit: boolean;
}

// ── Transition Definition ──────────────────────────────────

/**
 * A complete transition record linking two sections.
 *
 * Combines TransitionMetadata with boundary configurations
 * for both sections involved in the transition.
 */
export interface TransitionDefinition {
  /** The transition metadata */
  readonly metadata: TransitionMetadata;
  /** Boundary configuration for the source section */
  readonly fromBoundaries: SectionBoundaryConfig;
  /** Boundary configuration for the destination section */
  readonly toBoundaries: SectionBoundaryConfig;
}

// ── Transition Registry ────────────────────────────────────

/**
 * The central transition registry interface.
 *
 * Created by createTransitionRegistry() — immutable after construction.
 * Consumed by useTransitionRegistry() hook.
 */
export interface TransitionRegistry {
  /** Get a transition by its ID (format: "fromId→toId") */
  get(id: string): TransitionMetadata | undefined;
  /** Get the transition between two specific sections */
  getBetween(from: SectionId, to: SectionId): TransitionMetadata | undefined;
  /** Get the transition that leads INTO a section */
  getEntry(sectionId: SectionId): TransitionMetadata | undefined;
  /** Get the transition that leads OUT of a section */
  getExit(sectionId: SectionId): TransitionMetadata | undefined;
  /** Get all transitions in scroll order */
  getAll(): readonly TransitionMetadata[];
  /** Get transitions filtered by type */
  getByType(type: TransitionType): readonly TransitionMetadata[];
  /** Get transitions filtered by mood */
  getByMood(mood: TransitionMood): readonly TransitionMetadata[];
  /** Get transitions filtered by priority */
  getByPriority(priority: TransitionPriority): readonly TransitionMetadata[];
  /** Get only enabled transitions */
  getEnabled(): readonly TransitionMetadata[];
  /** Get transitions that cross act boundaries */
  getActTransitions(): readonly TransitionMetadata[];
  /** Get the full transition sequence (ordered array) */
  getSequence(): readonly TransitionMetadata[];
  /** Get the complete transition definition with boundaries */
  getDefinition(from: SectionId, to: SectionId): TransitionDefinition | undefined;
  /** Get all breathing space configurations */
  getBreathingSpaces(): readonly BreathingSpaceConfig[];
  /** Get a breathing space config by section ID */
  getBreathingSpace(sectionId: SectionId): BreathingSpaceConfig | undefined;
  /** Total transition count */
  count(): number;
  /** Check if a transition ID exists */
  has(id: string): boolean;
}

// ── Transition Context ─────────────────────────────────────

/**
 * The value provided by TransitionProvider (future phase).
 *
 * Contains the transition registry and derived state.
 */
export interface TransitionContextValue {
  /** The transition registry — immutable, typed */
  readonly registry: TransitionRegistry;
  /** All transitions in scroll order */
  readonly transitions: readonly TransitionMetadata[];
  /** Only enabled transitions */
  readonly enabledTransitions: readonly TransitionMetadata[];
  /** Total transition count */
  readonly transitionCount: number;
  /** All breathing space configurations */
  readonly breathingSpaces: readonly BreathingSpaceConfig[];
}
