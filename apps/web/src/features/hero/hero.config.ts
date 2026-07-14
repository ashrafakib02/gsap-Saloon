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
 * Copy is sourced from hero.copy.ts — the single source of truth.
 * This config file imports that copy and formats it for component consumption.
 *
 * Architecture:
 * - hero.copy.ts → raw copy strings (locale-aware)
 * - hero.config.ts → derived config (component-ready)
 * - Components receive config via props, never import copy or config directly
 */

import type { HeroConfig, HeroVariant } from './hero.types';
import { HERO_COPY_EN } from './hero.copy';

// ── Default Hero Configuration ────────────────────────────

/**
 * The hero's default configuration — derived from HERO_COPY_EN.
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
 *
 * Copy sourced from hero.copy.ts — never hardcoded here.
 * This indirection enables locale switching without touching config.
 */
export const HERO_DEFAULT_CONFIG: HeroConfig = {
  brandName: {
    text: HERO_COPY_EN.core.headline,
    family: 'serif',
    weight: 600,
  },

  tagline: {
    text: HERO_COPY_EN.core.tagline,
    family: 'sans',
    weight: 300,
  },

  cta: {
    label: HERO_COPY_EN.primaryCta.label,
    href: HERO_COPY_EN.primaryCta.href,
    variant: 'primary',
  },

  secondaryCta: {
    label: HERO_COPY_EN.secondaryCta.label,
    href: HERO_COPY_EN.secondaryCta.href,
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
 * Hero layout parameters — responsive spatial composition.
 *
 * From DESIGN_SYSTEM §6 (Grid System):
 * "Center alignment for hero moments, single-focus statements.
 *  Communicates formality, importance, and singular focus."
 *
 * From DESIGN_SYSTEM §6 (Grid Exceptions):
 * "The hero section (which may use a centered, non-columnar
 *  composition for maximum impact)."
 *
 * From CREATIVE_DIRECTION §1.4 (Breathing Principle):
 * "Between any two content elements, the space should be
 *  proportionally larger than the internal spacing of those elements."
 *
 * From CREATIVE_DIRECTION §1.4 (Rhythm Principle):
 * "Hero sections are almost entirely space with a single focal element."
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "One image. Full viewport. The composition is cinematic —
 *  wide enough to show the space and the atmosphere, close
 *  enough to feel intimate."
 *
 * Architecture:
 * - Mobile-first responsive values keyed by HeroVariant
 * - Vertical offset via asymmetric padding for optical centering
 * - Spacing tokens map to the five-tier scale
 * - CTA layout strategy changes per breakpoint (stacked → side-by-side)
 * - Safe-area support for notched devices
 *
 * Responsive Typography (handled by global CSS in tailwind.css):
 * - Mobile (0-767px):   --text-display: 3.5rem
 * - Tablet (768-1023px): --text-display: 4.5rem
 * - Desktop (1024px+):   --text-display: 5.5rem
 * Typography scaling is CSS-driven, not JS-driven.
 * This config handles SPATIAL composition only.
 */
export const HERO_LAYOUT = {
  /** Full viewport height — the hero IS the viewport.
   *  Using svh (small viewport height) for mobile address bar compensation. */
  height: '100svh',

  /** Content alignment — centered per DESIGN_SYSTEM §6.
   *  "Center alignment for hero moments, single-focus statements." */
  contentPosition: {
    align: 'center' as const,
    justify: 'center' as const,
  },

  /**
   * Content vertical offset — asymmetric padding for optical centering.
   *
   * From CREATIVE_DIRECTION §7 Law 1:
   * "Each viewport delivers exactly one clear idea."
   *
   * Mobile/Tablet: '0' — content sits at mathematical center.
   * Desktop: '16%' — extra bottom padding pushes the visual center
   * upward to ~42% from top, creating a cinematic golden-section
   * composition. The extra space below creates visual weight that
   * draws the eye downward toward the scroll indicator.
   *
   * Implementation: applied as padding-bottom on the flex container.
   * The flex justify-center then centers within the remaining space.
   * Example: 16% bottom padding on 100vh = center at ~42vh.
   */
  contentPaddingBottom: {
    mobile: '0',
    tablet: '0',
    desktop: '16%',
  } as Record<HeroVariant, string>,

  /**
   * Maximum content width — adapts per viewport.
   *
   * From VISUAL_RULES T7:
   * "Body copy maximum line length is 65-75 characters."
   *
   * Mobile: 90vw — near-full viewport, generous margins prevent edge-touching (S5).
   * Tablet: 80ch — wider than desktop for the transitional layout.
   * Desktop: 65ch — optimal reading width for centered hero typography.
   *
   * On ultra-wide screens (> 2560px), CSS constrains further to min(65ch, 50vw).
   * From DESIGN_SYSTEM §7: "Content width scales proportionally; margins grow."
   */
  maxContentWidth: {
    mobile: '90vw',
    tablet: '80ch',
    desktop: '65ch',
  } as Record<HeroVariant, string>,

  /**
   * Horizontal padding per breakpoint — prevents edge-touching (S5).
   * "Content never touches the viewport edge."
   *
   * Mobile: social tier (1.5rem) — minimum breathing room,
   *   maximum content width on narrow screens.
   * Tablet: formal tier (3rem) — generous margins.
   * Desktop: formal tier (3rem) — generous margins.
   *   On wide screens (1440px+), the 65ch max-width naturally
   *   creates even more generous margins.
   */
  paddingX: {
    mobile: 'var(--spacing-social)',   /* 1.5rem — Tier 3 */
    tablet: 'var(--spacing-formal)',   /* 3rem — Tier 4 */
    desktop: 'var(--spacing-formal)',  /* 3rem — Tier 4 */
  } as Record<HeroVariant, string>,

  /**
   * Spacing rhythm between content elements.
   *
   * From CREATIVE_DIRECTION §1.4 (Breathing Principle):
   * "The space should be proportionally larger than the internal
   *  spacing of those elements."
   *
   * From VISUAL_RULES S2:
   * "The gap between two elements is always proportionally larger
   *  than the internal spacing within those elements."
   *
   * Headline → Tagline: personal (1rem) mobile, social (1.5rem) desktop.
   *   The headline and tagline are tightly coupled — one thought.
   * Tagline → CTA: social (1.5rem) mobile, formal (3rem) desktop.
   *   The CTA is a separate action — more breathing room.
   *
   * Creates the "breathing rhythm" from DESIGN_SYSTEM §14 Law 4:
   * "Pacing as breathing."
   */
  spacing: {
    headlineToTagline: {
      mobile: 'var(--spacing-personal)',  /* 1rem — Tier 2 */
      tablet: 'var(--spacing-social)',    /* 1.5rem — Tier 3 */
      desktop: 'var(--spacing-social)',   /* 1.5rem — Tier 3 */
    } as Record<HeroVariant, string>,
    taglineToCta: {
      mobile: 'var(--spacing-social)',    /* 1.5rem — Tier 3 */
      tablet: 'var(--spacing-formal)',    /* 3rem — Tier 4 */
      desktop: 'var(--spacing-formal)',   /* 3rem — Tier 4 */
    } as Record<HeroVariant, string>,
  },

  /**
   * CTA group layout strategy.
   *
   * From DESIGN_SYSTEM §7 (Mobile-First):
   * "Touch-first interaction (44×44px minimum targets)"
   * "Thumb-zone optimization for critical interactive elements"
   *
   * Mobile: Vertical (stacked) — each CTA gets full width,
   *   large touch targets, thumb-friendly placement.
   * Tablet/Desktop: Horizontal (side by side) — primary and
   *   secondary CTAs share a row, maintaining visual hierarchy.
   */
  ctaLayout: {
    mobile: 'vertical' as const,
    tablet: 'horizontal' as const,
    desktop: 'horizontal' as const,
  } as Record<HeroVariant, 'vertical' | 'horizontal'>,

  /**
   * CTA group gap — space between primary and secondary CTAs.
   *
   * Mobile vertical: personal (1rem) — stacked buttons need less gap.
   * Tablet/Desktop horizontal: social (1.5rem) — side-by-side needs more.
   */
  ctaGap: {
    mobile: 'var(--spacing-personal)',  /* 1rem — Tier 2 */
    tablet: 'var(--spacing-social)',    /* 1.5rem — Tier 3 */
    desktop: 'var(--spacing-social)',   /* 1.5rem — Tier 3 */
  } as Record<HeroVariant, string>,

  /**
   * CTA minimum width — ensures touch targets meet accessibility.
   *
   * From VISUAL_RULES A9:
   * "Touch targets are minimum 44×44px."
   *
   * Mobile: 100% width — full-width buttons for thumb reach.
   * Tablet/Desktop: auto — natural width, no minimum enforced.
   */
  ctaMinWidth: {
    mobile: '100%',
    tablet: 'auto',
    desktop: 'auto',
  } as Record<HeroVariant, string>,

  /**
   * Scroll indicator positioning per breakpoint.
   *
   * From DESIGN_SYSTEM §14 Law 3:
   * "Most visitors should not consciously notice the motion.
   *  They should notice the feeling."
   *
   * The scroll indicator is a subtle static cue, not animation.
   * Positioned from the bottom with safe-area awareness.
   *
   * Mobile: Compact — less room, indicator closer to edge.
   * Desktop: Generous — more breathing room below.
   */
  scrollIndicator: {
    mobile: {
      bottom: 'var(--spacing-personal)',  /* 1rem — compact on mobile */
    },
    tablet: {
      bottom: 'var(--spacing-social)',    /* 1.5rem */
    },
    desktop: {
      bottom: 'var(--spacing-formal)',    /* 3rem — generous on desktop */
    },
  } as Record<HeroVariant, { bottom: string }>,

  /**
   * Safe-area insets — for notched/rounded-corner devices.
   *
   * From VISUAL_RULES A9:
   * "Touch targets are minimum 44×44px."
   *
   * env(safe-area-inset-*) is zero when not applicable.
   * These values ensure content doesn't overlap with:
   * - Bottom home indicator (iPhone X+)
   * - Side notches on landscape mobile
   */
  safeArea: {
    bottom: 'env(safe-area-inset-bottom, 0px)',
    left: 'env(safe-area-inset-left, 0px)',
    right: 'env(safe-area-inset-right, 0px)',
  },

  /** Fixed navigation height compensation */
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

  /**
   * Object-position — centered, slightly above center for generous headroom.
   *
   * From DESIGN_SYSTEM §12 I7:
   * "Hero images are never cropped tight — generous headroom."
   *
   * Default: center 30% — generous headroom for cinematic composition.
   * Responsive overrides in hero-responsive.css adjust per viewport:
   * - Mobile portrait: center 40% — lower crop keeps subject visible.
   * - Mobile landscape: center 45% — wider view, more centered.
   * - Tablet: center 35% — transitional crop.
   *
   * CSS overrides the inline style via !important for responsive cases.
   * This value is the desktop default and source of truth.
   */
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
 *
 * Copy sourced from hero.copy.ts via HERO_COPY_EN.
 * Accessibility strings are never hardcoded in components.
 */
export const HERO_A11Y_CONFIG = {
  /** The hero section landmark */
  sectionRole: 'banner' as const,

  /** Brand name uses h1 — one per page (AC15) */
  headingLevel: 'h1' as const,

  /** ARIA label for the hero section */
  ariaLabel: HERO_COPY_EN.a11y.sectionAriaLabel,

  /** Image alt text — descriptive, specific (AC11) */
  imageAlt: HERO_COPY_EN.a11y.imageAlt,

  /** Live region for load state */
  ariaLive: HERO_COPY_EN.a11y.ariaLive,
} as const;
