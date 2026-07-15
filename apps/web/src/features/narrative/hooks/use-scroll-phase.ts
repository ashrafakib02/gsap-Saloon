/**
 * useScrollPhase — Narrative Phase Hook
 *
 * Returns the complete narrative context: current section,
 * act, stage, progress through the act, and transition state.
 *
 * This is the primary hook for systems that need to understand
 * WHERE in the narrative structure the visitor currently is.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Prologue → Act I (Invitation) → Act II (Experience)
 *  → Act III (Commitment) → Epilogue"
 *
 * Phase 5.5: React hook — no animation logic.
 *
 * @example
 * ```tsx
 * function NarrativeIndicator() {
 *   const { sectionId, stage, phase, actProgress, isFirst, isLast } = useScrollPhase();
 *
 *   return (
 *     <div>
 *       <p>Currently: {sectionId} ({stage})</p>
 *       <p>Act: {phase} — {Math.round(actProgress * 100)}%</p>
 *     </div>
 *   );
 * }
 * ```
 */

import { useScrollState } from './use-scroll-state';

import type { ScrollState } from '../scroll-state.types';
import type { SectionId, NarrativeStage } from '../narrative.types';
import type { ScrollPhase } from '../scroll-state.types';

import { NARRATIVE_REGISTRY } from '../narrative.config';

// ── Types ──────────────────────────────────────────────────

/**
 * Return type for useScrollPhase.
 */
export interface UseScrollPhaseReturn {
  /** Current section data from the narrative registry */
  readonly section: import('../narrative.types').NarrativeSection;
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
  /** Timeline-normalized progress (0→1) */
  readonly timelineNormalizedProgress: number;
  /** Whether a transition is in progress */
  readonly isTransitioning: boolean;
  /** Section progress (0→1) */
  readonly sectionProgress: number;
  /** Whether this is the first section */
  readonly isFirst: boolean;
  /** Whether this is the last section */
  readonly isLast: boolean;
}

// ── Selector ───────────────────────────────────────────────

/**
 * Extracts phase-relevant fields from the scroll state.
 */
function phaseSelector(state: ScrollState): {
  currentSectionId: SectionId;
  currentStage: NarrativeStage;
  currentPhase: ScrollPhase;
  currentActProgress: number;
  narrativeProgress: number;
  timelineNormalizedProgress: number;
  isTransitioning: boolean;
  sectionProgress: number;
} {
  return {
    currentSectionId: state.currentSectionId,
    currentStage: state.currentStage,
    currentPhase: state.currentPhase,
    currentActProgress: state.currentActProgress,
    narrativeProgress: state.narrativeProgress,
    timelineNormalizedProgress: state.timelineNormalizedProgress,
    isTransitioning: state.isTransitioning,
    sectionProgress: state.sectionProgress,
  };
}

/**
 * Equality function for the phase selector.
 */
function phaseEquality(
  prev: ReturnType<typeof phaseSelector>,
  next: ReturnType<typeof phaseSelector>,
): boolean {
  return (
    prev.currentSectionId === next.currentSectionId &&
    prev.currentStage === next.currentStage &&
    prev.currentPhase === next.currentPhase &&
    prev.currentActProgress === next.currentActProgress &&
    prev.narrativeProgress === next.narrativeProgress &&
    prev.timelineNormalizedProgress === next.timelineNormalizedProgress &&
    prev.isTransitioning === next.isTransitioning &&
    prev.sectionProgress === next.sectionProgress
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Returns the complete narrative context for the current scroll position.
 *
 * Combines scroll state with the Narrative Registry to provide
 * a complete picture of WHERE in the narrative structure the
 * visitor currently is.
 *
 * @returns Narrative phase information
 */
export function useScrollPhase(): UseScrollPhaseReturn {
  const selected = useScrollState(phaseSelector, phaseEquality);

  const sections = NARRATIVE_REGISTRY.getEnabled();
  const currentIndex = sections.findIndex(
    (s) => s.id === selected.currentSectionId,
  );

  const section = sections[currentIndex];

  return {
    section,
    sectionId: selected.currentSectionId,
    previousSectionId: currentIndex > 0
      ? sections[currentIndex - 1]?.id ?? null
      : null,
    nextSectionId: currentIndex < sections.length - 1
      ? sections[currentIndex + 1]?.id ?? null
      : null,
    stage: selected.currentStage,
    phase: selected.currentPhase,
    actProgress: selected.currentActProgress,
    narrativeProgress: selected.narrativeProgress,
    timelineNormalizedProgress: selected.timelineNormalizedProgress,
    isTransitioning: selected.isTransitioning,
    sectionProgress: selected.sectionProgress,
    isFirst: currentIndex === 0,
    isLast: currentIndex === sections.length - 1,
  };
}
