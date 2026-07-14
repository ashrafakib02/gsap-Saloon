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
 * - Named exports: Types, config, copy, and sub-components for flexibility
 * - All imports from outside the feature go through this barrel
 * - Internal imports within the feature bypass this barrel
 *
 * Phase 4.2: Added copy module exports for centralized text management.
 * All hero text is now sourced from hero.copy.ts via this barrel.
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
export { HeroCTA } from './hero-cta';
export { HeroScrollIndicator } from './hero-scroll-indicator';
export { HeroInteractionProvider, useHeroInteractionContext } from './hero-interaction-context';

// ── Hooks ──────────────────────────────────────────────────
// Exported for use in custom hero compositions or testing

export { useHeroState } from './hooks/use-hero-state';
export { useHeroViewport } from './hooks/use-hero-viewport';
export { useHeroAnimation } from './hooks/use-hero-animation';
export { useHeroAssets } from './hooks/use-hero-assets';
export { useHeroA11y } from './hooks/use-hero-a11y';
export { useHeroInteraction } from './hooks/use-hero-interaction';
export { useHoverIntent } from './hooks/use-hover-intent';

// ── Copy Module ────────────────────────────────────────────
// Centralized copy management — the single source of truth for hero text.
// External consumers should use getHeroCopy() for locale-aware access.

export {
  getHeroCopy,
  HERO_COPY_EN,
  getActiveHeroLocale,
  AVAILABLE_HERO_LOCALES,
  DEFAULT_HERO_LOCALE,
} from './hero.copy';

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

export type {
  HeroCopy,
  HeroCopyProvider,
  HeroLocale,
  HeroCoreCopy,
  HeroCtaCopy,
  HeroStateCopy,
  HeroA11yCopy,
  HeroSeoCopy,
  HeroStructuredData,
} from './hero.copy.types';

export type {
  InteractionMode,
  CTAVisualState,
  HeroCTAProps,
  HeroScrollIndicatorProps,
  HoverIntentOptions,
  UseHoverIntentReturn,
  UseHeroInteractionReturn,
  HeroInteractionContextValue,
} from './hero-interaction.types';

export type { HeroAnnouncement } from './hooks/use-hero-a11y';

export { HERO_INTERACTION } from './hero-interaction.config';

// ── Config ─────────────────────────────────────────────────
// Exported for consumers who need hero constants

export {
  HERO_DEFAULT_CONFIG,
  HERO_ANIMATION,
  HERO_LAYOUT,
  HERO_IMAGE,
  HERO_A11Y_CONFIG,
} from './hero.config';
