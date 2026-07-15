/**
 * Scroll State Types — Centralized Runtime Scroll State
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Vertical scrolling is not a content delivery mechanism.
 *  It is a storytelling device."
 *
 * "The scroll is the conductor; the content is the orchestra."
 *
 * This module defines the complete type system for the application's
 * single source of truth for runtime scroll state. Every future system
 * consumes this state instead of computing its own.
 *
 * Architecture:
 *   ScrollState (immutable snapshot) → ScrollStateManager (mutable owner)
 *   → Selector-based subscriptions → React hooks subscribe
 *
 * Consumers:
 *   Hero, Scroll Storytelling, Section Transitions, GSAP, React Three Fiber,
 *   Camera, Lighting, Particles, Audio, Analytics, Accessibility, Booking, Navigation
 *
 * Phase 5.5: Centralized scroll state — infrastructure only, no animations.
 */

import type {
  SectionId,
  NarrativeStage,
} from './narrative.types';

// ── Scroll Direction ────────────────────────────────────────

/**
 * Scroll direction relative to the document.
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "When the visitor scrolls backward, previously-revealed
 *  content remains revealed."
 */
export const SCROLL_DIRECTIONS = [
  /** Scrolling down — forward narrative progression */
  'down',
  /** Scrolling up — backward, content stays revealed */
  'up',
  /** Not scrolling */
  'none',
] as const;

/** Type-safe union of scroll directions. */
export type ScrollDirection = (typeof SCROLL_DIRECTIONS)[number];

// ── Scroll Phase ────────────────────────────────────────────

/**
 * High-level phase of the scroll experience.
 *
 * Models the three-act dramatic structure at the scroll level.
 * Maps 1:1 to NarrativeStage but includes scroll-specific states.
 */
export const SCROLL_PHASES = [
  /** Pre-story: page top, before any narrative content */
  'pre-narrative',
  /** Act I: The Invitation — emotional hooks, world-building */
  'act-one',
  /** Act II: The Experience — services, artisans, social proof */
  'act-two',
  /** Act III: The Commitment — booking, gift, closing */
  'act-three',
  /** Post-story: page bottom, after all narrative content */
  'post-narrative',
] as const;

/** Type-safe union of scroll phases. */
export type ScrollPhase = (typeof SCROLL_PHASES)[number];

// ── Scroll State ────────────────────────────────────────────

/**
 * The complete runtime scroll state snapshot.
 *
 * This is the single source of truth for scroll-related state.
 * Every system reads from this instead of computing its own.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Avoid rerenders. Use immutable snapshots. Memoized selectors."
 *
 * All fields are readonly — the snapshot is immutable after creation.
 * Updated atomically on each animation frame via requestAnimationFrame.
 */
export interface ScrollState {
  // ── Position ──

  /** Raw scroll position (pixels from top) */
  readonly scrollY: number;
  /** Horizontal scroll position (pixels from left) */
  readonly scrollX: number;

  // ── Progress ──

  /** Overall page scroll progress (0 = top, 1 = bottom) */
  readonly pageProgress: number;
  /** Progress within the current section (0 = section entry, 1 = section exit) */
  readonly sectionProgress: number;
  /** Timeline progress (0 = start, 1 = end) — mirrors pageProgress */
  readonly timelineProgress: number;

  // ── Navigation ──

  /** Current section ID in scroll position */
  readonly currentSectionId: SectionId;
  /** Previous section ID (null if at first section) */
  readonly previousSectionId: SectionId | null;
  /** Next section ID (null if at last section) */
  readonly nextSectionId: SectionId | null;

  // ── Scroll Behavior ──

  /** Current scroll direction */
  readonly direction: ScrollDirection;
  /** Whether the page is currently scrolling */
  readonly isScrolling: boolean;
  /** Whether the page is idle (no scroll activity) */
  readonly isIdle: boolean;

  // ── Velocity ──

  /** Current scroll velocity (pixels/second) */
  readonly velocity: number;
  /** Smoothed velocity (averaged over recent frames) */
  readonly smoothedVelocity: number;

  // ── Narrative Context ──

  /** Current narrative stage (prologue, act-one, act-two, act-three, epilogue) */
  readonly currentStage: NarrativeStage;
  /** Current scroll phase */
  readonly currentPhase: ScrollPhase;
  /** Progress through the current act (0→1) */
  readonly currentActProgress: number;
  /** Overall narrative progress (0→1) */
  readonly narrativeProgress: number;

  // ── Timeline ──

  /** Timeline-normalized progress (0→1) */
  readonly timelineNormalizedProgress: number;

  // ── Viewport ──

  /** Current viewport width (pixels) */
  readonly viewportWidth: number;
  /** Current viewport height (pixels) */
  readonly viewportHeight: number;

  // ── Input Device ──

  /** Whether the current device has touch capability */
  readonly isTouchDevice: boolean;
  /** Current primary pointer type */
  readonly pointerType: 'mouse' | 'touch' | 'pen' | 'none';

  // ── Accessibility ──

  /** Whether prefers-reduced-motion is active */
  readonly isReducedMotion: boolean;

  // ── Transition Context ──

  /** Whether a section transition is currently in progress */
  readonly isTransitioning: boolean;

  // ── Trigger State ──

  /** Number of active ScrollTrigger instances */
  readonly activeTriggerCount: number;

  // ── Breakpoint ──

  /** Current viewport breakpoint */
  readonly breakpoint: ScrollBreakpoint;

  // ── Debug ──

  /** Whether debug mode is active */
  readonly debugMode: boolean;

  // ── Metadata ──

  /** Timestamp of last state update (performance.now) */
  readonly timestamp: number;
  /** Number of state updates since initialization */
  readonly frameCount: number;
}

// ── Scroll Breakpoint ───────────────────────────────────────

/**
 * Viewport breakpoint for scroll state.
 *
 * Maps to existing breakpoint system (shared/tokens/breakpoints)
 * but uses scroll-specific naming.
 */
export const SCROLL_BREAKPOINTS = [
  /** < 768px — mobile viewport */
  'mobile',
  /** 768–1023px — tablet viewport */
  'tablet',
  /** 1024–1443px — desktop viewport */
  'desktop',
  /** ≥ 1440px — wide-screen viewport */
  'wide',
] as const;

/** Type-safe union of scroll breakpoints. */
export type ScrollBreakpoint = (typeof SCROLL_BREAKPOINTS)[number];

// ── Current Section Info ────────────────────────────────────

/**
 * Enriched information about the current section.
 *
 * Combines the narrative registry section data with
 * scroll-derived navigation context.
 */
export interface CurrentSectionInfo {
  /** Current section data from the narrative registry */
  readonly current: import('./narrative.types').NarrativeSection;
  /** Previous section data (null if at first section) */
  readonly previous: import('./narrative.types').NarrativeSection | null;
  /** Next section data (null if at last section) */
  readonly next: import('./narrative.types').NarrativeSection | null;
  /** The current narrative stage */
  readonly stage: NarrativeStage;
  /** The current scroll phase */
  readonly phase: ScrollPhase;
  /** Progress through the current act (0→1) */
  readonly actProgress: number;
  /** Overall narrative progress (0→1) */
  readonly narrativeProgress: number;
  /** Whether this is the first section */
  readonly isFirst: boolean;
  /** Whether this is the last section */
  readonly isLast: boolean;
  /** Index of the current section (0-based) */
  readonly index: number;
}

// ── Scroll Progress Info ────────────────────────────────────

/**
 * Complete scroll progress breakdown.
 *
 * Provides multiple progress views for different
 * consumption contexts.
 */
export interface ScrollProgressInfo {
  /** Overall page progress (0→1) */
  readonly pageProgress: number;
  /** Progress within the current section (0→1) */
  readonly sectionProgress: number;
  /** Timeline progress (0→1) */
  readonly timelineProgress: number;
  /** Timeline-normalized progress (0→1) */
  readonly normalizedProgress: number;
  /** Raw scroll Y position (pixels) */
  readonly scrollY: number;
}

// ── Scroll Direction Info ───────────────────────────────────

/**
 * Scroll direction and velocity information.
 */
export interface ScrollDirectionInfo {
  /** Current scroll direction */
  readonly direction: ScrollDirection;
  /** Whether the page is currently scrolling */
  readonly isScrolling: boolean;
  /** Whether scrolling forward (down) */
  readonly isForward: boolean;
  /** Whether scrolling backward (up) */
  readonly isBackward: boolean;
}

// ── Scroll Velocity Info ────────────────────────────────────

/**
 * Scroll velocity and speed information.
 */
export interface ScrollVelocityInfo {
  /** Current scroll velocity (pixels/second) */
  readonly velocity: number;
  /** Smoothed velocity (averaged over recent frames) */
  readonly smoothedVelocity: number;
  /** Absolute velocity value */
  readonly speed: number;
  /** Whether velocity exceeds fast-scroll threshold */
  readonly isFastScrolling: boolean;
}

// ── Scroll Breakpoint Info ──────────────────────────────────

/**
 * Viewport breakpoint and dimension information.
 */
export interface ScrollBreakpointInfo {
  /** Current breakpoint */
  readonly breakpoint: ScrollBreakpoint;
  /** Viewport width */
  readonly viewportWidth: number;
  /** Viewport height */
  readonly viewportHeight: number;
  /** Whether viewport is at least desktop width */
  readonly isDesktop: boolean;
  /** Whether viewport is tablet width */
  readonly isTablet: boolean;
  /** Whether viewport is mobile width */
  readonly isMobile: boolean;
  /** Whether viewport is wide width */
  readonly isWide: boolean;
  /** Whether the device is touch-capable */
  readonly isTouchDevice: boolean;
  /** Current primary pointer type */
  readonly pointerType: 'mouse' | 'touch' | 'pen' | 'none';
  /** Whether prefers-reduced-motion is active */
  readonly isReducedMotion: boolean;
}

// ── Scroll Phase Info ───────────────────────────────────────

/**
 * Complete narrative context information.
 */
export interface ScrollPhaseInfo {
  /** Current section data */
  readonly section: import('./narrative.types').NarrativeSection;
  /** Current narrative stage */
  readonly stage: NarrativeStage;
  /** Current scroll phase */
  readonly phase: ScrollPhase;
  /** Current section ID */
  readonly sectionId: SectionId;
  /** Previous section ID */
  readonly previousSectionId: SectionId | null;
  /** Next section ID */
  readonly nextSectionId: SectionId | null;
  /** Progress through the current act (0→1) */
  readonly actProgress: number;
  /** Overall narrative progress (0→1) */
  readonly narrativeProgress: number;
  /** Timeline-normalized progress (0→1) */
  readonly timelineNormalizedProgress: number;
  /** Whether a transition is in progress */
  readonly isTransitioning: boolean;
  /** Section progress (0→1) */
  readonly sectionProgress: number;
  /** Whether this is the first section */
  readonly isFirst: boolean;
  /** Whether this is the last section */
  readonly isLast: boolean;
}

// ── Selector and Subscription Types ─────────────────────────

/**
 * Selector function for subscribing to a specific slice of scroll state.
 *
 * @typeParam T - The selected state type
 * @param state - The current scroll state snapshot
 * @returns The selected slice of state
 */
export type ScrollStateSelector<T> = (state: ScrollState) => T;

/**
 * Equality function for comparing selected state values.
 * Returns true if the values are considered equal (no re-render needed).
 */
export type ScrollStateEquality<T> = (prev: T, next: T) => boolean;

/**
 * Callback for state change notifications.
 */
export type ScrollStateCallback = () => void;

/**
 * Unsubscribe function returned by subscribe.
 */
export type ScrollStateUnsubscribe = () => void;

// ── Scroll State Manager Interface ──────────────────────────

/**
 * The scroll state manager interface.
 *
 * Singleton that owns mutable runtime state, notifies subscribers,
 * batches updates, and exposes readonly snapshots.
 *
 * No React inside the manager — React only subscribes.
 */
export interface ScrollStateManager {
  /** Get the current state snapshot (readonly, frozen) */
  readonly getSnapshot: () => ScrollState;
  /** Subscribe to all state changes */
  readonly subscribe: (callback: ScrollStateCallback) => ScrollStateUnsubscribe;
  /** Subscribe to a specific slice of state with selector */
  readonly subscribeSelector: <T>(
    selector: ScrollStateSelector<T>,
    callback: ScrollStateCallback,
    equalityFn?: ScrollStateEquality<T>,
  ) => ScrollStateUnsubscribe;
  /** Whether the manager has been initialized */
  readonly isInitialized: () => boolean;
  /** Initialize the manager — sets up listeners and initial state */
  readonly init: () => void;
  /** Destroy the manager — cleans up all listeners and resets state */
  readonly destroy: () => void;
  /** Enable or disable debug mode */
  readonly setDebugMode: (enabled: boolean) => void;
  /** Get snapshot of section navigation info */
  readonly getSectionInfo: () => CurrentSectionInfo;
}

// ── Scroll State Config ─────────────────────────────────────

/**
 * Configuration for the scroll state manager.
 */
export interface ScrollStateConfig {
  /** Time in ms before page is considered idle */
  readonly idleTimeout: number;
  /** Pixel threshold before direction change registers */
  readonly directionThreshold: number;
  /** Debounce interval for resize events (ms) */
  readonly resizeDebounce: number;
  /** Whether debug mode is enabled by default */
  readonly debugDefault: boolean;
  /** Number of velocity samples to average */
  readonly velocitySampleCount: number;
}
