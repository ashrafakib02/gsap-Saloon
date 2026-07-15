/**
 * Progressive Reveal Manager — Single Source of Truth for Reveal State
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "When the visitor scrolls backward, previously-revealed
 *  content remains revealed."
 *
 * This module is the single owner of all progressive-reveal state.
 * It determines WHAT should become visible and WHEN, storing metadata
 * and orchestrating reveal STATE only. It never runs animations —
 * future systems (GSAP, Framer Motion, R3F, Camera, Lighting, Audio, UI)
 * subscribe to this state to drive their own visual effects.
 *
 * Responsibilities:
 *   - Registration of items, groups, and sequences
 *   - Visibility tracking (viewport-relative)
 *   - Dependency resolution (prerequisites, parent/child)
 *   - Reveal ordering (priority + ordinal)
 *   - requestAnimationFrame batching — one rebuild per frame
 *   - Selector-based subscriptions
 *   - Immutable snapshots via getSnapshot()
 *   - Cleanup for page transitions
 *
 * Architecture:
 *   - Module-level mutable state — no React dependency
 *   - Consumes the EXISTING scroll state manager for reduced-motion
 *     (single matchMedia owner — never subscribes to matchMedia itself)
 *   - Consumes NARRATIVE_REGISTRY for section validation
 *   - Reuses prefersReducedMotion for non-React reads
 *
 * From DESIGN_SYSTEM §Performance:
 *   "Avoid rerenders. Use immutable snapshots. Memoized selectors."
 *
 * Phase 5.6: Reveal architecture — infrastructure only, no animations.
 */

import { scrollStateManager } from './scroll-state-manager';
import { prefersReducedMotion } from '@/shared/animation/reduced-motion';

import type {
  RevealVisibility,
  RevealItemOptions,
  RevealItemDefinition,
  RevealItemState,
  RevealGroupOptions,
  RevealGroupDefinition,
  RevealGroupState,
  RevealSequenceOptions,
  RevealSequenceDefinition,
  RevealSequenceState,
  RevealDependencyNode,
  RevealDependencyGraph,
  RevealState,
  ProgressiveRevealSnapshot,
  ProgressiveRevealRegistry,
  ProgressiveRevealManager,
  ProgressiveRevealConfig,
  RevealSelector,
  RevealEquality,
  RevealCallback,
  RevealUnsubscribe,
} from './progressive-reveal.types';

import {
  DEFAULT_REVEAL_CONFIG,
  DEFAULT_REVEAL_SNAPSHOT,
  REVEAL_PRIORITY_ORDER,
} from './progressive-reveal.constants';

// ── Internal Types ─────────────────────────────────────────

/**
 * Mutable primary state for a reveal item.
 * Derived fields (dependenciesMet) are computed during snapshot rebuild.
 */
interface InternalItemState {
  state: RevealState;
  visibility: RevealVisibility;
  progress: number;
  lastChange: number;
}

/** Selector subscription entry. */
interface SelectorEntry {
  readonly selector: RevealSelector<unknown>;
  readonly callback: RevealCallback;
  readonly equalityFn: RevealEquality<unknown>;
  lastValue: unknown;
}

// ── Module State ───────────────────────────────────────────

const itemDefinitions = new Map<string, RevealItemDefinition>();
const groupDefinitions = new Map<string, RevealGroupDefinition>();
const sequenceDefinitions = new Map<string, RevealSequenceDefinition>();

const itemStates = new Map<string, InternalItemState>();

/** Active step index per sequence (−1 = not started). */
const sequenceStepIndex = new Map<string, number>();

const config: ProgressiveRevealConfig = DEFAULT_REVEAL_CONFIG;

let snapshot: ProgressiveRevealSnapshot = DEFAULT_REVEAL_SNAPSHOT;
let initialized = false;
let revision = 0;
let reducedMotion = false;

/** All-change subscribers. */
const subscribers = new Set<RevealCallback>();
/** Selector subscribers — notified only when the selected value changes. */
const selectorSubscribers = new Set<SelectorEntry>();

/** Cleanup handles for integrations (scroll state subscriptions, etc.). */
const cleanups: Array<() => void> = [];

/** requestAnimationFrame handle for batching. */
let rafId: number | null = null;
/** Whether a rebuild is pending this frame. */
let updatePending = false;

let debugMode = import.meta.env.DEV;

// ── Time Helper ────────────────────────────────────────────

/** Monotonic-ish timestamp, SSR-safe. */
function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

// ── Snapshot Scheduling ────────────────────────────────────

/**
 * Schedules a snapshot rebuild on the next animation frame.
 * Coalesces multiple mutations within a frame into a single update.
 */
function scheduleUpdate(): void {
  if (updatePending) return;
  updatePending = true;

  if (typeof requestAnimationFrame === 'undefined') {
    /* SSR / non-browser — rebuild synchronously */
    updatePending = false;
    rebuildSnapshot();
    notifySubscribers();
    return;
  }

  rafId = requestAnimationFrame(() => {
    rafId = null;
    updatePending = false;
    rebuildSnapshot();
    notifySubscribers();
  });
}

// ── Dependency Resolution ──────────────────────────────────

/**
 * Determines whether every prerequisite of an item is revealed.
 */
function areDependenciesMet(def: RevealItemDefinition): boolean {
  if (def.prerequisites.length === 0) return true;
  for (const prereqId of def.prerequisites) {
    if (itemStates.get(prereqId)?.state !== 'revealed') return false;
  }
  return true;
}

/**
 * Builds the resolved dependency graph from current definitions.
 */
function buildDependencyGraph(): RevealDependencyGraph {
  const nodes = new Map<string, RevealDependencyNode>();
  const roots: string[] = [];

  /* Pre-compute children per parent */
  const childrenByParent = new Map<string, string[]>();
  for (const def of itemDefinitions.values()) {
    if (def.parentId !== null) {
      const list = childrenByParent.get(def.parentId) ?? [];
      list.push(def.id);
      childrenByParent.set(def.parentId, list);
    }
  }

  for (const def of itemDefinitions.values()) {
    nodes.set(def.id, {
      id: def.id,
      parentId: def.parentId,
      children: childrenByParent.get(def.id) ?? [],
      prerequisites: def.prerequisites,
      satisfied: areDependenciesMet(def),
    });
    if (def.parentId === null) roots.push(def.id);
  }

  return { nodes, roots };
}

// ── Snapshot Rebuild ───────────────────────────────────────

/**
 * Rebuilds the immutable snapshot from current definitions and states.
 *
 * Derived fields (dependenciesMet, group/sequence aggregates, overall
 * progress) are computed here so mutations only touch primary state.
 */
function rebuildSnapshot(): void {
  const items = new Map<string, RevealItemState>();
  const visibleItemIds: string[] = [];
  const revealedItemIds: string[] = [];
  const pendingItemIds: string[] = [];

  for (const def of itemDefinitions.values()) {
    const internal = itemStates.get(def.id);
    const state: RevealState = internal?.state ?? 'pending';
    const visibility: RevealVisibility = internal?.visibility ?? 'hidden';
    const progress = internal?.progress ?? 0;

    items.set(def.id, {
      id: def.id,
      state,
      visibility,
      progress,
      dependenciesMet: areDependenciesMet(def),
      lastChange: internal?.lastChange ?? 0,
    });

    if (visibility === 'visible') visibleItemIds.push(def.id);
    if (state === 'revealed') revealedItemIds.push(def.id);
    if (state === 'pending') pendingItemIds.push(def.id);
  }

  /* Group states */
  const groups = new Map<string, RevealGroupState>();
  for (const groupDef of groupDefinitions.values()) {
    const memberIds: string[] = [];
    let revealedCount = 0;
    let revealingCount = 0;

    for (const def of itemDefinitions.values()) {
      if (def.groupId !== groupDef.id) continue;
      memberIds.push(def.id);
      const s = itemStates.get(def.id)?.state ?? 'pending';
      if (s === 'revealed') revealedCount += 1;
      else if (s === 'revealing') revealingCount += 1;
    }

    const totalCount = memberIds.length;
    const fullyRevealed = groupDef.requireAllChildren
      ? totalCount > 0 && revealedCount === totalCount
      : revealedCount > 0;

    let groupState: RevealState = 'pending';
    if (fullyRevealed) groupState = 'revealed';
    else if (revealingCount > 0 || revealedCount > 0) groupState = 'revealing';

    groups.set(groupDef.id, {
      id: groupDef.id,
      state: groupState,
      itemIds: memberIds,
      revealedCount,
      totalCount,
      progress: totalCount > 0 ? revealedCount / totalCount : 0,
      lastChange: now(),
    });
  }

  /* Sequence states */
  const sequences = new Map<string, RevealSequenceState>();
  const completedSequenceIds: string[] = [];
  let activeSequenceId: string | null = null;

  for (const seqDef of sequenceDefinitions.values()) {
    const totalSteps = seqDef.steps.length;
    let completedCount = 0;
    for (const stepId of seqDef.steps) {
      if (itemStates.get(stepId)?.state === 'revealed') completedCount += 1;
    }

    const activeStepIndex = sequenceStepIndex.get(seqDef.id) ?? -1;
    const activeStepId =
      activeStepIndex >= 0 && activeStepIndex < totalSteps
        ? seqDef.steps[activeStepIndex]
        : null;
    const isComplete = totalSteps > 0 && completedCount === totalSteps;

    let seqState: RevealState = 'pending';
    if (isComplete) seqState = 'revealed';
    else if (activeStepIndex >= 0 || completedCount > 0) seqState = 'revealing';

    sequences.set(seqDef.id, {
      id: seqDef.id,
      state: seqState,
      activeStepIndex,
      activeStepId,
      completedCount,
      totalSteps,
      progress: totalSteps > 0 ? completedCount / totalSteps : 0,
      isComplete,
      lastChange: now(),
    });

    if (isComplete) {
      completedSequenceIds.push(seqDef.id);
    } else if (activeSequenceId === null && seqState === 'revealing') {
      activeSequenceId = seqDef.id;
    }
  }

  const itemCount = itemDefinitions.size;
  const overallProgress = itemCount > 0 ? revealedItemIds.length / itemCount : 0;

  revision += 1;

  snapshot = Object.freeze({
    items,
    groups,
    sequences,
    visibleItemIds,
    revealedItemIds,
    pendingItemIds,
    activeSequenceId,
    completedSequenceIds,
    overallProgress,
    isReducedMotion: reducedMotion,
    revision,
    timestamp: now(),
  });
}

// ── Subscriptions ──────────────────────────────────────────

/**
 * Notifies all-change subscribers, then selector subscribers whose
 * selected value changed.
 */
function notifySubscribers(): void {
  for (const subscriber of subscribers) {
    subscriber();
  }

  for (const entry of selectorSubscribers) {
    const newValue = entry.selector(snapshot);
    if (!entry.equalityFn(entry.lastValue, newValue)) {
      entry.lastValue = newValue;
      entry.callback();
    }
  }
}

function subscribe(callback: RevealCallback): RevealUnsubscribe {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function subscribeSelector<T>(
  selector: RevealSelector<T>,
  callback: RevealCallback,
  equalityFn: RevealEquality<T> = Object.is as RevealEquality<T>,
): RevealUnsubscribe {
  const entry: SelectorEntry = {
    selector: selector as RevealSelector<unknown>,
    callback,
    equalityFn: equalityFn as RevealEquality<unknown>,
    lastValue: selector(snapshot),
  };

  selectorSubscribers.add(entry);
  return () => {
    selectorSubscribers.delete(entry);
  };
}

// ── Registration ───────────────────────────────────────────

function registerItem(options: RevealItemOptions): void {
  const definition: RevealItemDefinition = {
    id: options.id,
    groupId: options.groupId ?? null,
    sectionId: options.sectionId ?? null,
    strategy: options.strategy ?? config.defaultStrategy,
    trigger: options.trigger ?? config.defaultTrigger,
    priority: options.priority ?? config.defaultPriority,
    resetPolicy: options.resetPolicy ?? config.defaultResetPolicy,
    order: options.order ?? 0,
    delay: options.delay ?? config.defaultDelay,
    prerequisites: options.prerequisites ?? [],
    parentId: options.parentId ?? null,
    enabled: options.enabled ?? true,
  };

  itemDefinitions.set(definition.id, definition);

  /* Preserve existing runtime state on re-registration (idempotent) */
  if (!itemStates.has(definition.id)) {
    const initialState: RevealState =
      definition.trigger === 'immediate' && definition.enabled
        ? 'revealed'
        : 'pending';
    itemStates.set(definition.id, {
      state: initialState,
      visibility: 'hidden',
      progress: initialState === 'revealed' ? 1 : 0,
      lastChange: now(),
    });
  }

  scheduleUpdate();
}

function unregisterItem(id: string): void {
  itemDefinitions.delete(id);
  itemStates.delete(id);
  scheduleUpdate();
}

function registerGroup(options: RevealGroupOptions): void {
  const definition: RevealGroupDefinition = {
    id: options.id,
    sectionId: options.sectionId ?? null,
    strategy: options.strategy ?? config.defaultStrategy,
    trigger: options.trigger ?? config.defaultTrigger,
    priority: options.priority ?? config.defaultPriority,
    resetPolicy: options.resetPolicy ?? config.defaultResetPolicy,
    stagger: options.stagger ?? config.defaultStagger,
    requireAllChildren: options.requireAllChildren ?? true,
    enabled: options.enabled ?? true,
  };

  groupDefinitions.set(definition.id, definition);
  scheduleUpdate();
}

function unregisterGroup(id: string): void {
  groupDefinitions.delete(id);
  scheduleUpdate();
}

function registerSequence(options: RevealSequenceOptions): void {
  const definition: RevealSequenceDefinition = {
    id: options.id,
    sectionId: options.sectionId ?? null,
    steps: options.steps,
    priority: options.priority ?? config.defaultPriority,
    resetPolicy: options.resetPolicy ?? config.defaultResetPolicy,
    loop: options.loop ?? false,
    enabled: options.enabled ?? true,
  };

  sequenceDefinitions.set(definition.id, definition);
  if (!sequenceStepIndex.has(definition.id)) {
    sequenceStepIndex.set(definition.id, -1);
  }
  scheduleUpdate();
}

function unregisterSequence(id: string): void {
  sequenceDefinitions.delete(id);
  sequenceStepIndex.delete(id);
  scheduleUpdate();
}

// ── State Mutation ─────────────────────────────────────────

function setItemState(id: string, next: Partial<InternalItemState>): void {
  const current = itemStates.get(id);
  if (!current) return;
  itemStates.set(id, { ...current, ...next, lastChange: now() });
}

function reveal(id: string): void {
  if (!itemDefinitions.has(id)) return;
  setItemState(id, { state: 'revealed', progress: 1 });
  scheduleUpdate();
}

function beginReveal(id: string): void {
  if (!itemDefinitions.has(id)) return;
  setItemState(id, { state: 'revealing' });
  scheduleUpdate();
}

/**
 * Resets an item to its pending state, honouring its reset policy.
 *
 * From DESIGN_SYSTEM §14 Law 5: items with the default 'none' policy
 * never reset automatically — reveals are permanent.
 */
function reset(id: string): void {
  const def = itemDefinitions.get(id);
  if (!def) return;
  if (def.resetPolicy === 'none') return;
  setItemState(id, { state: 'reset', progress: 0, visibility: 'hidden' });
  scheduleUpdate();
}

/**
 * Resets every registered item to pending. Explicit teardown — bypasses
 * per-item reset policies (used for page transitions and full resets).
 */
function resetAll(): void {
  for (const id of itemDefinitions.keys()) {
    setItemState(id, { state: 'pending', progress: 0, visibility: 'hidden' });
  }
  for (const seqId of sequenceStepIndex.keys()) {
    sequenceStepIndex.set(seqId, -1);
  }
  scheduleUpdate();
}

function setVisibility(id: string, visibility: RevealVisibility): void {
  if (!itemStates.has(id)) return;
  setItemState(id, { visibility });
  scheduleUpdate();
}

function setProgress(id: string, progress: number): void {
  if (!itemStates.has(id)) return;
  const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  setItemState(id, { progress: clamped });
  scheduleUpdate();
}

/**
 * Advances a sequence to its next step, revealing the completed step
 * and activating the next. Loops back to the start if configured.
 */
function advanceSequence(id: string): void {
  const def = sequenceDefinitions.get(id);
  if (!def || def.steps.length === 0) return;

  const currentIndex = sequenceStepIndex.get(id) ?? -1;

  /* Mark the current active step revealed before advancing */
  if (currentIndex >= 0 && currentIndex < def.steps.length) {
    const currentStepId = def.steps[currentIndex];
    if (itemStates.has(currentStepId)) {
      setItemState(currentStepId, { state: 'revealed', progress: 1 });
    }
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex >= def.steps.length) {
    sequenceStepIndex.set(id, def.loop ? 0 : def.steps.length - 1);
  } else {
    sequenceStepIndex.set(id, nextIndex);
  }

  scheduleUpdate();
}

// ── Registry ───────────────────────────────────────────────

function getRegistry(): ProgressiveRevealRegistry {
  return {
    getItem: (id) => snapshot.items.get(id),
    getGroup: (id) => snapshot.groups.get(id),
    getSequence: (id) => snapshot.sequences.get(id),
    getItemIds: () => Array.from(itemDefinitions.keys()),
    getGroupIds: () => Array.from(groupDefinitions.keys()),
    getSequenceIds: () => Array.from(sequenceDefinitions.keys()),
    getItemsByGroup: (groupId) =>
      Array.from(itemDefinitions.values())
        .filter((d) => d.groupId === groupId)
        .sort(compareRevealOrder)
        .map((d) => d.id),
    getItemsBySection: (sectionId) =>
      Array.from(itemDefinitions.values())
        .filter((d) => d.sectionId === sectionId)
        .sort(compareRevealOrder)
        .map((d) => d.id),
    getItemsByState: (state) =>
      Array.from(snapshot.items.values())
        .filter((s) => s.state === state)
        .map((s) => s.id),
    hasItem: (id) => itemDefinitions.has(id),
    itemCount: () => itemDefinitions.size,
  };
}

/**
 * Reveal ordering comparator — lower priority weight first, then the
 * item's ordinal position. Used to order same-frame reveals.
 */
function compareRevealOrder(
  a: RevealItemDefinition,
  b: RevealItemDefinition,
): number {
  const priorityDelta =
    REVEAL_PRIORITY_ORDER[a.priority] - REVEAL_PRIORITY_ORDER[b.priority];
  if (priorityDelta !== 0) return priorityDelta;
  return a.order - b.order;
}

function getDependencyGraph(): RevealDependencyGraph {
  return buildDependencyGraph();
}

// ── Lifecycle ──────────────────────────────────────────────

function init(): void {
  if (initialized) return;

  /* Ensure the scroll state manager is running (single source of truth) */
  scrollStateManager.init();

  /* Seed reduced-motion from the SSR-safe reader */
  reducedMotion = prefersReducedMotion();

  /*
   * Subscribe to the scroll state manager for reduced-motion changes.
   * ThemeProvider is the sole matchMedia owner; the scroll state manager
   * mirrors that into its snapshot. We consume it here — never adding a
   * duplicate matchMedia listener.
   */
  const unsubscribeReducedMotion = scrollStateManager.subscribeSelector(
    (s) => s.isReducedMotion,
    () => {
      const next = scrollStateManager.getSnapshot().isReducedMotion;
      if (next !== reducedMotion) {
        reducedMotion = next;
        scheduleUpdate();
      }
    },
  );
  cleanups.push(unsubscribeReducedMotion);

  initialized = true;
  scheduleUpdate();
}

function destroy(): void {
  if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  for (const cleanup of cleanups) {
    cleanup();
  }
  cleanups.length = 0;

  subscribers.clear();
  selectorSubscribers.clear();

  itemDefinitions.clear();
  groupDefinitions.clear();
  sequenceDefinitions.clear();
  itemStates.clear();
  sequenceStepIndex.clear();

  snapshot = DEFAULT_REVEAL_SNAPSHOT;
  revision = 0;
  reducedMotion = false;
  updatePending = false;
  initialized = false;
}

function getSnapshot(): ProgressiveRevealSnapshot {
  return snapshot;
}

function isInitialized(): boolean {
  return initialized;
}

function setDebugMode(enabled: boolean): void {
  debugMode = enabled;
}

/** Whether debug mode is active (dev tooling only). */
export function isDebugMode(): boolean {
  return debugMode;
}

// ── Singleton Export ───────────────────────────────────────

/**
 * The singleton progressive reveal manager.
 *
 * This is the single owner of all reveal state. All hooks and future
 * consumers read from this instance.
 */
export const progressiveRevealManager: ProgressiveRevealManager = Object.freeze({
  getSnapshot,
  subscribe,
  subscribeSelector,
  isInitialized,
  init,
  destroy,
  registerItem,
  unregisterItem,
  registerGroup,
  unregisterGroup,
  registerSequence,
  unregisterSequence,
  reveal,
  beginReveal,
  reset,
  resetAll,
  setVisibility,
  setProgress,
  advanceSequence,
  getRegistry,
  getDependencyGraph,
  setDebugMode,
});
