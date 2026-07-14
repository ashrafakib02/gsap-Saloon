/**
 * useTimelineMarkers Hook
 *
 * Provides access to timeline markers and marker-level queries.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.3: Marker data access.
 */

import { useMemo } from 'react';
import { useTimelineRegistry } from './use-timeline-registry';
import type {
  TimelineMarker,
  TimelineMarkerType,
} from '../narrative-timeline.types';
import type { SectionId } from '../narrative.types';

/**
 * Get all markers on the timeline.
 */
export function useAllTimelineMarkers(): readonly TimelineMarker[] {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getMarkers(), [registry]);
}

/**
 * Get markers filtered by type.
 */
export function useTimelineMarkersByType(
  type: TimelineMarkerType,
): readonly TimelineMarker[] {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getMarkersByType(type), [registry, type]);
}

/**
 * Get markers for a specific section.
 */
export function useTimelineMarkersForSection(
  sectionId: SectionId,
): readonly TimelineMarker[] {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getMarkersForSection(sectionId), [registry, sectionId]);
}

/**
 * Get a specific marker by its ID.
 */
export function useTimelineMarker(
  markerId: string,
): TimelineMarker | undefined {
  const registry = useTimelineRegistry();
  return useMemo(() => registry.getMarker(markerId), [registry, markerId]);
}
