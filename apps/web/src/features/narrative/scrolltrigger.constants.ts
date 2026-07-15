/**
 * ScrollTrigger Constants — Default Configuration
 *
 * Provides default values and description records for the
 * ScrollTrigger management system.
 *
 * All values derive from DESIGN_SYSTEM §7, §14, and §Performance.
 *
 * Phase 5.4: Constants — no animation code.
 */

import type {
  TriggerGroup,
  TriggerPriority,
  TriggerBreakpoint,
  TriggerLifecycleState,
  ScrollTriggerManagerConfig,
  BreakpointConfig,
} from './scrolltrigger.types';

// ── Re-exports ─────────────────────────────────────────────

export {
  TRIGGER_GROUPS,
  TRIGGER_PRIORITIES,
  TRIGGER_LIFECYCLE_STATES,
  TRIGGER_BREAKPOINTS,
} from './scrolltrigger.types';

// ── Group Description Records ───────────────────────────────

/** Human-readable descriptions for each trigger group. */
export const GROUP_DESCRIPTIONS: Record<TriggerGroup, string> = {
  'section-reveal': 'Fade-in animations triggered when sections enter the viewport',
  'parallax': 'Depth-based background movement tied to scroll position',
  'text-reveal': 'Staggered text entrance animations for headlines and body copy',
  'image-reveal': 'Photography entrance animations with controlled timing',
  'ui': 'Interface transitions — navigation, overlays, modal entrances',
  'camera': 'React Three Fiber camera movement triggers',
  'analytics': 'Scroll depth tracking and section timing measurement',
  'accessibility': 'Section landmark announcements for screen readers',
  'structural': 'Non-visual triggers for thresholds and page structure',
};

// ── Priority Description Records ────────────────────────────

/** Human-readable descriptions for each trigger priority. */
export const TRIGGER_PRIORITY_DESCRIPTIONS: Record<TriggerPriority, string> = {
  critical: 'Must execute — hero, above-fold content. Created first, refreshed first.',
  high: 'Should execute — primary content sections. Created after critical.',
  normal: 'Execute when possible — standard sections. Default priority.',
  low: 'Execute if resources permit — decorative, below-fold elements.',
};

// ── Breakpoint Description Records ──────────────────────────

/** Human-readable descriptions for each breakpoint. */
export const BREAKPOINT_DESCRIPTIONS: Record<TriggerBreakpoint, string> = {
  all: 'Active on all viewport widths — the default breakpoint',
  mobile: 'Active only on mobile viewports (< 768px)',
  tablet: 'Active only on tablet viewports (768–1023px)',
  desktop: 'Active only on desktop viewports (≥ 1024px)',
  wide: 'Active only on wide-screen viewports (≥ 1440px)',
};

// ── Lifecycle State Descriptions ────────────────────────────

/** Human-readable descriptions for each lifecycle state. */
export const LIFECYCLE_DESCRIPTIONS: Record<TriggerLifecycleState, string> = {
  registered: 'Trigger definition registered but ScrollTrigger instance not yet created (lazy)',
  active: 'ScrollTrigger instance created and actively monitoring scroll position',
  disabled: 'Temporarily disabled — instance paused or killed during reduced-motion or transition',
  destroyed: 'Trigger killed and removed from the registry permanently',
};

// ── Default Trigger Definitions ─────────────────────────────

/**
 * Pre-configured trigger definitions for standard section patterns.
 *
 * Components can use these as starting points and override
 * specific options as needed.
 *
 * From DESIGN_SYSTEM §14:
 * "Content is always visible without animation."
 *   → All triggers have reducedMotionBehavior: 'skip'
 */
export const DEFAULT_TRIGGER_DEFINITIONS = {
  /** Standard section reveal — fade in on scroll entry */
  sectionReveal: {
    group: 'section-reveal' as TriggerGroup,
    start: 'top 80%',
    priority: 'normal' as TriggerPriority,
    enabled: true,
    reducedMotionBehavior: 'skip' as const,
  },

  /** Parallax effect — scrubbed to scroll position */
  parallax: {
    group: 'parallax' as TriggerGroup,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    priority: 'low' as TriggerPriority,
    enabled: true,
    reducedMotionBehavior: 'skip' as const,
  },

  /** Text stagger — sequential word/line reveals */
  textReveal: {
    group: 'text-reveal' as TriggerGroup,
    start: 'top 80%',
    priority: 'normal' as TriggerPriority,
    enabled: true,
    reducedMotionBehavior: 'skip' as const,
  },

  /** Image reveal — photography entrance */
  imageReveal: {
    group: 'image-reveal' as TriggerGroup,
    start: 'top 85%',
    priority: 'normal' as TriggerPriority,
    enabled: true,
    reducedMotionBehavior: 'skip' as const,
  },

  /** Hero section — above-the-fold, critical priority */
  heroSection: {
    group: 'section-reveal' as TriggerGroup,
    start: 'top top',
    priority: 'critical' as TriggerPriority,
    enabled: true,
    markers: false,
    reducedMotionBehavior: 'instant' as const,
  },

  /** Breathing space — minimal, brief */
  breathingSpace: {
    group: 'structural' as TriggerGroup,
    start: 'top center',
    priority: 'low' as TriggerPriority,
    enabled: true,
    reducedMotionBehavior: 'skip' as const,
  },

  /** Closing section — extended duration */
  closingSection: {
    group: 'section-reveal' as TriggerGroup,
    start: 'top 70%',
    priority: 'critical' as TriggerPriority,
    enabled: true,
    reducedMotionBehavior: 'instant' as const,
  },

  /** Analytics section entry — low priority, non-visual */
  analyticsEntry: {
    group: 'analytics' as TriggerGroup,
    start: 'top 75%',
    priority: 'low' as TriggerPriority,
    enabled: true,
    reducedMotionBehavior: 'skip' as const,
  },
} as const;

// ── Default Breakpoint Configuration ────────────────────────

/**
 * Per-breakpoint default configurations.
 *
 * From DESIGN_SYSTEM §7:
 * Mobile: < 768px → simplified triggers, fewer concurrent
 * Tablet: 768–1023px → moderate
 * Desktop: ≥ 1024px → full triggers
 * Wide: ≥ 1440px → full triggers with debug markers
 */
export const DEFAULT_BREAKPOINT_CONFIG: Record<TriggerBreakpoint, BreakpointConfig> = {
  all: {
    enabled: true,
    markers: false,
    maxActiveTriggers: 12,
    reducedMotionBehavior: 'skip',
  },
  mobile: {
    enabled: true,
    defaultStart: 'top 85%',
    defaultScrub: false,
    markers: false,
    maxActiveTriggers: 5,
    reducedMotionBehavior: 'instant',
  },
  tablet: {
    enabled: true,
    defaultStart: 'top 80%',
    markers: false,
    maxActiveTriggers: 8,
    reducedMotionBehavior: 'skip',
  },
  desktop: {
    enabled: true,
    defaultStart: 'top 80%',
    markers: false,
    maxActiveTriggers: 12,
    reducedMotionBehavior: 'skip',
  },
  wide: {
    enabled: true,
    defaultStart: 'top 75%',
    markers: import.meta.env.DEV,
    maxActiveTriggers: 16,
    reducedMotionBehavior: 'skip',
  },
};

// ── Default Manager Configuration ───────────────────────────

/**
 * Global default configuration for the ScrollTrigger manager.
 *
 * Values derived from DESIGN_SYSTEM §14 and §Performance.
 */
export const DEFAULT_MANAGER_CONFIG: ScrollTriggerManagerConfig = {
  defaultGroup: 'section-reveal',
  defaultPriority: 'normal',
  defaultStart: 'top 80%',
  defaultScrub: false,
  refreshInterval: 200,
  maxActiveTriggers: 12,
  debugEnabled: import.meta.env.DEV,
  debugThrottle: 100,
  breakpoints: DEFAULT_BREAKPOINT_CONFIG,
} as const;
