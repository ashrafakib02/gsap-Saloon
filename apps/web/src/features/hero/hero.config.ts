/**
 * Hero Feature — Configuration
 *
 * All hero parameters in one place. No magic numbers in components.
 * Components read from this config; they never hardcode values.
 *
 * From PROJECT_BLUEPRINT:
 * "Each feature is a self-contained module: component, animation config,
 *  types, entry point."
 *
 * Copy is tasteful and premium — not lorem ipsum, not "Coming Soon."
 * Every word communicates the brand: warm, considered, unhurried.
 */

import type { HeroConfig } from './hero.types';

// ── Default Hero Configuration ────────────────────────────

/**
 * The hero's default configuration.
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "One image. Full viewport. The composition is cinematic."
 *
 * From EXPERIENCE_STORYBOARD SCENE 2:
 * "Typography. Pure, beautiful typography — centered in the viewport,
 *  surrounded by generous whitespace."
 *
 * Typography decisions:
 * - Brand name: Cormorant Garamond, semi-bold, serif (voice)
 *   Per DESIGN_SYSTEM §4: "Warm, editorial, magazine-like authority"
 * - Tagline: DM Sans, light, sans-serif (function)
 *   Per DESIGN_SYSTEM §4: "Neutral but warm. Highly legible."
 * - CTA: Sentence case per VISUAL_RULES B2
 * - No exclamation marks per VISUAL_RULES B10 and L7
 */
export const HERO_DEFAULT_CONFIG: HeroConfig = {
  brandName: {
    text: 'The Sovereign Artisor',
    family: 'serif',
    weight: 600,
  },

  tagline: {
    text: 'Where artistry meets intention',
    family: 'sans',
    weight: 300,
  },

  cta: {
    label: 'Book your experience',
    href: '#booking',
    variant: 'primary',
  },

  secondaryCta: {
    label: 'Explore our craft',
    href: '#services',
    variant: 'ghost',
  },
} as const;

// ── Animation Configuration Placeholders ──────────────────

/**
 * Warm Unveiling animation parameters.
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "The image reveals itself through the Warm Reveal — our signature
 *  interaction. It fades in from 80-90% opacity. Duration: 800-1200ms."
 *
 * From DESIGN_SYSTEM §14 Motion Constraints:
 * - Maximum opacity change: 0 to 1 (never starting at less than 0.8)
 * - Maximum translation distance: 30px vertical
 * - Hero reveal: 1200-1500ms
 *
 * These are PLACEHOLDER VALUES for Phase 9 (Motion Polish).
 * They define the architecture — not the final animation.
 */
export const HERO_ANIMATION = {
  /** Warm Unveiling — the hero's signature reveal */
  warmReveal: {
    /** Starting opacity (80-90% per storyboard) */
    startOpacity: 0.85,
    /** Ending opacity */
    endOpacity: 1,
    /** Duration in ms (1200-1500ms per storyboard) */
    duration: 1200,
    /** Easing — ease-out per M3 */
    easing: 'power2.out',
    /** Maximum translation in px (30px per M5) */
    maxTranslateY: 30,
  },

  /** Content stagger delays — for word-by-word reveal */
  contentStagger: {
    /** Delay before brand name starts revealing (ms) */
    brandNameDelay: 400,
    /** Delay between each word in brand name (ms) */
    wordDelay: 80,
    /** Delay before tagline starts (after brand name) (ms) */
    taglineDelay: 300,
    /** Delay before CTA appears (after tagline) (ms) */
    ctaDelay: 200,
  },

  /** Background layers */
  background: {
    /** Duration for background color cross-fade (ms) */
    crossFadeDuration: 1000,
    /** Opacity for the warm gradient overlay */
    gradientOpacity: 0.4,
  },

  /** Reduced motion fallback — all instant */
  reducedMotion: {
    duration: 0,
    opacity: 1,
    translateY: 0,
  },
} as const;

// ── Layout Configuration ──────────────────────────────────

/**
 * Hero layout parameters.
 *
 * From DESIGN_SYSTEM §6 (Grid System):
 * "Center alignment for hero moments, single-focus statements.
 *  Communicates formality, importance, and singular focus."
 *
 * From DESIGN_SYSTEM §7 (Breakpoints):
 * - Mobile: 0-767px, single column
 * - Tablet: 768-1023px, transitional
 * - Desktop: 1024-1439px, full editorial
 * - Wide: 1440px+, expanded desktop
 */
export const HERO_LAYOUT = {
  /** Hero takes full viewport height */
  height: '100svh',

  /** Content positioning within the hero */
  contentPosition: {
    /** Horizontal alignment */
    align: 'center' as const,
    /** Vertical alignment */
    justify: 'center' as const,
  },

  /** Maximum content width for text legibility */
  maxContentWidth: '65ch',

  /** Horizontal padding — prevents content touching viewport edge (S5) */
  paddingX: {
    mobile: 'var(--spacing-social)',
    tablet: 'var(--spacing-formal)',
    desktop: 'var(--spacing-formal)',
  },

  /** Content starts below the navigation height */
  navOffset: '72px',
} as const;

// ── Image Configuration ───────────────────────────────────

/**
 * Hero image parameters.
 *
 * From DESIGN_SYSTEM §12 (Imagery):
 * I3: Hero images are 16:9 or wider
 * I7: Hero images are never cropped tight — generous headroom
 * I11: No hero image carousels — one image, composed perfectly
 *
 * From VISUAL_RULES I13:
 * "Image loading is progressive on mobile. A lightweight placeholder
 *  appears instantly; the full-resolution image replaces it."
 */
export const HERO_IMAGE = {
  /** Aspect ratio for dimension reservation (CLS prevention) */
  aspectRatio: '16 / 9',

  /** Object-fit for the hero image */
  objectFit: 'cover' as const,

  /** Object-position — centered, slightly above center for generous headroom */
  objectPosition: 'center 30%',

  /** Priority loading — hero is above the fold */
  loading: 'eager' as const,
  fetchPriority: 'high' as const,

  /** Placeholder while image loads — warm solid color, NOT shimmer (VISUAL_RULES N23) */
  placeholder: {
    type: 'color' as const,
    color: 'var(--color-surface-secondary)',
  },
} as const;

// ── Accessibility Configuration ───────────────────────────

/**
 * ARIA and accessibility configuration for the hero.
 *
 * From VISUAL_RULES AC9:
 * "Page content is accessible via screen reader landmarks."
 *
 * From VISUAL_RULES AC15:
 * "One <h1> heading per page. Only one."
 * The hero brand name IS the h1 — it's the page's primary heading.
 */
export const HERO_A11Y_CONFIG = {
  /** The hero section landmark */
  sectionRole: 'banner' as const,

  /** Brand name uses h1 — one per page (AC15) */
  headingLevel: 'h1' as const,

  /** ARIA label for the hero section */
  ariaLabel: 'Welcome to The Sovereign Artisor',

  /** Image alt text — descriptive, specific (AC11) */
  imageAlt:
    'The salon interior bathed in warm afternoon light — brass fixtures, soft linens, and the quiet luxury of a space designed for care',

  /** Live region for load state */
  ariaLive: 'polite' as const,
} as const;
