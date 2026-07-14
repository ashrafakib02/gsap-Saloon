/**
 * useTimelineProgress Hook
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "Scroll-linked, not time-linked."
 *
 * Provides timeline progress data and progress-related queries.
 * Pure data access — no scroll listeners, no effects, no side effects.
 * The actual scroll tracking is implemented in Phase 9.
 *
 * Phase 5.3: Progress data model only.
 */

import { useMemo } from 'react';
import { useTimelineRegistry } from './use-timeline-registry';
import type {
  TimelineProgress,
  TimelineRange,
  TimelineSegment,
} from '../narrative-timeline.types';
import type { SectionId } from '../narrative.types';

/**
 * The default initial progress state.
 * Scroll engines will update this at runtime.
 */
const INITIAL_PROGRESS: TimelineProgress = {
  overall: 0,
  currentSection: 0,
  currentSectionId: 'threshold',
  currentStage: 'prologue',
  direction: 'forward',
  isScrolling: false,
  lastUpdatedAt: 0,
};

/**
 * Get the current timeline progress.
 *
 * Returns static initial progress in Phase 5.3.
 * Phase 9 (Scroll Engine) will provide live progress updates.
 */
export function useTimelineProgress(): TimelineProgress {
  return INITIAL_PROGRESS;
}

/**
 * Determine which segments are active for a given progress value.
 *
 * @param progress - Current scroll progress (0-1)
 * @returns Array of segments whose range contains the progress
 */
export function useActiveSegments(
  progress: number,
): readonly TimelineSegment[] {
  const registry = useTimelineRegistry();

  return useMemo(() => {
    const range: TimelineRange = { start: progress, end: progress };
    return registry.getSegmentsInRange(range);
  }, [registry, progress]);
}

/**
 * Get the progress within a specific section's scroll range.
 *
 * @param sectionId - The section to check
 * @param overallProgress - Current overall scroll progress (0-1)
 * @returns Progress within the section (0-1), or 0 if not in range
 */
export function useSectionProgress(
  sectionId: SectionId,
  overallProgress: number,
): number {
  const registry = useTimelineRegistry();

  return useMemo(() => {
    const segments = registry.getSegmentsForTrack('narrative');
    const segment = segments.find((s) => s.sectionId === sectionId);
    if (!segment) return 0;

    const { start, end } = segment.range;
    if (overallProgress < start) return 0;
    if (overallProgress > end) return 1;

    return (overallProgress - start) / (end - start);
  }, [registry, sectionId, overallProgress]);
}
