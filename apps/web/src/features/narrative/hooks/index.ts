/**
 * Narrative Hooks — Barrel Export
 */

export { useNarrative } from './use-narrative';
export { useNarrativeRegistry } from './use-narrative-registry';
export { useNarrativeOrder } from './use-narrative-order';
export type { NarrativeOrderAPI } from './use-narrative-order';

// ── Transition Hooks ──────────────────────────────────────

export {
  useSectionTransition,
  useEntryTransition,
  useExitTransition,
} from './use-section-transition';
export type { UseSectionTransitionResult } from './use-section-transition';

export { useTransitionRegistry } from './use-transition-registry';

export {
  useTransitionsByType,
  useTransitionsByMood,
  useTransitionsByPriority,
  useEnabledTransitions,
  useActTransitions,
} from './use-transition-metadata';

export {
  useTransitionSequence,
  useTransitionDefinition,
} from './use-transition-sequence';
export type { UseTransitionSequenceResult } from './use-transition-sequence';

// ── Timeline Hooks ────────────────────────────────────────

export { useTimeline } from './use-timeline';
export type { UseTimelineResult } from './use-timeline';

export { useTimelineRegistry } from './use-timeline-registry';

export {
  useAllTimelineTracks,
  useEnabledTimelineTracks,
  useTimelineTrack,
  useTimelineTracksByPriority,
  useTimelineSegments,
  useTimelineSegmentsForSection,
} from './use-timeline-tracks';

export {
  useAllTimelineMarkers,
  useTimelineMarkersByType,
  useTimelineMarkersForSection,
  useTimelineMarker,
} from './use-timeline-markers';

export {
  useTimelineProgress,
  useActiveSegments,
  useSectionProgress,
} from './use-timeline-progress';

// ── ScrollTrigger Hooks ──────────────────────────────────

export { useScrollTriggers } from './use-scroll-triggers';
export type { UseScrollTriggersReturn } from './use-scroll-triggers';

export { useScrollTriggerRegistry } from './use-scroll-trigger-registry';
export type { UseScrollTriggerRegistryReturn } from './use-scroll-trigger-registry';

export { useScrollTriggerLifecycle } from './use-scroll-trigger-lifecycle';
export type {
  ScrollTriggerLifecycleOptions,
  UseScrollTriggerLifecycleReturn,
} from './use-scroll-trigger-lifecycle';

export { useScrollTriggerRefresh } from './use-scroll-trigger-refresh';
export type {
  ScrollTriggerRefreshOptions,
  UseScrollTriggerRefreshReturn,
} from './use-scroll-trigger-refresh';

export { useReducedMotionTrigger } from './use-reduced-motion-trigger';
export type { UseReducedMotionTriggerReturn } from './use-reduced-motion-trigger';

// ── Scroll State Hooks ────────────────────────────────────

export { useScrollState } from './use-scroll-state';
export type { UseScrollStateReturn } from './use-scroll-state';

export { useCurrentSection } from './use-current-section';
export type { UseCurrentSectionReturn } from './use-current-section';

export { useScrollProgress } from './use-scroll-progress';
export type { UseScrollProgressReturn } from './use-scroll-progress';

export { useScrollDirection } from './use-scroll-direction';
export type { UseScrollDirectionReturn } from './use-scroll-direction';

export { useScrollVelocity } from './use-scroll-velocity';
export type { UseScrollVelocityReturn } from './use-scroll-velocity';

export { useScrollBreakpoint } from './use-scroll-breakpoint';
export type { UseScrollBreakpointReturn } from './use-scroll-breakpoint';

export { useScrollPhase } from './use-scroll-phase';
export type { UseScrollPhaseReturn } from './use-scroll-phase';

// ── Progressive Reveal Hooks ──────────────────────────────

export { useProgressiveReveal } from './use-progressive-reveal';
export type { UseProgressiveRevealReturn } from './use-progressive-reveal';

export { useRevealGroup } from './use-reveal-group';

export { useRevealItem } from './use-reveal-item';

export { useRevealProgress } from './use-reveal-progress';
export type { UseRevealProgressReturn } from './use-reveal-progress';

export { useRevealSequence } from './use-reveal-sequence';

export { useRevealVisibility } from './use-reveal-visibility';
