/**
 * Narrative Transition Constants — Centralized Transition Identifiers
 *
 * From DESIGN_SYSTEM §Architecture:
 * "No magic strings. All identifiers are constants."
 *
 * This module re-exports transition type unions and provides
 * curated constant arrays used throughout the transition system.
 *
 * Phase 5.2: Constants only — no runtime logic.
 */

import type {
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
} from './narrative-transitions.types';

import {
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
} from './narrative-transitions.types';

// ── Re-exports ─────────────────────────────────────────────

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
};

// ── Mood Descriptions ──────────────────────────────────────

/**
 * Human-readable descriptions for each transition mood.
 * Used in accessibility notes and development documentation.
 */
export const MOOD_DESCRIPTIONS: Record<TransitionMood, string> = {
  warm: 'Inviting, gentle — the feeling of entering a sunlit room',
  calm: 'Serene, peaceful — the stillness of water at dawn',
  intimate: 'Close, personal — a whispered conversation',
  energetic: 'Lively, dynamic — the moment of transformation',
  still: 'Pause, breath — the silence between musical notes',
  grand: 'Dramatic, peak — the crescendo of an orchestra',
  confident: 'Decisive, clear — a door opened with certainty',
};

// ── Speed Durations ────────────────────────────────────────

/**
 * Approximate duration ranges for each speed category.
 * These are guidelines for future GSAP timelines, not硬性 limits.
 *
 * From DESIGN_SYSTEM §14 Motion Constraints:
 * "Maximum reveal duration: 600ms (except hero and confirmation)"
 */
export const SPEED_DURATIONS: Record<TransitionSpeed, { readonly min: number; readonly max: number }> = {
  slow: { min: 1200, max: 2500 },
  normal: { min: 400, max: 600 },
  fast: { min: 200, max: 400 },
  instant: { min: 0, max: 0 },
};

// ── Priority Descriptions ──────────────────────────────────

/**
 * Human-readable descriptions for each priority level.
 */
export const PRIORITY_DESCRIPTIONS: Record<TransitionPriority, string> = {
  critical: 'Must execute — hero reveal, critical rendering path',
  high: 'Should execute — signature moments, above-fold content',
  normal: 'Execute when possible — standard content reveals',
  low: 'Execute if resources permit — below-fold, decorative',
};

// ── Transition Type Descriptions ───────────────────────────

/**
 * Human-readable descriptions for each transition type.
 */
export const TYPE_DESCRIPTIONS: Record<TransitionType, string> = {
  fade: 'Gentle opacity transition — the most common section entrance',
  dissolve: 'Slow cross-dissolve — signature moments requiring emotional weight',
  reveal: 'Fade with slight vertical rise — standard content reveal',
  'parallax-reveal': 'Parallax depth movement combined with opacity reveal',
  'word-reveal': 'Typography emerges word by word — the whisper effect',
  'portrait-stagger': 'Portrait elements stagger in — the artisan reveal',
  'text-cascade': 'Text elements cascade in sequence — social proof',
  'warm-reveal': 'The hero warm unveiling — the only time-linked animation',
  instant: 'Immediate appearance — no transition, structural',
  none: 'No transition — fixed or structural sections',
};

// ── Boundary Descriptions ──────────────────────────────────

/**
 * Human-readable descriptions for each boundary type.
 */
export const BOUNDARY_DESCRIPTIONS: Record<SectionBoundary, string> = {
  'section-start': 'Top edge of section enters viewport',
  'section-center': 'Section center aligns with viewport center',
  'section-end': 'Bottom edge of section reaches viewport top',
  'entry-boundary': 'Entering section from the section above',
  'exit-boundary': 'Leaving section toward the section below',
  breathing: 'Inside a breathing space section',
  'act-boundary': 'Crossing between narrative acts',
  'chapter-boundary': 'Crossing between chapters within an act',
};

// ── Reduced Motion Descriptions ────────────────────────────

/**
 * Human-readable descriptions for each reduced motion strategy.
 */
export const REDUCED_MOTION_DESCRIPTIONS: Record<ReducedMotionStrategy, string> = {
  none: 'Animation completely removed — content appears instantly',
  simplified: 'Duration reduced but gentle motion preserved',
  instant: 'Content appears immediately with no transition',
};

// ── Breathing Purpose Descriptions ─────────────────────────

/**
 * Human-readable descriptions for each breathing space purpose.
 */
export const BREATHING_PURPOSE_DESCRIPTIONS: Record<BreathingPurpose, string> = {
  'act-transition': 'Emotional palette cleanse between dramatic acts',
  'density-rest': 'Rest between dense service sections',
  'rhythm-break': 'Visual palate cleanser to maintain pacing rhythm',
  'emotional-reset': 'Clear emotional state before a peak moment',
  'tempo-shift': 'Prepare for a change in narrative speed',
};

// ── Type Re-exports ────────────────────────────────────────

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
};
