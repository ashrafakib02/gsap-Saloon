/**
 * Narrative Timeline Types — Cinematic Editing Timeline Model
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Vertical scrolling is not a content delivery mechanism.
 *  It is a storytelling device."
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is the conductor; the content is the orchestra."
 *
 * This module defines the complete timeline type system — a
 * cinematic editing timeline that future animation engines
 * (GSAP, ScrollTrigger, React Three Fiber, Lenis, Web Audio)
 * will consume for synchronized multi-track playback.
 *
 * The timeline does NOT animate. It describes WHAT should
 * happen WHERE and WHEN, leaving the HOW to engine-specific
 * adapters in later phases.
 *
 * Architecture:
 *   TimelineTrack (parallel tracks) → TimelineSegment (continuous)
 *   → TimelineKeyframe (parameter points) → TimelineCue (events)
 *   → TimelineRegistry (all data) → hooks consume
 *
 * Phase 5.3: Timeline structure — types only, no animation.
 */

import type { SectionId, NarrativeStage } from './narrative.types';

// ── Timeline Track Type ────────────────────────────────────

/**
 * The domain a track controls.
 *
 * Each track is a parallel stream of activity on the timeline.
 * Multiple tracks play simultaneously, synchronized by scroll position.
 *
 * From DESIGN_SYSTEM §14:
 * "The sum of all animations should feel like one coherent breath."
 */
export const TIMELINE_TRACK_TYPES = [
  /** Narrative progression — section reveals, breathing, pacing */
  'narrative',
  /** UI elements — nav, booking overlay, modal transitions */
  'ui',
  /** Camera position and rotation — R3F camera animation */
  'camera',
  /** Scene lighting — intensity, color temperature, direction */
  'lighting',
  /** Environment — fog, atmosphere, ambient effects */
  'environment',
  /** 3D elements — particle systems, volumetric effects */
  'three-d',
  /** Particle effects — atmospheric particles, light rays */
  'particle',
  /** Sound design — ambient audio, transition cues */
  'audio',
  /** Analytics — scroll depth tracking, section timing */
  'analytics',
  /** Accessibility — reduced motion orchestration */
  'accessibility',
  /** Asset preloading — progressive image/script loading */
  'preload',
] as const;

/** Type-safe union of timeline track types. */
export type TimelineTrackType = (typeof TIMELINE_TRACK_TYPES)[number];

// ── Timeline State ─────────────────────────────────────────

/**
 * The current lifecycle state of the timeline.
 *
 * Models the complete lifecycle from initialization through
 * playback to completion.
 */
export const TIMELINE_STATES = [
  /** Timeline not yet initialized */
  'uninitialized',
  /** Timeline registered, waiting for scroll input */
  'ready',
  /** Timeline actively tracking scroll position */
  'playing',
  /** Timeline paused — holds current position */
  'paused',
  /** Timeline at the end — all segments complete */
  'completed',
  /** Timeline reset to beginning */
  'reset',
] as const;

/** Type-safe union of timeline states. */
export type TimelineState = (typeof TIMELINE_STATES)[number];

// ── Timeline Priority ──────────────────────────────────────

/**
 * Execution priority for timeline tracks and segments.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Above-fold content receives critical priority.
 *  Below-fold content loads during idle."
 */
export const TIMELINE_PRIORITIES = [
  /** Must execute — narrative track, hero reveal */
  'critical',
  /** Should execute — UI transitions, above-fold tracks */
  'high',
  /** Execute when possible — standard segments */
  'normal',
  /** Execute if resources permit — decorative, below-fold */
  'low',
  /** Future use — track exists but not yet activated */
  'deferred',
] as const;

/** Type-safe union of timeline priorities. */
export type TimelinePriority = (typeof TIMELINE_PRIORITIES)[number];

// ── Timeline Playback Mode ─────────────────────────────────

/**
 * How a track or segment responds to scroll input.
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "Scroll-linked, not time-linked."
 */
export const TIMELINE_PLAYBACK_MODES = [
  /** Progress directly tied to scroll position (0→1 maps to section entry→exit) */
  'scroll-linked',
  /** Fires once when scroll crosses a threshold */
  'trigger',
  /** Time-based playback — only for hero warm reveal */
  'time-based',
  /** Programmatic — controlled by code, not scroll */
  'programmatic',
  /** Continuous — always running regardless of scroll */
  'continuous',
] as const;

/** Type-safe union of timeline playback modes. */
export type TimelinePlaybackMode = (typeof TIMELINE_PLAYBACK_MODES)[number];

// ── Timeline Direction ─────────────────────────────────────

/**
 * Scroll direction semantics.
 *
 * From DESIGN_SYSTEM §14 Law 5:
 * "When the visitor scrolls backward, previously-revealed
 *  content remains revealed."
 */
export const TIMELINE_DIRECTIONS = [
  /** Forward — normal scroll-down narrative progression */
  'forward',
  /** Backward — scroll-up, content stays revealed */
  'backward',
  /** Bidirectional — responds to both directions equally */
  'bidirectional',
] as const;

/** Type-safe union of timeline directions. */
export type TimelineDirection = (typeof TIMELINE_DIRECTIONS)[number];

// ── Timeline Duration Category ─────────────────────────────

/**
 * Pacing category for segments and groups.
 *
 * From PRODUCT_VISION §Scroll Pacing Rhythm:
 * "Slow opening. Gradual build. Peak density. Decisive close."
 *
 * From DESIGN_SYSTEM §14 Motion Constraints:
 * "Maximum reveal duration: 600ms (except hero and confirmation)"
 */
export const TIMELINE_DURATION_CATEGORIES = [
  /** Extended — hero reveal (1200-1500ms), closing dissolve (2000-2500ms) */
  'extended',
  /** Standard — content reveals (400-600ms) */
  'standard',
  /** Brief — breathing spaces, quick transitions (200-400ms) */
  'brief',
  /** Instant — zero duration, structural */
  'instant',
] as const;

/** Type-safe union of timeline duration categories. */
export type TimelineDurationCategory = (typeof TIMELINE_DURATION_CATEGORIES)[number];

// ── Timeline Marker Type ───────────────────────────────────

/**
 * Semantic meaning of a timeline marker.
 *
 * Markers are reference points on the timeline that tracks
 * and segments use for alignment and synchronization.
 */
export const TIMELINE_MARKER_TYPES = [
  /** Top edge of a section enters the viewport */
  'section-start',
  /** Section center aligns with viewport center */
  'section-center',
  /** Bottom edge of a section reaches viewport top */
  'section-end',
  /** Start of a narrative chapter (within an act) */
  'chapter-start',
  /** End of a narrative chapter */
  'chapter-end',
  /** Start of a dramatic act */
  'act-start',
  /** End of a dramatic act */
  'act-end',
  /** A checkpoint between critical moments */
  'checkpoint',
  /** A breathing space pause point */
  'breathing-point',
  /** Trigger point for asset preloading */
  'preload-point',
  /** Cue for camera transition */
  'camera-cue',
  /** Cue for analytics event */
  'analytics-cue',
] as const;

/** Type-safe union of timeline marker types. */
export type TimelineMarkerType = (typeof TIMELINE_MARKER_TYPES)[number];

// ── Timeline Offset ────────────────────────────────────────

/**
 * A temporal or spatial offset on the timeline.
 *
 * Offsets can be absolute (scroll percentage) or relative
 * (offset from a reference marker).
 */
export const TIMELINE_OFFSET_UNITS = [
  /** Scroll progress percentage (0 = top, 100 = bottom) */
  'percent',
  /** Pixel offset from a reference point */
  'pixels',
  /** Relative offset from a named marker (e.g., "section-start +10%") */
  'marker-relative',
  /** Normalized 0-1 progress within a specific section */
  'section-progress',
] as const;

/** Type-safe union of timeline offset units. */
export type TimelineOffsetUnit = (typeof TIMELINE_OFFSET_UNITS)[number];

// ── Timeline Synchronization ───────────────────────────────

/**
 * How multiple tracks align with each other.
 *
 * From PRODUCT_VISION §P6: Pacing as Rhythm:
 * "The sum of all animations should feel like one coherent breath."
 */
export const TIMELINE_SYNC_MODES = [
  /** All tracks share the same scroll-driven progress */
  'global-progress',
  /** Track aligns to the narrative track's progress */
  'narrative-locked',
  /** Track aligns to a specific marker */
  'marker-locked',
  /** Track has independent timing, not synchronized */
  'independent',
  /** Track triggers at a specific scroll threshold */
  'threshold-triggered',
] as const;

/** Type-safe union of timeline synchronization modes. */
export type TimelineSyncMode = (typeof TIMELINE_SYNC_MODES)[number];

// ── Keyframe Interpolation ─────────────────────────────────

/**
 * How values interpolate between keyframes.
 *
 * From DESIGN_SYSTEM §14:
 * "Entry motions use ease-out. Exit motions use ease-in.
 *  State changes use ease-in-out."
 */
export const KEYFRAME_INTERPOLATIONS = [
  /** Linear interpolation — constant rate */
  'linear',
  /** Ease-out — decelerating (entries) */
  'ease-out',
  /** Ease-in — accelerating (exits) */
  'ease-in',
  /** Ease-in-out — smooth acceleration and deceleration */
  'ease-in-out',
  /** Step — instant jump, no interpolation */
  'step',
  /** Custom easing — references a named easing curve */
  'custom',
] as const;

/** Type-safe union of keyframe interpolation modes. */
export type KeyframeInterpolation = (typeof KEYFRAME_INTERPOLATIONS)[number];

// ── Timeline Range ─────────────────────────────────────────

/**
 * A normalized range on the timeline (0 to 1).
 *
 * Used to define where segments, keyframes, and cues
 * sit within the overall scroll progress.
 */
export interface TimelineRange {
  /** Start position (0 = top of page, 1 = bottom) */
  readonly start: number;
  /** End position (must be > start, <= 1) */
  readonly end: number;
}

// ── Timeline Offset ────────────────────────────────────────

/**
 * An offset from a reference point.
 *
 * Used for positioning keyframes and cues relative
 * to markers rather than absolute positions.
 */
export interface TimelineOffset {
  /** The unit of measurement */
  readonly unit: TimelineOffsetUnit;
  /** Numeric value in the specified unit */
  readonly value: number;
  /** Reference marker ID (required for 'marker-relative' unit) */
  readonly referenceMarkerId?: string;
  /** Reference section ID (required for 'section-progress' unit) */
  readonly referenceSectionId?: SectionId;
}

// ── Timeline Label ─────────────────────────────────────────

/**
 * A human-readable label for a timeline position or range.
 *
 * Used for debugging, analytics, and developer tools.
 */
export interface TimelineLabel {
  /** Unique label identifier */
  readonly id: string;
  /** Human-readable display text */
  readonly text: string;
  /** The position this label marks (optional — labels can be range-based) */
  readonly position?: number;
  /** The range this label covers (optional) */
  readonly range?: TimelineRange;
  /** The track this label belongs to (undefined = global label) */
  readonly trackId?: string;
}

// ── Timeline Keyframe ──────────────────────────────────────

/**
 * A single parameter value at a specific timeline position.
 *
 * Keyframes define the exact state of an animated property
 * at a specific scroll position. Between keyframes, the
 * engine interpolates values using the specified easing.
 *
 * Keyframes are pure data — they describe WHAT value at
 * WHAT position, not HOW to apply it.
 */
export interface TimelineKeyframe {
  /** Unique keyframe identifier */
  readonly id: string;
  /** The timeline position (0-1 scroll progress) */
  readonly position: number;
  /** Target property name (e.g., "opacity", "translateY", "scale") */
  readonly property: string;
  /** The value at this position (number, string, or array for multi-dimensional) */
  readonly value: number | string | readonly number[];
  /** Interpolation mode from this keyframe to the next */
  readonly interpolation: KeyframeInterpolation;
  /** Optional easing curve name (used when interpolation is 'custom') */
  readonly easingName?: string;
}

// ── Timeline Cue ───────────────────────────────────────────

/**
 * An event that fires at a specific timeline position.
 *
 * Cues are discrete events — they trigger actions when the
 * scroll position crosses their threshold. Unlike keyframes
 * (which define continuous values), cues are point events.
 *
 * Cues fire once per scroll-direction crossing.
 */
export interface TimelineCue {
  /** Unique cue identifier */
  readonly id: string;
  /** The position where this cue fires (0-1 scroll progress) */
  readonly position: number;
  /** The track this cue belongs to */
  readonly trackType: TimelineTrackType;
  /** Semantic name for the cue action */
  readonly action: string;
  /** Priority determines execution order when multiple cues fire */
  readonly priority: TimelinePriority;
  /** Whether this cue fires only once, or on every crossing */
  readonly once: boolean;
  /** Payload data passed to the cue handler */
  readonly payload?: Record<string, unknown>;
}

// ── Timeline Segment ───────────────────────────────────────

/**
 * A continuous portion of a timeline track.
 *
 * Segments are the building blocks of the timeline. Each
 * segment defines a scroll range where a specific track
 * is active, with associated keyframes and cues.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Every scroll position should correspond to exactly one idea."
 */
export interface TimelineSegment {
  /** Unique segment identifier */
  readonly id: string;
  /** The track this segment belongs to */
  readonly trackType: TimelineTrackType;
  /** The section this segment covers */
  readonly sectionId: SectionId;
  /** Scroll range where this segment is active (0-1) */
  readonly range: TimelineRange;
  /** The narrative stage this segment belongs to */
  readonly stage: NarrativeStage;
  /** Playback mode for this segment */
  readonly playbackMode: TimelinePlaybackMode;
  /** Duration category for timing reference */
  readonly durationCategory: TimelineDurationCategory;
  /** Priority level */
  readonly priority: TimelinePriority;
  /** Keyframes within this segment (ordered by position) */
  readonly keyframes: readonly TimelineKeyframe[];
  /** Cues within this segment (ordered by position) */
  readonly cues: readonly TimelineCue[];
  /** Whether this segment is currently enabled */
  readonly enabled: boolean;
  /** Reduced motion behavior — keyframes replaced or simplified */
  readonly reducedMotionEnabled: boolean;
}

// ── Timeline Marker ────────────────────────────────────────

/**
 * A reference point on the timeline.
 *
 * Markers define semantic positions that tracks and segments
 * use for alignment, synchronization, and triggering.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Every scroll position should correspond to exactly one idea."
 */
export interface TimelineMarker {
  /** Unique marker identifier */
  readonly id: string;
  /** The type of marker */
  readonly type: TimelineMarkerType;
  /** The position on the global timeline (0-1 scroll progress) */
  readonly position: number;
  /** The section this marker is associated with */
  readonly sectionId: SectionId;
  /** Human-readable label for debugging */
  readonly label: string;
  /** Tracks that listen to this marker (empty = all tracks) */
  readonly listenerTrackTypes: readonly TimelineTrackType[];
}

// ── Timeline Track ─────────────────────────────────────────

/**
 * A parallel stream of activity on the timeline.
 *
 * Tracks are independent channels that play simultaneously.
 * The narrative track is the primary track — all other tracks
 * synchronize to it.
 *
 * Each track contains segments that define what happens
 * at different scroll positions.
 */
export interface TimelineTrack {
  /** Unique track identifier */
  readonly id: string;
  /** The domain this track controls */
  readonly type: TimelineTrackType;
  /** Human-readable track name */
  readonly label: string;
  /** Synchronization mode with other tracks */
  readonly syncMode: TimelineSyncMode;
  /** Priority level for resource allocation */
  readonly priority: TimelinePriority;
  /** Whether this track is currently enabled */
  readonly enabled: boolean;
  /** Whether this track is the primary reference for others */
  readonly isPrimary: boolean;
  /** The narrative stage range this track covers (empty = entire timeline) */
  readonly stageRange: readonly NarrativeStage[];
  /** Segments on this track (ordered by position) */
  readonly segments: readonly TimelineSegment[];
}

// ── Timeline Group ─────────────────────────────────────────

/**
 * A logical grouping of related tracks.
 *
 * Groups organize tracks by their domain and help with
 * resource management (e.g., disabling all 3D tracks
 * on mobile).
 */
export interface TimelineGroup {
  /** Unique group identifier */
  readonly id: string;
  /** Human-readable group name */
  readonly label: string;
  /** Track types included in this group */
  readonly trackTypes: readonly TimelineTrackType[];
  /** Whether this group is enabled */
  readonly enabled: boolean;
  /** Resource budget for this group (e.g., GPU budget for 3D tracks) */
  readonly resourceBudget: 'none' | 'minimal' | 'standard' | 'generous';
  /** Feature flag key that controls this group */
  readonly featureFlag?: string;
}

// ── Timeline Progress ──────────────────────────────────────

/**
 * The current state of progress through the timeline.
 *
 * This is NOT the implementation of scroll tracking.
 * It is the data model that scroll tracking will populate.
 */
export interface TimelineProgress {
  /** Overall scroll progress (0 = top, 1 = bottom) */
  readonly overall: number;
  /** Progress within the current section (0-1) */
  readonly currentSection: number;
  /** The currently active section */
  readonly currentSectionId: SectionId;
  /** The current narrative stage */
  readonly currentStage: NarrativeStage;
  /** Scroll direction */
  readonly direction: TimelineDirection;
  /** Whether the page is currently scrolling */
  readonly isScrolling: boolean;
  /** Timestamp of last progress update */
  readonly lastUpdatedAt: number;
}

// ── Timeline Metadata ──────────────────────────────────────

/**
 * Complete metadata for a timeline instance.
 *
 * Combines all timeline configuration into a single
 * immutable record.
 */
export interface TimelineMetadata {
  /** Unique timeline identifier */
  readonly id: string;
  /** Human-readable timeline name */
  readonly name: string;
  /** Total scroll range (0 to totalHeight in pixels) */
  readonly totalScrollHeight: number;
  /** Total number of sections */
  readonly sectionCount: number;
  /** Total number of tracks */
  readonly trackCount: number;
  /** Total number of markers */
  readonly markerCount: number;
  /** Total number of segments */
  readonly segmentCount: number;
  /** Total number of keyframes */
  readonly keyframeCount: number;
  /** Total number of cues */
  readonly cueCount: number;
  /** The narrative stages covered by this timeline */
  readonly stages: readonly NarrativeStage[];
  /** Whether reduced motion mode is active */
  readonly reducedMotionActive: boolean;
}

// ── Timeline Definition ────────────────────────────────────

/**
 * A complete timeline record containing all data.
 *
 * This is the root object returned by the registry.
 * It holds tracks, markers, groups, and metadata.
 */
export interface TimelineDefinition {
  /** Timeline metadata */
  readonly metadata: TimelineMetadata;
  /** All tracks on the timeline (ordered by priority) */
  readonly tracks: readonly TimelineTrack[];
  /** All markers on the timeline (ordered by position) */
  readonly markers: readonly TimelineMarker[];
  /** Track groups for resource management */
  readonly groups: readonly TimelineGroup[];
}

// ── Timeline Registry ──────────────────────────────────────

/**
 * The central timeline registry interface.
 *
 * Created by createTimelineRegistry() — immutable after construction.
 * Consumed by useTimelineRegistry() hook.
 *
 * From TECHNICAL_ARCHITECTURE §Registry Pattern:
 * "Factory functions that return typed registry objects."
 */
export interface TimelineRegistry {
  /** Get the complete timeline definition */
  getTimeline(): TimelineDefinition;
  /** Get a track by its type */
  getTrack(type: TimelineTrackType): TimelineTrack | undefined;
  /** Get all tracks */
  getTracks(): readonly TimelineTrack[];
  /** Get tracks filtered by priority */
  getTracksByPriority(priority: TimelinePriority): readonly TimelineTrack[];
  /** Get a marker by its ID */
  getMarker(id: string): TimelineMarker | undefined;
  /** Get all markers */
  getMarkers(): readonly TimelineMarker[];
  /** Get markers filtered by type */
  getMarkersByType(type: TimelineMarkerType): readonly TimelineMarker[];
  /** Get markers for a specific section */
  getMarkersForSection(sectionId: SectionId): readonly TimelineMarker[];
  /** Get a segment by its ID */
  getSegment(id: string): TimelineSegment | undefined;
  /** Get segments for a specific track type */
  getSegmentsForTrack(trackType: TimelineTrackType): readonly TimelineSegment[];
  /** Get segments for a specific section */
  getSegmentsForSection(sectionId: SectionId): readonly TimelineSegment[];
  /** Get segments that overlap a given progress range */
  getSegmentsInRange(range: TimelineRange): readonly TimelineSegment[];
  /** Get a group by its ID */
  getGroup(id: string): TimelineGroup | undefined;
  /** Get all groups */
  getGroups(): readonly TimelineGroup[];
  /** Get the timeline metadata */
  getMetadata(): TimelineMetadata;
  /** Check if a track type exists */
  hasTrack(type: TimelineTrackType): boolean;
  /** Check if a marker ID exists */
  hasMarker(id: string): boolean;
  /** Total track count */
  trackCount(): number;
  /** Total marker count */
  markerCount(): number;
  /** Total segment count */
  segmentCount(): number;
}

// ── Timeline Context ───────────────────────────────────────

/**
 * The value provided by TimelineProvider (future phase).
 *
 * Contains the timeline registry and derived state.
 */
export interface TimelineContextValue {
  /** The timeline registry — immutable, typed */
  readonly registry: TimelineRegistry;
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
  /** Total counts */
  readonly trackCount: number;
  readonly markerCount: number;
  readonly segmentCount: number;
}
