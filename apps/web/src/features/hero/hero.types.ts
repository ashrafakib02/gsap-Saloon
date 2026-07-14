/**
 * Hero Feature — Type Definitions
 *
 * From PROJECT_BLUEPRINT §Feature Inventory:
 * "F3.1: Full-Viewport Hero Image"
 * "F3.2: Hero Image Warm Reveal"
 *
 * From EXPERIENCE_STORYBOARD SCENE 1 (Threshold):
 * "Stop the scroll. Create awe. Communicate the brand's entire identity
 *  in a single, wordless frame."
 *
 * This file defines ALL types for the Hero feature module.
 * No implementation — only structural truth.
 *
 * Copy types are defined in hero.copy.types.ts.
 * This file references them for component props.
 */

import type { ReactNode } from 'react';
import { HERO_COPY_EN } from './hero.copy';

// ── Hero State ────────────────────────────────────────────

/**
 * The hero's loading lifecycle.
 *
 * From EXPERIENCE_STORYBOARD SCENE 0:
 * "The loading moment is the journey from their world to ours."
 */
export type HeroLoadState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * The hero's animation lifecycle.
 * Used by Phase 9 (Motion Polish) to drive the Warm Unveiling timeline.
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "The only time-linked animation is the hero reveal on initial page load."
 */
export type HeroAnimationState = 'waiting' | 'revealing' | 'revealed';

/**
 * The hero's responsive variant.
 * Determines layout strategy based on viewport.
 */
export type HeroVariant = 'mobile' | 'tablet' | 'desktop';

// ── Hero Configuration ────────────────────────────────────

/**
 * Complete hero configuration.
 * All visual and behavioral parameters in one place.
 *
 * From DESIGN_SYSTEM §1:
 * "Every design decision should feel warm, restrained, considered,
 *  editorial, and enduring."
 *
 * The config is derived from HERO_COPY (hero.copy.ts).
 * Components receive config via props — they never import copy directly.
 * This indirection enables:
 * - Theming (different brands using the same component)
 * - A/B testing (different copy variants)
 * - CMS integration (config loaded from API)
 */
export interface HeroConfig {
  /** Display typography for the brand name */
  readonly brandName: {
    readonly text: string;
    /** Serif typeface (Cormorant Garamond) — voice, editorial */
    readonly family: 'serif';
    readonly weight: 600;
  };

  /** Tagline — the brand thesis */
  readonly tagline: {
    readonly text: string;
    /** Sans-serif (DM Sans) — function, clarity */
    readonly family: 'sans';
    readonly weight: 300;
  };

  /** Primary call-to-action */
  readonly cta: {
    readonly label: string;
    readonly href: string;
    /** Maps to booking section anchor */
    readonly variant: 'primary';
  };

  /** Secondary navigation action */
  readonly secondaryCta: {
    readonly label: string;
    readonly href: string;
    readonly variant: 'ghost';
  };
}

/**
 * Re-export HeroCopy type for consumers who need the full copy shape.
 * Individual components should use HeroConfig (via props), not HeroCopy directly.
 * HeroCopy is used by the copy module and config derivation.
 */
export type { HeroCopy } from './hero.copy.types';

// ── Component Props ───────────────────────────────────────

/** Props for the root HeroSection component */
export interface HeroSectionProps {
  /** Override hero configuration */
  config?: Partial<HeroConfig>;
  /** Additional class names applied to the root element */
  className?: string;
}

/** Props for HeroContent — the text and CTA region */
export interface HeroContentProps {
  /** Brand name configuration */
  brandName: HeroConfig['brandName'];
  /** Tagline configuration */
  tagline: HeroConfig['tagline'];
  /** Primary CTA configuration */
  cta: HeroConfig['cta'];
  /** Secondary CTA configuration */
  secondaryCta: HeroConfig['secondaryCta'];
  /** Whether the hero has finished its loading phase */
  isReady: boolean;
}

/** Props for HeroMedia — the image/background region */
export interface HeroMediaProps {
  /** Current load state of the hero image */
  loadState: HeroLoadState;
  /** Callback when the hero image has loaded */
  onImageLoad: () => void;
  /** Callback when the hero image fails to load */
  onImageError: (error: Error) => void;
}

/** Props for HeroOverlay — composited overlay layers */
export interface HeroOverlayProps {
  /** Number of overlay layers to render */
  layers?: number;
}

/** Props for HeroBackground — the ambient background */
export interface HeroBackgroundProps {
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}

/** Props for HeroLoading — the loading threshold state */
export interface HeroLoadingProps {
  /** Whether the hero is currently loading */
  isVisible: boolean;
}

/** Props for the 3D mounting point placeholder */
export interface Hero3DMountProps {
  /** Whether the 3D feature flag is enabled */
  is3DEnabled: boolean;
  /** Whether WebGL is available */
  hasWebGL: boolean;
}

/** Props for the hero error boundary */
export interface HeroErrorBoundaryProps {
  children: ReactNode;
}

// ── Performance Boundaries ────────────────────────────────

/**
 * Performance budget constants for the hero section.
 *
 * From DESIGN_SYSTEM §Performance:
 * P1: LCP under 2.5s
 * P2: CLS under 0.1
 * P4: Total page weight under 1MB
 */
export const HERO_PERFORMANCE_BUDGET = {
  /** Maximum hero image file size (bytes) — 400KB for hero-quality WebP */
  maxImageSize: 400_000,

  /** Maximum LCP target for hero image (ms) */
  lcpTarget: 2_500,

  /** Maximum CLS contribution from hero layout (dimensionless) */
  clsBudget: 0.05,

  /** Hero image aspect ratio for dimension reservation (16:9) */
  aspectRatio: 16 / 9,

  /** Maximum hero total weight including fonts and scripts (bytes) */
  maxTotalWeight: 600_000,
} as const;

// ── Accessibility Constants ───────────────────────────────

/**
 * Accessibility constants for the hero section.
 *
 * From VISUAL_RULES AC1-AC15 and DESIGN_SYSTEM §15.
 *
 * Copy sourced from hero.copy.ts via HERO_COPY_EN.
 * These constants are convenience re-exports for components
 * that need a11y values without importing the full copy module.
 */
export const HERO_A11Y = {
  /** Landmark label for the hero section */
  landmarkLabel: `Hero — ${HERO_COPY_EN.a11y.sectionAriaLabel}`,

  /** Screen reader text for the hero image */
  imageAlt: HERO_COPY_EN.a11y.imageAlt,

  /** aria-live region for load state announcements */
  liveRegion: HERO_COPY_EN.a11y.ariaLive,

  /** Skip target — hero content is the first section */
  skipTarget: 'main-content',
} as const;
