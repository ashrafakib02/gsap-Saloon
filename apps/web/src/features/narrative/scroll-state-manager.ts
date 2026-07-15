/**
 * Scroll State Manager — Single Source of Truth for Runtime Scroll State
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is the conductor; the content is the orchestra."
 *
 * This module is the single owner of all runtime scroll state.
 * Every system consumes this state instead of computing its own.
 *
 * Responsibilities:
 *   - Own mutable runtime scroll state
 *   - Notify subscribers on state changes
 *   - Batch updates via requestAnimationFrame
 *   - Expose immutable snapshots via getSnapshot()
 *   - Compute derived values (section, progress, phase)
 *   - O(1) lookups via Map-indexed registries
 *   - Cleanup support for page transitions
 *
 * Architecture:
 *   - Module-level mutable state — no React dependency
 *   - requestAnimationFrame batching — one update per frame
 *   - Selector-based subscriptions — components re-render only on relevant changes
 *   - Integrates with existing systems:
 *       NARRATIVE_REGISTRY, TRANSITION_REGISTRY, TIMELINE_REGISTRY,
 *       ScrollTrigger Manager, prefersReducedMotion, BREAKPOINTS
 *
 * From DESIGN_SYSTEM §Performance:
 *   "Avoid rerenders. Use immutable snapshots. Memoized selectors."
 *
 * Phase 5.5: Centralized scroll state — infrastructure only.
 */

import { NARRATIVE_REGISTRY } from './narrative.config';
import { TRANSITION_REGISTRY } from './narrative-transitions.config';
import { getActiveCount, isInitialized as isTriggerManagerInitialized, initScrollTriggerManager } from './scrolltrigger-manager';

import { prefersReducedMotion } from '@/shared/animation/reduced-motion';
import { BREAKPOINTS } from '@/shared/tokens/breakpoints';

import type {
  ScrollState,
  ScrollStateManager,
  ScrollStateCallback,
  ScrollStateUnsubscribe,
  ScrollStateSelector,
  ScrollStateEquality,
  ScrollStateConfig,
  ScrollBreakpoint,
  ScrollPhase,
  CurrentSectionInfo,
} from './scroll-state.types';

import type {
  SectionId,
  NarrativeStage,
} from './narrative.types';

import type { SectionCategory } from './narrative.types';

import {
  DEFAULT_SCROLL_STATE,
  DEFAULT_SCROLL_STATE_CONFIG,
  DEFAULT_SECTION_ID,
} from './scroll-state.constants';

// ── Module State ───────────────────────────────────────────

let snapshot: ScrollState = DEFAULT_SCROLL_STATE;
const config: ScrollStateConfig = DEFAULT_SCROLL_STATE_CONFIG;
let initialized = false;
let destroyed = false;

/** Subscriber callbacks — notify on every state change */
const subscribers = new Set<ScrollStateCallback>();

/** Selector subscriptions — notify only when selected value changes */
interface SelectorEntry {
  readonly selector: ScrollStateSelector<unknown>;
  readonly callback: ScrollStateCallback;
  readonly equalityFn: ScrollStateEquality<unknown>;
  lastValue: unknown;
}

const selectorSubscribers = new Set<SelectorEntry>();

/** Active event listener references for cleanup */
const cleanups: Array<() => void> = [];

/** requestAnimationFrame ID for update batching */
let rafId: number | null = null;

/** Whether a state update is pending */
let updatePending = false;

/** Idle detection timeout */
let idleTimeout: ReturnType<typeof setTimeout> | null = null;

/** Resize debounce timeout */
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

/** Scroll tracking state */
let lastScrollY = 0;
let lastScrollTimestamp = 0;

/** Velocity tracking */
let velocitySamples: number[] = [];

/** Frame counter */
let frameCount = 0;

/** Debug mode */
let debugMode = import.meta.env.DEV;

// ── Section Lookup ─────────────────────────────────────────

/** O(1) section lookup by ID */
const sectionById = new Map<SectionId, { section: import('./narrative.types').NarrativeSection; index: number }>();

{
  const sections = NARRATIVE_REGISTRY.getAll();
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    sectionById.set(section.id, { section, index: i });
  }
}

// ── Breakpoint Detection ───────────────────────────────────

/**
 * Detects the current viewport breakpoint.
 *
 * Maps pixel widths to the ScrollBreakpoint union,
 * consistent with BREAKPOINTS from shared/tokens/breakpoints.
 */
function detectBreakpoint(): ScrollBreakpoint {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width >= BREAKPOINTS.wide) return 'wide';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Detects touch capability of the current device.
 */
function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

/**
 * Detects the primary pointer type from a PointerEvent.
 * Falls back to 'none' in SSR or when unavailable.
 */
function detectPointerType(event?: PointerEvent): 'mouse' | 'touch' | 'pen' | 'none' {
  if (!event) {
    if (typeof navigator !== 'undefined') {
      return navigator.maxTouchPoints > 0 ? 'touch' : 'none';
    }
    return 'none';
  }
  return event.pointerType as 'mouse' | 'touch' | 'pen' | 'none';
}

// ── Section Resolution ─────────────────────────────────────

/**
 * Finds the section ID that most closely corresponds to the
 * current scroll position using the narrative registry's ordered sections.
 *
 * Uses the section top as the reference point — the last section
 * whose top has been scrolled past is the current section.
 */
function findCurrentSectionId(scrollY: number): SectionId {
  const sections = NARRATIVE_REGISTRY.getEnabled();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const viewCenter = scrollY + vh * 0.5;

  let result: SectionId = DEFAULT_SECTION_ID;

  for (const section of sections) {
    /* Use the section DOM element position if available */
    const el = typeof document !== 'undefined'
      ? document.getElementById(`section-${section.id}`)
      : null;

    if (el) {
      const rect = el.getBoundingClientRect();
      const absoluteTop = scrollY + rect.top;

      if (viewCenter >= absoluteTop) {
        result = section.id;
      }
    } else {
      /* Fallback: use order-based estimation with viewport-relative spacing.
       * Sections are evenly distributed across the scroll height.
       * This is a reasonable approximation when DOM elements are not available. */
      const estimatedFraction = section.order / Math.max(sections.length - 1, 1);
      const totalScrollHeight = typeof document !== 'undefined'
        ? document.documentElement.scrollHeight
        : 0;
      const estimatedTop = estimatedFraction * (totalScrollHeight - vh);

      if (scrollY >= estimatedTop) {
        result = section.id;
      }
    }
  }

  return result;
}

/**
 * Gets the narrative stage for a section ID.
 */
function getStageForSection(sectionId: SectionId): NarrativeStage {
  const section = NARRATIVE_REGISTRY.get(sectionId);
  return section?.stage ?? 'prologue';
}

/**
 * Maps a section category to its scroll phase.
 */
function categoryToPhase(category: SectionCategory): ScrollPhase {
  switch (category) {
    case 'structural':
      return 'pre-narrative';
    case 'act-one':
      return 'act-one';
    case 'act-two':
      return 'act-two';
    case 'act-three':
      return 'act-three';
    case 'transitional':
      return 'act-two';
    default:
      return 'pre-narrative';
  }
}

/**
 * Computes progress through the current act (0→1).
 */
function computeActProgress(
  currentSectionId: SectionId,
  sectionProgress: number,
): number {
  const sections = NARRATIVE_REGISTRY.getEnabled();
  const currentIndex = sections.findIndex((s) => s.id === currentSectionId);
  if (currentIndex < 0) return 0;

  /* Find act boundaries */
  const currentStage = getStageForSection(currentSectionId);
  let firstInSection = currentIndex;
  let lastInSection = currentIndex;

  for (let i = currentIndex - 1; i >= 0; i--) {
    if (getStageForSection(sections[i].id) === currentStage) {
      firstInSection = i;
    } else {
      break;
    }
  }

  for (let i = currentIndex + 1; i < sections.length; i++) {
    if (getStageForSection(sections[i].id) === currentStage) {
      lastInSection = i;
    } else {
      break;
    }
  }

  const sectionsInAct = lastInSection - firstInSection + 1;
  if (sectionsInAct <= 1) return sectionProgress;

  const positionInSectionAct = currentIndex - firstInSection;
  return (positionInSectionAct + sectionProgress) / sectionsInAct;
}

// ── Velocity Computation ───────────────────────────────────

/**
 * Records a velocity sample and computes the smoothed velocity.
 */
function computeSmoothedVelocity(instantaneousVelocity: number): number {
  velocitySamples.push(instantaneousVelocity);

  if (velocitySamples.length > config.velocitySampleCount) {
    velocitySamples = velocitySamples.slice(-config.velocitySampleCount);
  }

  if (velocitySamples.length === 0) return 0;

  let sum = 0;
  for (let i = 0; i < velocitySamples.length; i++) {
    sum += velocitySamples[i];
  }
  return sum / velocitySamples.length;
}

// ── Snapshot Builder ───────────────────────────────────────

/**
 * Builds a complete ScrollState snapshot from the current state.
 *
 * This function computes all derived values and returns
 * an immutable snapshot.
 */
function buildSnapshot(): ScrollState {
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  const scrollHeight = typeof document !== 'undefined'
    ? document.documentElement.scrollHeight
    : 0;
  const maxScroll = Math.max(scrollHeight - viewportHeight, 1);

  const pageProgress = Math.min(scrollY / maxScroll, 1);

  const currentSectionId = findCurrentSectionId(scrollY);
  const section = NARRATIVE_REGISTRY.get(currentSectionId);
  const sectionEntry = sectionById.get(currentSectionId);

  const sectionIndex = sectionEntry?.index ?? 0;
  const previousSectionId = sectionIndex > 0
    ? NARRATIVE_REGISTRY.getEnabled()[sectionIndex - 1]?.id ?? null
    : null;
  const nextSectionId = sectionIndex < NARRATIVE_REGISTRY.getEnabled().length - 1
    ? NARRATIVE_REGISTRY.getEnabled()[sectionIndex + 1]?.id ?? null
    : null;

  const stage = getStageForSection(currentSectionId);
  const phase = section ? categoryToPhase(section.category) : 'pre-narrative';

  /* Compute section progress */
  let sectionProgress = 0;
  if (typeof document !== 'undefined') {
    const el = document.getElementById(`section-${currentSectionId}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;
      const sectionHeight = rect.height;
      if (sectionHeight > 0) {
        sectionProgress = Math.max(0, Math.min(1,
          (scrollY - sectionTop + viewportHeight) / (sectionHeight + viewportHeight),
        ));
      }
    }
  }

  const actProgress = computeActProgress(currentSectionId, sectionProgress);
  const narrativeProgress = pageProgress;
  const timelineNormalizedProgress = pageProgress;

  /* Check transition state */
  const transitionRegistry = TRANSITION_REGISTRY;
  let isTransitioning = false;
  if (previousSectionId) {
    const transition = transitionRegistry.getBetween(previousSectionId, currentSectionId);
    if (transition) {
      isTransitioning = sectionProgress < 0.3 || sectionProgress > 0.7;
    }
  }

  /* Trigger count */
  const activeTriggerCount = isTriggerManagerInitialized()
    ? getActiveCount()
    : 0;

  const timestamp = typeof performance !== 'undefined' ? performance.now() : 0;

  return Object.freeze({
    /* Position */
    scrollY,
    scrollX,

    /* Progress */
    pageProgress,
    sectionProgress,
    timelineProgress: pageProgress,

    /* Navigation */
    currentSectionId,
    previousSectionId,
    nextSectionId,

    /* Behavior */
    direction: snapshot.direction,
    isScrolling: snapshot.isScrolling,
    isIdle: snapshot.isIdle,

    /* Velocity */
    velocity: snapshot.velocity,
    smoothedVelocity: snapshot.smoothedVelocity,

    /* Narrative */
    currentStage: stage,
    currentPhase: phase,
    currentActProgress: actProgress,
    narrativeProgress,

    /* Timeline */
    timelineNormalizedProgress,

    /* Viewport */
    viewportWidth,
    viewportHeight,

    /* Input */
    isTouchDevice: detectTouchDevice(),
    pointerType: snapshot.pointerType,

    /* Accessibility */
    isReducedMotion: prefersReducedMotion(),

    /* Transition */
    isTransitioning,

    /* Triggers */
    activeTriggerCount,

    /* Breakpoint */
    breakpoint: detectBreakpoint(),

    /* Debug */
    debugMode,

    /* Metadata */
    timestamp,
    frameCount,
  });
}

// ── State Update and Notification ──────────────────────────

/**
 * Schedules a state update on the next animation frame.
 *
 * Batches multiple state changes into a single frame update.
 * Uses requestAnimationFrame for smooth, jank-free updates.
 */
function scheduleUpdate(): void {
  if (updatePending) return;
  updatePending = true;

  rafId = requestAnimationFrame(() => {
    updatePending = false;
    frameCount++;
    snapshot = buildSnapshot();
    notifySubscribers();
  });
}

/**
 * Notifies all subscribers of a state change.
 *
 * For selector subscribers, only notifies when the selected
 * value has changed (using the equality function).
 */
function notifySubscribers(): void {
  /* Notify all-state subscribers */
  for (const subscriber of subscribers) {
    subscriber();
  }

  /* Notify selector subscribers when selected value changes */
  for (const entry of selectorSubscribers) {
    const newValue = entry.selector(snapshot);
    if (!entry.equalityFn(entry.lastValue, newValue)) {
      entry.lastValue = newValue;
      entry.callback();
    }
  }
}

// ── Event Handlers ─────────────────────────────────────────

/**
 * Handles scroll events.
 *
 * Updates direction tracking and schedules a state update.
 * Debounces idle detection.
 */
function handleScroll(): void {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const currentScrollY = window.scrollY;

  /* Update direction */
  const delta = currentScrollY - lastScrollY;
  const absDelta = Math.abs(delta);

  if (absDelta > config.directionThreshold) {
    const newDirection = delta > 0 ? 'down' as const : 'up' as const;
    if (newDirection !== snapshot.direction) {
      snapshot = { ...snapshot, direction: newDirection };
    }
  }

  /* Compute velocity */
  const timeDelta = (now - lastScrollTimestamp) / 1000;
  const instantaneousVelocity = timeDelta > 0 ? absDelta / timeDelta : 0;
  const smoothedVelocity = computeSmoothedVelocity(instantaneousVelocity);

  lastScrollY = currentScrollY;
  lastScrollTimestamp = now;
  snapshot = {
    ...snapshot,
    velocity: instantaneousVelocity,
    smoothedVelocity,
    isScrolling: true,
    isIdle: false,
  };

  /* Reset idle timeout */
  resetIdleTimeout();

  /* Schedule state update */
  scheduleUpdate();
}

/**
 * Handles window resize events.
 *
 * Debounced to prevent excessive updates during resize dragging.
 */
function handleResize(): void {
  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(() => {
    resizeTimeout = null;
    scheduleUpdate();
  }, config.resizeDebounce);
}

/**
 * Handles orientation change events.
 */
function handleOrientationChange(): void {
  /* Delay to allow viewport to settle after orientation change */
  setTimeout(() => {
    scheduleUpdate();
  }, 100);
}

/**
 * Handles visibility change events.
 *
 * Pauses scroll tracking when the tab is hidden and
 * resumes when it becomes visible again.
 */
function handleVisibilityChange(): void {
  if (document.hidden) {
    /* Pause scroll tracking */
    snapshot = { ...snapshot, isScrolling: false, isIdle: true };
    if (idleTimeout !== null) {
      clearTimeout(idleTimeout);
      idleTimeout = null;
    }
  } else {
    /* Resume — rebuild state from current position */
    scheduleUpdate();
  }
}

/**
 * Handles pointer type changes.
 */
function handlePointerChange(event: PointerEvent): void {
  const newType = detectPointerType(event);
  if (newType !== snapshot.pointerType) {
    snapshot = { ...snapshot, pointerType: newType };
    scheduleUpdate();
  }
}

// ── Idle Detection ─────────────────────────────────────────

/**
 * Resets the idle detection timeout.
 */
function resetIdleTimeout(): void {
  if (idleTimeout !== null) {
    clearTimeout(idleTimeout);
  }

  idleTimeout = setTimeout(() => {
    idleTimeout = null;
    snapshot = {
      ...snapshot,
      isScrolling: false,
      isIdle: true,
      velocity: 0,
      smoothedVelocity: 0,
    };
    scheduleUpdate();
  }, config.idleTimeout);
}

// ── Initialization ─────────────────────────────────────────

/**
 * Initializes the scroll state manager.
 *
 * Sets up event listeners, builds initial state, and starts
 * the update cycle. Safe to call multiple times — subsequent
 * calls are no-ops.
 *
 * This must be called before any component reads scroll state.
 * Typically called from the app root or a provider component.
 */
function init(): void {
  if (initialized || destroyed) return;

  if (typeof window === 'undefined') return;

  /* Ensure the ScrollTrigger manager is initialized */
  if (!isTriggerManagerInitialized()) {
    initScrollTriggerManager();
  }

  /* Detect initial state */
  lastScrollY = window.scrollY;
  lastScrollTimestamp = typeof performance !== 'undefined' ? performance.now() : Date.now();
  debugMode = import.meta.env.DEV;

  /* Attach scroll listener — passive for performance */
  const scrollHandler = handleScroll;
  window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });
  cleanups.push(() => window.removeEventListener('scroll', scrollHandler, { capture: true }));

  /* Attach resize listener */
  const resizeHandler = handleResize;
  window.addEventListener('resize', resizeHandler, { passive: true });
  cleanups.push(() => window.removeEventListener('resize', resizeHandler));

  /* Attach orientation change listener */
  const orientationHandler = handleOrientationChange;
  window.addEventListener('orientationchange', orientationHandler);
  cleanups.push(() => window.removeEventListener('orientationchange', orientationHandler));

  /* Attach visibility change listener */
  const visibilityHandler = handleVisibilityChange;
  document.addEventListener('visibilitychange', visibilityHandler);
  cleanups.push(() => document.removeEventListener('visibilitychange', visibilityHandler));

  /* Attach pointer move listener for pointer type detection */
  const pointerHandler = handlePointerChange;
  window.addEventListener('pointermove', pointerHandler, { passive: true });
  cleanups.push(() => window.removeEventListener('pointermove', pointerHandler));

  /* Build initial snapshot */
  snapshot = buildSnapshot();
  initialized = true;

  /* Schedule first update to capture initial scroll position */
  scheduleUpdate();
}

// ── Cleanup ────────────────────────────────────────────────

/**
 * Destroys the scroll state manager.
 *
 * Removes all event listeners, clears timeouts, cancels
 * pending animation frames, and resets all state.
 *
 * Used for page transitions and full app teardown.
 */
function destroy(): void {
  if (!initialized) return;

  /* Cancel pending RAF */
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* Clear idle timeout */
  if (idleTimeout !== null) {
    clearTimeout(idleTimeout);
    idleTimeout = null;
  }

  /* Clear resize timeout */
  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout);
    resizeTimeout = null;
  }

  /* Remove all event listeners */
  for (const cleanup of cleanups) {
    cleanup();
  }
  cleanups.length = 0;

  /* Clear subscribers */
  subscribers.clear();
  selectorSubscribers.clear();

  /* Clear velocity tracking */
  velocitySamples = [];

  /* Reset state */
  snapshot = DEFAULT_SCROLL_STATE;
  initialized = false;
  destroyed = false;
  frameCount = 0;
  updatePending = false;
}

// ── Public API ─────────────────────────────────────────────

/**
 * Returns the current state snapshot.
 *
 * The snapshot is a frozen (immutable) object that represents
 * the scroll state at the moment of the call. It does not update
 * automatically — subscribe to changes for real-time tracking.
 *
 * @returns Frozen scroll state snapshot
 */
function getSnapshot(): ScrollState {
  return snapshot;
}

/**
 * Subscribes to all state changes.
 *
 * The callback fires on every animation frame where state changes.
 * Use {@link subscribeSelector} for more targeted subscriptions.
 *
 * @param callback - Function to call on state changes
 * @returns Unsubscribe function
 */
function subscribe(callback: ScrollStateCallback): ScrollStateUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Subscribes to a specific slice of state.
 *
 * The callback only fires when the selected value changes
 * (determined by the equality function). This is the recommended
 * way for React hooks to consume scroll state — it minimizes
 * unnecessary re-renders.
 *
 * @param selector - Function to extract the relevant state slice
 * @param callback - Function to call when the selected value changes
 * @param equalityFn - Optional equality comparison (default: Object.is)
 * @returns Unsubscribe function
 */
function subscribeSelector<T>(
  selector: ScrollStateSelector<T>,
  callback: ScrollStateCallback,
  equalityFn: ScrollStateEquality<T> = Object.is as ScrollStateEquality<T>,
): ScrollStateUnsubscribe {
  const entry: SelectorEntry = {
    selector,
    callback,
    equalityFn: equalityFn as ScrollStateEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

/**
 * Checks if the manager is initialized.
 */
function isMgrInitialized(): boolean {
  return initialized;
}

/**
 * Enables or disables debug mode.
 *
 * When enabled, additional information is logged to the console
 * and the debugMode flag is set on the snapshot.
 */
function setDebugMode(enabled: boolean): void {
  debugMode = enabled;
  snapshot = { ...snapshot, debugMode: enabled };
  notifySubscribers();
}

/**
 * Returns enriched information about the current section.
 *
 * Combines the narrative registry section data with
 * scroll-derived navigation context.
 *
 * @returns CurrentSectionInfo with section data and navigation context
 */
function getSectionInfo(): CurrentSectionInfo {
  const snap = snapshot;
  const sections = NARRATIVE_REGISTRY.getEnabled();
  const currentIndex = sections.findIndex((s) => s.id === snap.currentSectionId);
  const current = sections[currentIndex];
  const previous = snap.previousSectionId
    ? NARRATIVE_REGISTRY.get(snap.previousSectionId) ?? null
    : null;
  const next = snap.nextSectionId
    ? NARRATIVE_REGISTRY.get(snap.nextSectionId) ?? null
    : null;

  return {
    current,
    previous,
    next,
    stage: snap.currentStage,
    phase: snap.currentPhase,
    actProgress: snap.currentActProgress,
    narrativeProgress: snap.narrativeProgress,
    isFirst: currentIndex === 0,
    isLast: currentIndex === sections.length - 1,
    index: currentIndex,
  };
}

// ── Singleton Export ───────────────────────────────────────

/**
 * The singleton scroll state manager.
 *
 * This is the single owner of all runtime scroll state.
 * All hooks and components consume this instance.
 */
export const scrollStateManager: ScrollStateManager = Object.freeze({
  getSnapshot,
  subscribe,
  subscribeSelector,
  isInitialized: isMgrInitialized,
  init,
  destroy,
  setDebugMode,
  getSectionInfo,
});
