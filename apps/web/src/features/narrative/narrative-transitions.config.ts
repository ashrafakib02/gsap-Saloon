/**
 * Narrative Transitions Config — Central Transition Registry
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is a narrative timeline."
 *
 * From PRODUCT_VISION §Breathing Pattern:
 * "Between any two content-dense elements, there must be
 *  breathing room proportionally larger than internal spacing."
 *
 * This module creates the immutable transition registry containing
 * all section-to-section transitions, breathing space configurations,
 * and boundary definitions.
 *
 * Architecture:
 *   1. TRANSITION_DEFINITIONS — raw metadata array
 *   2. BREATHING_SPACE_CONFIGS — breathing space definitions
 *   3. createTransitionRegistry() — factory function
 *   4. TRANSITION_REGISTRY — singleton frozen registry
 *
 * Phase 5.2: Transition structure and metadata.
 * Phase 9: animationKey values populated.
 * Phase 6: cameraKey values populated.
 */

import type {
  TransitionMetadata,
  TransitionRegistry,
  TransitionDefinition,
  TransitionType,
  TransitionMood,
  TransitionPriority,
  BreathingSpaceConfig,
  SectionBoundaryConfig,
} from './narrative-transitions.types';

import type { SectionId } from './narrative.types';

// ── Transition ID Helper ───────────────────────────────────

function transitionId(from: SectionId, to: SectionId): string {
  return `${from}→${to}`;
}

// ── Section Boundary Defaults ──────────────────────────────

/**
 * Default boundary configuration for a section.
 * Sections that don't need custom boundaries use these defaults.
 */
function defaultBoundaries(
  sectionId: SectionId,
  opts: Partial<Pick<SectionBoundaryConfig, 'entryZone' | 'activeZone' | 'exitZone' | 'hasBreathingEntry' | 'hasBreathingExit'>> = {},
): SectionBoundaryConfig {
  return {
    sectionId,
    entryZone: opts.entryZone ?? 'entry-boundary',
    activeZone: opts.activeZone ?? 'section-center',
    exitZone: opts.exitZone ?? 'exit-boundary',
    hasBreathingEntry: opts.hasBreathingEntry ?? false,
    hasBreathingExit: opts.hasBreathingExit ?? false,
  };
}

// ── Transition Definitions ─────────────────────────────────

/**
 * All 15 section-to-section transitions in scroll order.
 *
 * Each transition describes the emotional, visual, and structural
 * relationship between two consecutive sections.
 *
 * From PRODUCT_VISION §Scroll Pacing Rhythm:
 * "Slow → Slow → Medium → Medium → Quick → Still"
 */
const TRANSITION_DEFINITIONS: readonly TransitionMetadata[] = [
  // ═══════════════════════════════════════════════════════════
  // PROLOGUE TRANSITIONS
  // ═══════════════════════════════════════════════════════════

  {
    id: transitionId('threshold', 'hero'),
    from: 'threshold',
    to: 'hero',
    type: 'warm-reveal',
    direction: 'none',
    speed: 'slow',
    mood: 'grand',
    priority: 'critical',
    trigger: 'load',
    enabled: true,
    exitBoundary: 'section-end',
    entryBoundary: 'section-start',
    isActTransition: false,
    isChapterTransition: false,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'hero-reveal',
    cameraKey: null,
    preloadKey: 'hero-image',
    soundKey: null,
    analyticsKey: 'transition:hero-enter',
    accessibilityNotes: 'The hero warm reveal is the only time-linked animation. Reduced motion shows content instantly.',
    reducedMotionStrategy: 'instant',
  },

  // ═══════════════════════════════════════════════════════════
  // ACT I — THE INVITATION
  // ═══════════════════════════════════════════════════════════

  {
    id: transitionId('hero', 'whisper'),
    from: 'hero',
    to: 'whisper',
    type: 'word-reveal',
    direction: 'forward',
    speed: 'normal',
    mood: 'warm',
    priority: 'high',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: false,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'whisper-reveal',
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:whisper-enter',
    accessibilityNotes: 'Word-by-word reveal has full reduced-motion fallback — all text visible instantly.',
    reducedMotionStrategy: 'none',
  },
  {
    id: transitionId('whisper', 'atmosphere'),
    from: 'whisper',
    to: 'atmosphere',
    type: 'parallax-reveal',
    direction: 'forward',
    speed: 'normal',
    mood: 'warm',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: false,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'atmosphere-parallax',
    cameraKey: null,
    preloadKey: 'atmosphere-images',
    soundKey: null,
    analyticsKey: 'transition:atmosphere-enter',
    accessibilityNotes: 'Parallax removed under reduced motion. Content fades in normally.',
    reducedMotionStrategy: 'simplified',
  },
  {
    id: transitionId('atmosphere', 'breathing-space-arrival'),
    from: 'atmosphere',
    to: 'breathing-space-arrival',
    type: 'fade',
    direction: 'forward',
    speed: 'fast',
    mood: 'still',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'breathing',
    isActTransition: true,
    isChapterTransition: false,
    isToBreathingSpace: true,
    isFromBreathingSpace: false,
    animationKey: null,
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:act-i-end',
    accessibilityNotes: 'Breathing space — no animation under reduced motion.',
    reducedMotionStrategy: 'instant',
  },

  // ═══════════════════════════════════════════════════════════
  // ACT I → ACT II TRANSITION
  // ═══════════════════════════════════════════════════════════

  {
    id: transitionId('breathing-space-arrival', 'hair'),
    from: 'breathing-space-arrival',
    to: 'hair',
    type: 'reveal',
    direction: 'forward',
    speed: 'normal',
    mood: 'warm',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'breathing',
    entryBoundary: 'entry-boundary',
    isActTransition: true,
    isChapterTransition: false,
    isToBreathingSpace: false,
    isFromBreathingSpace: true,
    animationKey: 'standard-reveal',
    cameraKey: null,
    preloadKey: 'hair-images',
    soundKey: null,
    analyticsKey: 'transition:act-ii-begin',
    accessibilityNotes: 'Standard content reveal under reduced motion.',
    reducedMotionStrategy: 'instant',
  },

  // ═══════════════════════════════════════════════════════════
  // ACT II — THE EXPERIENCE (SERVICE CHAPTERS)
  // ═══════════════════════════════════════════════════════════

  {
    id: transitionId('hair', 'transformation'),
    from: 'hair',
    to: 'transformation',
    type: 'reveal',
    direction: 'forward',
    speed: 'normal',
    mood: 'warm',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: true,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'standard-reveal',
    cameraKey: null,
    preloadKey: 'transformation-images',
    soundKey: null,
    analyticsKey: 'transition:transformation-enter',
    accessibilityNotes: 'Standard reveal. Transformation dissolve is scroll-linked within the section.',
    reducedMotionStrategy: 'instant',
  },
  {
    id: transitionId('transformation', 'bridal'),
    from: 'transformation',
    to: 'bridal',
    type: 'dissolve',
    direction: 'forward',
    speed: 'normal',
    mood: 'intimate',
    priority: 'high',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: true,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: null,
    cameraKey: null,
    preloadKey: 'bridal-images',
    soundKey: null,
    analyticsKey: 'transition:bridal-enter',
    accessibilityNotes: 'Cross-dissolve removed under reduced motion. Bridal section appears instantly.',
    reducedMotionStrategy: 'instant',
  },
  {
    id: transitionId('bridal', 'spa'),
    from: 'bridal',
    to: 'spa',
    type: 'fade',
    direction: 'forward',
    speed: 'slow',
    mood: 'calm',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: true,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: null,
    cameraKey: null,
    preloadKey: 'spa-images',
    soundKey: null,
    analyticsKey: 'transition:spa-enter',
    accessibilityNotes: 'Slow fade into sanctuary. Instant under reduced motion.',
    reducedMotionStrategy: 'instant',
  },
  {
    id: transitionId('spa', 'artisans'),
    from: 'spa',
    to: 'artisans',
    type: 'portrait-stagger',
    direction: 'forward',
    speed: 'normal',
    mood: 'intimate',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: true,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'artisan-reveal',
    cameraKey: null,
    preloadKey: 'artisan-portraits',
    soundKey: null,
    analyticsKey: 'transition:artisans-enter',
    accessibilityNotes: 'Portrait stagger simplified to simultaneous fade under reduced motion.',
    reducedMotionStrategy: 'simplified',
  },
  {
    id: transitionId('artisans', 'testimonials'),
    from: 'artisans',
    to: 'testimonials',
    type: 'text-cascade',
    direction: 'forward',
    speed: 'normal',
    mood: 'warm',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: true,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'testimonial-cascade',
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:testimonials-enter',
    accessibilityNotes: 'Text cascade simplified to simultaneous fade under reduced motion.',
    reducedMotionStrategy: 'simplified',
  },

  // ═══════════════════════════════════════════════════════════
  // ACT II → ACT III TRANSITION
  // ═══════════════════════════════════════════════════════════

  {
    id: transitionId('testimonials', 'breathing-space-commitment'),
    from: 'testimonials',
    to: 'breathing-space-commitment',
    type: 'fade',
    direction: 'forward',
    speed: 'fast',
    mood: 'still',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'breathing',
    isActTransition: true,
    isChapterTransition: false,
    isToBreathingSpace: true,
    isFromBreathingSpace: false,
    animationKey: null,
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:act-ii-end',
    accessibilityNotes: 'Breathing space — no animation under reduced motion.',
    reducedMotionStrategy: 'instant',
  },
  {
    id: transitionId('breathing-space-commitment', 'booking'),
    from: 'breathing-space-commitment',
    to: 'booking',
    type: 'reveal',
    direction: 'forward',
    speed: 'fast',
    mood: 'confident',
    priority: 'high',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'breathing',
    entryBoundary: 'entry-boundary',
    isActTransition: true,
    isChapterTransition: false,
    isToBreathingSpace: false,
    isFromBreathingSpace: true,
    animationKey: null,
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:act-iii-begin',
    accessibilityNotes: 'Booking reveal — confident, clean. Instant under reduced motion.',
    reducedMotionStrategy: 'instant',
  },

  // ═══════════════════════════════════════════════════════════
  // ACT III — THE COMMITMENT
  // ═══════════════════════════════════════════════════════════

  {
    id: transitionId('booking', 'gift'),
    from: 'booking',
    to: 'gift',
    type: 'reveal',
    direction: 'forward',
    speed: 'normal',
    mood: 'warm',
    priority: 'normal',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: true,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'standard-reveal',
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:gift-enter',
    accessibilityNotes: 'Standard reveal under reduced motion.',
    reducedMotionStrategy: 'instant',
  },
  {
    id: transitionId('gift', 'closing'),
    from: 'gift',
    to: 'closing',
    type: 'dissolve',
    direction: 'forward',
    speed: 'slow',
    mood: 'grand',
    priority: 'critical',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'entry-boundary',
    isActTransition: false,
    isChapterTransition: false,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: 'closing-dissolve',
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:closing-enter',
    accessibilityNotes: 'The closing dissolve — 2000-2500ms, Peak-End Rule. Instant under reduced motion.',
    reducedMotionStrategy: 'instant',
  },
  {
    id: transitionId('closing', 'footer'),
    from: 'closing',
    to: 'footer',
    type: 'instant',
    direction: 'forward',
    speed: 'instant',
    mood: 'calm',
    priority: 'low',
    trigger: 'scroll',
    enabled: true,
    exitBoundary: 'exit-boundary',
    entryBoundary: 'section-start',
    isActTransition: false,
    isChapterTransition: false,
    isToBreathingSpace: false,
    isFromBreathingSpace: false,
    animationKey: null,
    cameraKey: null,
    preloadKey: null,
    soundKey: null,
    analyticsKey: 'transition:footer-enter',
    accessibilityNotes: 'Footer — structural, no transition.',
    reducedMotionStrategy: 'instant',
  },
] as const;

// ── Breathing Space Configurations ─────────────────────────

/**
 * Breathing space configurations — first-class architectural pauses.
 *
 * From PRODUCT_VISION §Breathing Pattern:
 * "Full-bleed visual (inhale) → Text section (exhale) →
 *  Detail grid (inhale) → Atmospheric spacer (exhale)"
 */
const BREATHING_SPACE_CONFIGS: readonly BreathingSpaceConfig[] = [
  {
    sectionId: 'breathing-space-arrival',
    purpose: 'act-transition',
    durationCategory: 'fast',
    precedingSection: 'atmosphere',
    followingSection: 'hair',
    entryStrategy: 'fade',
    exitStrategy: 'reveal',
    mood: 'still',
    reducedMotionStrategy: 'instant',
    futureVisualTreatment: 'Warm atmospheric fade — palette cleanse between Act I invitation and Act II experience. Gentle opacity transition with no content elements.',
  },
  {
    sectionId: 'breathing-space-commitment',
    purpose: 'act-transition',
    durationCategory: 'fast',
    precedingSection: 'testimonials',
    followingSection: 'booking',
    entryStrategy: 'fade',
    exitStrategy: 'reveal',
    mood: 'still',
    reducedMotionStrategy: 'instant',
    futureVisualTreatment: 'Clean spatial pause — shift from dense social proof to decisive booking invitation. Minimal visual elements, maximum negative space.',
  },
] as const;

// ── Registry Factory ───────────────────────────────────────

/**
 * Creates an immutable transition registry.
 *
 * Built once at module initialization. All methods are pure.
 *
 * @returns A frozen TransitionRegistry
 */
function createTransitionRegistry(): TransitionRegistry {
  /* Index by ID for O(1) lookups */
  const byId = new Map<string, TransitionMetadata>(
    TRANSITION_DEFINITIONS.map((t) => [t.id, t]),
  );

  /* Index by "from→to" key (same as id) */
  const byPair = new Map<string, TransitionMetadata>(
    TRANSITION_DEFINITIONS.map((t) => [`${t.from}→${t.to}`, t]),
  );

  /* Index entry transitions by destination section */
  const entryBySection = new Map<SectionId, TransitionMetadata>();
  for (const t of TRANSITION_DEFINITIONS) {
    entryBySection.set(t.to, t);
  }

  /* Index exit transitions by source section */
  const exitBySection = new Map<SectionId, TransitionMetadata>();
  for (const t of TRANSITION_DEFINITIONS) {
    exitBySection.set(t.from, t);
  }

  /* Index by type */
  const byType = new Map<TransitionType, TransitionMetadata[]>();
  for (const t of TRANSITION_DEFINITIONS) {
    const group = byType.get(t.type) ?? [];
    group.push(t);
    byType.set(t.type, group);
  }

  /* Index by mood */
  const byMood = new Map<TransitionMood, TransitionMetadata[]>();
  for (const t of TRANSITION_DEFINITIONS) {
    const group = byMood.get(t.mood) ?? [];
    group.push(t);
    byMood.set(t.mood, group);
  }

  /* Index by priority */
  const byPriority = new Map<TransitionPriority, TransitionMetadata[]>();
  for (const t of TRANSITION_DEFINITIONS) {
    const group = byPriority.get(t.priority) ?? [];
    group.push(t);
    byPriority.set(t.priority, group);
  }

  /* Precompute derived arrays */
  const enabledTransitions = TRANSITION_DEFINITIONS.filter((t) => t.enabled);
  const actTransitions = TRANSITION_DEFINITIONS.filter((t) => t.isActTransition);

  /* Breathing space lookup */
  const breathingSpacesById = new Map<SectionId, BreathingSpaceConfig>(
    BREATHING_SPACE_CONFIGS.map((b) => [b.sectionId, b]),
  );

  /* Default boundary config for sections not explicitly configured */
  const defaultBoundaryMap = new Map<SectionId, SectionBoundaryConfig>();

  const registry: TransitionRegistry = {
    get(id: string): TransitionMetadata | undefined {
      return byId.get(id);
    },

    getBetween(from: SectionId, to: SectionId): TransitionMetadata | undefined {
      return byPair.get(`${from}→${to}`);
    },

    getEntry(sectionId: SectionId): TransitionMetadata | undefined {
      return entryBySection.get(sectionId);
    },

    getExit(sectionId: SectionId): TransitionMetadata | undefined {
      return exitBySection.get(sectionId);
    },

    getAll(): readonly TransitionMetadata[] {
      return TRANSITION_DEFINITIONS;
    },

    getByType(type: TransitionType): readonly TransitionMetadata[] {
      return byType.get(type) ?? [];
    },

    getByMood(mood: TransitionMood): readonly TransitionMetadata[] {
      return byMood.get(mood) ?? [];
    },

    getByPriority(priority: TransitionPriority): readonly TransitionMetadata[] {
      return byPriority.get(priority) ?? [];
    },

    getEnabled(): readonly TransitionMetadata[] {
      return enabledTransitions;
    },

    getActTransitions(): readonly TransitionMetadata[] {
      return actTransitions;
    },

    getSequence(): readonly TransitionMetadata[] {
      return TRANSITION_DEFINITIONS;
    },

    getDefinition(from: SectionId, to: SectionId): TransitionDefinition | undefined {
      const metadata = byPair.get(`${from}→${to}`);
      if (!metadata) return undefined;

      const fromBoundaries = defaultBoundaryMap.get(from) ?? defaultBoundaries(from);
      const toBoundaries = defaultBoundaryMap.get(to) ?? defaultBoundaries(to);

      return { metadata, fromBoundaries, toBoundaries };
    },

    getBreathingSpaces(): readonly BreathingSpaceConfig[] {
      return BREATHING_SPACE_CONFIGS;
    },

    getBreathingSpace(sectionId: SectionId): BreathingSpaceConfig | undefined {
      return breathingSpacesById.get(sectionId);
    },

    count(): number {
      return TRANSITION_DEFINITIONS.length;
    },

    has(id: string): boolean {
      return byId.has(id);
    },
  };

  return Object.freeze(registry);
}

// ── Singleton Registry ─────────────────────────────────────

/**
 * The singleton transition registry.
 *
 * Created once at module load time. Frozen and immutable.
 */
export const TRANSITION_REGISTRY: TransitionRegistry = createTransitionRegistry();

// ── Validation (Development Only) ──────────────────────────

if (import.meta.env.DEV) {
  /* Verify all transition IDs are unique */
  const ids = TRANSITION_DEFINITIONS.map((t) => t.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    console.error(
      '[Narrative Transitions] Duplicate transition IDs:',
      ids.filter((id, i) => ids.indexOf(id) !== i),
    );
  }

  /* Verify transition count matches expected (15 transitions for 16 sections) */
  if (TRANSITION_DEFINITIONS.length !== 15) {
    console.error(
      `[Narrative Transitions] Expected 15 transitions, got ${TRANSITION_DEFINITIONS.length}`,
    );
  }

  /* Verify breathing space count matches expected */
  if (BREATHING_SPACE_CONFIGS.length !== 2) {
    console.error(
      `[Narrative Transitions] Expected 2 breathing spaces, got ${BREATHING_SPACE_CONFIGS.length}`,
    );
  }
}
