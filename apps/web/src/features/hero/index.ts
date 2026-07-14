/**
 * Hero Feature — Public API
 *
 * From PROJECT_BLUEPRINT §Feature Architecture:
 * "Each feature exports a clean public API from its index.
 *  Import from '@/features/hero', never from individual files."
 *
 * From DESIGN_SYSTEM §16 (Naming):
 * "Feature directories are named for their domain.
 *  Components within are named for their responsibility."
 *
 * Architecture:
 * - Default export: HeroSection (the composition)
 * - Named exports: Types, config, and sub-components for flexibility
 * - All imports from outside the feature go through this barrel
 * - Internal imports within the feature bypass this barrel
 */

// ── Composition ────────────────────────────────────────────

export { HeroSection, HeroSection as default } from './hero';

// ── Sub-Components ─────────────────────────────────────────
// Exported for advanced composition (e.g., custom hero layouts)

export { HeroBackground } from './hero-background';
export { HeroContent } from './hero-content';
export { HeroMedia } from './hero-media';
export { HeroOverlay } from './hero-overlay';
export { HeroLoading } from './hero-loading';
export { Hero3DMount } from './hero-3d-mount';
export { HeroErrorBoundary } from './hero-error-boundary';

// ── Hooks ──────────────────────────────────────────────────
// Exported for use in custom hero compositions or testing

export { useHeroState } from './hooks/use-hero-state';
export { useHeroViewport } from './hooks/use-hero-viewport';
export { useHeroAnimation } from './hooks/use-hero-animation';
export { useHeroAssets } from './hooks/use-hero-assets';

// ── Types ──────────────────────────────────────────────────
// Exported for consumers who need to reference hero types

export type {
  HeroConfig,
  HeroVariant,
  HeroLoadState,
  HeroAnimationState,
  HeroSectionProps,
  HeroBackgroundProps,
  HeroContentProps,
  HeroMediaProps,
  HeroOverlayProps,
  HeroLoadingProps,
  Hero3DMountProps,
} from './hero.types';

// ── Config ─────────────────────────────────────────────────
// Exported for consumers who need hero constants

export {
  HERO_DEFAULT_CONFIG,
  HERO_ANIMATION,
  HERO_LAYOUT,
  HERO_IMAGE,
  HERO_A11Y_CONFIG,
} from './hero.config';
