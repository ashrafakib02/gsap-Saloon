/**
 * Progressive Reveal Types — Global Reveal Architecture
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "When the visitor scrolls backward, previously-revealed
 *  content remains revealed."
 *
 * From DESIGN_SYSTEM §15 (AC5):
 * "prefers-reduced-motion is always respected. When active:
 *  all scroll-linked reveals become instant."
 *
 * This module defines the complete type system for the progressive
 * reveal layer — the infrastructure that determines WHAT should become
 * visible and WHEN. It stores metadata and orchestrates reveal STATE
 * only; it never runs animations.
 *
 * Future consumers (GSAP, Framer Motion, React Three Fiber, Camera,
 * Lighting, Audio, UI) subscribe to this reveal state to drive their
 * own visual effects.
 *
 * Architecture:
 *   RevealStrategy + RevealPriority + RevealTrigger + RevealResetPolicy
 *   → RevealItemOptions / RevealGroupOptions / RevealSequenceOptions
 *   → RevealItemDefinition / RevealGroupDefinition / RevealSequenceDefinition
 *   → RevealItemState / RevealGroupState / RevealSequenceState
 *   → ProgressiveRevealSnapshot (immutable)
 *   → ProgressiveRevealRegistry (query interface)
 *   → ProgressiveRevealManager (registration + lifecycle)
 *
 * Phase 5.6: Infrastructure types — no animation code.
 */

import type { SectionId } from './narrative.types';

// ── Reveal Strategy ─────────────────────────────────────────

/**
 * Reveal strategies describe HOW an item is intended to become
 * visible. The manager stores this as metadata only — the actual
 * animation is applied later by a consuming system.
 *
 * From DESIGN_SYSTEM §14:
 * "Motion serves content, never decorates it."
 */
export const REVEAL_STRATEGIES = [
  /** Appears immediately with no transition */
  'instant',
  /** Simple opacity fade-in */
  'fade',
  /** Cascading reveal — children reveal in a flowing wave */
  'cascade',
  /** Staggered reveal — children reveal with a fixed offset */
  'stagger',
  /** Ordered sequence — one item after another, gated by completion */
  'sequence',
  /** Manually controlled — consumer decides when to reveal */
  'manual',
  /** Reveal when the item enters the viewport */
  'viewport',
  /** Reveal driven by the scroll timeline position */
  'timeline',
  /** Reveal gated by dependency completion */
  'dependency',
  /** Reveal synchronized with the parent group */
  'group',
] as const;

/** Type-safe union of reveal strategies. */
export type RevealStrategy = (typeof REVEAL_STRATEGIES)[number];

// ── Reveal State ────────────────────────────────────────────

/**
 * Lifecycle state of a reveal item.
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "Previously-revealed content remains revealed." Once an item
 * reaches 'revealed' it stays there unless a reset policy fires.
 */
export const REVEAL_STATES = [
  /** Registered but not yet eligible to reveal */
  'pending',
  /** Actively revealing — transition in progress (consumer-driven) */
  'revealing',
  /** Fully revealed and settled */
  'revealed',
  /** Explicitly hidden — was revealed, then reset */
  'hidden',
  /** Reset to initial state, awaiting re-reveal */
  'reset',
] as const;

/** Type-safe union of reveal lifecycle states. */
export type RevealState = (typeof REVEAL_STATES)[number];

// ── Reveal Visibility ───────────────────────────────────────

/**
 * Viewport-relative visibility of a reveal item.
 *
 * Distinct from {@link RevealState}: visibility describes where the
 * item is relative to the viewport, while state describes its
 * reveal lifecycle.
 */
export const REVEAL_VISIBILITY = [
  /** Outside the viewport and not revealed */
  'hidden',
  /** Crossing into the viewport (leading edge) */
  'entering',
  /** Fully within the viewport */
  'visible',
  /** Crossing out of the viewport (trailing edge) */
  'leaving',
] as const;

/** Type-safe union of reveal visibility states. */
export type RevealVisibility = (typeof REVEAL_VISIBILITY)[number];

// ── Reveal Priority ─────────────────────────────────────────

/**
 * Reveal priority — determines ordering when multiple items become
 * eligible in the same frame.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Above-fold content receives critical priority.
 *  Below-fold content loads during idle."
 */
export const REVEAL_PRIORITIES = [
  /** Must reveal first — above-fold, hero-adjacent content */
  'critical',
  /** Should reveal early — primary content */
  'high',
  /** Standard reveal order — default */
  'normal',
  /** Reveal last — decorative, below-fold content */
  'low',
] as const;

/** Type-safe union of reveal priorities. */
export type RevealPriority = (typeof REVEAL_PRIORITIES)[number];

// ── Reveal Trigger ──────────────────────────────────────────

/**
 * What causes an item to become eligible to reveal.
 */
export const REVEAL_TRIGGERS = [
  /** Consumer calls reveal() explicitly */
  'manual',
  /** Item entered the viewport */
  'viewport',
  /** Scroll position crossed a threshold */
  'scroll',
  /** Timeline reached the item's window */
  'timeline',
  /** All prerequisites completed */
  'dependency',
  /** Reveal on registration, no gating */
  'immediate',
] as const;

/** Type-safe union of reveal triggers. */
export type RevealTrigger = (typeof REVEAL_TRIGGERS)[number];

// ── Reveal Reset Policy ─────────────────────────────────────

/**
 * When a revealed item returns to a pending/hidden state.
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "Previously-revealed content remains revealed." The default
 * policy is therefore 'none' — reveals are permanent.
 */
export const REVEAL_RESET_POLICIES = [
  /** Never reset — reveals are permanent (default, Law 5) */
  'none',
  /** Reset when the item scrolls fully out of the viewport */
  'on-exit',
  /** Reset when the item's section is left */
  'on-leave',
  /** Reset on every viewport exit and re-reveal on re-entry */
  'always',
  /** Reset only when reset() is called explicitly */
  'manual',
] as const;

/** Type-safe union of reveal reset policies. */
export type RevealResetPolicy = (typeof REVEAL_RESET_POLICIES)[number];

// ── Reveal Item ─────────────────────────────────────────────

/**
 * Consumer-facing options for registering a reveal item.
 *
 * All fields except `id` are optional — sensible defaults come
 * from the manager configuration.
 */
export interface RevealItemOptions {
  /** Unique item identifier */
  readonly id: string;
  /** Group this item belongs to (enables group synchronization) */
  readonly groupId?: string;
  /** Section this item is associated with (for scroll/section gating) */
  readonly sectionId?: SectionId;
  /** How this item should reveal (metadata only) */
  readonly strategy?: RevealStrategy;
  /** What triggers the reveal */
  readonly trigger?: RevealTrigger;
  /** Reveal priority for same-frame ordering */
  readonly priority?: RevealPriority;
  /** Reset policy governing when the item hides again */
  readonly resetPolicy?: RevealResetPolicy;
  /** Ordinal position within the group/sequence (lower reveals first) */
  readonly order?: number;
  /** Delay in milliseconds before the reveal is applied (metadata) */
  readonly delay?: number;
  /** IDs that must be revealed before this item is eligible */
  readonly prerequisites?: readonly string[];
  /** Parent item ID (for nested reveals) */
  readonly parentId?: string;
  /** Whether the item is initially eligible (default: true) */
  readonly enabled?: boolean;
}

/**
 * Complete internal definition of a reveal item.
 *
 * Derived from {@link RevealItemOptions} with all defaults resolved.
 */
export interface RevealItemDefinition {
  readonly id: string;
  readonly groupId: string | null;
  readonly sectionId: SectionId | null;
  readonly strategy: RevealStrategy;
  readonly trigger: RevealTrigger;
  readonly priority: RevealPriority;
  readonly resetPolicy: RevealResetPolicy;
  readonly order: number;
  readonly delay: number;
  readonly prerequisites: readonly string[];
  readonly parentId: string | null;
  readonly enabled: boolean;
}

/**
 * Runtime state for a single reveal item.
 *
 * Immutable per snapshot — the manager replaces the object on change.
 */
export interface RevealItemState {
  readonly id: string;
  readonly state: RevealState;
  readonly visibility: RevealVisibility;
  /** Normalized reveal progress (0→1) — consumer-driven */
  readonly progress: number;
  /** Whether all prerequisites are satisfied */
  readonly dependenciesMet: boolean;
  /** Timestamp of the last state change */
  readonly lastChange: number;
}

// ── Reveal Group ────────────────────────────────────────────

/**
 * Consumer-facing options for registering a reveal group.
 *
 * Groups coordinate the reveal of many items — enabling cascade,
 * stagger, and synchronized group reveals.
 */
export interface RevealGroupOptions {
  /** Unique group identifier */
  readonly id: string;
  /** Section this group is associated with */
  readonly sectionId?: SectionId;
  /** Default strategy for items in this group */
  readonly strategy?: RevealStrategy;
  /** Default trigger for items in this group */
  readonly trigger?: RevealTrigger;
  /** Group reveal priority */
  readonly priority?: RevealPriority;
  /** Reset policy for the group as a whole */
  readonly resetPolicy?: RevealResetPolicy;
  /** Stagger step in ms between successive children (metadata) */
  readonly stagger?: number;
  /**
   * Whether the group is considered complete only when ALL children
   * are revealed (true) or when ANY child is revealed (false).
   */
  readonly requireAllChildren?: boolean;
  /** Whether the group is initially enabled (default: true) */
  readonly enabled?: boolean;
}

/**
 * Complete internal definition of a reveal group.
 */
export interface RevealGroupDefinition {
  readonly id: string;
  readonly sectionId: SectionId | null;
  readonly strategy: RevealStrategy;
  readonly trigger: RevealTrigger;
  readonly priority: RevealPriority;
  readonly resetPolicy: RevealResetPolicy;
  readonly stagger: number;
  readonly requireAllChildren: boolean;
  readonly enabled: boolean;
}

/**
 * Runtime state for a reveal group.
 */
export interface RevealGroupState {
  readonly id: string;
  readonly state: RevealState;
  /** IDs of items registered to this group */
  readonly itemIds: readonly string[];
  /** Count of revealed items in the group */
  readonly revealedCount: number;
  /** Total items in the group */
  readonly totalCount: number;
  /** Group reveal progress (0→1) — revealedCount / totalCount */
  readonly progress: number;
  /** Timestamp of the last group state change */
  readonly lastChange: number;
}

// ── Reveal Sequence ─────────────────────────────────────────

/**
 * Consumer-facing options for registering a reveal sequence.
 *
 * A sequence reveals its steps in a strict order — each step is
 * gated on the completion of the previous step.
 */
export interface RevealSequenceOptions {
  /** Unique sequence identifier */
  readonly id: string;
  /** Section this sequence is associated with */
  readonly sectionId?: SectionId;
  /** Ordered list of item IDs comprising the sequence */
  readonly steps: readonly string[];
  /** Sequence priority */
  readonly priority?: RevealPriority;
  /** Reset policy for the sequence */
  readonly resetPolicy?: RevealResetPolicy;
  /** Whether the sequence loops back to the start on completion */
  readonly loop?: boolean;
  /** Whether the sequence is initially enabled (default: true) */
  readonly enabled?: boolean;
}

/**
 * Complete internal definition of a reveal sequence.
 */
export interface RevealSequenceDefinition {
  readonly id: string;
  readonly sectionId: SectionId | null;
  readonly steps: readonly string[];
  readonly priority: RevealPriority;
  readonly resetPolicy: RevealResetPolicy;
  readonly loop: boolean;
  readonly enabled: boolean;
}

/**
 * Runtime state for a reveal sequence.
 */
export interface RevealSequenceState {
  readonly id: string;
  readonly state: RevealState;
  /** Index of the currently active step (−1 if not started) */
  readonly activeStepIndex: number;
  /** ID of the currently active step (null if not started/complete) */
  readonly activeStepId: string | null;
  /** Count of completed steps */
  readonly completedCount: number;
  /** Total steps in the sequence */
  readonly totalSteps: number;
  /** Sequence progress (0→1) */
  readonly progress: number;
  /** Whether the sequence has fully completed */
  readonly isComplete: boolean;
  /** Timestamp of the last sequence state change */
  readonly lastChange: number;
}

// ── Dependency Graph ────────────────────────────────────────

/**
 * A resolved view of the reveal dependency graph.
 *
 * Enables consumers to reason about parent/child relationships,
 * prerequisites, and completion requirements without recomputing.
 */
export interface RevealDependencyNode {
  /** Item ID this node represents */
  readonly id: string;
  /** Parent item ID (null for roots) */
  readonly parentId: string | null;
  /** Direct child item IDs */
  readonly children: readonly string[];
  /** Prerequisite item IDs that gate this node */
  readonly prerequisites: readonly string[];
  /** Whether every prerequisite is currently revealed */
  readonly satisfied: boolean;
}

/**
 * The full dependency graph, indexed by item ID.
 */
export interface RevealDependencyGraph {
  /** All dependency nodes, keyed by item ID */
  readonly nodes: ReadonlyMap<string, RevealDependencyNode>;
  /** Root item IDs (no parent) */
  readonly roots: readonly string[];
}

// ── Snapshot ────────────────────────────────────────────────

/**
 * The complete immutable snapshot of progressive reveal state.
 *
 * This is the single source of truth consumed by all reveal hooks.
 * The manager replaces this object wholesale on every change so that
 * `Object.is` reference checks detect updates cheaply.
 */
export interface ProgressiveRevealSnapshot {
  /** Item runtime state, keyed by item ID */
  readonly items: ReadonlyMap<string, RevealItemState>;
  /** Group runtime state, keyed by group ID */
  readonly groups: ReadonlyMap<string, RevealGroupState>;
  /** Sequence runtime state, keyed by sequence ID */
  readonly sequences: ReadonlyMap<string, RevealSequenceState>;
  /** IDs of all currently visible items */
  readonly visibleItemIds: readonly string[];
  /** IDs of all revealed items */
  readonly revealedItemIds: readonly string[];
  /** IDs of all pending items */
  readonly pendingItemIds: readonly string[];
  /** ID of the currently active sequence (null if none) */
  readonly activeSequenceId: string | null;
  /** IDs of sequences that have completed */
  readonly completedSequenceIds: readonly string[];
  /** Overall reveal progress across all items (0→1) */
  readonly overallProgress: number;
  /** Whether reduced motion is active (mirrors scroll state) */
  readonly isReducedMotion: boolean;
  /** Monotonic revision counter — increments on every change */
  readonly revision: number;
  /** Timestamp of the last snapshot update */
  readonly timestamp: number;
}

// ── Registry ────────────────────────────────────────────────

/**
 * Read-only query interface over the reveal registries.
 *
 * Mirrors the ScrollTrigger registry pattern — pure lookups,
 * no mutation.
 */
export interface ProgressiveRevealRegistry {
  /** Get an item's runtime state by ID */
  readonly getItem: (id: string) => RevealItemState | undefined;
  /** Get a group's runtime state by ID */
  readonly getGroup: (id: string) => RevealGroupState | undefined;
  /** Get a sequence's runtime state by ID */
  readonly getSequence: (id: string) => RevealSequenceState | undefined;
  /** All registered item IDs */
  readonly getItemIds: () => readonly string[];
  /** All registered group IDs */
  readonly getGroupIds: () => readonly string[];
  /** All registered sequence IDs */
  readonly getSequenceIds: () => readonly string[];
  /** Item IDs belonging to a group */
  readonly getItemsByGroup: (groupId: string) => readonly string[];
  /** Item IDs associated with a section */
  readonly getItemsBySection: (sectionId: SectionId) => readonly string[];
  /** Item IDs currently in a given reveal state */
  readonly getItemsByState: (state: RevealState) => readonly string[];
  /** Whether an item is registered */
  readonly hasItem: (id: string) => boolean;
  /** Total registered item count */
  readonly itemCount: () => number;
}

// ── Subscription Types ──────────────────────────────────────

/** Selector that extracts a slice of the reveal snapshot. */
export type RevealSelector<T> = (snapshot: ProgressiveRevealSnapshot) => T;

/** Equality comparator for a selected reveal value. */
export type RevealEquality<T> = (a: T, b: T) => boolean;

/** Subscriber callback fired on relevant reveal state changes. */
export type RevealCallback = () => void;

/** Unsubscribe handle returned by subscription methods. */
export type RevealUnsubscribe = () => void;

// ── Manager ─────────────────────────────────────────────────

/**
 * The singleton progressive reveal manager interface.
 *
 * This is the single owner of reveal state. All hooks and future
 * consumers read from this instance. It contains no React.
 */
export interface ProgressiveRevealManager {
  /** Get the current immutable snapshot */
  readonly getSnapshot: () => ProgressiveRevealSnapshot;
  /** Subscribe to all reveal state changes */
  readonly subscribe: (callback: RevealCallback) => RevealUnsubscribe;
  /** Subscribe to a specific slice of reveal state */
  readonly subscribeSelector: <T>(
    selector: RevealSelector<T>,
    callback: RevealCallback,
    equalityFn?: RevealEquality<T>,
  ) => RevealUnsubscribe;
  /** Whether the manager has been initialized */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — wires up scroll state integration */
  readonly init: () => void;
  /** Destroy the manager — clears listeners, registries, and state */
  readonly destroy: () => void;
  /** Register a reveal item (idempotent by ID) */
  readonly registerItem: (options: RevealItemOptions) => void;
  /** Unregister a reveal item */
  readonly unregisterItem: (id: string) => void;
  /** Register a reveal group (idempotent by ID) */
  readonly registerGroup: (options: RevealGroupOptions) => void;
  /** Unregister a reveal group */
  readonly unregisterGroup: (id: string) => void;
  /** Register a reveal sequence (idempotent by ID) */
  readonly registerSequence: (options: RevealSequenceOptions) => void;
  /** Unregister a reveal sequence */
  readonly unregisterSequence: (id: string) => void;
  /** Mark an item as revealed */
  readonly reveal: (id: string) => void;
  /** Mark an item as revealing (transition in progress) */
  readonly beginReveal: (id: string) => void;
  /** Reset an item to its pending state (subject to reset policy) */
  readonly reset: (id: string) => void;
  /** Reset every registered item */
  readonly resetAll: () => void;
  /** Update an item's viewport visibility */
  readonly setVisibility: (id: string, visibility: RevealVisibility) => void;
  /** Update an item's reveal progress (0→1) */
  readonly setProgress: (id: string, progress: number) => void;
  /** Advance the active step of a sequence */
  readonly advanceSequence: (id: string) => void;
  /** Get the read-only registry query interface */
  readonly getRegistry: () => ProgressiveRevealRegistry;
  /** Get the resolved dependency graph */
  readonly getDependencyGraph: () => RevealDependencyGraph;
  /** Enable or disable debug mode */
  readonly setDebugMode: (enabled: boolean) => void;
}

// ── Config ──────────────────────────────────────────────────

/**
 * Configuration for the progressive reveal manager.
 */
export interface ProgressiveRevealConfig {
  /** Default strategy when an item omits one */
  readonly defaultStrategy: RevealStrategy;
  /** Default trigger when an item omits one */
  readonly defaultTrigger: RevealTrigger;
  /** Default priority when an item omits one */
  readonly defaultPriority: RevealPriority;
  /** Default reset policy when an item omits one */
  readonly defaultResetPolicy: RevealResetPolicy;
  /** Default stagger step (ms) for groups */
  readonly defaultStagger: number;
  /** Default per-item reveal delay (ms) */
  readonly defaultDelay: number;
  /** Whether debug mode is enabled by default */
  readonly debugDefault: boolean;
}
