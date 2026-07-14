/**
 * Narrative Config — Central Section Registry
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The site follows a three-act dramatic structure."
 *
 * From TECHNICAL_ARCHITECTURE §Registry Pattern:
 * "Factory functions that return typed registry objects."
 *
 * This module creates the immutable section registry containing
 * all 16 homepage sections with their complete metadata.
 *
 * Architecture:
 *   1. SECTION_DEFINITIONS — raw data array (mutable for creation)
 *   2. createNarrativeRegistry() — factory function
 *   3. NARRATIVE_REGISTRY — singleton frozen registry
 *
 * From EXPERIENCE_STORYBOARD:
 *   Scene 0-12 → section definitions below
 *   Pacing, emotional arc, motion philosophy → encoded in metadata
 *
 * Phase 5.1: Registry structure and metadata.
 * Phase 9: animationKey values populated.
 * Phase 11: preloadKey values populated.
 */

import type {
  NarrativeSection,
  NarrativeRegistry,
  SectionId,
  SectionCategory,
  NarrativeStage,
  AccessibilityMetadata,
  AnalyticsMetadata,
} from './narrative.types';

// ── Helper: Accessibility Metadata ─────────────────────────

function accessibility(
  ariaLabel: string,
  headingLevel: 2 | 3,
  opts: Partial<Pick<AccessibilityMetadata, 'role' | 'prefersReducedMotion' | 'ariaLabelledBy'>> = {},
): AccessibilityMetadata {
  return {
    ariaLabel,
    headingLevel,
    prefersReducedMotion: opts.prefersReducedMotion ?? 'partial',
    ...(opts.role !== undefined && { role: opts.role }),
    ...(opts.ariaLabelledBy !== undefined && { ariaLabelledBy: opts.ariaLabelledBy }),
  };
}

// ── Helper: Analytics Metadata ─────────────────────────────

function analytics(
  analyticsId: string,
  displayName: string,
  opts: Partial<Pick<AnalyticsMetadata, 'trackScrollDepth' | 'trackTimeSpent' | 'customEvents'>> = {},
): AnalyticsMetadata {
  return {
    analyticsId,
    displayName,
    trackScrollDepth: opts.trackScrollDepth ?? true,
    trackTimeSpent: opts.trackTimeSpent ?? false,
    ...(opts.customEvents !== undefined && { customEvents: opts.customEvents }),
  };
}

// ── Section Definitions ────────────────────────────────────

/**
 * All 16 section definitions in scroll order.
 *
 * Each section maps to a scene from the Experience Storyboard.
 * The `order` field is the 0-based scroll position.
 *
 * Structural notes:
 * - `threshold` (Scene 0): loading screen, always visible
 * - `hero` (Scene 1): full viewport, warm reveal — the only time-linked animation
 * - `breathing-space-*`: transitional sections between acts
 * - `footer`: epilogue, always visible
 */
const SECTION_DEFINITIONS: readonly NarrativeSection[] = [
  // ═══════════════════════════════════════════════════════════
  // PROLOGUE
  // ═══════════════════════════════════════════════════════════

  {
    id: 'threshold',
    title: 'The Loading Moment',
    order: 0,
    featureFolder: 'threshold',
    sceneNumber: 0,
    category: 'structural',
    stage: 'prologue',
    importance: 'structural',
    enabled: true,
    themeVariant: 'warm',
    animationKey: null,
    preloadKey: null,
    scrollParticipation: 'none',
    isNarrativeParticipant: false,
    accessibility: accessibility(
      'Loading — The Sovereign Artisan',
      2,
      { role: 'banner', prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:loading', 'The Loading Moment', {
      trackScrollDepth: false,
      trackTimeSpent: true,
    }),
  },
  {
    id: 'hero',
    title: 'The Threshold',
    order: 1,
    featureFolder: 'hero',
    sceneNumber: 1,
    category: 'structural',
    stage: 'prologue',
    importance: 'peak',
    enabled: true,
    themeVariant: 'warm',
    animationKey: 'hero-reveal',
    preloadKey: 'hero-image',
    scrollParticipation: 'trigger-only',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'The Sovereign Artisan — Where craft meets elegance',
      2,
      { role: 'banner', prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:hero', 'The Threshold', {
      trackScrollDepth: false,
      customEvents: ['cta_click'],
    }),
  },

  // ═══════════════════════════════════════════════════════════
  // ACT I — THE INVITATION
  // ═══════════════════════════════════════════════════════════

  {
    id: 'whisper',
    title: 'The Whisper',
    order: 2,
    featureFolder: 'narrative-whisper',
    sceneNumber: 2,
    category: 'act-one',
    stage: 'act-one',
    importance: 'signature',
    enabled: true,
    themeVariant: 'warm',
    animationKey: 'whisper-reveal',
    preloadKey: null,
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Our philosophy — Every visit should feel like a homecoming',
      2,
      { prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:whisper', 'The Whisper', {
      trackTimeSpent: true,
    }),
  },
  {
    id: 'atmosphere',
    title: 'The Immersion',
    order: 3,
    featureFolder: 'atmosphere',
    sceneNumber: 3,
    category: 'act-one',
    stage: 'act-one',
    importance: 'standard',
    enabled: true,
    themeVariant: 'warm',
    animationKey: 'atmosphere-parallax',
    preloadKey: 'atmosphere-images',
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'The world of The Sovereign Artisan — sensory immersion',
      2,
      { prefersReducedMotion: 'partial' },
    ),
    analytics: analytics('section:atmosphere', 'The Immersion'),
  },

  // ═══════════════════════════════════════════════════════════
  // ACT I → ACT II TRANSITION
  // ═══════════════════════════════════════════════════════════

  {
    id: 'breathing-space-arrival',
    title: 'Act I → II Transition',
    order: 4,
    featureFolder: 'breathing-space',
    sceneNumber: null,
    category: 'transitional',
    stage: 'act-one',
    importance: 'structural',
    enabled: true,
    themeVariant: 'warm',
    animationKey: null,
    preloadKey: null,
    scrollParticipation: 'trigger-only',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Transition — entering the experience',
      3,
      { prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:transition-1', 'Act I → II Transition', {
      trackScrollDepth: false,
    }),
  },

  // ═══════════════════════════════════════════════════════════
  // ACT II — THE EXPERIENCE
  // ═══════════════════════════════════════════════════════════

  {
    id: 'hair',
    title: 'Craft: Hair',
    order: 5,
    featureFolder: 'hair',
    sceneNumber: 4,
    category: 'act-two',
    stage: 'act-two',
    importance: 'standard',
    enabled: true,
    themeVariant: 'warm',
    animationKey: 'standard-reveal',
    preloadKey: 'hair-images',
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Hair artistry — precision cutting, colour, and styling',
      2,
      { prefersReducedMotion: 'partial' },
    ),
    analytics: analytics('section:hair', 'Craft: Hair', {
      customEvents: ['service_explore'],
    }),
  },
  {
    id: 'transformation',
    title: 'Transformation: Color',
    order: 6,
    featureFolder: 'transformation',
    sceneNumber: 5,
    category: 'act-two',
    stage: 'act-two',
    importance: 'signature',
    enabled: true,
    themeVariant: 'warm',
    animationKey: 'transformation-dissolve',
    preloadKey: 'transformation-images',
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Color transformation — before and after reveals',
      2,
      { prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:transformation', 'Transformation: Color', {
      customEvents: ['before_after_view'],
    }),
  },
  {
    id: 'bridal',
    title: 'Intimacy: Bridal',
    order: 7,
    featureFolder: 'bridal',
    sceneNumber: 6,
    category: 'act-two',
    stage: 'act-two',
    importance: 'standard',
    enabled: true,
    themeVariant: 'rich',
    animationKey: 'standard-reveal',
    preloadKey: 'bridal-images',
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Bridal artistry — the most intimate ceremony',
      2,
      { prefersReducedMotion: 'partial' },
    ),
    analytics: analytics('section:bridal', 'Intimacy: Bridal', {
      customEvents: ['service_explore'],
    }),
  },
  {
    id: 'spa',
    title: 'Sanctuary: Spa',
    order: 8,
    featureFolder: 'spa',
    sceneNumber: 7,
    category: 'act-two',
    stage: 'act-two',
    importance: 'standard',
    enabled: true,
    themeVariant: 'deep',
    animationKey: 'standard-reveal',
    preloadKey: 'spa-images',
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Spa sanctuary — restoration and renewal',
      2,
      { prefersReducedMotion: 'partial' },
    ),
    analytics: analytics('section:spa', 'Sanctuary: Spa', {
      customEvents: ['service_explore'],
    }),
  },
  {
    id: 'artisans',
    title: 'The Artisans',
    order: 9,
    featureFolder: 'artisans',
    sceneNumber: 8,
    category: 'act-two',
    stage: 'act-two',
    importance: 'standard',
    enabled: true,
    themeVariant: 'rich',
    animationKey: 'artisan-reveal',
    preloadKey: 'artisan-portraits',
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Our artisans — the people behind the craft',
      2,
      { prefersReducedMotion: 'partial' },
    ),
    analytics: analytics('section:artisans', 'The Artisans', {
      trackTimeSpent: true,
    }),
  },
  {
    id: 'testimonials',
    title: 'Voices',
    order: 10,
    featureFolder: 'testimonials',
    sceneNumber: 9,
    category: 'act-two',
    stage: 'act-two',
    importance: 'standard',
    enabled: true,
    themeVariant: 'light',
    animationKey: 'testimonial-cascade',
    preloadKey: null,
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Voices — what our guests say about us',
      2,
      { prefersReducedMotion: 'partial' },
    ),
    analytics: analytics('section:testimonials', 'Voices', {
      trackTimeSpent: true,
    }),
  },

  // ═══════════════════════════════════════════════════════════
  // ACT II → ACT III TRANSITION
  // ═══════════════════════════════════════════════════════════

  {
    id: 'breathing-space-commitment',
    title: 'Act II → III Transition',
    order: 11,
    featureFolder: 'breathing-space',
    sceneNumber: null,
    category: 'transitional',
    stage: 'act-two',
    importance: 'structural',
    enabled: true,
    themeVariant: 'warm',
    animationKey: null,
    preloadKey: null,
    scrollParticipation: 'trigger-only',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Transition — moving toward commitment',
      3,
      { prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:transition-2', 'Act II → III Transition', {
      trackScrollDepth: false,
    }),
  },

  // ═══════════════════════════════════════════════════════════
  // ACT III — THE COMMITMENT
  // ═══════════════════════════════════════════════════════════

  {
    id: 'booking',
    title: 'The Invitation',
    order: 12,
    featureFolder: 'booking',
    sceneNumber: 10,
    category: 'act-three',
    stage: 'act-three',
    importance: 'peak',
    enabled: true,
    themeVariant: 'light',
    animationKey: null,
    preloadKey: null,
    scrollParticipation: 'trigger-only',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Book your experience — The Sovereign Artisan',
      2,
      { prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:booking', 'The Invitation', {
      trackScrollDepth: false,
      customEvents: ['booking_open', 'booking_complete'],
    }),
  },
  {
    id: 'gift',
    title: 'The Gift',
    order: 13,
    featureFolder: 'gift',
    sceneNumber: 11,
    category: 'act-three',
    stage: 'act-three',
    importance: 'standard',
    enabled: true,
    themeVariant: 'warm',
    animationKey: 'standard-reveal',
    preloadKey: null,
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'Gift cards — share the art of self-care',
      2,
      { prefersReducedMotion: 'partial' },
    ),
    analytics: analytics('section:gift', 'The Gift', {
      customEvents: ['gift_purchase'],
    }),
  },
  {
    id: 'closing',
    title: 'The Promise',
    order: 14,
    featureFolder: 'closing',
    sceneNumber: 12,
    category: 'act-three',
    stage: 'act-three',
    importance: 'peak',
    enabled: true,
    themeVariant: 'deep',
    animationKey: 'closing-dissolve',
    preloadKey: null,
    scrollParticipation: 'scroll-linked',
    isNarrativeParticipant: true,
    accessibility: accessibility(
      'The Promise — your moment begins here',
      2,
      { prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:closing', 'The Promise', {
      trackTimeSpent: true,
      customEvents: ['golden_return'],
    }),
  },

  // ═══════════════════════════════════════════════════════════
  // EPILOGUE
  // ═══════════════════════════════════════════════════════════

  {
    id: 'footer',
    title: 'The Credits',
    order: 15,
    featureFolder: 'footer',
    sceneNumber: null,
    category: 'structural',
    stage: 'epilogue',
    importance: 'structural',
    enabled: true,
    themeVariant: 'deep',
    animationKey: null,
    preloadKey: null,
    scrollParticipation: 'none',
    isNarrativeParticipant: false,
    accessibility: accessibility(
      'Footer — contact, social links, and legal',
      2,
      { role: 'contentinfo', prefersReducedMotion: 'full' },
    ),
    analytics: analytics('section:footer', 'The Credits', {
      trackScrollDepth: false,
    }),
  },
] as const;

// ── Registry Factory ───────────────────────────────────────

/**
 * Creates an immutable narrative section registry.
 *
 * From TECHNICAL_ARCHITECTURE §Registry Pattern:
 * "Factory functions that return typed registry objects."
 *
 * The registry is built once at module initialization time.
 * All methods are pure — no side effects, no state mutation.
 *
 * @returns A frozen NarrativeRegistry
 */
function createNarrativeRegistry(): NarrativeRegistry {
  /* Index by ID for O(1) lookups */
  const byId = new Map<SectionId, NarrativeSection>(
    SECTION_DEFINITIONS.map((s) => [s.id, s]),
  );

  /* Index by category for O(1) filtered lookups */
  const byCategory = new Map<SectionCategory, NarrativeSection[]>();
  for (const section of SECTION_DEFINITIONS) {
    const group = byCategory.get(section.category) ?? [];
    group.push(section);
    byCategory.set(section.category, group);
  }

  /* Index by stage for O(1) filtered lookups */
  const byStage = new Map<NarrativeStage, NarrativeSection[]>();
  for (const section of SECTION_DEFINITIONS) {
    const group = byStage.get(section.stage) ?? [];
    group.push(section);
    byStage.set(section.stage, group);
  }

  /* Precompute derived arrays */
  const enabledSections = SECTION_DEFINITIONS.filter((s) => s.enabled);
  const narrativeParticipants = SECTION_DEFINITIONS.filter(
    (s) => s.isNarrativeParticipant,
  );
  const preloadOrder = SECTION_DEFINITIONS.filter(
    (s) => s.preloadKey !== null,
  ).sort((a, b) => {
    /* Hero images first, then by order */
    if (a.preloadKey === 'hero-image') return -1;
    if (b.preloadKey === 'hero-image') return 1;
    return a.order - b.order;
  });

  const registry: NarrativeRegistry = {
    get(id: SectionId): NarrativeSection | undefined {
      return byId.get(id);
    },

    getAll(): readonly NarrativeSection[] {
      return SECTION_DEFINITIONS;
    },

    getByCategory(category: SectionCategory): readonly NarrativeSection[] {
      return byCategory.get(category) ?? [];
    },

    getByStage(stage: NarrativeStage): readonly NarrativeSection[] {
      return byStage.get(stage) ?? [];
    },

    getEnabled(): readonly NarrativeSection[] {
      return enabledSections;
    },

    getNarrativeParticipants(): readonly NarrativeSection[] {
      return narrativeParticipants;
    },

    count(): number {
      return SECTION_DEFINITIONS.length;
    },

    has(id: SectionId): boolean {
      return byId.has(id);
    },

    getPreloadOrder(): readonly NarrativeSection[] {
      return preloadOrder;
    },
  };

  return Object.freeze(registry);
}

// ── Singleton Registry ─────────────────────────────────────

/**
 * The singleton narrative registry.
 *
 * Created once at module load time. Frozen and immutable.
 * All hooks and components consume this instance.
 */
export const NARRATIVE_REGISTRY: NarrativeRegistry = createNarrativeRegistry();

// ── Validation (Development Only) ──────────────────────────

if (import.meta.env.DEV) {
  /* Verify all section IDs are unique */
  const ids = SECTION_DEFINITIONS.map((s) => s.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    console.error(
      '[Narrative] Duplicate section IDs detected:',
      ids.filter((id, i) => ids.indexOf(id) !== i),
    );
  }

  /* Verify orders are sequential from 0 */
  const orders = SECTION_DEFINITIONS.map((s) => s.order);
  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i) {
      console.error(
        `[Narrative] Non-sequential order at index ${i}: expected ${i}, got ${orders[i]}`,
      );
    }
  }

  /* Verify section count matches expected */
  if (SECTION_DEFINITIONS.length !== 16) {
    console.error(
      `[Narrative] Expected 16 sections, got ${SECTION_DEFINITIONS.length}`,
    );
  }
}
