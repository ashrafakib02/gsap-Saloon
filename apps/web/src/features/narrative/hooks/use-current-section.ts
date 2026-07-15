/**
 * useCurrentSection — Current Section Navigation Hook
 *
 * Returns enriched information about the current section
 * including navigation context (previous, next), narrative
 * stage, act progress, and section positioning.
 *
 * Consumes the centralized scroll state and enriches it with
 * data from the Narrative Registry.
 *
 * Phase 5.5: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function SectionNav() {
 *   const { current, isFirst, isLast, stage, actProgress } = useCurrentSection();
 *
 *   return (
 *     <nav>
 *       <h2>{current.title}</h2>
 *       <p>Stage: {stage} | Act progress: {Math.round(actProgress * 100)}%</p>
 *       {!isFirst && <button>Previous: {current.previous?.title}</button>}
 *       {!isLast && <button>Next: {current.next?.title}</button>}
 *     </nav>
 *   );
 * }
 * ```
 */

import { useScrollState } from './use-scroll-state';

import type {
  ScrollState,
} from '../scroll-state.types';

import { NARRATIVE_REGISTRY } from '../narrative.config';

import type { SectionId, NarrativeStage } from '../narrative.types';
import type { ScrollPhase } from '../scroll-state.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useCurrentSection.
 */
export interface UseCurrentSectionReturn {
  /** Current section data from the narrative registry */
  readonly current: import('../narrative.types').NarrativeSection;
  /** Previous section data (null if at first section) */
  readonly previous: import('../narrative.types').NarrativeSection | null;
  /** Next section data (null if at last section) */
  readonly next: import('../narrative.types').NarrativeSection | null;
  /** Current section ID */
  readonly sectionId: SectionId;
  /** Previous section ID */
  readonly previousSectionId: SectionId | null;
  /** Next section ID */
  readonly nextSectionId: SectionId | null;
  /** The current narrative stage */
  readonly stage: NarrativeStage;
  /** The current scroll phase */
  readonly phase: ScrollPhase;
  /** Progress through the current act (0→1) */
  readonly actProgress: number;
  /** Overall narrative progress (0→1) */
  readonly narrativeProgress: number;
  /** Section progress (0→1) */
  readonly sectionProgress: number;
  /** Whether this is the first section */
  readonly isFirst: boolean;
  /** Whether this is the last section */
  readonly isLast: boolean;
  /** Index of the current section (0-based) */
  readonly index: number;
}

// ── Selector ───────────────────────────────────────────────

/**
 * Extracts section-navigation-relevant state from the scroll state.
 * This selector minimizes re-renders by only tracking section-related fields.
 */
function sectionSelector(state: ScrollState): {
  currentSectionId: SectionId;
  previousSectionId: SectionId | null;
  nextSectionId: SectionId | null;
  currentStage: NarrativeStage;
  currentPhase: ScrollPhase;
  sectionProgress: number;
  pageProgress: number;
} {
  return {
    currentSectionId: state.currentSectionId,
    previousSectionId: state.previousSectionId,
    nextSectionId: state.nextSectionId,
    currentStage: state.currentStage,
    currentPhase: state.currentPhase,
    sectionProgress: state.sectionProgress,
    pageProgress: state.pageProgress,
  };
}

/**
 * Equality function for the section selector.
 * Compares each field individually for precise change detection.
 */
function sectionEquality(
  prev: ReturnType<typeof sectionSelector>,
  next: ReturnType<typeof sectionSelector>,
): boolean {
  return (
    prev.currentSectionId === next.currentSectionId &&
    prev.previousSectionId === next.previousSectionId &&
    prev.nextSectionId === next.nextSectionId &&
    prev.currentStage === next.currentStage &&
    prev.currentPhase === next.currentPhase &&
    prev.sectionProgress === next.sectionProgress &&
    prev.pageProgress === next.pageProgress
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns enriched information about the current section.
 *
 * Combines scroll state with the Narrative Registry to provide
 * a complete picture of the current section's context in the
 * three-act narrative structure.
 *
 * @returns Current section info with navigation and narrative context
 */
export function useCurrentSection(): UseCurrentSectionReturn {
  const selected = useScrollState(sectionSelector, sectionEquality);

  const sections = NARRATIVE_REGISTRY.getEnabled();
  const currentIndex = sections.findIndex(
    (s) => s.id === selected.currentSectionId,
  );

  const current = sections[currentIndex];
  const previous = selected.previousSectionId
    ? NARRATIVE_REGISTRY.get(selected.previousSectionId) ?? null
    : null;
  const next = selected.nextSectionId
    ? NARRATIVE_REGISTRY.get(selected.nextSectionId) ?? null
    : null;

  return {
    current,
    previous,
    next,
    sectionId: selected.currentSectionId,
    previousSectionId: selected.previousSectionId,
    nextSectionId: selected.nextSectionId,
    stage: selected.currentStage,
    phase: selected.currentPhase,
    actProgress: current?.stage === 'prologue' || current?.stage === 'epilogue'
      ? 1
      : selected.pageProgress,
    narrativeProgress: selected.pageProgress,
    sectionProgress: selected.sectionProgress,
    isFirst: currentIndex === 0,
    isLast: currentIndex === sections.length - 1,
    index: currentIndex,
  };
}
