/**
 * Narrative — Scroll-Linked Narrative Architecture
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The site follows a three-act dramatic structure:
 *  Prologue → Act I (Invitation) → Act II (Experience)
 *  → Act III (Commitment) → Epilogue."
 *
 * This module provides the narrative system that governs all
 * 16 scroll-driven homepage sections. Every section follows this
 * architecture.
 *
 * Public API:
 *   - NarrativeProvider: context provider (wrap at page level)
 *   - useNarrative: main context hook
 *   - useNarrativeRegistry: registry access hook
 *   - useNarrativeOrder: ordered sections hook
 *   - NARRATIVE_REGISTRY: singleton registry instance
 *   - Section constants and types
 *
 * Phase 5.1: Structure and metadata only.
 */

// ── Provider ───────────────────────────────────────────────

export { NarrativeProvider } from './narrative-context';

// ── Hooks ──────────────────────────────────────────────────

export { useNarrative } from './hooks/use-narrative';
export { useNarrativeRegistry } from './hooks/use-narrative-registry';
export { useNarrativeOrder } from './hooks/use-narrative-order';
export type { NarrativeOrderAPI } from './hooks/use-narrative-order';

// ── Registry ───────────────────────────────────────────────

export { NARRATIVE_REGISTRY } from './narrative.config';

// ── Constants ──────────────────────────────────────────────

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
  ORDERED_SECTION_IDS,
  ENABLED_SECTION_IDS,
  ACT_ONE_SECTIONS,
  ACT_TWO_SECTIONS,
  ACT_THREE_SECTIONS,
  PROLOGUE_SECTIONS,
  EPILOGUE_SECTIONS,
  BREATHING_SPACE_IDS,
  PEAK_SECTIONS,
  SIGNATURE_SECTIONS,
  SCROLL_SECTIONS,
  PRELOAD_ORDER,
  SECTION_DISPLAY_NAMES,
} from './narrative.constants';

// ── Types ──────────────────────────────────────────────────

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
  NarrativeSection,
  NarrativeRegistry,
  NarrativeContextValue,
  AccessibilityMetadata,
  AnalyticsMetadata,
  AnimationRegistration,
  PreloadRegistration,
} from './narrative.types';
