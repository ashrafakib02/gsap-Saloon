/**
 * ScrollTrigger Manager — Core Lifecycle and Registry
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "Scroll-Linked, Not Time-Linked. The visitor controls the speed."
 *
 * This module is the single orchestration point for all
 * GSAP ScrollTrigger instances. It provides:
 *
 * - Registration and destruction of triggers
 * - Lifecycle management (create → active → disabled → destroyed)
 * - Refresh batching to coalesce DOM-change recalculations
 * - Breakpoint-aware trigger creation
 * - Reduced-motion graceful downgrade
 * - Debug mode with internal state exposure
 * - Registry for querying trigger state
 *
 * Architecture:
 *   This module consumes the EXISTING GSAP infrastructure:
 *     @/shared/animation/gsap-registration (getGSAP, getScrollTrigger)
 *     @/shared/animation/reduced-motion (prefersReducedMotion)
 *     @/shared/tokens/timing (DEBOUNCE)
 *
 *   It does NOT duplicate:
 *     - GSAP initialization (handled by gsap-registration)
 *     - ScrollTrigger plugin registration (handled by gsap-config)
 *     - GSAP context creation (handled by hero interaction)
 *
 * From TECHNICAL_ARCHITECTURE:
 * "GSAP is loaded via dynamic import (code-split)"
 * "ScrollTrigger loaded only when scroll animations are needed"
 *
 * Phase 5.4: Infrastructure — no animation content.
 */

import {
  getScrollTrigger,
} from '@/shared/animation/gsap-registration';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';
import { DEBOUNCE } from '@/shared/tokens/timing';

import type {
  TriggerOptions,
  TriggerDefinition,
  TriggerState,
  TriggerGroup,
  TriggerPriority,
  TriggerBreakpoint,
  TriggerLifecycleState,
  ScrollTriggerRegistry,
  ScrollTriggerDebugInfo,
  ScrollTriggerManagerConfig,
  ManagedTrigger,
  ScrollTriggerInstance,
} from './scrolltrigger.types';

import { DEFAULT_MANAGER_CONFIG } from './scrolltrigger.constants';

// ── Module State ───────────────────────────────────────────

const definitions = new Map<string, TriggerDefinition>();
const states = new Map<string, TriggerState>();
const instances = new Map<string, ManagedTrigger>();

let initialized = false;
let config: ScrollTriggerManagerConfig = DEFAULT_MANAGER_CONFIG;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
let refreshCount = 0;
let lastRefreshAt = 0;
let currentBreakpoint: TriggerBreakpoint = 'all';
const destroyedIds: string[] = [];

// ── Initialization Guard ────────────────────────────────────

/**
 * Ensures the manager is initialized before operations.
 * Throws in development, silently initializes in production.
 */
function ensureInitialized(): void {
  if (!initialized) {
    if (import.meta.env.DEV) {
      console.warn(
        '[ScrollTrigger] Manager not initialized. ' +
          'Call initScrollTriggerManager() first.',
      );
    }
    initScrollTriggerManager();
  }
}

// ── Factory: Create ScrollTrigger Instance ──────────────────

/**
 * Creates a single GSAP ScrollTrigger instance from a definition.
 *
 * Uses the existing GSAP infrastructure — never imports gsap directly.
 *
 * @param def - The trigger definition
 * @returns A managed trigger with cleanup capability
 */
function createInstance(def: TriggerDefinition): ManagedTrigger {
  const ScrollTrigger = getScrollTrigger();

  const o = def.options;

  const stConfig: Record<string, unknown> = {
    trigger: o.trigger,
    start: o.start ?? config.defaultStart,
  };

  if (o.targets !== undefined) stConfig.animation = o.targets;
  if (o.end !== undefined) stConfig.end = o.end;
  if (o.scrub !== undefined) {
    stConfig.scrub = o.scrub;
  } else {
    stConfig.scrub = config.defaultScrub;
  }

  if (o.refreshPriority !== undefined) {
    stConfig.refreshPriority = o.refreshPriority;
  }

  /* Section ID stored on the DOM element for debugging */
  if (o.sectionId !== undefined) {
    stConfig.onToggle = (self: ScrollTriggerInstance & { trigger?: Element }) => {
      if (self.trigger && 'setAttribute' in self.trigger) {
        self.trigger.setAttribute(
          'data-scroll-section',
          o.sectionId as string,
        );
      }
    };
  }

  /* Callbacks — wrapped to check reduced-motion */
  if (o.onEnter !== undefined) {
    const userCallback = o.onEnter;
    stConfig.onEnter = () => {
      if (!prefersReducedMotion() || o.reducedMotionBehavior === 'instant') {
        userCallback();
      }
    };
  }

  if (o.onLeave !== undefined) {
    stConfig.onLeave = o.onLeave;
  }

  if (o.onEnterBack !== undefined) {
    stConfig.onEnterBack = o.onEnterBack;
  }

  if (o.onLeaveBack !== undefined) {
    stConfig.onLeaveBack = o.onLeaveBack;
  }

  if (o.onUpdate !== undefined) {
    const userCallback = o.onUpdate;
    stConfig.onUpdate = (self: ScrollTriggerInstance & { progress?: number }) => {
      userCallback(self.progress ?? 0);
    };
  }

  /* Debug markers — only in development when explicitly enabled */
  if (import.meta.env.DEV && o.markers) {
    stConfig.markers = true;
  }

  /* Use trigger ID for ScrollTrigger's internal ID */
  stConfig.id = o.id;

  // ScrollTrigger.create accepts the Record<string, unknown> shape of stConfig
  const st = ScrollTrigger.create(stConfig) as unknown as ScrollTriggerInstance;

  return {
    trigger: st,
    kill: () => {
      st.kill();
    },
  };
}

// ── Initialization ──────────────────────────────────────────

/**
 * Initializes the ScrollTrigger manager.
 *
 * Sets up breakpoint detection and initial state.
 * Safe to call multiple times — subsequent calls are no-ops.
 *
 * @param overrides - Optional configuration overrides
 */
export function initScrollTriggerManager(
  overrides?: Partial<ScrollTriggerManagerConfig>,
): void {
  if (initialized) return;

  if (overrides) {
    config = { ...config, ...overrides };
  }

  /* Detect initial breakpoint */
  currentBreakpoint = detectBreakpoint();

  initialized = true;
}

/**
 * Detects the current viewport breakpoint.
 *
 * @returns The current TriggerBreakpoint
 */
function detectBreakpoint(): TriggerBreakpoint {
  if (typeof window === 'undefined') return 'all';

  const width = window.innerWidth;

  if (width >= 1440) return 'wide';
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

// ── Registration ────────────────────────────────────────────

/**
 * Registers a new ScrollTrigger.
 *
 * If a trigger with the same ID already exists, it is killed
 * and replaced. The trigger is created immediately unless
 * breakpoint restrictions prevent it.
 *
 * @param options - Trigger configuration
 * @returns A managed trigger with cleanup capability, or null if breakpoint prevents creation
 *
 * @example
 * ```ts
 * const trigger = registerScrollTrigger({
 *   id: 'hero-reveal',
 *   group: 'section-reveal',
 *   trigger: '.hero-section',
 *   start: 'top top',
 *   priority: 'critical',
 *   onEnter: () => playHeroAnimation(),
 * });
 * ```
 */
export function registerScrollTrigger(
  options: TriggerOptions,
): ManagedTrigger | null {
  ensureInitialized();

  /* Kill existing trigger with same ID */
  if (definitions.has(options.id)) {
    killTrigger(options.id);
  }

  /* Check breakpoint — only create if breakpoint allows */
  if (!shouldCreateForBreakpoint(options.breakpoint)) {
    /* Register the definition for later creation */
    const def: TriggerDefinition = {
      options,
      reducedMotionActive: prefersReducedMotion(),
      createdAt: Date.now(),
    };
    definitions.set(options.id, def);
    states.set(options.id, {
      id: options.id,
      group: options.group ?? config.defaultGroup,
      state: 'registered',
      isActive: false,
      isPaused: false,
      lastStateChange: Date.now(),
    });
    return null;
  }

  /* Check reduced motion — skip if behavior is 'skip' */
  if (
    prefersReducedMotion() &&
    (options.reducedMotionBehavior ?? 'skip') === 'skip'
  ) {
    const def: TriggerDefinition = {
      options,
      reducedMotionActive: true,
      createdAt: Date.now(),
    };
    definitions.set(options.id, def);
    states.set(options.id, {
      id: options.id,
      group: options.group ?? config.defaultGroup,
      state: 'registered',
      isActive: false,
      isPaused: false,
      lastStateChange: Date.now(),
    });
    return null;
  }

  /* Check max active triggers */
  if (getActiveCount() >= config.maxActiveTriggers) {
    console.warn(
      `[ScrollTrigger] Max active triggers (${config.maxActiveTriggers}) reached. ` +
        `Trigger "${options.id}" not created.`,
    );
    return null;
  }

  /* Create the definition */
  const def: TriggerDefinition = {
    options,
    reducedMotionActive: prefersReducedMotion(),
    createdAt: Date.now(),
  };
  definitions.set(options.id, def);

  /* Create the ScrollTrigger instance */
  const managed = createInstance(def);
  instances.set(options.id, managed);

  /* Update state */
  states.set(options.id, {
    id: options.id,
    group: options.group ?? config.defaultGroup,
    state: 'active',
    isActive: true,
    isPaused: false,
    lastStateChange: Date.now(),
  });

  return managed;
}

/**
 * Checks if a trigger should be created for the given breakpoint.
 *
 * @param breakpoint - The trigger's target breakpoint (undefined = 'all')
 * @returns Whether the trigger should be created
 */
function shouldCreateForBreakpoint(
  breakpoint: TriggerBreakpoint | undefined,
): boolean {
  const target = breakpoint ?? 'all';
  if (target === 'all') return true;

  const bpConfig = config.breakpoints[target];
  if (!bpConfig?.enabled) return false;

  /* Check if current viewport matches the target breakpoint */
  return currentBreakpoint === target;
}

// ── Lifecycle ───────────────────────────────────────────────

/**
 * Kills a specific ScrollTrigger by ID.
 *
 * Removes the instance from the DOM and the registry.
 * The trigger definition is retained for potential re-registration.
 *
 * @param id - The trigger ID
 */
export function killTrigger(id: string): void {
  const managed = instances.get(id);
  if (managed) {
    managed.kill();
    instances.delete(id);
  }

  const state = states.get(id);
  if (state) {
    state.state = 'destroyed';
    state.isActive = false;
    state.lastStateChange = Date.now();
    destroyedIds.push(id);
  }
}

/**
 * Kills all registered ScrollTrigger instances.
 *
 * Used for:
 * - Page transitions
 * - Reduced-motion activation
 * - Component unmount cleanup
 * - Route changes
 *
 * After calling this, the manager is reset to an uninitialized
 * state. Call {@link initScrollTriggerManager} before re-registering.
 */
export function killAll(): void {
  /* Kill all active instances */
  for (const [id, managed] of instances) {
    managed.kill();
    const state = states.get(id);
    if (state) {
      state.state = 'destroyed';
      state.isActive = false;
      state.lastStateChange = Date.now();
      destroyedIds.push(id);
    }
  }
  instances.clear();

  /* Clear refresh timeout */
  if (refreshTimeout !== null) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }

  initialized = false;
}

/**
 * Disables a specific ScrollTrigger by ID.
 *
 * The trigger definition is retained and can be re-enabled.
 *
 * @param id - The trigger ID
 */
export function disableTrigger(id: string): void {
  const managed = instances.get(id);
  const state = states.get(id);
  const def = definitions.get(id);

  if (managed && state && state.state === 'active') {
    managed.kill();
    instances.delete(id);
    state.state = 'disabled';
    state.isActive = false;
    state.isPaused = false;
    state.lastStateChange = Date.now();
  } else if (state && state.state === 'registered' && def) {
    /* Not yet instantiated — just update state */
    state.state = 'disabled';
    state.isActive = false;
    state.lastStateChange = Date.now();
  }
}

/**
 * Re-enables a disabled ScrollTrigger.
 *
 * Recreates the ScrollTrigger instance from the stored definition.
 *
 * @param id - The trigger ID
 * @returns The re-enabled managed trigger, or null if not found or disabled
 */
export function enableTrigger(id: string): ManagedTrigger | null {
  const state = states.get(id);
  const def = definitions.get(id);

  if (!state || !def || state.state !== 'disabled') return null;

  /* Check reduced motion */
  if (
    prefersReducedMotion() &&
    (def.options.reducedMotionBehavior ?? 'skip') === 'skip'
  ) {
    return null;
  }

  const managed = createInstance(def);
  instances.set(id, managed);

  state.state = 'active';
  state.isActive = true;
  state.lastStateChange = Date.now();

  return managed;
}

/**
 * Pauses a specific ScrollTrigger by ID.
 *
 * The trigger remains registered but stops responding to scroll.
 *
 * @param id - The trigger ID
 */
export function pauseTrigger(id: string): void {
  const managed = instances.get(id);
  const state = states.get(id);

  if (managed && state && state.state === 'active' && !state.isPaused) {
    managed.trigger.disable();
    state.isPaused = true;
    state.lastStateChange = Date.now();
  }
}

/**
 * Resumes a paused ScrollTrigger.
 *
 * @param id - The trigger ID
 */
export function resumeTrigger(id: string): void {
  const managed = instances.get(id);
  const state = states.get(id);

  if (managed && state && state.state === 'active' && state.isPaused) {
    managed.trigger.enable();
    state.isPaused = false;
    state.lastStateChange = Date.now();
  }
}

// ── Refresh ─────────────────────────────────────────────────

/**
 * Refreshes all ScrollTrigger instances.
 *
 * Recalculates positions after DOM changes (images loading,
 * dynamic content, etc.). Debounced to prevent excessive
 * recalculations during rapid DOM mutations.
 *
 * @param immediate - Skip debounce and refresh immediately
 */
export function refresh(immediate: boolean = false): void {
  if (!initialized) return;

  if (immediate) {
    doRefresh();
    return;
  }

  if (refreshTimeout !== null) {
    clearTimeout(refreshTimeout);
  }

  refreshTimeout = setTimeout(() => {
    doRefresh();
    refreshTimeout = null;
  }, DEBOUNCE.resize);
}

/**
 * Executes the actual ScrollTrigger.refresh() call.
 */
function doRefresh(): void {
  try {
    const ScrollTrigger = getScrollTrigger();
    ScrollTrigger.refresh();
    refreshCount++;
    lastRefreshAt = Date.now();
  } catch {
    /* GSAP may not be loaded yet — silent fail */
  }
}

/**
 * Batched refresh — accumulates refresh requests and executes
 * them as a single refresh after a debounce period.
 *
 * @param priority - Optional priority filter — only refresh triggers of this priority
 */
export function refreshBatched(priority?: TriggerPriority): void {
  if (!initialized) return;

  if (priority) {
    /* Refresh only triggers matching the given priority */
    const triggerIds = getByPriority(priority);
    if (triggerIds.length === 0) return;
  }

  refresh();
}

/**
 * Gets the number of refreshes that have occurred.
 *
 * @returns Total refresh count
 */
export function getRefreshCount(): number {
  return refreshCount;
}

/**
 * Gets the timestamp of the last refresh.
 *
 * @returns Timestamp of last refresh, or 0 if never refreshed
 */
export function getLastRefreshAt(): number {
  return lastRefreshAt;
}

// ── Breakpoint Handling ─────────────────────────────────────

/**
 * Updates the current breakpoint and refreshes triggers.
 *
 * Should be called when the viewport width crosses a
 * breakpoint boundary. Typically called from a
 * matchMedia event listener.
 *
 * @param newBreakpoint - The new breakpoint
 */
export function updateBreakpoint(newBreakpoint: TriggerBreakpoint): void {
  const previous = currentBreakpoint;
  currentBreakpoint = newBreakpoint;

  if (previous !== newBreakpoint) {
    /* Refresh all triggers to recalculate positions */
    refresh(true);
  }
}

/**
 * Gets the current breakpoint.
 *
 * @returns The current TriggerBreakpoint
 */
export function getCurrentBreakpoint(): TriggerBreakpoint {
  return currentBreakpoint;
}

// ── Reduced Motion ──────────────────────────────────────────

/**
 * Handles reduced-motion preference changes.
 *
 * When reduced motion becomes active:
 * - Skipped triggers remain in 'registered' state
 * - Active triggers with 'skip' behavior are disabled
 * - Active triggers with 'instant' behavior are kept active
 *
 * When reduced motion becomes inactive:
 * - Previously skipped triggers can be lazily created
 *
 * Should be called when the prefers-reduced-motion
 * media query changes.
 *
 * @param isActive - Whether reduced motion is now active
 */
export function handleReducedMotionChange(isActive: boolean): void {
  if (isActive) {
    /* Disable triggers that should skip during reduced motion */
    for (const [id, state] of states) {
      const def = definitions.get(id);
      if (
        state.state === 'active' &&
        def &&
        (def.options.reducedMotionBehavior ?? 'skip') === 'skip'
      ) {
        disableTrigger(id);
      }
    }
  } else {
    /* Re-enable triggers that were disabled due to reduced motion */
    for (const [id, state] of states) {
      if (state.state === 'disabled') {
        enableTrigger(id);
      }
    }
  }
}

/**
 * Checks if reduced motion is currently active in the manager.
 *
 * @returns Whether reduced motion is affecting the system
 */
export function isReducedMotionActive(): boolean {
  return prefersReducedMotion();
}

// ── Registry Query ──────────────────────────────────────────

/**
 * Returns the complete trigger registry.
 *
 * @returns A ScrollTriggerRegistry with all query methods
 */
export function getRegistry(): ScrollTriggerRegistry {
  return {
    get(id: string): TriggerState | undefined {
      return states.get(id);
    },

    getAll(): readonly string[] {
      return Array.from(definitions.keys());
    },

    getActive(): readonly string[] {
      return Array.from(states.entries())
        .filter(([, s]) => s.state === 'active')
        .map(([id]) => id);
    },

    getDestroyed(): readonly string[] {
      return [...destroyedIds];
    },

    getByGroup(group: TriggerGroup): readonly string[] {
      return Array.from(states.entries())
        .filter(([, s]) => s.group === group)
        .map(([id]) => id);
    },

    getByPriority(priority: TriggerPriority): readonly string[] {
      return Array.from(definitions.entries())
        .filter(([, d]) => (d.options.priority ?? config.defaultPriority) === priority)
        .map(([id]) => id);
    },

    getByState(state: TriggerLifecycleState): readonly string[] {
      return Array.from(states.entries())
        .filter(([, s]) => s.state === state)
        .map(([id]) => id);
    },

    getByBreakpoint(breakpoint: TriggerBreakpoint): readonly string[] {
      return Array.from(definitions.entries())
        .filter(([, d]) => (d.options.breakpoint ?? 'all') === breakpoint)
        .map(([id]) => id);
    },

    countByState(state: TriggerLifecycleState): number {
      return Array.from(states.values()).filter((s) => s.state === state).length;
    },

    count(): number {
      return definitions.size;
    },

    has(id: string): boolean {
      return definitions.has(id);
    },

    hasActive(): boolean {
      return Array.from(states.values()).some((s) => s.state === 'active');
    },
  };
}

// ── Internal Helpers ────────────────────────────────────────

/**
 * Returns all registered trigger IDs.
 */
function getAllIds(): readonly string[] {
  return Array.from(definitions.keys());
}

/**
 * Returns active trigger IDs.
 */
function getActiveIds(): readonly string[] {
  return Array.from(states.entries())
    .filter(([, s]) => s.state === 'active')
    .map(([id]) => id);
}

/**
 * Returns trigger IDs filtered by priority.
 */
function getByPriority(priority: TriggerPriority): readonly string[] {
  return Array.from(definitions.entries())
    .filter(([, d]) => (d.options.priority ?? config.defaultPriority) === priority)
    .map(([id]) => id);
}

// ── Debug ───────────────────────────────────────────────────

/**
 * Enables or disables debug mode.
 *
 * When enabled, scroll markers are visible and internal
 * state is exposed via {@link getDebugInfo}.
 *
 * @param enabled - Whether to enable debug mode
 */
export function setDebugMode(enabled: boolean): void {
  config = { ...config, debugEnabled: enabled };
}

/**
 * Returns comprehensive debug information.
 *
 * Only meaningful when debug mode is enabled.
 *
 * @returns Complete debug snapshot
 */
export function getDebugInfo(): ScrollTriggerDebugInfo {
  return {
    triggers: Array.from(states.values()),
    activeCount: getActiveCount(),
    disabledCount: states.size -
      getActiveCount() -
      destroyedIds.length -
      (Array.from(states.values()).filter((s) => s.state === 'registered').length),
    destroyedCount: destroyedIds.length,
    refreshCount,
    markerNames: getAllIds(),
    groupNames: Array.from(
      new Set(Array.from(states.values()).map((s) => s.group)),
    ),
    reducedMotionActive: prefersReducedMotion(),
    currentBreakpoint,
    lastRefreshAt,
  };
}

/**
 * Logs debug information to the console (development only).
 *
 * Throttled to prevent excessive logging during rapid scroll.
 */
let lastDebugLog = 0;

export function logDebugInfo(): void {
  if (!config.debugEnabled) return;

  const now = Date.now();
  if (now - lastDebugLog < config.debugThrottle) return;
  lastDebugLog = now;

  const info = getDebugInfo();

  console.groupCollapsed(
    `[ScrollTrigger Debug] ${info.activeCount} active, ` +
      `${info.destroyedCount} destroyed, ` +
      `${info.refreshCount} refreshes`,
  );
  console.log('Triggers:', info.triggers);
  console.log('Groups:', info.groupNames);
  console.log('Breakpoint:', info.currentBreakpoint);
  console.log('Reduced Motion:', info.reducedMotionActive);
  console.log('Last Refresh:', new Date(info.lastRefreshAt).toISOString());
  console.groupEnd();
}

// ── Configuration ───────────────────────────────────────────

/**
 * Checks if the manager has been initialized.
 */
export function isInitialized(): boolean {
  return initialized;
}

/**
 * Returns the current manager configuration.
 */
export function getConfig(): ScrollTriggerManagerConfig {
  return config;
}

/**
 * Returns all registered trigger IDs.
 */
export function getAllTriggerIds(): readonly string[] {
  return getAllIds();
}

/**
 * Returns active trigger IDs.
 */
export function getActiveTriggerIds(): readonly string[] {
  return getActiveIds();
}

/**
 * Returns the total number of registered triggers.
 */
export function getTriggerCount(): number {
  return definitions.size;
}

/**
 * Returns the count of active triggers.
 */
export function getActiveCount(): number {
  return Array.from(states.values()).filter((s) => s.state === 'active').length;
}

/**
 * Checks if a specific trigger is active.
 */
export function isTriggerActive(id: string): boolean {
  const state = states.get(id);
  return state?.state === 'active';
}

/**
 * Marks a trigger as destroyed.
 */
export function markDestroyed(id: string): void {
  const state = states.get(id);
  if (state) {
    state.state = 'destroyed';
    state.isActive = false;
    state.lastStateChange = Date.now();
    destroyedIds.push(id);
  }
}
