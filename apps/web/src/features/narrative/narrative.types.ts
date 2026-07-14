/**
 * Narrative Types — The Scroll-Linked Narrative Architecture
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The site follows a three-act dramatic structure:
 *  Prologue → Act I (Invitation) → Act II (Experience)
 *  → Act III (Commitment) → Epilogue."
 *
 * From EXPERIENCE_STORYBOARD §SCENE STRUCTURE:
 * "13 scenes, each with a specific emotional purpose, pacing, and motion philosophy."
 *
 * From DESIGN_SYSTEM §Architecture:
 * "Section registry pattern for centralized section metadata."
 *
 * This module defines ALL types for the narrative system.
 * No "any", no string duplication, prefer unions over literals.
 *
 * Architecture:
 *   SectionId (union) → SectionCategory (union) → NarrativeStage (union)
 *   → NarrativeSection (interface) → NarrativeRegistry (interface)
 *
 * Phase 5.1: Narrative structure — types only, no animation or scroll logic.
 */

// ── Section IDs ────────────────────────────────────────────

/**
 * All scrollable section IDs on the homepage.
 *
 * Maps 1:1 to feature folders under `features/`.
 * Each ID corresponds to a scene from the Experience Storyboard.
 *
 * Ordered by scroll position (top to bottom).
 */
export const SECTION_IDS = [
  /** Scene 0: The Loading Moment — Prologue. Branded loading screen. */
  'threshold',
  /** Scene 1: The Threshold — Hero Moment. Full-viewport establishing shot. */
  'hero',
  /** Scene 2: The Whisper — Emotional Thesis. Typography-focused word reveal. */
  'whisper',
  /** Scene 3: The Immersion — Atmospheric World. Parallax photography. */
  'atmosphere',
  /** Breathing space: Transition from Act I (Invitation) to Act II (Experience). */
  'breathing-space-arrival',
  /** Scene 4: Craft — Service Chapter: Hair. Editorial photography. */
  'hair',
  /** Scene 5: Transformation — Service Chapter: Color. Scroll-controlled cross-dissolve. */
  'transformation',
  /** Scene 6: Intimacy — Service Chapter: Bridal. Slowest section, intimate close-up. */
  'bridal',
  /** Scene 7: Sanctuary — Service Chapter: Spa. Extreme close-up, gentlest motion. */
  'spa',
  /** Scene 8: The Artisans — The People. Portrait gallery with Artisan Reveal. */
  'artisans',
  /** Scene 9: Voices — Social Proof. Text-forward, staggered cascade. */
  'testimonials',
  /** Breathing space: Transition from Act II (Experience) to Act III (Commitment). */
  'breathing-space-commitment',
  /** Scene 10: The Invitation — Booking CTA. Radical simplicity, no animation. */
  'booking',
  /** Scene 11: The Gift — Gift Experience. Medium shot, standard reveal. */
  'gift',
  /** Scene 12: The Promise — Closing Moment. 2000-2500ms dissolve, Peak-End Rule. */
  'closing',
  /** The Credits. Brand footer with contact and legal. */
  'footer',
] as const;

/** Type-safe union of all section IDs. */
export type SectionId = (typeof SECTION_IDS)[number];

// ── Section Categories ─────────────────────────────────────

/**
 * Narrative categories group sections by their dramatic function.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Three-act dramatic structure"
 */
export const SECTION_CATEGORIES = [
  /** Act I: The Invitation — emotional hooks, world-building */
  'act-one',
  /** Act II: The Experience — services, artisans, social proof */
  'act-two',
  /** Act III: The Commitment — booking, gift, closing */
  'act-three',
  /** Structural: loading, hero, footer — always present regardless of narrative */
  'structural',
  /** Transitional: breathing spaces between acts */
  'transitional',
] as const;

/** Type-safe union of section categories. */
export type SectionCategory = (typeof SECTION_CATEGORIES)[number];

// ── Narrative Stages ───────────────────────────────────────

/**
 * The three-act dramatic structure plus prologue and epilogue.
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "Prologue → Act I (Invitation) → Act II (Experience)
 *  → Act III (Commitment) → Epilogue"
 */
export const NARRATIVE_STAGES = [
  /** Pre-story: loading threshold, hero establishing shot */
  'prologue',
  /** Act I (Invitation): emotional hooks, world-building */
  'act-one',
  /** Act II (Experience): services, artisans, social proof */
  'act-two',
  /** Act III (Commitment): booking, gift, closing */
  'act-three',
  /** Post-story: footer, credits */
  'epilogue',
] as const;

/** Type-safe union of narrative stages. */
export type NarrativeStage = (typeof NARRATIVE_STAGES)[number];

// ── Section Importance ─────────────────────────────────────

/**
 * Determines animation investment and preload priority.
 *
 * From EXPERIENCE_STORYBOARD §Peak-End Rule:
 * "Hero and Closing are the most critical moments."
 *
 * From EXPERIENCE_STORYBOARD §Pacing:
 * "Signature moments get more time (Transformation, Closing)."
 */
export const SECTION_IMPORTANCE = [
  /** Peak moments: hero, closing — maximum animation investment */
  'peak',
  /** Signature moments: transformation — signature scroll effect */
  'signature',
  /** Standard: most sections — standard reveal animations */
  'standard',
  /** Structural: threshold, footer — minimal animation, always visible */
  'structural',
] as const;

/** Type-safe union of section importance levels. */
export type SectionImportance = (typeof SECTION_IMPORTANCE)[number];

// ── Theme Variants ─────────────────────────────────────────

/**
 * Visual theme variant for each section.
 *
 * From DESIGN_SYSTEM §Color:
 * "Three roles: primary, secondary, accent"
 *
 * Each section selects a theme variant that determines its
 * color palette emphasis. The design system applies these via
 * CSS custom properties.
 */
export const THEME_VARIANTS = [
  /** Warm tones — most sections */
  'warm',
  /** Deep tones — spa, closing */
  'deep',
  /** Light tones — booking, testimonials */
  'light',
  /** Rich tones — bridal, artisans */
  'rich',
] as const;

/** Type-safe union of theme variants. */
export type ThemeVariant = (typeof THEME_VARIANTS)[number];

// ── Future Animation Keys ──────────────────────────────────

/**
 * GSAP timeline keys for Phase 9.
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "The only time-linked animation is the hero reveal on initial page load."
 *
 * From TECHNICAL_ARCHITECTURE §8:
 * "GSAP loaded via dynamic import (code-split)"
 *
 * These keys map sections to their GSAP timeline definitions.
 * Populated in Phase 9 (GSAP Warm Unveiling).
 */
export const ANIMATION_KEYS = [
  /** Hero warm reveal — the only time-linked animation */
  'hero-reveal',
  /** Whisper — word-by-word fade-in */
  'whisper-reveal',
  /** Atmosphere — parallax image stack */
  'atmosphere-parallax',
  /** Standard section reveal — fade + rise */
  'standard-reveal',
  /** Artisan Reveal — portrait gallery stagger */
  'artisan-reveal',
  /** Testimonial cascade — staggered text cascade */
  'testimonial-cascade',
  /** Transformation dissolve — scroll-controlled cross-dissolve */
  'transformation-dissolve',
  /** Closing dissolve — 2000-2500ms dissolve */
  'closing-dissolve',
] as const;

/** Type-safe union of animation keys. */
export type AnimationKey = (typeof ANIMATION_KEYS)[number];

// ── Future Preload Keys ────────────────────────────────────

/**
 * Asset preload keys for Phase 11.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Preload what the visitor will need, during idle time."
 *
 * These keys map sections to their critical asset preload bundles.
 */
export const PRELOAD_KEYS = [
  /** Hero background image — loaded eagerly */
  'hero-image',
  /** Atmosphere parallax images — loaded during hero idle */
  'atmosphere-images',
  /** Hair editorial images — loaded after atmosphere */
  'hair-images',
  /** Transformation before/after — loaded after hair */
  'transformation-images',
  /** Bridal intimate close-up — loaded after transformation */
  'bridal-images',
  /** Spa extreme close-up — loaded after bridal */
  'spa-images',
  /** Artisan portraits — loaded after spa */
  'artisan-portraits',
] as const;

/** Type-safe union of preload keys. */
export type PreloadKey = (typeof PRELOAD_KEYS)[number];

// ── Transition Names ───────────────────────────────────────

/**
 * Named transition presets for Phase 9 GSAP timelines.
 *
 * From DESIGN_SYSTEM §14:
 * "Entry motions use ease-out. Exit motions use ease-in."
 */
export const TRANSITION_NAMES = [
  /** Hero warm reveal — the signature entrance */
  'warm-reveal',
  /** Fade + slight rise — standard section entrance */
  'fade-rise',
  /** Cross-dissolve between images — transformation signature */
  'cross-dissolve',
  /** Word-by-word reveal — whisper effect */
  'word-reveal',
  /** Portrait stagger — artisan gallery */
  'portrait-stagger',
  /** Text cascade — testimonial cascade */
  'text-cascade',
  /** Slow dissolve — closing moment */
  'slow-dissolve',
] as const;

/** Type-safe union of transition names. */
export type TransitionName = (typeof TRANSITION_NAMES)[number];

// ── Scroll Architecture Preparation ────────────────────────

/**
 * Scroll participation level for each section.
 *
 * From TECHNICAL_ARCHITECTURE §Scroll:
 * "Lenis smooth scroll with ScrollTrigger for scroll-linked animations."
 *
 * This type determines how each section participates in the
 * scroll-linked narrative timeline.
 */
export const SCROLL_PARTICIPATION = [
  /** Full scroll-linked — animation progress tied to scroll position */
  'scroll-linked',
  /** Trigger-only — enter/exit trigger, no scroll-linked progress */
  'trigger-only',
  /** Fixed — always visible, unaffected by scroll */
  'fixed',
  /** None — no scroll interaction */
  'none',
] as const;

/** Type-safe union of scroll participation levels. */
export type ScrollParticipation = (typeof SCROLL_PARTICIPATION)[number];

// ── Accessibility Metadata ─────────────────────────────────

/**
 * Accessibility metadata for each section.
 *
 * From DESIGN_SYSTEM §Accessibility:
 * "All images have meaningful alt text.
 *  All interactive elements have visible focus indicators."
 */
export interface AccessibilityMetadata {
  /** Accessible label for the section landmark (aria-label) */
  readonly ariaLabel: string;
  /** Optional aria-labelledby reference to heading within section */
  readonly ariaLabelledBy?: string;
  /** Heading level for the section (h2, h3) — semantic structure */
  readonly headingLevel: 2 | 3;
  /** Whether section contains landmark role override */
  readonly role?: 'banner' | 'complementary' | 'contentinfo' | 'main' | 'region';
  /** Whether reduced motion completely replaces section animation */
  readonly prefersReducedMotion: 'full' | 'partial' | 'none';
}

// ── Analytics Metadata ─────────────────────────────────────

/**
 * Analytics metadata for each section.
 *
 * From TECHNICAL_ARCHITECTURE §Analytics:
 * "Analytics abstraction layer in shared/integration."
 */
export interface AnalyticsMetadata {
  /** Unique analytics identifier for this section */
  readonly analyticsId: string;
  /** Human-readable section name for analytics dashboards */
  readonly displayName: string;
  /** Whether to track scroll depth into this section */
  readonly trackScrollDepth: boolean;
  /** Whether to track time spent in this section */
  readonly trackTimeSpent: boolean;
  /** Custom events to track (e.g., CTA clicks within section) */
  readonly customEvents?: readonly string[];
}

// ── Narrative Section Definition ───────────────────────────

/**
 * A single narrative section's complete metadata definition.
 *
 * This is the core type of the narrative registry. Each section
 * of the homepage has exactly one NarrativeSection entry that
 * defines its identity, position, appearance, and behavior.
 *
 * All fields are readonly — the registry is immutable after creation.
 */
export interface NarrativeSection {
  /** Unique section identifier — maps to feature folder name */
  readonly id: SectionId;
  /** Human-readable section title */
  readonly title: string;
  /** Scroll order position (0-based, ascending top to bottom) */
  readonly order: number;
  /** Feature folder name under `features/` */
  readonly featureFolder: string;
  /** Scene number from Experience Storyboard (null for structural/transitional) */
  readonly sceneNumber: number | null;
  /** Narrative category — groups by dramatic function */
  readonly category: SectionCategory;
  /** Narrative stage — three-act position */
  readonly stage: NarrativeStage;
  /** Section importance — determines animation investment */
  readonly importance: SectionImportance;
  /** Whether section is currently enabled in the build */
  readonly enabled: boolean;
  /** Visual theme variant */
  readonly themeVariant: ThemeVariant;

  // ── Future Phase Hooks (populated in later phases) ──

  /** GSAP timeline key — populated in Phase 9 (null = no animation) */
  readonly animationKey: AnimationKey | null;
  /** Preload bundle key — populated in Phase 11 (null = no preload) */
  readonly preloadKey: PreloadKey | null;

  // ── Scroll Architecture ──

  /** How section participates in scroll-linked narrative */
  readonly scrollParticipation: ScrollParticipation;
  /** Whether section participates in the narrative timeline */
  readonly isNarrativeParticipant: boolean;

  // ── Metadata ──

  /** Accessibility metadata */
  readonly accessibility: AccessibilityMetadata;
  /** Analytics metadata */
  readonly analytics: AnalyticsMetadata;
}

// ── Narrative Registry ─────────────────────────────────────

/**
 * The central narrative registry interface.
 *
 * Created by createNarrativeRegistry() — immutable after construction.
 * Consumed by useNarrativeRegistry() hook.
 *
 * From TECHNICAL_ARCHITECTURE §Registry Pattern:
 * "Factory functions that return typed registry objects."
 */
export interface NarrativeRegistry {
  /** Get a section by its ID */
  get(id: SectionId): NarrativeSection | undefined;
  /** Get all sections in scroll order */
  getAll(): readonly NarrativeSection[];
  /** Get sections filtered by category */
  getByCategory(category: SectionCategory): readonly NarrativeSection[];
  /** Get sections filtered by stage */
  getByStage(stage: NarrativeStage): readonly NarrativeSection[];
  /** Get only enabled sections in scroll order */
  getEnabled(): readonly NarrativeSection[];
  /** Get sections that participate in the narrative timeline */
  getNarrativeParticipants(): readonly NarrativeSection[];
  /** Get the total number of sections */
  count(): number;
  /** Check if a section ID exists */
  has(id: SectionId): boolean;
  /** Get sections ordered for preloading (by preload priority) */
  getPreloadOrder(): readonly NarrativeSection[];
}

// ── Narrative Context ──────────────────────────────────────

/**
 * The value provided by NarrativeProvider.
 *
 * Consumed by useNarrative() hook.
 * Contains the registry and derived state.
 */
export interface NarrativeContextValue {
  /** The section registry — immutable, typed */
  readonly registry: NarrativeRegistry;
  /** All sections in scroll order */
  readonly sections: readonly NarrativeSection[];
  /** Only enabled sections in scroll order */
  readonly enabledSections: readonly NarrativeSection[];
  /** Total number of enabled sections */
  readonly sectionCount: number;
  /** IDs of all sections, in scroll order */
  readonly sectionIds: readonly SectionId[];
  /** IDs of enabled sections, in scroll order */
  readonly enabledSectionIds: readonly SectionId[];
}

// ── Animation Registration (Future Phase 9) ────────────────

/**
 * Placeholder type for GSAP animation registration.
 *
 * From TECHNICAL_ARCHITECTURE §8:
 * "GSAP loaded via dynamic import (code-split)"
 *
 * Phase 9 will define the actual registration API.
 * This type prepares the shape without implementing it.
 */
export interface AnimationRegistration {
  /** The animation key from the section definition */
  readonly animationKey: AnimationKey;
  /** GSAP timeline or tween reference (Phase 9) */
  readonly timeline: unknown;
  /** Whether the animation is scroll-linked */
  readonly isScrollLinked: boolean;
}

// ── Preload Registration (Future Phase 11) ─────────────────

/**
 * Placeholder type for asset preload registration.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Preload what the visitor will need, during idle time."
 *
 * Phase 11 will define the actual preload API.
 * This type prepares the shape without implementing it.
 */
export interface PreloadRegistration {
  /** The preload key from the section definition */
  readonly preloadKey: PreloadKey;
  /** Asset URLs to preload */
  readonly assets: readonly string[];
  /** Priority: critical (hero), high (above-fold), low (below-fold) */
  readonly priority: 'critical' | 'high' | 'low';
}
