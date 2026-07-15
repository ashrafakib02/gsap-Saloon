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
 * Phase 5.5: Centralized scroll state.
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

// ── Scroll State Hooks ────────────────────────────────────

export { useScrollState } from './hooks/use-scroll-state';
export type { UseScrollStateReturn } from './hooks/use-scroll-state';

export { useCurrentSection } from './hooks/use-current-section';
export type { UseCurrentSectionReturn } from './hooks/use-current-section';

export { useScrollProgress } from './hooks/use-scroll-progress';
export type { UseScrollProgressReturn } from './hooks/use-scroll-progress';

export { useScrollDirection } from './hooks/use-scroll-direction';
export type { UseScrollDirectionReturn } from './hooks/use-scroll-direction';

export { useScrollVelocity } from './hooks/use-scroll-velocity';
export type { UseScrollVelocityReturn } from './hooks/use-scroll-velocity';

export { useScrollBreakpoint } from './hooks/use-scroll-breakpoint';
export type { UseScrollBreakpointReturn } from './hooks/use-scroll-breakpoint';

export { useScrollPhase } from './hooks/use-scroll-phase';
export type { UseScrollPhaseReturn } from './hooks/use-scroll-phase';

// ── Progressive Reveal Hooks ──────────────────────────────

export { useProgressiveReveal } from './hooks/use-progressive-reveal';
export type { UseProgressiveRevealReturn } from './hooks/use-progressive-reveal';

export { useRevealGroup } from './hooks/use-reveal-group';
export { useRevealItem } from './hooks/use-reveal-item';
export { useRevealSequence } from './hooks/use-reveal-sequence';
export { useRevealVisibility } from './hooks/use-reveal-visibility';

export { useRevealProgress } from './hooks/use-reveal-progress';
export type { UseRevealProgressReturn } from './hooks/use-reveal-progress';

// ── Registries ─────────────────────────────────────────────

export { NARRATIVE_REGISTRY } from './narrative.config';
export { TRANSITION_REGISTRY } from './narrative-transitions.config';
export { TIMELINE_REGISTRY } from './narrative-timeline.config';

// ── Scroll State Manager ──────────────────────────────────

export { scrollStateManager } from './scroll-state-manager';

// ── Progressive Reveal Manager ────────────────────────────

export {
  progressiveRevealManager,
  isDebugMode as isRevealDebugMode,
} from './progressive-reveal-manager';

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

// ── Scroll State Constants ────────────────────────────────

export {
  SCROLL_DIRECTIONS,
  SCROLL_BREAKPOINTS,
  SCROLL_PHASES,
  DIRECTION_DESCRIPTIONS as SCROLL_DIRECTION_DESCRIPTIONS,
  BREAKPOINT_DESCRIPTIONS as SCROLL_BREAKPOINT_DESCRIPTIONS,
  PHASE_DESCRIPTIONS,
  DEFAULT_SECTION_ID,
  DEFAULT_SCROLL_STATE_CONFIG,
  DEFAULT_SCROLL_STATE,
  VELOCITY_THRESHOLDS,
  STATE_DESCRIPTIONS as SCROLL_STATE_DESCRIPTIONS,
} from './scroll-state.constants';

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

// ── Scroll State Types ────────────────────────────────────

export type {
  ScrollDirection,
  ScrollPhase,
  ScrollBreakpoint,
  ScrollState,
  CurrentSectionInfo,
  ScrollProgressInfo,
  ScrollDirectionInfo,
  ScrollVelocityInfo,
  ScrollBreakpointInfo,
  ScrollPhaseInfo,
  ScrollStateSelector,
  ScrollStateEquality,
  ScrollStateManager,
  ScrollStateConfig,
} from './scroll-state.types';

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

// ── Progressive Reveal Constants ──────────────────────────

export {
  REVEAL_STRATEGIES,
  REVEAL_STATES,
  REVEAL_VISIBILITY,
  REVEAL_PRIORITIES,
  REVEAL_TRIGGERS,
  REVEAL_RESET_POLICIES,
  REVEAL_STRATEGY_DESCRIPTIONS,
  REVEAL_STATE_DESCRIPTIONS,
  REVEAL_VISIBILITY_DESCRIPTIONS,
  REVEAL_PRIORITY_DESCRIPTIONS,
  REVEAL_TRIGGER_DESCRIPTIONS,
  REVEAL_RESET_POLICY_DESCRIPTIONS,
  REVEAL_PRIORITY_ORDER,
  DEFAULT_REVEAL_CONFIG,
  DEFAULT_REVEAL_SNAPSHOT,
} from './progressive-reveal.constants';

// ── Progressive Reveal Types ──────────────────────────────

export type {
  RevealStrategy,
  RevealState,
  RevealVisibility,
  RevealPriority,
  RevealTrigger,
  RevealResetPolicy,
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
  ProgressiveRevealSnapshot,
  ProgressiveRevealRegistry,
  ProgressiveRevealManager,
  ProgressiveRevealConfig,
  RevealSelector,
  RevealEquality,
  RevealCallback,
  RevealUnsubscribe,
} from './progressive-reveal.types';
