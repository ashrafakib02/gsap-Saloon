/**
 * useTimelineTracks Hook
 *
 * Provides access to timeline tracks and track-level queries.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.3: Track data access.
 */

import { useMemo } from 'react';
import { useTimelineRegistry } from './use-timeline-registry';
import type {
  TimelineTrack,
  TimelineTrackType,
  TimelinePriority,
  TimelineSegment,
} from '../narrative-timeline.types';
import type { SectionId } from '../narrative.types';

/**
 * Get all tracks on the timeline.
 */
export function useAllTimelineTracks(): readonly TimelineTrack[] {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getTracks(), [registry]);
}

/**
 * Get only enabled tracks.
 */
export function useEnabledTimelineTracks(): readonly TimelineTrack[] {
  const registry = useTimelineRegistry();
  const tracks = useMemo(() => registry.getTracks(), [registry]);
  return useMemo(() => tracks.filter((t) => t.enabled), [tracks]);
}

/**
 * Get a specific track by type.
 */
export function useTimelineTrack(
  type: TimelineTrackType,
): TimelineTrack | undefined {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getTrack(type), [registry, type]);
}

/**
 * Get tracks filtered by priority.
 */
export function useTimelineTracksByPriority(
  priority: TimelinePriority,
): readonly TimelineTrack[] {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getTracksByPriority(priority), [registry, priority]);
}

/**
 * Get segments for a specific track type.
 */
export function useTimelineSegments(
  trackType: TimelineTrackType,
): readonly TimelineSegment[] {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getSegmentsForTrack(trackType), [registry, trackType]);
}

/**
 * Get segments for a specific section.
 */
export function useTimelineSegmentsForSection(
  sectionId: SectionId,
): readonly TimelineSegment[] {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getSegmentsForSection(sectionId), [registry, sectionId]);
}
