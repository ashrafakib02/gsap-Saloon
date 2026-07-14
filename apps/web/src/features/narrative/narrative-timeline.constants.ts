/**
 * Narrative Timeline Constants — Centralized Timeline Identifiers
 *
 * From DESIGN_SYSTEM §Architecture:
 * "No magic strings. All identifiers are constants."
 *
 * This module re-exports timeline type unions and provides
 * curated constant arrays used throughout the timeline system.
 *
 * Phase 5.3: Constants only — no runtime logic.
 */

import type {
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
} from './narrative-timeline.types';

import {
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
} from './narrative-timeline.types';

// ── Re-exports ─────────────────────────────────────────────

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
};

// ── Track Type Descriptions ────────────────────────────────

/**
 * Human-readable descriptions for each timeline track type.
 * Used in developer tools and debugging.
 */
export const TRACK_TYPE_DESCRIPTIONS: Record<TimelineTrackType, string> = {
  narrative: 'Section reveals, breathing, and pacing — the primary reference track',
  ui: 'Navigation, booking overlay, and modal transitions',
  camera: 'React Three Fiber camera position and rotation',
  lighting: 'Scene lighting intensity, color temperature, and direction',
  environment: 'Fog, atmosphere, and ambient effects',
  'three-d': 'Particle systems, volumetric effects, and 3D elements',
  particle: 'Atmospheric particles and light rays',
  audio: 'Ambient audio and transition sound cues',
  analytics: 'Scroll depth tracking and section timing events',
  accessibility: 'Reduced motion orchestration and ARIA live regions',
  preload: 'Progressive image and script loading triggers',
};

// ── State Descriptions ─────────────────────────────────────

/**
 * Human-readable descriptions for each timeline state.
 */
export const STATE_DESCRIPTIONS: Record<TimelineState, string> = {
  uninitialized: 'Timeline not yet registered — awaiting initialization',
  ready: 'Timeline registered and waiting for scroll input',
  playing: 'Timeline actively tracking scroll position',
  paused: 'Timeline paused — holds current scroll position',
  completed: 'Timeline at the end — all segments complete',
  reset: 'Timeline reset to beginning',
};

// ── Priority Descriptions ──────────────────────────────────

/**
 * Human-readable descriptions for each priority level.
 */
export const TIMELINE_PRIORITY_DESCRIPTIONS: Record<TimelinePriority, string> = {
  critical: 'Must execute — narrative track, hero reveal, critical rendering path',
  high: 'Should execute — UI transitions, above-fold tracks',
  normal: 'Execute when possible — standard segments',
  low: 'Execute if resources permit — decorative, below-fold',
  deferred: 'Future use — track exists but not yet activated',
};

// ── Playback Mode Descriptions ─────────────────────────────

/**
 * Human-readable descriptions for each playback mode.
 */
export const PLAYBACK_MODE_DESCRIPTIONS: Record<TimelinePlaybackMode, string> = {
  'scroll-linked': 'Progress directly tied to scroll position',
  trigger: 'Fires once when scroll crosses a threshold',
  'time-based': 'Time-based playback — hero warm reveal only',
  programmatic: 'Controlled by code, not scroll input',
  continuous: 'Always running regardless of scroll',
};

// ── Direction Descriptions ─────────────────────────────────

/**
 * Human-readable descriptions for each direction.
 */
export const DIRECTION_DESCRIPTIONS: Record<TimelineDirection, string> = {
  forward: 'Normal scroll-down narrative progression',
  backward: 'Scroll-up — content stays revealed',
  bidirectional: 'Responds to both directions equally',
};

// ── Duration Category Descriptions ─────────────────────────

/**
 * Human-readable descriptions for each duration category.
 */
export const DURATION_DESCRIPTIONS: Record<TimelineDurationCategory, string> = {
  extended: 'Hero reveal (1200-1500ms), closing dissolve (2000-2500ms)',
  standard: 'Content reveals (400-600ms)',
  brief: 'Breathing spaces, quick transitions (200-400ms)',
  instant: 'Zero duration, structural, reduced motion fallback',
};

// ── Duration Ranges ────────────────────────────────────────

/**
 * Approximate duration ranges for each duration category.
 * These are guidelines for future GSAP timelines.
 *
 * From DESIGN_SYSTEM §14 Motion Constraints:
 * "Maximum reveal duration: 600ms (except hero and confirmation)"
 */
export const DURATION_RANGES: Record<TimelineDurationCategory, { readonly min: number; readonly max: number }> = {
  extended: { min: 1200, max: 2500 },
  standard: { min: 400, max: 600 },
  brief: { min: 200, max: 400 },
  instant: { min: 0, max: 0 },
};

// ── Marker Type Descriptions ───────────────────────────────

/**
 * Human-readable descriptions for each marker type.
 */
export const MARKER_TYPE_DESCRIPTIONS: Record<TimelineMarkerType, string> = {
  'section-start': 'Top edge of section enters viewport',
  'section-center': 'Section center aligns with viewport center',
  'section-end': 'Bottom edge of section reaches viewport top',
  'chapter-start': 'Start of a narrative chapter within an act',
  'chapter-end': 'End of a narrative chapter',
  'act-start': 'Start of a dramatic act (prologue, act-one, etc.)',
  'act-end': 'End of a dramatic act',
  checkpoint: 'A checkpoint between critical narrative moments',
  'breathing-point': 'A breathing space pause point',
  'preload-point': 'Trigger point for asset preloading',
  'camera-cue': 'Cue for camera transition or movement',
  'analytics-cue': 'Cue for analytics event tracking',
};

// ── Sync Mode Descriptions ─────────────────────────────────

/**
 * Human-readable descriptions for each synchronization mode.
 */
export const SYNC_MODE_DESCRIPTIONS: Record<TimelineSyncMode, string> = {
  'global-progress': 'All tracks share the same scroll-driven progress',
  'narrative-locked': 'Track aligns to the narrative track progress',
  'marker-locked': 'Track aligns to a specific named marker',
  independent: 'Track has independent timing, not synchronized',
  'threshold-triggered': 'Track triggers at a specific scroll threshold',
};

// ── Interpolation Descriptions ─────────────────────────────

/**
 * Human-readable descriptions for each interpolation mode.
 */
export const INTERPOLATION_DESCRIPTIONS: Record<KeyframeInterpolation, string> = {
  linear: 'Constant rate of change — no acceleration',
  'ease-out': 'Decelerating — elements arrive with weight',
  'ease-in': 'Accelerating — elements depart with momentum',
  'ease-in-out': 'Smooth acceleration and deceleration',
  step: 'Instant jump — no interpolation between values',
  custom: 'Custom easing curve — references a named curve',
};

// ── Resource Budget Descriptions ───────────────────────────

/**
 * Human-readable descriptions for resource budget levels.
 */
export const RESOURCE_BUDGET_DESCRIPTIONS: Record<string, string> = {
  none: 'No GPU/CPU resources allocated — track disabled',
  minimal: 'Minimal resource usage — simple transforms only',
  standard: 'Standard resource usage — typical scroll-linked animations',
  generous: 'Generous resource usage — 3D rendering, particles, effects',
};

// ── Core Track Constants ───────────────────────────────────

/**
 * The narrative track — always present, always primary.
 * This is the backbone that all other tracks synchronize to.
 */
export const NARRATIVE_TRACK_ID = 'track-narrative' as const;

/**
 * All track IDs in the default timeline.
 */
export const DEFAULT_TRACK_IDS = [
  'track-narrative',
  'track-ui',
  'track-camera',
  'track-lighting',
  'track-environment',
  'track-three-d',
  'track-particle',
  'track-audio',
  'track-analytics',
  'track-accessibility',
  'track-preload',
] as const;

/**
 * All group IDs in the default timeline.
 */
export const DEFAULT_GROUP_IDS = [
  'group-visual',
  'group-3d',
  'group-infrastructure',
] as const;

// ── Type Re-exports ────────────────────────────────────────

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
};
