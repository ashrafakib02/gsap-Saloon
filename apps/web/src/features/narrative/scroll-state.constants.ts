/**
 * Scroll State Constants — Default Configuration and Descriptions
 *
 * Provides default values, description records, and thresholds
 * for the centralized scroll state system.
 *
 * Values derive from DESIGN_SYSTEM §7, §14 and existing
 * timing/breakpoint tokens.
 *
 * Phase 5.5: Constants — no animation code.
 */

import type {
  ScrollDirection,
  ScrollBreakpoint,
  ScrollPhase,
  ScrollState,
  ScrollStateConfig,
} from './scroll-state.types';
import type { SectionId } from './narrative.types';

// ── Re-exports ─────────────────────────────────────────────

export {
  SCROLL_DIRECTIONS,
  SCROLL_BREAKPOINTS,
  SCROLL_PHASES,
} from './scroll-state.types';

// ── Direction Descriptions ──────────────────────────────────

/** Human-readable descriptions for each scroll direction. */
export const DIRECTION_DESCRIPTIONS: Record<ScrollDirection, string> = {
  down: 'Scrolling down — forward narrative progression',
  up: 'Scrolling up — backward, content stays revealed',
  none: 'Not currently scrolling',
};

// ── Breakpoint Descriptions ─────────────────────────────────

/** Human-readable descriptions for each scroll breakpoint. */
export const BREAKPOINT_DESCRIPTIONS: Record<ScrollBreakpoint, string> = {
  mobile: 'Mobile viewport (< 768px) — single-column, touch-first',
  tablet: 'Tablet viewport (768–1023px) — transitional layout',
  desktop: 'Desktop viewport (1024–1443px) — full editorial layout',
  wide: 'Wide-screen viewport (≥ 1440px) — expanded desktop',
};

// ── Phase Descriptions ──────────────────────────────────────

/** Human-readable descriptions for each scroll phase. */
export const PHASE_DESCRIPTIONS: Record<ScrollPhase, string> = {
  'pre-narrative': 'Before narrative content — page top, threshold',
  'act-one': 'Act I (Invitation) — emotional hooks, world-building',
  'act-two': 'Act II (Experience) — services, artisans, social proof',
  'act-three': 'Act III (Commitment) — booking, gift, closing',
  'post-narrative': 'After narrative content — footer, credits',
};

// ── Default Section ID ──────────────────────────────────────

/** Initial section ID before any scroll occurs. */
export const DEFAULT_SECTION_ID: SectionId = 'threshold';

// ── Default Manager Config ──────────────────────────────────

/**
 * Default configuration for the scroll state manager.
 *
 * Values derived from DESIGN_SYSTEM §14 and existing tokens.
 * Matches SCROLL_THRESHOLDS.directionPixel (10px) and DEBOUNCE.resize (150ms).
 */
export const DEFAULT_SCROLL_STATE_CONFIG: ScrollStateConfig = {
  /** 2 seconds — time before page is considered idle */
  idleTimeout: 2000,
  /** 10px — matches SCROLL_THRESHOLDS.directionPixel */
  directionThreshold: 10,
  /** 150ms — matches DEBOUNCE.resize */
  resizeDebounce: 150,
  /** Debug mode off by default, auto-enabled in dev */
  debugDefault: false,
  /** Average velocity over last 5 frames */
  velocitySampleCount: 5,
} as const;

// ── Default Scroll State ────────────────────────────────────

/**
 * Initial scroll state before the first update.
 *
 * Represents a page that has not yet been scrolled.
 * SSR-safe — all browser-dependent values use safe defaults.
 */
export const DEFAULT_SCROLL_STATE: ScrollState = {
  /* Position */
  scrollY: 0,
  scrollX: 0,

  /* Progress */
  pageProgress: 0,
  sectionProgress: 0,
  timelineProgress: 0,

  /* Navigation */
  currentSectionId: DEFAULT_SECTION_ID,
  previousSectionId: null,
  nextSectionId: null,

  /* Behavior */
  direction: 'none',
  isScrolling: false,
  isIdle: true,

  /* Velocity */
  velocity: 0,
  smoothedVelocity: 0,

  /* Narrative */
  currentStage: 'prologue',
  currentPhase: 'pre-narrative',
  currentActProgress: 0,
  narrativeProgress: 0,

  /* Timeline */
  timelineNormalizedProgress: 0,

  /* Viewport */
  viewportWidth: 0,
  viewportHeight: 0,

  /* Input */
  isTouchDevice: false,
  pointerType: 'none',

  /* Accessibility */
  isReducedMotion: false,

  /* Transition */
  isTransitioning: false,

  /* Triggers */
  activeTriggerCount: 0,

  /* Breakpoint */
  breakpoint: 'mobile',

  /* Debug */
  debugMode: false,

  /* Metadata */
  timestamp: 0,
  frameCount: 0,
} as const;

// ── Velocity Thresholds ─────────────────────────────────────

/**
 * Scroll velocity thresholds for state classification.
 *
 * From DESIGN_SYSTEM §14:
 * "Motion serves content, never decorates it."
 */
export const VELOCITY_THRESHOLDS = {
  /** Velocity above this (px/s) is considered fast scrolling */
  fast: 2000,
  /** Velocity below this (px/s) is considered still */
  still: 5,
} as const;

// ── State Description Record ────────────────────────────────

/**
 * Human-readable descriptions for scroll state properties.
 * Used in debug panels and developer tools.
 */
export const STATE_DESCRIPTIONS: Record<keyof ScrollState, string> = {
  scrollY: 'Raw scroll position from top (pixels)',
  scrollX: 'Raw scroll position from left (pixels)',
  pageProgress: 'Overall page scroll progress (0→1)',
  sectionProgress: 'Progress within the current section (0→1)',
  timelineProgress: 'Timeline progress (0→1)',
  currentSectionId: 'Current section ID in scroll position',
  previousSectionId: 'Previous section ID (null if at first)',
  nextSectionId: 'Next section ID (null if at last)',
  direction: 'Current scroll direction (up/down/none)',
  isScrolling: 'Whether the page is currently scrolling',
  isIdle: 'Whether the page is idle (no scroll activity)',
  velocity: 'Current scroll velocity (pixels/second)',
  smoothedVelocity: 'Averaged velocity over recent frames',
  currentStage: 'Current narrative stage',
  currentPhase: 'Current scroll phase',
  currentActProgress: 'Progress through the current act (0→1)',
  narrativeProgress: 'Overall narrative progress (0→1)',
  timelineNormalizedProgress: 'Timeline-normalized progress (0→1)',
  viewportWidth: 'Current viewport width (pixels)',
  viewportHeight: 'Current viewport height (pixels)',
  isTouchDevice: 'Whether device has touch capability',
  pointerType: 'Current primary pointer type',
  isReducedMotion: 'Whether prefers-reduced-motion is active',
  isTransitioning: 'Whether a section transition is in progress',
  activeTriggerCount: 'Number of active ScrollTrigger instances',
  breakpoint: 'Current viewport breakpoint',
  debugMode: 'Whether debug mode is active',
  timestamp: 'Timestamp of last state update',
  frameCount: 'Number of state updates since initialization',
};
