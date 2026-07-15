/**
 * Narrative — Scroll-Linked Narrative Architecture
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The site follows a three-act dramatic structure:
 *  Prologue → Act I (Invitation) → Act II (Experience)
 *  → Act III (Commitment) → Epilogue."
 *
 * This module provides the narrative system that governs all
 * 16 scroll-driven homepage sections. Every section follows this
 * architecture.
 *
 * Public API:
 *   - NarrativeProvider: context provider (wrap at page level)
 *   - useNarrative: main context hook
 *   - useNarrativeRegistry: registry access hook
 *   - useNarrativeOrder: ordered sections hook
 *   - TRANSITION_REGISTRY: singleton transition registry
 *   - Transition hooks: useSectionTransition, useEntryTransition, etc.
 *   - TIMELINE_REGISTRY: singleton timeline registry
 *   - Timeline hooks: useTimeline, useTimelineTracks, etc.
 *   - ScrollTrigger manager: registration, lifecycle, refresh, debug
 *   - ScrollTrigger hooks: useScrollTriggers, useScrollTriggerRegistry, etc.
 *   - Section constants, transition constants, timeline constants, and types
 *
 * Phase 5.1: Structure and metadata.
 * Phase 5.2: Section transitions and breathing spaces.
 * Phase 5.3: Scroll timeline architecture.
 * Phase 5.4: ScrollTrigger infrastructure.
 */

// ── Provider ───────────────────────────────────────────────

export { NarrativeProvider } from './narrative-context';

// ── Hooks ──────────────────────────────────────────────────

export { useNarrative } from './hooks/use-narrative';
export { useNarrativeRegistry } from './hooks/use-narrative-registry';
export { useNarrativeOrder } from './hooks/use-narrative-order';
export type { NarrativeOrderAPI } from './hooks/use-narrative-order';

// ── Transition Hooks ───────────────────────────────────────

export {
  useSectionTransition,
  useEntryTransition,
  useExitTransition,
} from './hooks/use-section-transition';
export type { UseSectionTransitionResult } from './hooks/use-section-transition';

export { useTransitionRegistry } from './hooks/use-transition-registry';

export {
  useTransitionsByType,
  useTransitionsByMood,
  useTransitionsByPriority,
  useEnabledTransitions,
  useActTransitions,
} from './hooks/use-transition-metadata';

export {
  useTransitionSequence,
  useTransitionDefinition,
} from './hooks/use-transition-sequence';
export type { UseTransitionSequenceResult } from './hooks/use-transition-sequence';

// ── Timeline Hooks ─────────────────────────────────────────

export { useTimeline } from './hooks/use-timeline';
export type { UseTimelineResult } from './hooks/use-timeline';

export { useTimelineRegistry } from './hooks/use-timeline-registry';

export {
  useAllTimelineTracks,
  useEnabledTimelineTracks,
  useTimelineTrack,
  useTimelineTracksByPriority,
  useTimelineSegments,
  useTimelineSegmentsForSection,
} from './hooks/use-timeline-tracks';

export {
  useAllTimelineMarkers,
  useTimelineMarkersByType,
  useTimelineMarkersForSection,
  useTimelineMarker,
} from './hooks/use-timeline-markers';

export {
  useTimelineProgress,
  useActiveSegments,
  useSectionProgress,
} from './hooks/use-timeline-progress';

// ── ScrollTrigger Hooks ────────────────────────────────────

export { useScrollTriggers } from './hooks/use-scroll-triggers';
export type { UseScrollTriggersReturn } from './hooks/use-scroll-triggers';

export { useScrollTriggerRegistry } from './hooks/use-scroll-trigger-registry';
export type { UseScrollTriggerRegistryReturn } from './hooks/use-scroll-trigger-registry';

export { useScrollTriggerLifecycle } from './hooks/use-scroll-trigger-lifecycle';
export type {
  ScrollTriggerLifecycleOptions,
  UseScrollTriggerLifecycleReturn,
} from './hooks/use-scroll-trigger-lifecycle';

export { useScrollTriggerRefresh } from './hooks/use-scroll-trigger-refresh';
export type {
  ScrollTriggerRefreshOptions,
  UseScrollTriggerRefreshReturn,
} from './hooks/use-scroll-trigger-refresh';

export { useReducedMotionTrigger } from './hooks/use-reduced-motion-trigger';
export type { UseReducedMotionTriggerReturn } from './hooks/use-reduced-motion-trigger';

// ── Registries ─────────────────────────────────────────────

export { NARRATIVE_REGISTRY } from './narrative.config';
export { TRANSITION_REGISTRY } from './narrative-transitions.config';
export { TIMELINE_REGISTRY } from './narrative-timeline.config';

// ── ScrollTrigger Manager ──────────────────────────────────

export {
  initScrollTriggerManager,
  registerScrollTrigger,
  killTrigger,
  killAll,
  disableTrigger,
  enableTrigger,
  pauseTrigger,
  resumeTrigger,
  refresh,
  refreshBatched,
  updateBreakpoint,
  getCurrentBreakpoint,
  handleReducedMotionChange,
  isReducedMotionActive,
  getRegistry,
  getDebugInfo,
  setDebugMode,
  logDebugInfo,
  isInitialized,
  getConfig,
  getAllTriggerIds,
  getActiveTriggerIds,
  getTriggerCount,
  getActiveCount,
  isTriggerActive,
  getRefreshCount,
  getLastRefreshAt,
} from './scrolltrigger-manager';

// ── Section Constants ──────────────────────────────────────

export {
  SECTION_IDS,
  SECTION_CATEGORIES,
  NARRATIVE_STAGES,
  SECTION_IMPORTANCE,
  THEME_VARIANTS,
  ANIMATION_KEYS,
  PRELOAD_KEYS,
  TRANSITION_NAMES,
  SCROLL_PARTICIPATION,
  ORDERED_SECTION_IDS,
  ENABLED_SECTION_IDS,
  ACT_ONE_SECTIONS,
  ACT_TWO_SECTIONS,
  ACT_THREE_SECTIONS,
  PROLOGUE_SECTIONS,
  EPILOGUE_SECTIONS,
  BREATHING_SPACE_IDS,
  PEAK_SECTIONS,
  SIGNATURE_SECTIONS,
  SCROLL_SECTIONS,
  PRELOAD_ORDER,
  SECTION_DISPLAY_NAMES,
} from './narrative.constants';

// ── Transition Constants ───────────────────────────────────

export {
  TRANSITION_TYPES,
  TRANSITION_DIRECTIONS,
  TRANSITION_SPEEDS,
  TRANSITION_MOODS,
  TRANSITION_PRIORITIES,
  TRANSITION_TRIGGERS,
  SECTION_BOUNDARIES,
  TRANSITION_STATES,
  BREATHING_PURPOSES,
  REDUCED_MOTION_STRATEGIES,
  MOOD_DESCRIPTIONS,
  SPEED_DURATIONS,
  PRIORITY_DESCRIPTIONS,
  TYPE_DESCRIPTIONS,
  BOUNDARY_DESCRIPTIONS,
  REDUCED_MOTION_DESCRIPTIONS,
  BREATHING_PURPOSE_DESCRIPTIONS,
} from './narrative-transitions.constants';

// ── Timeline Constants ─────────────────────────────────────

export {
  TIMELINE_TRACK_TYPES,
  TIMELINE_STATES,
  TIMELINE_PRIORITIES,
  TIMELINE_PLAYBACK_MODES,
  TIMELINE_DIRECTIONS,
  TIMELINE_DURATION_CATEGORIES,
  TIMELINE_MARKER_TYPES,
  TIMELINE_OFFSET_UNITS,
  TIMELINE_SYNC_MODES,
  KEYFRAME_INTERPOLATIONS,
  TRACK_TYPE_DESCRIPTIONS,
  STATE_DESCRIPTIONS,
  TIMELINE_PRIORITY_DESCRIPTIONS,
  PLAYBACK_MODE_DESCRIPTIONS,
  DIRECTION_DESCRIPTIONS,
  DURATION_DESCRIPTIONS,
  DURATION_RANGES,
  MARKER_TYPE_DESCRIPTIONS,
  SYNC_MODE_DESCRIPTIONS,
  INTERPOLATION_DESCRIPTIONS,
  NARRATIVE_TRACK_ID,
} from './narrative-timeline.constants';

// ── Section Types ──────────────────────────────────────────

export type {
  SectionId,
  SectionCategory,
  NarrativeStage,
  SectionImportance,
  ThemeVariant,
  AnimationKey,
  PreloadKey,
  TransitionName,
  ScrollParticipation,
  NarrativeSection,
  NarrativeRegistry,
  NarrativeContextValue,
  AccessibilityMetadata,
  AnalyticsMetadata,
  AnimationRegistration,
  PreloadRegistration,
} from './narrative.types';

// ── Transition Types ───────────────────────────────────────

export type {
  TransitionType,
  TransitionDirection,
  TransitionSpeed,
  TransitionMood,
  TransitionPriority,
  TransitionTrigger,
  SectionBoundary,
  TransitionState,
  BreathingPurpose,
  ReducedMotionStrategy,
  TransitionMetadata,
  TransitionRegistry,
  TransitionDefinition,
  TransitionContextValue,
  BreathingSpaceConfig,
  SectionBoundaryConfig,
} from './narrative-transitions.types';

// ── Timeline Types ─────────────────────────────────────────

export type {
  TimelineTrackType,
  TimelineState,
  TimelinePriority,
  TimelinePlaybackMode,
  TimelineDirection,
  TimelineDurationCategory,
  TimelineMarkerType,
  TimelineOffsetUnit,
  TimelineSyncMode,
  KeyframeInterpolation,
  TimelineRange,
  TimelineOffset,
  TimelineLabel,
  TimelineKeyframe,
  TimelineCue,
  TimelineSegment,
  TimelineMarker,
  TimelineTrack,
  TimelineGroup,
  TimelineProgress,
  TimelineMetadata,
  TimelineDefinition,
  TimelineRegistry,
  TimelineContextValue,
} from './narrative-timeline.types';

// ── ScrollTrigger Constants ────────────────────────────────

export {
  TRIGGER_GROUPS,
  TRIGGER_PRIORITIES,
  TRIGGER_LIFECYCLE_STATES,
  TRIGGER_BREAKPOINTS,
  GROUP_DESCRIPTIONS,
  TRIGGER_PRIORITY_DESCRIPTIONS,
  BREAKPOINT_DESCRIPTIONS,
  LIFECYCLE_DESCRIPTIONS,
  DEFAULT_TRIGGER_DEFINITIONS,
  DEFAULT_BREAKPOINT_CONFIG,
  DEFAULT_MANAGER_CONFIG,
} from './scrolltrigger.constants';

// ── ScrollTrigger Types ────────────────────────────────────

export type {
  TriggerGroup,
  TriggerPriority,
  TriggerLifecycleState,
  TriggerBreakpoint,
  TriggerOptions,
  TriggerDefinition,
  TriggerState,
  ManagedTrigger,
  ScrollTriggerInstance,
  ScrollTriggerRegistry,
  ScrollTriggerDebugInfo,
  ScrollTriggerContextValue,
  BreakpointConfig,
  ScrollTriggerManagerConfig,
} from './scrolltrigger.types';
