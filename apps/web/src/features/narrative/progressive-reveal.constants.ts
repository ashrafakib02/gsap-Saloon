/**
 * Progressive Reveal Constants — Default Configuration and Descriptions
 *
 * Provides default values, description records, and the initial
 * snapshot for the progressive reveal system.
 *
 * Values derive from DESIGN_SYSTEM §14 (Motion Laws), §15 (Accessibility),
 * and existing timing tokens.
 *
 * Phase 5.6: Constants — no animation code.
 */

import type {
  RevealStrategy,
  RevealState,
  RevealVisibility,
  RevealPriority,
  RevealTrigger,
  RevealResetPolicy,
  ProgressiveRevealSnapshot,
  ProgressiveRevealConfig,
} from './progressive-reveal.types';

// ── Re-exports ─────────────────────────────────────────────

export {
  REVEAL_STRATEGIES,
  REVEAL_STATES,
  REVEAL_VISIBILITY,
  REVEAL_PRIORITIES,
  REVEAL_TRIGGERS,
  REVEAL_RESET_POLICIES,
} from './progressive-reveal.types';

// ── Strategy Descriptions ───────────────────────────────────

/** Human-readable descriptions for each reveal strategy. */
export const REVEAL_STRATEGY_DESCRIPTIONS: Record<RevealStrategy, string> = {
  instant: 'Appears immediately with no transition',
  fade: 'Simple opacity fade-in',
  cascade: 'Cascading reveal — children reveal in a flowing wave',
  stagger: 'Staggered reveal — children reveal with a fixed offset',
  sequence: 'Ordered sequence — one item after another, gated by completion',
  manual: 'Manually controlled — consumer decides when to reveal',
  viewport: 'Reveal when the item enters the viewport',
  timeline: 'Reveal driven by the scroll timeline position',
  dependency: 'Reveal gated by dependency completion',
  group: 'Reveal synchronized with the parent group',
};

// ── State Descriptions ──────────────────────────────────────

/** Human-readable descriptions for each reveal lifecycle state. */
export const REVEAL_STATE_DESCRIPTIONS: Record<RevealState, string> = {
  pending: 'Registered but not yet eligible to reveal',
  revealing: 'Actively revealing — transition in progress (consumer-driven)',
  revealed: 'Fully revealed and settled',
  hidden: 'Explicitly hidden — was revealed, then reset',
  reset: 'Reset to initial state, awaiting re-reveal',
};

// ── Visibility Descriptions ─────────────────────────────────

/** Human-readable descriptions for each visibility state. */
export const REVEAL_VISIBILITY_DESCRIPTIONS: Record<RevealVisibility, string> = {
  hidden: 'Outside the viewport and not revealed',
  entering: 'Crossing into the viewport (leading edge)',
  visible: 'Fully within the viewport',
  leaving: 'Crossing out of the viewport (trailing edge)',
};

// ── Priority Descriptions ───────────────────────────────────

/** Human-readable descriptions for each reveal priority. */
export const REVEAL_PRIORITY_DESCRIPTIONS: Record<RevealPriority, string> = {
  critical: 'Must reveal first — above-fold, hero-adjacent content',
  high: 'Should reveal early — primary content',
  normal: 'Standard reveal order — default priority',
  low: 'Reveal last — decorative, below-fold content',
};

// ── Trigger Descriptions ────────────────────────────────────

/** Human-readable descriptions for each reveal trigger. */
export const REVEAL_TRIGGER_DESCRIPTIONS: Record<RevealTrigger, string> = {
  manual: 'Consumer calls reveal() explicitly',
  viewport: 'Item entered the viewport',
  scroll: 'Scroll position crossed a threshold',
  timeline: 'Timeline reached the item window',
  dependency: 'All prerequisites completed',
  immediate: 'Reveal on registration, no gating',
};

// ── Reset Policy Descriptions ───────────────────────────────

/** Human-readable descriptions for each reset policy. */
export const REVEAL_RESET_POLICY_DESCRIPTIONS: Record<RevealResetPolicy, string> = {
  none: 'Never reset — reveals are permanent (Law 5)',
  'on-exit': 'Reset when the item scrolls fully out of the viewport',
  'on-leave': 'Reset when the item section is left',
  always: 'Reset on every viewport exit and re-reveal on re-entry',
  manual: 'Reset only when reset() is called explicitly',
};

// ── Priority Ordering ───────────────────────────────────────

/**
 * Numeric weight for each priority — lower reveals first.
 * Used to order items that become eligible in the same frame.
 */
export const REVEAL_PRIORITY_ORDER: Record<RevealPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

// ── Default Manager Config ──────────────────────────────────

/**
 * Default configuration for the progressive reveal manager.
 *
 * Default reset policy is 'none' per DESIGN_SYSTEM §14 Law 5:
 * "Previously-revealed content remains revealed."
 * Stagger/delay defaults are metadata only — consumed later by
 * animation systems, never applied here.
 */
export const DEFAULT_REVEAL_CONFIG: ProgressiveRevealConfig = {
  defaultStrategy: 'fade',
  defaultTrigger: 'viewport',
  defaultPriority: 'normal',
  defaultResetPolicy: 'none',
  /** 80ms — matches a comfortable editorial stagger cadence */
  defaultStagger: 80,
  /** 0ms — no delay unless a consumer opts in */
  defaultDelay: 0,
  /** Debug mode off by default, auto-enabled in dev */
  debugDefault: false,
} as const;

// ── Default Snapshot ────────────────────────────────────────

/**
 * The initial, empty progressive reveal snapshot.
 *
 * Represents a system with no registered items, groups, or sequences.
 * SSR-safe — contains only empty collections and zeroed counters.
 */
export const DEFAULT_REVEAL_SNAPSHOT: ProgressiveRevealSnapshot = {
  items: new Map(),
  groups: new Map(),
  sequences: new Map(),
  visibleItemIds: [],
  revealedItemIds: [],
  pendingItemIds: [],
  activeSequenceId: null,
  completedSequenceIds: [],
  overallProgress: 0,
  isReducedMotion: false,
  revision: 0,
  timestamp: 0,
} as const;
