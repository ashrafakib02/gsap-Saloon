/**
 * useTimeline Hook
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is the conductor; the content is the orchestra."
 *
 * Main timeline context hook — provides access to the
 * complete timeline definition and all derived state.
 * Pure data access — no effects, no listeners, no side effects.
 *
 * Phase 5.3: Timeline data access.
 */

import { useMemo } from 'react';
import { useTimelineRegistry } from './use-timeline-registry';
import type {
  TimelineDefinition,
  TimelineTrack,
  TimelineMarker,
  TimelineGroup,
  TimelineMetadata,
} from '../narrative-timeline.types';

export interface UseTimelineResult {
  /** The complete timeline definition */
  readonly timeline: TimelineDefinition;
  /** All tracks */
  readonly tracks: readonly TimelineTrack[];
  /** Only enabled tracks */
  readonly enabledTracks: readonly TimelineTrack[];
  /** All markers */
  readonly markers: readonly TimelineMarker[];
  /** All groups */
  readonly groups: readonly TimelineGroup[];
  /** Timeline metadata */
  readonly metadata: TimelineMetadata;
  /** Total track count */
  readonly trackCount: number;
  /** Total marker count */
  readonly markerCount: number;
  /** Total segment count */
  readonly segmentCount: number;
}

/**
 * Access the complete timeline definition and derived state.
 */
export function useTimeline(): UseTimelineResult {
  const registry = useTimelineRegistry();

  const timeline = useMemo(() => registry.getTimeline(), [registry]);
  const tracks = useMemo(() => registry.getTracks(), [registry]);
  const enabledTracks = useMemo(
    () => tracks.filter((t) => t.enabled),
    [tracks],
  );
  const markers = useMemo(() => registry.getMarkers(), [registry]);
  const groups = useMemo(() => registry.getGroups(), [registry]);
  const metadata = useMemo(() => registry.getMetadata(), [registry]);

  return useMemo(
    () => ({
      timeline,
      tracks,
      enabledTracks,
      markers,
      groups,
      metadata,
      trackCount: tracks.length,
      markerCount: markers.length,
      segmentCount: metadata.segmentCount,
    }),
    [timeline, tracks, enabledTracks, markers, groups, metadata],
  );
}
