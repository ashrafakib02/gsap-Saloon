/**
 * ScrollTrigger Types — ScrollTrigger Infrastructure
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "Scroll-Linked, Not Time-Linked. The visitor controls the speed."
 *
 * This module defines the complete type system for the ScrollTrigger
 * management layer — the infrastructure that connects the narrative
 * timeline architecture to GSAP ScrollTrigger instances.
 *
 * The types describe WHAT triggers exist, HOW they behave, and
 * WHAT lifecycle they follow — without creating any instances.
 *
 * Architecture:
 *   TriggerGroup + TriggerPriority + TriggerBreakpoint
 *   → TriggerOptions (consumer-facing config)
 *   → TriggerDefinition (internal complete definition)
 *   → TriggerState (runtime state per instance)
 *   → ScrollTriggerRegistry (query interface)
 *   → ScrollTriggerManager (creation + lifecycle)
 *
 * Phase 5.4: Infrastructure types — no animation code.
 */

import type { SectionId } from './narrative.types';

// ── Trigger Group ───────────────────────────────────────────

/**
 * Functional groups for organizing triggers.
 *
 * Groups allow batch operations — e.g., disabling all parallax
 * triggers on mobile, or killing all section triggers during
 * page transitions.
 *
 * From DESIGN_SYSTEM §14:
 * "Different animation types have different resource budgets."
 */
export const TRIGGER_GROUPS = [
  /** Section reveals — fade-in on scroll entry */
  'section-reveal',
  /** Parallax depth effects — background movement */
  'parallax',
  /** Text reveals — headline and body animations */
  'text-reveal',
  /** Image reveals — photography entrance animations */
  'image-reveal',
  /** UI interactions — navigation, overlay transitions */
  'ui',
  /** Camera transitions — R3F camera movement triggers */
  'camera',
  /** Analytics — scroll depth tracking triggers */
  'analytics',
  /** Accessibility — section landmark announcements */
  'accessibility',
  /** Structural — threshold, footer, non-visual triggers */
  'structural',
] as const;

/** Type-safe union of trigger groups. */
export type TriggerGroup = (typeof TRIGGER_GROUPS)[number];

// ── Trigger Priority ────────────────────────────────────────

/**
 * Execution priority for triggers.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Above-fold content receives critical priority.
 *  Below-fold content loads during idle."
 *
 * Priority determines creation order and which triggers
 * get refresh-batched first.
 */
export const TRIGGER_PRIORITIES = [
  /** Must execute — hero, above-fold section reveals */
  'critical',
  /** Should execute — primary content sections */
  'high',
  /** Execute when possible — standard sections */
  'normal',
  /** Execute if resources permit — decorative, below-fold */
  'low',
] as const;

/** Type-safe union of trigger priorities. */
export type TriggerPriority = (typeof TRIGGER_PRIORITIES)[number];

// ── Trigger Lifecycle State ─────────────────────────────────

/**
 * The lifecycle state of a registered trigger.
 *
 * Models the complete lifecycle from registration through
 * active monitoring to destruction.
 */
export const TRIGGER_LIFECYCLE_STATES = [
  /** Registered but not yet created (lazy initialization) */
  'registered',
  /** ScrollTrigger instance created and active */
  'active',
  /** Temporarily disabled (e.g., reduced-motion, page transition) */
  'disabled',
  /** ScrollTrigger killed and removed from DOM */
  'destroyed',
] as const;

/** Type-safe union of trigger lifecycle states. */
export type TriggerLifecycleState = (typeof TRIGGER_LIFECYCLE_STATES)[number];

// ── Trigger Breakpoint ──────────────────────────────────────

/**
 * Breakpoint at which a trigger is active.
 *
 * From DESIGN_SYSTEM §7 (Breakpoints):
 * "Mobile-first: base → md (768) → lg (1024) → xl (1440)"
 *
 * From DESIGN_SYSTEM §Performance:
 * "Below-fold ScrollTrigger instances lazy-init when approaching viewport."
 */
export const TRIGGER_BREAKPOINTS = [
  /** Active on all viewport widths */
  'all',
  /** Active only on mobile (< 768px) */
  'mobile',
  /** Active only on tablet (768–1023px) */
  'tablet',
  /** Active only on desktop (≥ 1024px) */
  'desktop',
  /** Active only on wide screens (≥ 1440px) */
  'wide',
] as const;

/** Type-safe union of trigger breakpoints. */
export type TriggerBreakpoint = (typeof TRIGGER_BREAKPOINTS)[number];

// ── Trigger Options ─────────────────────────────────────────

/**
 * Consumer-facing configuration for creating a trigger.
 *
 * This is the API that hooks and components pass to the manager.
 * The manager enriches these options with computed defaults
 * before creating the actual ScrollTrigger instance.
 *
 * From DESIGN_SYSTEM §14:
 * "Content is always visible without animation."
 *   → `reducedMotionBehavior` controls graceful downgrade.
 */
export interface TriggerOptions {
  /** Unique trigger identifier */
  readonly id: string;
  /** Functional group for batch operations */
  readonly group: TriggerGroup;
  /** CSS selector or DOM element to observe */
  readonly trigger: string | Element;
  /** GSAP target(s) to animate (selector, element, or Tween targets) */
  readonly targets?: string | Element | gsap.TweenTarget;
  /** ScrollTrigger start position (default: 'top 80%') */
  readonly start?: string;
  /** ScrollTrigger end position */
  readonly end?: string;
  /** Whether scrub is enabled, and optionally the smoothness factor */
  readonly scrub?: boolean | number;
  /** Priority for refresh batching and creation order */
  readonly priority?: TriggerPriority;
  /** Breakpoint at which this trigger is active */
  readonly breakpoint?: TriggerBreakpoint;
  /** Whether the trigger is enabled */
  readonly enabled?: boolean;
  /** Show debug markers in development */
  readonly markers?: boolean;
  /** Refresh priority — higher refreshes first */
  readonly refreshPriority?: number;
  /** Behavior when prefers-reduced-motion is active */
  readonly reducedMotionBehavior?: 'skip' | 'instant' | 'simplify';
  /** Optional section ID for narrative integration */
  readonly sectionId?: SectionId;
  /** Callback when the trigger enters the viewport */
  readonly onEnter?: () => void;
  /** Callback when the trigger leaves the viewport */
  readonly onLeave?: () => void;
  /** Callback when scrolling back into the trigger */
  readonly onEnterBack?: () => void;
  /** Callback when scrolling back out of the trigger */
  readonly onLeaveBack?: () => void;
  /** Callback when scroll progress updates */
  readonly onUpdate?: (progress: number) => void;
}

// ── Trigger Definition ──────────────────────────────────────

/**
 * Internal complete definition of a trigger.
 *
 * Created by the manager when a trigger is registered.
 * Contains the full configuration needed to create and
 * manage a GSAP ScrollTrigger instance.
 */
export interface TriggerDefinition {
  /** The complete trigger configuration */
  readonly options: TriggerOptions;
  /** Whether reduced motion is currently active */
  readonly reducedMotionActive: boolean;
  /** Timestamp when this definition was created */
  readonly createdAt: number;
}

// ── Trigger State ───────────────────────────────────────────

/**
 * Runtime state of a registered trigger.
 *
 * Mutable — updated by the manager as the trigger
 * moves through its lifecycle.
 */
export interface TriggerState {
  /** Unique trigger identifier */
  readonly id: string;
  /** Functional group */
  readonly group: TriggerGroup;
  /** Current lifecycle state */
  state: TriggerLifecycleState;
  /** Whether the trigger is currently active */
  isActive: boolean;
  /** Whether the trigger is paused */
  isPaused: boolean;
  /** Timestamp when the state last changed */
  lastStateChange: number;
}

// ── Managed Trigger Instance ────────────────────────────────

/**
 * A managed ScrollTrigger instance with cleanup capability.
 *
 * Returned by the manager when creating triggers. Wraps the
 * underlying GSAP ScrollTrigger instance with lifecycle methods.
 */
export interface ManagedTrigger {
  /** The underlying GSAP ScrollTrigger instance */
  readonly trigger: ScrollTriggerInstance;
  /** Kill this trigger and remove from the registry */
  kill: () => void;
}

/** The underlying GSAP ScrollTrigger instance type. */
export interface ScrollTriggerInstance {
  /** Whether the trigger is currently active */
  readonly isActive: boolean;
  /** Kill this ScrollTrigger instance */
  kill: () => void;
  /** Disable this ScrollTrigger instance */
  disable: () => void;
  /** Enable this ScrollTrigger instance */
  enable: () => void;
  /** The progress value (0-1) of this trigger */
  readonly progress: number;
  /** The direction of the last scroll (-1, 0, or 1) */
  readonly direction: number;
  /** Whether the trigger has been killed */
  readonly vars?: Record<string, unknown>;
}

// ── ScrollTrigger Registry ──────────────────────────────────

/**
 * Query interface for the trigger registry.
 *
 * Provides read-only access to registered triggers and
 * aggregate information about the system state.
 *
 * From DESIGN_SYSTEM §10:
 * "The codebase must survive human turnover."
 *   → All methods documented, all types explicit.
 */
export interface ScrollTriggerRegistry {
  /** Get a trigger state by ID */
  get(id: string): TriggerState | undefined;
  /** Get all registered trigger IDs */
  getAll(): readonly string[];
  /** Get all active trigger IDs */
  getActive(): readonly string[];
  /** Get all destroyed trigger IDs */
  getDestroyed(): readonly string[];
  /** Get trigger IDs filtered by group */
  getByGroup(group: TriggerGroup): readonly string[];
  /** Get trigger IDs filtered by priority */
  getByPriority(priority: TriggerPriority): readonly string[];
  /** Get trigger IDs filtered by state */
  getByState(state: TriggerLifecycleState): readonly string[];
  /** Get trigger IDs filtered by breakpoint */
  getByBreakpoint(breakpoint: TriggerBreakpoint): readonly string[];
  /** Get count of triggers in a given state */
  countByState(state: TriggerLifecycleState): number;
  /** Total registered trigger count */
  count(): number;
  /** Check if a trigger is registered */
  has(id: string): boolean;
  /** Check if any triggers are active */
  hasActive(): boolean;
}

// ── Debug Info ──────────────────────────────────────────────

/**
 * Debug information for the ScrollTrigger system.
 *
 * Only available when debug mode is enabled.
 * Exposes internal state for development inspection.
 *
 * From DESIGN_SYSTEM §10:
 * "A new developer must understand why every folder exists."
 *   → Debug info makes the system self-documenting.
 */
export interface ScrollTriggerDebugInfo {
  /** All registered trigger states */
  readonly triggers: readonly TriggerState[];
  /** Count of active triggers */
  readonly activeCount: number;
  /** Count of disabled triggers */
  readonly disabledCount: number;
  /** Count of destroyed triggers */
  readonly destroyedCount: number;
  /** Total refresh count since initialization */
  readonly refreshCount: number;
  /** All registered marker names (debug names) */
  readonly markerNames: readonly string[];
  /** All registered trigger group names */
  readonly groupNames: readonly string[];
  /** Whether reduced motion is currently active */
  readonly reducedMotionActive: boolean;
  /** Current breakpoint */
  readonly currentBreakpoint: string;
  /** Timestamp of last refresh */
  readonly lastRefreshAt: number;
}

// ── ScrollTrigger Context Value ─────────────────────────────

/**
 * Value provided by ScrollTriggerProvider (future React context).
 *
 * Contains the registry, debug info, and derived state
 * for component consumption.
 */
export interface ScrollTriggerContextValue {
  /** The trigger registry — read-only access */
  readonly registry: ScrollTriggerRegistry;
  /** Debug info (only when debug mode is enabled) */
  readonly debugInfo: ScrollTriggerDebugInfo | null;
  /** Whether debug mode is enabled */
  readonly isDebugMode: boolean;
  /** All registered trigger IDs */
  readonly triggerIds: readonly string[];
  /** All active trigger IDs */
  readonly activeTriggerIds: readonly string[];
  /** Total trigger count */
  readonly triggerCount: number;
  /** Whether any triggers are active */
  readonly hasActiveTriggers: boolean;
}

// ── Breakpoint Configuration ────────────────────────────────

/**
 * Per-breakpoint configuration overrides.
 *
 * Different breakpoints may have different default behaviors
 * for triggers — e.g., simplified on mobile, full on desktop.
 *
 * From DESIGN_SYSTEM §7:
 * "Mobile-first: base → md (768) → lg (1024) → xl (1440)"
 *
 * From DESIGN_SYSTEM §Performance:
 * "If animation drops below 30fps on mobile, it is simplified or removed."
 */
export interface BreakpointConfig {
  /** Whether triggers are enabled at this breakpoint */
  readonly enabled: boolean;
  /** Default start position override */
  readonly defaultStart?: string;
  /** Default scrub override */
  readonly defaultScrub?: boolean | number;
  /** Whether markers are shown (dev mode) */
  readonly markers: boolean;
  /** Maximum concurrent active triggers */
  readonly maxActiveTriggers: number;
  /** Default reduced motion behavior */
  readonly reducedMotionBehavior: 'skip' | 'instant' | 'simplify';
}

// ── Manager Configuration ───────────────────────────────────

/**
 * Global configuration for the ScrollTrigger manager.
 *
 * Controls system-wide behavior, breakpoints, and defaults.
 */
export interface ScrollTriggerManagerConfig {
  /** Default trigger group (used when not specified) */
  readonly defaultGroup: TriggerGroup;
  /** Default trigger priority */
  readonly defaultPriority: TriggerPriority;
  /** Default start position for all triggers */
  readonly defaultStart: string;
  /** Default scrub value */
  readonly defaultScrub: boolean | number;
  /** Default refresh interval in ms */
  readonly refreshInterval: number;
  /** Maximum concurrent active triggers */
  readonly maxActiveTriggers: number;
  /** Whether debug mode is enabled */
  readonly debugEnabled: boolean;
  /** Debug logging throttle in ms */
  readonly debugThrottle: number;
  /** Breakpoint configurations */
  readonly breakpoints: Record<TriggerBreakpoint, BreakpointConfig>;
}
