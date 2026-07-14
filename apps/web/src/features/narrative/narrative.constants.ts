/**
 * Narrative Constants — Centralized Section Identifiers
 *
 * From DESIGN_SYSTEM §Architecture:
 * "No magic strings. All section identifiers are constants."
 *
 * This module re-exports section IDs, categories, stages, and
 * provides derived constant arrays used throughout the narrative
 * system. Components never import SECTION_IDS directly — they
 * use these curated exports.
 *
 * Phase 5.1: Constants only — no runtime logic.
 */

import type {
  SectionId,
  SectionCategory,
  NarrativeStage,
  SectionImportance,
  ThemeVariant,
  AnimationKey,
  PreloadKey,
  TransitionName,
  ScrollParticipation,
} from './narrative.types';

import {
  SECTION_IDS,
  SECTION_CATEGORIES,
  NARRATIVE_STAGES,
  SECTION_IMPORTANCE,
  THEME_VARIANTS,
  ANIMATION_KEYS,
  PRELOAD_KEYS,
  TRANSITION_NAMES,
  SCROLL_PARTICIPATION,
} from './narrative.types';

// ── Re-exports ─────────────────────────────────────────────

export {
  SECTION_IDS,
  SECTION_CATEGORIES,
  NARRATIVE_STAGES,
  SECTION_IMPORTANCE,
  THEME_VARIANTS,
  ANIMATION_KEYS,
  PRELOAD_KEYS,
  TRANSITION_NAMES,
  SCROLL_PARTICIPATION,
};

// ── Section IDs (Ordered) ──────────────────────────────────

/**
 * All section IDs in scroll order (top to bottom).
 * This is the single source of truth for section ordering.
 */
export const ORDERED_SECTION_IDS: readonly SectionId[] = SECTION_IDS;

// ── Enabled Sections ───────────────────────────────────────

/**
 * Section IDs that are enabled by default.
 *
 * All sections are enabled at launch. Structural sections
 * (threshold, footer) are always enabled. Breathing spaces
 * are always enabled as act transitions.
 */
export const ENABLED_SECTION_IDS: readonly SectionId[] = SECTION_IDS;

// ── Category Groups ────────────────────────────────────────

/** Section IDs belonging to Act I (Invitation) */
export const ACT_ONE_SECTIONS: readonly SectionId[] = [
  'whisper',
  'atmosphere',
] as const;

/** Section IDs belonging to Act II (Experience) */
export const ACT_TWO_SECTIONS: readonly SectionId[] = [
  'hair',
  'transformation',
  'bridal',
  'spa',
  'artisans',
  'testimonials',
] as const;

/** Section IDs belonging to Act III (Commitment) */
export const ACT_THREE_SECTIONS: readonly SectionId[] = [
  'booking',
  'gift',
  'closing',
] as const;

/** Section IDs in the Prologue */
export const PROLOGUE_SECTIONS: readonly SectionId[] = [
  'threshold',
  'hero',
] as const;

/** Section IDs in the Epilogue */
export const EPILOGUE_SECTIONS: readonly SectionId[] = [
  'footer',
] as const;

// ── Transitional Sections ──────────────────────────────────

/** Breathing space section IDs — used between acts */
export const BREATHING_SPACE_IDS: readonly SectionId[] = [
  'breathing-space-arrival',
  'breathing-space-commitment',
] as const;

// ── Peak Sections ──────────────────────────────────────────

/**
 * Sections with "peak" importance — maximum animation investment.
 * From EXPERIENCE_STORYBOARD §Peak-End Rule:
 * "Hero and Closing are the most critical moments."
 */
export const PEAK_SECTIONS: readonly SectionId[] = [
  'hero',
  'closing',
] as const;

/**
 * Sections with "signature" importance — custom animation.
 * From EXPERIENCE_STORYBOARD §Scene 5:
 * "The signature moment — scroll-controlled cross-dissolve."
 */
export const SIGNATURE_SECTIONS: readonly SectionId[] = [
  'transformation',
] as const;

// ── Scroll Sections (Narrative Participants) ───────────────

/**
 * Sections that participate in the scroll-linked narrative timeline.
 * Excludes structural elements (threshold, footer) and fixed elements (navigation).
 */
export const SCROLL_SECTIONS: readonly SectionId[] = [
  'hero',
  'whisper',
  'atmosphere',
  'breathing-space-arrival',
  'hair',
  'transformation',
  'bridal',
  'spa',
  'artisans',
  'testimonials',
  'breathing-space-commitment',
  'booking',
  'gift',
  'closing',
] as const;

// ── Preload Order ──────────────────────────────────────────

/**
 * Sections with preload assets, in loading priority order.
 * First entries load earliest (during hero idle).
 */
export const PRELOAD_ORDER: readonly PreloadKey[] = [
  'hero-image',
  'atmosphere-images',
  'hair-images',
  'transformation-images',
  'bridal-images',
  'spa-images',
  'artisan-portraits',
] as const;

// ── Section Display Names ──────────────────────────────────

/**
 * Human-readable display names for each section.
 * Used in analytics dashboards and development tools.
 */
export const SECTION_DISPLAY_NAMES: Record<SectionId, string> = {
  threshold: 'The Loading Moment',
  hero: 'The Threshold',
  whisper: 'The Whisper',
  atmosphere: 'The Immersion',
  'breathing-space-arrival': 'Act I → II Transition',
  hair: 'Craft: Hair',
  transformation: 'Transformation: Color',
  bridal: 'Intimacy: Bridal',
  spa: 'Sanctuary: Spa',
  artisans: 'The Artisans',
  testimonials: 'Voices',
  'breathing-space-commitment': 'Act II → III Transition',
  booking: 'The Invitation',
  gift: 'The Gift',
  closing: 'The Promise',
  footer: 'The Credits',
};

// ── Type Re-exports ────────────────────────────────────────

export type {
  SectionId,
  SectionCategory,
  NarrativeStage,
  SectionImportance,
  ThemeVariant,
  AnimationKey,
  PreloadKey,
  TransitionName,
  ScrollParticipation,
};
